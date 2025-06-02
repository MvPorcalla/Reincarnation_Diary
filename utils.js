// utils.js

// ===================================  story.js  ===================================

export function createScene({ text, choices = [], onEnter = null, encounter = null }) {
  return { text, choices, onEnter, encounter };
}

export function getRandomElement(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function recoverHealth(player, amount) {
  player.health = Math.min(player.health + amount, player.maxHealth);
  console.log(`Health recovered! Current health: ${player.health}`);
}

// ===================================  story.js  ===================================