import {Evidence, EvidenceState, Ghost} from './models.js';
import {evidenceLabels, ghostLabels} from './labels.js';
import {ghostEvidences} from './evidences.js';

const evidenceStates: Record<Evidence, EvidenceState> = Object.fromEntries(
    Object.values(Evidence).map((e) => [e, EvidenceState.UNKNOWN])
) as Record<Evidence, EvidenceState>;

let highlightedEvidence = new Set<Evidence>();
let activeGhostHighlight: Ghost | null = null;

export function renderEvidenceCheckboxes(
    updateCallback: () => void,
    unavailableEvidences: Set<Evidence> = new Set()
) {
    const container = document.getElementById('evidence-container')!;
    container.innerHTML = '';

    Object.values(Evidence).forEach((evidence) => {
        const button = document.createElement('div');
        button.className = 'evidence-button';
        button.dataset.evidence = evidence;
        button.textContent = evidenceLabels[evidence];
        if (unavailableEvidences.has(evidence)) {
            button.classList.add('disabled-evidence');
        }
        setEvidenceStyle(button, evidenceStates[evidence]);

        button.addEventListener('click', () => {
            evidenceStates[evidence] = toggleEvidenceState(evidenceStates[evidence]);
            setEvidenceStyle(button, evidenceStates[evidence]);
            updateCallback();
        });

        container.appendChild(button);
    });
}

export function renderGhosts() {
    const ghostList = document.getElementById('ghost-list')!;
    ghostList.innerHTML = '';

    const include = Object.entries(evidenceStates)
        .filter(([, state]) => state === EvidenceState.YES)
        .map(([e]) => e as Evidence);

    const exclude = Object.entries(evidenceStates)
        .filter(([, state]) => state === EvidenceState.NO)
        .map(([e]) => e as Evidence);

    const possibleGhosts = Object.values(Ghost).filter((ghost) => {
        const evidences = ghostEvidences[ghost];
        const hasAllIncluded = include.every((e) => evidences.includes(e));
        const hasAnyExcluded = exclude.some((e) => evidences.includes(e));
        return hasAllIncluded && !hasAnyExcluded;
    });

    const availableEvidences = new Set<Evidence>();
    for (const ghost of possibleGhosts) {
        for (const ev of ghostEvidences[ghost]) {
            availableEvidences.add(ev);
        }
    }

    const unavailable = new Set(
        Object.values(Evidence).filter((e) => !availableEvidences.has(e) && !exclude.includes(e))
    );

    renderEvidenceCheckboxes(renderGhosts, unavailable);

    for (const ghost of Object.values(Ghost)) {
        const div = document.createElement('div');
        div.textContent = ghostLabels[ghost];
        div.className = 'ghost';

        const evidences = ghostEvidences[ghost];
        const match = possibleGhosts.includes(ghost);

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

            renderGhosts();
        });

        ghostList.appendChild(div);
    }
}

function toggleEvidenceState(state: EvidenceState): EvidenceState {
    if (state === EvidenceState.UNKNOWN) return EvidenceState.YES;
    if (state === EvidenceState.YES) return EvidenceState.NO;
    return EvidenceState.UNKNOWN;
}

function setEvidenceStyle(el: HTMLElement, state: EvidenceState) {
    el.classList.remove('evidence-unknown', 'evidence-yes', 'evidence-no');

    if (state === EvidenceState.UNKNOWN) el.classList.add('evidence-unknown');
    if (state === EvidenceState.YES) el.classList.add('evidence-yes');
    if (state === EvidenceState.NO) el.classList.add('evidence-no');

    if (highlightedEvidence.has(el.dataset.evidence as Evidence)) {
        el.classList.add('highlight');
    } else {
        el.classList.remove('highlight');
    }
}