// combat.js
export class Combat {
  constructor(player, enemy, ui) {
    this.player = player;
    this.enemy = enemy;
    this.ui = ui; // Object with logCombat(message), flashEffect(element, className), updateStats()
    this.turn = null; // Current turn: 'player' or 'enemy'
  }

  // Determine who goes first based on agility + random roll
  determineTurnOrder() {
    const playerAgility = Number(this.player.agi) || 0;
    const enemyAgility = Number(this.enemy.agi) || 0;

    const playerInitiative = playerAgility + Math.floor(Math.random() * 20) + 1;
    const enemyInitiative = enemyAgility + Math.floor(Math.random() * 20) + 1;

    this.ui.logCombat(`Player initiative roll: ${playerInitiative}`);
    this.ui.logCombat(`Enemy initiative roll: ${enemyInitiative}`);

    if (playerInitiative > enemyInitiative) return 'player';
    if (enemyInitiative > playerInitiative) return 'enemy';

    // Tie-breaker random
    return Math.random() < 0.5 ? 'player' : 'enemy';
  }

  playerAttack() {
    if (this.turn !== 'player') return;

    const { damage, isCrit } = this.player.attack();
    const dodged = this.enemy.takeDamage(damage);

    if (dodged) {
      this.ui.logCombat(`${this.enemy.name} dodged the attack!`);
      this.ui.flashEffect(this.ui.enemyHealthBar, 'flash-dodge'); // Flash on dodge
    } else {
      this.ui.logCombat(`${this.player.name} dealt ${damage} damage${isCrit ? ' (Critical!)' : ''} to ${this.enemy.name}.`);
      if (isCrit) {
        this.ui.flashEffect(this.ui.enemyHealthBar, 'flash-crit'); // Flash on crit
      }
    }

    this.checkCombatStatus();

    // Switch turn if combat still ongoing
    if (this.enemy.isAlive()) {
      this.turn = 'enemy';
      // Enemy attacks after short delay
      setTimeout(() => this.enemyAttack(), 1000);
    }
  }

  enemyAttack() {
    if (this.turn !== 'enemy') return;

    const { damage, isCrit } = this.enemy.attack();
    const dodged = this.player.takeDamage(damage);

    const damageDealt = dodged ? 0 : damage;
    const statusTags = [];

    if (isCrit) statusTags.push('Critical!');
    if (dodged) statusTags.push('Dodged!');

    if (dodged) {
      this.ui.flashEffect(this.ui.playerHealthBar, 'flash-dodge'); // Flash on dodge
    } else if (isCrit) {
      this.ui.flashEffect(this.ui.playerHealthBar, 'flash-crit'); // Flash on crit
    }

    const statusText = statusTags.length ? ` (${statusTags.join(' ')})` : '';

    this.ui.logCombat(`${this.enemy.name} dealt ${damageDealt} damage${statusText} to ${this.player.name}.`);

    this.checkCombatStatus();

    // Switch turn if combat still ongoing
    if (this.player.isAlive()) {
      this.turn = 'player';
      this.ui.updateStats();
    }
  }

  checkCombatStatus() {
    if (!this.player.isAlive()) {
      this.ui.logCombat(`${this.player.name} has been defeated!`);
      window.dispatchEvent(new CustomEvent('combatEnded', { detail: { result: 'playerDefeated' } }));
      return;
    }

    if (!this.enemy.isAlive()) {
      this.ui.logCombat(`${this.enemy.name} has been defeated!`);
      window.dispatchEvent(new CustomEvent('combatEnded', { detail: { result: 'enemyDefeated' } }));
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
