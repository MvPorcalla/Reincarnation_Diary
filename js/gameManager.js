// gameManager.js
import { setPlayerName, Player } from './player.js';
import { createEnemy } from './enemy.js';
import { Combat } from './combat.js';
import { UI } from './ui.js';
import { story } from './story.js';
import { validateStory } from './debugger.js';
import { devLog, devWarn, devError, isDev } from './debugger.js';



// ============================= Debugging and Validation =============================

if (isDev) {
  validateStory(story);
}
// ============================= Debugging and Validation =============================


let player = new Player();  // Uses the updated playerName from player.js
let currentEnemy = null;
let combat = null;

const ui = new UI(player, null);

// Change goToScene to async
async function goToScene(sceneName, params = {}) {
  try {
    const scene = story.getScene(sceneName); // already safe
    story.currentScene = sceneName;
    // Await onEnter if it exists and is async
    if (scene.onEnter) {
      const result = scene.onEnter(player, params);
      if (result instanceof Promise) await result;
    }
    renderScene();
  } catch (err) {
    if (isDev) {
      devWarn(`❌ Failed to load scene "${sceneName}":`, err);
    }
    await story.setScene('error', player);
    renderScene();
  }
}

async function renderScene() {
  const scene = story.getScene(story.currentScene);

  // Update story text
  ui.storyTextEl.textContent = scene.text;
  ui.clearChoices();

  if (scene.encounter && !combat) {
    currentEnemy = scene.encounter;  // enemy already created by story onEnter
    player.resetCombatHealth();  // Reset combat HP before new fight

    combat = new Combat(player, currentEnemy, ui);
    
    ui.enemy = currentEnemy;
    ui.clearCombatLog();
    ui.showEnemyInStory();

    ui.createChoiceButton('Attack', () => {
      combat.playerAttack();
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
        devError("No nextScene or redirectTo specified in choice:", choice);
      }
    });

    }
  }

  ui.updateStats();
}
async function resetGame() {
  player.reset();
  await story.setScene("start", player);
  renderScene();
}

function getSafeNextScene(fallback = 'start') {
  return story.getScene(player.nextAfterBattleScene)
    ? player.nextAfterBattleScene
    : fallback;
}

function clearCombatState() {
  combat = null;
  currentEnemy = null;
}

// Handle combat end event
window.addEventListener('combatEnded', (e) => {
  const detail = e.detail || {};

  // Always clear current combat state first
  clearCombatState();

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
    const nextScene = getSafeNextScene();
    ui.clearChoices();
    ui.createChoiceButton('Continue', async () => {

      ui.storyTextEl.textContent = "Loading...";
      ui.clearChoices(); // Optional: prevent choice spamming
      // Let the DOM update before awaiting
      await new Promise(resolve => setTimeout(resolve, 0)); // allow UI to repaint

      await story.setScene(nextScene, player);
      renderScene();
    });

    ui.updateStats();
    return;
  }

  // Enemy defeated
  if (detail.result === 'enemyDefeated') {
    const nextScene = getSafeNextScene();
    ui.clearChoices();
    ui.createChoiceButton('Continue', async () => {

      ui.storyTextEl.textContent = "Loading...";
      ui.clearChoices(); // Optional: prevent choice spamming
      // Let the DOM update before awaiting
      await new Promise(resolve => setTimeout(resolve, 0)); // allow UI to repaint

      await story.setScene(nextScene, player);
      renderScene();
    });

    ui.updateStats();
  }
});

// ============================= Game Initialization =============================
(async () => {
  await goToScene('start');
})();

