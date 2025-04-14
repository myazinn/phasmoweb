import {renderEvidenceCheckboxes, renderGhosts} from './render.js';
import {setupModal} from "./modal.js";

function setup() {
    setupModal();
    renderEvidenceCheckboxes(renderGhosts);
    renderGhosts();
}

window.addEventListener('DOMContentLoaded', setup);