export default /* glsl */ `
/**
 * Converts a number from one range to another.
 *
 * @name sc_map
 * @function
 * @param {} value      Value to map
 * @param {float} min1  Minimum for current range
 * @param {float} max1  Maximum for current range
 * @param {float} min2  Minimum for wanted range
 * @param {float} max2  Maximum for wanted range
 * @return {float} Mapped Value
 *
 * @example
 * float n = sc_map(-0.2, -1.0, 1.0, 0.0, 1.0);
 * // n = 0.4
 */
float sc_map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
`;
