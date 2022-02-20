/* eslint-disable */

import { extend, Node } from "@react-three/fiber";
import React from "react";
import mergeRefs from "react-merge-refs";
import {
  DepthProps,
  ColorProps,
  LayerMaterialProps,
  ShadingProps,
  NoiseProps,
} from "./types";
import * as LAYERS from "./vanilla";
import DebugLayerMaterial from "./debug";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      layerMaterial: Node<LAYERS.LayerMaterial, typeof LAYERS.LayerMaterial>;
      depth_: Node<LAYERS.Depth, typeof LAYERS.Depth>;
      color_: Node<LAYERS.Color, typeof LAYERS.Color>;
      shading_: Node<LAYERS.Shading, typeof LAYERS.Shading>;
      noise_: Node<LAYERS.Noise, typeof LAYERS.Noise>;
    }
  }
}

extend({
  LayerMaterial: LAYERS.LayerMaterial,
  Depth_: LAYERS.Depth,
  Color_: LAYERS.Color,
  Shading_: LAYERS.Shading,
  Noise_: LAYERS.Noise,
});

const LayerMaterial = React.forwardRef<
  LAYERS.LayerMaterial,
  React.PropsWithChildren<LayerMaterialProps>
>(({ children, ...props }, forwardRef) => {
  const ref = React.useRef<LAYERS.LayerMaterial>(null!);

  React.useLayoutEffect(() => {
    ref.current.layers = (ref.current as any).__r3f.objects;
    ref.current.update();
  }, [children]);

  return (
    <layerMaterial ref={mergeRefs([ref, forwardRef])} {...props}>
      {children}
    </layerMaterial>
  );
});

function getNonUniformArgs(props: any) {
  return [
    {
      mode: props?.mode,
      visible: props?.visible,
      type: props?.type,
      mapping: props?.mapping,
    },
  ] as any;
}

const Depth = React.forwardRef<LAYERS.Depth, DepthProps>(
  (props, forwardRef) => {
    return (
      <depth_ args={getNonUniformArgs(props)} ref={forwardRef} {...props} />
    );
  }
) as React.ForwardRefExoticComponent<
  DepthProps & React.RefAttributes<LAYERS.Depth>
>;

const Color = React.forwardRef<LAYERS.Color, ColorProps>(
  (props, forwardRef) => {
    return (
      <color_ args={getNonUniformArgs(props)} ref={forwardRef} {...props} />
    );
  }
) as React.ForwardRefExoticComponent<
  ColorProps & React.RefAttributes<LAYERS.Color>
>;

const Shading = React.forwardRef<LAYERS.Shading, ShadingProps>(
  (props, forwardRef) => {
    return (
      <shading_ args={getNonUniformArgs(props)} ref={forwardRef} {...props} />
    );
  }
) as React.ForwardRefExoticComponent<
  ShadingProps & React.RefAttributes<LAYERS.Shading>
>;

const Noise = React.forwardRef<LAYERS.Noise, NoiseProps>((props, ref) => {
  return <noise_ args={getNonUniformArgs(props)} {...props} />;
}) as React.ForwardRefExoticComponent<
  NoiseProps & React.RefAttributes<LAYERS.Noise>
>;

export { DebugLayerMaterial, LayerMaterial, Depth, Color, Shading, Noise };
