import { IUniform, MathUtils } from 'three'

export default abstract class Abstract {
  protected abstract uuid: string
  protected abstract name: string
  abstract uniforms: {
    [key: string]: IUniform<any>
  }

  abstract getFragmentVariables(): string
  abstract getFragmentBody(e?: string): string

  static genID() {
    return MathUtils.generateUUID().replaceAll('-', '_')
  }

  getVertexVariables(): string {
    return ''
  }
  getVertexBody(e?: string): string {
    return ''
  }
}
