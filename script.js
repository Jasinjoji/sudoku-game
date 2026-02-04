const puzzles = {
    easy: [
        [5,3,"","",7,"","","",""],
        [6,"","",1,9,5,"","",""],
        ["",9,8,"","","","",6,""],
        [8,"","","",6,"","","",3],
        [4,"","",8,"",3,"","",1],
        [7,"","","",2,"","","",6],
        ["",6,"","","","",2,8,""],
        ["","","",4,1,9,"","",5],
        ["","","","",8,"","",7,9]
    ],
    medium: [
    ["", "", "", 2, "", "", "", "", 9],
    ["", 6, "", "", "", "", 4, "", 3],
    ["", 1, "", "", 5, "", "", "", ""],

    ["", "", "", 7, "", 8, "", "", ""],
    [9, "", 6, "", "", 5, "", "", ""],
    ["", "", 1, "", "", "", "", 3, ""],

    ["", "", 5, "", "", "", 9, "", ""],
    [2, "", "", "", "", 6, "", 9, ""],
    ["", "", "", 8, "", "", "", "", ""]
    ],
    hard: [
        ["","","","","","",7,"",""],
        ["",1,"","","","",3,"",""],
        ["","","",4,"","","","",2],
        ["","","","","",6,"","",8],
        [5,"","","","",9,"","",""],
        [6,"","","",1,"","","",""],
        [1,"","","","",5,"","",""],
        ["","",9,"","","","",4,""],
        ["","",7,"","","","","",""]
    ]
};

let seconds = 0;
let timer;

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        const m = String(Math.floor(seconds / 60)).padStart(2,"0");
        const s = String(seconds % 60).padStart(2,"0");
        document.getElementById("time").textContent = `${m}:${s}`;
    },1000);
}

function createGrid() {
    const grid = document.getElementById("sudoku-grid");
    grid.innerHTML = "";

    const level = document.getElementById("difficulty").value;
    const puzzle = puzzles[level];

    puzzle.forEach((row,r)=>{
        row.forEach((val,c)=>{
            const cell = document.createElement("input");
            cell.className = "cell";
            cell.maxLength = 1;
            cell.dataset.row = r;
            cell.dataset.col = c;

            if(val !== ""){
                cell.value = val;
                cell.disabled = true;
                cell.classList.add("prefilled");
            } else {
                cell.classList.add("user-input");
                cell.addEventListener("input", ()=>{
                    if(!/^[1-9]$/.test(cell.value)) cell.value="";
                    validateBoard();
                });
            }
            grid.appendChild(cell);
        });
    });
}

function validateBoard() {
    document.querySelectorAll(".cell").forEach(c=>c.classList.remove("error"));
    const cells = document.querySelectorAll(".cell");

    let board = [...Array(9)].map(()=>Array(9).fill(""));
    cells.forEach(c=>{
        board[c.dataset.row][c.dataset.col]=c.value;
    });

    const seen = {};

    cells.forEach(c=>{
        const r=c.dataset.row, col=c.dataset.col, v=c.value;
        if(!v) return;

        const keys = [
            `r${r}-${v}`,
            `c${col}-${v}`,
            `b${Math.floor(r/3)}${Math.floor(col/3)}-${v}`
        ];

        keys.forEach(k=>{
            if(seen[k]) {
                c.classList.add("error");
                seen[k].classList.add("error");
            } else seen[k]=c;
        });
    });
}

function checkSolution() {
    if(document.querySelector(".error")) {
        message("❌ Fix highlighted errors!");
        return;
    }

    const cells = document.querySelectorAll(".cell");
    if([...cells].some(c=>c.value==="")) {
        message("⚠️ Complete all cells!");
        return;
    }

    clearInterval(timer);
    message("🎉 Sudoku Solved!");
    confetti();
}

function message(msg){
    document.getElementById("message").textContent=msg;
}

function newGame() {
    clearInterval(timer);
    seconds=0;
    document.getElementById("time").textContent="00:00";
    message("");
    createGrid();
    startTimer();
}

function toggleTheme(){
    document.body.classList.toggle("light");
    const btn = document.getElementById("themeBtn");
    btn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
}


function confetti(){
    for(let i=0;i<150;i++){
        const c=document.createElement("div");
        c.style.position="fixed";
        c.style.left=Math.random()*100+"vw";
        c.style.top="-10px";
        c.style.width="8px";
        c.style.height="8px";
        c.style.background=`hsl(${Math.random()*360},100%,50%)`;
        c.style.animation=`fall ${Math.random()*3+2}s linear`;
        document.body.appendChild(c);
        setTimeout(()=>c.remove(),4000);
    }
}

const style=document.createElement("style");
style.innerHTML=`@keyframes fall{to{transform:translateY(110vh) rotate(360deg);}}`;
document.head.appendChild(style);

newGame();
