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

    this.soulPower = 50;
    this.baseDamage = this.getRandomInt(8, 15);
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
    const dodged = Math.random() < this.dodgeChance;
    if (dodged) return false; // dodged the attack

    this.health = Math.max(this.health - amount, 0);
    return true; // took damage
  }

  isAlive() {
    return this.health > 0;
  }
}
