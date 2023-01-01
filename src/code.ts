import { HSL, Position, Props } from "./types";
import { hslToRgb, getHSLCode, getRGBCode, getHexCode } from "./utils";

figma.showUI(__html__, { height: 220 });

figma.ui.onmessage = ( props: Props ) => {
  if (props.type === 'create-rectangles') {
    const { paletteName, hslValues, maxElements, step } = props;
    const selection: SceneNode[] = [];
    // Setup frame
    const paletteFrame: FrameNode = figma.createFrame();
    paletteFrame.name = `${ paletteName } palette`;
    paletteFrame.layoutMode = "VERTICAL";
    paletteFrame.cornerRadius = 8;
    // Generate tones
    let HSLValue: HSL = { ...hslValues };
    let RGBValue: RGB, colorName: string, colorCode: string, colorPreview: RectangleNode;
    for (let i = 0; i < maxElements && HSLValue.l + step <= 100; i++, HSLValue.l += step) {
      RGBValue = { ...hslToRgb(HSLValue) };
      colorName = `${paletteName}-${ HSLValue.l }`;
      colorCode = `${ getHSLCode(HSLValue) } | ${ getRGBCode(RGBValue) } | ${ getHexCode(RGBValue) }`;
      colorPreview = createColorPreview(RGBValue, colorName, { x: 0, y: 100 * i });
      createColorLabel(colorCode, { x: 120, y: 100 * i });
      paletteFrame.appendChild(colorPreview);
    }
    // Focus selection
    selection.push(paletteFrame);
    figma.currentPage.selection = selection;
    figma.viewport.scrollAndZoomIntoView(selection);
  }
};

const createColorPreview = (color: RGB, name: string, position: Position = { x: 0, y: 0 }) => {
  const colorPreview = figma.createRectangle();
  colorPreview.name = `${name}`;
  colorPreview.fills = [{ type: 'SOLID', color }];
  colorPreview.x = position.x;
  colorPreview.y = position.y;
  return colorPreview;
};

const createColorLabel = async (content: string, position: Position = { x: 0, y: 0 })=> {
  const colorLabel = figma.createText();

  colorLabel.x = position.x;
  colorLabel.y = position.y;

  await figma.loadFontAsync(colorLabel.fontName as FontName);

  colorLabel.characters = content;
  colorLabel.fontSize = 16;

  return colorLabel;
};