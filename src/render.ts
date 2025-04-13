import {Evidence, Ghost} from './models.js';
import {evidenceLabels, ghostLabels} from './labels.js';
import {ghostEvidences} from './evidences.js';

export type EvidenceState = 'unknown' | 'yes' | 'no';

export const evidenceStates: Record<Evidence, EvidenceState> = Object.fromEntries(
    Object.values(Evidence).map((e) => [e, 'unknown'])
) as Record<Evidence, EvidenceState>;

export let highlightedEvidence = new Set<Evidence>();
export let activeGhostHighlight: Ghost | null = null;

export function toggleEvidenceState(state: EvidenceState): EvidenceState {
    if (state === 'unknown') return 'yes';
    if (state === 'yes') return 'no';
    return 'unknown';
}

export function renderEvidenceCheckboxes(updateCallback: () => void) {
    const container = document.getElementById('evidence-container')!;
    container.innerHTML = '';

    Object.values(Evidence).forEach((evidence) => {
        const button = document.createElement('div');
        button.className = 'evidence-button';
        button.dataset.evidence = evidence;
        button.textContent = evidenceLabels[evidence];
        setEvidenceStyle(button, evidenceStates[evidence]);

        button.addEventListener('click', () => {
            evidenceStates[evidence] = toggleEvidenceState(evidenceStates[evidence]);
            setEvidenceStyle(button, evidenceStates[evidence]);
            updateCallback();
        });

        container.appendChild(button);
    });
}

function setEvidenceStyle(el: HTMLElement, state: 'unknown' | 'yes' | 'no') {
    el.classList.remove('evidence-unknown', 'evidence-yes', 'evidence-no');

    if (state === 'unknown') el.classList.add('evidence-unknown');
    if (state === 'yes') el.classList.add('evidence-yes');
    if (state === 'no') el.classList.add('evidence-no');

    if (highlightedEvidence.has(el.dataset.evidence as Evidence)) {
        el.classList.add('highlight');
    } else {
        el.classList.remove('highlight');
    }
}

export function renderGhosts() {
    const ghostList = document.getElementById('ghost-list')!;
    ghostList.innerHTML = '';

    const include = Object.entries(evidenceStates)
        .filter(([, state]) => state === 'yes')
        .map(([e]) => e as Evidence);

    const exclude = Object.entries(evidenceStates)
        .filter(([, state]) => state === 'no')
        .map(([e]) => e as Evidence);

    Object.values(Ghost).forEach((ghost) => {
        const div = document.createElement('div');
        div.textContent = ghostLabels[ghost];
        div.className = 'ghost';

        const evidences = ghostEvidences[ghost];
        const hasAllIncluded = include.every((e) => evidences.includes(e));
        const hasAnyExcluded = exclude.some((e) => evidences.includes(e));
        const match = hasAllIncluded && !hasAnyExcluded;

        if (!match) div.classList.add('hidden');
        if (activeGhostHighlight === ghost) div.classList.add('highlight');

        div.addEventListener('click', () => {
            if (activeGhostHighlight === ghost) {
                highlightedEvidence.clear();
                activeGhostHighlight = null;
            } else {
                highlightedEvidence = new Set(evidences);
                activeGhostHighlight = ghost;
            }
            renderEvidenceCheckboxes(renderGhosts);
            renderGhosts();
        });

        ghostList.appendChild(div);
    });
}
