// gameManager.js
import { setPlayerName, Player } from './player.js';
import { createEnemy } from './enemy.js';
import { Combat } from './combat.js';
import { UI } from './ui.js';
import { story } from './story.js';
import { validateStory } from './debugger.js';

// ============================= Debugging and Validation =============================
const isDev = true; // Set to false before deploying

if (isDev) {
  validateStory(story);
}
// ============================= Debugging and Validation =============================

// ============================= This is important dont remove =============================
// Function to ask for player name (can replace prompt with UI later)
// function askForPlayerName() {
//   const name = prompt("Enter your player name (leave blank for random):");
//   setPlayerName(name);
// }
// Ask for player name before creating player
// askForPlayerName();
// ============================= This is important dont remove =============================

let player = new Player();  // Uses the updated playerName from player.js
let currentEnemy = null;
let combat = null;

const ui = new UI(player, null);

// Change goToScene to async
async function goToScene(sceneName, params = {}) {
  story.currentScene = sceneName;  // set currentScene first
  const scene = story.getScene(sceneName);

  // Await onEnter if it exists and is async
  if (scene.onEnter) {
    // Check if onEnter returns a Promise (is async)
    const result = scene.onEnter(player, params);
    if (result instanceof Promise) {
      await result;
    }
  }

  renderScene();
}

function renderScene() {
  const scene = story.getScene(story.currentScene);

  // Update story text
  ui.storyTextEl.textContent = scene.text;
  ui.clearChoices();

  if (scene.encounter) {
    currentEnemy = scene.encounter;  // enemy already created by story onEnter
    player.resetCombatHealth();  // Reset combat HP before new fight

    combat = new Combat(player, currentEnemy, ui);
    ui.enemy = currentEnemy;
    ui.combatLog = '';

    ui.showEnemyInStory();

    ui.createChoiceButton('Attack', () => {
      combat.playerAttack();

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
      if (choice.redirectTo) {
        window.location.href = choice.redirectTo;
        return;
      }

      if (choice.nextScene) {
        goToScene(choice.nextScene, choice.params || {});
      } else {
        console.error("No nextScene or redirectTo specified in choice:", choice);
      }
    });

    }
  }

  ui.updateStats();
}

function resetGame() {
  player.reset(); // Reset stats, lives, etc.
  story.setScene("start", player);
  renderScene();
}

// Handle combat end event
window.addEventListener('combatEnded', (e) => {
  const detail = e.detail || {};

  if (detail.result === 'gameOver') {
    ui.storyTextEl.textContent = "💀 Game Over! You have no lives left.";
    ui.clearChoices();
    ui.createChoiceButton('Restart', () => {
      resetGame();
    });
    return;
  }

  // Player defeated but still has lives
  if (detail.result === 'playerDefeated') {
    const nextScene = player.nextAfterBattleScene || 'start';
    story.setScene(nextScene, player);

    ui.clearChoices();
    ui.createChoiceButton('Continue', () => {
      renderScene();
    });

    ui.updateStats();
    return;
  }

  // Enemy defeated
  if (detail.result === 'enemyDefeated') {
    const nextScene = player.nextAfterBattleScene || 'start';
    story.setScene(nextScene, player);

    ui.clearChoices();
    ui.createChoiceButton('Continue', () => {
      renderScene();
    });

    ui.updateStats();
  }
});

// ============================= Game Initialization =============================
(async () => {
  await goToScene('start');
})();

