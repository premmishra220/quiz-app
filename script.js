const quizData = [
  {
      question: "What is the capital of France?",
      a: "Berlin",
      b: "Madrid",
      c: "Paris",
      d: "Rome",
      correct: "c",
  },
  {
      question: "Which planet is known as the 'Red Planet'?",
      a: "Venus",
      b: "Mars",
      c: "Jupiter",
      d: "Saturn",
      correct: "b",
  },
  {
      question: "What is the chemical symbol for water?",
      a: "Wo",
      b: "Wa",
      c: "H2O",
      d: "HO2",
      correct: "c",
  },
  {
      question: "Who painted the Mona Lisa?",
      a: "Vincent van Gogh",
      b: "Pablo Picasso",
      c: "Leonardo da Vinci",
      d: "Michelangelo",
      correct: "c",
  },
];

const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submit");
const answerEls = document.querySelectorAll(".answer");
const quizContainer = document.querySelector(".quiz-container");
const resultsContainer = document.querySelector(".results-container");
const finalScoreEl = document.getElementById("final-score");
const totalQuestionsEl = document.getElementById("total-questions");
const restartBtn = document.getElementById("restart");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");

let currentQuiz = 0;
let score = 0;
let timeLeft = 15; // Time in seconds per question
let timerInterval;

loadQuiz();
startTimer();

function loadQuiz() {
  deselectAnswers();
  const currentQuizData = quizData[currentQuiz];
  questionEl.innerText = currentQuizData.question;
  a_text.innerText = currentQuizData.a;
  b_text.innerText = currentQuizData.b;
  c_text.innerText = currentQuizData.c;
  d_text.innerText = currentQuizData.d;
}

function deselectAnswers() {
  answerEls.forEach((answerEl) => (answerEl.checked = false));
}

function getSelected() {
  let answer;
  answerEls.forEach((answerEl) => {
      if (answerEl.checked) {
          answer = answerEl.id;
      }
  });
  return answer;
}

function startTimer() {
  clearInterval(timerInterval); // Clear any existing interval
  timeLeft = 15;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft < 0) {
          clearInterval(timerInterval);
          checkAnswer(); // Automatically submit if time runs out
      }
  }, 1000);
}

function updateTimerDisplay() {
  timeEl.innerText = timeLeft;
  if (timeLeft <= 5) {
      timeEl.style.color = 'red';
      timeEl.classList.add('pulse'); // Add a pulse animation class
  } else {
      timeEl.style.color = ''; // Reset color
      timeEl.classList.remove('pulse'); // Remove pulse class
  }
}

function checkAnswer() {
  const selectedAnswer = getSelected();
  clearInterval(timerInterval); // Stop the timer

  if (selectedAnswer) {
      if (selectedAnswer === quizData[currentQuiz].correct) {
          score++;
          scoreEl.innerText = score;
          highlightCorrectAnswer(selectedAnswer);
      } else {
          highlightIncorrectAnswer(selectedAnswer);
          highlightCorrectAnswer(quizData[currentQuiz].correct);
      }

      currentQuiz++;

      if (currentQuiz < quizData.length) {
          setTimeout(() => {
              loadQuiz();
              startTimer();
              removeHighlighting();
          }, 1500); // Delay before loading next question
      } else {
          showResults();
      }
  } else {
      // If no answer selected when time runs out
      currentQuiz++;
      if (currentQuiz < quizData.length) {
          setTimeout(() => {
              loadQuiz();
              startTimer();
          }, 1500);
      } else {
          showResults();
      }
  }
}

function highlightCorrectAnswer(answerId) {
  document.getElementById(answerId).nextElementSibling.classList.add('correct');
  document.getElementById(answerId).parentElement.classList.add('correct');
}

function highlightIncorrectAnswer(answerId) {
  document.getElementById(answerId).nextElementSibling.classList.add('incorrect');
  document.getElementById(answerId).parentElement.classList.add('incorrect');
}

function removeHighlighting() {
  answerEls.forEach(answerEl => {
      answerEl.parentElement.classList.remove('correct');
      answerEl.parentElement.classList.remove('incorrect');
  });
}

function showResults() {
  quizContainer.classList.add("hidden");
  resultsContainer.classList.remove("hidden");
  finalScoreEl.innerText = score;
  totalQuestionsEl.innerText = quizData.length;
}

submitBtn.addEventListener("click", checkAnswer);

restartBtn.addEventListener("click", () => {
  currentQuiz = 0;
  score = 0;
  scoreEl.innerText = score;
  resultsContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  loadQuiz();
  startTimer();
});