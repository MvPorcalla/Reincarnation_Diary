export class UI {
  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;

    // DOM elements
    this.storyTextEl = document.getElementById('story-text');
    this.choicesContainer = document.getElementById('choices-container');

    this.enemyInfoEl = document.getElementById('enemy-info');
    this.enemyNameEl = document.getElementById('enemy-name');
    this.enemyHealthBar = document.getElementById('enemy-health');
    this.enemyImageEl = document.getElementById('enemy-image');

    this.playerHealthBar = document.getElementById('player-health');

    // Player stat elements
    this.statElements = {
      str: document.getElementById('stat-str'),
      int: document.getElementById('stat-int'),
      chr: document.getElementById('stat-chr'),
      end: document.getElementById('stat-end'),
      wis: document.getElementById('stat-wis'),
      soulPower: document.getElementById('soul-power')
    };

    this.combatLogEntries = [];
    this.combatLog = '';
  }

  updateStats() {
    // Update player health
    const healthPercent = (this.player.health / this.player.maxHealth) * 100;
    this.playerHealthBar.style.width = healthPercent + '%';
    this.playerHealthBar.textContent = `${this.player.health} / ${this.player.maxHealth}`;

    // Update player stats
    this.statElements.str.textContent = this.player.str;
    this.statElements.int.textContent = this.player.int;
    this.statElements.chr.textContent = this.player.chr;
    this.statElements.end.textContent = this.player.end;
    this.statElements.wis.textContent = this.player.wis;
    this.statElements.soulPower.textContent = `${this.player.soulPower} (Neutral)`; // You can change "(Neutral)" dynamically if needed

    // Update enemy info
    if (this.enemy) {
      const enemyHealthPercent = (this.enemy.health / this.enemy.maxHealth) * 100;
      this.enemyHealthBar.style.width = enemyHealthPercent + '%';
      this.enemyHealthBar.textContent = `${this.enemy.health} / ${this.enemy.maxHealth}`;
      this.enemyNameEl.textContent = this.enemy.name;
      this.enemyImageEl.src = this.enemy.imageSrc;
      this.enemyImageEl.alt = this.enemy.name;
      this.enemyInfoEl.hidden = false;
    } else {
      this.enemyInfoEl.hidden = true;
    }
  }

  showEnemyInStory() {
    if (this.enemy) {
      this.enemyNameEl.textContent = this.enemy.name;
      this.enemyImageEl.src = this.enemy.imageSrc;
      this.enemyImageEl.alt = this.enemy.name;
      this.enemyInfoEl.hidden = false;
    } else {
      this.enemyInfoEl.hidden = true;
    }
  }

  clearChoices() {
    this.choicesContainer.innerHTML = '';
  }

  createChoiceButton(text, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    this.choicesContainer.appendChild(btn);
  }

  logCombat(text) {
    this.combatLog += text + '\n';
    this.storyTextEl.textContent = this.combatLog;
  }

  endCombat(message) {
    this.enemy = null;
    this.enemyInfoEl.hidden = true;
    this.logCombat(`You defeated the enemy!\n`);
    this.clearChoices();
    this.createChoiceButton('Continue', () => {
      window.dispatchEvent(new Event('combatEnded'));
    });
  }
}
