figma.showUI(__html__);

figma.ui.onmessage = msg => {
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    const { hslValues, maxElements, step } = msg;
    const currentValue: HSL = { ...hslValues };
    for (let i = 0; i < maxElements && currentValue.l + step < 100; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
      currentValue.l += step;
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  figma.closePlugin();
};

interface HSL {
  h: number,
  s: number,
  l: number,
}

interface message {
  type: string,
  hslValues: HSL,
  maxElements: number,
  step: number,
};

// Method found in: https://www.30secondsofcode.org/js/s/hsl-to-rgb
const hslToRgb = (hslValue: HSL): RGB => {
  let rgbValue = { r: 0, g: 0, b: 0 };

  hslValue.s /= 100;
  hslValue.l /= 100;

  const k = (n: number): number => (n + hslValue.h / 30) % 12;
  const a = hslValue.s * Math.min(hslValue.l, 1 - hslValue.l);
  const f = (n: number): number =>
    hslValue.l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  rgbValue.r = Math.round(f(0) * 255);
  rgbValue.b = Math.round(f(4) * 255);
  rgbValue.g = Math.round(f(8) * 255);

  return rgbValue;
}