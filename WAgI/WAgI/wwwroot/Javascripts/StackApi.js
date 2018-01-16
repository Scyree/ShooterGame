var jsonObject;
var score = 0;
exit();

function modifyValues() {
    var nicknameValue = localStorage.getItem(nicknameValue);
    document.getElementById("value").value = score;
    document.getElementById("nickname").value = nicknameValue;
}

function getDataFromStack() {
    var xhttp = new XMLHttpRequest();
    var url = 'https://api.stackexchange.com/2.2/questions?order=desc&min=50&sort=votes&site=stackoverflow&filter=!-MH(KhGYaqaAAasg*y_lk4jwR)js3H_LP&key=RYr8RGC7N)4ZYWFkts)EnQ((';

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            jsonObject = JSON.parse(this.responseText);
            getContent();
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

function getContent() {
    var answers = new Array();
    var question = getANormalQuestion(jsonObject);

    answers.push(getTheBestAnswerForGivenQuestion(question));
    answers.push(getARandomAnswer(getANormalQuestion(jsonObject)));
    answers.push(getARandomAnswer(getANormalQuestion(jsonObject)));

    var newAnswers = swapRandomElements(answers);

    document.getElementById("question").innerHTML = question.body;

    document.getElementById("answer1").innerHTML = newAnswers[0].body;
    document.getElementById("answer1").value = newAnswers[0].score;

    document.getElementById("answer2").innerHTML = newAnswers[1].body;
    document.getElementById("answer2").value = newAnswers[1].score;

    document.getElementById("answer3").innerHTML = newAnswers[2].body;
    document.getElementById("answer3").value = newAnswers[2].score;
}

function getRandomNumber(number) {
    return Math.floor(Math.random() * number);
}

function getANormalLengthQuestion(question) {
    if (question.length > 3000) return false;
    return true;
}

function getANormalQuestion(jsonObject) {
    var check = true;
    var randomQuestionIndex;
    var questionBody;

    while (check) {
            randomQuestionIndex = getRandomNumber(Object.keys(jsonObject.items).length);
            questionBody = jsonObject.items[randomQuestionIndex].body;

            if (getANormalLengthQuestion(questionBody)) {
                check = false;
            }
    }

    return jsonObject.items[randomQuestionIndex];
}

function getANormalLengthAnswer(answer) {
    if (answer.length > 1000) return false;
    return true;
}

function getTheBestAnswerForGivenQuestion(question) {
    var max = -1000;
    var correctAnswers = new Array();
    var position;

    for (var index = 0; index < Object.keys(question.answers).length; ++index) {
        if (getANormalLengthAnswer(question.answers[index].body)) {
            correctAnswers.push(question.answers[index]);
        }
    }

    for (var index = 0; index < correctAnswers.length; ++index) {
        if (max < correctAnswers[index].score) {
                max = correctAnswers[index].score;
                position = index;
        }
    }

    return correctAnswers[position];
}

function getARandomAnswer(question) {
    var check = true;
    var randomAnswerIndex;
    var answerBody;

    while (check) {
            randomAnswerIndex = getRandomNumber(Object.keys(question.answers).length);
            answerBody = question.answers[randomAnswerIndex].body;

        if (getANormalLengthAnswer(answerBody)) {
            check = false;
        }
    }

    return question.answers[randomAnswerIndex];
}

function swapRandomElements(array) {
    var count = 0;

    while (count <= 5) {
        var firstValue = getRandomNumber(array.length);
        var secondValue = getRandomNumber(array.length);
        var value = array[firstValue];
        array[firstValue] = array[secondValue];
        array[secondValue] = value;
        ++count;
    }

    return array;
}

function getScore(value) {
    score += value;
    console.log(score);
}

function shareScore() {
    FB.init({
        appId: '379381419123532',
        xfbml: true,
        version: 'v2.11'
    });

    FB.login(function() {
        FB.api('/me/feed', 'post', {
            message: "My StackInvaders Score is: " + score + "!\nChallenge me at:",
            link: "https://github.com/Scyree/ShooterGame/blob/master/ShooterGame/Images/bg.png?raw=true"
        });
    }, {scope: 'publish_actions' });
}

function exit() {
    document.onkeydown = function (event) {
        if (event.keyCode == 27) {
            if (confirm('Are you sure that you want to exit?')) {
                saveScore();
            }
        }
    };
}

function saveScore() {
    modifyValues();
    document.getElementById("insertValues").submit();
}