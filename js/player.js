// player.js

import { calculateAttack } from './combatUtils.js';

// List of random names
const randomNames = [
  "Aria", "Leo", "Mira", "Zane", "Luna", "Kai", "Nova", "Rex", "Sage", "Tara"
];

// Helper to get random name
function getRandomName() {
  return randomNames[Math.floor(Math.random() * randomNames.length)];
}

// Declare a global variable for player name inside this module, default random
export let playerName = getRandomName();

// A function to update the playerName variable
export function setPlayerName(name) {
  // Ensure name is not null/undefined, and slice to max 16 characters
  playerName = (name || getRandomName()).slice(0, 16);
}

// Player class uses the global playerName variable by default
export class Player {
  constructor(name = playerName) {
    this.name = name;
    this.setInitialStats();
  }

  // Generates all stat values
  generateStats() {
    return {
      maxHealth: this.getRandomInt(80, 120),

      maxLives: 3,

      str: this.getRandomInt(5, 12),
      agi: this.getRandomInt(5, 12),
      int: this.getRandomInt(5, 12),
      chr: this.getRandomInt(5, 12),
      end: this.getRandomInt(5, 12),
      wis: this.getRandomInt(5, 12),
      baseDamage: this.getRandomInt(8, 12),
      critChance: Math.random() * 0.15,
      dodgeChance: 0.15,
    
      soulPower: 50,

    };
  }

  // Applies generated stats to the player
  setInitialStats() {
    const stats = this.generateStats();

    this.maxHealth = stats.maxHealth;
    this.health = stats.maxHealth;
    this.maxLives = stats.maxLives;
    this.lives = stats.maxLives;

    this.str = stats.str;
    this.agi = stats.agi;
    this.int = stats.int;
    this.chr = stats.chr;
    this.end = stats.end;
    this.wis = stats.wis;
    this.soulPower = stats.soulPower;
    this.baseDamage = stats.baseDamage;
    this.critChance = stats.critChance;
    this.dodgeChance = stats.dodgeChance;
  }

  attack() {
    const bonus = Math.floor(this.str * 0.5) + this.getItemDamageBonus();
    return calculateAttack({
      baseDamage: this.baseDamage,
      critChance: this.critChance,
      bonus
    });
  }

  takeDamage(amount) {
    const dodgeChance = Math.min(this.agi * 0.03, 0.4); // AGI scaling with cap
    const dodged = Math.random() < dodgeChance;

    if (!dodged) {
      this.health = Math.max(this.health - amount, 0);
    }

    return dodged;
  }

  resetCombatHealth() {
    this.health = this.maxHealth;
  }

  reset() {
    this.setInitialStats();
  }

  loseLife() {
    if (this.lives > 0) this.lives--;
  }

  isOutOfLives() {
    return this.lives <= 0;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getItemDamageBonus() {
    return 0; // Placeholder
  }

  isAlive() {
    return this.health > 0;
  }
}
