const d = document

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

window.addEventListener('scroll', function() {
    if (this.window.scrollY > 0) {
        tmodelOFF();
    } else if (this.window.scrollY < this.window.innerHeight) {
        // tmodelON();
    };
});

// flow columns ////////////////////////////////////////////////
const flowElements = document.querySelectorAll('.flow-str');

const classMap = ['fls1', 'fls2', 'fls3', 'fls4'];

const observers = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        var i = Array.from(flowElements).indexOf(entry.target);

        if (entry.isIntersecting) {
            if (i !== -1) {
                entry.target.classList.add(classMap[i]);
            }
        } else {
            entry.target.classList.remove(classMap[i]);
        }
    });
}, { threshold: 0.7 });

flowElements.forEach(element => observers.observe(element));
