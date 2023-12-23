const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');


let score = 0;
let health = 100;

let gameOver = false;
let restartGame = false;

let moveLeft = false;
let moveRight = false;

canvas.height = 500;
canvas.width = 800;

let foodGroup = [];
let foodLimit = 2;

let enemyGroup = [];
let enemyTorps = [];

let canvasPosition = canvas.getBoundingClientRect();


document.addEventListener('keydown', e => {
    if ((e.key === 'ArrowLeft')){
        moveLeft = true;
    }
    if ((e.key === 'ArrowRight')){
        moveRight = true;
    }
    if ((e.key === 'ArrowDown'&& foodGroup.length + 1 <= foodLimit && gameOver === false)){
        foodGroup.push(new Food());
    }
    if ((e.key === 'Enter')){
        restartGame = true;
    }
});
window.addEventListener('keyup', e => {
    if ((e.key === 'ArrowLeft')){
        moveLeft = false;
    }
    if ((e.key === 'ArrowRight')){
        moveRight = false;
    }
})

class Boat {
    constructor(){
        this.x = canvas.width/2 - 90;
        this.y = 40;
        this.width = 90;
        this.height = 18;
    }
    update(keys){

        if (moveLeft && this.x >= 0){
            this.x -= 1.5;
        }
        if (moveRight && this.x <= canvas.width - this.width){
            this.x += 1.5;
        }

        enemyTorps.forEach(torpedo1 => {
            if (
                this.x > torpedo1.x + torpedo1.width ||
                this.x + this.width < torpedo1.x ||
                this.y > torpedo1.y + torpedo1.height ||
                this.y + this.height < torpedo1.y
                ) {
            } else {
                this.markedForDeletion = true;
                torpedo1.markedForDeletion = true;
                if (health > 0){
                    health = health - 25;
                }
            }
        })

    }
    draw(context){
        context.fillstyle = 'white';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Food {
    constructor(){
        this.x = boat.x + boat.width;
        this.y = 42;
        this.width = 5;
        this.height = 5
        this.markedForDeletion = false;
    }
    update(){
        if (this.y >= canvas.height - this.height){
            this.markedForDeletion = true;
        } else {
            this.y += 2;
        }
    }
    draw(context){
        context.fillstyle = 'white';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Submarine {
    constructor(){
        this.x = 850;
        this.y = Math.random() * 280 + 60;
        this.width = 120;
        this.height = 15;
        this.image = document.getElementById('sub1');
        this.speed = Math.random() * 0.5 + 0.5;
        this.markedForDeletion = false;
    }
    update(foodGroup){
        if (this.x > -120) {
            this.x -= this.speed;
        }
        if (this.x < -120) {
            this.markedForDeletion = true;
            enemyRecruiter2();
        }

        let fireChance = Math.random() * 100;

        if (fireChance >= 99.5){
            enemyTorps.push(new Torpedo(this.x, this.y));
        }

        foodGroup.forEach(food => {
            if (
                this.x > food.x + food.width ||
                this.x + this.width < food.x ||
                this.y > food.y + food.height ||
                this.y + this.height < food.y
                ) {
            } else {
                this.markedForDeletion = true;
                food.markedForDeletion = true;
                score ++;
            }
        })
    }
    draw(context){
        context.fillstyle = 'grey';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Submarine2 {
    constructor(){
        this.x = -120;
        this.y = Math.random() * 300 + 190;
        this.width = 120;
        this.height = 15;
        this.image = document.getElementById('sub1');
        this.speed = Math.random() * 0.5 + 0.5;
        this.markedForDeletion = false;
    }
    update(foodGroup){

            this.x += this.speed;
        
        if (this.x > canvas.width + 120) {
            this.markedForDeletion = true;
            enemyRecruiter();
        }

        let fireChance = Math.random() * 100;

        if (fireChance >= 98){
            enemyTorps.push(new Torpedo(this.x + this.width, this.y));
        }

        foodGroup.forEach(food => {
            if (
                this.x > food.x + food.width ||
                this.x + this.width < food.x ||
                this.y > food.y + food.height ||
                this.y + this.height < food.y
                ) {
            } else {
                this.markedForDeletion = true;
                food.markedForDeletion = true;
                score ++;
            }
        })
    }
    draw(context){
        context.fillstyle = 'grey';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Torpedo {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 5
        this.markedForDeletion = false;
    }
    update(){
            this.y -= 3;

        if (this.y < 50){
            this.markedForDeletion = true;
        } else {
            this.y += 2;
        }
    }
    draw(context){
        context.fillstyle = 'white';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}


function foodInst(){
    foodGroup.forEach(food => {
        food.draw(ctx);
        food.update();
        foodGroup = foodGroup.filter(food => !food.markedForDeletion);
    })
}

function ammoAdder(){
    foodLimit ++;
} 

function enemyRecruiter(){
    enemyGroup.push(new Submarine());
    console.log(enemyGroup)
}

function enemyRecruiter2(){
    enemyGroup.push(new Submarine2());
    console.log(enemyGroup)
}

function enemyManager(){
    enemyGroup.forEach(sub1 => {
        sub1.draw(ctx);
        sub1.update(foodGroup);
        enemyGroup = enemyGroup.filter(sub1 => !sub1.markedForDeletion);
    })
    enemyGroup.forEach(sub2 => {
        sub2.draw(ctx);
        sub2.update(foodGroup);
        enemyGroup = enemyGroup.filter(sub2 => !sub1.markedForDeletion);
    })
}

function torpedoManager(){
    enemyTorps.forEach(torpedo1 => {
        torpedo1.draw(ctx);
        torpedo1.update(enemyTorps);
        enemyTorps = enemyTorps.filter(torpedo1 => !torpedo1.markedForDeletion);
    })
}


function display(context){
    context.textAlign = 'left';
    context.font = '15px Helvetica';
    context.fillStyle = 'black';
    context.fillText('Health: ' + health + '%', 5, 15);
    context.fillText('Score: ' + score, 5, 35);
    if (health <= 0){
        context.textAlign = 'center';
        context.font = '50px Helvetica';
        context.fillStyle = 'black';
        context.fillText('YOU DIED', canvas.width/2, canvas.height/2);
        context.font = '20px Helvetica';
        context.fillText('press: ENTER', canvas.width/2, canvas.height/2 + 40);
        gameOver = true;
        moveLeft = false;
        moveRight = false;
    }
}

function restart(){
    if (restartGame){
        score = 0;
        health = 100;
        gameOver = false;
        restartGame = false;
        moveLeft = false;
        moveRight = false;
        canvas.height = 500;
        canvas.width = 800;
        foodGroup = [];
        foodLimit = 3;
        enemyGroup = [];
        enemyTorps = [];
    }
}

let enemyDelay = Math.random() * 12500;
let enemyDelay2 = Math.random() * 35000;
let interval = setInterval(enemyRecruiter, enemyDelay);
let otherInterval = setInterval(enemyRecruiter2, enemyDelay2);



let ammoRecharge = setInterval(ammoAdder, 50000);


const boat = new Boat();
const food = new Food();
const sub1 = new Submarine();
const sub2 = new Submarine2();
const torpedo1 = new Torpedo();

function animate(){

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    display(ctx);
    boat.draw(ctx);
    boat.update();
    enemyManager()
    torpedoManager();
    foodInst();
    requestAnimationFrame(animate);
    if (gameOver) restart();
}

animate();