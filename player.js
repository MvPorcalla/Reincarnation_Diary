// player.js
export class Player {
  constructor(name) {
    this.name = name;
    this.maxHealth = this.getRandomInt(80, 1120);
    this.health = this.maxHealth;

    this.str = this.getRandomInt(5, 12);
    this.agi = this.getRandomInt(5, 12); // Add agility
    this.int = this.getRandomInt(5, 12);
    this.chr = this.getRandomInt(5, 12);
    this.end = this.getRandomInt(5, 12);
    this.wis = this.getRandomInt(5, 12);
    this.soulPower = 50;
    this.baseDamage = this.getRandomInt(8, 12);
    this.critChance = Math.random() * 0.15;
    this.dodgeChance = 0.15; // 15% chance to dodge
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getItemDamageBonus() {
    return 0; // Placeholder
  }

  attack() {
    const baseDamage = this.baseDamage;
    const strBonus = Math.floor(this.str * 0.5);
    const itemBonus = this.getItemDamageBonus();
    const totalDamage = baseDamage + strBonus + itemBonus;

    const isCrit = Math.random() < this.critChance;
    const damage = isCrit ? totalDamage * 2 : totalDamage;

    return { damage, isCrit };
  }

  takeDamage(amount) {
    const dodgeChance = this.agi ? this.agi / 100 : this.dodgeChance; // Use AGI if available
    const dodged = Math.random() < dodgeChance;

    if (!dodged) {
      this.health = Math.max(this.health - amount, 0);
    }

    return dodged; // Return whether it was dodged
  }

  isAlive() {
    return this.health > 0;
  }
}
