import { CanvasManager } from './canvas';
import { UIManager } from './ui';
import { APP_CONFIG } from './config';

/**
 * Main application entry point.
 * Initializes the HTML Canvas drawing board and its user interface,
 * orchestrating interactions between the CanvasManager and UIManager.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('HTML Canvas Drawing Board application initializing...');

    // --- DOM Element Retrieval ---
    const canvasElement = document.getElementById('drawingCanvas');
    const uiContainer = document.getElementById('drawingControls');

    // Basic error handling if critical DOM elements are missing
    if (!canvasElement) {
        console.error('Initialization Error: Canvas element with ID "drawingCanvas" not found. Please check public/index.html.');
        return;
    }
    if (!uiContainer) {
        console.error('Initialization Error: UI controls container with ID "drawingControls" not found. Please check public/index.html.');
        return;
    }

    // --- Manager Initialization ---
    // Initialize CanvasManager with the canvas element and default settings from config.
    const canvasManager = new CanvasManager(canvasElement, {
        defaultColor: APP_CONFIG.canvas.defaultColor,
        defaultBrushSize: APP_CONFIG.canvas.defaultBrushSize,
        backgroundColor: APP_CONFIG.canvas.backgroundColor,
    });

    // Initialize UIManager with the UI container and initial settings for controls.
    const uiManager = new UIManager(uiContainer, {
        initialColor: APP_CONFIG.canvas.defaultColor,
        initialBrushSize: APP_CONFIG.canvas.defaultBrushSize,
        minBrushSize: APP_CONFIG.canvas.minBrushSize,
        maxBrushSize: APP_CONFIG.canvas.maxBrushSize,
    });

    // --- Event Binding: Connecting UI actions to Canvas operations ---

    /**
     * Handles brush color changes from the UI.
     * @param {string} newColor - The new color in hexadecimal format (e.g., '#RRGGBB').
     */
    uiManager.onColorChange((newColor) => {
        canvasManager.setBrushColor(newColor);
        console.debug(`Brush color updated to: ${newColor}`);
    });

    /**
     * Handles brush size changes from the UI.
     * @param {number} newSize - The new brush size in pixels.
     */
    uiManager.onBrushSizeChange((newSize) => {
        canvasManager.setBrushSize(newSize);
        console.debug(`Brush size updated to: ${newSize}`);
    });

    /**
     * Handles the clear canvas action from the UI.
     */
    uiManager.onClearCanvas(() => {
        canvasManager.clearCanvas();
        console.log('Canvas cleared by user action.');
    });

    /**
     * Handles the save canvas action from the UI.
     * Saves the current canvas content as a PNG image.
     */
    uiManager.onSaveCanvas(() => {
        const dataURL = canvasManager.saveCanvas();
        console.log('Canvas content captured as Data URL for saving.');

        // Create a temporary anchor element to trigger a download
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `drawing-board-${Date.now()}.png`; // Unique filename
        document.body.appendChild(link); // Append to body to make it clickable
        link.click(); // Programmatically click the link
        document.body.removeChild(link); // Clean up the temporary link
        console.log('Drawing downloaded successfully.');

        // --- Cross-Project Context: Integration with other services ---
        // Example: If an "Image Gallery" service existed, we could upload the drawing.
        // This simulates a microservice interaction where the drawing board publishes its output.
        if (APP_CONFIG.services.imageGalleryApi) {
            fetch(`${APP_CONFIG.services.imageGalleryApi}/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-App-Source': 'DrawingBoard' // Identify source application
                },
                body: JSON.stringify({
                    imageData: dataURL,
                    format: 'image/png',
                    timestamp: new Date().toISOString(),
                    // Potentially add user ID or other metadata
                }),
            })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => console.log('Drawing successfully sent to Image Gallery service:', data))
            .catch(error => console.warn('Failed to send drawing to Image Gallery service:', error.message));
        }
    });

    // --- Initial UI State Setup ---
    // Ensure UI controls reflect the initial state of the canvas manager.
    uiManager.updateColorPicker(canvasManager.getBrushColor());
    uiManager.updateBrushSizeSlider(canvasManager.getBrushSize());

    // --- Global Keyboard Shortcuts (Enhancements) ---
    document.addEventListener('keydown', (event) => {
        // 'C' key to clear canvas
        if (event.key === 'c' || event.key === 'C') {
            uiManager.triggerClearCanvas(); // Programmatically trigger the clear action
            console.log('Keyboard shortcut (C): Canvas cleared.');
        }
        // Ctrl/Cmd + 'S' to save canvas
        if ((event.ctrlKey || event.metaKey) && (event.key === 's' || event.key === 'S')) {
            event.preventDefault(); // Prevent browser's default save dialog
            uiManager.triggerSaveCanvas(); // Programmatically trigger the save action
            console.log('Keyboard shortcut (Ctrl/Cmd+S): Canvas saved.');
        }
    });

    // --- Cross-Project Context: Initial Data Loading / Configuration ---
    // Example: Fetching a dynamic color palette from another service on startup.
    // This demonstrates how the drawing board could consume data from other parts of the system.
    if (APP_CONFIG.services.colorPaletteGeneratorApi) {
        fetch(`${APP_CONFIG.services.colorPaletteGeneratorApi}/palettes/random`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(palette => {
                console.log('Fetched a random color palette from generator service:', palette);
                // In a more advanced UI, we could dynamically add these colors to the color picker.
                // uiManager.addPaletteOptions(palette.colors);
            })
            .catch(error => console.warn('Could not fetch dynamic color palette:', error.message));
    }

    console.log('HTML Canvas Drawing Board application fully loaded and ready.');
});