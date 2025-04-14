export function setupModal() {
    modalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    modal.addEventListener('click', (e) => {
        if (!modalContent.contains(e.target)) {
            modal.classList.add('hidden');
        }
    });
}
export function showModal(text) {
    modalText.textContent = text;
    modal.classList.remove('hidden');
}
const modal = document.getElementById('modal');
const modalText = document.getElementById('modal-text');
const modalClose = document.getElementById('modal-close');
const modalContent = document.querySelector('.modal-content');
if (!modal)
    throw new Error('Modal element not found');
