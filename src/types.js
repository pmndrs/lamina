import * as THREE from 'three';
export const BlendModes = {
    normal: 'normal',
    add: 'add',
    subtract: 'subtract',
    multiply: 'multiply',
    lighten: 'lighten',
    darken: 'darken',
    divide: 'divide',
    overlay: 'overlay',
    screen: 'screen',
    softlight: 'softlight',
    negation: 'negation',
    reflect: 'reflect',
};
export const NoiseTypes = {
    perlin: 'perlin',
    simplex: 'simplex',
    cell: 'cell',
    curl: 'curl',
    white: 'white',
};
export const MappingTypes = {
    local: 'local',
    world: 'world',
    uv: 'uv',
};
export const ShadingTypes = {
    phong: THREE.MeshPhongMaterial,
    physical: THREE.MeshPhysicalMaterial,
    toon: THREE.MeshToonMaterial,
    basic: THREE.MeshBasicMaterial,
    lambert: THREE.MeshLambertMaterial,
    standard: THREE.MeshStandardMaterial,
};
