// enemy.js
// This file defines the Enemy class and functions to manage enemy data and combat interactions.

import { calculateAttack } from './combatUtils.js';

export class Enemy {
  constructor({ name, maxHealth, damage, critChance, tier, agi = 0, imageSrc, defeatMessage }) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.damage = damage;
    this.critChance = critChance;
    this.tier = tier;
    this.agi = agi;
    this.imageSrc = imageSrc;
    this.defeatMessage = defeatMessage || `${name} has been defeated.`;
  }

  attack() {
    return calculateAttack({
      baseDamage: this.damage,
      critChance: this.critChance
    });
  }

  get dodgeChance() {
    return Math.min(this.agi * 0.02, 0.3);
  }

  takeDamage(amount) {
    if (Math.random() < this.dodgeChance) {
      return true;
    }
    this.health = Math.max(this.health - amount, 0);
    return false;
  }

  isAlive() {
    return this.health > 0;
  }
}

// Factory function (optional, or just inline)
export function createEnemy(params) {
  return new Enemy(params);
}

// Change enemyTiers to store **functions** that return new Enemy instances
let enemyDataCache = null;

export async function loadEnemyData() {
  if (enemyDataCache) return enemyDataCache; // cache it after first load
  const response = await fetch('./assets/data/enemyData.json');
  if (!response.ok) {
    throw new Error('Failed to load enemy data');
  }
  enemyDataCache = await response.json();
  return enemyDataCache;
}

// Get random enemy from tier, asynchronously now
export async function getRandomEnemy(tier) {
  const enemyData = await loadEnemyData();

  const enemies = enemyData[tier];
  if (!enemies || enemies.length === 0) {
    throw new Error(`No enemies defined for tier ${tier}`);
  }

  const randomIndex = Math.floor(Math.random() * enemies.length);
  const enemyParams = enemies[randomIndex];
  return createEnemy(enemyParams);
}