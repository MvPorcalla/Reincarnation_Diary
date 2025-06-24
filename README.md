# Reincarnation Diary

## Description
Reincarnation Diary is a text-based RPG featuring a story-branching system and turn-based combat. 
Players progress by making meaningful choices that shape the storyline while facing enemies in strategic battles. T
he game is managed by `GameManager.js`, which integrates all core modules such as Player, Enemy, Combat, UI, Story, and more.

![Game Preview](./assets/images/background/preview.png)

## Installation
1. Download or clone this project to your local machine.
2. Ensure all files are in the same project folder.
3. Open `index.html` in your web browser.

## Usage
- The game will automatically start when you open `index.html`.
- Click the choice buttons to progress through the story.
- When in combat, click the "Attack" button to fight the enemy.
- The game will handle scene transitions, battles, and player stats.

## Technologies
- HTML
- CSS
- JavaScript (ES6 Modules)


## Game Features
- Story-branching system with multiple choices
- Turn-based combat with enemy dodge and critical hits
- Modular and expandable game structure

## Game Future Improvements
- Add save/load functionality
- Add player inventory system
- Add sound effects and music

## Author
MvPorcalla

---

# 📂 Project Structure

Reincarnation_Diary
│
├── assets
│   ├── data
│   │   └── enemyData.json         # Enemy data in JSON format
│   └── images                     # Game image assets
│       ├── background             # background image
│       └── enemies                # Enemy character image
│
├── css
│   └── uiStyle.css                # Game UI styles
│
├── js                             # All JavaScript files
│   ├── gameManager.js             # Main game controller
│   ├── player.js                  # Handles player data and actions
│   ├── combat.js                  # Manages combat logic
│   ├── ui.js                      # Handles UI rendering and updates
│   ├── story.js                   # Story content and scene management
│   ├── debugger.js                # Debugging tools and story validator
│   ├── enemy.js                   # Enemy class and enemy data handling
│   └── combatUtils.js             # Combat utility functions
│
├── endScreen.html                 # End screen page
├── index.html                     # Game starting page
├── mainGame.html                  # Main game interface
└── README.md                      # Project documentation

---

# 📄 File Descriptions

### `GameManager.js`
- Acts as the **main game controller**.
- Starts the game.
- Manages game state and scene transitions.
- Handles combat logic and rendering of scenes and choices.

### `story.js`
- Contains the game’s story content.
- Manages scenes, transitions, and story structure.

### `ui.js`
- Updates the user interface (UI).
- Displays the story, player stats, enemy visuals, and interactive choices.

### `combat.js`
- Handles turn-based combat between the player and enemies.
- Manages attack sequences, combat flow, and results.

### `combatUtils.js`
- Provides combat-related utility functions.
- Calculates:
  - Attack damage
  - Critical hit chance
  - Bonus damage

### `enemy.js`
- Defines the **Enemy class** and methods for enemy combat interactions.
- Handles:
  - Enemy attacks
  - Taking damage and dodge chance
  - Loading enemy data from JSON
  - Random enemy selection based on tier

### `player.js`
- Manages player creation and player stats.
- Controls player health and reset functions.

### `debugger.js`
- Provides debugging tools.
- Validates story structure during development.
- Controls whether debug logs are displayed.

---

# 🚀 Game Startup Process

1. When the game loads, `startGame()` is automatically called.
2. The `goToScene('start')` function is triggered to load the starting scene.
3. The game displays:
   - Story text
   - Choices or combat (if an enemy is present)
4. The player clicks buttons to make choices or to fight enemies.
5. The game progresses based on player interactions.

---

# ✅ Summary

- This game is **modular**: each file handles a specific part (player, combat, UI, story, debug).
- The **GameManager.js** file is the heart of the project.
- Easy to expand by adding new scenes, enemies, or player features later.

---

If you need help:
- Adding **inline comments and function headers** to your JavaScript files
- Making a **per-file detailed markdown documentation**
- Improving your project folder structure

👉 Just let me know and I can help you build that step by step too! 😊