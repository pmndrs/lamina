import { IUniform, MathUtils } from 'three'

export default abstract class AbstractLayer {
  protected abstract uuid: string
  protected abstract name: string
  abstract uniforms: {
    [key: string]: IUniform<any>
  }

  getVertexVariables(): string {
    return ''
  }
  getVertexBody(e: string): string {
    return ''
  }

  abstract getFragmentVariables(): string
  abstract getFragmentBody(e: string): string

  static genID() {
    return MathUtils.generateUUID().replaceAll('-', '_')
  }
}