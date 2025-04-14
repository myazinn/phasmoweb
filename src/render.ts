import {Evidence, EvidenceState, Ghost, GhostState} from './models.js';
import {evidenceLabels, ghostLabels} from './labels.js';
import {ghostEvidences} from './evidences.js';

const evidenceStates: Record<Evidence, EvidenceState> = Object.fromEntries(
    Object.values(Evidence).map((e) => [e, EvidenceState.UNKNOWN])
) as Record<Evidence, EvidenceState>;

const ghostStates: Record<Ghost, GhostState> = Object.fromEntries(
    Object.values(Ghost).map((g) => [g, GhostState.DEFAULT])
) as Record<Ghost, GhostState>;

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

        setEvidenceStyle(button, evidenceStates[evidence], isEvidenceHighlighted(evidence));

        button.addEventListener('click', () => {
            evidenceStates[evidence] = toggleEvidenceState(evidenceStates[evidence]);
            setEvidenceStyle(button, evidenceStates[evidence], isEvidenceHighlighted(evidence));
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
        if (ghostStates[ghost] !== GhostState.EXCLUDED) {
            for (const ev of ghostEvidences[ghost]) {
                availableEvidences.add(ev);
            }
        }
    }

    const unavailable = new Set(
        Object.values(Evidence).filter((e) => !availableEvidences.has(e) && evidenceStates[e] !== EvidenceState.NO)
    );

    renderEvidenceCheckboxes(renderGhosts, unavailable);

    Object.values(Ghost).forEach((ghost) => {
        const div = document.createElement('div');
        div.textContent = ghostLabels[ghost];
        div.className = 'ghost';

        const state = ghostStates[ghost];

        const match = possibleGhosts.includes(ghost) && state !== GhostState.EXCLUDED;

        if (!match) div.classList.add('hidden');
        if (state === GhostState.HIGHLIGHTED) div.classList.add('highlight');
        if (state === GhostState.EXCLUDED) div.classList.add('excluded');

        div.addEventListener('click', () => {
            ghostStates[ghost] = toggleGhostState(state);
            renderGhosts();
        });

        ghostList.appendChild(div);
    });
}

function toggleEvidenceState(state: EvidenceState): EvidenceState {
    if (state === EvidenceState.UNKNOWN) return EvidenceState.YES;
    if (state === EvidenceState.YES) return EvidenceState.NO;
    return EvidenceState.UNKNOWN;
}

function toggleGhostState(state: GhostState): GhostState {
    if (state === GhostState.DEFAULT) return GhostState.HIGHLIGHTED;
    if (state === GhostState.HIGHLIGHTED) return GhostState.EXCLUDED;
    return GhostState.DEFAULT;
}

function isEvidenceHighlighted(evidence: Evidence): boolean {
    return Object.entries(ghostStates).some(
        ([ghost, state]) =>
            state === GhostState.HIGHLIGHTED &&
            ghostEvidences[ghost as Ghost].includes(evidence)
    );
}

function setEvidenceStyle(el: HTMLElement, state: EvidenceState, highlighted: boolean) {
    el.classList.remove('evidence-unknown', 'evidence-yes', 'evidence-no');

    if (state === EvidenceState.UNKNOWN) el.classList.add('evidence-unknown');
    if (state === EvidenceState.YES) el.classList.add('evidence-yes');
    if (state === EvidenceState.NO) el.classList.add('evidence-no');

    if (highlighted) {
        el.classList.add('highlight');
    } else {
        el.classList.remove('highlight');
    }
}