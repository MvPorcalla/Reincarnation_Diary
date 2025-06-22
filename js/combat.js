// combat.js
// This file handles the combat mechanics between the player and an enemy in a turn-based system.

import { devLog, devWarn, devError } from './debugger.js';

export class Combat {
  constructor(player, enemy, ui) {
    this.player = player;
    this.enemy = enemy;
    this.ui = ui; // Expected methods: logCombat, flashEffect, updateStats
    this.active = true;
    this.turn = null;
  }

  // ================== Combat Lifecycle ==================

  start() {
    this.ui.logCombat(`A wild ${this.enemy.name} appears!`);

    this.turn = this.determineTurnOrder();
    this.ui.logCombat(`${this.turn === 'player' ? this.player.name : this.enemy.name} goes first!`);

    if (this.turn === 'enemy') {
      setTimeout(() => this.enemyAttack(), 1000);
    }
  }

  determineTurnOrder() {
    const playerRoll = (Number(this.player.agi) || 0) + Math.floor(Math.random() * 20) + 1;
    const enemyRoll = (Number(this.enemy.agi) || 0) + Math.floor(Math.random() * 20) + 1;

    this.ui.logCombat(`Player initiative roll: ${playerRoll}`);
    this.ui.logCombat(`Enemy initiative roll: ${enemyRoll}`);

    if (playerRoll > enemyRoll) return 'player';
    if (enemyRoll > playerRoll) return 'enemy';
    return Math.random() < 0.5 ? 'player' : 'enemy';
  }

  // ================== Turn Handlers ==================

  playerAttack() {
    if (!this.active) return;
    if (!this.ensureCorrectTurn('player')) return;

    const alive = this.handleAttack({
      attacker: this.player,
      defender: this.enemy,
      defenderBar: this.ui.enemyHealthBar,
      isPlayer: true
    });

    if (alive && this.active) {
      this.turn = 'enemy';
      setTimeout(() => this.enemyAttack(), 1000);
    }
  }

  enemyAttack() {
    if (!this.active) return;
    if (!this.ensureCorrectTurn('enemy')) return;

    const alive = this.handleAttack({
      attacker: this.enemy,
      defender: this.player,
      defenderBar: this.ui.playerHealthBar,
      isPlayer: false
    });

    if (alive && this.active) {
      this.turn = 'player';
    }
  }

  // ================== Core Mechanics ==================

  handleAttack({ attacker, defender, defenderBar, isPlayer }) {
    const { damage, isCrit } = attacker.attack();
    const dodged = defender.takeDamage(damage);
    const damageDealt = dodged ? 0 : damage;

    // Tag building
    const tags = [];
    if (dodged) tags.push('Dodged!');
    else if (isCrit) tags.push('Critical!');
    const statusText = tags.length ? ` (${tags.join(' ')})` : '';

    // Combat log message
    const message = isPlayer
      ? dodged
        ? `> You attacked ${defender.name} but missed!`
        : `> You attacked ${defender.name} for ${damageDealt} damage${statusText}`
      : dodged
        ? `> ${attacker.name} attacked and missed!`
        : `> ${attacker.name} attacked you for ${damageDealt} damage${statusText}`;

    this.ui.logCombat(message);

    // Flash effect
    if (dodged) {
      this.ui.flashEffect(defenderBar, 'flash-dodge');
    } else if (isCrit) {
      this.ui.flashEffect(defenderBar, 'flash-crit');
    }

    this.checkCombatStatus();
    this.ui.updateStats();

    return defender.isAlive();
  }

  ensureCorrectTurn(expectedTurn) {
    if (this.turn !== expectedTurn) {
      devError(`❌ Invalid action: It's currently ${this.turn}'s turn, expected ${expectedTurn}.`);
      return false;
    }
    return true;
  }

  // ================== Combat State Evaluation ==================

  checkCombatStatus() {
    const playerAlive = this.player.isAlive();
    const enemyAlive = this.enemy.isAlive();

    // Enemy defeated
    if (!enemyAlive) {
      this.active = false;
      const flavor = this.enemy.defeatMessage || `${this.enemy.name} has been defeated!`;
      this.ui.logCombat(`\n${flavor}`);

      window.dispatchEvent(new CustomEvent('combatEnded', {
        detail: { result: 'enemyDefeated' }
      }));
      return;
    }

    // Player defeated
    if (!playerAlive) {
      this.active = false;
      this.player.health = 0;
      this.player.loseLife();

      const isOutOfLives = this.player.lives <= 0;

      if (!isOutOfLives) {
        this.ui.logCombat(`\n${this.player.name} has been knocked out!`);
      }

      this.ui.updateStats();
      window.dispatchEvent(new CustomEvent('combatEnded', {
        detail: { result: isOutOfLives ? 'gameOver' : 'playerDefeated' }
      }));
      return;
    }
  }
}
