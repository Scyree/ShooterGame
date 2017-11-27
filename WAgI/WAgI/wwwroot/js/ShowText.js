function show(target) {
    var inputs = document.getElementsByClassName('TextZone');
    console.log(document.getElementById(target));
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i] === document.getElementById(target)) {
            inputs[i].style.display = 'block';
        } else {
            inputs[i].style.display = 'none';
        }
    }

    document.getElementById(target).style.display = 'block';
}
function hide(target) {
    document.getElementById(target).style.display = 'none';
    document.getElementById("clickMeId").style.display = 'block';
}