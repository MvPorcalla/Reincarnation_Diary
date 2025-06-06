// player.js

// List of random names
const randomNames = [
  "Aria", "Leo", "Mira", "Zane", "Luna", "Kai", "Nova", "Rex", "Sage", "Tara"
];

// Helper to get random name
function getRandomName() {
  return randomNames[Math.floor(Math.random() * randomNames.length)];
}

// Declare a global variable for player name inside this module, default random
export let playerName = getRandomName();

// A function to update the playerName variable
export function setPlayerName(name) {
  // Ensure name is not null/undefined, and slice to max 12 characters
  playerName = (name || getRandomName()).slice(0, 16);
}
 

// Player class uses the global playerName variable by default
export class Player {
  constructor(name = playerName) {
    this.name = name;
    this.maxHealth = this.getRandomInt(80, 120);
    this.health = this.maxHealth;
    this.str = this.getRandomInt(5, 12);
    this.agi = this.getRandomInt(5, 12);
    this.int = this.getRandomInt(5, 12);
    this.chr = this.getRandomInt(5, 12);
    this.end = this.getRandomInt(5, 12);
    this.wis = this.getRandomInt(5, 12);
    this.soulPower = 50;
    this.baseDamage = this.getRandomInt(8, 12);
    this.critChance = Math.random() * 0.15;
    this.dodgeChance = 0.15;
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
    const dodgeChance = Math.min(this.agi * 0.03, 0.4); // AGI scaling with cap
    const dodged = Math.random() < dodgeChance;

    if (!dodged) {
      this.health = Math.max(this.health - amount, 0);
    }

    return dodged;
  }

  isAlive() {
    return this.health > 0;
  }
}
