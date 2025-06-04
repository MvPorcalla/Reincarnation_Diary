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
export const enemyTiers = {
  1: [
    () => createEnemy({
      name: "Goblin",
      maxHealth: 60,
      damage: 9,
      critChance: 0.1,
      tier: 1,
      agi: 8,
      imageSrc: './assets/enemies/goblin-girl.png'
    }),
    () => createEnemy({
      name: "Slime",
      maxHealth: 50,
      damage: 5,
      critChance: 0.05,
      tier: 1,
      agi: 5,
      imageSrc: './assets/enemies/slime-girl.png'
    }),
    () => createEnemy({
      name: "Wild Bat",
      maxHealth: 50,
      damage: 6,
      critChance: 0.05,
      tier: 1,
      agi: 10,
      imageSrc: './assets/enemies/sampleasset.png'
    }),
  ],
  2: [
    () => createEnemy({
      name: "Orc",
      maxHealth: 110,
      damage: 20,
      critChance: 0.15,
      tier: 2,
      agi: 7,
      imageSrc: './assets/enemies/orc-girl.png'
    }),
    () => createEnemy({
      name: "Skeleton",
      maxHealth: 90,
      damage: 20,
      critChance: 0.12,
      tier: 2,
      agi: 6,
      imageSrc: './assets/enemies/sampleasset.png'
    }),
  ],
};

// Utility to get a random enemy instance from a tier
export function getRandomEnemy(tier) {
  const enemies = enemyTiers[tier];
  if (!enemies || enemies.length === 0) {
    throw new Error(`No enemies defined for tier ${tier}`);
  }
  const randomIndex = Math.floor(Math.random() * enemies.length);
  const enemyFactory = enemies[randomIndex];
  return enemyFactory(); // Create and return a fresh enemy instance
}