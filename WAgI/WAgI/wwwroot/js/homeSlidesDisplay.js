var slideIndex = 1;
var slides = document.getElementsByClassName("slides");
var i;

slides[0].style.display = "block";
for (i = 1; i < slides.length - 1; i++) {
    slides[i].style.display = "none";
}

function plusSlides(value) {
    showSlides(slideIndex += value);
}

function showSlides(n) {

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    
    slides[slideIndex - 1].style.display = "block";
}