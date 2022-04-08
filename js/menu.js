export function handleMenu() {
    const hamburgerIcon = document.querySelector('.hamburger');
    const menuNavElement = document.querySelector('.menuNav');
    const closeElement = document.querySelector('.close');

    menuNavElement.classList.add('hidden');

    hamburgerIcon.addEventListener('click', () => {
        menuNavElement.classList.toggle('hidden');
    });
    closeElement.addEventListener('click', () => {
        menuNavElement.classList.add('hidden');
    });
}