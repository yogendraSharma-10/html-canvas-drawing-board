/**
 * @file src/ui.js
 * @description Manages all user interface interactions for the drawing board.
 *              Handles input from color pickers, brush size sliders, and action buttons.
 *              Communicates user choices to the canvas module.
 */

import {
  setBrushColor,
  setBrushSize,
  clearCanvas,
  saveCanvasImage
} from './canvas';

import {
  DEFAULT_BRUSH_COLOR,
  DEFAULT_BRUSH_SIZE
} from './config';

/**
 * References to DOM elements for UI controls.
 * These are initialized once the DOM is loaded.
 */
let colorPicker;
let brushSizeSlider;
let brushSizeValueDisplay;
let clearButton;
let saveButton;
let shareButton; // For cross-project context integration

/**
 * Initializes all UI elements and attaches event listeners.
 * This function should be called once the DOM is fully loaded to ensure
 * all elements are available.
 */
export function initUI() {
  // Get references to DOM elements using their IDs
  colorPicker = document.getElementById('colorPicker');
  brushSizeSlider = document.getElementById('brushSizeSlider');
  brushSize