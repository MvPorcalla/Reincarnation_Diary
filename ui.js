// ui.js
export class UI {
  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;

    // DOM elements
    this.storyTextEl = document.getElementById('story-text');
    this.choicesContainer = document.getElementById('choices-container');

    this.playerNameEl = document.getElementById('player-name');

    this.enemyInfoEl = document.getElementById('enemy-info');
    this.enemyNameEl = document.getElementById('enemy-name');
    this.enemyHealthBar = document.getElementById('enemy-health');
    this.enemyImageEl = document.getElementById('enemy-image');

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

      basedamage: document.getElementById('base-damage') // Make sure this line exists
    };

    this.combatLogEntries = [];
    this.combatLog = '';
  }

  flashEffect(el, className) {
    el.classList.add(className);
    setTimeout(() => {
      el.classList.remove(className);
    }, 300);
  }
  
updateStats() {
  // Update player name
  this.playerNameEl.textContent = this.player.name;

  // Update player health
  const healthPercent = (this.player.health / this.player.maxHealth) * 100;
  this.playerHealthBar.style.width = healthPercent + '%';
  this.playerHealthBar.textContent = `${this.player.health} / ${this.player.maxHealth}`;

  // Update player stats
  this.statElements.str.textContent = this.player.str;
  this.statElements.agi.textContent = this.player.agi;
  this.statElements.int.textContent = this.player.int;
  this.statElements.chr.textContent = this.player.chr;
  this.statElements.end.textContent = this.player.end;
  this.statElements.wis.textContent = this.player.wis;
  this.statElements.soulPower.textContent = `${this.player.soulPower} (Neutral)`; // You can change "(Neutral)" dynamically if needed
  this.statElements.basedamage.textContent = this.player.baseDamage;

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

  logCombat(message) {
    this.combatLog += message + '\n';
    this.storyTextEl.textContent = this.combatLog;
    this.storyTextEl.scrollTo({
      top: this.storyTextEl.scrollHeight,
      behavior: 'smooth' // smooth scrolling
    });
  }

  endCombat(message) {
    this.enemy = null;
    this.enemyInfoEl.hidden = true;
    this.logCombat(`You defeated the enemy!\n`);
    this.clearChoices();
    this.createChoiceButton('Continue', () => {
      window.dispatchEvent(new CustomEvent('combatEnded', { detail: { result: 'playerWon' }}));
    });
  }

}
