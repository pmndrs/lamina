export default /* glsl */ `
float lamina_blend_softLight(float f, float b) {
  return (f < 0.5)
             ? b - (1.0 - 2.0 * f) * b * (1.0 - b)
             : (b < 0.25)
                   ? b + (2.0 * f - 1.0) * b * ((16.0 * b - 12.0) * b + 3.0)
                   : b + (2.0 * f - 1.0) * (sqrt(b) - b);
}
vec4 lamina_blend_softLight(vec4 b, vec4 f) {
  vec4 result;
  result.x = lamina_blend_softLight(f.x, b.x);
  result.y = lamina_blend_softLight(f.y, b.y);
  result.z = lamina_blend_softLight(f.z, b.z);
  result.a = lamina_blend_softLight(f.a, b.a);
  
  return result;
}
vec4 lamina_blend_screen(vec4 f, vec4 b) {
  vec4 result;
  result = 1.0 - (1.0 - f) * (1.0 - b);
  result = mix(f, result, b.a);
  return result;
}
float lamina_blend_overlay(float f, float b) {
  return (b < 0.5) ? 2.0 * f * b : 1.0 - 2.0 * (1.0 - f) * (1.0 - b);
}
vec4 lamina_blend_overlay(vec4 b, vec4 f) {
  vec4 result;
  result.x = lamina_blend_overlay(f.x, b.x);
  result.y = lamina_blend_overlay(f.y, b.y);
  result.z = lamina_blend_overlay(f.z, b.z);
  result.a = lamina_blend_overlay(f.a, b.a);
  return result;
}
vec4 lamina_blend_divide(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);
  result = b / f;
  return result;
}
vec4 lamina_blend_switch(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);
  result = max((f * b.a), (b * (1.0 - b.a)));
  return result;
}
vec4 lamina_blend_darken(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);
  result = mix(f, min(f, b), b.a);
  return result;
}
vec4 lamina_blend_lighten(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);
  result = mix(f, max(f, b), b.a);
  return result;
}
float lamina_blend_addSub(float f, float b) {
  return f > 0.5 ? f + b : b - f;
}
vec4 lamina_blend_addSub(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);
  result.r = lamina_blend_addSub(f.r, b.r * b.a);
  result.g = lamina_blend_addSub(f.g, b.g * b.a);
  result.b = lamina_blend_addSub(f.b, b.b* b.a ) ;
  result.a = lamina_blend_addSub(f.a, b.a);
  return result;
}
vec4 lamina_blend_multiply(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);
  result = mix(f, b * f, b.a);
  result.a = f.a + b.a * (1.0 - f.a);
  return result;
}
vec4 lamina_blend_subtract(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);
  result = f - b * b.a;
  result.a = f.a + b.a * (1.0 - f.a);
  return result;
}
vec4 lamina_blend_add(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);
  result = f + b * (b.a);
  result.a = f.a + b.a * (1.0 - f.a);
  return result;
}
vec4 lamina_blend_copy(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);
  result = mix(f, b, b.a);
  return result;
}
`;
