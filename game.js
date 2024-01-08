const gameContainer = document.getElementById("game-container");
const character = document.getElementById("character");

let playerHP = 10;
let enemyHP = 5;
let level = 1;
let enemies = [];

function spawnEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.style.left = Math.random() * 1000 + "px";
    enemy.style.top = Math.random() * 1000 + "px";
    gameContainer.appendChild(enemy);

    enemies.push({
        element: enemy,
        hp: enemyHP * level,
        x: parseFloat(enemy.style.left),
        y: parseFloat(enemy.style.top),
    });
}

function updateEnemies() {
    enemies.forEach((enemy, index) => {
        // Move enemies towards the player
        const angle = Math.atan2(character.offsetTop - enemy.y, character.offsetLeft - enemy.x);
        const speed = 2;
        enemy.x += Math.cos(angle) * speed;
        enemy.y += Math.sin(angle) * speed;

        // Update enemy position
        enemy.element.style.left = enemy.x + "px";
        enemy.element.style.top = enemy.y + "px";

        // Check for collision with character
        const characterRect = character.getBoundingClientRect();
        const enemyRect = enemy.element.getBoundingClientRect();

        if (
            characterRect.left < enemyRect.right &&
            characterRect.right > enemyRect.left &&
            characterRect.top < enemyRect.bottom &&
            characterRect.bottom > enemyRect.top
        ) {
            playerHP -= 1; // Decrease player HP on collision
            console.log("Player HP: " + playerHP);
            // Handle other collision-related logic here
        }

        // Check if enemy HP is zero
        if (enemy.hp <= 0) {
            gameContainer.removeChild(enemy.element);
            enemies.splice(index, 1);
            // Handle enemy defeat logic here
        }
    });
}

function shoot(event) {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    gameContainer.appendChild(bullet);

    const characterRect = character.getBoundingClientRect();
    bullet.style.left = characterRect.left + characterRect.width / 2 + "px";
    bullet.style.top = characterRect.top + characterRect.height / 2 + "px";

    const angle = Math.atan2(event.clientY - characterRect.top, event.clientX - characterRect.left);
    const speed = 5;
    let bulletX = parseFloat(bullet.style.left);
    let bulletY = parseFloat(bullet.style.top);

    function moveBullet() {
        bulletX += Math.cos(angle) * speed;
        bulletY += Math.sin(angle) * speed;
    
        bullet.style.left = bulletX + "px";
        bullet.style.top = bulletY + "px";
    
        // Check for collision with enemies
        enemies.forEach((enemy, index) => {
            const enemyRect = enemy.element.getBoundingClientRect();
    
            if (
                bulletX < enemyRect.right &&
                bulletX > enemyRect.left &&
                bulletY < enemyRect.bottom &&
                bulletY > enemyRect.top
            ) {
                enemy.hp -= 1; // Decrease enemy HP on hit
                console.log("Enemy HP: " + enemy.hp);
    
                if (enemy.hp <= 0) {
                    gameContainer.removeChild(enemy.element);
                    enemies.splice(index, 1);
                    // Handle enemy defeat logic here
                }
    
                // Check if bullet is a child of gameContainer before attempting to remove
                if (bullet.parentNode === gameContainer) {
                    gameContainer.removeChild(bullet);
                }
            }
        });
    
        // Remove the bullet if it goes out of bounds
        if (
            bulletX < 0 || bulletX > 1000 ||
            bulletY < 0 || bulletY > 1000
        ) {
            // Check if bullet is a child of gameContainer before attempting to remove
            if (bullet.parentNode === gameContainer) {
                gameContainer.removeChild(bullet);
            }
        } else {
            requestAnimationFrame(moveBullet);
        }
    }
    

    moveBullet();
}

const deathScreen = document.getElementById("death-screen");

function checkPlayerHP() {
    if (playerHP <= 0) {
        showDeathScreen();
    }
}

function showDeathScreen() {
    deathScreen.style.display = "block";
}

function restartGame() {
    // Reset game state
    playerHP = 10;
    level = 1;

    // Remove existing enemies from the DOM
    enemies.forEach((enemy) => {
        gameContainer.removeChild(enemy.element);
    });

    enemies = []; // Clear the enemies array
    deathScreen.style.display = "none";
    gameLoop(); // Restart the game loop
}

function gameLoop() {
    spawnEnemy();
    updateEnemies();
    checkPlayerHP();

    // Call the gameLoop function again after a delay
    setTimeout(gameLoop, 1000 - (level * 100));
}

// Event listener for left-click to shoot
document.addEventListener("click", shoot);

// Start the game loop
gameLoop();
