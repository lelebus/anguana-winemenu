if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    on_ready();
} else {
    document.addEventListener('DOMContentLoaded', on_ready);
}

data = null;
carousel = [];

function on_ready() {
    console.log("STARTED");

    var carousel = $.get('carousel');
    var slides = carousel.getElementsByClassName('slide');
    var currentSlide = 0;

    (async () => {
        var waitTime = 5000;

        while (true) {
            currentSlide++;
            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }
            
            await sleep(waitTime/2);

            activateCurrentSlide(currentSlide, slides);
            var previousSlide = setPrevSlide(currentSlide, slides);

            await sleep(waitTime/2).then(() => { resetSlide(previousSlide, slides) } );
        }
    })();
}

function setPrevSlide(currentSlide, slides) {
    var prev = currentSlide - 1;
    if (prev < 0) {
        prev = slides.length - 1;
    }
    slide = slides[prev]
    resetSlide(slide)
    toggleClass(slide, 'prev');

    return slide;
}

function activateCurrentSlide(currentSlide, slides) {
    slide = slides[currentSlide]
    resetSlide(slide)
    toggleClass(slide, 'active');
}

function resetSlide(slide) {
    classes = slide.className;
    if (classes.includes('prev')) {
        toggleClass(slide, 'prev');
    }
    if (classes.includes('active')) {
        toggleClass(slide, 'active');
    }
}

function toggleClass(el, className) {
    el.classList.toggle(className);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}