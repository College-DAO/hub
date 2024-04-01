import { useCallback } from 'react';

import { NodeObject } from 'react-force-graph-2d';

import { HoveredZoneKeyType, MapLink, MapNode, SelectedZoneKeyType, ImagesMap } from '../Types';
import { getNodeActiveState } from '../utils/getNodeActiveState';

const TEXT_PADDING_TOP = 3;
const FONT_WEIGHT = 400;

export function drawTitle(
  ctx: CanvasRenderingContext2D,
  currentNode: MapNode,
  isFaded: boolean,
  isNormal: boolean
) {
  const { x, y, radius, name, fontSize } = currentNode;
  if (x === undefined || y === undefined) {
    return;
  }

  const deltaY = radius + fontSize / 2 + TEXT_PADDING_TOP;
  const textColor = isFaded ? '#33333D' : isNormal ? '#9F9FA5' : '#FFFFFF';

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${FONT_WEIGHT} ${fontSize}px Roboto`;
  ctx.fillStyle = textColor;
  ctx.fillText(name, x, y + deltaY);
}

function drawNodeCanvasObject(
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  selectedZoneKey: SelectedZoneKeyType,
  hoveredZoneKey: HoveredZoneKeyType,
  links: MapLink[],
  images: ImagesMap
): void {
  const currentNode = node as MapNode;
  if (!currentNode || currentNode.x === undefined || currentNode.y === undefined) {
    return;
  }

  const { isFaded, isFocusedZone, isSelectedZone, isNormal } = getNodeActiveState(
    selectedZoneKey,
    currentNode,
    hoveredZoneKey,
    links
  );

  const image = currentNode.logoUrl ? images[currentNode.logoUrl] : null;
  drawNode(ctx, currentNode, isFaded, isFocusedZone, isSelectedZone, globalScale, image);
    
  if (isFaded) {
    return;
  }

  drawTitle(ctx, currentNode, isFaded, isNormal);
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  currentNode: MapNode,
  isFaded: boolean,
  isFocusedZone: boolean,
  isSelectedZone: boolean,
  globalScale: number,
  image: HTMLImageElement | null
) {
  let { x, y } = currentNode;
  const { radius, color, logoRadius } = currentNode;
  if (x === undefined || y === undefined) {
    return;
  }

  const fillStyleOpecity = isFaded ? '0D' : 'AA';
  const borderStyleOpacity = isFaded ? '1E' : isFocusedZone ? 'FF' : 'CD';
  
  let fillColor = '#FFFFFF';

  if (color) {
    switch (color) {
      case '#22aaff':
        fillColor = '#FFFFFF'; 
        break;
      case '#ee11cc': 
        fillColor = '#A9D0FF'; // Change to your desired color
        break;
      // Add more cases for other colors if needed
      default:
        fillColor = '#9BE9CC'; // Default to white for other colors
        break;
  }
}
  if (color) {
    ctx.strokeStyle = `${fillColor}${borderStyleOpacity}`;
    ctx.fillStyle = `${fillColor}${fillStyleOpecity}`;
    ctx.beginPath();
    ctx.lineWidth = 1 / globalScale;

    const animatedPos = currentNode.__animatedPos;
    if (animatedPos && animatedPos.length > 0) {
      const coord = animatedPos.splice(0, 1);
      currentNode.__animatedPos = animatedPos;
      currentNode.x = x = coord[0].x as number;
      currentNode.y = y = coord[0].y as number;
    }

    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  if (isFocusedZone) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 25 * globalScale;
  }

  if (image && logoRadius) {
    if (isFaded) {
      ctx.globalAlpha = 0.12;
    }

    ctx.drawImage(image, x - logoRadius, y - logoRadius, logoRadius * 2, logoRadius * 2);

    if (isFaded) {
      ctx.globalAlpha = 1;
    }
  }

  if (isFocusedZone) {
    ctx.shadowColor = null as any;
    ctx.shadowBlur = null as any;
  }
  console.log(ctx)
}

export const useNodeCanvasObject = (
  selectedZoneKey: SelectedZoneKeyType,
  hoveredZoneKey: HoveredZoneKeyType,
  links: MapLink[],
  images: ImagesMap
) =>
  useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number): void =>
      drawNodeCanvasObject(node, ctx, globalScale, selectedZoneKey, hoveredZoneKey, links, images),
    [selectedZoneKey, hoveredZoneKey, links, images]
  );
