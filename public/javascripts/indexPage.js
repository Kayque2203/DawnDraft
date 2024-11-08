const btn = document.getElementsByClassName('btnDropDown')[0];
const header = document.getElementsByTagName('header')[0]
const nav = document.getElementsByTagName('nav')[0]
const boxTituloLogo = document.getElementsByClassName('boxTituloLogo')[0];

btn.addEventListener('click', () => {
    if (btn.style.display != 'none' || btn.style.display != '' )
    {
        if (nav.style.display == 'none' || nav.style.display == '' )
        {
            header.style.display = "flex"
            header.style.flexDirection = "column";
            nav.style.display = "flex";
            nav.style.flexDirection = "column";
            nav.style.alignItems = "center";
            boxTituloLogo.style.justifyContent = "center";
        }
        else
        {
            header.style.flexDirection = "row";
            nav.style.display = 'none';
            nav.style.flexDirection = "row";
            nav.alignItems = "";
            boxTituloLogo.style.justifyContent = "";
        }
    }
})
