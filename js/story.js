// story.js
import { getRandomEnemy } from './enemy.js';
import { createScene, recoverHealth } from './utils.js';

export const story = {
  currentScene: 'start',

  scenes: {
    start: createScene({
      text: "You wake up in a dark forest. What do you do?",
      choices: [
        { text: "Walk forward", nextScene: 'walkForwardEncounter' },
        { text: "Rest", nextScene: 'rest' },
      ]
    }),

    rest: createScene({
      text: "You take a moment to rest.",
      choices: [],
      onEnter(player, params) {
        const chance = Math.random();
        if (chance < 0.5) {
          recoverHealth(player, 10);
          this.text = "You recover 10 health. What next?";
          this.choices = [{ text: "Continue walking", nextScene: 'walkForwardEncounter' }];
        } else {
          this.text = "As you rest, an enemy approaches!";
          this.choices = [{ text: "Prepare to fight", nextScene: 'randomEncounterFight', params: { tier: 2 } }];
        }
      }
    }),

    walkForwardEncounter: createScene({
      text: "You walk forward and encounter a wild enemy.",
      choices: [
        { text: "Fight", nextScene: 'randomEncounterFight', params: { tier: 1 } },
        { text: "Run away", nextScene: 'gameOver' }
      ]
    }),

    randomEncounterFight: createScene({
  text: "The battle begins!",
  choices: [],
  async onEnter(player, params = {}) {   // <-- make async
    console.log('Entering randomEncounterFight with params:', params);
    const tier = params.tier || 1;
    try {
      const enemy = await getRandomEnemy(tier);   // <-- await here
      this.encounter = enemy;
      player.currentEnemy = enemy;
      player.nextAfterBattleScene = 'postFightChoice';

      this.text = `You fight the wild ${enemy.name}!`;
      this.choices = [];
    } catch (error) {
      this.text = error.message;
      this.choices = [{ text: "Go back", nextScene: 'start' }];
    }
  }
}),


    postFightChoice: createScene({
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
      text: "You continue walking and see a mysterious temple ahead.",
      choices: [
        { text: "Enter the temple", nextScene: 'templeEntrance' },
        { text: "Ignore and keep walking", nextScene: 'templeLeave' }
      ]
    }),

    templeLeave: createScene({
      text: "You leave the temple and find a chest behind bushes.",
      choices: [
        { text: "Open the chest", nextScene: 'openChestEnd' },
        { text: "Ignore and end adventure", nextScene: 'gameOver' }
      ]
    }),

    openChestEnd: createScene({
      text: "You open the chest and find gold and jewels.",
      choices: [
        { text: "End game", nextScene: 'gameOver' }
      ],
      onEnter(player) {
        player.gold = (player.gold || 0) + 200;
        console.log("You obtained 200 gold!");
      }
    }),

    templeEntrance: createScene({
      text: "You cautiously enter the temple. Suddenly, a guardian appears!",
      choices: [
        { text: "Fight the temple guardian", nextScene: 'templeInnerFight', params: { tier: 1 } },
        { text: "Run away", nextScene: 'gameOver' }
      ]
    }),

    templeInnerFight: createScene({
  text: "The temple guardian stands before you!",
  choices: [],
  async onEnter(player, params = {}) {
    console.log('Entering templeInnerFight with params:', params);

    const tier = params.tier || 1;
    try {
      const enemy = await getRandomEnemy(tier);
      this.encounter = enemy;

      player.currentEnemy = enemy;
      player.nextAfterBattleScene = 'templeVictory';

      this.text = `You fight the temple guardian ${enemy.name}!`;
      this.choices = [];
    } catch (error) {
      this.text = error.message;
      this.choices = [{ text: "Go back", nextScene: 'start' }];
    }
  }
}),


    templeVictory: createScene({
      text: "You defeated the guardian and retrieve an ancient sword!",
      choices: [
        { text: "End game", nextScene: 'gameOver' }
      ],
      onEnter(player) {
        player.hasSword = true;
        console.log("You obtained the ancient sword!");
        delete player.currentEnemy;
        delete player.nextAfterBattleScene;
      }
    }),

    gameOver: createScene({
      text: "Your adventure ends here. Thanks for playing!",
      choices: [{ text: "Restart Game", nextScene: 'start' }]
    })
  },

  getScene(sceneName) {
    return this.scenes[sceneName];
  },

  setScene(sceneName, player, params = {}) {
    this.currentScene = sceneName;
    const scene = this.getScene(sceneName);
    if (scene?.onEnter) {
      scene.onEnter(player, params);
    }
  }
};

// Example of choice selection handler you can use with this system
export function onChoiceSelected(choice, player) {
  console.log('Choice selected:', choice);
  if (choice.params) {
    console.log('Params:', choice.params);
    story.setScene(choice.nextScene, player, choice.params);
  } else {
    story.setScene(choice.nextScene, player);
  }
}
