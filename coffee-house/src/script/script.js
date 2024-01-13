/*Burger menu button behavior*/
const btn = document.getElementById('burger-menu__button');
const nav = document.querySelector('.nav-bar__navigation');

btn.addEventListener("click", () => {
  btn.querySelectorAll("span").forEach((span) => span.classList.toggle("open"));
  nav.classList.toggle("show");
});

nav.querySelectorAll("a").forEach((link) =>{
    link.addEventListener("click", () => {
        btn.querySelectorAll("span").forEach((span) => span.classList.toggle("open"));
        nav.classList.toggle("show");
    });
});