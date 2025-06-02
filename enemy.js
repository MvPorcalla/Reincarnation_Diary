// enemy.js
export class Enemy {
  constructor({ name, maxHealth, damage, critChance, tier, imageSrc }) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.damage = damage;
    this.critChance = critChance;
    this.tier = tier;
    this.imageSrc = imageSrc;
  }

  attack() {
    const isCrit = Math.random() < this.critChance;
    const dmg = isCrit ? this.damage * 2 : this.damage;
    return { damage: dmg, isCrit };
  }

  takeDamage(amount) {
    this.health = Math.max(this.health - amount, 0);
  }

  isAlive() {
    return this.health > 0;
  }
}

// Factory helper for ease of adding enemies
function createEnemy(params) {
  return new Enemy(params);
}

export const enemyTiers = {
  1: [
    createEnemy({
      name: "Goblin",
      maxHealth: 60,
      damage: 5,
      critChance: 0.1,
      tier: 1,
      imageSrc: './assets/enemies/goblin-girl.png'
    }),
    createEnemy({
      name: "Slime",
      maxHealth: 50,
      damage: 4,
      critChance: 0.05,
      tier: 1,
      imageSrc: './assets/enemies/slime-girl.png'
    }),
    createEnemy({
      name: "Bat",
      maxHealth: 50,
      damage: 4,
      critChance: 0.05,
      tier: 1,
      imageSrc: './assets/enemies/sampleasset.png'
    }),
  ],
  2: [
    createEnemy({
      name: "Orc",
      maxHealth: 1050,
      damage: 10,
      critChance: 0.15,
      tier: 2,
      imageSrc: './assets/enemies/orc-girl.png'
    }),
    createEnemy({
      name: "Skeleton",
      maxHealth: 640,
      damage: 8,
      critChance: 0.12,
      tier: 2,
      imageSrc: './assets/enemies/sampleasset.png'
    }),
  ],
};
