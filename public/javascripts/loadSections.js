const observador = new IntersectionObserver( entries => {
    entries[0].target.classList.add('hidenOff');
} );

Array.from(document.querySelectorAll('.hiden')).forEach( element => {
    console.log(element)
    observador.observe(element);
});
