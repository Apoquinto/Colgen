figma.showUI(__html__);

figma.ui.onmessage = msg => {
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    const { hslValues, maxElements, step } = msg;
    const currentColor: HSL = { ...hslValues };
    for (let i = 0; i < maxElements && currentColor.l + step < 100; i++) {
      let RGBValue = { ...hslToRgb(currentColor) };
      let colorCode = `${ getHSLCode(currentColor) } | ${ getRGBCode(RGBValue) }`;
      let colorPreview = createColorPreview(RGBValue, { x: 0, y: 100 * i });
      figma.currentPage.appendChild(colorPreview);
      nodes.push(colorPreview);
      createColorLabel(colorCode, { x: 120, y: 100 * i });
      currentColor.l += step;
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
};

const createColorPreview = (color: RGB, position: Position = { x: 0, y: 0 }) => {
  const colorPreview = figma.createRectangle();
  colorPreview.fills = [{ type: 'SOLID', color }];
  colorPreview.x = position.x;
  colorPreview.y = position.y;
  return colorPreview;
}

const createColorLabel = async (content: string, position: Position = { x: 0, y: 0 })=> {
  const colorLabel = figma.createText();

  colorLabel.x = position.x;
  colorLabel.y = position.y;

  await figma.loadFontAsync(colorLabel.fontName);

  colorLabel.characters = content;
  colorLabel.fontSize = 16;

  return colorLabel;
}

const getHSLCode = (hsl: HSL) => `HSL(${ hsl.h } ${ hsl.s } ${ hsl.l })`;

const getRGBCode = (rgb: RGB) => `RGB(${ rgb.r } ${ rgb.g } ${ rgb.b })`;

interface HSL {
  h: number,
  s: number,
  l: number,
};

interface message {
  type: string,
  hslValues: HSL,
  maxElements: number,
  step: number,
};

interface Position {
  x: number,
  y: number,
};

// Method found in: https://www.30secondsofcode.org/js/s/hsl-to-rgb
const hslToRgb = (source: HSL): RGB => {
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