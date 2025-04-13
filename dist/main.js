import { renderEvidenceCheckboxes, renderGhosts } from './render.js';
function setup() {
    renderEvidenceCheckboxes(renderGhosts);
    renderGhosts();
}
window.addEventListener('DOMContentLoaded', setup);
