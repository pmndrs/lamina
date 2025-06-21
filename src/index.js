import { extend } from '@react-three/fiber';
import React, { useImperativeHandle, useMemo } from 'react';
import DebugLayerMaterial from './debug';
import { getLayerMaterialArgs } from './utils/Functions';
import * as LAYERS from './vanilla';
extend({
    LayerMaterial: LAYERS.LayerMaterial,
    Depth_: LAYERS.Depth,
    Color_: LAYERS.Color,
    Noise_: LAYERS.Noise,
    Fresnel_: LAYERS.Fresnel,
    Gradient_: LAYERS.Gradient,
    Matcap_: LAYERS.Matcap,
    Texture_: LAYERS.Texture,
    Displace_: LAYERS.Displace,
    Normal_: LAYERS.Normal,
});
const LayerMaterial = React.forwardRef(({ children, ...props }, forwardRef) => {
    const ref = React.useRef(null);
    useImperativeHandle(forwardRef, () => ref.current);
    React.useLayoutEffect(() => {
        var _a;
        ref.current.layers = (_a = ref.current.__r3f.children) === null || _a === void 0 ? void 0 : _a.map((l) => l.object);
        ref.current.refresh();
    }, [children]);
    const [args, otherProps] = useMemo(() => getLayerMaterialArgs(props), [props]);
    return (React.createElement("layerMaterial", { args: [args], ref: ref, ...otherProps }, children));
});
function getNonUniformArgs(props) {
    return [
        {
            mode: props === null || props === void 0 ? void 0 : props.mode,
            visible: props === null || props === void 0 ? void 0 : props.visible,
            type: props === null || props === void 0 ? void 0 : props.type,
            mapping: props === null || props === void 0 ? void 0 : props.mapping,
            map: props === null || props === void 0 ? void 0 : props.map,
            axes: props === null || props === void 0 ? void 0 : props.axes,
        },
    ];
}
const Depth = React.forwardRef((props, forwardRef) => {
    //@ts-ignore
    return React.createElement("depth_", { args: getNonUniformArgs(props), ref: forwardRef, ...props });
});
const Color = React.forwardRef((props, ref) => {
    //@ts-ignore
    return React.createElement("color_", { ref: ref, args: getNonUniformArgs(props), ...props });
});
const Noise = React.forwardRef((props, ref) => {
    //@ts-ignore
    return React.createElement("noise_", { ref: ref, args: getNonUniformArgs(props), ...props });
});
const Fresnel = React.forwardRef((props, ref) => {
    //@ts-ignore
    return React.createElement("fresnel_", { ref: ref, args: getNonUniformArgs(props), ...props });
});
const Gradient = React.forwardRef((props, ref) => {
    //@ts-ignore
    return React.createElement("gradient_", { ref: ref, args: getNonUniformArgs(props), ...props });
});
const Matcap = React.forwardRef((props, ref) => {
    //@ts-ignore
    return React.createElement("matcap_", { ref: ref, args: getNonUniformArgs(props), ...props });
});
const Texture = React.forwardRef((props, ref) => {
    //@ts-ignore
    return React.createElement("texture_", { ref: ref, args: getNonUniformArgs(props), ...props });
});
const Displace = React.forwardRef((props, ref) => {
    //@ts-ignore
    return React.createElement("displace_", { ref: ref, args: getNonUniformArgs(props), ...props });
});
const Normal = React.forwardRef((props, ref) => {
    //@ts-ignore
    return React.createElement("normal_", { ref: ref, args: getNonUniformArgs(props), ...props });
});
export { Color, DebugLayerMaterial, Depth, Displace, Fresnel, Gradient, LayerMaterial, Matcap, Noise, Normal, Texture };
