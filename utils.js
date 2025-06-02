// utils.js

// ===================================  story.js  ===================================

export function createScene({ text, choices = [], onEnter = null }) {
  return { text, choices, onEnter };
}

export function recoverHealth(player, amount) {
  player.health = Math.min(player.health + amount, player.maxHealth);
  console.log(`Health recovered! Current health: ${player.health}`);
}

export function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===================================  story.js  ===================================
