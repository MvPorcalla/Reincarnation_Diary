// combat.js
export class Combat {
  constructor(player, enemy, ui) {
    this.player = player;
    this.enemy = enemy;
    this.ui = ui; // Object that has method logCombat(message)
    this.turn = null; // We'll set this dynamically
  }

  // New method to determine who goes first based on speed + randomness
  determineTurnOrder() {
    const playerSpeed = Number(this.player.speed) || 0;
    const enemySpeed = Number(this.enemy.speed) || 0;

    const playerInitiative = playerSpeed + Math.floor(Math.random() * 20) + 1;
    const enemyInitiative = enemySpeed + Math.floor(Math.random() * 20) + 1;

    this.ui.logCombat(`Player initiative roll: ${playerInitiative}`);
    this.ui.logCombat(`Enemy initiative roll: ${enemyInitiative}`);

    if (playerInitiative > enemyInitiative) return 'player';
    if (enemyInitiative > playerInitiative) return 'enemy';

    return Math.random() < 0.5 ? 'player' : 'enemy';
  }


playerAttack() {
  if (this.turn !== 'player') return;

  const { damage, isCrit } = this.player.attack();
  this.enemy.takeDamage(damage);

  // Flash enemy health bar if critical hit
  if (isCrit) {
    console.log('Player critical hit! Flashing enemy health bar.');
    this.ui.flashEffect(this.ui.enemyHealthBar, 'flash-crit');
  }

  this.ui.logCombat(`${this.player.name} dealt ${damage} damage${isCrit ? ' (Critical!)' : ''} to ${this.enemy.name}.`);

  this.turn = 'enemy';
  this.checkCombatStatus();
}

enemyAttack() {
  if (this.turn !== 'enemy') return;

  const { damage, isCrit } = this.enemy.attack();
  const dodged = this.player.takeDamage(damage);

  const damageDealt = dodged ? 0 : damage;
  const statusTags = [];

  if (isCrit) statusTags.push('Critical!');
  if (dodged) statusTags.push('Dodged!');

  // Flash player health bar for crit or dodge
  if (dodged) {
    this.ui.flashEffect(this.ui.playerHealthBar, 'flash-dodge');
  } else if (isCrit) {
    this.ui.flashEffect(this.ui.playerHealthBar, 'flash-crit');
  }

  const statusText = statusTags.length ? ` (${statusTags.join(' ')})` : '';

  this.ui.logCombat(`${this.enemy.name} dealt ${damageDealt} damage${statusText} to ${this.player.name}.`);

  this.turn = 'player';
  this.ui.updateStats();

  if (this.player.health <= 0) {
    window.dispatchEvent(new CustomEvent('combatEnded', { detail: { result: 'playerDefeated' }}));
  }
}


  checkCombatStatus() {
    if (!this.player.isAlive()) {
      this.ui.logCombat(`${this.player.name} has been defeated!`);
      const event = new CustomEvent('combatEnded', { detail: { result: 'playerDefeated' } });
      window.dispatchEvent(event);
      return;
    }

    if (!this.enemy.isAlive()) {
      this.ui.logCombat(`${this.enemy.name} has been defeated!`);
      const event = new CustomEvent('combatEnded', { detail: { result: 'enemyDefeated' } });
      window.dispatchEvent(event);
      return;
    }

    this.ui.updateStats();

    if (this.turn === 'enemy') {
      setTimeout(() => {
        if (this.player.isAlive()) {
          this.enemyAttack();
        }
      }, 1000);
    }
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

