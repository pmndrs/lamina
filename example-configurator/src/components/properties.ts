import { SC_BLEND_MODES } from '../types'

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
      options: Object.keys(SC_BLEND_MODES),
      value: 'NORMAL',
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
      options: Object.keys(SC_BLEND_MODES),
      value: 'NORMAL',
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
      options: Object.keys(SC_BLEND_MODES),
      value: 'NORMAL',
      __constructorKey: 'mode',
    },
    {
      label: 'Intensity',
      value: 2,
      min: 0,
      max: 10,
      __constructorKey: 'intensity',
    },
    {
      label: 'Scale',
      value: 1,
      min: 0,
      max: 5,
      __constructorKey: 'scale',
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
      options: Object.keys(SC_BLEND_MODES),
      value: 'NORMAL',
      __constructorKey: 'mode',
    },
    {
      label: 'Scale',
      value: 1,
      min: 0,
      max: 5,
      __constructorKey: 'scale',
    },
  ],
}
