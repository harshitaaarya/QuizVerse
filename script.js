// Questions Array
const quizData = [
  {q:"Capital of India?", options:["Mumbai","New Delhi","Kolkata","Chennai"], answer:"New Delhi"},
  {q:"Which are programming languages?", options:["Python","HTML","Java","CSS"], answer:"Python"},
  {q:"GK: Largest planet?", options:["Earth","Mars","Jupiter","Venus"], answer:"Jupiter"},
  {q:"History: First President of India?", options:["Rajendra Prasad","Gandhi","Nehru","Ambedkar"], answer:"Rajendra Prasad"},
  {q:"Math: 5 + 7 * 2 ?", options:["19","24","17","20"], answer:"19"},
  {q:"CS: HTML stands for?", options:["Hypertext Markup Language","Hightext Markup Language","Hyperloop Text Language","Hypertext Machine Language"], answer:"Hypertext Markup Language"},
  {q:"Science: Water chemical formula?", options:["H2O","CO2","O2","NaCl"], answer:"H2O"},
  {q:"Geography: Longest river?", options:["Nile","Amazon","Ganga","Yangtze"], answer:"Nile"},
  {q:"Civics: Fundamental right included in which article?", options:["Article 12","Article 21","Article 19","Article 14"], answer:"Article 21"},
  {q:"Commerce: Currency of Japan?", options:["Yen","Dollar","Euro","Peso"], answer:"Yen"}
];

let current = 0;
let score = 0;
let timer = 30;
let interval;

const startBtn = document.getElementById("startBtn");
const difficultySelect = document.getElementById("difficulty");
const quizDiv = document.querySelector(".quiz");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const scoreEl = document.getElementById("score");
const retakeBtn = document.getElementById("retakeBtn");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const leaderboardDiv = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboardList");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const completeSound = document.getElementById("completeSound");

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
retakeBtn.addEventListener("click", retakeQuiz);

function startQuiz() {
  if(!difficultySelect.value){
    alert("Select difficulty first!");
    return;
  }
  document.querySelector(".settings").classList.add("hidden");
  quizDiv.classList.remove("hidden");
  current = 0;
  score = 0;
  loadQuestion();
}

function startTimer() {
  timer = 30;
  timerEl.textContent = `Time: ${timer}s`;
  interval = setInterval(()=>{
    timer--;
    timerEl.textContent = `Time: ${timer}s`;
    if(timer<=0){
      clearInterval(interval);
      showCorrectAnswer();
    }
  },1000);
}

function loadQuestion() {
  clearInterval(interval);
  startTimer();
  let q = quizData[current];
  questionEl.textContent = q.q;
  optionsEl.innerHTML = "";
  q.options.forEach(opt=>{
    const li = document.createElement("li");
    li.innerHTML = `<input type="radio" name="option" value="${opt}"><label>${opt}</label>`;
    li.addEventListener("click", ()=>selectAnswer(li,opt,q.answer));
    optionsEl.appendChild(li);
  });
  updateProgress();
  nextBtn.style.display = "none";
}

function selectAnswer(li,opt,answer){
  clearInterval(interval);
  const all = optionsEl.querySelectorAll("li");
  all.forEach(item=>{
    const input = item.querySelector("input");
    item.style.pointerEvents = "none";
    if(input.value===answer){
      item.style.background = "#55efc4"; // green
      correctSound.play().catch(()=>{});
    } else {
      item.style.background = "#ff7675"; // red
    }
  });
  if(opt!==answer){
    wrongSound.play().catch(()=>{});
  }
  scoreEl.textContent = `Score: ${score}`;
  if(opt===answer) score++;
  nextBtn.style.display = "block";
}

function showCorrectAnswer(){
  const all = optionsEl.querySelectorAll("li");
  const q = quizData[current];
  all.forEach(item=>{
    const input = item.querySelector("input");
    item.style.pointerEvents = "none";
    if(input.value===q.answer){
      item.style.background = "#55efc4"; // green
    } else {
      item.style.background = "#ff7675"; // red
    }
  });
  nextBtn.style.display = "block";
}

function nextQuestion(){
  current++;
  if(current<quizData.length){
    loadQuestion();
  } else {
    quizComplete();
  }
}

function updateProgress(){
  progressEl.style.width = `${(current/quizData.length)*100}%`;
}

function quizComplete(){
  clearInterval(interval);
  questionEl.textContent = "🎉 Quiz Completed!";
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";
  retakeBtn.style.display = "block";
  timerEl.style.display = "none";
  completeSound.play().catch(()=>{});
  confetti({ particleCount:200, spread:70, origin:{y:0.6} });
  saveScore();
  showLeaderboard();
}

function saveScore(){
  let scores = JSON.parse(localStorage.getItem("quizScores") || "[]");
  scores.push(score);
  scores.sort((a,b)=>b-a);
  if(scores.length>5) scores.length=5;
  localStorage.setItem("quizScores",JSON.stringify(scores));
}

function showLeaderboard(){
  leaderboardList.innerHTML = "";
  let scores = JSON.parse(localStorage.getItem("quizScores") || "[]");
  scores.forEach(s=>{
    const li = document.createElement("li");
    li.textContent = s;
    leaderboardList.appendChild(li);
  });
  leaderboardDiv.classList.remove("hidden");
}

function retakeQuiz(){
  retakeBtn.style.display = "none";
  scoreEl.textContent = "";
  current = 0;
  timerEl.style.display = "block";
  quizDiv.classList.remove("hidden");
  leaderboardDiv.classList.add("hidden");
  loadQuestion();
}
