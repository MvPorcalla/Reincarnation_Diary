// enemy.js
export class Enemy {
  constructor({ name, maxHealth, damage, critChance, tier, agi = 0, imageSrc }) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.damage = damage;
    this.critChance = critChance;
    this.tier = tier;
    this.agi = agi;
    this.imageSrc = imageSrc;
    this.onCombatLog = null;
  }

  attack() {
    const isCrit = Math.random() < this.critChance;
    const dmg = isCrit ? this.damage * 2 : this.damage;
    return { damage: dmg, isCrit };
  }

  get dodgeChance() {
    return Math.min(this.agi * 0.02, 0.3);
  }

  takeDamage(amount) {
    if (Math.random() < this.dodgeChance) {
      if (this.onCombatLog) this.onCombatLog(`${this.name} dodged the attack!`);
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