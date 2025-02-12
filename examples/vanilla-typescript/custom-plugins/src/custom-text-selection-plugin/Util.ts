import { Pdf } from '@pdftools/pdf-web-sdk';

/**
 * Calculates a sub-quadrilateral of a text fragment based on glyph indices.
 * @param fragment - The text fragment to modify.
 * @param startIndex - The start glyph index.
 * @param endIndex - The end glyph index.
 * @returns The calculated sub-quadrilateral.
 */
export function calculateFragmentSubQuadrilateral(
  fragment: Pdf.TextFragment,
  startIndex: number,
  endIndex: number
): Pdf.Geometry.Quadrilateral {
  const quadrilateral = fragment.quadrilateral;
  const glyphOffsets = fragment.glyphOffsets;

  const bottomLeft = quadrilateral.p1.clone();
  const bottomRight = quadrilateral.p2.clone();
  const topLeft = quadrilateral.p4.clone();
  const topRight = quadrilateral.p3.clone();

  const startOffset = glyphOffsets[startIndex];
  const endOffset = glyphOffsets[endIndex + 1];

  // baseline
  if (quadrilateral.p2.x === quadrilateral.p1.x) {
    // vertical
    const direction = quadrilateral.p1.y < quadrilateral.p2.y ? 1 : -1;
    bottomLeft.y += direction * startOffset;
    bottomRight.y = quadrilateral.p1.y + direction * endOffset;
  } else {
    // non vertical -> y = ax + b
    const a =
      (quadrilateral.p2.y - quadrilateral.p1.y) /
      (quadrilateral.p2.x - quadrilateral.p1.x);
    const b = quadrilateral.p2.y - a * quadrilateral.p2.x;
    // m = distance on diagonal line to advance 1 in x direction
    const m = Math.sqrt(1 + a ** 2);
    const direction = quadrilateral.p1.x < quadrilateral.p2.x ? 1 : -1;
    bottomLeft.x += (direction * startOffset) / m;
    bottomLeft.y = a * bottomLeft.x + b;
    bottomRight.x = quadrilateral.p1.x + direction * (endOffset / m);
    bottomRight.y = a * bottomRight.x + b;
  }

  // topline
  if (quadrilateral.p3.x === quadrilateral.p4.x) {
    // vertical
    const direction = quadrilateral.p4.y < quadrilateral.p3.y ? 1 : -1;
    topLeft.y += direction * startOffset;
    topRight.y = quadrilateral.p4.y + direction * endOffset;
  } else {
    // non vertical -> y = ax + b
    const a =
      (quadrilateral.p3.y - quadrilateral.p4.y) /
      (quadrilateral.p3.x - quadrilateral.p4.x);
    const b = quadrilateral.p3.y - a * quadrilateral.p3.x;
    // m = distance on diagonal line to advance 1 in x direction
    const m = Math.sqrt(1 + a ** 2);
    const direction = quadrilateral.p4.x < quadrilateral.p3.x ? 1 : -1;
    topLeft.x += (direction * startOffset) / m;
    topLeft.y = a * topLeft.x + b;
    topRight.x = quadrilateral.p4.x + direction * (endOffset / m);
    topRight.y = a * topRight.x + b;
  }

  return new Pdf.Geometry.Quadrilateral(bottomLeft, bottomRight, topRight, topLeft);
}

/**
 * Determines the glyph offset index for a given glyph offset value.
 * @param glyphOffsets - Array of glyph offsets.
 * @param glyphOffset - The glyph offset to locate.
 * @returns The corresponding glyph offset index.
 */
export function calculateGlyphOffsetIndex(
  glyphOffsets: number[],
  glyphOffset: number
) {
  if (glyphOffset === Number.NEGATIVE_INFINITY) return 0;
  else if (glyphOffset === Number.POSITIVE_INFINITY) return glyphOffsets.length - 2;

  for (let i = 0; i < glyphOffsets.length; i++) {
    if (glyphOffsets[i] >= glyphOffset) return i - 1;
  }
  return glyphOffsets.length - 1;
}

/**
 * Calculates the start and end glyph offset indices for a text fragment.
 * @param glyphOffsets - Array of glyph offsets.
 * @param startGlyphOffset - The starting glyph offset.
 * @param endGlyphOffset - The ending glyph offset.
 * @returns An object containing start and end glyph offset indices.
 */
