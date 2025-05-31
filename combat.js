// combat.js
import { Player } from './player.js';
import { Enemy } from './enemy.js';

export class Combat {
  constructor(player, enemy, ui) {
    this.player = player;
    this.enemy = enemy;
    this.ui = ui;
    this.turn = 'player'; // or 'enemy'
  }

  playerAttack() {
    if (this.turn !== 'player') return;
    const { damage, isCrit } = this.player.attack();
    this.enemy.takeDamage(damage);
    this.ui.logCombat(`You dealt ${damage} damage${isCrit ? ' (Critical!)' : ''} to ${this.enemy.name}.`);
    this.turn = 'enemy';
    this.checkCombatStatus();
  }

  enemyAttack() {
    if (this.turn !== 'enemy') return;
    const { damage, isCrit } = this.enemy.attack();
    this.player.takeDamage(damage);
    this.ui.logCombat(`${this.enemy.name} dealt ${damage} damage${isCrit ? ' (Critical!)' : ''} to you.`);
    this.turn = 'player';
    this.checkCombatStatus();
  }

  checkCombatStatus() {
    if (!this.player.isAlive()) {
      this.ui.endCombat('You have been defeated!');
    } else if (!this.enemy.isAlive()) {
      this.ui.endCombat(`You defeated ${this.enemy.name}!`);
    } else {
      this.ui.updateStats();
      if (this.turn === 'enemy') {
        // Enemy turn can be automated after a short delay
        setTimeout(() => this.enemyAttack(), 1000);
      }
    }
  }

  start() {
    this.ui.logCombat(`A wild ${this.enemy.name} appears!`);
    this.ui.updateStats();
    if (this.turn === 'enemy') {
      setTimeout(() => this.enemyAttack(), 1000);
    }
  }
}
