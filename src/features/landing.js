/* ============================================================
   VELORA — Landing Page Feature
   ============================================================ */

import { createElement } from '../utils.js';
import { renderTopNav } from '../components/nav.js';

export async function renderLandingPage() {
  const page = document.createElement('div');
  page.className = 'page page--light';

  // Navigation
  const nav = renderTopNav(true, 'landing');
  page.appendChild(nav);

  // Hero Section
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.innerHTML = `
    <div class="hero__scrim"></div>
    <div class="container" style="position:relative;z-index:2;width:100%;">
      <div class="hero__content">
        <div class="hero__tagline">AI Urban Mobility Operating System</div>
        <h1 class="hero__headline">Every Journey,<br>Perfectly Predicted.</h1>
        <p class="hero__subheadline">
          VELORA connects citizens, transport operators, and city infrastructure through 
          artificial intelligence — reducing congestion, cutting wait times, and creating 
          equitable transportation for millions.
        </p>
        <div class="hero__actions">
          <button class="btn btn--primary-dark btn--lg" data-nav="dashboard">Start Your Journey</button>
          <button class="btn btn--secondary-dark btn--lg" data-nav="live-map">Explore the Map</button>
        </div>
      </div>
    </div>
  `;
  page.appendChild(hero);

  // Problem Statement
  const problem = document.createElement('section');
  problem.className = 'problem';
  problem.innerHTML = `
    <div class="container">
      <blockquote class="problem__quote">
        "This isn't traffic. It's lost life."
      </blockquote>
      <p class="problem__body">
        Every day, millions of commuters waste hours navigating congested cities. 
        VELORA's intelligence layer transforms urban mobility from a source of stress 
        into a seamless experience — predicting demand, optimizing routes, and saving 
        what matters most: time.
      </p>
    </div>
  `;
  page.appendChild(problem);

  // Features Section
  const features = document.createElement('section');
  features.className = 'features';
  features.innerHTML = `
    <div class="container">
      <div class="features__header">
        <h2 class="features__title">The Intelligence Core</h2>
        <p class="features__subtitle">Three interconnected AI systems that power the future of urban mobility</p>
      </div>
      <div class="grid grid-3 stagger-children">
        <div class="feature-card">
          <div class="feature-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
              <path d="M12 20V10M18 20V4M6 20v-4"/>
            </svg>
          </div>
          <h3 class="feature-card__title">Demand Prediction</h3>
          <p class="feature-card__description">
            AI models forecast passenger demand with 94.2% accuracy, allowing transit 
            operators to deploy vehicles precisely where and when they're needed most.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h3 class="feature-card__title">Traffic Intelligence</h3>
          <p class="feature-card__description">
            Real-time traffic analysis across thousands of city intersections, predicting 
            congestion patterns and dynamically rerouting traffic to reduce delays.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <h3 class="feature-card__title">Crowd Forecasting</h3>
          <p class="feature-card__description">
            Advanced crowd density prediction helps commuters avoid overcrowded 
            transport and helps authorities manage public gatherings safely.
          </p>
        </div>
      </div>
    </div>
  `;
  page.appendChild(features);

  // City Visual Section
  const cityVisual = document.createElement('section');
  cityVisual.className = 'city-visual';
  cityVisual.innerHTML = `
    <div class="city-visual__scrim"></div>
    <div class="city-visual__image" style="background:linear-gradient(135deg, #0A0A0A 0%, #1a1a2e 50%, #16213e 100%);"></div>
  `;
  page.appendChild(cityVisual);

  // Footer
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer__inner">
        <div class="footer__logo">VELORA</div>
        <nav class="footer__nav">
          <a class="footer__link" data-nav="dashboard">Dashboard</a>
          <a class="footer__link" data-nav="journey-planner">Plan Journey</a>
          <a class="footer__link" data-nav="live-map">Live Map</a>
          <a class="footer__link" data-nav="analytics">Analytics</a>
          <a class="footer__link" data-nav="settings">Settings</a>
        </nav>
        <div class="footer__copyright">
          &copy; ${new Date().getFullYear()} VELORA. AI Urban Mobility Operating System.
        </div>
      </div>
    </div>
  `;
  page.appendChild(footer);

  return page;
}