export function calculateSameFragmentGlyphOffsetIndices(
  glyphOffsets: number[],
  startGlyphOffset: number,
  endGlyphOffset: number
): { startGlyphOffsetIndex: number; endGlyphOffsetIndex: number } {
  let startGlyphOffsetIndex = 0;
  let endGlyphOffsetIndex = glyphOffsets.length - 1;

  if (startGlyphOffset === Number.NEGATIVE_INFINITY) {
    startGlyphOffsetIndex = 0;
  } else if (startGlyphOffset === Number.POSITIVE_INFINITY) {
    startGlyphOffsetIndex = glyphOffsets.length - 1;
  } else {
    for (let i = 0; i < glyphOffsets.length; i++) {
      if (glyphOffsets[i] <= startGlyphOffset) startGlyphOffsetIndex = i;
    }
  }

  if (endGlyphOffset === Number.NEGATIVE_INFINITY) {
    endGlyphOffsetIndex = 0;
  } else if (endGlyphOffset === Number.POSITIVE_INFINITY) {
    endGlyphOffsetIndex = glyphOffsets.length - 2;
  } else {
    for (let i = glyphOffsets.length - 1; i >= 0; i--) {
      if (glyphOffsets[i] >= endGlyphOffset) endGlyphOffsetIndex = i - 2;
    }
  }

  return { startGlyphOffsetIndex, endGlyphOffsetIndex };
}

/**
 * Draws a line on the canvas between specified points.
 * @param canvas - The canvas element to draw on.
 * @param points - The points defining the line.
 * @param color - The color of the line.
 */
export function drawLine(
  canvas: HTMLCanvasElement,
  points: Pdf.Geometry.Point[],
  color: string
) {
  const region = new Path2D();

  region.moveTo(points[0].x, points[0].y);
  region.lineTo(points[1].x, points[1].y);
  region.lineTo(points[0].x, points[0].y);

  region.closePath();

  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = color;
  ctx.stroke(region);
}

/**
 * Draws a quadrilateral outline on the canvas.
 * @param canvas - The canvas element to draw on.
 * @param points - The four points defining the quadrilateral.
 * @param color - The color of the outline.
 */
export function drawQuadrilateralOutline(
  canvas: HTMLCanvasElement,
  points: Pdf.Geometry.Point[],
  color: string
) {
  const region = new Path2D();

  region.moveTo(points[0].x, points[0].y);
  region.lineTo(points[1].x, points[1].y);
  region.lineTo(points[2].x, points[2].y);
  region.lineTo(points[3].x, points[3].y);
  region.lineTo(points[0].x, points[0].y);

  region.closePath();

  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = color;
  ctx.stroke(region);
}

/**
 * Draws a filled quadrilateral area on the canvas.
 * @param canvas - The canvas element to draw on.
 * @param quadrilateral - The quadrilateral to fill.
 * @param color - The fill color.
 */
export function drawQuadrilateralArea(
  canvas: HTMLCanvasElement,
  quadrilateral: Pdf.Geometry.Quadrilateral,
  color: string
) {
  const region = new Path2D();

  region.moveTo(quadrilateral.p1.x, quadrilateral.p1.y);
  region.lineTo(quadrilateral.p2.x, quadrilateral.p2.y);
  region.lineTo(quadrilateral.p3.x, quadrilateral.p3.y);
  region.lineTo(quadrilateral.p4.x, quadrilateral.p4.y);
  region.lineTo(quadrilateral.p1.x, quadrilateral.p1.y);
  region.closePath();

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = color;
  ctx.fill(region);
}

/**
 * Draws a point on the canvas.
 * @param canvas - The canvas element to draw on.
 * @param point - The point coordinates.
 * @param color - The color of the point.
 * @param size - The size of the point.
 */
export function drawPoint(
  canvas: HTMLCanvasElement,
  point: Pdf.Geometry.Point,
  color: string,
  size: number
) {
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
  ctx.fill();
}

/**
 * Computes the distance between two points.
 * @param p1 - The first point.
 * @param p2 - The second point.
 * @returns The calculated distance.
 */
export function getDistanceBetweenPoints(
  p1: Pdf.Geometry.Point,
  p2: Pdf.Geometry.Point
) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx ** 2 + dy ** 2);
}
