// game.js

// Helper function to get random integer between min and max (inclusive)
function getRandomStat(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Load player data from localStorage if available
const savedPlayer = JSON.parse(localStorage.getItem("player"));

const player = savedPlayer ?? {
    str: 5,
    int: 3,
    chr: 5,
    end: 4,
    wis: 3,
    soulPower: 50,

    health: 0,       // current health points (3-5)
    maxHealth: 0,    // max health points (randomized)

    sanity: 0,       // current sanity points (3-5)
    maxSanity: 0,    // max sanity points (randomized)

    currentScene: "start",

    // Inventory: equipped and storage slots
    inventory: {
        equipped: {
            head: null,
            body: null,
            weapon: null,
            offhand: null,
        },
        storage: new Array(12).fill(null), // 12 empty slots
    }
};

// Your player's strength stat
const strength = 5;
const baseSlots = 6;
const slotsPerStrength = 2;
const totalSlots = baseSlots + strength * slotsPerStrength;

// Dummy equipped items (image URLs)
const equippedItems = [
  'images/sword.png',
  'images/shield.png',
  '',
  '',
  '',
];

// Dummy general items
const generalItems = [
  'images/potion.png',
  'images/apple.png',
  '',
  '', '', '', '', '', '', '', '', ''
];

// Render function
function renderInventory() {
  const equippedGrid = document.getElementById('equipped-items');
  const generalGrid = document.getElementById('general-inventory');

  equippedGrid.innerHTML = '';
  generalGrid.innerHTML = '';

  equippedItems.forEach(src => {
    const slot = createSlot(src);
    equippedGrid.appendChild(slot);
  });

  for (let i = 0; i < totalSlots; i++) {
    const src = generalItems[i] || '';
    const slot = createSlot(src);
    generalGrid.appendChild(slot);
  }
}

function createSlot(imageSrc) {
  const slot = document.createElement('div');
  slot.classList.add('slot');

  const img = document.createElement('img');
  img.src = imageSrc || 'images/empty-slot.png';
  img.alt = 'Item';

  slot.appendChild(img);
  return slot;
}

renderInventory();


const storyTextEl = document.getElementById("story-text");
const choicesContainer = document.getElementById("choices-container");
const soulPowerEl = document.getElementById("soul-power");
const endBtn = document.getElementById("end-btn");

// Save player data to localStorage
function savePlayer() {
    localStorage.setItem("player", JSON.stringify(player));
}

// Randomize player stats function including health and sanity
function randomizeStats() {
    player.str = getRandomStat(4, 10);
    player.int = getRandomStat(4, 10);
    player.chr = getRandomStat(4, 10);
    player.end = getRandomStat(4, 10);
    player.wis = getRandomStat(4, 10);

    // Randomize health and sanity between 3 and 5 points
    player.maxHealth = getRandomStat(3, 5);
    player.health = player.maxHealth;

    player.maxSanity = getRandomStat(3, 5);
    player.sanity = player.maxSanity;
}

// Render bar points for health and sanity
function renderPoints(containerId, value, max, filledClass = "filled", extraClass = "") {
    const container = document.getElementById(containerId);
    container.className = `bar ${extraClass}`;
    container.innerHTML = "";

    for (let i = 0; i < max; i++) {
        const point = document.createElement("div");
        point.classList.add("point");
        if (i < value) point.classList.add(filledClass);
        container.appendChild(point);
    }
}

// Update UI elements
function updateUI() {
    document.getElementById("stat-str").textContent = player.str;
    document.getElementById("stat-int").textContent = player.int;
    document.getElementById("stat-chr").textContent = player.chr;
    document.getElementById("stat-end").textContent = player.end;
    document.getElementById("stat-wis").textContent = player.wis;

    // Render health and sanity bars using current max values
    renderPoints("player-health", player.health, player.maxHealth);
    renderPoints("player-sanity", player.sanity, player.maxSanity, "filled", "sanity");

    let alignment = "Neutral";
    if (player.soulPower >= 100) alignment = "Heroic";
    else if (player.soulPower <= 0) alignment = "Demonic";

    soulPowerEl.textContent = `${player.soulPower} (${alignment})`;
}

// Load and render scene
function loadScene(key) {
    const scene = story[key];
    if (!scene) {
        storyTextEl.textContent = "Scene not found.";
        choicesContainer.innerHTML = "";
        return;
    }

    player.currentScene = key;
    storyTextEl.textContent = scene.text;
    choicesContainer.innerHTML = "";

    if (scene.choices.length === 0) {
        endBtn.style.display = "block";
    } else {
        endBtn.style.display = "none";

        scene.choices.forEach((choice) => {
            const btn = document.createElement("button");
            btn.textContent = choice.text;

            btn.onclick = () => {
                // Stat requirement check
                if (choice.statCheck) {
                    const statValue = player[choice.statCheck.stat];
                    if (statValue < choice.statCheck.value) {
                        alert(`You need ${choice.statCheck.stat.toUpperCase()} >= ${choice.statCheck.value} to choose this.`);
                        return;
                    }
                }

                // Apply soul effect
                if (choice.soulEffect !== undefined) {
                    player.soulPower += choice.soulEffect;
                    player.soulPower = Math.max(0, Math.min(100, player.soulPower));
                }

                // Apply health effect (increase/decrease)
                if (choice.healthEffect !== undefined) {
                    player.health += choice.healthEffect;

                    if (player.health > player.maxHealth) {
                        player.maxHealth = player.health;
                    }

                    player.health = Math.max(0, player.health);
                }

                // Apply sanity effect (increase/decrease)
                if (choice.sanityEffect !== undefined) {
                    player.sanity += choice.sanityEffect;

                    if (player.sanity > player.maxSanity) {
                        player.maxSanity = player.sanity;
                    }

                    player.sanity = Math.max(0, player.sanity);
                }

                savePlayer(); // Save updated stats

                loadScene(choice.next);
                updateUI();
            };

            choicesContainer.appendChild(btn);
        });
    }

    updateUI();
}

// Restart button
endBtn.onclick = () => {
    const currentSoulPower = player.soulPower;

    randomizeStats();
    player.soulPower = currentSoulPower;

    savePlayer(); // Save after randomizing stats

    loadScene("start");
};

// Optional: Save before page unload
window.addEventListener("beforeunload", savePlayer);

// Initialize
if (!savedPlayer) {
    randomizeStats();
    savePlayer();
}

loadScene(player.currentScene);

// Optional reset function to start a new game from scratch
function resetPlayer() {
    localStorage.removeItem("player");
    location.reload();
}
