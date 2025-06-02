// enemy.js
export class Enemy {
  constructor({ name, maxHealth, damage, critChance, tier, imageSrc }) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.damage = damage;
    this.critChance = critChance;
    this.tier = tier;
    this.imageSrc = imageSrc; // add this line
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

export const enemyTiers = {
  1: [
    new Enemy({ 
      name: "Goblin", 
      maxHealth: 130, 
      damage: 5, 
      critChance: 0.1, 
      tier: 1,
        imageSrc: './assets/enemies/goblin-girl.png'
    }),
    new Enemy({ 
      name: "Slime", 
      maxHealth: 525, 
      damage: 4, 
      critChance: 0.05, 
      tier: 1,
      imageSrc: './assets/enemies/slime-girl.png' // path to slime image
    }),
  ],
  2: [
    new Enemy({ 
      name: "Orc", 
      maxHealth: 1050, 
      damage: 10, 
      critChance: 0.15, 
      tier: 2,
      imageSrc: './assets/enemies/orc-girl.png' 
    }),
    new Enemy({ 
      name: "Skeleton", 
      maxHealth: 640, 
      damage: 8, 
      critChance: 0.12, 
      tier: 2,
      imageSrc: './assets/enemies/sampleasset.png' 
    }),
  ],
};

