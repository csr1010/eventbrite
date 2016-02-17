var board = new Array(9);

function init() {
  var down = "mousedown"; 
  var up = "mouseup"; 
  
  /* add event listeners */
  document.querySelector("input.button").addEventListener(up, newGame, false);
  var boxes = document.getElementsByTagName("td");
  /*event binding*/
  for (var s = 0; s < boxes.length; s++) {
    boxes[s].addEventListener(down, function(evt){boxSelected(evt, getCurrentPlayer());}, false);
  }
  
  /* create the board and set the initial player */
  generateBoxes();
  setInitialPlayer();
}

/*  adding Xs and Os to the board, saving game state */
function generateBoxes() {

  /* create a board from the localstorage if exists */
  if (window.localStorage && localStorage.getItem('eventbriteboard')) {
    
    /* parse the string that represents our playing board to an array */
    board = (JSON.parse(localStorage.getItem('eventbriteboard')));
    for (var i = 0; i < board.length; i++) {
      if (board[i] != "") {
        fillBoxWithMarker(document.getElementById(i), board[i]);
      }
    }
  }
  /* if not , create a clean board */
  else {  
    for (var i = 0; i < board.length; i++) {
      board[i] = "";                               
      document.getElementById(i).innerHTML = "";
    }
  }
}

/* call this function whenever a box is clicked */
function boxSelected(evt, currentPlayer) {
  var box = evt.target;
  /* check to see if the box already contains an X or O marker */
  if (box.className.match(/marker/)) {
    alert("Sorry,   Please choose another box.");
    return;
  }
  /* if not already marked, mark the box, update the array that tracks our board, check for a winner, and switch players */
  else {
    fillBoxWithMarker(box, currentPlayer);
    updateBoard(box.id, currentPlayer);
    checkForWinner();
    switchPlayers(); 
  }
}

/*** create an X or O div and append it to the box ***/
function fillBoxWithMarker(box, player) {
  var marker = document.createElement('div');
  /* set the class name on the new div element to X-marker or O-marker, depending on the current player */
  marker.className = player + "-marker";
  box.appendChild(marker);
}

/* update our array which tracks the state of the board, and write the current state to local storage */
function updateBoard(index, marker) {
  board[index] = marker;
  
  /* HTML5 localStorage only allows storage of strings - convert   array to a string */
  var boardstring = JSON.stringify(board);

  /* store this string to localStorage, along with the last player who marked a box */
  localStorage.setItem('eventbriteboard', boardstring); 
  localStorage.setItem('last-player', getCurrentPlayer());
}


/* checking for and declaring a winner, after a box has been marked with X or O */
/* Our Tic Tac Toe board, an array:
  0 1 2
  3 4 5
  6 7 8
*/
function declareWinner() {
  if (confirm("Game over, we got one winner, You want to restart?")) {
    newGame();
  }
}

function weHaveAWinner(a, b, c) {
  if ((board[a] === board[b]) && (board[b] === board[c]) && (board[a] != "" || board[b] != "" || board[c] != "")) {
    setTimeout(declareWinner(), 100);
    return true;
  }
  else
    return false;
}

function checkForWinner() {
  /* check rows */
  var a = 0; var b = 1; var c = 2;
  while (c < board.length) {
    if (weHaveAWinner(a, b, c)) {
      return;
    }
    a+=3; b+=3; c+=3;
  }
    
  /* check columns */
  a = 0; b = 3; c = 6;
  while (c < board.length) {
    if (weHaveAWinner(a, b, c)) {
      return;
    }
    a+=1; b+=1; c+=1;
  }

  /* check diagonal right */
  if (weHaveAWinner(0, 4, 8)) {
    return;
  }
  /* check diagonal left */
  if (weHaveAWinner(2, 4, 6)) {
    return;
  }
  
  /* if there's no winner but the board is full, ask the user if they want to start a new game */
  if (!JSON.stringify(board).match(/,"",/)) {
    if (confirm("The game is drawn ,Restart?")) {
      newGame();
    }
  }
}


/* utilities for getting the current player, switching players, and creating a new game */
function getCurrentPlayer() {
  return document.querySelector(".current-player").id;
}

/* set the initial player, when starting a whole new game or restoring the game state when the page is revisited */
function setInitialPlayer() {
  var playerX = document.getElementById("X");
  var playerO = document.getElementById("O");
  playerX.className = "";
  playerO.className = "";
    
  /* if there's no localStorage, or no last-player stored in localStorage, always set the first player to X by default */
  if (!window.localStorage || !localStorage.getItem('last-player')) {
    playerX.className = "current-player";
    return;
  } 

  var lastPlayer = localStorage.getItem('last-player');  
  if (lastPlayer == 'X') {
    playerO.className = "current-player";
  }
  else {
    playerX.className = "current-player";
  }
}

function switchPlayers() {
  var playerX = document.getElementById("X");
  var playerO = document.getElementById("O");
  
  if (playerX.className.match(/current-player/)) {
    playerO.className = "current-player";
    playerX.className = "";
  }
  else {
    playerX.className = "current-player";
    playerO.className = "";
  }
}

function newGame() {  
  /* clear the currently stored game out of local storage */
  localStorage.removeItem('eventbriteboard');
  localStorage.removeItem('last-player');
  
  /* create a new game */
  generateBoxes();
}




