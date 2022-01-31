export default /* glsl */ `
// SC: Blend modes definitions **********

#define sc_COPY 1
#define sc_ADD 2
#define sc_SUBTRACT 3
#define sc_MULTIPLY 4
#define sc_ADDSUB 5
#define sc_LIGHTEN 6
#define sc_DARKEN 7
#define sc_SWITCH 8
#define sc_DIVIDE 9
#define sc_OVERLAY 10
#define sc_SCREEN 11
#define sc_SOFTLIGHT 12

float sc_softLight(float f, float b) {
  return (f < 0.5)
             ? b - (1.0 - 2.0 * f) * b * (1.0 - b)
             : (b < 0.25)
                   ? b + (2.0 * f - 1.0) * b * ((16.0 * b - 12.0) * b + 3.0)
                   : b + (2.0 * f - 1.0) * (sqrt(b) - b);
}

vec4 sc_softLight(vec4 f, vec4 b) {
  vec4 result;
  result.x = sc_softLight(f.x, b.x);
  result.y = sc_softLight(f.y, b.y);
  result.z = sc_softLight(f.z, b.z);
  result.a = sc_softLight(f.a, b.a);
  return result;
}

vec4 sc_screen(vec4 f, vec4 b) {
  vec4 result;

  result = 1.0 - (1.0 - f) * (1.0 - b);

  return result;
}

float sc_overlay(float f, float b) {
  return (b < 0.5) ? 2.0 * f * b : 1.0 - 2.0 * (1.0 - f) * (1.0 - b);
}

vec4 sc_overlay(vec4 f, vec4 b) {
  vec4 result;
  result.x = sc_overlay(f.x, b.x);
  result.y = sc_overlay(f.y, b.y);
  result.z = sc_overlay(f.z, b.z);
  result.a = sc_overlay(f.a, b.a);
  return result;
}

vec4 sc_divide(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result = b / f;

  return result;
}

vec4 sc_switch(vec4 f, vec4 b, float o) {
  vec4 result = vec4(0.0);

  result = max((f * o), (b * (1.0 - o)));

  return result;
}

vec4 sc_darken(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result = min(f, b);

  return result;
}

vec4 sc_lighten(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result = max(f, b);

  return result;
}

float sc_addSub(float f, float b) { return f > 0.5 ? f + b : b - f; }

vec4 sc_addSub(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result.r = sc_addSub(f.r, b.r);
  result.g = sc_addSub(f.g, b.g);
  result.b = sc_addSub(f.b, b.b);
  result.a = sc_addSub(f.a, b.a);

  return result;
}

vec4 sc_multiply(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result = f * b;
  result.a = f.a + b.a * (1.0 - f.a);

  return result;
}

vec4 sc_subtract(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result = b - f;
  result.a = f.a + b.a * (1.0 - f.a);

  return result;
}

vec4 sc_add(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result = f + b;
  result.a = f.a + b.a * (1.0 - f.a);

  return result;
}

vec4 sc_copy(vec4 f, vec4 b) {
  vec4 result = vec4(0.0);

  result.a = f.a + b.a * (1.0 - f.a);
  result.rgb = ((f.rgb * f.a) + (b.rgb * b.a) * (1.0 - f.a));

  return result;
}

vec4 sc_blend(vec4 f, vec4 b, int type) {

  vec4 n;

  if (type == sc_COPY) {
    n = sc_copy(f, b);
  } else if (type == sc_ADD) {
    n = sc_add(f, b);
  } else if (type == sc_SUBTRACT) {
    n = sc_subtract(f, b);
  } else if (type == sc_MULTIPLY) {
    n = sc_multiply(f, b);
  } else if (type == sc_ADDSUB) {
    n = sc_addSub(f, b);
  } else if (type == sc_LIGHTEN) {
    n = sc_lighten(f, b);
  } else if (type == sc_DARKEN) {
    n = sc_darken(f, b);
  } else if (type == sc_DIVIDE) {
    n = sc_divide(f, b);
  } else if (type == sc_OVERLAY) {
    n = sc_overlay(f, b);
  } else if (type == sc_SCREEN) {
    n = sc_screen(f, b);
  } else if (type == sc_SOFTLIGHT) {
    n = sc_softLight(f, b);
  }

  return n;
}
`
// ************************************
