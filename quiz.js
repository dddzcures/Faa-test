let allQuestions = [];
let selectedQuestions = [];
let currentQuestionIndex = 0;
let incorrectCount = 0;
let hasCountedIncorrect = false;

async function loadQuestions() {
  const res = await fetch('full_quiz_questions.json');
  allQuestions = await res.json();
  selectedQuestions = getRandomQuestions(allQuestions, 60);
  showQuestion();
}

function getRandomQuestions(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function showQuestion() {
  hasCountedIncorrect = false;
  const questionObj = selectedQuestions[currentQuestionIndex];
  document.getElementById("progress").innerText = `${currentQuestionIndex + 1}/60`;
  document.getElementById("question-container").innerText = questionObj["Rephrased Question"];

  const figureMatch = questionObj["Rephrased Question"].match(/figure (\d+)/i);
  if (figureMatch) {
    const figureNum = figureMatch[1];
    const imgPath = `figures/general_${figureNum}.png`;
    const imgEl = document.getElementById("figure-img");
    imgEl.src = imgPath;
    imgEl.style.display = "block";
  } else {
    document.getElementById("figure-img").style.display = "none";
  }

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  const choices = ["A", "B", "C"];
  const shuffledChoices = choices.sort(() => 0.5 - Math.random());

  shuffledChoices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = questionObj[`Answer ${choice}`];
    btn.onclick = () => handleAnswer(choice, questionObj["Correct Choice"], btn);
    answersDiv.appendChild(btn);
  });
}

function handleAnswer(selected, correct, button) {
  if (selected === correct) {
    // Disable all buttons before advancing
    document.querySelectorAll("#answers button").forEach(btn => btn.disabled = true);

    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < selectedQuestions.length) {
        showQuestion();
      } else {
        showFinalScore();
      }
    }, 500);
  } else {
    if (!hasCountedIncorrect) {
      incorrectCount++;
      hasCountedIncorrect = true;
    }
    button.classList.add("incorrect");
    button.disabled = true;
  }
}

function showFinalScore() {
  const correctCount = selectedQuestions.length - incorrectCount;
  const scorePercent = Math.round((correctCount / selectedQuestions.length) * 100);

  document.getElementById("quiz-container").innerHTML = `
    <h2>Quiz Complete!</h2>
    <p>You answered ${correctCount} out of ${selectedQuestions.length} questions correctly.</p>
    <p>Incorrect answers: ${incorrectCount}</p>
    <p>Your Score: ${scorePercent}%</p>
  `;
}

loadQuestions();