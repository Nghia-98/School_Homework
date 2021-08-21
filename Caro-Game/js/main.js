
let board = [];  // use to draw in HTML
let board2D = null; // use to check winner
let squares;                        // ground of game
let numSquareEachEdge = 6;          // number square on each edge of the board
document.getElementById('add_num').value = 3; // size default of board
document.getElementById('add_num_win').value = 3 // num tick to win default
let column_div = document.querySelector('.flex-column');
//column_div.style.width = '27%'       // size default when size of board is 3 squares
const sizeOfSquare = 54;
const sizeBoard_3 = 3*54+3*2;
const sizeBoard_4 = 4*54+4*2;
const sizeBoard_5 = 5*54+5*2;
const sizeBoard_6 = 336;
const sizeBoard_7 = 7*54+7*2;
const sizeBoard_8 = 8*54+8*2;
const sizeBoard_9 = 9*54+9*2;

/* --------------------------- */
let numLine = 3;
let numWin = 3;

let turn = 'X';    // turn of X or Y
let win;           // X or Y or Tie
let isEnd = false;
let stringInnerHtmlSquare = ``;     /*`<div class="square"></div>
                                       <div class="square"></div>` */

/*----- cached element references -----*/

let board_div = document.getElementById('board');  // html element hold the whole squares

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleTurn);
let messages = document.querySelector('h2');
document.getElementById('reset-button').addEventListener('click', init);

// function get input number of squares on each edge
function getInput() {
    let sizeBoard = parseInt(document.getElementById('add_num').value);
    let numTickWin = parseInt(document.getElementById('add_num_win').value);
    return {'sizeBoard': sizeBoard, 'numTickWin': numTickWin};
}

// functions creat size of the board
function creatSizeBoard(numSquare) {
    if (numSquare === 3) {
        board_div.style.width = `${sizeBoard_3}px`;
        board_div.style.height = `${sizeBoard_3}px`;
       // column_div.style.width = '27%';
    } else if (numSquare === 4) {
        board_div.style.width = `${sizeBoard_4}px`;
        board_div.style.height = `${sizeBoard_4}px`;
       // column_div.style.width = '35%';
    } else if (numSquare === 5) {
        board_div.style.width = `${sizeBoard_5}px`;
        board_div.style.height = `${sizeBoard_5}px`;
       // column_div.style.width = '45%';
    } else if (numSquare === 6) {
        board_div.style.width = `${sizeBoard_6}px`;
        board_div.style.height = `${sizeBoard_6}px`;
        //column_div.style.width = '53%';
    } else if (numSquare === 7) {
        board_div.style.width = `${sizeBoard_7}px`;
        board_div.style.height = `${sizeBoard_7}px`;
        //column_div.style.width = '64%';
    } else if (numSquare === 8) {
        board_div.style.width = `${sizeBoard_8}px`;
        board_div.style.height = `${sizeBoard_8}px`;
       // column_div.style.width = '75%';
    } else if (numSquare === 9) {
        board_div.style.width = `${sizeBoard_9}px`;
        board_div.style.height = `${sizeBoard_9}px`;
      //  column_div.style.width = '85%';
    }
}

// Setup variables for new game
function setUpVariables() {
    board = [];                      // reset the board
    let objInput = getInput();  // get num of square from UI
    numSquareEachEdge = objInput.sizeBoard;
    numLine = objInput.sizeBoard;
    numWin = objInput.numTickWin;
    board2D = Create2DArray(numLine);
    stringInnerHtmlSquare = '';     // reset string inner html square
    win = null;                     // reset the winner for new game
    isEnd = false;
    messages.classList.remove("red-text")

    creatSizeBoard(numSquareEachEdge);  // setup size of board depend on nu square of each edge

    creatSqureHtml(numSquareEachEdge);  // inner square html into the board_div
    squares = Array.from(document.querySelectorAll('#board div'));

}

// functions creat some square into html
function creatSqureHtml(numberSquareEachEdge) {
    const numSquareOfBoard = numberSquareEachEdge * numberSquareEachEdge;
    for (let i = 0; i < numSquareOfBoard; i++) {
        stringInnerHtmlSquare += `<div class="square"></div>`;
    };
    //console.log(stringInnerHtmlSquare)
    board_div.innerHTML = `${stringInnerHtmlSquare}`;
}

function Create2DArray(rows) {
    let arr = [];
    for (let i = 0; i < rows; i++) {
        arr[i] = [];
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < rows; j++) {
            arr[i][j] = '';
        }
    }
    return arr;
}

