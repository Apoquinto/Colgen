import { HSL, Position, RGB } from "./types";

export class Variant {
  name: string;
  code: string;
  pallete: string;
  position: Position;
  color: HSL;

  constructor(pallete: string, color: HSL, position: Position) {
    this.pallete = pallete;
    this.color = color;
    this.name = `${ pallete }-${ 1000 - color.l * 10 }`
    this.code = `${ this.formatToHEX() } | ${ this.formatToHSL() } | ${ this.formatToRGB() }`;
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

  formatToRGB(): string {
    const { r, g, b } = this.toRGB();
    return `RGB( ${ Math.round(r * 255) } ${ Math.round(g * 255) } ${ Math.round(b * 255) } )`;
  }

  formatToHEX(): string {
    const { r, g, b } = this.toRGB();
    return `#${ numberToHex(Math.round(r * 255)) }${ numberToHex(Math.round(g * 255)) }${ numberToHex(Math.round(b * 255)) }`.toUpperCase();
  }

  formatToHSL(): string {
    const { h, s, l } = this.color;
    return `HSL( ${ h } ${ s } ${ l } )`;
  }
}

const numberToHex = ( value: number ) => {
  const hexRepresetation = value.toString(16);
  return hexRepresetation.length > 1 ? hexRepresetation: `0${hexRepresetation}`;
}
