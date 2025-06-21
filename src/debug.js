import { extend } from '@react-three/fiber';
import { createRoot } from 'react-dom/client';
import { button, LevaPanel, useControls, useCreateStore } from 'leva';
import React, { useImperativeHandle, useMemo } from 'react';
import { Color, TextureLoader, } from 'three';
import { ShadingTypes } from './types';
import { serializedLayersToJS, serializedLayersToJSX } from './utils/ExportUtils';
import { getLayerMaterialArgs, getUniform } from './utils/Functions';
import * as LAYERS from './vanilla';
extend({
    LayerMaterial: LAYERS.LayerMaterial,
});
function DynamicLeva({ name, layers, store, setUpdate, }) {
    useControls(name, () => {
        const o = {};
        layers.forEach((layer, i) => {
            const n = `${layer.label} ~${i}`;
            o[n] = layer;
            o[n].onChange = () => setUpdate([`${name}.${n}`, layer.label]);
        });
        return o;
    }, { store }, [layers, name]);
    return null;
}
const DebugLayerMaterial = React.forwardRef(({ children, ...props }, forwardRef) => {
    var _a, _b, _c;
    const ref = React.useRef(null);
    useImperativeHandle(forwardRef, () => ref.current);
    const store = useCreateStore();
    const [layers, setLayers] = React.useState({});
    const [path, setPath] = React.useState(['', '']);
    const textureLoader = useMemo(() => new TextureLoader(), []);
    useControls({
        'Copy JSX': button(() => {
            const serialized = ref.current.layers.map((l) => l.serialize());
            const jsx = serializedLayersToJSX(serialized, ref.current.serialize());
            navigator.clipboard.writeText(jsx);
        }),
        'Copy JS': button(() => {
            const serialized = ref.current.layers.map((l) => l.serialize());
            const js = serializedLayersToJS(serialized, ref.current.serialize());
            navigator.clipboard.writeText(js);
        }),
    }, { store });
    const { Lighting } = useControls('Base', {
        Color: {
            value: '#' + new Color(((_a = ref.current) === null || _a === void 0 ? void 0 : _a.color) || (props === null || props === void 0 ? void 0 : props.color) || 'white').convertLinearToSRGB().getHexString(),
            onChange: (v) => {
                ref.current.color = v;
            },
        },
        Alpha: {
            value: ((_b = ref.current) === null || _b === void 0 ? void 0 : _b.alpha) || (props === null || props === void 0 ? void 0 : props.alpha) || 1,
            min: 0,
            max: 1,
            onChange: (v) => {
                ref.current.alpha = v;
            },
        },
        Lighting: {
            value: ((_c = ref.current) === null || _c === void 0 ? void 0 : _c.lighting) || (props === null || props === void 0 ? void 0 : props.lighting) || 'basic',
            options: Object.keys(ShadingTypes),
        },
    }, { store });
    const [args, otherProps] = useMemo(() => getLayerMaterialArgs({ ...props, lighting: Lighting }), [props, Lighting]);
    React.useEffect(() => {
        const layers = ref.current.layers;
        const schema = {};
        layers.forEach((layer, i) => {
            if (layer.getSchema)
                schema[`${layer.name} ~${i}`] = layer.getSchema();
        });
        setLayers(schema);
    }, [children]);
    React.useEffect(() => {
        const data = store.getData();
        const updatedData = data[path[0]];
        if (updatedData) {
            const split = path[0].split('.');
            const index = parseInt(split[0].split(' ~')[1]);
            const property = path[1];
            const id = ref.current.layers[index].uuid;
            const uniform = ref.current.uniforms[`u_${id}_${property}`];
            const layer = ref.current.layers[index];
            if (property !== 'map') {
                layer[property] = updatedData.value;
                if (uniform) {
                    uniform.value = getUniform(updatedData.value);
                }
                else {
                    layer.buildShaders(layer.constructor);
                    ref.current.refresh();
                }
            }
            else {
                ;
                (async () => {
                    try {
                        if (updatedData.value) {
                            const t = await textureLoader.loadAsync(updatedData.value);
                            layer[property] = t;
                            uniform.value = t;
                        }
                        else {
                            layer[property] = undefined;
                            uniform.value = undefined;
                        }
                    }
                    catch (error) {
                        console.error(error);
                    }
                })();
            }
        }
    }, [path]);
    React.useLayoutEffect(() => {
        var _a;
        ref.current.layers = (_a = ref.current.__r3f.children) === null || _a === void 0 ? void 0 : _a.map((l) => l.object);
        ref.current.refresh();
    }, [children, args]);
    React.useLayoutEffect(() => {
        const root = document.body.querySelector('#root');
        const div = document.createElement('div');
        if (root) {
            root.appendChild(div);
            const levaRoot = createRoot(div);
            levaRoot.render(React.createElement(LevaPanel, { titleBar: {
                    title: props.name || ref.current.name,
                }, store: store }));
        }
        return () => {
            div.remove();
        };
    }, [props.name]);
    return (React.createElement(React.Fragment, null,
        Object.entries(layers).map(([name, layers], i) => (React.createElement(DynamicLeva, { key: `${name} ~${i}`, name: name, layers: layers, store: store, setUpdate: setPath }))),
        React.createElement("layerMaterial", { args: [args], ref: ref, ...otherProps }, children)));
});
export default DebugLayerMaterial;
