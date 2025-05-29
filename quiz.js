let questions = [];
let currentQuestionIndex = 0;
let score = 0;

async function loadCSV() {
  const response = await fetch('Rephrased_FAA_Questions.csv');
  const text = await response.text();
  const lines = text.split('\n').slice(1).filter(line => line.trim() !== '');

  const allQuestions = lines.map(line => {
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const question = parts[1]?.replace(/"/g, '') || '';
    const answers = [
      { key: 'A', text: parts[2]?.replace(/"/g, '') || '' },
      { key: 'B', text: parts[3]?.replace(/"/g, '') || '' },
      { key: 'C', text: parts[4]?.replace(/"/g, '') || '' },
    ];
    const correct = parts[5]?.trim();
    return { question, answers, correct };
  });

  questions = shuffle(allQuestions).slice(0, 60);
  showQuestion();
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function extractFigureNumber(text) {
  const match = text.match(/Refer to Figure (\d+)/i);
  return match ? match[1] : null;
}

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    document.getElementById('question-box').style.display = 'none';
    document.getElementById('result-box').style.display = 'block';
    document.getElementById('final-score').textContent = `You scored ${score} out of ${questions.length}`;
    return;
  }

  const questionObj = questions[currentQuestionIndex];
  const questionText = document.getElementById('question-text');
  const form = document.getElementById('options-form');
  const feedback = document.getElementById('feedback');

  feedback.textContent = '';
  form.innerHTML = '';

  const figureNumber = extractFigureNumber(questionObj.question);
  let htmlContent = `<p>${questionObj.question}</p>`;

  if (figureNumber) {
    const imgPath = `figures/general_${figureNumber}.png`;
    htmlContent += `<img src="\${imgPath}" alt="Figure \${figureNumber}" class="figure-image" />`;
  }

  questionText.innerHTML = htmlContent;

  const shuffledAnswers = shuffle([...questionObj.answers]);

  shuffledAnswers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer.text;
    button.className = 'answer-button';
    button.onclick = () => {
      const isCorrect = answer.key === questionObj.correct;
      if (isCorrect) {
        score++;
        feedback.textContent = '✅ Correct!';
      } else {
        const correctAnswer = questionObj.answers.find(a => a.key === questionObj.correct);
        feedback.textContent = `❌ Incorrect. Correct answer: \${questionObj.correct} - \${correctAnswer?.text}`;
      }

      document.querySelectorAll('.answer-button').forEach(btn => btn.disabled = true);

      setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
      }, 1500);
    };

    form.appendChild(button);
  });
}

loadCSV();
