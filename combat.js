// combat.js
import { Player } from './player.js';
import { Enemy } from './enemy.js';

export class Combat {
  constructor(player, enemy, ui) {
    this.player = player;
    this.enemy = enemy;
    this.ui = ui; // Object that has method logCombat(message)
    this.turn = 'player'; // or 'enemy'
  }

  playerAttack() {
    if (this.turn !== 'player') return;

    const { damage, isCrit } = this.player.attack();
    this.enemy.takeDamage(damage);

    this.ui.logCombat(`${this.player.name} dealt ${damage} damage${isCrit ? ' (Critical!)' : ''} to ${this.enemy.name}.`);

    this.turn = 'enemy';
    this.checkCombatStatus();
  }

  enemyAttack() {
    if (this.turn !== 'enemy') return;

    const { damage, isCrit } = this.enemy.attack();
    const dodged = this.player.takeDamage(damage);

    if (dodged) {
      this.ui.logCombat(`${this.player.name} dodged ${this.enemy.name}'s attack!`);
    } else {
      this.ui.logCombat(`${this.enemy.name} dealt ${damage} damage${isCrit ? ' (Critical!)' : ''} to ${this.player.name}.`);
    }

    this.turn = 'player';
    this.checkCombatStatus();
  }

  // checkCombatStatus() {
  //   if (!this.player.isAlive()) {
  //     this.ui.logCombat(`${this.player.name} has been defeated!`);
  //     // handle player defeat (disable further actions, show game over, etc.)
  //   } else if (!this.enemy.isAlive()) {
  //     this.ui.logCombat(`${this.enemy.name} has been defeated!`);
  //     // handle enemy defeat (reward player, next enemy, etc.)
  //   } else {
  //     this.ui.updateStats();
  //     if (this.turn === 'enemy') {
  //       // Enemy turn can be automated after a short delay
  //       setTimeout(() => this.enemyAttack(), 1000);
  //     }
  //   }
  // }

  checkCombatStatus() {
  if (!this.player.isAlive()) {
    this.ui.logCombat(`${this.player.name} has been defeated!`);
    // You may want to disable further actions here
    const event = new CustomEvent('combatEnded', { detail: { result: 'playerDefeated' } });
    window.dispatchEvent(event);
  } else if (!this.enemy.isAlive()) {
    this.ui.logCombat(`${this.enemy.name} has been defeated!`);

    // Dispatch event that combat ended with enemy defeated
    const event = new CustomEvent('combatEnded', { detail: { result: 'enemyDefeated' } });
    window.dispatchEvent(event);
  } else {
    this.ui.updateStats();
    if (this.turn === 'enemy') {
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
