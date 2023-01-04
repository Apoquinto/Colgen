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
    paletteFrame.counterAxisSizingMode = "AUTO";
    paletteFrame.cornerRadius = 8;
    // Generate variants
    let variants: Variant[] = Array.from(
      { length: (Math.round((100 - hslValues.l) / step) ) },
      (_, i) => new Variant(paletteName, {...hslValues, l: (i * step + hslValues.l)}, { x: 0, y: 108 * i })
    );
    if (variants.length > maxElements) variants = variants.slice(0, maxElements);
    for(let variant of variants){
      generateColorVariant(variant)
        .then((variantFrame: FrameNode) => {
          paletteFrame.appendChild(variantFrame);
        })
        .catch((error) => console.log(error));
    }
    
    selection.push(paletteFrame);
    figma.currentPage.selection = selection;
    figma.viewport.scrollAndZoomIntoView(selection);
  }
};

const generateColorVariant = async (variant: Variant) => {
  const variantFrame: FrameNode = figma.createFrame();
  // Setup frame layout
  variantFrame.name = variant.name;
  variantFrame.layoutMode = "HORIZONTAL";
  variantFrame.counterAxisSizingMode = "AUTO";

  const colorPreview: RectangleNode = createColorPreview(variant.toRGB(), { x: 0, y: 0 });
  const colorDescription: FrameNode = await createColorDescription(variant.name, variant.code);
  variantFrame.appendChild(colorPreview);
  variantFrame.appendChild(colorDescription);

  return variantFrame;
}

const createColorDescription = async (name: string, code: string): Promise<FrameNode> => {
  const descriptionFrame: FrameNode = figma.createFrame();
  descriptionFrame.name = "description";
  descriptionFrame.layoutMode = "VERTICAL";
  descriptionFrame.counterAxisSizingMode = "AUTO";
  descriptionFrame.primaryAxisSizingMode = "AUTO";
  descriptionFrame.paddingTop = descriptionFrame.paddingLeft = descriptionFrame.paddingBottom = descriptionFrame.paddingRight = 8;

  const colorNameLabel: TextNode = await createLabel(name, { x: 0, y: 0 });
  const colorCodeLabel: TextNode = await createLabel(code, { x: 0, y: 0 });
  colorNameLabel.name = "Color name";
  colorCodeLabel.name = "Color code";
  descriptionFrame.appendChild(colorNameLabel);
  descriptionFrame.appendChild(colorCodeLabel);

  return descriptionFrame;
}

const createColorPreview = (color: RGB, position: Position = { x: 0, y: 0 }) => {
  const colorPreview = figma.createRectangle();
  colorPreview.name = "Color preview";
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