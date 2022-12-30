"use strict";
figma.showUI(__html__);
figma.ui.onmessage = msg => {
    if (msg.type === 'create-rectangles') {
        const nodes = [];
        const { hslValues, maxElements, step } = msg;
        const currentValue = Object.assign({}, hslValues);
        for (let i = 0; i < maxElements && currentValue.l + step < 100; i++) {
            const rect = figma.createRectangle();
            rect.y = i * 100;
            rect.fills = [{ type: 'SOLID', color: hslToRgb(currentValue) }];
            currentValue.l += step;
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    figma.closePlugin();
};
;
// Method found in: https://www.30secondsofcode.org/js/s/hsl-to-rgb
const hslToRgb = (source) => {
    let rgbValue = { r: 0, g: 0, b: 0 };
    let hslValue = Object.assign({}, source);
    hslValue.s /= 100;
    hslValue.l /= 100;
    const k = (n) => (n + hslValue.h / 30) % 12;
    const a = hslValue.s * Math.min(hslValue.l, 1 - hslValue.l);
    const f = (n) => hslValue.l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    rgbValue.r = f(0);
    rgbValue.b = f(4);
    rgbValue.g = f(8);
    return rgbValue;
};
