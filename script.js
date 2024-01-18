// assigning elements *start*
const board = document.querySelector('.board');
const score = document.querySelector('.scr span');
const highScore = document.querySelector('.high span');
const button = document.querySelectorAll('.btns button');

let adFood = new Audio('food.mp3');
let adMove = new Audio('move.mp3');
let adGameOver = new Audio('gameover.mp3');

const notify = document.getElementById('notify');
const del = document.querySelector('#del button');

const label = document.querySelectorAll('label span');
const spd_num = document.getElementById('spd-num');
const speed_input = document.querySelector('input[type="range"]');
// assigning elements *end*

//setting up defaults *start*
let speed = localStorage.getItem('speed') || 150;
spd_num.innerHTML = `Snake Speed : ${speed}`;
speed_input.value = speed;

speed_input.addEventListener('input', () => {
    localStorage.setItem('speed', speed_input.value);
    spd_num.innerHTML = `Snake Speed : ${localStorage.getItem('speed')}`;
    speed_input.value = localStorage.getItem('speed');
})
spd_num.innerHTML = `Snake Speed : ${localStorage.getItem('speed')}`;
speed_input.value = localStorage.getItem('speed');

document.getElementById('settings').addEventListener('click', () => {
    document.getElementById('set').style.display = "block";
    clearInterval(inter);
    notify.innerHTML = 'paused !!';
})
//setting up defaults *end*

// game variables *start*
let foodX; let foodY;
let snakeX = Math.floor(Math.random()*30+1); let snakeY = Math.floor(Math.random()*30+1);
let veloX = 0; let veloY = 0;
let snakeBody = [
    [snakeX,snakeY]
];
let inter;
let gameOver = false;
let src = 0
let h_src = localStorage.getItem('high') || 0;
score.innerHTML = src;
highScore.innerHTML = h_src;
// game variables *end*

//game over *start*
const handleGameOver = () => {
    adGameOver.play();
    clearInterval(inter);
    alert('Game Over!');
    location.reload();
}
//game over *end*

//assign food position *start*
const foodPosition = () => {
    foodX = Math.floor(Math.random()*30+1);
    foodY = Math.floor(Math.random()*30+1);
}
//assign food position *end*

//direction changer *start*
const changeDir = e => {
    adMove.play();
    if(e.key == 'ArrowUp' && veloX != 1){
        notify.innerHTML = 'Playing...';
        veloX = -1;
        veloY = 0;
    }else if(e.key == 'ArrowDown' && veloX != -1){
        notify.innerHTML = 'Playing...';
        veloX = 1;
        veloY = 0;
    }else if(e.key == 'ArrowLeft' && veloY != 1){
        notify.innerHTML = 'Playing...';
        veloX = 0;
        veloY = -1;
    }else if(e.key == 'ArrowRight' && veloY != -1){
        notify.innerHTML = 'Playing...';
        veloX = 0;
        veloY = 1;
    }
}
button.forEach(btn=>btn.addEventListener('click', ()=>changeDir({key:btn.dataset.e})));
//direction changer *end*

//engine *start*
const engine = () => {
    //change in snake's direction *start*
    snakeX += veloX; snakeY += veloY; 
    //change in snake's direction *end*
    
    //game over *start*
    if(snakeX>30 || snakeY>30 || snakeX<1 || snakeY<1) gameOver = true;
    if(gameOver) handleGameOver();
    //game over *end*

    //when snake hits the food *start*
    if(snakeX == foodX && snakeY == foodY){
        adFood.play();
        snakeBody.push([foodX,foodY]);
        foodPosition();
        src++;
        if(src>=h_src){
            h_src = src;
            localStorage.setItem('high', h_src);
        }
        score.innerHTML = src;
        highScore.innerHTML = h_src;
    }
    let html = `<div class="fd" style="grid-area:${foodX}/${foodY}"></div>`;
    //when snake hits the food *end*

    //pushing last element of the snake body forward to it's head *start*
    for(let i = snakeBody.length-1; i>0; i--){
        snakeBody[i] = {...snakeBody[i-1]};
    }
    snakeBody[0] = [snakeX,snakeY];
    //pushing last element of the snake body forward to it's head *end*

    //adding snake body *start*
    for(let i = 0; i<snakeBody.length; i++){
        html+= `<div class="snk" style="grid-area:${snakeBody[i][0]}/${snakeBody[i][1]}"></div>`;

        if(i!=0) if(snakeBody[0][0] == snakeBody[i][0] && snakeBody[0][1] == snakeBody[i][1]) gameOver = true;
    }
    //adding snakebody *end*
    board.innerHTML = html;
}
//engine *end*

//game handling *start*
foodPosition();
document.addEventListener('keydown', changeDir);
inter = setInterval(engine,speed);
//game handling *end*

//handling absolutes *start*
del.addEventListener('click', () => {
    localStorage.removeItem('high');
    localStorage.setItem('speed', 150);
    location.reload();
})
const save = () => {
    alert('Saved !!');
    location.reload();
}
//handling absolutes *end*