// story.js
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
      text: "Something approaches...",
      choices: [
        { text: "Prepare to fight!", nextScene: 'encounterRandomEnemy' }
      ]
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
    }
  },

  getScene(sceneName) {
    return this.scenes[sceneName];
  },

 setScene(sceneName, player) {
  this.currentScene = sceneName;
  const scene = this.getScene(sceneName);
  // Call onEnter if defined (like resting to recover health)
  if (scene && typeof scene.onEnter === 'function') {
    scene.onEnter(player);
  }
}

};
