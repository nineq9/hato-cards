(() => {
  'use strict';
  const clone = v => JSON.parse(JSON.stringify(v));
  const nowIso = () => new Date().toISOString();
  const uid = prefix => `${prefix}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2,8)}`;

  class DiveSessionEngine {
    constructor(store, explorer) {
      this.store = store;
      this.explorer = explorer;
      this.session = null;
      this.draft = false;
      this.activeStartedAt = null;
    }
    async createFromAnchor(anchor) {
      const root = uid('step');
      this.session = {
        id:uid('session'), anchor:clone(anchor), startedAt:nowIso(), lastActiveAt:nowIso(), activeDurationMs:0,
        currentStepId:root,
        steps:[{id:root,parentStepId:null,nodeId:'event',viaRelationId:null,openedAt:nowIso()}],
        savedDiscoveries:[], openQuestions:[], state:'active'
      };
      this.draft = true;
      return this.session;
    }
    async resume(sessionId) {
      const found = await this.store.get(sessionId);
      if (!found) return null;
      this.session = found;
      this.draft = false;
      this.session.state = 'active';
      await this.persist(true);
      return this.session;
    }
    currentStep() { return this.session?.steps.find(s=>s.id===this.session.currentStepId) || null; }
    currentNode() { const s=this.currentStep(); return s ? this.explorer.getNode(s.nodeId) : null; }
    parentStep(step=this.currentStep()) { return step?.parentStepId ? this.session.steps.find(s=>s.id===step.parentStepId) : null; }
    trailSteps() {
      if (!this.session) return [];
      const chain=[]; let s=this.currentStep();
      while(s){ chain.unshift(s); s=s.parentStepId ? this.session.steps.find(x=>x.id===s.parentStepId) : null; }
      return chain;
    }
    childrenOf(stepId) { return this.session ? this.session.steps.filter(s=>s.parentStepId===stepId) : []; }
    activate() { if (this.session && this.activeStartedAt===null && !document.hidden) this.activeStartedAt=performance.now(); }
    deactivate() {
      if (this.session && this.activeStartedAt!==null) {
        this.session.activeDurationMs += Math.max(0, performance.now()-this.activeStartedAt);
        this.activeStartedAt=null;
      }
    }
    async persist(force=false) {
      if(!this.session) return;
      this.deactivate();
      this.session.lastActiveAt=nowIso();
      if(force || !this.draft){ await this.store.put(this.session); this.draft=false; }
    }
    async move(relation) {
      if(!this.session) return null;
      const parent=this.currentStep();
      const step={id:uid('step'),parentStepId:parent.id,nodeId:relation.toNodeId,viaRelationId:relation.id,openedAt:nowIso()};
      this.session.steps.push(step); this.session.currentStepId=step.id; this.session.state='active';
      await this.persist(true); return step;
    }
    async back() {
      const p=this.parentStep(); if(!p) return null;
      this.session.currentStepId=p.id; await this.persist(true); return p;
    }
    async jump(stepId) {
      if(!this.session?.steps.some(s=>s.id===stepId)) return null;
      this.session.currentStepId=stepId; await this.persist(true); return this.currentStep();
    }
    async saveCurrentDiscovery() {
      if(!this.session) return null;
      const step=this.currentStep(), rel=step.viaRelationId?this.explorer.getRelation(step.viaRelationId):null, node=this.currentNode();
      const existing=this.session.savedDiscoveries.find(d=>d.routeStepId===step.id && d.relationId===(rel?.id||null));
      if(existing) return existing;
      const d={id:uid('discovery'),sessionId:this.session.id,nodeId:node.id,relationId:rel?.id||null,savedAt:nowIso(),routeStepId:step.id,sourceIds:rel?.sourceIds||node.sourceIds||[],evidenceIds:[]};
      this.session.savedDiscoveries.push(d); await this.persist(true); return d;
    }
    async keepOpenQuestion(text) {
      if(!this.session || !text.trim()) return null;
      const node=this.currentNode(), step=this.currentStep();
      const q={id:uid('question'),sessionId:this.session.id,text:text.trim(),createdAt:nowIso(),linkedNodeIds:[node.id],linkedRelationIds:step.viaRelationId?[step.viaRelationId]:[],state:'open'};
      this.session.openQuestions.push(q); await this.persist(true); return q;
    }
    async pause() { if(!this.session) return; this.session.state='paused'; await this.persist(true); }
    snapshot() { return this.session ? clone(this.session) : null; }
  }
  window.DiveSessionEngine = DiveSessionEngine;
})();
