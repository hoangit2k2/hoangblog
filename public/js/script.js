document.addEventListener('DOMContentLoaded', function () {
    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.querySelectorAll('.searchInput');
    const searchClose = document.querySelectorAll('.searchClose');

    for (var index = 0; index < allButtons.length; index++) {
        allButtons[index].addEventListener('click', function () {
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        });
    }
    searchClose.addEventListener('click', function () {
        searchBar.style.visibility = 'hidden';
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', 'fa;se');
        searchInput.focus();
    });
});
