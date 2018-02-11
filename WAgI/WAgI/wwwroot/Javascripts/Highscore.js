var firstRow = document.getElementById("h_rank_1");
var leftButton = document.getElementById("stanga");

leftButton.addEventListener("click", function () {
    firstRow.insertAdjacentHTML('beforeend', 'testing 123');
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'http://localhost:51664/Home/Highscore/PlayerList/2');

    ourRequest.onload = function () {
        var ourData = JSON.parse(ourRequest.responseText);

        renderHTML(ourData);
    }

    ourRequest.send();
});

function renderHTML(data) {
    firstRow.insertAdjacentHTML('beforeend', 'testing 123');
}
