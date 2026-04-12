import { DEFAULT_BRUSH_COLOR, DEFAULT_BRUSH_SIZE, CANVAS_BACKGROUND_COLOR } from './config';

/**
 * @type {HTMLCanvasElement | null}
 */
let canvas = null;
/**
 * @type {CanvasRenderingContext2D | null}
 */
let ctx = null;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

let currentColor = DEFAULT_BRUSH_COLOR;
let currentBrushSize = DEFAULT_BRUSH_SIZE;

/**
 * Helper function to get coordinates from mouse or touch events, relative to the canvas.
 * @param {MouseEvent|TouchEvent} e - The event object.
 * @returns {{x: number, y: