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

function renderCombat(scene) {
  currentEnemy = scene.encounter;
  player.resetCombatHealth();

  combat = new Combat(player, currentEnemy, ui);

  ui.enemy = currentEnemy;
  ui.clearCombatLog();
  ui.showEnemyInStory();

  ui.createChoiceButton('Attack', () => {
    combat.playerAttack();
  });

  combat.start();
}

function renderChoices(scene) {
  ui.enemy = null;

  scene.choices.forEach(choice => {
    ui.createChoiceButton(choice.text, () => {
      if (choice.redirectTo) {
        window.location.href = choice.redirectTo;
        return;
      }

      if (choice.nextScene) {
        goToScene(choice.nextScene, choice.params || {});
      } else {
        devError("⚠️ No nextScene or redirectTo specified in choice:", choice);
      }
    });
  });
}

async function renderScene() {
  const scene = story.getScene(story.currentScene);

  ui.storyTextEl.textContent = scene.text;
  ui.clearChoices();

  if (scene.encounter && !combat) {
    renderCombat(scene);
  } else {
    renderChoices(scene);
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

function createContinueButton(nextScene, result = null) {
  ui.createChoiceButton('Continue', async () => {
    ui.storyTextEl.textContent = "Loading...";
    ui.clearChoices();
    await new Promise(r => setTimeout(r, 0));

    // Pass result as param
    await story.setScene(nextScene, player, result ? { result } : {});
    renderScene();
  });
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

  // Player or enemy defeated
  if (['playerDefeated', 'enemyDefeated'].includes(detail.result)) {
    const nextScene = getSafeNextScene();
    ui.clearChoices();
    createContinueButton(nextScene, detail.result); // ✅ Pass result
    ui.updateStats();
    return;
  }

});

// ============================= Game Initialization =============================
(async () => {
  await goToScene('start');
})();