var slideIndex = 1;
var slides = document.getElementsByClassName("slides");
var i;

//for (i = 0; i < slides.length; i++) {
 //   slides[i].style.display = "none";
//}

function plusSlides(value) {
    showSlides(slideIndex += value);
}

function showSlides(n) {
    
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    
    slides[slideIndex - 1].style.display = "block";
}