import { Color, Matrix3, Matrix4, Texture, Vector2, Vector3, Vector4 } from 'three';
export function getUniform(value) {
    if (typeof value === 'string') {
        return new Color(value).convertLinearToSRGB();
    }
    return value;
}
export function getSpecialParameters(label) {
    switch (label) {
        case 'alpha':
            return {
                min: 0,
                max: 1,
            };
        case 'scale':
            return {
                min: 0,
            };
        case 'map':
            return {
                image: undefined,
            };
        default:
            return {};
    }
}
export function getLayerMaterialArgs({ color, alpha, lighting, name, ...rest } = {}) {
    return [
        {
            color,
            alpha,
            lighting,
            name,
        },
        rest,
    ];
}
export function isSerializableType(prop) {
    return (prop instanceof Vector3 ||
        prop instanceof Vector2 ||
        prop instanceof Vector4 ||
        prop instanceof Matrix3 ||
        prop instanceof Matrix4);
}
export function serializeProp(prop) {
    if (isSerializableType(prop)) {
        return prop.toArray();
    }
    else if (prop instanceof Color) {
        return '#' + prop.clone().convertLinearToSRGB().getHexString();
    }
    else if (prop instanceof Texture) {
        return prop.image.src;
    }
    return prop;
}
