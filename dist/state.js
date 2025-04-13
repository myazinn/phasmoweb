import { Evidence } from './enums';
export const evidenceStates = Object.fromEntries(Object.values(Evidence).map((e) => [e, 'unknown']));
export let highlightedEvidence = new Set();
export let activeGhostHighlight = null;
export function toggleEvidenceState(state) {
    if (state === 'unknown')
        return 'yes';
    if (state === 'yes')
        return 'no';
    return 'unknown';
}
