export default /* glsl */ `

/**
 * Normalized a value from the range [-1, 1] to the range [0,1].
 *
 * @name sc_normalize
 * @function
 * @param {float} v Value to normalize
 * @return {float} Normalized Value
 *
 * @example
 * float n = sc_normalize(-0.2);
 * // n = 0.4
 */
float sc_normalize(float v) { return sc_map(v, -1.0, 1.0, 0.0, 1.0); }

/**
 * Generates a random 2D Vector.
 *
 * @name sc_rand2
 * @function
 * @param {vec2} p Vector to hash to generate the random numbers from.
 * @return {vec2} Random vector.
 *
 * @example
 * vec2 n = sc_rand2(vec2(1.0, -4.2));
 */
vec2 sc_rand2(vec2 p) {
  return fract(
      sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) *
      43758.5453);
}

/**
 * Generates a random 3D Vector.
 *
 * @name sc_rand3
 * @function
 * @param {vec3} p Vector to hash to generate the random numbers from.
 * @return {vec3} Random vector.
 *
 * @example
 * vec3 n = sc_rand3(vec3(1.0, -4.2, 0.2));
 */
vec3 sc_rand3(vec3 p) { return mod(((p * 34.0) + 1.0) * p, 289.0); }

/**
 * Generates a random 4D Vector.
 *
 * @name sc_rand4
 * @function
 * @param {vec4} p Vector to hash to generate the random numbers from.
 * @return {vec4} Random vector.
 *
 * @example
 * vec4 n = sc_rand4(vec4(1.0, -4.2, 0.2, 2.2));
 */
vec4 sc_rand4(vec4 p) { return mod(((p * 34.0) + 1.0) * p, 289.0); }

/**
 * Generates a random number.
 *
 * @name sc_rand
 * @function
 * @param {float} n Value to hash to generate the number from.
 * @return {float} Random number.
 *
 * @example
 * float n = sc_rand(2.5);
 */
float sc_rand(float n) { return fract(sin(n) * 1e4); }

/**
 * Generates a random number.
 *
 * @name sc_rand
 * @function
 * @param {vec2} p Value to hash to generate the number from.
 * @return {float} Random number.
 *
 * @example
 * float n = sc_rand(vec2(2.5, -1.8));
 */
float sc_rand(vec2 p) {
  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) *
               (0.1 + abs(sin(p.y * 13.0 + p.x))));
}
`;
