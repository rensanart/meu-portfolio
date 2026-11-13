/**
 * ==========================================================================
 * SISTEMA DE INTERNACIONALIZAÇÃO (i18n) IN-PLACE
 * Gerenciador de Idioma (PT / EN) com persistência em localStorage
 * ==========================================================================
 */

(function () {
  const STORAGE_KEY = 'portfolio_preferred_lang';

  function getInitialLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'pt') return saved;
    } catch (e) {
      // Ignorar erro de localStorage
    }
    return 'pt';
  }

  let currentLang = getInitialLanguage();

  // Injetar ou vincular o botão de troca de idioma no Header
  function setupLanguageSwitcher() {
    let switcher = document.querySelector('.lang-switch');

    if (!switcher) {
      const headerContainer = document.querySelector('.header-container');
      const socialLinks = document.querySelector('.header-container .social-links');

      if (headerContainer) {
        switcher = document.createElement('div');
        switcher.className = 'lang-switch';
        switcher.setAttribute('role', 'group');
        switcher.setAttribute('aria-label', 'Seletor de idioma / Language selector');
        switcher.innerHTML = `
          <button type="button" class="lang-btn ${currentLang === 'pt' ? 'active' : ''}" data-lang="pt" aria-label="Português">PT</button>
          <span class="lang-divider">/</span>
          <button type="button" class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" aria-label="English">EN</button>
        `;

        if (socialLinks) {
          let actions = document.querySelector('.header-actions');
          if (!actions) {
            actions = document.createElement('div');
            actions.className = 'header-actions';
            socialLinks.parentNode.insertBefore(actions, socialLinks);
            actions.appendChild(socialLinks);
          }
          actions.appendChild(switcher);
        } else {
          headerContainer.appendChild(switcher);
        }
      }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const targetLang = btn.getAttribute('data-lang');
        if (targetLang && (targetLang === 'pt' || targetLang === 'en')) {
          setLanguage(targetLang);
        }
      };
    });

    updateSwitcherState();
  }

  function updateSwitcherState() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === currentLang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Salvar estado original em PT antes de traduzir dinamicamente
  function saveOrig(el) {
    if (!el.dataset.i18nOrigHtml) {
      el.dataset.i18nOrigHtml = el.innerHTML;
    }
  }

  function restoreOrig(el) {
    if (el.dataset.i18nOrigHtml !== undefined) {
      el.innerHTML = el.dataset.i18nOrigHtml;
    }
  }

  // Tradução universal de elementos sem data-i18n explícito
  function applyUniversalTranslations(lang) {
    const t = window.PORTFOLIO_TRANSLATIONS ? window.PORTFOLIO_TRANSLATIONS[lang] : null;
    const exactMap = window.EXACT_TEXT_MAP_EN || {};
    if (!t) return;

    // 1. Links de Navegação no Header
    document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
      saveOrig(link);
      if (lang === 'pt') {
        restoreOrig(link);
        return;
      }
      const href = link.getAttribute('href') || '';
      if (href.includes('index.html') && !href.includes('#sobre')) {
        link.textContent = t['nav.design'];
      } else if (href.includes('ilustracoes.html')) {
        link.textContent = t['nav.illustrations'];
      } else if (href.includes('sobre')) {
        link.textContent = t['nav.about'];
      } else if (href.includes('contato.html')) {
        link.textContent = t['nav.contact'];
      }
    });

    // 2. Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
      saveOrig(btn);
      if (lang === 'pt') {
        restoreOrig(btn);
        return;
      }
      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        const isIlustra = window.location.pathname.includes('ilustracoes');
        btn.textContent = isIlustra ? t['filter.all_f'] : t['filter.all'];
      } else if (filter === 'social') {
        btn.textContent = t['filter.social'];
      } else if (filter === 'branding') {
        btn.textContent = t['filter.branding'];
      } else if (filter === 'motion') {
        btn.textContent = t['filter.motion'];
      }
    });

    // 3. Seção SOBRE em todas as páginas (bio + títulos + listas)
    document.querySelectorAll('.about-bio').forEach(bio => {
      if (bio.hasAttribute('data-i18n')) return;
      saveOrig(bio);
      if (lang === 'pt') {
        restoreOrig(bio);
      } else {
        bio.innerHTML = t['about.bio'];
      }
    });

    document.querySelectorAll('.about-text-content h2').forEach(h2 => {
      if (h2.hasAttribute('data-i18n')) return;
      saveOrig(h2);
      h2.textContent = lang === 'pt' ? restoreOrig(h2) || h2.textContent : t['about.title'];
      if (lang === 'pt') restoreOrig(h2);
    });

    // 4. Rodapé (Role + Copyright)
    const footerRole = document.querySelector('.footer-role');
    if (footerRole && !footerRole.hasAttribute('data-i18n')) {
      saveOrig(footerRole);
      if (lang === 'pt') {
        restoreOrig(footerRole);
      } else {
        const isIlustra = window.location.pathname.includes('ilustracoes');
        footerRole.textContent = isIlustra ? t['footer.role_illustrations'] : t['footer.role'];
      }
    }

    document.querySelectorAll('.footer-right-content p, .copyright').forEach(p => {
      if (p.querySelector('[data-i18n="footer.rights"]')) return;
      saveOrig(p);
      if (lang === 'pt') {
        restoreOrig(p);
      } else {
        p.innerHTML = p.dataset.i18nOrigHtml.replace('Todos os direitos reservados.', t['footer.rights']);
      }
    });

    // 5. Badges de Antes e Depois (Case CPFL)
    const badgeAntes = document.querySelector('.badge-antes');
    if (badgeAntes) {
      saveOrig(badgeAntes);
      if (lang === 'pt') restoreOrig(badgeAntes);
      else badgeAntes.textContent = t['case.badge_before'];
    }
    const badgeDepois = document.querySelector('.badge-depois');
    if (badgeDepois) {
      saveOrig(badgeDepois);
      if (lang === 'pt') restoreOrig(badgeDepois);
      else badgeDepois.textContent = t['case.badge_after'];
    }

    // 6. Labels Desafio/Solução/Resultado
    document.querySelectorAll('.cpfl-case-item strong, .project-case-item strong').forEach(strong => {
      if (strong.hasAttribute('data-i18n')) return;
      saveOrig(strong);
      if (lang === 'pt') {
        restoreOrig(strong);
      } else {
        const txt = strong.textContent.trim().toLowerCase();
        if (txt.includes('desafio')) strong.textContent = t['case.label_challenge'];
        else if (txt.includes('solução') || txt.includes('solucao')) strong.textContent = t['case.label_solution'];
        else if (txt.includes('resultado')) strong.textContent = t['case.label_result'];
      }
    });

    // 7. Textos de Projetos Específicos via pathname
    const path = window.location.pathname;

    if (path.includes('projeto-vezzy')) {
      const h2 = document.querySelector('.project-summary-text h2');
      if (h2) {
        saveOrig(h2);
        if (lang === 'pt') restoreOrig(h2);
        else h2.textContent = t['vezzy.concept_title'];
      }
      const ps = document.querySelectorAll('.project-summary-text p');
      if (ps[0]) {
        saveOrig(ps[0]);
        if (lang === 'pt') restoreOrig(ps[0]);
        else ps[0].textContent = t['vezzy.concept_p1'];
      }
      if (ps[1]) {
        saveOrig(ps[1]);
        if (lang === 'pt') restoreOrig(ps[1]);
        else ps[1].textContent = t['vezzy.concept_p2'];
      }
    } else if (path.includes('projeto-verteos')) {
      const ps = document.querySelectorAll('.project-hero-header p.project-summary-text');
      if (ps[0]) {
        saveOrig(ps[0]);
        if (lang === 'pt') restoreOrig(ps[0]);
        else ps[0].textContent = t['verteos.p1'];
      }
      if (ps[1]) {
        saveOrig(ps[1]);
        if (lang === 'pt') restoreOrig(ps[1]);
        else ps[1].textContent = t['verteos.p2'];
      }
    } else if (path.includes('projeto-vida-inc')) {
      const pSummary = document.querySelector('.project-hero-header p.project-summary-text');
      if (pSummary) {
        saveOrig(pSummary);
        if (lang === 'pt') restoreOrig(pSummary);
        else pSummary.innerHTML = t['vida_inc.desc'];
      }
    } else if (path.includes('projeto-tcc')) {
      const pSummary = document.querySelector('.project-hero-header p.project-summary-text');
      if (pSummary) {
        saveOrig(pSummary);
        if (lang === 'pt') restoreOrig(pSummary);
        else pSummary.textContent = t['tcc.desc'];
      }
    } else if (path.includes('projeto-avery')) {
      const pSummary = document.querySelector('.project-hero-header p.project-summary-text');
      if (pSummary) {
        saveOrig(pSummary);
        if (lang === 'pt') restoreOrig(pSummary);
        else pSummary.textContent = t['avery.desc'];
      }
    } else if (path.includes('projeto-envo')) {
      const pSummary = document.querySelector('.project-hero-header p.project-summary-text');
      if (pSummary) {
        saveOrig(pSummary);
        if (lang === 'pt') restoreOrig(pSummary);
        else pSummary.textContent = t['envo.desc'];
      }
    } else if (path.includes('projeto-campanha')) {
      const pSummary = document.querySelector('.project-hero-header p.project-summary-text');
      if (pSummary) {
        saveOrig(pSummary);
        if (lang === 'pt') restoreOrig(pSummary);
        else pSummary.textContent = t['campanha.desc'];
      }
    } else if (path.includes('projeto-letterings')) {
      const pSummary = document.querySelector('.project-hero-header p.project-summary-text');
      if (pSummary) {
        saveOrig(pSummary);
        if (lang === 'pt') restoreOrig(pSummary);
        else pSummary.textContent = t['letterings.desc'];
      }
    }

    // 8. Navegação inferior de projetos e ilustrações ("Projeto anterior", "Próximo projeto", "Próxima Ilustração")
    document.querySelectorAll('.project-nav-links a, .project-bottom-nav a, .back-link').forEach(a => {
      if (a.hasAttribute('data-i18n')) return;
      saveOrig(a);
      if (lang === 'pt') {
        restoreOrig(a);
      } else {
        let txt = a.dataset.i18nOrigHtml.trim();
        if (exactMap[txt]) {
          a.textContent = exactMap[txt];
        } else {
          txt = txt
            .replace('Projeto anterior', 'Previous project')
            .replace('Próximo projeto', 'Next project')
            .replace('Próxima Ilustração', 'Next Illustration')
            .replace('Eu sou a ferida e o cutel', 'I Am the Wound and the Knife')
            .replace('Contenção', 'Restraint')
            .replace('Retratos de V10L3NT4', 'Portraits of V10L3NT4')
            .replace('C405 • Corte', 'C405 • Slash');
          a.textContent = txt;
        }
      }
    });

    // 9. Varredura geral de elementos de texto usando EXACT_TEXT_MAP_EN
    const targetSelectors = 'h1, h2, h3, h4, p, span, li, a';
    document.querySelectorAll(targetSelectors).forEach(el => {
      if (el.hasAttribute('data-i18n')) return;
      if (el.children.length > 0) return; // Evita sobrescrever containers com tags filhas

      const raw = el.textContent.trim();
      if (!raw) return;

      if (lang === 'en') {
        if (exactMap[raw]) {
          saveOrig(el);
          el.textContent = exactMap[raw];
        }
      } else {
        if (el.dataset.i18nOrigHtml !== undefined) {
          restoreOrig(el);
        }
      }
    });
  }

  // Aplicar traduções em todos os elementos
  function translatePage(lang) {
    const translations = window.PORTFOLIO_TRANSLATIONS ? window.PORTFOLIO_TRANSLATIONS[lang] : null;
    if (!translations) return;

    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';

    // 1. Elementos marcados com data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        if (translations[key].includes('<') && translations[key].includes('>')) {
          el.innerHTML = translations[key];
        } else {
          el.textContent = translations[key];
        }
      }
    });

    // 2. Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
        el.setAttribute('placeholder', translations[key]);
      }
    });

    // 3. Títulos / aria-label
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (translations[key]) {
        el.setAttribute('title', translations[key]);
        if (el.hasAttribute('aria-label')) {
          el.setAttribute('aria-label', translations[key]);
        }
      }
    });

    // 4. Tradução universal para todas as páginas e seções restantes
    applyUniversalTranslations(lang);

    // 5. Atualizar estado visual do botão
    updateSwitcherState();

    window.dispatchEvent(new CustomEvent('portfolioLanguageChanged', { detail: { lang } }));
  }

  function setLanguage(lang) {
    if (lang !== 'pt' && lang !== 'en') return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // Ignorar erro
    }
    translatePage(lang);
  }

  function init() {
    setupLanguageSwitcher();
    translatePage(currentLang);
  }

  window.portfolioI18n = {
    setLanguage,
    getLanguage: () => currentLang,
    translatePage,
    init
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
