// Global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
var clueHoldTime = 1000;
var size = 7;

//Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
// for multiple chances
var guessCounter = 0;
var mistakes = 0;
// for timer
var count = 15;
var reset = false;
var timer;

function getRandInt() {
  return Math.floor(Math.random() * 7) + 1;
}

function getPattern(size) {
  var list = [];
  for (let i = 0; i < size; i++) {
    list[i] = getRandInt();
  }
  console.log(list);
  return list;
}

function startGame() {
  progress = 0;
  pattern = getPattern(size);
  clueHoldTime = 1000;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
  reset = true;
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game over. You won!");
}

const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 500,
  6: 550,
  7: 600,
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  //context.resume()
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}

function startTone(btn) {
  if (!tonePlaying) {
    //context.resume()
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    //context.resume()
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);


function showImage(btn) {
  document.getElementById("button" + btn + "img").classList.add("pressed");
}

function removeImage(btn) {
  document.getElementById("button" + btn + "img").classList.remove("pressed");
}

function guess(btn) {
   //console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  // add game logic here
  if (pattern[guessCounter] != btn) {
    if (mistakes == 2) {
      loseGame();
      stopGame();
      return;
    } else {
      mistakes++;
      alert("Wrong! " + (3 - mistakes) + " chances left.");
      guessCounter = 0;
    }
  }

  if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
        reset = true;
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  }
}


function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}


function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}


function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  clueHoldTime -= 50;
  count = 15;
  reset = false;

  clearInterval(timer);
  timer = setInterval(countDown, 1000);
}


function countDown() {
  document.getElementById("clock").innerHTML = "Countdown: " + count + " s";
  count -= 1;
  if (count < 0 || reset) {
    if (!reset) {
      stopGame();
      alert("Time is up! You lost.");
    }
    resetTimer();
    clearInterval(timer);
  }
}

function resetTimer() {
  count = 15;
  document.getElementById("clock").innerHTML = "Countdown: 0 s";
}

