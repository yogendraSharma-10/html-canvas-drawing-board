/**
 * @file src/config.js
 * @description Configuration constants for the HTML Canvas Drawing Board application.
 *              This file centralizes various settings, making them easy to manage and update.
 */

/**
 * General application settings.
 */
export const APP_SETTINGS = {
  APP_NAME: "Canvas Drawing Board",
  VERSION: "1.0.0",
  // Base URL for API interactions, if any. Can be overridden by environment variables.
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:3000/api",
};

/**
 * Canvas dimensions and default appearance settings.
 */
export const CANVAS_SETTINGS = {
  // Default width of the canvas element in pixels.
  DEFAULT_WIDTH: 800,
  // Default height of the canvas element in pixels.
  DEFAULT_HEIGHT: 600,
  // Default background color of the canvas when cleared.
  DEFAULT_BACKGROUND_COLOR: '#FFFFFF', // White
  // Mime type for saving the canvas image.
  SAVE_IMAGE_MIME_TYPE: 'image/png',
  // Default filename for saved images.
  SAVE_IMAGE_FILENAME: 'drawing-board-creation.png',
};

/**
 * Default drawing tool settings.
 */
export const BRUSH_SETTINGS = {
  // Default color for the drawing brush.
  DEFAULT_COLOR: '#000000', // Black
  // Default size (thickness) for the drawing brush in pixels.
  DEFAULT_SIZE: 5,
  // Default line cap style for the brush. Options: 'butt', 'round', 'square'.
  DEFAULT_LINE_CAP: 'round',
  // Default line join style for the brush. Options: 'bevel', 'round', 'miter'.
  DEFAULT_LINE_JOIN: 'round',
};

/**
 * Available options for UI controls (colors, brush sizes).
 */
export const UI_SETTINGS = {
  // Predefined set of colors available in the color palette.
  // This could potentially be fetched from a "Dynamic Color Palette Generator" service.
  AVAILABLE_COLORS: [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#A52A2A', // Brown
    '#808080', // Gray
  ],
  // Predefined set of brush sizes available to the user.
  AVAILABLE_BRUSH_SIZES: [
    2, 5, 10, 15, 20, 25, 30
  ],
};

/**
 * Configuration for integrating with other services in the ecosystem.
 * These URLs are placeholders and would typically be environment variables in a real microservice setup.
 */
export const MICROSERVICE_CONFIG = {
  // Endpoint for the Dynamic Color Palette Generator service.
  // This could be used to fetch more diverse or user-generated color palettes.
  COLOR_PALETTE_SERVICE_URL: process.env.COLOR_PALETTE_SERVICE_URL || "http://localhost:3001/api/palettes",

  // Endpoint for the Live Markdown Editor service.
  // A drawing could potentially be embedded or linked within a markdown document.
  MARKDOWN_EDITOR_SERVICE_URL: process.env.MARKDOWN_EDITOR_SERVICE_URL || "http://localhost:3002/api/markdown",

  // Endpoint for the Interactive Kanban Board service.
  // Drawings could be attached as assets or notes to Kanban tasks.
  KANBAN_BOARD_SERVICE_URL: process.env.KANBAN_BOARD_SERVICE_URL || "http://localhost:3003/api/kanban",

  // Feature flag to enable/disable dynamic color fetching from the palette generator.
  ENABLE_DYNAMIC_COLORS: process.env.ENABLE_DYNAMIC_COLORS === 'true',
};

/**
 * Export all configurations for easy access throughout the application.
 */
export default {
  APP_SETTINGS,
  CANVAS_SETTINGS,
  BRUSH_SETTINGS,
  UI_SETTINGS,
  MICROSERVICE_CONFIG,
};