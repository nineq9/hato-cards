// Isolated AI/Data v0.1 semantic guards.
// These helpers validate common-contract invariants before future CARDS/LIVE/DIVE integration.

export function validateDiveRelationSemantics(relation, { diveNodes = [], claims = [] } = {}) {
  if (!relation || typeof relation !== 'object') {
    throw new Error('DIVE relation is required');
  }

  if (relation.relationType === 'historically_similar_to') {
    if (relation.semanticClass !== 'contextual') {
      throw new Error('historically_similar_to must be contextual');
    }
  }

  if (relation.relationType !== 'confirms') return true;

  if (relation.semanticClass !== 'evidentiary') {
    throw new Error('confirms must use semanticClass=evidentiary');
  }
  if (!Array.isArray(relation.evidenceIds) || relation.evidenceIds.length === 0) {
    throw new Error('confirms requires evidenceIds');
  }

  // v0.1 is deliberately strict: a `confirms` edge must point to a Claim node
  // whose underlying Claim has already been confirmed by the non-AI Verification
  // layer. AI relation generation cannot create confirmation by itself.
  const targetNode = diveNodes.find((node) => node.id === relation.toNodeId);
  if (!targetNode || targetNode.nodeType !== 'claim') {
    throw new Error('confirms must target a claim node in v0.1');
  }

  const claimRefs = (targetNode.backingRefs || []).filter((ref) => ref.type === 'claim');
  if (claimRefs.length === 0) {
    throw new Error('confirms target claim node must retain a backing Claim reference');
  }

  const confirmedClaim = claimRefs.some((ref) => {
    const claim = claims.find((candidate) => candidate.id === ref.id);
    return claim?.verification?.state === 'confirmed' && claim?.verification?.decidedBy !== 'not_assessed';
  });

  if (!confirmedClaim) {
    throw new Error('confirms requires an already-confirmed underlying Claim; AI output cannot establish confirmation');
  }

  return true;
}
