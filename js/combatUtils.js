// combatUtils.js
// This file contains utility functions for combat mechanics in a turn-based system.
/**
 * Calculates the result of an attack, including critical hit chance and bonus damage.
 * @param {Object} params - The attack parameters.
 * @param {number} params.baseDamage - The base damage of the attack.
 * @param {number} params.critChance - The chance (0-1) for a critical hit.
 * @param {number} [params.bonus=0] - Optional bonus damage.
 * @returns {Object} Result object with final damage and crit status.
 */

import { devLog, devWarn, devError, isDev } from './debugger.js';

export function calculateAttack({
  baseDamage,
  critChance,
  bonus = 0
}) {
  if (typeof baseDamage !== 'number' || isNaN(baseDamage)) {
    devError(`Invalid baseDamage: ${baseDamage}`);
    throwError(`Invalid baseDamage: ${baseDamage}`);
  }

  if (typeof critChance !== 'number' || isNaN(critChance) || critChance < 0 || critChance > 1) {
    devError(`Invalid critChance: ${critChance}. It should be a number between 0 and 1.`);
    throwError(`Invalid critChance: ${critChance}. It should be a number between 0 and 1.`);
  }

  if (typeof bonus !== 'number' || isNaN(bonus)) {
    devError(`Invalid bonus: ${bonus}`);
    throwError(`Invalid bonus: ${bonus}`);
  }

  const totalDamage = baseDamage + bonus;
  const isCrit = Math.random() < critChance;
  const finalDamage = isCrit ? totalDamage * 2 : totalDamage;

  return { damage: finalDamage, isCrit };
}


