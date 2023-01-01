export interface HSL {
  h: number,
  s: number,
  l: number,
};

export interface RGB {
  r: number,
  g: number,
  b: number,
};

export interface Props {
  type: string,
  paletteName: string,
  hslValues: HSL,
  maxElements: number,
  step: number,
};

export interface Position {
  x: number,
  y: number,
};