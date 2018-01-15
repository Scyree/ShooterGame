function setName() {
    var nicknameValue;
    localStorage.setItem(nicknameValue, document.getElementById("nickname-input").value);
    document.getElementById("inserNickname").submit();
}

function greetPlayer() {
    var nicknameValue = localStorage.getItem(nicknameValue);
    document.getElementById("greetings").innerHTML = "Glad to meet you " + nicknameValue + ", Let's save the world!";
}