// gamemain.js
import { Player } from './player.js';
import { Combat } from './combat.js';
import { UI } from './ui.js';
import { story } from './story.js';
import { enemyTiers } from './enemy.js';

const player = new Player("Hero");
let currentEnemy = null;
let combat = null;

const ui = new UI(player, null);
const continueBtn = document.getElementById('continue-btn');

// Define the assignRandomEnemy function here or import it if in another file
function assignRandomEnemy() {
  const allEnemies = [...enemyTiers[1], ...enemyTiers[2]];
  const randomIndex = Math.floor(Math.random() * allEnemies.length);
  story.scenes.encounterRandomEnemy.encounter = allEnemies[randomIndex];
}

function goToScene(sceneName) {
  if (sceneName === 'encounterRandomEnemy') {
    assignRandomEnemy(); // assign a random enemy before entering that scene
  }

  story.setScene(sceneName, player);
  renderScene(sceneName);
}

function renderScene() {
  const scene = story.getScene(story.currentScene);
  ui.storyTextEl.textContent = scene.text;
  ui.clearChoices();

  if (scene.encounter) {
    // Clone enemy instance
    currentEnemy = Object.assign(Object.create(Object.getPrototypeOf(scene.encounter)), scene.encounter);
    combat = new Combat(player, currentEnemy, ui);
    ui.enemy = currentEnemy;

    // Show enemy info + combat log in story text
    ui.combatLog = '';
    ui.showEnemyInStory();

    ui.clearChoices();
    ui.createChoiceButton('Attack', () => {
      combat.playerAttack();
    });

    combat.start();

  } else {
    // Normal story display
    ui.enemy = null; // Clear enemy reference so UI doesn't show enemy info
    ui.storyTextEl.textContent = scene.text;
    ui.clearChoices();

    for (const choice of scene.choices) {
      ui.createChoiceButton(choice.text, () => {
        goToScene(choice.nextScene);  // Use goToScene here instead of story.setScene + renderScene
      });
    }
  }

  ui.updateStats();
}

// window.addEventListener('combatEnded', () => {
//   ui.enemy = null;         
//   ui.combatLog = '';       
//   story.setScene('start', player);  // pass player here too
//   renderScene();
//   ui.updateStats();
// });

window.addEventListener('combatEnded', (e) => {
  ui.enemy = null;         
  ui.combatLog = '';       

  // Show the continue button when combat ends
  continueBtn.hidden = false;

  // Disable combat buttons if any
  ui.clearChoices();

  // Assign a handler to continue button to move to the next scene or start
  continueBtn.onclick = () => {
    continueBtn.hidden = true;
    // Go back to a safe scene or whatever you want after combat
    story.setScene('start', player);
    renderScene();
    ui.updateStats();
  };

  // Optionally update UI to show player status etc.
});


// Start game at 'start' scene only
goToScene('start');
