// Responsive navigation menu
const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(opened));
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

// Local portfolio assistant demo (not connected to an external AI model)
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

function addMessage(message, type) {
  const item = document.createElement('div');
  item.className = type === 'user' ? 'user-message' : 'bot-message';
  item.textContent = message; // textContent prevents user input being treated as HTML
  chatMessages.appendChild(item);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function assistantReply(question) {
  const q = question.toLowerCase();
  if (q.includes('skill') || q.includes('technology') || q.includes('stack')) {
    return 'Ahad is learning HTML5, CSS3, JavaScript, Bootstrap, Node.js, MySQL, PHP and the MERN stack (MongoDB, Express, React and Node.js).';
  }
  if (q.includes('project') || q.includes('work')) {
    return 'The portfolio shows property listing, PlayZone interface and admin dashboard concepts. The My Work section also contains HTML practice files.';
  }
  if (q.includes('contact') || q.includes('email')) {
    return 'Visit the Contact section. Replace the sample email address with Ahad’s real email before publishing.';
  }
  if (q.includes('ai') || q.includes('automation')) {
    return 'This is a local demo assistant. A real AI assistant needs a secure backend endpoint and an API key stored on the server, never in browser JavaScript.';
  }
  return 'Thanks for your question! Try asking about Ahad’s skills, projects, AI automation or contact details.';
}
chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;
  addMessage(question, 'user');
  chatInput.value = '';
  addMessage(assistantReply(question), 'bot');
});

