import { Evidence, EvidenceState, Ghost, GhostState } from "./models.js";
export const evidenceStates = Object.fromEntries(Object.values(Evidence).map((e) => [e, EvidenceState.UNKNOWN]));
export const ghostStates = Object.fromEntries(Object.values(Ghost).map((g) => [g, GhostState.DEFAULT]));
export const sharedState = {
    activeGhostHighlight: null,
};
