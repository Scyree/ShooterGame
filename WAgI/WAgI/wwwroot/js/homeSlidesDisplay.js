var slideIndex = 1;
var slides = document.getElementsByClassName("slides");

function plusSlides(value) {
    showSlides(slideIndex += value);
}

function showSlides(n) {
    var i;
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    
    slides[slideIndex - 1].style.display = "block";
}