board2D = Create2DArray(numLine);

/* ----------------- get Winner ---------------- */

function handleTurn() {
    let idx = squares.findIndex(function (square) {  // return index of square that we click
        return square === event.target;
    });
    board[idx] = turn;                // tick into board to show in html
    let coordinates = indexToCoordinates(idx, numLine);  // get coordinates of square in the matrix

    board2D[coordinates.y][coordinates.x] = turn;          // tick into board2D to check winner
    console.log(`board2D[${coordinates.y}][${coordinates.x}] = ${board2D[coordinates.y][coordinates.x]}`)
    turn = turn === 'O' ? 'X' : 'O';  // change symbol (X or O) after each tick

    isEnd = getWinner(idx); // true or false
    if (isEnd) {
        win = board[idx];
        messages.classList.add("red-text")
    }

    render();
};

function coordinatesToIndex(coordinates, num) {
    return coordinates.y * num + coordinates.x;
}

function indexToCoordinates(idx, num) {
    return {
        y: Math.floor(idx / num),
        x: idx % num
    };
}

function getWinner(index) {
    return (winRow(index) || winCol(index) || winMainCroos(index) || winSubCroos(index))

}

function winRow(index) {
    let coordinates = indexToCoordinates(index, numLine); //coordinates of square (board[index]) in square matrix
    let x = coordinates.x;
    let y = coordinates.y;
    let countLeft = 0;
    let countRight = 0;

    for (let i = x; i >= 0; i--) {
        if (board2D[y][i] === board[index]) countLeft++;
        else break;
    }
    for (let i = x + 1; i < numLine; i++) {
        if (board2D[y][i] === board[index]) countRight++;
        else break;
    }
    if (countLeft + countRight >= numWin) {
        return true;
    }
    return false;
}

function winCol(index) {
    let coordinates = indexToCoordinates(index, numLine); //coordinates of square (board[index]) in square matrix
    let x = coordinates.x;
    let y = coordinates.y;
    let countTop = 0;
    let countBottom = 0;

    for (let i = y; i >= 0; i--) {
        if (board2D[i][x] === board[index]) countTop++;
        else break;
    }
    for (let i = y + 1; i < numLine; i++) {
        if (board2D[i][x] === board[index]) countBottom++;
        else break;
    }
    if (countTop + countBottom >= numWin) {
        return true;
    }
    return false;
}

function winMainCroos(index) {
    let coordinates = indexToCoordinates(index, numLine); //coordinates of square (board[index]) in square matrix
    let x = coordinates.x;
    let y = coordinates.y;
    let countTop = 0;
    let countBottom = 0;

    for (let i = 0; i <= x; i++) {
        if ( y - i < 0 || x - i < 0) break;
        if (board2D[y - i][x - i] === board[index]) countTop++;
        else break;
    }
    for (let i = 1; i <= numLine - x; i++) {
        if ( y + i >= numLine || x + i >= numLine) break;
        if (board2D[y + i][x + i] === board[index]) countBottom++;
        else break;
    }
    if (countTop + countBottom >= numWin) {
        return true;
    }
    return false;
}

function winSubCroos(index) {
    let coordinates = indexToCoordinates(index, numLine); //coordinates of square (board[index]) in square matrix
    let x = coordinates.x;
    let y = coordinates.y;
    let countTop = 0;
    let countBottom = 0;

    for (let i = 0; i <= y; i++) {
        if ( y - i < 0 || x + i > numLine) break;
        if (board2D[y - i][x + i] === board[index]) countTop++;
        else break;
    }
    for (let i = 1; i <= numLine - x; i++) {
        if (y + i >= numLine || x - i < 0) break;
        if (board2D[y + i][x - i] === board[index]) countBottom++;
        else break;
    }
    console.log(`Top ${countTop} - Down ${countBottom}`)
    if (countTop + countBottom >= numWin) {
        return true;
    }
    return false;
}

function init() {
    messages.textContent = 'Type size of the board';
    setUpVariables();
    let numSquareOfBoard = numSquareEachEdge * numSquareEachEdge;
    for (let i = 0; i < numSquareOfBoard; i++) {
        board.push('');
    }
    render();
};

function render() {
    squares = Array.from(document.querySelectorAll('#board div'));
    board.forEach(function (ele, index) {
        squares[index].textContent = ele;
    });
    messages.textContent = win ? `${win} wins the game!` : `It's ${turn}'s turn!`;
};

init();
