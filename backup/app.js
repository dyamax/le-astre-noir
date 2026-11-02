const d = document;

var navigation = d.querySelector('.burger-menu');
var flScrnMnu = d.querySelector('.flScrnMnu');

navigation.addEventListener('click', function () {
    flScrnMnu.classList.add('fsm-on');
    flScrnMnu.style.zIndex = '999';
    Array.from(flScrnMnu.children).forEach(child => {
        child.style.opacity = '1';
    });
    console.log(flScrnMnu.classList);
});
flScrnMnu.addEventListener('click', function () {
    flScrnMnu.classList.remove('fsm-on');
    flScrnMnu.style.zIndex = '-999';
    Array.from(flScrnMnu.children).forEach(child => {
        child.style.opacity = '0';
    });
});

// main flow //
const MainFlowStr1 = d.querySelector('.fls1');
const MainFlowStr2 = d.querySelector('.fls2');
const smDiv = d.querySelector('#s-mDiv');
const mainHeader = d.querySelector('#mainHeader');
const mainCanva = d.querySelector('#main-canva');

const obsMains = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.backgroundPosition = 'right 70% top 90%';
            smDiv.style.display = 'block';

            smDiv.style.animation = 'smd 1s ease-in-out';
            mainHeader.style.animation = 'mainHeader .3s linear';

            mainHeader.style.animationDelay = '.5s';
            
            smDiv.style.animationFillMode = 'both';
            mainHeader.style.animationFillMode = 'both';

            mainCanva.style.opacity = '1';
        } else {
            entry.target.style.backgroundPosition = 'right 200% top 90%';
            smDiv.style.display = 'none';
            
            smDiv.style.animation = 'smd-inverse 1s ease-in-out';
            mainHeader.style.animation = 'mainHeader-inverse .3s linear';

            mainHeader.style.animationDelay = '0s';
            
            smDiv.style.animationFillMode = 'both';
            mainHeader.style.animationFillMode = 'both';

            mainCanva.style.opacity = '0';
        }
    })
}, { threshold: 0.2 })
const obsMFS2 = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.backgroundPosition = 'left 70% top 90%';
        } else {
            entry.target.style.backgroundPosition = 'left 200% top 90%';            
        }
    })
}, { threshold: 0.2 })

obsMains.observe(MainFlowStr1);
obsMFS2.observe(MainFlowStr2);

// cards' interval interaction //
const cardContainer = d.querySelector('.card-container');
const contentBG = d.querySelector('.content-bg');

let quantity = 9;
let nextAngle = 360 / quantity;
let count = 0;
let isMouseOver = false;

setInterval(() => {
    if (!isMouseOver) {
        count -= nextAngle;
    }
    cardContainer.style.transform = `perspective(2000px) translateX(-5vw) rotateY(${count}deg)`;
}, 4000);

let card = cardContainer.children;

cardContainer.addEventListener('mouseenter', () => {
    isMouseOver = true;
});
cardContainer.addEventListener('mouseleave', () => {
    isMouseOver = false;
});