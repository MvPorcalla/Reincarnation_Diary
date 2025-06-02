// enemy.js
export class Enemy {
  constructor({ name, maxHealth, damage, critChance, tier, agi = 0, imageSrc }) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.damage = damage;
    this.critChance = critChance;
    this.tier = tier;
    this.agi = agi;  // Set agility here
    this.imageSrc = imageSrc;

    // Add a callback function or event emitter for logging combat, or remove if not needed here
    this.onCombatLog = null; 
  }

  attack() {
    const isCrit = Math.random() < this.critChance;
    const dmg = isCrit ? this.damage * 2 : this.damage;
    return { damage: dmg, isCrit };
  }

  get dodgeChance() {
    // 2% dodge chance per agi point, max 30%
    return Math.min(this.agi * 0.02, 0.3);
  }

  takeDamage(amount) {
    if (Math.random() < this.dodgeChance) {
      // Use a callback or event to log combat messages instead of this.ui
      if (this.onCombatLog) this.onCombatLog(`${this.name} dodged the attack!`);
      return true; // attack dodged, no damage taken
    }
    this.health = Math.max(this.health - amount, 0);
    return false; // damage taken
  }

  isAlive() {
    return this.health > 0;
  }
}

// Factory function to create a new Enemy instance with given parameters
export function createEnemy(params) {
  return new Enemy(params);
}

export const enemyTiers = {
  1: [
    createEnemy({
      name: "Goblin",
      maxHealth: 60,
      damage: 9,
      critChance: 0.1,
      tier: 1,
      agi: 8,  // Add agility here
      imageSrc: './assets/enemies/goblin-girl.png'
    }),
    createEnemy({
      name: "Slime",
      maxHealth: 50,
      damage: 5,
      critChance: 0.05,
      tier: 1,
      agi: 5,
      imageSrc: './assets/enemies/slime-girl.png'
    }),
    createEnemy({
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
    createEnemy({
      name: "Orc",
      maxHealth: 1050,
      damage: 20,
      critChance: 0.15,
      tier: 2,
      agi: 7,
      imageSrc: './assets/enemies/orc-girl.png'
    }),
    createEnemy({
      name: "Skeleton",
      maxHealth: 640,
      damage: 20,
      critChance: 0.12,
      tier: 2,
      agi: 6,
      imageSrc: './assets/enemies/sampleasset.png'
    }),
  ],
};

