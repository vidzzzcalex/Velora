/* ============================================================
   VELORA — Application Entry Point
   ============================================================ */

// ─── CSS Imports ───
import './css/variables.css';
import './css/reset.css';
import './css/typography.css';
import './css/layout.css';
import './css/components.css';
import './css/animations.css';
import './css/light-mode.css';
import './css/dark-mode.css';
import './css/responsive.css';

// ─── App Initialization ───
import app from './app.js';

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
