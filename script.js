/**
 * Tsion Habtamu Nigussu – Portfolio Interactive Logic
 * Modern, accessible, and high-performance vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initNavScrollSpy();
  initCounters();
  initProjectFilteringAndSearch();
  initSkillsTabs();
  initProjectModal();
  initClipboardActions();
  initContactForm();
  initBackToTop();
  initAddisAbabaClock();
});

/* ==========================================================================
   1. THEME TOGGLE (Warm Ivory Light / Architectural Dark)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('th_portfolio_theme') || 'light';
  
  document.body.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('th_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Architectural Dark' : 'Warm Ivory Light'} theme`);
    });
  }
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking any nav link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   3. NAVIGATION SCROLL SPY
   ========================================================================== */
function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   4. STATS NUMBER COUNTER ANIMATION
   ========================================================================== */
function initCounters() {
  const stats = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-count'), 10);
          const suffix = stat.textContent.replace(/[0-9]/g, '');
          let current = 0;
          const duration = 1500;
          const stepTime = 30;
          const increment = Math.ceil(target / (duration / stepTime));

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = current + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
}

/* ==========================================================================
   5. PROJECT FILTERING & REAL-TIME SEARCH
   ========================================================================== */
function initProjectFilteringAndSearch() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const searchInput = document.getElementById('project-search');
  const projectCards = document.querySelectorAll('.project-card');
  const countIndicator = document.getElementById('visible-projects-count');

  let activeFilter = 'all';
  let searchTerm = '';

  function applyFilters() {
    let visibleCount = 0;

    projectCards.forEach(card => {
      const categories = card.getAttribute('data-category').split(' ');
      const title = card.getAttribute('data-title').toLowerCase();
      const content = card.textContent.toLowerCase();

      const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
      const matchesSearch = searchTerm === '' || title.includes(searchTerm) || content.includes(searchTerm);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countIndicator) {
      countIndicator.textContent = visibleCount;
    }
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/* ==========================================================================
   6. SKILLS MATRIX TAB FILTERING
   ========================================================================== */
function initSkillsTabs() {
  const tabs = document.querySelectorAll('.skill-tab-btn');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const selectedTab = tab.getAttribute('data-tab');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (selectedTab === 'all' || category === selectedTab) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. PROJECT ARCHITECTURE & SPECS MODAL
   ========================================================================== */
const projectDetailsData = {
  rental: {
    title: "Remote Rental Marketplace Management Application",
    category: "Cross-Platform Mobile & Automation",
    role: "Full-Stack Developer",
    techStack: ["React Native", "Expo", "Telegram Bot API", "JavaScript", "Real-Time Ledger API"],
    description: "An integrated mobile property rental ecosystem designed to connect tenants with landlords while removing administrative friction through automated messaging bots.",
    architecture: [
      "Cross-platform client interface built with React Native and Expo for Android and iOS devices.",
      "Custom Telegram Bot API integration that handles webhook triggers for lease updates, instant rent reminders, and incoming maintenance requests.",
      "Landlord administrative console supporting digital approval workflows, listing updates, and live ledger balances."
    ],
    highlights: [
      "Automated SMS/Telegram notifications drastically reducing manual follow-ups by landlords.",
      "Clean separation of concerns with modular API services and client-side caching for offline browsing."
    ]
  },
  budget: {
    title: "Dual-Profile Budget & Expense Tracker",
    category: "Native Android & FinTech Automation",
    role: "Android Developer",
    techStack: ["Java", "Android Studio", "SQLite", "SMS BroadcastReceiver", "Financial Ledger Logic"],
    description: "A tailored native Android finance management solution that accommodates different spending dynamics for university students and corporate salaried workers.",
    architecture: [
      "Native Java architecture optimized for Android SDK with clean lifecycle management.",
      "Background BroadcastReceiver listening for inbound telecom and banking transaction SMS alerts, applying regex to extract transaction amounts and merchant tags.",
      "Localized SQLite database structured around relational categories (food, transportation, academic supplies, utilities)."
    ],
    highlights: [
      "Zero manual data entry required for users receiving standard SMS transaction receipts.",
      "Dual profile switch toggle dynamically reconfigures budget envelopes and analytics charts."
    ]
  },
  hotel: {
    title: "Blue Crest Hotel Management System",
    category: "System Analysis & Responsive Web Prototype",
    role: "System Analyst & Developer",
    techStack: ["System Analysis", "UML Modeling", "MySQL", "HTML5", "CSS3", "JavaScript"],
    description: "An educational enterprise hospitality ecosystem modeling a 5-star brand based in Addis Ababa, balancing thorough system analysis with a functional web prototype.",
    architecture: [
      "Rigorous requirements gathering and complete UML modeling (Class diagrams, Use-Case diagrams, Sequence diagrams) stripping away data redundancies.",
      "Normalized relational database schema engineered for MySQL to support concurrent room bookings and inventory management.",
      "Responsive web front-end prototype providing client booking flows, admin authorization, and room allocation views."
    ],
    highlights: [
      "Comprehensive structural documentation prepared using Draw.io, ensuring clean database integrity constraints.",
      "Modular booking states preventing double-reservations."
    ]
  },
  nlp: {
    title: "NLP Text Classification AI Model",
    category: "Machine Learning & Natural Language Processing",
    role: "Machine Learning Developer",
    techStack: ["PyTorch", "Scikit-Learn", "Python", "NLP Preprocessing", "Tokenization"],
    description: "An advanced academic machine learning prototype trained to automatically classify and categorize heterogeneous textual datasets with high precision.",
    architecture: [
      "End-to-end preprocessing pipeline implementing regex text normalization, lowercase conversion, punctuation removal, and stopword filtering.",
      "Tokenization and feature extraction utilizing TF-IDF representations and neural embedding layers.",
      "Predictive model training executed through Scikit-Learn baseline classifiers and deep learning PyTorch architectures."
    ],
    highlights: [
      "Systematic hyperparameter tuning and cross-validation ensuring consistent accuracy scores.",
      "Extensible pipeline designed for rapid adaptation to customer feedback, news categorization, or medical text tags."
    ]
  },
  mhis: {
    title: "Mobile-Based Health Information System (mHIS) for Rural Clinics",
    category: "Health Informatics & Academic Research Prototype",
    role: "Co-Researcher & Academic Lead",
    techStack: ["Mobile Prototype", "Health Informatics", "System Analysis", "Field Research", "Database Design"],
    description: "A landmark research study and mobile application prototype investigating healthcare data management barriers across rural health clinics in the Waliso Area.",
    architecture: [
      "Mixed-methods research methodology gathering qualitative and quantitative data across clinical staff, health extension workers, and regional record keepers.",
      "Mobile-based health information system (mHIS) prototype architected specifically for low-resource and intermittent-connectivity environments.",
      "Standardized data collection forms optimizing immunization logs, maternal care records, and pharmaceutical supplies."
    ],
    highlights: [
      "Successful formal academic defense at Ambo University using comprehensive system visualization models.",
      "Explored future data-privacy enhancements using Concrete ML (Fully Homomorphic Encryption) for confidential medical analytics."
    ]
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalRole = document.getElementById('modal-role');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close-btn');
  const actionClose = document.querySelector('.modal-action-close');
  const actionContact = document.querySelector('.modal-action-contact');
  const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

  if (!modal) return;

  function openModal(projectId) {
    const data = projectDetailsData[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalRole.innerHTML = `<i class="fa-solid fa-code"></i> ${data.role}`;

    let tagsHtml = data.techStack.map(tag => `<span class="tech-tag">${tag}</span>`).join(' ');
    let archHtml = data.architecture.map(item => `<li>${item}</li>`).join('');
    let highlightsHtml = data.highlights.map(item => `<li>${item}</li>`).join('');

    modalBody.innerHTML = `
      <p style="margin-bottom: 1.25rem; font-size: 1.05rem;">${data.description}</p>
      
      <div style="margin-bottom: 1.5rem;">
        <span style="display:block; font-family: var(--font-heading); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 600;">Technologies Used</span>
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">${tagsHtml}</div>
      </div>

      <h4 class="modal-section-title">System Architecture & Design</h4>
      <ul class="modal-list">${archHtml}</ul>

      <h4 class="modal-section-title">Key Engineering Highlights</h4>
      <ul class="modal-list">${highlightsHtml}</ul>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  viewDetailsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project');
      openModal(id);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (actionClose) actionClose.addEventListener('click', closeModal);
  if (actionContact) {
    actionContact.addEventListener('click', () => {
      closeModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. CLIPBOARD COPY UTILITIES
   ========================================================================== */
function initClipboardActions() {
  const heroCopyBtn = document.getElementById('copy-email-hero');
  if (heroCopyBtn) {
    heroCopyBtn.addEventListener('click', () => {
      copyToClipboard('tsionhab451996@gmail.com', 'Email copied to clipboard!');
    });
  }

  const copyCards = document.querySelectorAll('.btn-copy-card');
  copyCards.forEach(cardBtn => {
    cardBtn.addEventListener('click', () => {
      const text = cardBtn.getAttribute('data-copy');
      const isEmail = text.includes('@');
      copyToClipboard(text, `${isEmail ? 'Email' : 'Phone'} copied to clipboard!`);
    });
  });
}

function copyToClipboard(text, successMessage) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage);
    }).catch(() => {
      fallbackCopy(text, successMessage);
    });
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMessage);
  } catch (err) {
    showToast('Could not copy automatically');
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   9. INTERACTIVE CONTACT FORM WITH VALIDATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusAlert = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    // Reset errors
    [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
      if (inp) {
        inp.classList.remove('error');
        const err = inp.parentElement.querySelector('.error-msg');
        if (err) err.classList.remove('visible');
      }
    });

    if (!nameInput.value.trim()) {
      showFieldError(nameInput);
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showFieldError(emailInput);
      isValid = false;
    }

    if (!subjectInput.value.trim()) {
      showFieldError(subjectInput);
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      showFieldError(messageInput);
      isValid = false;
    }

    if (!isValid) return;

    // Construct Mailto for direct communication
    const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectInput.value.trim()}`);
    const encodedBody = encodeURIComponent(`Sender: ${nameInput.value.trim()} (${emailInput.value.trim()})\n\nMessage:\n${messageInput.value.trim()}`);
    const mailtoUrl = `mailto:tsionhab451996@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

    if (statusAlert) {
      statusAlert.className = 'form-status-alert success';
      statusAlert.innerHTML = `
        <strong>Thank you, ${nameInput.value.trim()}!</strong><br>
        Your message details are ready. If your email client does not open automatically, 
        <a href="${mailtoUrl}" style="text-decoration: underline; font-weight: 700; color: inherit;">click here to send via email client</a> 
        or copy <code>tsionhab451996@gmail.com</code> directly.
      `;
      statusAlert.style.display = 'block';
    }

    // Trigger user mail client
    window.location.href = mailtoUrl;

    form.reset();
  });
}

function showFieldError(inputElement) {
  inputElement.classList.add('error');
  const err = inputElement.parentElement.querySelector('.error-msg');
  if (err) err.classList.add('visible');
}

/* ==========================================================================
   10. FLOATING BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   11. ADDIS ABABA TIME DISPLAY
   ========================================================================== */
function initAddisAbabaClock() {
  const timeEl = document.getElementById('ethiopia-time');
  if (!timeEl) return;

  function updateTime() {
    try {
      const now = new Date();
      const options = {
        timeZone: 'Africa/Addis_Ababa',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
      timeEl.textContent = `${formatted} EAT (UTC+3)`;
    } catch (e) {
      timeEl.textContent = 'Addis Ababa (UTC+3)';
    }
  }

  updateTime();
  setInterval(updateTime, 60000);
}
