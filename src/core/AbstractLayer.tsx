import { IUniform, MathUtils } from "three";
import { LayerBlendMode } from "../types";

export default abstract class AbstractLayer {
  protected abstract uuid: string;
  protected name: string;
  abstract uniforms: {
    [key: string]: IUniform<any>;
  };

  getVertexVariables(): string {
    return "";
  }
  getVertexBody(e: string): string {
    return "";
  }

  abstract getFragmentVariables(): string;
  abstract getFragmentBody(e: string): string;

  static genID() {
    return MathUtils.generateUUID().replaceAll("-", "_");
  }
}
