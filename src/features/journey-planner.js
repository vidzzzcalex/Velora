/* ============================================================
   VELORA — AI Journey Planner Feature
   ============================================================ */

import { createElement } from '../utils.js';
import { renderSidebar, renderMobileNav } from '../components/nav.js';
import { generateJourneyOptions, searchDestinations, getPopularDestinations } from '../services/mock-data.js';
import notifier from '../components/notification.js';

export async function renderJourneyPlannerPage() {
  const user = { name: 'User', avatar: 'U' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  const sidebar = renderSidebar('journey-planner', user);
  page.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'main-content--dashboard';

  main.innerHTML = `
    <div class="dashboard-header">
      <h1>Journey Planner</h1>
      <p>AI-powered route planning across all transit modes</p>
    </div>
  `;

  const columns = document.createElement('div');
  columns.className = 'grid grid-2';

  // Left: Form
  const formCol = document.createElement('div');
  const form = document.createElement('div');
  form.className = 'card--dark';
  form.innerHTML = `
    <div class="card__title" style="font-size:16px;margin-bottom:20px;">Plan Your Journey</div>
    <div class="journey-form" id="journey-form">
      <div class="journey-input-group">
        <label>From</label>
        <div class="journey-input">
          <svg class="journey-input__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z"/>
          </svg>
          <input class="journey-input__field" id="journey-from" placeholder="Departure location" value="Lajpat Nagar">
        </div>
      </div>
      <div class="journey-input-group">
        <label>To</label>
        <div class="journey-input">
          <svg class="journey-input__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transform:rotate(180deg);">
            <circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z"/>
          </svg>
          <input class="journey-input__field" id="journey-to" placeholder="Destination" value="Connaught Place">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="journey-input-group">
          <label>Departure</label>
          <div class="journey-input">
            <input class="journey-input__field" id="journey-departure" type="time" value="${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}">
          </div>
        </div>
        <div class="journey-input-group">
          <label>Preferences</label>
          <div class="journey-input">
            <select class="journey-input__field" id="journey-preference" style="appearance:none;">
              <option value="balanced">Balanced</option>
              <option value="fastest">Fastest</option>
              <option value="cheapest">Cheapest</option>
              <option value="least-crowded">Least Crowded</option>
              <option value="accessible">Accessible</option>
              <option value="eco-friendly">Eco-Friendly</option>
            </select>
          </div>
        </div>
      </div>
      <button class="btn btn--primary-dark btn--lg" id="search-journeys" style="width:100%;margin-top:4px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        Search Routes
      </button>
    </div>
  `;
  formCol.appendChild(form);

  // Popular destinations
  const popular = getPopularDestinations();
  const popularCard = document.createElement('div');
  popularCard.className = 'card--dark';
  popularCard.style.marginTop = '16px';
  popularCard.innerHTML = `
    <div style="font-size:13px;font-weight:600;color:#5A5A5A;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;">Popular Destinations</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      ${popular.map(d => `<button class="btn btn--secondary-dark btn--sm popular-dest" data-dest="${d}">${d}</button>`).join('')}
    </div>
  `;
  formCol.appendChild(popularCard);

  columns.appendChild(formCol);

  // Right: Results
  const resultsCol = document.createElement('div');
  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'journey-results';
  resultsContainer.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:200px;color:#5A5A5A;font-size:14px;text-align:center;">
      <div>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 16px;display:block;opacity:0.3;">
          <circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 9v9a3 3 0 003 3h6a3 3 0 003-3V9"/>
        </svg>
        <div>Enter your journey details above<br>to see AI-powered route recommendations</div>
      </div>
    </div>
  `;
  resultsCol.appendChild(resultsContainer);
  columns.appendChild(resultsCol);

  main.appendChild(columns);
  page.appendChild(main);

  const mobileNav = renderMobileNav('journey-planner');
  page.appendChild(mobileNav);

  // ─── Event Handlers ───

  // Debounced search
  setTimeout(() => {
    const searchBtn = document.getElementById('search-journeys');
    const from = document.getElementById('journey-from');
    const to = document.getElementById('journey-to');

    const performSearch = () => {
      const fromVal = from.value.trim() || 'Lajpat Nagar';
      const toVal = to.value.trim() || 'Connaught Place';
      const pref = document.getElementById('journey-preference')?.value || 'balanced';
      const results = renderJourneyResults(fromVal, toVal, pref);
      resultsContainer.innerHTML = '';
      resultsContainer.appendChild(results);
    };

    searchBtn?.addEventListener('click', performSearch);

    // Enter key on inputs
    [from, to].forEach(input => {
      input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') performSearch();
      });
    });

    // Popular destinations
    document.querySelectorAll('.popular-dest').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('journey-to').value = btn.dataset.dest;
        performSearch();
      });
    });

    // Auto-search on load
    setTimeout(performSearch, 500);
  }, 100);

  return page;
}

function renderJourneyResults(from, to, preference) {
  const container = document.createElement('div');
  container.style.cssText = 'display:flex;flex-direction:column;gap:16px;';

  // Header
  const header = document.createElement('div');
  header.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <div>
        <div style="font-size:13px;color:#5A5A5A;">${from} → ${to}</div>
        <div style="font-size:11px;color:#5A5A5A;margin-top:4px;">
          <span class="status-dot status-dot--live"></span> Live predictions
        </div>
      </div>
    </div>
  `;
  container.appendChild(header);

  const options = generateJourneyOptions(from, to, { preference });

  if (!options || options.length === 0) {
    container.innerHTML += `
      <div style="text-align:center;padding:40px 20px;color:#5A5A5A;">
        <div style="font-size:16px;font-weight:500;color:#fff;margin-bottom:8px;">No routes found</div>
        <div style="font-size:13px;">Try different locations or preferences</div>
      </div>
    `;
    return container;
  }

  options.forEach((route, index) => {
    const card = document.createElement('div');
    card.className = `route-option${index === 0 ? ' route-option--selected' : ''}`;
    card.innerHTML = `
      <div class="route-option__header">
        <span class="route-option__type">${route.label}</span>
        <span class="route-option__time">${route.duration} min</span>
      </div>
      <div class="route-option__details">
        <span class="route-option__detail">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z"/></svg>
          ${route.walkingDistance}m walk
        </span>
        <span class="route-option__detail">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          ₹${route.fare}
        </span>
        <span class="route-option__detail">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          ${route.congestion}% congested
        </span>
        <span class="route-option__detail">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10z"/></svg>
          ${route.carbon}g CO₂
        </span>
      </div>
      <div class="route-option__confidence">
        <div style="flex:1;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;">
          <div style="height:100%;width:${route.confidence}%;background:${index === 0 ? '#E8A020' : 'rgba(255,255,255,0.2)'};border-radius:2px;transition:width 0.5s;"></div>
        </div>
        <span style="font-size:11px;color:#5A5A5A;">${route.confidence}% confidence</span>
      </div>
      <div style="margin-top:8px;font-size:12px;color:#ABABAB;line-height:1.4;">
        ${route.description}
        ${route.transport ? ` · Via: ${route.transport.join(', ')}` : ''}
      </div>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.route-option').forEach(c => c.classList.remove('route-option--selected'));
      card.classList.add('route-option--selected');
    });

    container.appendChild(card);
  });

  // Book button
  const bookBtn = document.createElement('button');
  bookBtn.className = 'btn btn--primary-dark btn--lg';
  bookBtn.style.cssText = 'width:100%;margin-top:8px;';
  bookBtn.textContent = 'Book Fastest Route';
  bookBtn.addEventListener('click', () => {
    notifier.show({
      title: 'Journey Booked!',
      message: `${from} → ${to} · ${options[0]?.duration || 24} min · ₹${options[0]?.fare || 20}`,
      type: 'success',
    });
  });
  container.appendChild(bookBtn);

  return container;
}
