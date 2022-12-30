figma.showUI(__html__);

figma.ui.onmessage = msg => {
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    const { hslValues, maxElements, step } = msg;
    const currentColor: HSL = { ...hslValues };
    for (let i = 0; i < maxElements && currentColor.l + step < 100; i++) {
      const colorPreview = createColorPreview(currentColor, { x: 0, y: 100 * i });
      currentColor.l += step;
      figma.currentPage.appendChild(colorPreview);
      nodes.push(colorPreview);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  figma.closePlugin();
};

const createColorPreview = (color: HSL, position: Position = { x: 0, y: 0 }) => {
  const colorPreview = figma.createRectangle();
  colorPreview.fills = [{type: 'SOLID', color: hslToRgb(color)}];
  colorPreview.x = position.x;
  colorPreview.y = position.y;
  return colorPreview;
}

const createColorLabel = (content: string) => {
  const text = figma.createText()
  text.fontName = {family: 'Roboto', style: 'Regular'}
  text.characters = content;
  text.fontSize = 24;
  return text 
}

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