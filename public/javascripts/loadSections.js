const observador = new IntersectionObserver( entries => {
    entries[0].target.style.opacity="1"
} );

Array.from(document.querySelectorAll('.hiden')).forEach( element => {
    observador.observe(element);
});