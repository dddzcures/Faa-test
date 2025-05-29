const questions = [
    {
        question: "What is the purpose of a torque wrench?",
        answers: ["To loosen bolts", "To apply specific torque to a fastener", "To tighten screws"],
        correct: 1
    },
    {
        question: "What does anodizing prevent?",
        answers: ["Rust", "Fatigue", "Corrosion"],
        correct: 2
    }
];

let currentQuestionIndex = 0;
let computedCount = 0;

function updateCounter() {
    const counterElement = document.getElementById('counter');
    counterElement.textContent = `${computedCount}/${questions.length}`;
}

function loadQuestion() {
    const questionEl = document.getElementById('question');
    const answersEl = document.getElementById('answers');

    const current = questions[currentQuestionIndex];
    questionEl.textContent = current.question;
    answersEl.innerHTML = "";

    current.answers.forEach((answer, index) => {
        const btn = document.createElement("button");
        btn.textContent = answer;
        btn.onclick = () => {
            computedCount++;
            updateCounter();
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                questionEl.textContent = "Quiz Completed!";
                answersEl.innerHTML = "";
            }
        };
        answersEl.appendChild(btn);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCounter();
    loadQuestion();
});
