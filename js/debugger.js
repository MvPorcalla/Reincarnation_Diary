// debugger.js

// ===================================  Debugger  ===================================

export const isDev = true; // Set to false in production builds to disable debug logs

// These wrappers ensure that debug logs (log, warn, error) are only shown in development mode.
export function devLog(...args) {
  if (isDev) console.log(...args);
}
export function devWarn(...args) {
  if (isDev) console.warn(...args);
}
export function devError(...args) {
  if (isDev) console.error(...args);
}

// ===================================  Story Validator  ===================================

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
    console.warn(`⚠️ Duplicate scene names: ${Array.from(duplicateScenes).join(', ')}`);
  }

  if (missingScenes.length > 0) {
    console.error(`❌ Missing nextScene targets: ${missingScenes.join(', ')}`);
  }

  if (unreachableScenes.length > 0) {
    console.warn(`⚠️ Unreachable scenes: ${unreachableScenes.join(', ')}`);
  } else {
    console.log('✅ Story validation passed: No missing or unreachable scenes.');
  }
}

// ===================================  Debugger  ===================================