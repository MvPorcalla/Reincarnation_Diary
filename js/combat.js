// combat.js
// This file handles the combat mechanics between the player and an enemy in a turn-based system.

export class Combat {
  constructor(player, enemy, ui) {
    this.player = player;
    this.enemy = enemy;
    this.ui = ui; // Expected methods: logCombat, flashEffect, updateStats
    this.turn = null;
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

  handleAttack({ attacker, defender, defenderBar, isPlayer }) {
    const { damage, isCrit } = attacker.attack();
    const dodged = defender.takeDamage(damage);
    const damageDealt = dodged ? 0 : damage;

    // Build status tags
    const tags = [];
    if (dodged) {
      tags.push('Dodged!');
    } else if (isCrit) {
      tags.push('Critical!');
    }

    const statusText = tags.length ? ` (${tags.join(' ')})` : '';
    let message = '';

    if (isPlayer) {
      message = dodged
        ? `> You attacked ${defender.name} but missed!`
        : `> You attacked ${defender.name} for ${damageDealt} damage${statusText}`;
    } else {
      message = dodged
        ? `> ${attacker.name} attacked and missed!`
        : `> ${attacker.name} attacked you for ${damageDealt} damage${statusText}`;
    }

    this.ui.logCombat(message);

    // Flash effect
    if (dodged) {
      this.ui.flashEffect(defenderBar, 'flash-dodge');
    } else if (isCrit) {
      this.ui.flashEffect(defenderBar, 'flash-crit');
    }

    this.checkCombatStatus();
    return defender.isAlive();
  }

  playerAttack() {
    if (this.turn !== 'player') return;

    const alive = this.handleAttack({
      attacker: this.player,
      defender: this.enemy,
      defenderBar: this.ui.enemyHealthBar,
      isPlayer: true
    });

    if (alive) {
      this.turn = 'enemy';
      setTimeout(() => this.enemyAttack(), 1000);
    }
  }

  enemyAttack() {
    if (this.turn !== 'enemy') return;

    const alive = this.handleAttack({
      attacker: this.enemy,
      defender: this.player,
      defenderBar: this.ui.playerHealthBar,
      isPlayer: false
    });

    if (alive) {
      this.turn = 'player';
      this.ui.updateStats();
    }
  }

  checkCombatStatus() {
    if (!this.enemy.isAlive()) {
      const flavor = this.enemy.defeatMessage || `${this.enemy.name} has been defeated!`;

      this.ui.logCombat(flavor);

      window.dispatchEvent(new CustomEvent('combatEnded', {
        detail: {
          result: 'enemyDefeated',
          message: flavor // 👈 pass this to story
        }
      }));
      return;
    }

    if (!this.player.isAlive()) {
      this.player.health = 0;
      this.ui.logCombat(`${this.player.name} has been knocked out!`);
      this.player.loseLife();
      this.ui.updateStats();

      const isOutOfLives = this.player.lives <= 0;
      window.dispatchEvent(new CustomEvent('combatEnded', {
        detail: {
          result: isOutOfLives ? 'gameOver' : 'playerDefeated'
        }
      }));
      return;
    }

    this.ui.updateStats();
  }

  start() {
    this.ui.logCombat(`A wild ${this.enemy.name} appears!`);
    this.ui.updateStats();

    this.turn = this.determineTurnOrder();
    this.ui.logCombat(`${this.turn === 'player' ? this.player.name : this.enemy.name} goes first!`);

    if (this.turn === 'enemy') {
      setTimeout(() => this.enemyAttack(), 1000);
    }
  }
}
