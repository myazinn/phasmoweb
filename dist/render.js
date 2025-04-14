import { Evidence, EvidenceState, Ghost, GhostState } from './models.js';
import { evidenceLabels, ghostLabels } from './labels.js';
import { ghostEvidences } from './evidences.js';
import { ghostDescriptions } from './descriptions.js';
import { showModal } from "./modal.js";
import { evidenceStates, ghostStates, sharedState } from "./state.js";
export function renderEvidenceCheckboxes(updateCallback, unavailableEvidences = new Set()) {
    const container = document.getElementById('evidence-container');
    container.innerHTML = '';
    Object.values(Evidence).forEach((evidence) => {
        const button = document.createElement('div');
        button.dataset.evidence = evidence;
        button.textContent = evidenceLabels[evidence];
        setEvidenceStyle(button, evidence, unavailableEvidences);
        button.addEventListener('click', () => {
            evidenceStates[evidence] = toggleEvidenceState(evidenceStates[evidence]);
            setEvidenceStyle(button, evidence, unavailableEvidences);
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
    const order = [EvidenceState.UNKNOWN, EvidenceState.YES, EvidenceState.NO];
    return order[(order.indexOf(state) + 1) % order.length];
}
function toggleGhostState(state) {
    const order = [GhostState.DEFAULT, GhostState.HIGHLIGHTED, GhostState.EXCLUDED];
    return order[(order.indexOf(state) + 1) % order.length];
}
function isEvidenceHighlighted(evidence) {
    const ghost = sharedState.activeGhostHighlight;
    if (!ghost)
        return false;
    return ghostEvidences[ghost].includes(evidence);
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
    labelSpan.className = 'ghost-name';
    labelSpan.textContent = ghostLabels[ghost];
    const infoDiv = document.createElement('div');
    infoDiv.className = 'ghost-info-button';
    infoDiv.textContent = 'Инфо';
    infoDiv.title = 'Описание';
    infoDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        showGhostDescription(ghost);
    });
    div.appendChild(labelSpan);
    div.appendChild(infoDiv);
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
        if (nextState === GhostState.EXCLUDED && ghost === sharedState.activeGhostHighlight) {
            sharedState.activeGhostHighlight = null;
        }
        if (nextState === GhostState.HIGHLIGHTED && ghost !== sharedState.activeGhostHighlight) {
            if (sharedState.activeGhostHighlight) {
                ghostStates[sharedState.activeGhostHighlight] = GhostState.DEFAULT;
            }
            sharedState.activeGhostHighlight = ghost;
        }
        ghostStates[ghost] = nextState;
        renderGhosts();
    });
    return div;
}
function showGhostDescription(ghost) {
    showModal(ghostDescriptions[ghost]);
}
function setEvidenceStyle(el, evidence, unavailableEvidences) {
    el.className = 'evidence-button';
    el.classList.remove('evidence-unknown', 'evidence-yes', 'evidence-no', 'evidence-highlight', 'evidence-disabled');
    const state = evidenceStates[evidence];
    if (state === EvidenceState.UNKNOWN)
        el.classList.add('evidence-unknown');
    if (state === EvidenceState.YES)
        el.classList.add('evidence-yes');
    if (state === EvidenceState.NO)
        el.classList.add('evidence-no');
    if (isEvidenceHighlighted(evidence))
        el.classList.add('evidence-highlight');
    if (unavailableEvidences.has(evidence))
        el.classList.add('evidence-disabled');
}
