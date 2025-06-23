// enemy.js
// This file defines the Enemy class and functions to manage enemy data and combat interactions.

import { calculateAttack } from './combatUtils.js';
import { devLog, devWarn, devError, throwError, isDev } from './debugger.js';

// ============================= Enemy Class =============================
export class Enemy {
  // ======================= Game Initialization =======================
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

  // ======================= Combat Actions =======================
  attack() {
    return calculateAttack({
      baseDamage: this.damage,
      critChance: this.critChance
    });
  }

  get dodgeChance() {
    return Math.min(this.agi * 0.02, 0.3); // AGI-based dodge cap at 30%
  }

  takeDamage(amount) {
    if (Math.random() < this.dodgeChance) {
      return true; // Dodged
    }
    this.health = Math.max(this.health - amount, 0);
    return false; // Took damage
  }

  isAlive() {
    return this.health > 0;
  }

  // ======================= Optional Utility =======================
  resetHealth() {
    this.health = this.maxHealth;
  }
}

// ============================= Enemy Factory =============================
export function createEnemy(params) {
  const enemy = new Enemy(params);
  devLog(`⚔️ Enemy created: ${enemy.name} (Tier ${enemy.tier})`);
  return enemy;
}

// ============================= Enemy Data Loader =============================

const enemyDataCache = { current: null }; // ✅ Const object for safe mutation

export async function loadEnemyData() {
  if (enemyDataCache.current) return enemyDataCache.current; // Return cached data

  try {
    const response = await fetch('./assets/data/enemyData.json');
    if (!response.ok) {
      throwError('❌ Failed to load enemy data.', 'loadEnemyData');
    }

    enemyDataCache.current = await response.json();
    return enemyDataCache.current;

  } catch (error) {
    throwError(`❌ Error loading enemy data: ${error.message}`, 'loadEnemyData');
  }
}

// ============================= Enemy Generator =============================
export async function getRandomEnemy(tier) {
  const enemyData = await loadEnemyData();

  const enemies = enemyData[tier];
  if (!enemies || enemies.length === 0) {
    throwError(`❌ No enemies defined for tier ${tier}`, 'getRandomEnemy');
  }

  const randomIndex = Math.floor(Math.random() * enemies.length);
  const enemyParams = enemies[randomIndex];
  return createEnemy(enemyParams);
}
