// player.js
// This file defines the Player class and manages player-related functionality in the game.

import { calculateAttack } from './combatUtils.js';
import { devLog } from './debugger.js';

// ============================= Constants =============================

// List of random names
const randomNames = [
  "Aria", "Leo", "Mira", "Zane", "Luna", "Kai", "Nova", "Rex", "Sage", "Tara"
];

// ============================= Player Class =============================

export class Player {
  // ======================= Game Initialization =======================
  constructor() {
    this.name = Player.getRandomName(); // Always assign random name on creation
    this.setInitialStats();
    devLog(`🎮 New player created: ${this.name}`);
  }

  // ======================= Player Stats Generation =======================
  generateStats() {
    return {
      maxHealth: Player.getRandomInt(80, 120),
      maxLives: 2,

      str: Player.getRandomInt(5, 12),
      agi: Player.getRandomInt(5, 12),
      int: Player.getRandomInt(5, 12),
      chr: Player.getRandomInt(5, 12),
      end: Player.getRandomInt(5, 12),
      wis: Player.getRandomInt(5, 12),

      baseDamage: Player.getRandomInt(8, 12),
      critChance: Math.random() * 0.15,
      dodgeChance: 0.15,
      soulPower: 50,
    };
  }

  // ======================= Player Stats Setup =======================
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

    // Calculate initial dodge chance based on AGI
    this.dodgeChance = Math.min(this.agi * 0.03, 0.4);
  }

  // ======================= Combat Actions =======================
  attack() {
    const bonus = Math.floor(this.str * 0.5) + this.getItemDamageBonus();
    return calculateAttack({
      baseDamage: this.baseDamage,
      critChance: this.critChance,
      bonus
    });
  }

  takeDamage(amount) {
    const dodged = Math.random() < this.dodgeChance;

    if (!dodged) {
      this.health = Math.max(this.health - amount, 0);
    }

    return dodged;
  }

  resetCombatHealth() {
    this.health = this.maxHealth;
  }

  // ======================= Game State Management =======================
  reset() {
    this.setInitialStats();
    devLog(`🔄 Player ${this.name} stats have been reset.`);
  }

  loseLife() {
    if (this.lives > 0) this.lives--;
  }

  isOutOfLives() {
    return this.lives <= 0;
  }

  isAlive() {
    return this.health > 0;
  }

  // ======================= Utility Methods =======================
  getItemDamageBonus() {
    return 0; // Placeholder for future item bonuses
  }

  static getRandomInt(min, max) {
    if (min > max) [min, max] = [max, min]; // Swap if accidentally reversed
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomName() {
    return randomNames[Math.floor(Math.random() * randomNames.length)];
  }
}
