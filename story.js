import { enemyTiers } from './enemy.js';

export const story = {
  currentScene: 'start',
  playerHealth: 100,

  scenes: {
    start: {
      text: "You wake up in a dark forest. What do you do?",
      choices: [
        { text: "Walk forward", nextScene: 'randomEncounter' },
        { text: "Rest", nextScene: 'rest' },
        { text: "Climb a tree to get a better view", nextScene: 'treeView' },
        { text: "Call out for help", nextScene: 'callForHelp' }
      ]
    },

    rest: {
      text: "You take a moment to rest and recover 10 health.",
      choices: [
        { text: "Continue walking", nextScene: 'randomEncounter' }
      ],
      onEnter(player) {
        player.health = Math.min(player.health + 10, player.maxHealth);
        console.log(`Health recovered! Current health: ${player.health}`);
      }
    },

    randomEncounter: {
      text: "Something approaches from the shadows...",
      choices: [
        { text: "Prepare to fight!", nextScene: 'encounterRandomEnemy' },
        { text: "Try to sneak past", nextScene: 'sneakAttempt' }
      ]
    },

    sneakAttempt: {
      text: "You attempt to sneak past the enemy...",
      choices: [],
      onEnter(player) {
        const success = Math.random() < 0.5;
        if (success) {
          this.text = "You successfully sneak past the enemy and see a path forward.";
          this.choices = [
            { text: "Follow the path", nextScene: 'findChest' }
          ];
        } else {
          this.text = "You fail to sneak past and the enemy attacks!";
          this.choices = [
            { text: "Prepare to fight!", nextScene: 'encounterRandomEnemy' }
          ];
        }
      }
    },

    encounterRandomEnemy: {
      text: "You face an enemy!",
      encounter: null,
      choices: [],
      onEnter(player) {
        // Flatten all tiers into one array
        const allEnemies = Object.values(enemyTiers).flat();
        const randomEnemy = allEnemies[Math.floor(Math.random() * allEnemies.length)];
        this.encounter = randomEnemy;
        this.text = `A wild ${randomEnemy.name} appears!`;
        this.choices = [
          { text: "Fight", nextScene: 'gameOver' } // Replace 'gameOver' with your combat resolution
        ];
        console.log(`Encountered: ${randomEnemy.name}`);
      }
    },

    findChest: {
      text: "After the fight, you find a mysterious chest partially buried in the ground.",
      choices: [
        { text: "Open the chest", nextScene: 'openChest' },
        { text: "Ignore it and move on", nextScene: 'forestPath' }
      ]
    },

    openChest: {
      text: "You open the chest slowly. Inside you find a treasure of gold and a magical amulet.",
      choices: [
        { text: "Take the treasure and amulet", nextScene: 'gameOver' }
      ],
      onEnter(player) {
        player.gold = (player.gold || 0) + 100;
        player.hasAmulet = true;
        console.log("You obtained 100 gold and a magical amulet!");
      }
    },

    forestPath: {
      text: "You decide to ignore the chest and continue down the forest path.",
      choices: [
        { text: "Keep going", nextScene: 'gameOver' }
      ]
    },

    gameOver: {
      text: "Your adventure ends here. Thanks for playing!",
      choices: [
        { text: "Restart Game", nextScene: 'start' }
      ]
    },

    treeView: {
      text: "You climb a tall tree and spot a village in the distance.",
      choices: [
        { text: "Head towards the village", nextScene: 'village' },
        { text: "Climb down and explore the forest", nextScene: 'randomEncounter' }
      ]
    },

    callForHelp: {
      text: "You call out for help loudly. After a moment, you hear a response!",
      choices: [
        { text: "Follow the voice", nextScene: 'friendlyTraveler' },
        { text: "Ignore and continue wandering", nextScene: 'randomEncounter' }
      ]
    },

    village: {
      text: "You arrive at the village, safe and sound. Your adventure continues peacefully.",
      choices: [
        { text: "Restart Game", nextScene: 'start' }
      ]
    },

    friendlyTraveler: {
      text: "A friendly traveler finds you and offers to guide you out of the forest.",
      choices: [
        { text: "Accept help", nextScene: 'gameOver' },
        { text: "Politely decline and go alone", nextScene: 'randomEncounter' }
      ]
    },
  },

  getScene(sceneName) {
    return this.scenes[sceneName];
  },

  setScene(sceneName, player) {
    this.currentScene = sceneName;
    const scene = this.getScene(sceneName);
    if (scene && typeof scene.onEnter === 'function') {
      scene.onEnter(player);
    }
  }
};
