let lang = localStorage.getItem('lang') || 'zh';
let projectsData = null;

const i18n = {
  zh: {
    title: '项目导航',
    subtitle: '我所有的项目和域名一览',
    totalProjects: '项目总数',
    totalDomains: '域名总数',
    online: '在线',
    dev: '开发中',
    offline: '离线',
    footer: '&copy; 2026 All Projects',
    langBtn: 'EN'
  },
  en: {
    title: 'Project Hub',
    subtitle: 'All my projects and domains at a glance',
    totalProjects: 'Projects',
    totalDomains: 'Domains',
    online: 'Online',
    dev: 'In Dev',
    offline: 'Offline',
    footer: '&copy; 2026 All Projects',
    langBtn: '中文'
  }
};

function t(key) {
  return i18n[lang][key] || key;
}

function toggleLang() {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('lang', lang);
  render();
}

function getLocalized(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.zh || obj.en || '';
}

function getStatusText(status) {
  const map = { online: 'online', dev: 'dev', offline: 'offline' };
  return t(map[status] || 'offline');
}

function renderStats(projects) {
  const onlineCount = projects.filter(p => p.status === 'online').length;
  const domains = new Set(projects.map(p => p.domain)).size;

  return `
    <div class="stat-item">
      <div class="stat-number">${projects.length}</div>
      <div class="stat-label">${t('totalProjects')}</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">${domains}</div>
      <div class="stat-label">${t('totalDomains')}</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">${onlineCount}</div>
      <div class="stat-label">${t('online')}</div>
    </div>
  `;
}

function renderCard(project) {
  const name = getLocalized(project.name);
  const desc = getLocalized(project.description);
  const tags = project.tags || [];
  const iconContent = project.icon
    ? `<img src="${project.icon}" alt="${name}">`
    : name.charAt(0).toUpperCase();

  return `
    <a class="card" href="${project.url}" target="_blank" rel="noopener">
      <div class="card-header">
        <div class="card-icon">${iconContent}</div>
        <div>
          <div class="card-title">${name}</div>
          <div class="card-domain">${project.domain}</div>
        </div>
      </div>
      <div class="card-desc">${desc}</div>
      <div class="card-footer">
        <div class="tags">
          ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="status">
          <span class="status-dot ${project.status || 'online'}"></span>
          ${getStatusText(project.status)}
        </div>
      </div>
    </a>
  `;
}

function render() {
  document.getElementById('site-title').textContent = t('title');
  document.getElementById('site-subtitle').textContent = t('subtitle');
  document.getElementById('footer-text').innerHTML = t('footer');
  document.getElementById('lang-toggle').textContent = t('langBtn');

  if (projectsData) {
    const projects = projectsData.projects || [];
    document.getElementById('stats').innerHTML = renderStats(projects);
    document.getElementById('project-grid').innerHTML = projects.map(renderCard).join('');
  }
}

async function init() {
  try {
    const res = await fetch('projects.json');
    projectsData = await res.json();
  } catch (e) {
    projectsData = { projects: [] };
    console.error('Failed to load projects.json:', e);
  }
  render();
}

init();
