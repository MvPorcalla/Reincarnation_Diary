// gamemain.js
import { Player } from './player.js';
import { Combat } from './combat.js';
import { UI } from './ui.js';
import { story } from './story.js';
import { enemyTiers } from './enemy.js';

let player = new Player("Hero");
let currentEnemy = null;
let combat = null;

const ui = new UI(player, null);

// Button elements
const continueBtn = document.getElementById('continue-btn');
const endGameBtn = document.getElementById('end-game-btn');

continueBtn.hidden = true;
endGameBtn.hidden = true; // Hide End Game at the start

function assignRandomEnemy() {
  const allEnemies = [...enemyTiers[1], ...enemyTiers[2]];
  const randomIndex = Math.floor(Math.random() * allEnemies.length);
  story.scenes.encounterRandomEnemy.encounter = allEnemies[randomIndex];
}

function goToScene(sceneName) {
  if (sceneName === 'encounterRandomEnemy') {
    assignRandomEnemy();
  }

  story.setScene(sceneName, player);
  renderScene();
}

function renderScene() {
  const scene = story.getScene(story.currentScene);
  ui.storyTextEl.textContent = scene.text;
  ui.clearChoices();

  if (scene.encounter) {
    // Initialize combat
    currentEnemy = Object.assign(Object.create(Object.getPrototypeOf(scene.encounter)), scene.encounter);
    combat = new Combat(player, currentEnemy, ui);
    ui.enemy = currentEnemy;
    ui.combatLog = '';

    ui.showEnemyInStory();
    ui.createChoiceButton('Attack', () => {
      combat.playerAttack();

      // Check for player defeat after attack
      if (player.health <= 0) {
        gameOver();
      }
    });

    combat.start();
  } else {
    // Standard story scene
    ui.enemy = null;

    for (const choice of scene.choices) {
      ui.createChoiceButton(choice.text, () => {
        goToScene(choice.nextScene);
      });
    }
  }

  ui.updateStats();
}

function gameOver() {
  ui.storyTextEl.textContent = "💀 Game Over! You have been defeated.";
  ui.clearChoices();
  endGameBtn.hidden = false;  // Show End Game button
  continueBtn.hidden = true;
}

function resetGame() {
  player = new Player("Hero");
  ui.player = player;
  ui.enemy = null;
  endGameBtn.hidden = true;
  continueBtn.hidden = true;

  story.setScene('start', player);
  renderScene();
  ui.updateStats();
}

// When combat ends
window.addEventListener('combatEnded', (e) => {
  const result = e.detail.result;

  if (result === 'playerDefeated') {
    gameOver();
    return;
  }

  // Otherwise, combat ended normally
  ui.enemy = null;
  ui.combatLog = '';
  continueBtn.hidden = false;
  ui.clearChoices();

  continueBtn.onclick = () => {
    continueBtn.hidden = true;
    story.setScene('start', player);
    renderScene();
    ui.updateStats();
  };
});


// End Game button handler
endGameBtn.addEventListener('click', () => {
  resetGame();
});


// Start the game at the initial scene
goToScene('start');
