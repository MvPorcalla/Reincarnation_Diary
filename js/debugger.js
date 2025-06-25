// debugger.js
// This file contains debugging utilities and story validation functions for the game.

// =============================== Debugger Utilities ===============================

export const isDev = true; // Set to false in production builds to disable debug logs

export function devLog(...args) {
  if (isDev) console.log(...args);
}

export function devWarn(...args) {
  if (isDev) console.warn(...args);
}

export function devError(...args) {
  if (isDev) console.error(...args);
}

// =============================== Error Thrower ===============================

/**
 * Logs the error (if in dev mode) and throws it to stop execution.
 * @param {string} message - The error message to log and throw.
 * @param {string} [context] - Optional function name or context.
 */
export function throwError(message, context = '') {
  const fullMessage = context ? `❌ ${context}: ${message}` : `❌ ${message}`;
  devError(fullMessage); // Log to console if in dev mode
  throw new Error(fullMessage); // Throw to stop execution
}

// =============================== Story Validator ===============================

/**
 * Validates a story structure:
 * - Checks for duplicate scene names.
 * - Identifies missing nextScene targets.
 * - Detects unreachable scenes.
 * @param {object} story - The story object to validate.
 */
export function validateStory(story) {
  const sceneNames = Object.keys(story.scenes);
  const referencedScenes = new Set();
  const duplicateScenes = new Set();
  const nameCounts = {};

  // 1. Collect all explicitly referenced scenes from choices
  for (const [sceneName, scene] of Object.entries(story.scenes)) {
    if (nameCounts[sceneName]) {
      duplicateScenes.add(sceneName);
    } else {
      nameCounts[sceneName] = 1;
    }

    if (scene.choices) {
      for (const choice of scene.choices) {
        if (choice.nextScene) {
          referencedScenes.add(choice.nextScene);
        }
        
        if (choice.redirectTo && typeof choice.redirectTo !== 'string') {
          devWarn(`⚠️ Scene "${sceneName}" has an invalid redirectTo:`, choice.redirectTo);
        }
      }
    }
  }

  // 2. Collect programmatically assigned scenes via player.nextAfterBattleScene
  for (const scene of Object.values(story.scenes)) {
    const onEnter = scene.onEnter?.toString();
    if (onEnter) {
      const matches = [...onEnter.matchAll(/player\.nextAfterBattleScene\s*=\s*['"`]([\w\d_-]+)['"`]/g)];
      matches.forEach(match => referencedScenes.add(match[1]));
    }
  }

  // 3. Compare against declared scene names
  const missingScenes = Array.from(referencedScenes).filter(name => !sceneNames.includes(name));
  const unreachableScenes = sceneNames.filter(
    name => !referencedScenes.has(name) && name !== story.currentScene
  );

  // 4. Output validation results
  if (duplicateScenes.size > 0) {
    devWarn(`⚠️ Duplicate scene names: ${Array.from(duplicateScenes).join(', ')}`);
  }

  if (missingScenes.length > 0) {
    devError(`❌ Missing nextScene targets: ${missingScenes.join(', ')}`);
  }

  if (unreachableScenes.length > 0) {
    devWarn(`⚠️ Unreachable scenes: ${unreachableScenes.join(', ')}`);
  } else {
    devLog('✅ Story validation passed: No missing or unreachable scenes.');
  }
}