/* ============================================================
   VELORA — Emergency Assistance Feature
   ============================================================ */

import { renderSidebar, renderMobileNav } from '../components/nav.js';

export async function renderEmergencyPage() {
  const user = { name: 'User', avatar: 'U' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  const sidebar = renderSidebar('emergency', user);
  page.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'main-content--dashboard';

  main.innerHTML = `
    <div class="dashboard-header">
      <h1>Emergency</h1>
      <p>Immediate assistance when you need it most</p>
    </div>
    <div style="text-align:center;padding:48px 16px;">
      <div style="font-size:16px;color:#ABABAB;">Visit the <a href="#safety" style="color:#E8A020;text-decoration:underline;">Safety page</a> for emergency assistance options.</div>
    </div>
  `;

  page.appendChild(main);
  const mobileNav = renderMobileNav('emergency');
  page.appendChild(mobileNav);

  return page;
}
