import { HSL, Position, RGB } from "./types";

export class Variant {
  name: string;
  code: string;
  pallete: string;
  position: Position;
  color: HSL;

  constructor(pallete: string, color: HSL, position: Position) {
    this.name = `${ pallete }-${ 1000 - color.l * 10 }`
    this.code = "";
    this.pallete = pallete;
    this.color = color;
    this.position = position;
  }

  // Algorithm found in: https://www.30secondsofcode.org/js/s/hsl-to-rgb
  toRGB(): RGB {
    let rgbValue = { r: 0, g: 0, b: 0 };

    const saturation = this.color.s / 100;
    const lightness = this.color.l / 100;
  
    const k = (n: number): number => (n + this.color.h / 30) % 12;
    const a = saturation * Math.min(lightness, 1 - lightness);
    const f = (n: number): number => lightness - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  
    rgbValue.r = f(0);
    rgbValue.b = f(4);
    rgbValue.g = f(8);

    return rgbValue;
  }
}

// Method found in: https://www.30secondsofcode.org/js/s/hsl-to-rgb
export const hslToRgb = (source: HSL): RGB => {
  let rgbValue = { r: 0, g: 0, b: 0 };

  let hslValue = { ...source };

  hslValue.s /= 100;
  hslValue.l /= 100;

  const k = (n: number): number => (n + hslValue.h / 30) % 12;
  const a = hslValue.s * Math.min(hslValue.l, 1 - hslValue.l);
  const f = (n: number): number =>
    hslValue.l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  rgbValue.r = f(0);
  rgbValue.b = f(4);
  rgbValue.g = f(8);

  return rgbValue;
}

const numberToHex = ( value: number ) => {
  const hexRepresetation = value.toString(16);
  return hexRepresetation.length > 1 ? hexRepresetation: `0${hexRepresetation}`;
}

/**
 * Convert a RGB representation in range [0,1] to RGB representation in range [0,255]
 * @param rgb 
 */
const getRGBDigits = ( rgb: RGB ) => ({ 
  rDigit: Math.round(rgb.r * 255), 
  gDigit: Math.round(rgb.g * 255),
  bDigit: Math.round(rgb.b * 255)
});

export const getHSLCode = (hsl: HSL) => `HSL(${ hsl.h } ${ hsl.s } ${ hsl.l })`;

export const getRGBCode = (rgb: RGB) => {
  const { rDigit, gDigit, bDigit } = getRGBDigits(rgb);
  return `RGB( ${ rDigit } ${ gDigit } ${ bDigit } )`;
};

export const getHexCode = (rgb: RGB) => {
  const { rDigit, gDigit, bDigit } = getRGBDigits(rgb);
  return `#${ numberToHex(rDigit) }${ numberToHex(gDigit) }${ numberToHex(bDigit) }`.toUpperCase();
};
