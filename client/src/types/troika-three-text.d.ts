declare module 'troika-three-text' {
  import { Object3D } from 'three';

  export class Text extends Object3D {
    text: string;
    fontSize: number;
    color: number | string;
    anchorX?: string | number;
    anchorY?: string | number;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    font?: string;
    position: {
      set: (x: number, y: number, z: number) => void;
    };
    sync: () => void;
  }
}