// gamemain.js
import { Player } from './player.js';
import { createEnemy } from './enemy.js';
import { Combat } from './combat.js';
import { UI } from './ui.js';
import { story } from './story.js';
import { validateStory } from './debugger.js';

// ============================= Debbugging and Validation =============================
// Validate the story structure before starting the game
const isDev = true; // Set to false before deploying

if (isDev) {
  validateStory(story);
}
// ============================= Debbugging and Validation =============================


let player = new Player("Hero");
let currentEnemy = null;
let combat = null;

const ui = new UI(player, null);

function goToScene(sceneName, params = {}) {
  story.setScene(sceneName, player);

  const scene = story.getScene(sceneName);

  // Trigger onEnter if exists
  if (scene.onEnter) {
    scene.onEnter(player, params);
  }

  renderScene();
}

function renderScene() {
  const scene = story.getScene(story.currentScene);

  // Update story text
  ui.storyTextEl.textContent = scene.text;
  ui.clearChoices();

  // Combat scene
  if (scene.encounter) {
    // Clone enemy by creating a new Enemy instance using the original enemy's properties
      // currentEnemy = Object.assign(Object.create(Object.getPrototypeOf(scene.encounter)), scene.encounter);
    currentEnemy = createEnemy({
      name: scene.encounter.name,
      maxHealth: scene.encounter.maxHealth,
      damage: scene.encounter.damage,
      critChance: scene.encounter.critChance,
      tier: scene.encounter.tier,
      imageSrc: scene.encounter.imageSrc
    });

    combat = new Combat(player, currentEnemy, ui);
    ui.enemy = currentEnemy;
    ui.combatLog = '';

    ui.showEnemyInStory();

    // Add attack button
    ui.createChoiceButton('Attack', () => {
      combat.playerAttack();

      // Check if player is defeated right after attack
      if (player.health <= 0) {
        gameOver();
      }
    });

    combat.start();
  } else {
    // Non-combat scene: show choices
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
  ui.createChoiceButton('Restart', () => {
    resetGame();
  });
}

function resetGame() {
  player = new Player("Hero");
  ui.player = player;
  ui.enemy = null;

  story.setScene('start', player);
  renderScene();
  ui.updateStats();
}

// Handle combat end event
window.addEventListener('combatEnded', (e) => {
  const detail = e.detail || {};

  if (detail.result === 'playerDefeated') {
    gameOver();
    return;
  }

  // Player won
  const nextScene = player.nextAfterBattleScene || 'start';
  story.setScene(nextScene, player);

  // Show Continue button
  ui.clearChoices();
  ui.createChoiceButton('Continue', () => {
    renderScene();
  });

  ui.updateStats();
});

// Start the game at the initial scene
goToScene('start');
