import { Evidence, EvidenceState, Ghost, GhostState } from './models.js';
import { evidenceLabels, ghostLabels } from './labels.js';
import { ghostEvidences } from './evidences.js';
import { ghostDescriptions } from './descriptions.js';
const evidenceStates = Object.fromEntries(Object.values(Evidence).map((e) => [e, EvidenceState.UNKNOWN]));
const ghostStates = Object.fromEntries(Object.values(Ghost).map((g) => [g, GhostState.DEFAULT]));
const modal = document.getElementById('modal');
const modalText = document.getElementById('modal-text');
const modalClose = document.getElementById('modal-close');
const modalContent = document.querySelector('.modal-content');
modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
});
modal.addEventListener('click', (e) => {
    if (!modalContent.contains(e.target)) {
        modal.classList.add('hidden');
    }
});
let activeGhostHighlight = null;
export function renderEvidenceCheckboxes(updateCallback, unavailableEvidences = new Set()) {
    const container = document.getElementById('evidence-container');
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
    const ghostList = document.getElementById('ghost-list');
    ghostList.innerHTML = '';
    const possibleGhosts = findPossibleGhosts();
    const availableEvidences = findAvailableEvidences(possibleGhosts);
    const unavailableEvidences = Object.values(Evidence).filter((e) => !availableEvidences.has(e) && evidenceStates[e] !== EvidenceState.NO);
    renderEvidenceCheckboxes(renderGhosts, new Set(unavailableEvidences));
    Object.values(Ghost).forEach((ghost) => {
        const div = createGhostRow(ghost, possibleGhosts);
        ghostList.appendChild(div);
    });
}
function toggleEvidenceState(state) {
    if (state === EvidenceState.UNKNOWN)
        return EvidenceState.YES;
    if (state === EvidenceState.YES)
        return EvidenceState.NO;
    return EvidenceState.UNKNOWN;
}
function toggleGhostState(state) {
    if (state === GhostState.DEFAULT)
        return GhostState.HIGHLIGHTED;
    if (state === GhostState.HIGHLIGHTED)
        return GhostState.EXCLUDED;
    return GhostState.DEFAULT;
}
function isEvidenceHighlighted(evidence) {
    return Object.entries(ghostStates).some(([ghost, state]) => state === GhostState.HIGHLIGHTED &&
        ghostEvidences[ghost].includes(evidence));
}
function findPossibleGhosts() {
    const include = Object.entries(evidenceStates)
        .filter(([, state]) => state === EvidenceState.YES)
        .map(([e]) => e);
    const exclude = Object.entries(evidenceStates)
        .filter(([, state]) => state === EvidenceState.NO)
        .map(([e]) => e);
    return Object.values(Ghost).filter((ghost) => {
        const evidences = ghostEvidences[ghost];
        const hasAllIncluded = include.every((e) => evidences.includes(e));
        const hasAnyExcluded = exclude.some((e) => evidences.includes(e));
        return hasAllIncluded && !hasAnyExcluded;
    });
}
function findAvailableEvidences(possibleGhosts) {
    const evidences = new Set();
    for (const ghost of possibleGhosts) {
        if (ghostStates[ghost] !== GhostState.EXCLUDED) {
            for (const ev of ghostEvidences[ghost]) {
                evidences.add(ev);
            }
        }
    }
    return evidences;
}
function createGhostRow(ghost, possibleGhosts) {
    const div = document.createElement('div');
    div.className = 'ghost';
    const labelSpan = document.createElement('span');
    labelSpan.textContent = ghostLabels[ghost];
    labelSpan.style.marginRight = '0.5rem';
    const infoButton = document.createElement('button');
    infoButton.textContent = '?';
    infoButton.className = 'info-button';
    infoButton.title = 'Описание';
    infoButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showGhostDescription(ghost);
    });
    div.appendChild(labelSpan);
    div.appendChild(infoButton);
    const state = ghostStates[ghost];
    const match = possibleGhosts.includes(ghost) && state !== GhostState.EXCLUDED;
    if (!match)
        div.classList.add('hidden');
    if (state === GhostState.HIGHLIGHTED)
        div.classList.add('highlight');
    if (state === GhostState.EXCLUDED)
        div.classList.add('excluded');
    div.addEventListener('click', () => {
        const nextState = toggleGhostState(state);
        if (nextState === GhostState.EXCLUDED && ghost === activeGhostHighlight) {
            activeGhostHighlight = null;
        }
        if (nextState === GhostState.HIGHLIGHTED && ghost !== activeGhostHighlight) {
            if (activeGhostHighlight) {
                ghostStates[activeGhostHighlight] = GhostState.DEFAULT;
            }
            activeGhostHighlight = ghost;
        }
        ghostStates[ghost] = nextState;
        renderGhosts();
    });
    return div;
}
function showGhostDescription(ghost) {
    modalText.textContent = ghostDescriptions[ghost];
    modal.classList.remove('hidden');
}
function setEvidenceStyle(el, state, highlighted) {
    el.classList.remove('evidence-unknown', 'evidence-yes', 'evidence-no');
    if (state === EvidenceState.UNKNOWN)
        el.classList.add('evidence-unknown');
    if (state === EvidenceState.YES)
        el.classList.add('evidence-yes');
    if (state === EvidenceState.NO)
        el.classList.add('evidence-no');
    if (highlighted) {
        el.classList.add('highlight');
    }
    else {
        el.classList.remove('highlight');
    }
}
