export class Player {
  constructor(name) {
    this.name = name;
    this.maxHealth = this.getRandomInt(80, 120);
    this.health = this.maxHealth;
    this.str = this.getRandomInt(5, 15);
    this.int = this.getRandomInt(5, 15);
    this.chr = this.getRandomInt(5, 15);
    this.end = this.getRandomInt(5, 15);
    this.wis = this.getRandomInt(5, 15);

    this.soulPower = 50;   // Fixed at 50

    this.baseDamage = this.getRandomInt(8, 15);
    this.critChance = Math.random() * 0.15;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  attack() {
    const isCrit = Math.random() < this.critChance;
    const damage = isCrit ? this.baseDamage * 2 : this.baseDamage;
    return { damage, isCrit };
  }

  takeDamage(amount) {
    this.health = Math.max(this.health - amount, 0);
  }

  isAlive() {
    return this.health > 0;
  }
}
