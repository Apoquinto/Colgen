import { Position, Props } from "./types";
import { Variant } from "./utils";

figma.showUI(__html__, { height: 220 });

figma.ui.onmessage = ( props: Props ) => {
  if (props.type === 'create-rectangles') {
    const selection: SceneNode[] = [];
    const { paletteName, hslValues, maxElements, step } = props;
    // Setup frame
    const paletteFrame: FrameNode = figma.createFrame();
    paletteFrame.name = `${ paletteName } palette`;
    paletteFrame.layoutMode = "VERTICAL";
    paletteFrame.cornerRadius = 8;
    // Generate variants
    let variants: Variant[] = Array.from(
      { length: (Math.round((100 - hslValues.l) / step) ) },
      (_, i) => new Variant(paletteName, {...hslValues, l: (i * step + hslValues.l)}, { x: 0, y: 108 * i })
    );
    if (variants.length > maxElements) variants = variants.slice(0, maxElements);
    for(let variant of variants){
      paletteFrame.appendChild(generateColorVariant(variant));
    }
    
    selection.push(paletteFrame);
    figma.currentPage.selection = selection;
    figma.viewport.scrollAndZoomIntoView(selection);
  }
};

const generateColorVariant = (variant: Variant) => {
  const variantFrame: FrameNode = figma.createFrame();
  // Setup frame layout
  variantFrame.name = `${ variant }$ variant`;
  variantFrame.layoutMode = "HORIZONTAL";

  const colorPreview: RectangleNode = createColorPreview(variant.toRGB(), variant.name, { x: 0, y: 0 });
  variantFrame.appendChild(colorPreview);
  
  return variantFrame;
}

const createColorPreview = (color: RGB, name: string, position: Position = { x: 0, y: 0 }) => {
  const colorPreview = figma.createRectangle();
  colorPreview.name = `${name}`;
  colorPreview.fills = [{ type: 'SOLID', color }];
  colorPreview.x = position.x;
  colorPreview.y = position.y;
  return colorPreview;
};

const createLabel = async (content: string, position: Position = { x: 0, y: 0 })=> {
  const colorLabel = figma.createText();

  colorLabel.x = position.x;
  colorLabel.y = position.y;

  await figma.loadFontAsync(colorLabel.fontName as FontName);

  colorLabel.characters = content;
  colorLabel.fontSize = 16;

  return colorLabel;
};