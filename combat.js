// combat.js
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

  const damageDealt = dodged ? 0 : damage;
  const statusTags = [];

  if (isCrit) statusTags.push('Critical!');
  if (dodged) statusTags.push('Dodged!');

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

      // Dispatch playerDefeated instead of general combatEnded
      const event = new CustomEvent('combatEnded', { detail: { result: 'playerDefeated' } });
      window.dispatchEvent(event);
      return; // Stop combat here
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
        // Only allow enemy to attack if player is still alive
        if (this.player.isAlive()) {
          this.enemyAttack();
        }
      }, 1000);
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
