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