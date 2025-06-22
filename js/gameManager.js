// gameManager.js
// This file manages the game state, scene transitions, and combat logic for a turn-based RPG.

// ============================= Imports =============================
import { Player } from './player.js';
import { Combat } from './combat.js';
import { UI } from './ui.js';
import { story } from './story.js';
import { validateStory } from './debugger.js';
import { devLog, devWarn, devError, isDev } from './debugger.js';

// ============================= Debugging and Validation =============================
if (isDev) {
  validateStory(story);
}

// ============================= Game State =============================
let player = new Player();  // Uses the updated playerName from player.js
let currentEnemy = null;
let combat = null;
const ui = new UI(player, null);

// ============================= Scene Management =============================
async function goToScene(sceneName, params = {}) {
  try {
    const scene = story.getScene(sceneName); // already safe
    story.currentScene = sceneName;
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

// ============================= Rendering =============================

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

      // Disable all choice buttons to prevent multiple clicks
      ui.choicesContainer.querySelectorAll('button').forEach(b => b.disabled = true);

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

  ui.storyTextEl.textContent = scene.text || "The story fades into silence...";
  ui.clearChoices();

  if (scene.encounter && !combat) {
    renderCombat(scene);
  } else {
    renderChoices(scene);
  }

  ui.updateStats();
}

function createContinueButton(nextScene, result = null, message = null) {
  if (message) ui.logCombat("\n" + message);
  
  ui.createChoiceButton('Continue', async () => {
    ui.clearChoices();
    await new Promise(r => setTimeout(r, 0));
    await story.setScene(nextScene, player, { result, message });
    renderScene();
  });
}

// ============================= Combat End Handling =============================
window.addEventListener('combatEnded', async (e) => {
  const detail = e.detail || {};
  const result = e.detail?.result;
  const message = e.detail?.message;

  clearCombatState();

  if (detail.result === 'gameOver') {
    const nextScene = 'gameOver';
    ui.clearChoices();
    ui.logCombat("\n💀 You were defeated and lost all your lives.\n");

    createContinueButton(nextScene, detail.result);

    ui.updateStats();
    return;
  }

  if (['playerDefeated', 'enemyDefeated'].includes(detail.result)) {
    const nextScene = getSafeNextScene();
    ui.clearChoices();
    createContinueButton(nextScene, detail.result, detail.message);
    ui.updateStats();
    return;
  }

});

// ============================= Game Initialization =============================
async function startGame() {
  await goToScene('start');
}
startGame();