# Reincarnation Diary

![GitHub issues](https://img.shields.io/github/issues/MvPorcalla/Reincarnation_Diary)
![GitHub forks](https://img.shields.io/github/forks/MvPorcalla/Reincarnation_Diary)
![GitHub stars](https://img.shields.io/github/stars/MvPorcalla/Reincarnation_Diary)
![GitHub license](https://img.shields.io/github/license/MvPorcalla/Reincarnation_Diary)

<!-- [![Donate](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-%E2%98%95%20-blue)](https://www.buymeacoffee.com/yourusername) -->

## 📖 Description
**Reincarnation Diary** is a text-based RPG featuring a **story-branching system** and **turn-based combat**.  
Players make meaningful choices that shape the storyline while facing enemies in strategic battles.  
The game is managed by `GameManager.js`, which integrates all core modules such as Player, Enemy, Combat, UI, Story, and more.

![Game Preview](./assets/images/background/preview.png)

---

## 📚 Table of Contents
- [Description](#-description)
- [Installation](#️-installation)
- [Usage](#️-usage)
- [Technologies](#-technologies)
- [Game Features](#-game-features)
- [Planned Future Improvements](#-planned-future-improvements)
- [File Descriptions](#-file-descriptions)
- [Game Startup Process](#-game-startup-process)
- [Summary](#-summary)
- [Contributing Guidelines](#-contributing-guidelines)
- [Further Support](#-further-support)
- [Contact](#-contact)
- [Contributions](#-contributions)
<!-- - [Support the Developer](#-support-the-developer) -->
- [License](#-license)


---

## 🛠️ Installation
1. Download or clone this project to your local machine.
2. Ensure all files remain in the same project folder.
3. Open `index.html` in your web browser.

---

## ▶️ Usage
- The game will automatically start when you open `index.html`.
- Click the **choice buttons** to progress through the story.
- During combat, click the **Attack** button to fight the enemy.
- The game will handle scene transitions, battles, and player stats.

---

## 💻 Technologies
- HTML
- CSS
- JavaScript (ES6 Modules)

---

## 🎮 Game Features
- Story-branching system with multiple choices
- Turn-based combat with enemy dodge and critical hit mechanics
- Modular and expandable game structure

---

## 🚀 Planned Future Improvements
- Save/Load functionality
- Player inventory system
- Sound effects and background music

---

## 👤 Author
**MvPorcalla**

---

<!-- 
# 📂 Project Structure

Reincarnation_Diary
│
├── assets
│   ├── data
│   │   └── enemyData.json         # Enemy data in JSON format
│   └── images                     # Game image assets
│       ├── background             # Background image
│       └── enemies                # Enemy character images
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
-->

---

# 📄 File Descriptions

### `gameManager.js`
- Acts as the **main game controller**.
- Starts the game, manages game state and scene transitions.
- Handles combat logic and scene rendering.

### `story.js`
- Contains the game’s story content.
- Manages scenes, transitions, and story structure.

### `ui.js`
- Updates the user interface (UI).
- Displays the story, player stats, enemy visuals, and interactive choices.

### `combat.js`
- Manages turn-based combat between the player and enemies.
- Handles attack sequences and combat flow.

### `combatUtils.js`
- Provides combat-related utility functions.
- Calculates:
  - Attack damage
  - Critical hit chance
  - Bonus damage

### `enemy.js`
- Defines the **Enemy class** and enemy combat interactions.
- Manages:
  - Enemy attacks
  - Damage-taking and dodge chance
  - Enemy data loading from JSON
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
- The project is **modular**: each file has a specific role (player, combat, UI, story, debug).
- The **gameManager.js** is the central hub of the system.
- Easy to maintain and expand by adding new features like scenes, enemies, and player mechanics.

---

# 🤝 Contributing Guidelines

Thank you for your interest in contributing! You can help by:
- Suggesting new features
- Fixing bugs
- Improving or expanding the documentation
- Adding new story branches or combat mechanics

### 📢 How to Contribute
1. Fork this repository.
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to your branch: `git push origin feature/YourFeature`
5. Submit a pull request.

Please **open an issue or pull request** if you would like to contribute.  
All contributions are welcome and appreciated!

---

# 📌 Further Support

If you'd like to enhance or improve this project, here are some great areas to contribute:
- ✨ Adding **inline comments and function headers** to improve code readability
- 📝 Creating detailed **per-file documentation** in Markdown
- 🗂️ Refining the **project folder structure** for better scalability and maintainability

👉 Feel free to reach out, submit feedback, or contribute to make this project even better! 😊

---

# 📞 Contact

- **Email:** digitalmelvs@gmail.com
- **GitHub:** [MvPorcalla](https://github.com/MvPorcalla)

For any issues or feedback, you can open a [GitHub Issue](https://github.com/MvPorcalla/Reincarnation_Diary/issues).

---

# 🚀 Contributions

Contributions, suggestions, and improvements are always welcome!  
Feel free to **fork this project and submit a pull request**.  
All contributions are appreciated and will help this project grow! 🙌


<!-- 
## 💖 Support the Developer

If you find this project helpful, enjoyable, or if you're using it in your own work, please consider supporting me!  
Your contribution will help me continue improving this project and developing more open-source tools.

### ☕ Ways to Support:
- [Buy Me a Coffee](https://www.buymeacoffee.com/yourusername)  
- [Donate via PayPal](https://www.paypal.me/yourusername)

Every donation is greatly appreciated and will help me keep this project alive and growing. Thank you! 🙏
-->

---

## 📄 License
This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute this project, provided that you give proper credit.

See the [LICENSE](./LICENSE) file for more details.