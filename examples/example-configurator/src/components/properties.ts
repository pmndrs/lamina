import { BlendModes } from '../types'

export const LayerProperties = {
  Color: [
    {
      label: 'Color',
      value: '#ffffff',
      __constructorKey: 'color',
    },
    {
      label: 'Alpha',
      value: 1,
      min: 0,
      max: 1,
      __constructorKey: 'alpha',
    },
    {
      label: 'Blend Mode',
      options: Object.keys(BlendModes),
      value: 'normal',
      __constructorKey: 'mode',
    },
  ],
  Depth: [
    {
      label: 'Color A',
      value: '#ffffff',
      __constructorKey: 'colorA',
    },
    {
      label: 'Color B',
      value: '#ffffff',
      __constructorKey: 'colorB',
    },
    {
      label: 'Alpha',
      value: 1,
      min: 0,
      max: 1,
      __constructorKey: 'alpha',
    },
    {
      label: 'Blend Mode',
      options: Object.keys(BlendModes),
      value: 'normal',
      __constructorKey: 'mode',
    },
    {
      label: 'Origin',
      value: [0, 0, 0],
      __constructorKey: 'origin',
    },
    {
      label: 'Near',
      value: 0,
      __constructorKey: 'near',
    },
    {
      label: 'Far',
      value: 100,
      __constructorKey: 'far',
    },
  ],
  Fresnel: [
    {
      label: 'Color',
      value: '#ffffff',
      __constructorKey: 'color',
    },
    {
      label: 'Alpha',
      value: 1,
      min: 0,
      max: 1,
      __constructorKey: 'alpha',
    },
    {
      label: 'Blend Mode',
      options: Object.keys(BlendModes),
      value: 'normal',
      __constructorKey: 'mode',
    },
    {
      label: 'Power',
      value: 2,
      min: 0,
      max: 3,
      __constructorKey: 'power',
    },
    {
      label: 'Intensity',
      value: 1,
      min: 0,
      max: 10,
      __constructorKey: 'intensity',
    },
    {
      label: 'Bias',
      value: 0,
      min: 0,
      max: 2,
      __constructorKey: 'bias',
    },
  ],
  Noise: [
    {
      label: 'Type',
      options: ['white', 'perlin', 'simplex', 'curl', 'cell'],
      value: 'curl',
      __constructorKey: 'type',
    },
    {
      label: 'Mapping',
      options: ['uv', 'local', 'world'],
      value: 'local',
      __constructorKey: 'mapping',
    },
    {
      label: 'ColorA',
      value: '#ffffff',
      __constructorKey: 'colorA',
    },
    {
      label: 'ColorB',
      value: '#000000',
      __constructorKey: 'colorB',
    },
    {
      label: 'Alpha',
      value: 1,
      min: 0,
      max: 1,
      __constructorKey: 'alpha',
    },
    {
      label: 'Blend Mode',
      options: Object.keys(BlendModes),
      value: 'normal',
      __constructorKey: 'mode',
    },
    {
      label: 'Scale',
      value: 10,
      min: 0,
      max: 100,
      __constructorKey: 'scale',
    },
  ],
  Normals: [
    {
      label: 'Alpha',
      value: 1,
      min: 0,
      max: 1,
      __constructorKey: 'alpha',
    },
    {
      label: 'Blend Mode',
      options: Object.keys(BlendModes),
      value: 'normal',
      __constructorKey: 'mode',
    },
    {
      label: 'Direction',
      value: [1, 1, 1],
      __constructorKey: 'direction',
    },
  ],
  Texture: [
    {
      label: 'Alpha',
      value: 1,
      min: 0,
      max: 1,
      __constructorKey: 'alpha',
    },
    {
      label: 'Blend Mode',
      options: Object.keys(BlendModes),
      value: 'normal',
      __constructorKey: 'mode',
    },
    {
      label: 'Map',
      image: undefined,
      __constructorKey: 'map',
    },
  ],
}
