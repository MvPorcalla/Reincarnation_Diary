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

export function calculateAttack({
  baseDamage,
  critChance,
  bonus = 0
}) {
  const totalDamage = baseDamage + bonus;
  const isCrit = Math.random() < critChance;
  const finalDamage = isCrit ? totalDamage * 2 : totalDamage;

  return { damage: finalDamage, isCrit };
}
