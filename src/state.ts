import {Evidence, EvidenceState, Ghost, GhostState} from "./models.js";

export const evidenceStates: Record<Evidence, EvidenceState> = Object.fromEntries(
    Object.values(Evidence).map((e) => [e, EvidenceState.UNKNOWN])
) as Record<Evidence, EvidenceState>;

export const ghostStates: Record<Ghost, GhostState> = Object.fromEntries(
    Object.values(Ghost).map((g) => [g, GhostState.DEFAULT])
) as Record<Ghost, GhostState>;

export const sharedState = {
    activeGhostHighlight: null as Ghost | null,
};
