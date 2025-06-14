// story.js
import { getRandomEnemy } from './enemy.js';
import { createScene, recoverHealth } from './utils.js';

export const story = {
  currentScene: 'start',

  scenes: {
    start: createScene({
      id: 'start',
      text: "You wake up in a dark forest. What do you do?",
      choices: [
        { text: "Walk forward", nextScene: 'walkForwardEncounter' },
        { text: "Rest", nextScene: 'rest' },
      ],
      onEnter(player) {
        player.reset();
      }
    }),

    rest: createScene({
      id: 'rest',
      text: "You take a moment to rest.",
      choices: [],
      onEnter(player) {
        const chance = Math.random();
        if (chance < 0.5) {
          recoverHealth(player, 10);
          story.updateScene('rest', {
            text: "You recover 10 health. What next?",
            choices: [{ text: "Continue walking", nextScene: 'walkForwardEncounter' }]
          });
        } else {
          story.updateScene('rest', {
            text: "As you rest, an enemy approaches!",
            choices: [{ text: "Prepare to fight", nextScene: 'randomEncounterFight', params: { tier: 2 } }]
          });
        }
      }
    }),

    walkForwardEncounter: createScene({
      id: 'walkForwardEncounter',
      text: "You walk forward and encounter a wild enemy.",
      choices: [
        { text: "Fight", nextScene: 'randomEncounterFight', params: { tier: 1 } },
        { text: "Run away", nextScene: 'gameOver' }
      ]
    }),

    randomEncounterFight: createScene({
      id: 'randomEncounterFight',
      text: "The battle begins!",
      choices: [],
      async onEnter(player, params = {}) {
        const tier = params.tier || 1;
        try {
          const enemy = await getRandomEnemy(tier);
          this.encounter = enemy;
          player.currentEnemy = enemy;
          player.nextAfterBattleScene = 'postFightChoice';
          story.updateScene('randomEncounterFight', {
            text: `You fight the wild ${enemy.name}!`,
            choices: []
          });
        } catch (error) {
          story.updateScene('randomEncounterFight', {
            text: error.message,
            choices: [{ text: "Go back", nextScene: 'start' }]
          });
        }
      }
    }),

    postFightChoice: createScene({
      id: 'postFightChoice',
      text: "You defeated the enemy! What do you want to do?",
      choices: [
        { text: "Continue walking", nextScene: 'walkForwardAfterFight' },
        { text: "Rest", nextScene: 'rest' }
      ],
      onEnter(player) {
        delete player.currentEnemy;
        delete player.nextAfterBattleScene;
      }
    }),

    walkForwardAfterFight: createScene({
      id: 'walkForwardAfterFight',
      text: "You continue walking and see a mysterious temple ahead.",
      choices: [
        { text: "Enter the temple", nextScene: 'templeEntrance' },
        { text: "Ignore and keep walking", nextScene: 'templeLeave' }
      ]
    }),

    templeLeave: createScene({
      id: 'templeLeave',
      text: "You leave the temple and find a chest behind bushes.",
      choices: [
        { text: "Open the chest", nextScene: 'openChestEnd' },
        { text: "Ignore and end adventure", nextScene: 'gameOver' }
      ]
    }),

    openChestEnd: createScene({
      id: 'openChestEnd',
      text: "You open the chest and find gold and jewels.",
      choices: [
        { text: "End game", nextScene: 'gameOver' }
      ],
      onEnter(player) {
        player.inventory = player.inventory || { gold: 0, items: [] };
        player.inventory.gold += 200;
        console.log("You obtained 200 gold!");
      }
    }),

    templeEntrance: createScene({
      id: 'templeEntrance',
      text: "You cautiously enter the temple. Suddenly, a guardian appears!",
      choices: [
        { text: "Fight the Temple Guardian", nextScene: 'templeInnerFight', params: { tier: 2 } },
        { text: "Run away", nextScene: 'gameOver' }
      ]
    }),

    templeInnerFight: createScene({
      id: 'templeInnerFight',
      text: "The Temple Guardian stands before you!",
      choices: [],
      async onEnter(player, params = {}) {
        const tier = params.tier || 1;
        try {
          const enemy = await getRandomEnemy(tier);
          this.encounter = enemy;
          player.currentEnemy = enemy;
          player.nextAfterBattleScene = 'templeVictory';
          story.updateScene('templeInnerFight', {
            text: `You fight the Temple Guardian ${enemy.name}!`,
            choices: []
          });
        } catch (error) {
          story.updateScene('templeInnerFight', {
            text: error.message,
            choices: [{ text: "Go back", nextScene: 'start' }]
          });
        }
      }
    }),

    templeVictory: createScene({
      id: 'templeVictory',
      text: "You defeated the guardian and retrieve an ancient sword!",
      choices: [
        { text: "End game", nextScene: 'gameOver' }
      ],
      onEnter(player) {
        player.inventory = player.inventory || { gold: 0, items: [] };
        player.inventory.items.push("Ancient Sword");
        console.log("You obtained the ancient sword!");
        delete player.currentEnemy;
        delete player.nextAfterBattleScene;
      }
    }),

    gameOver: createScene({
      id: 'gameOver',
      text: "Your adventure ends here. Thanks for playing!",
      choices: [
        { text: "Summary", redirectTo: "./endScreen.html" }
      ]
    })
  },

  getScene(sceneName) {
    return this.scenes[sceneName] || this.scenes['gameOver'];
  },

  async setScene(sceneName, player, params = {}) {
    this.currentScene = sceneName;
    const scene = this.getScene(sceneName);
    if (scene?.onEnter) {
      await scene.onEnter(player, params);
    }
  },

  updateScene(sceneName, updates) {
    const scene = this.getScene(sceneName);
    if (scene) {
      Object.assign(scene, updates);
    }
  }
};

export async function onChoiceSelected(choice, player) {
  console.log('Choice selected:', choice);
  if (choice.redirectTo) {
    window.location.href = choice.redirectTo;
    return;
  }
  if (choice.params) {
    await story.setScene(choice.nextScene, player, choice.params);
  } else if (choice.nextScene) {
    await story.setScene(choice.nextScene, player);
  }
}
