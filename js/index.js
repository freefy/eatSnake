
var oCanvas = document.getElementById('myCanvas');
var ctx = oCanvas.getContext('2d');

var score = document.getElementsByClassName('score')[0];
var start = document.getElementsByClassName('start')[0];
var pause = document.getElementsByClassName('pause')[0];
var reStart = document.getElementsByClassName('reStart')[0];

var h = oCanvas.height;
var w = oCanvas.width;
//分数
var num = 0;
score.innerHTML = num;

//食物
var food = new Food(200, 400);
function Food(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.color = 'green';
    this.drawFood = function () {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}
//每一节蛇
function Snake(x, y, color) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.color = color;
    this.drawSnake = function () {
        ctx.beginPath();
        ctx.strokeStyle = "#ccc";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

    }
}
var snake = new Snake(20, 0, 'blue');
var snakeArray = [];
snakeArray.push(snake); //游戏刚开始只要一节身体

var speedX = 20;
var speedY = 0;

var timer = null;
var lock = false;
var reLoadFlag = false;

//画板
var board = new Board();
function Board() {
    this.x = 20;
    this.y = 20;
    this.drawBoard = function () {
        ctx.beginPath();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        for (var i = 0; i < w / this.x; i++) {
            ctx.moveTo(i * this.x + 0.5, 0);
            ctx.lineTo(i * this.x + 0.5, h);
        }
        for (var i = 0; i < h / this.y; i++) {
            ctx.moveTo(0, i * this.y + 0.5);
            ctx.lineTo(w, i * this.y + 0.5);
        }
        ctx.stroke();
    }
}

//事件绑定函数
function bindEvent() {
    //开始
    start.onclick = function () {
        if (!lock) {
            startGame(200);
            lock = true;
        }
    };
    //暂停
    pause.onclick = function () {
        clearInterval(timer);
        lock = false;
    };
    reStart.onclick = function () {
            if(reLoadFlag){
                reLoadFlag = false;
                document.location.reload();
            }
        
    };

    //方向盘控制方向
    document.onkeydown = function (e) {
        handle(e);
    }
}
//按键设置
function handle(e) {
    var code = e.keyCode;
    switch (code) {
        case 37:
            {
                if (speedX <= 0) {
                    speedX = -20;
                    speedY = 0;
                }
                break;
            }
        case 38:
            {
                if (speedY <= 0) {
                    speedY = -20;
                    speedX = 0;
                }
                break;
            }
        case 39:
            {
                if (speedX >= 0) {
                    speedX = 20;
                    speedY = 0;
                }
                break;
            }
        case 40:
            {
                if (speedY >= 0) {

                    speedX = 0;
                    speedY = 20;
                }
                break;
            }
    }
}

//身体+1(吃到食物)
function addSnake(snakeArray) {
    var len = snakeArray.length;
    var sX = snakeArray[len - 1].x;
    var sY = snakeArray[len - 1].y;
    var snake = new Snake(sX, sY, 'red');
    snakeArray.push(snake);
}

//判断是否吃到食物--true
function eatFood(snake, food) {
    if (snake.x == food.x && snake.y == food.y) {
        return true;
    }
    return false;
}
//判断下一秒是否碰墙壁--true
function HitCheck(snake) {
    if (snake.x + speedX < 0 || snake.x + (snake.width) + speedX > w || snake.y + speedY < 0 || (snake.y +
            snake.height + speedY) > h) {
        return true;
    }
    return false;
}
//判断下一秒是否碰到自己身体--true
function HitBody(snake) {
    for (var i = 2; i < snakeArray.length; i++) {
            if (snake[0].x+speedX == snake[i].x && snake[0].y+speedY == snake[i].y) {
            return true;
        }    
    }
    return false;
}

// 食物随机生成位置
function foodPlace() {
    return (parseInt(Math.random() * 30)) * 20;
}

var begin,end;
//游戏开始
function startGame(t) {
    var t = t;//时间间隔
    timer = setInterval(function () {
        ctx.clearRect(0, 0, w, h);
        board.drawBoard();
        food.drawFood();
        //吃到食物
        var eat = eatFood(snakeArray[0], food);
        if (eat) {
            clearInterval(timer);
            timer = null;
            num++;
            score.innerHTML = num;
            food.x = foodPlace();
            food.y = foodPlace();
            food.drawFood();
            addSnake(snakeArray);
            t = t - 10; //吃到食物,速度会变快(时间间隔变小)
            if (t <= 100) {
                t = 100;
            }
            startGame(t);

        }
        //碰墙(保留碰墙前的位置)
        var isHit = HitCheck(snakeArray[0]);
        if (isHit) {
            reLoadFlag = true;
            clearInterval(timer);
            timer = null;
            alert('GAMEOVER');

        }
        //碰到自己身体(保留碰到自己身体前的位置)
        var selfHit = HitBody(snakeArray);
        if (selfHit) {
            reLoadFlag = true;
                clearInterval(timer);
                timer = null;
                alert('GAMEOVER');
            }
      //不碰墙也不碰到自己身体
        if(!isHit && !selfHit){
            var len = snakeArray.length;
            for (var i = len - 1; i > 0; i--) {
                snakeArray[i].x = snakeArray[i - 1].x;
                snakeArray[i].y = snakeArray[i - 1].y;
            }
            snakeArray[0].x = snakeArray[0].x + speedX;
            snakeArray[0].y = snakeArray[0].y + speedY;
        }
        for (var i = 0; i < snakeArray.length; i++) {
            snakeArray[i].drawSnake();
        }
    }, t)
}

(function () {
    snake.drawSnake();
    food.drawFood();
    board.drawBoard();
    bindEvent();
})()