let portfolioCsrfToken = '';
function escapePortfolioText(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function renderSkills(skills) {
  const quickSkills = document.querySelector('.quick-skills');
  quickSkills.innerHTML = skills.slice(0, 4).map(skill => `<span>${escapePortfolioText(skill.name)}</span>`).join('');
  if (!skills.length) {
    document.getElementById('skillsGrid').innerHTML = '<div class="learning-note">Skills will be added soon.</div>';
    return;
  }
  document.getElementById('skillsGrid').innerHTML = skills.map((skill, index) => `
    <article class="stack-card dynamic-reveal">
      <div class="stack-symbol ${['orange', 'blue', 'yellow', 'purple', 'green'][index % 5]}">${escapePortfolioText(skill.icon || skill.name.slice(0, 2))}</div>
      <h3>${escapePortfolioText(skill.name)}</h3>
      <p>${escapePortfolioText(skill.description)}</p><small>${escapePortfolioText(skill.category)}</small>
    </article>`).join('');
}

function renderProjects(projects) {
  if (!projects.length) {
    document.getElementById('projectsGrid').innerHTML = '<div class="learning-note">Projects will be added soon.</div>';
    return;
  }
  document.getElementById('projectsGrid').innerHTML = projects.map((project, index) => {
    const image = project.image_url
      ? `<img class="project-cover" src="${escapePortfolioText(project.image_url)}" alt="${escapePortfolioText(project.title)} screenshot" loading="lazy">`
      : `<div class="project-art ${['estate', 'play', 'dashboard'][index % 3]}"><span>${String(index + 1).padStart(2, '0')} / PROJECT</span><div class="dash-bars"><i></i><i></i><i></i><i></i></div><b>${escapePortfolioText(project.title.toUpperCase())}</b></div>`;
    const links = [
      project.live_url ? `<a href="${escapePortfolioText(project.live_url)}" target="_blank" rel="noopener noreferrer">Live demo ↗</a>` : '',
      project.github_url ? `<a href="${escapePortfolioText(project.github_url)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : ''
    ].filter(Boolean).join('');
    return `<article class="project-card dynamic-reveal">${image}
      <div class="project-details"><h3>${escapePortfolioText(project.title)}</h3>
        <p>${escapePortfolioText(project.description)}</p>
        <div class="chips">${(project.technologies || []).map(item => `<i>${escapePortfolioText(item)}</i>`).join('')}</div>
        ${links ? `<div class="project-links">${links}</div>` : ''}
      </div></article>`;
  }).join('');
}

function renderJourney(data) {
  const entries = [
    ...data.education.map(item => ({ title: item.qualification, place: item.institution, text: item.description, dates: `${item.start_date || ''}${item.end_date ? ` — ${item.end_date}` : ''}`, type: 'EDUCATION' })),
    ...data.experience.map(item => ({ title: item.role, place: item.organization, text: item.description, dates: `${item.start_date || ''}${item.end_date ? ` — ${item.end_date}` : ''}`, type: 'EXPERIENCE' }))
  ];
  const container = document.getElementById('journeyGrid');
  container.innerHTML = entries.map(item => `<article class="journey-card dynamic-reveal">
    <small>${escapePortfolioText(item.type)} · ${escapePortfolioText(item.dates)}</small>
    <h3>${escapePortfolioText(item.title)}</h3><b>${escapePortfolioText(item.place)}</b>
    <p>${escapePortfolioText(item.text)}</p></article>`).join('');
  const certificateBox = document.getElementById('certificatesGrid');
  certificateBox.innerHTML = data.certificates.map(item => `<article class="certificate-card dynamic-reveal">
    ${item.image_url ? `<img src="${escapePortfolioText(item.image_url)}" alt="${escapePortfolioText(item.title)} certificate" loading="lazy">` : ''}
    <div><h3>${escapePortfolioText(item.title)}</h3><p>${escapePortfolioText(item.issuer)}${item.issue_date ? ` · ${escapePortfolioText(item.issue_date)}` : ''}</p>
    ${item.credential_url ? `<a href="${escapePortfolioText(item.credential_url)}" target="_blank" rel="noopener noreferrer">View credential ↗</a>` : ''}</div></article>`).join('');
  const hasJourneyContent = entries.length > 0 || data.certificates.length > 0;
  document.getElementById('journey').hidden = !hasJourneyContent;
  document.querySelector('.nav a[href="#journey"]').hidden = !hasJourneyContent;
}

function renderSocialLinks(links, profile) {
  const box = document.getElementById('socialLinks');
  const profileEmail = profile.email
    ? `<a id="emailLink" href="mailto:${escapePortfolioText(profile.email)}">Email ${escapePortfolioText(profile.name)} ↗</a>` : '';
  const social = links.map(link => `<a href="${escapePortfolioText(link.url)}" target="_blank" rel="noopener noreferrer">${escapePortfolioText(link.platform)} ↗</a>`).join('');
  box.innerHTML = `${profileEmail}${social}`;
  document.getElementById('contactDetails').innerHTML = [
    profile.phone ? `<a href="tel:${escapePortfolioText(profile.phone)}">${escapePortfolioText(profile.phone)}</a>` : '',
    profile.location ? `<span>${escapePortfolioText(profile.location)}</span>` : ''
  ].filter(Boolean).join('');
}

async function loadPortfolio() {
  try {
    const [csrfResponse, portfolioResponse] = await Promise.all([
      fetch('/api/csrf-token', { credentials: 'same-origin' }),
      fetch('/api/portfolio', { credentials: 'same-origin' })
    ]);
    if (!csrfResponse.ok || !portfolioResponse.ok) throw new Error('Portfolio service is unavailable.');
    portfolioCsrfToken = (await csrfResponse.json()).csrfToken;
    const data = await portfolioResponse.json();
    const profile = data.profile;
    if (profile) {
      document.getElementById('profileName').textContent = profile.name.toUpperCase();
      document.getElementById('profileTitle').textContent = (profile.title || 'Developer').toUpperCase();
      document.getElementById('profileStatus').textContent = (profile.title || 'Developer').toUpperCase();
      document.getElementById('profileDescription').textContent = profile.short_description;
      document.getElementById('aboutLead').textContent = `I’m ${profile.name}, ${profile.title.toLowerCase()} focused on building clean, accessible and responsive web experiences.`;
      document.getElementById('aboutDescription').textContent = profile.about;
      document.getElementById('profilePicture').src = profile.profile_image || 'assets/images/ahad-photo-1.png';
      document.getElementById('profilePicture').alt = `${profile.name} profile portrait`;
      document.querySelector('.signature').innerHTML = `${escapePortfolioText(profile.name)}<span>.</span>`;
      document.querySelectorAll('.brand').forEach(brand => {
        brand.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            node.textContent = ` ${profile.name.toUpperCase()}`;
          }
        });
      });
      document.title = `${profile.name} | ${profile.title || 'Developer Portfolio'}`;
      const emailLink = document.getElementById('emailLink');
      if (emailLink && profile.email) emailLink.href = `mailto:${profile.email}`;
    }
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderJourney(data);
    renderSocialLinks(data.social_links, profile || { name: 'Ahad', email: '' });
    document.querySelectorAll('.dynamic-reveal').forEach(element => revealObserver.observe(element));
  } catch (error) {
    console.info('Dynamic portfolio data is unavailable; showing the saved portfolio preview.', error.message);
  }
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  const status = document.getElementById('contactStatus');
  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  status.textContent = 'Sending…';
  const payload = Object.fromEntries(new FormData(contactForm).entries());
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': portfolioCsrfToken },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not send your message.');
    status.textContent = 'Thank you. Your message has been sent.';
    contactForm.reset();
  } catch (error) {
    status.textContent = `${error.message} Please try again later.`;
  } finally {
    submitButton.disabled = false;
  }
});

loadPortfolio();
