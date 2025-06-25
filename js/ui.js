// ui.js
// This file handles the user interface for the game, including displaying player and enemy stats, health

const clamp = (val) => Math.max(0, Math.min(100, val));

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
    this.livesContainer = document.getElementById('lives-container');
    this.playerHealthBar = document.getElementById('player-health');

    // Player stat elements
    this.statElements = {
      str: document.getElementById('stat-str'),
      agi: document.getElementById('stat-agi'),
      int: document.getElementById('stat-int'),
      chr: document.getElementById('stat-chr'),
      end: document.getElementById('stat-end'),
      wis: document.getElementById('stat-wis'),
      soulPower: document.getElementById('soul-power'),
      basedamage: document.getElementById('base-damage')
    };

    this.combatLog = '';
  }

  // ================== Core UI Utilities ==================

  flashEffect(el, className) {
    if (!el) return;
    el.classList.add(className);
    setTimeout(() => {
      el.classList.remove(className);
    }, 300);
  }

  clearChoices() {
    this.choicesContainer.innerHTML = '';
  }

  createChoiceButton(text, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = 'choice-button';
    btn.addEventListener('click', onClick);
    this.choicesContainer.appendChild(btn);
  }

  logCombat(message) {
    this.combatLog += message + '\n';
    this.storyTextEl.textContent = this.combatLog;
    this.storyTextEl.scrollTo({
      top: this.storyTextEl.scrollHeight,
      behavior: 'smooth'
    });
  }

  clearCombatLog() {
    this.combatLog = '';
    this.storyTextEl.textContent = '';
  }

  // ================== Stats and Health Management ==================

  updateHealthBars() {
    if (this.playerHealthBar) {
      const healthPercent = this.player.maxHealth > 0
        ? clamp((this.player.health / this.player.maxHealth) * 100)
        : 0;
      this.playerHealthBar.style.width = `${healthPercent}%`;
      this.playerHealthBar.textContent = `${this.player.health} / ${this.player.maxHealth}`;
    }

    if (this.enemy && this.enemyHealthBar) {
      const enemyHealthPercent = this.enemy.maxHealth > 0
        ? clamp((this.enemy.health / this.enemy.maxHealth) * 100)
        : 0;
      this.enemyHealthBar.style.width = `${enemyHealthPercent}%`;
      this.enemyHealthBar.textContent = `${this.enemy.health} / ${this.enemy.maxHealth}`;
    }

    if (this.livesContainer) {
      this.livesContainer.innerHTML = '';
      for (let i = 0; i < this.player.maxLives; i++) {
        const heart = document.createElement('span');
        heart.textContent = i < this.player.lives ? '❤️' : '🤍';
        this.livesContainer.appendChild(heart);
      }
    }
  }

  updateStats() {
    document.querySelectorAll('.player-name').forEach(el => {
      el.textContent = this.player.name;
    });

    this.updateHealthBars();

    const statKeys = ['str', 'agi', 'int', 'chr', 'end', 'wis', 'soulPower', 'basedamage'];
    statKeys.forEach(key => {
      this.statElements[key].textContent =
        key === 'soulPower' ? `${this.player[key]} (Neutral)` : this.player[key];
    });

    this.updateEnemyUI();
  }

  // ================== Enemy Display ==================

  updateEnemyUI() {
    if (this.enemy) {
      this.enemyNameEl.textContent = this.enemy.name;
      this.enemyImageEl.src = this.enemy.imageSrc;
      this.enemyImageEl.alt = this.enemy.name;
      this.enemyInfoEl.hidden = false;
    } else {
      this.enemyInfoEl.hidden = true;
    }
  }

  showEnemyInStory() {
    this.updateEnemyUI();
  }

  // ================== Scene and Combat Rendering ==================

  endCombat(message = 'You defeated the enemy!', result = 'playerWon') {
    this.enemy = null;
    this.enemyInfoEl.hidden = true;
    this.logCombat(message + '\n');
    this.clearChoices();
    this.createChoiceButton('Continue', () => {
      window.dispatchEvent(new CustomEvent('combatEnded', { detail: { result } }));
    });
  }
}