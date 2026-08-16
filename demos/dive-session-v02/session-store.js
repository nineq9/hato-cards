(() => {
  'use strict';
  const DB_NAME = 'kawasemi-dive-session-v02';
  const DB_VERSION = 1;
  const STORE = 'sessions';

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  class DiveSessionStore {
    constructor() { this.db = null; this.testBacking = window.__DIVE_TEST_PERSIST__ || null; }
    async init() {
      if (this.testBacking) return;
      if (this.db) return;
      this.db = await new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath:'id' });
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    async put(session) {
      await this.init();
      const record = clone(session);
      if (this.testBacking) { this.testBacking.set(record.id, record); return clone(record); }
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(record);
        tx.oncomplete = () => resolve(record);
        tx.onerror = () => reject(tx.error);
      });
    }
    async get(id) {
      await this.init();
      if (this.testBacking) { const v=this.testBacking.get(id); return v ? clone(v) : null; }
      return new Promise((resolve, reject) => {
        const req = this.db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
        req.onsuccess = () => resolve(req.result ? clone(req.result) : null);
        req.onerror = () => reject(req.error);
      });
    }
    async all() {
      await this.init();
      if (this.testBacking) return [...this.testBacking.values()].map(clone).sort((a,b)=>b.lastActiveAt.localeCompare(a.lastActiveAt));
      return new Promise((resolve, reject) => {
        const req = this.db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
        req.onsuccess = () => resolve((req.result || []).map(clone).sort((a,b) => b.lastActiveAt.localeCompare(a.lastActiveAt)));
        req.onerror = () => reject(req.error);
      });
    }
    async clear() {
      await this.init();
      if (this.testBacking) { this.testBacking.clear(); return; }
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).clear();
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    }
  }

  window.DiveSessionStore = DiveSessionStore;
})();
