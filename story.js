import { enemyTiers } from './enemy.js';

export const story = {
  currentScene: 'start',
  playerHealth: 100,  // Starting health for the player

  scenes: {
    start: {
      text: "You wake up in a dark forest. What do you do?",
      choices: [
        { text: "Walk forward", nextScene: 'randomEncounter' },
        { text: "Rest", nextScene: 'rest' }
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
        // Simple sneak chance: 50% success
        const success = Math.random() < 0.5;
        if(success) {
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

    encounterGoblin: {
      text: "A Goblin jumps out to attack!",
      encounter: enemyTiers[1][0], // Goblin enemy from tier 1
      choices: []
    },

    encounterSlime: {
      text: "A Slime oozes towards you!",
      encounter: enemyTiers[1][1], // Slime enemy from tier 1
      choices: []
    },

    encounterOrc: {
      text: "A fierce Orc blocks your path!",
      encounter: enemyTiers[2][0], // Orc enemy from tier 2
      choices: []
    },

    encounterSkeleton: {
      text: "A rattling Skeleton attacks!",
      encounter: enemyTiers[2][1], // Skeleton enemy from tier 2
      choices: []
    },

    encounterRandomEnemy: {
      text: "You face an enemy!",
      encounter: null, // will be assigned dynamically in game logic
      choices: []
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
    }

  },

  getScene(sceneName) {
    return this.scenes[sceneName];
  },

  setScene(sceneName, player) {
    this.currentScene = sceneName;
    const scene = this.getScene(sceneName);
    // Call onEnter if defined (like resting to recover health or sneak attempt)
    if (scene && typeof scene.onEnter === 'function') {
      scene.onEnter(player);
    }
  }
};
