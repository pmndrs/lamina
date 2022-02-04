import { useControls } from 'leva'
import { SC_BLEND_MODES } from '../../../src/types'

export default function useSphereControls() {
  const {
    Strength: BaseStrength,
    Color: BaseColor,
    BlendMode: BaseBlendMode,
  } = useControls('Base', {
    Strength: { min: 0, max: 1, value: 1 },
    Color: { value: '#ffffff' },
    BlendMode: { options: Object.keys(SC_BLEND_MODES), value: 'normal' },
  })

  const {
    Strength: GradientStrength,
    ColorA: GradientColorA,
    ColorB: GradientColorB,
    BlendMode: GradientBlendMode,
  } = useControls('Gradient', {
    Strength: { min: 0, max: 1, value: 0.5 },
    ColorA: { value: '#005182' },
    ColorB: { value: '#d4f8ff' },
    BlendMode: { options: Object.keys(SC_BLEND_MODES), value: 'multiply' },
  })
  const {
    Strength: FresnelStrength,
    Color: FresnelColor,
    BlendMode: FresnelBlendMode,
  } = useControls('Fresnel', {
    Strength: { min: 0, max: 1, value: 0.5 },
    Color: { value: '#bffbff' },
    BlendMode: { options: Object.keys(SC_BLEND_MODES), value: 'softlight' },
  })

  const {
    Strength: GrainStrength,
    Color: GrainColor,
    BlendMode: GrainBlendMode,
  } = useControls('Grain', {
    Strength: { min: 0, max: 1, value: 0.5 },
    Color: { value: '#a3a3a3' },
    BlendMode: { options: Object.keys(SC_BLEND_MODES), value: 'normal' },
  })

  return {
    GradientStrength,
    GradientBlendMode,
    GradientColorA,
    GradientColorB,

    GrainBlendMode,
    GrainColor,
    GrainStrength,

    FresnelBlendMode,
    FresnelColor,
    FresnelStrength,

    BaseStrength,
    BaseColor,
    BaseBlendMode,
  }
}
