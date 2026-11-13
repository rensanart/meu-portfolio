// ==========================================
// INTERNACIONALIZAÇÃO (i18n - PT / EN)
// ==========================================
if (!window.PORTFOLIO_TRANSLATIONS && !document.querySelector('script[src*="translations.js"]')) {
  const transScript = document.createElement('script');
  transScript.src = 'js/translations.js';
  transScript.async = false;
  document.head.appendChild(transScript);
}
if (!window.portfolioI18n && !document.querySelector('script[src*="i18n.js"]')) {
  const i18nScript = document.createElement('script');
  i18nScript.src = 'js/i18n.js';
  i18nScript.async = false;
  document.head.appendChild(i18nScript);
}

// ==========================================
// RASTREAMENTO ANALÍTICO INVISÍVEL
// ==========================================
if (!document.querySelector('script[src*="analytics.js"]')) {
  const analyticsScript = document.createElement('script');
  analyticsScript.src = 'js/analytics.js';
  analyticsScript.async = true;
  document.head.appendChild(analyticsScript);
}

// ==========================================
// FILTRO DE CATEGORIAS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  function applyFilter(filterValue) {
    const isMotionFilter = (filterValue === 'motion' || filterValue === 'videos');

    filterBtns.forEach(b => {
      const btnFilter = b.getAttribute('data-filter');
      if (btnFilter === filterValue || (isMotionFilter && (btnFilter === 'motion' || btnFilter === 'videos'))) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const categories = cardCategory.split(' ');

      if (filterValue === 'all') {
        // "Todos" exibe apenas os projetos principais de design
        // Os motions ficam na seleção exclusiva "Motion"
        if (categories.includes('motion') || categories.includes('videos')) {
          card.classList.add('hidden');
        } else {
          card.classList.remove('hidden');
        }
      } else {
        if (categories.includes(filterValue) || (isMotionFilter && (categories.includes('motion') || categories.includes('videos')))) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      }
    });

    // Centraliza o último card se o total de cards visíveis for ímpar no grid de 2 colunas
    const visibleCards = Array.from(projectCards).filter(c => !c.classList.contains('hidden'));
    projectCards.forEach(c => c.classList.remove('project-card-centered'));
    if (visibleCards.length % 2 !== 0 && visibleCards.length > 1) {
      visibleCards[visibleCards.length - 1].classList.add('project-card-centered');
    }

    // Reproduz vídeos automaticamente ao entrar na aba de Motion
    if (isMotionFilter) {
      projectCards.forEach(card => {
        if (!card.classList.contains('hidden')) {
          const videoEl = card.querySelector('video');
          if (videoEl) {
            videoEl.play().catch(() => {});
          }
        }
      });
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      applyFilter(filterValue);
    });
  });

  // Links do header para filtrar direto (Projetos / Ilustrações)
  document.querySelectorAll('.nav-filter-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetFilter = link.getAttribute('data-filter');
      if (targetFilter) {
        applyFilter(targetFilter);
      }
    });
  });

  // Suporte a URL com ?filter=illustration
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  if (filterParam) {
    applyFilter(filterParam);
    const projectsEl = document.getElementById('projetos');
    if (projectsEl) {
      setTimeout(() => {
        projectsEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ==========================================
  // ANIMAÇÃO PING-PONG DO LOGO NO HEADER (1 -> 11 -> 1)
  // Ritmo: 0.2s (200ms) por frame, e no Frame 5 (5.svg) pausa 1s (1000ms)
  // ==========================================
  const logoHeaderImg = document.getElementById('ren-header-logo-frame');
  
  if (logoHeaderImg) {
    const logoFrames = [
      'assets/images/1.svg',  // index 0
      'assets/images/2.svg',  // index 1
      'assets/images/3.svg',  // index 2
      'assets/images/4.svg',  // index 3
      'assets/images/5.svg',  // index 4 (Frame 5: Pausa 1s)
      'assets/images/6.svg',  // index 5
      'assets/images/7.svg',  // index 6
      'assets/images/8.svg',  // index 7
      'assets/images/9.svg',  // index 8
      'assets/images/10.svg', // index 9
      'assets/images/11.svg'  // index 10
    ];

    let currentFrame = 0;
    let direction = 1;

    function playPingPongSequence() {
      currentFrame += direction;

      if (currentFrame >= logoFrames.length - 1) {
        currentFrame = logoFrames.length - 1;
        direction = -1;
      } else if (currentFrame <= 0) {
        currentFrame = 0;
        direction = 1;
      }

      logoHeaderImg.src = logoFrames[currentFrame];

      const frameDuration = (currentFrame === 4) ? 1000 : 200;
      setTimeout(playPingPongSequence, frameDuration);
    }

    setTimeout(playPingPongSequence, 200);
  }

  // ==========================================
  // LIGHTBOX CARROSSEL PARA GALERIA DE PROJETOS E ILUSTRAÇÕES
  // ==========================================
  let lightboxModal = document.getElementById('lightbox-modal');
  let lightboxImg = document.getElementById('lightbox-img');
  let lightboxCounter = document.getElementById('lightbox-counter');
  let lightboxClose = document.getElementById('lightbox-close');
  let lightboxPrev = document.getElementById('lightbox-prev');
  let lightboxNext = document.getElementById('lightbox-next');

  // Coleta todos os blocos e imagens da galeria na página
  const rawGalleryItems = Array.from(document.querySelectorAll(
    '.project-gallery-grid .gallery-grid-item, .gallery-grid-item, .project-theme-logo-wrapper, .project-gallery-grid img'
  ));

  const galleryItems = [];
  const seenSrcs = new Set();

  rawGalleryItems.forEach(item => {
    const imgEl = item.tagName === 'IMG' ? item : item.querySelector('img');
    if (imgEl && imgEl.src && !seenSrcs.has(imgEl.src)) {
      seenSrcs.add(imgEl.src);
      galleryItems.push(item);
    }
  });

  // Controle de clique nos vídeos para pausar/tocar
  document.querySelectorAll('.gallery-grid-item video').forEach(video => {
    video.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });

  if (galleryItems.length > 0) {
    // Garante que o modal exista no DOM
    if (!lightboxModal) {
      lightboxModal = document.createElement('div');
      lightboxModal.id = 'lightbox-modal';
      lightboxModal.className = 'lightbox-modal';
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.appendChild(lightboxModal);
    }

    // Garante a estrutura completa de botões e contador
    if (!lightboxImg || !lightboxClose || !lightboxPrev || !lightboxNext || !lightboxCounter) {
      lightboxModal.innerHTML = `
        <button id="lightbox-close" class="lightbox-close" aria-label="Fechar">✕</button>
        <button id="lightbox-prev" class="lightbox-nav lightbox-prev" aria-label="Anterior">←</button>
        <div class="lightbox-content">
          <img id="lightbox-img" src="" alt="Visualização">
          <div id="lightbox-counter" class="lightbox-counter">1 / 1</div>
        </div>
        <button id="lightbox-next" class="lightbox-nav lightbox-next" aria-label="Próxima">→</button>
      `;
      lightboxImg = document.getElementById('lightbox-img');
      lightboxCounter = document.getElementById('lightbox-counter');
      lightboxClose = document.getElementById('lightbox-close');
      lightboxPrev = document.getElementById('lightbox-prev');
      lightboxNext = document.getElementById('lightbox-next');
    }

    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      updateLightboxContent();
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function updateLightboxContent() {
      const currentItem = galleryItems[currentIndex];
      const targetImg = currentItem.tagName === 'IMG' ? currentItem : currentItem.querySelector('img');
      if (targetImg && lightboxImg) {
        lightboxImg.style.opacity = '0.35';
        lightboxImg.src = targetImg.src;
        lightboxImg.alt = targetImg.alt || 'Imagem do projeto';
        setTimeout(() => {
          lightboxImg.style.opacity = '1';
        }, 50);
      }
      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
      }
    }

    function showNextImage() {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateLightboxContent();
    }

    function showPrevImage() {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxContent();
    }

    galleryItems.forEach((item, index) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && !e.target.classList.contains('gallery-grid-item')) return;
        // Se for um card do focus-carousel e não for o central ativo (data-pos !== "0"), não abre o lightbox
        if (item.classList.contains('focus-carousel-card') && item.getAttribute('data-pos') !== '0') {
          return;
        }
        e.preventDefault();
        openLightbox(index);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
      });
    }
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
      });
    }

    // Clicar fora da imagem fecha
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });

    // Clicar na imagem avança para a próxima
    if (lightboxImg) {
      lightboxImg.style.cursor = 'pointer';
      lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
      });
    }

    // Teclado
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    });

    // Touch Swipe
    let touchStartX = 0;
    let touchEndX = 0;
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        showNextImage();
      } else if (touchEndX - touchStartX > 45) {
        showPrevImage();
      }
    }, { passive: true });
  }

  // ==========================================
  // BOTÕES DE NAVEGAÇÃO DOS CARROSSÉIS HORIZONTAIS
  // ==========================================
  document.querySelectorAll('.carousel-arrow-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const track = document.getElementById(targetId);
      if (!track) return;
      const scrollStep = track.clientWidth * 0.75;
      if (btn.classList.contains('prev')) {
        track.scrollBy({ left: -scrollStep, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // ENVIO DO FORMULÁRIO DE CONTATO PARA O GMAIL
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = btn.textContent;

      btn.textContent = 'enviando...';
      btn.disabled = true;

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success || response.ok) {
          btn.textContent = 'Enviado com sucesso! ✓';
          btn.style.backgroundColor = '#10b981';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#ffffff';
          contactForm.reset();
          setTimeout(() => {
            btn.textContent = originalBtnText;
            btn.style.backgroundColor = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 4000);
          alert('Mensagem enviada com sucesso! Em breve Renan W. Santana (Ren-San) entrará em contato.');
          return;
        } else {
          // Fallback para mailto se necessário
          const nome = formData.get('nome') || '';
          const email = formData.get('email') || '';
          const msg = formData.get('mensagem') || '';
          window.location.href = `mailto:rennsant.design@gmail.com?subject=Contato do Portfólio - ${encodeURIComponent(nome)}&body=${encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${msg}`)}`;
        }
      } catch (err) {
        const nome = formData.get('nome') || '';
        const email = formData.get('email') || '';
        const msg = formData.get('mensagem') || '';
        window.location.href = `mailto:rennsant.design@gmail.com?subject=Contato do Portfólio - ${encodeURIComponent(nome)}&body=${encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${msg}`)}`;
      } finally {
        btn.textContent = originalBtnText;
        btn.disabled = false;
      }
    });
  }

  // ==========================================
  // EASTER EGG: TRANSIÇÃO NATIVA (PAGE PEEL & CURL VIA CANVAS)
  // ZERO PISCADA, 60 FPS, RESPOSTA NO 1º CLIQUE, 0 DEPENDÊNCIAS
  // ==========================================
  const peelLinks = document.querySelectorAll('.easter-egg-peel .peel-link');
  if (peelLinks.length > 0) {
    const originalPath = window.location.pathname.split('/').pop() || 'index.html';
    const originalTitle = document.title;
    const tccTitle = 'O Rei de Amarelo • Design TCC | Renan W. Santana (Ren-San)';

    const tccProjectHTML = `
      <header class="header">
        <div class="header-container">
          <a href="index.html" class="header-logo-link tcc-back-btn" aria-label="Renan W. Santana (Ren-San) Home">
            <svg id="tcc-header-logo-svg" class="header-logo-r" aria-label="Logo R Animado" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1323.6 714.8">
              <defs>
                <style>
                  .cls-letter-r-neg {
                    fill: #000000;
                    transform-origin: 660.95px 107.56px;
                    animation: pulseCoreNeg 6.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                  }

                  .st0, .st1, .st2, .st3, .st4, .st5, .st6 {
                    fill: none;
                    stroke: #000;
                    transform-origin: 660.95px 107.56px;
                    animation-duration: 6.4s;
                    animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    animation-iteration-count: infinite;
                  }

                  .st5 {
                    stroke-width: 3px;
                    animation-name: wavePulseNeg1;
                    animation-delay: 0.0s;
                  }

                  .st0 {
                    stroke-width: 2.2px;
                    animation-name: wavePulseNeg2;
                    animation-delay: 0.7s;
                  }

                  .st1 {
                    stroke-width: 2px;
                    animation-name: wavePulseNeg3;
                    animation-delay: 1.4s;
                  }

                  .st2 {
                    stroke-width: 1.8px;
                    animation-name: wavePulseNeg4;
                    animation-delay: 2.1s;
                  }

                  .st4 {
                    stroke-width: 1.6px;
                    animation-name: wavePulseNeg5;
                    animation-delay: 2.8s;
                  }

                  .st3 {
                    stroke-width: 1.2px;
                    animation-name: wavePulseNeg6;
                    animation-delay: 3.5s;
                  }

                  .st6 {
                    stroke-width: 1px;
                    animation-name: wavePulseNeg7;
                    animation-delay: 4.2s;
                  }

                  @keyframes pulseCoreNeg {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.035); }
                    50% { transform: scale(0.99); }
                  }

                  @keyframes wavePulseNeg1 {
                    0%, 100% { transform: scale(1); opacity: 0.9; }
                    22% { transform: scale(1.025); opacity: 1; }
                    55% { transform: scale(0.995); opacity: 0.75; }
                  }

                  @keyframes wavePulseNeg2 {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    24% { transform: scale(1.028); opacity: 0.95; }
                    58% { transform: scale(0.992); opacity: 0.65; }
                  }

                  @keyframes wavePulseNeg3 {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    26% { transform: scale(1.03); opacity: 0.9; }
                    60% { transform: scale(0.99); opacity: 0.55; }
                  }

                  @keyframes wavePulseNeg4 {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    28% { transform: scale(1.032); opacity: 0.85; }
                    62% { transform: scale(0.988); opacity: 0.45; }
                  }

                  @keyframes wavePulseNeg5 {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    30% { transform: scale(1.035); opacity: 0.8; }
                    65% { transform: scale(0.985); opacity: 0.35; }
                  }

                  @keyframes wavePulseNeg6 {
                    0%, 100% { transform: scale(1); opacity: 0.4; }
                    32% { transform: scale(1.038); opacity: 0.75; }
                    68% { transform: scale(0.982); opacity: 0.25; }
                  }

                  @keyframes wavePulseNeg7 {
                    0%, 100% { transform: scale(1); opacity: 0.35; }
                    35% { transform: scale(1.04); opacity: 0.7; }
                    70% { transform: scale(0.98); opacity: 0.2; }
                  }
                  .header-waves-group {
                    transform-origin: 660.95px 107.56px;
                    transform: scale(0.7);
                    will-change: transform, opacity;
                  }
                </style>
              </defs>
              <g class="header-waves-group">
                <path class="st6" d="M1275.4,42.8c0,71.2-135.5,115-161.2,177-26.6,64.3,37.3,190.8-11.2,239.2s-175.1-15.4-239.2,11.2c-62,25.7-106,166.5-177,161.2-16.7-1.2-19.3-2.6-28.2-7.2-8.9-4.6-17.5-11.1-25.8-19-37.4-37.9-29.5-94-42.6-142.3-5.3-14.4-10.4-34-24.8-35.3-97.9-11.7-178.8,60-258.4,107.2-10.4,6.9-20.8,13.6-30.9,20.4-61,40.5-120,80.7-188.6,106.1-10.4,3.9-31.3,7.8-32.6-1.3-4.9-62.8,30.5-116.4,69.8-168.9,7.8-10.5,15.9-21,23.7-31.4,7.5-9.7,14.9-19.3,22.4-28.8s14.9-19,22.3-28.4c34.1-46.7,74.5-88.4,98.1-142,17-36.6-2.6-82.3-41.8-96.6-36.6-14.4-74.4-26.1-106.4-50.7-6.7-5-13-10.4-18.9-16.7-7.8-8.2-14.4-16.8-19-25.7-4.6-8.9-7.2-18.4-7.2-28.2,0-71.2,135.5-115,161.2-177,26.6-64.3-37.3-190.8,11.2-239.2,48.4-48.4,175,15.4,239.2-11.2,62-25.7,105.8-161.2,177-161.2s82.9,60.2,119.4,108c9.1,11.9,18.4,23.1,27.9,32.4,6.6,6.2,12.8,12.2,19.2,17.5,9.9,5.6,18,12.8,23.7,21.6,27.6,54.2-16.7,109.1-32.4,162.6-9.1,31.3-18.3,70.5,6.6,95.3,9.1,9.1,23.5,2.6,35.3-2.6,67.9-30,150.1-67.9,219.6-21.4,10.6,6.8,20.7,15.7,29.8,27.4,8.5,10.1,19.7,19.4,31.7,28.5,47.8,36.7,108,71.9,108,119.4h.2-.1Z"/>
                <path class="st3" d="M685.7-491c30.5,0,55.6,25,79.3,55.2,2.7,3.4,5.6,7,8.1,10.4,7.4,9.9,14.4,20.3,21.2,30,.8,1.1,1.5,2.2,2.3,3.2,6.3,8.9,12.6,17.4,19.7,24.7,1.8,1.9,3.7,3.8,5.5,5.5,6.2,5.7,12,10.9,18.1,15.5,9.2,4.9,17.4,10.8,22.5,18.9,12.5,20.2,9.9,42.3,3.8,63.6v.4c-7.9,27.4-23.5,54.8-31.2,82-7.9,28.2-15.9,63.4,6.3,85.8,8.1,8.2,21,2.6,31.5-1.9,60.6-25.8,133.3-57.8,195.5-16.2,9.3,6.3,18.2,14.4,26.4,24.8,7.5,9.3,17.5,17.6,28.1,25.8,42.4,33.2,95.8,65.3,95.6,108.1-.3,64.5-121.4,104.5-144.9,160.5-24.4,58,31.4,171.4-12.6,215-31,30.7-96.4,11.9-152.8,6.4-23.7-2.4-46-2.3-63.3,4.8-56.3,23-96.5,143.5-160.9,143.3-8.9,0-17.4-2.4-25.5-6.5-8-4.1-15.9-9.8-23.2-16.9-1.8-1.8-3.5-3.6-5.1-5.5-28.3-33.6-20.9-81.7-33.6-122.3-4.1-13.1-9.3-30.4-22.2-31.8-6.5-.7-12.8-1.2-19.1-1.3-35.8,0-69,11.6-100.9,28.1-10.3,5.4-20.6,11.2-30.6,17.4-28,17-55.4,35.5-82,52-9.5,6-18.7,12.2-27.8,18.3-54.9,36.5-108.2,72.3-169.7,95.5-9.4,3.6-28.4,6.9-29.2-1.4-5.5-56.4,28.3-104.8,63.7-152.2,7.1-9.4,14.2-19,21.4-28.3,6.7-8.7,13.3-17.4,19.9-26s13.3-17.1,19.7-25.7c17.5-23.8,36-46.9,52.9-70.7,12.7-18,24-36.9,33-57.5,14.5-33.2-3-73.7-37.8-87.4-32.8-12.9-66.2-24.5-94.8-46.7-6-4.6-11.6-9.5-16.8-15.2-7-7.6-12.8-15.2-16.9-23.3-4.1-8.1-6.4-16.6-6.4-25.5,0-64.6,120.8-104.7,144.2-160.9,24.2-58.2-31.8-171.8,12.1-215.7s157.5,12.2,215.7-11.9c56.2-23.2,96.4-144.1,160.9-144.1h.2l-.3-.3Z"/>
                <path class="st4" d="M684.9-436c28.5,0,52.1,22.1,74.1,49.4,2.4,3,5.4,6.4,7.6,9.5,6.8,9.2,12.9,18.9,18.8,28,.6,1,1.3,2,1.9,3,5.3,8.3,10.6,16.2,17.3,23,1.7,1.8,3.4,3.4,5.2,5,5.7,5.1,11.2,9.5,17,13.5,8.5,4.2,16.3,9,21.1,16.2,11.6,17.4,9.5,37.2,4.2,56.1v.3c-7,24.3-20.1,48.8-26.6,72.8-6.8,25-13.5,56.2,6,76.3,7.2,7.4,18.5,2.6,27.7-1.2,53.3-21.7,117.1-48.6,171.6-11.1,8.2,5.7,15.9,13,23.1,22.4,6.5,8.3,15.3,15.8,24.5,23.2,37.1,29.8,83.7,58.5,83.3,96.9-.7,57.7-107.2,94-128.7,144-22.2,51.9,25.6,151.9-14.1,190.7-27.9,27.3-86,11.2-136.3,6.7-21.2-2-40.9-1.9-56.4,4.4-50.7,20.4-87.1,125.8-144.8,125.3-7.9,0-15.5-2.2-22.8-5.8-7.3-3.6-14.2-8.6-20.8-14.9-1.6-1.6-3.1-3.2-4.5-4.9-25.4-29.6-19-72.3-30.1-108.5-3.6-11.7-8.2-27-19.6-28.4-5.7-.7-11.3-1.2-17-1.2-31.9-.2-61.5,10.1-89.8,24.8-9.2,4.8-18.3,10-27.2,15.5-24.8,15.1-49.3,31.5-72.9,46.1-8.4,5.3-16.6,10.8-24.7,16.2-49,32.3-96.4,64.2-150.9,84.9-8.4,3.2-25.1,6-25.8-1.5-4.2-50.2,26.1-93.2,57.5-135.5,6.3-8.4,12.6-16.9,18.9-25.3,5.9-7.8,11.6-15.6,17.4-23.3,5.7-7.7,11.5-15.3,17-23,15.1-21.5,31-42,45.5-63.3,10.9-16.1,20.6-33,28.3-51.4,12.4-29.6-3.1-65.7-33.7-78.2-28.8-11.9-58.1-22.7-83.3-42.7-5.2-4.2-10.1-8.6-14.7-13.7-6.1-6.8-11.2-13.7-14.8-21-3.6-7.3-5.6-14.8-5.6-22.8,0-57.9,106.1-94.5,127.2-144.8,21.8-52.3-26.4-152.7,13-192s140,8.9,192.2-12.7c50.5-20.9,86.9-126.9,144.8-126.9h-.1Z"/>
                <path class="st2" d="M684.1-381c26.5,0,48.5,19.1,68.8,43.6,2.1,2.6,5.2,5.8,7.2,8.5,6.2,8.4,11.5,17.5,16.3,25.9.5.9,1.1,1.9,1.6,2.8,4.4,7.7,8.6,15.1,14.9,21.4,1.6,1.6,3.2,3.1,4.8,4.5,5.3,4.5,10.5,8.2,15.9,11.5,7.8,3.4,15.1,7.4,19.7,13.5,10.6,14.6,9,32.1,4.6,48.6v.3c-5.9,21.3-16.7,42.7-22.1,63.8-5.6,22-11.2,49.2,5.8,66.9,6.3,6.6,16,2.6,23.9-.5,46-17.4,100.9-39.4,147.5-6,3,21.5,4.3,49.2,19.9,19.8,5.6,7.4,13.1,13.9,21,20.6,31.7,26.3,71.4,51.9,70.8,85.5-1,51-93.1,83.4-112.4,127.5-20,45.6,19.9,132.3-15.5,166.4-24.8,23.9-75.7,10.6-119.8,7-18.6-1.6-36-1.4-49.7,4.1-45,17.7-77.8,108-128.7,107.3-7.1,0-13.7-1.9-20.1-5.1-6.4-3.2-12.4-7.5-18.3-12.9-1.4-1.3-2.7-2.8-4-4.2-22.7-25.5-17.1-63-26.6-94.7-3.1-10.3-7.1-23.6-16.9-25-5-.7-9.8-1.2-14.8-1.2-27.9-.3-53.8,8.7-78.6,21.6-8,4.2-16,8.7-23.8,13.5-21.8,13.2-43.2,27.4-63.9,40.2-7.5,4.6-14.5,9.4-21.7,14.2-42.9,28.2-84.5,56-132,74.3-7.5,2.9-22,5-22.4-1.6-2.8-43.9,23.9-81.7,51.4-118.8,5.5-7.5,10.9-14.9,16.4-22.4,5.1-6.9,10-13.8,14.9-20.7,4.9-6.9,9.7-13.5,14.4-20.4,12.7-19,26-37.3,38.1-55.7,9.1-14.1,17.2-29,23.5-45.2,10.3-26-3.3-57.5-29.6-69-24.9-10.8-50.1-20.8-71.6-38.7-4.5-3.7-8.7-7.7-12.6-12.2-5.3-6-9.6-12.1-12.6-18.6-3.1-6.4-4.8-13-4.8-20.1.2-51.4,91.4-84.1,110.1-128.8,19.3-46.2-21.1-133.6,13.9-168.4s122.4,5.8,168.7-13.4c44.7-18.5,77.5-109.6,128.9-109.7h-.5Z"/>
                <path class="st1" d="M683.3-326c24.5,0,44.8,16,63.7,37.8,1.9,2.1,5,5.2,6.8,7.6,5.7,7.7,10.1,16.1,13.8,23.9.4.9.8,1.7,1.2,2.6,3.4,7.3,6.8,14,12.5,19.8,1.5,1.4,2.9,2.8,4.4,3.9,4.9,3.9,9.7,7,14.8,9.4,7.2,2.7,14,5.6,18.3,10.8,9.6,11.8,8.5,26.9,5,41v.2c-4.8,18.1-13.3,36.6-17.5,54.6-4.4,18.9-8.8,42.1,5.5,57.4,5.3,5.7,13.4,2.6,20.2.3,38.7-13.3,84.7-30.2,123.6-.9,5.9,4.5,11.3,10.1,16.5,17.2,4.7,6.4,10.9,12.1,17.5,17.9,26.3,22.9,59.3,45.2,58.4,74.2-1.3,44.2-78.9,72.8-96.1,111-17.8,39.4,14.1,112.9-17,142.2-21.9,20.6-65.4,9.9-103.3,7.3-16-1.2-31-.9-42.9,3.7-39.3,15.1-68.5,90.2-112.6,89.3-6.1,0-11.8-1.7-17.4-4.4-5.5-2.7-10.7-6.4-15.7-10.9-1.2-1.1-2.4-2.3-3.5-3.5-19.9-21.6-15.2-53.6-23.2-80.9-2.6-8.9-6-20.3-14.3-21.6-4.2-.7-8.3-1.1-12.6-1.2-23.9-.4-46.2,7.3-67.5,18.2-7,3.6-13.7,7.5-20.5,11.6-18.7,11.3-37.1,23.4-54.8,34.5-6.4,4-12.5,8.1-18.7,12.1-36.9,24.1-72.6,47.9-113.3,63.8-6.4,2.5-18.8,4-19-1.6-1.4-37.7,21.8-70,45.2-102.1,4.7-6.5,9.3-12.9,14-19.3,4.3-6,8.4-11.9,12.4-18,4-6,8-11.7,11.7-17.7,10.3-16.5,21-32.5,30.7-48.3,7.5-12.2,13.8-25,18.9-38.9,8.2-22.4-3.4-49.5-25.5-59.8-21-9.8-42-18.9-60.1-34.8-3.7-3.3-7.3-6.8-10.5-10.7-4.4-5.2-7.9-10.5-10.5-16.1-2.5-5.6-4-11.3-4-17.4.2-44.7,76.7-73.8,93-112.7,16.9-40.2-15.7-114.5,14.7-144.8,30.4-30.3,104.9,2.5,145.2-14.2,38.9-16.1,68.1-92.4,112.8-92.4h-.3Z"/>
                <path class="st0" d="M682.4-271.1c22.6,0,41.1,13,58.4,31.9,1.6,1.7,4.7,4.5,6.3,6.7,5.1,7,8.7,14.7,11.3,21.9.3.8.6,1.6.9,2.4,2.4,6.7,4.8,12.9,10.1,18.1,1.3,1.3,2.7,2.4,4.1,3.4,4.5,3.2,8.9,5.7,13.7,7.5,6.5,2,12.8,3.8,16.9,8.1,8.4,9.1,8.1,21.8,5.3,33.5v.2c-3.7,15-9.9,30.4-12.9,45.6-3.2,15.7-6.5,35,5.3,47.9,4.3,4.8,10.9,2.6,16.4,1,31.4-9.1,68.6-21.1,99.5,4.2,4.7,3.9,9.1,8.6,13.2,14.6,3.7,5.4,8.6,10.3,13.9,15.2,20.9,19.6,47.1,38.4,46.1,62.9-1.6,37.5-64.8,62.3-79.8,94.4-15.5,33.2,8.3,93.4-18.4,117.9-18.8,17.2-54.9,9.3-86.9,7.6-13.4-.8-26-.5-36.2,3.4-33.7,12.4-59.1,72.5-96.5,71.3-5.1,0-9.9-1.5-14.6-3.7-4.6-2.2-9-5.2-13.2-8.8-1-.9-2-1.9-2.9-2.9-17.1-17.6-13.3-44.3-19.8-67.1-2.1-7.5-4.9-16.9-11.6-18.2-3.5-.6-7-1.1-10.4-1.2-20.1-.5-38.6,5.9-56.3,14.9-5.8,3-11.4,6.3-17.1,9.7-15.6,9.3-31,19.5-45.9,28.6-5.4,3.3-10.4,6.8-15.6,10-30.9,20.1-60.8,39.6-94.5,53.2-5.4,2.2-15.5,3.1-15.5-1.7,0-31.4,19.7-58.4,39-85.4,3.9-5.5,7.7-10.8,11.5-16.3,3.5-5,6.8-10.1,9.9-15.3,3.1-5.1,6.3-9.9,9.1-15,7.9-14.1,16-27.6,23.2-40.7,5.7-10.2,10.3-21.2,14.1-32.8,6.2-18.8-3.6-41.4-21.6-50.7-17-8.7-34-17.1-48.5-30.8-3-2.8-5.9-5.9-8.4-9.2-3.5-4.5-6.4-8.9-8.4-13.7-2-4.7-3.2-9.5-3.1-14.6.3-38.1,62.1-63.5,76-96.5,14.4-34.2-10.3-95.5,15.6-121.2s87.4-.8,121.7-14.9c33.1-13.7,58.6-75.2,96.7-75.2h-.3l.2-.2Z"/>
                <path class="st5" d="M681.5-216.1c20.6,0,37.5,10,53.3,26,1.3,1.3,4.5,3.9,5.8,5.7,4.5,6.3,7.4,13.3,8.9,19.9.2.7.3,1.4.5,2.1,1.4,6.2,2.8,11.7,7.7,16.4,1.2,1.1,2.4,2.1,3.7,2.9,4,2.6,8.1,4.3,12.5,5.5,5.8,1.3,11,2.9,15.6,5.5,5.8,7.7,7.6,16.6,5.7,25.9v.2c-2.6,12-6.6,24.3-8.4,36.5-2,12.6-4.1,27.8,5,38.4,3.4,3.9,8.4,2.6,12.6,1.7,24.1-5,52.4-11.8,75.6,9.3,3.6,3.2,6.9,7.3,9.8,12.1,2.8,4.5,6.5,8.5,10.3,12.6,15.5,16.2,35,31.8,33.7,51.7-1.9,30.7-50.6,51.7-63.6,77.9-13.3,27,2.5,73.9-19.9,93.7-15.7,13.9-44.6,8.6-70.4,7.8-10.8-.4-21.1,0-29.4,3-28,9.8-49.8,54.7-80.3,53.4-4.2-.2-8.1-1.2-11.9-3-3.7-1.7-7.3-4-10.7-6.9-.8-.7-1.6-1.5-2.4-2.2-14.3-13.5-11.4-35-16.3-53.2-1.6-6.1-3.7-13.5-9-14.7-2.7-.6-5.5-1-8.3-1.2-16.1-.6-31,4.4-45.2,11.6-4.7,2.4-9.1,5-13.7,7.7-12.5,7.5-24.8,15.5-36.9,22.8-4.3,2.6-8.4,5.4-12.5,7.9-24.8,15.9-49,31.5-75.6,42.6-4.4,1.8-12.3,2.1-12.1-1.8,1.4-25.1,17.5-46.8,32.9-68.7,3.1-4.4,6.1-8.8,9-13.2,2.7-4.1,5.2-8.2,7.5-12.6,2.2-4.2,4.5-8.1,6.5-12.4,5.5-11.6,10.9-22.9,15.8-33.3,3.9-8.3,7-17.2,9.4-26.6,4-15.2-3.7-33.3-17.5-41.4-13.1-7.7-25.9-15.2-37-26.8-2.3-2.4-4.4-5-6.4-7.7-2.6-3.7-4.8-7.5-6.4-11.3-1.5-3.8-2.4-7.7-2.3-11.9.4-31.4,47.4-53.2,58.9-80.4,12-28.2-5-76.4,16.5-97.7,21.5-21.3,69.8-4,98.2-15.7,27.3-11.3,49.3-58,80.6-58h.3,0Z"/>
              </g>
              <path class="cls-letter-r-neg" d="M712.1,72v-3.9c-1.7,0-3.4.5-5,1-.5.2-1.1.3-1.6.5-2.6-1.4-7.3,6.6-10.5,5,0,0,3.2-4.8,3.9-6.8.2-.5.4-1,.7-1.5.5-2,1.8-4.1,2-6.4.2-.7.4-1.4.6-2.2,0-.7.3-1.4.6-2.3-.5-.3-1-.6-1.5-.9-.5,0-1.1,0-1.7.2h-33.2c-16.7,0-27.3,4.1-33.8,10.7s-8.6,12.6-8.6,22.3v.3c0,6.8,1.8,12.7,5,17.4,1.6,2.4,3.6,4.6,5.8,6.4,14.2,10.5-17.6,34.3-25.5,48.7,12.7,1.6,28.7-14.3,41.7-11.8,3.5,0,6.8-1.8,8.7-4.7l14.6-22.2h6.7v16.7c0,5.6,4.6,10.1,10.1,10.1l21.5.7-.3-77.4h-.2ZM683.1,99.5h-13.9c-7.7,0-12.4-3.4-12.4-9.1v-.3c0-6,4.8-9,12.3-9h14.1v18.4h0Z"/>
            </svg>
          </a>
          <nav class="nav-menu">
            <a href="index.html" class="nav-link tcc-back-btn">Design</a>
            <a href="ilustracoes.html" class="nav-link">Ilustrações</a>
            <a href="index.html#sobre" class="nav-link">Sobre</a>
            <a href="contato.html" class="nav-link">Contato</a>
          </nav>
          <div class="social-links">
            <a href="https://cara.app/rensan" target="_blank" aria-label="Cara.app">Ca</a>
            <a href="https://www.behance.net/rennsant" target="_blank" aria-label="Behance">Be</a>
            <a href="https://www.instagram.com/rensanart/" target="_blank" aria-label="Instagram">Ig</a>
            <a href="https://www.linkedin.com/in/renan-santana-4514b31b9/" target="_blank" aria-label="LinkedIn">In</a>
          </div>
        </div>
      </header>
      <main class="tcc-project-area">
        <div class="project-detail-container">
          <a href="index.html" class="back-link tcc-back-btn">← Voltar ao portfólio</a>
          <header class="project-hero-header">
            <div class="project-theme-logo-wrapper" style="max-width: 320px;">
              <img src="assets/Rei de amarelo/LOGO REI DE AMARELO.svg" alt="O Rei de Amarelo Logo" class="project-theme-logo" style="width: 100%; max-width: 320px; height: auto; margin: 0 auto; object-fit: contain;">
            </div>
            <p class="project-summary-text">
              Projeto editorial autoral e Trabalho de Conclusão de Curso (TCC) inspirado na clássica obra de horror cósmico de Robert W. Chambers. O projeto investiga a decadência estética, o fascínio do mistério e o simbolismo sombrio através de uma direção de arte visceral, tipografia gótica experimental e ilustrações autorais que conduzem o leitor ao abismo hipnótico de Carcosa.
            </p>
          </header>
          <section class="project-gallery-grid">
            <div class="gallery-grid-item gallery-grid-full">
              <img src="assets/Rei de amarelo/Natureza-morta com livro e caveira dourada.png" alt="O Rei de Amarelo — Edição de Colecionador & Mockup Editorial">
            </div>
            <div class="gallery-grid-item gallery-grid-full">
              <img src="assets/Rei de amarelo/Livro aberto com velas e galho.png" alt="O Rei de Amarelo — Capítulo 1: O Reparador de Reputações">
            </div>
            <div class="gallery-grid-item gallery-grid-full">
              <img src="assets/Rei de amarelo/Seis amarelo fosco no livro de arte.png" alt="O Rei de Amarelo — Capítulo 6: O Paraíso do Profeta">
            </div>
            <div class="gallery-grid-item gallery-grid-full">
              <img src="assets/Rei de amarelo/Livro de arte e velas escultóricas.png" alt="O Rei de Amarelo — Capítulo 10: Rue Barrée">
            </div>
            <div class="gallery-grid-item gallery-grid-full">
              <img src="assets/Rei de amarelo/Livro de arte, velas e carvão.png" alt="O Rei de Amarelo — Conclusão: O Rei em Jambeiro / Fim">
            </div>
            <div class="gallery-grid-item gallery-grid-full">
              <img src="assets/Rei de amarelo/O Rei de Amarelo em ouro.png" alt="O Rei de Amarelo — Key Visual da Máscara Pálida em Ouro">
            </div>
          </section>
          <nav class="project-bottom-nav">
            <a href="index.html" class="nav-btn tcc-back-btn">← Voltar para o portfólio</a>
            <a href="contato.html" class="nav-btn">Entre em contato →</a>
          </nav>
        </div>
      </main>
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-left">
            <a href="index.html" class="footer-logo tcc-back-btn" aria-label="Logo Ren-San">
              <img src="assets/logo-r.svg" alt="R Logo" class="footer-logo-r">
            </a>
            <p class="footer-role">Direção de Arte & Design</p>
          </div>
          <div class="footer-right">
            <div class="footer-social-row">
              <a href="https://cara.app/rensan" target="_blank">Cara ↗</a>
              <a href="https://www.behance.net/rennsant" target="_blank">Behance ↗</a>
              <a href="https://www.instagram.com/rensanart/" target="_blank">Instagram ↗</a>
              <a href="https://www.linkedin.com/in/renan-santana-4514b31b9/" target="_blank">LinkedIn ↗</a>
            </div>
            <p class="copyright">&copy; ${new Date().getFullYear()} Renan W. Santana (Ren-San) ✶ Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    `;

    // Cria os elementos no DOM se ainda não existirem
    let tccOverlay = document.getElementById('tccProjectOverlay');
    if (!tccOverlay) {
      tccOverlay = document.createElement('div');
      tccOverlay.id = 'tccProjectOverlay';
      tccOverlay.className = 'tcc-project-overlay';
      tccOverlay.setAttribute('aria-hidden', 'true');
      tccOverlay.innerHTML = `<div class="tcc-turn-container">${tccProjectHTML}</div>`;
      document.body.appendChild(tccOverlay);
    }

    let peelCanvas = document.getElementById('peelCanvas');
    if (!peelCanvas) {
      peelCanvas = document.createElement('canvas');
      peelCanvas.id = 'peelCanvas';
      document.body.appendChild(peelCanvas);
    }
    const pctx = peelCanvas.getContext('2d');

    function resizePeelCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const bodyZoom = parseFloat(getComputedStyle(document.body).zoom) || 1;
      const w = window.innerWidth / bodyZoom;
      const h = window.innerHeight / bodyZoom;
      peelCanvas.width = w * dpr;
      peelCanvas.height = h * dpr;
      pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resizePeelCanvas);
    resizePeelCanvas();

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function renderPeelFrame(progress) {
      const dpr = window.devicePixelRatio || 1;
      const W = peelCanvas.width / dpr;
      const H = peelCanvas.height / dpr;
      pctx.clearRect(0, 0, W, H);

      if (progress <= 0) return;

      // Canto de partida: C = (W, H) [CANTO INFERIOR DIREITO ONDE FICA A DOBRA]
      const C = { x: W, y: H };

      // Destino do canto puxado: além do canto superior esquerdo (Top-Left)
      const targetX = -W * 0.4;
      const targetY = -H * 0.4;

      const eased = easeInOutCubic(progress);
      const P = {
        x: C.x + (targetX - C.x) * eased,
        y: C.y + (targetY - C.y) * eased
      };

      const vx = P.x - C.x;
      const vy = P.y - C.y;
      const dist = Math.hypot(vx, vy);
      if (dist < 1) return;

      const nx = vx / dist;
      const ny = vy / dist;

      const Mx = (C.x + P.x) / 2;
      const My = (C.y + P.y) / 2;

      const dx = -ny;
      const dy = nx;

      const diag = Math.hypot(W, H);
      const lineLen = diag * 3;
      const L1 = { x: Mx - dx * lineLen, y: My - dy * lineLen };
      const L2 = { x: Mx + dx * lineLen, y: My + dy * lineLen };

      pctx.save();

      // 1. ÁREA REVELADA EM AMARELO (#ffce00):
      // Cobre com precisão total o lado inferior direito da dobra
      pctx.save();
      pctx.beginPath();
      pctx.moveTo(L1.x, L1.y);
      pctx.lineTo(L2.x, L2.y);
      pctx.lineTo(W + 600, -600);
      pctx.lineTo(W + 600, H + 600);
      pctx.lineTo(-600, H + 600);
      pctx.closePath();
      pctx.fillStyle = '#ffce00';
      pctx.fill();

      // 2. SOMBRA PROJETADA DA DOBRA SOBRE A FOLHA AMARELA
      pctx.beginPath();
      pctx.moveTo(L1.x, L1.y);
      pctx.lineTo(L2.x, L2.y);
      pctx.lineTo(L2.x - nx * 90, L2.y - ny * 90);
      pctx.lineTo(L1.x - nx * 90, L1.y - ny * 90);
      pctx.closePath();
      const shadowGrad = pctx.createLinearGradient(Mx, My, Mx - nx * 90, My - ny * 90);
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
      shadowGrad.addColorStop(0.2, 'rgba(0, 0, 0, 0.3)');
      shadowGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.08)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      pctx.fillStyle = shadowGrad;
      pctx.fill();
      pctx.restore();

      // 3. A FOLHA DOBRADA (FLAP / ROLO DE PAPEL AO LONGO DO VINCO):
      pctx.save();
      const curlWidth = Math.min(dist * 0.45, 260);
      const Pcurl = {
        x: Mx + nx * curlWidth,
        y: My + ny * curlWidth
      };

      pctx.beginPath();
      pctx.moveTo(L1.x, L1.y);
      pctx.lineTo(L2.x, L2.y);
      pctx.lineTo(L2.x + nx * curlWidth, L2.y + ny * curlWidth);
      pctx.lineTo(L1.x + nx * curlWidth, L1.y + ny * curlWidth);
      pctx.closePath();

      const rollGrad = pctx.createLinearGradient(Mx, My, Pcurl.x, Pcurl.y);
      rollGrad.addColorStop(0, '#c4c4c4');
      rollGrad.addColorStop(0.08, '#ffffff');
      rollGrad.addColorStop(0.28, '#f7f7f7');
      rollGrad.addColorStop(0.65, '#e5e5e5');
      rollGrad.addColorStop(0.9, '#cfcfcf');
      rollGrad.addColorStop(1, 'rgba(160, 160, 160, 0.2)');
      pctx.fillStyle = rollGrad;
      pctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      pctx.shadowBlur = 35;
      pctx.shadowOffsetX = nx * 12;
      pctx.shadowOffsetY = ny * 12;
      pctx.fill();

      pctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      pctx.lineWidth = 2.5;
      pctx.stroke();

      pctx.restore();
      pctx.restore();
    }

    let isPeeling = false;
    let peelAnimId = null;

    function setCornerVisibility(visible) {
      const corners = document.querySelectorAll('.easter-egg-peel');
      corners.forEach(c => {
        c.style.visibility = visible ? '' : 'hidden';
      });
    }

    function runPeelTransition(direction) {
      if (isPeeling) return;
      isPeeling = true;

      resizePeelCanvas();
      peelCanvas.classList.add('animating');
      setCornerVisibility(false);

      if (direction === 'backward') {
        tccOverlay.classList.remove('active');
        tccOverlay.setAttribute('aria-hidden', 'true');
      }

      const duration = 650;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        let progress = Math.min(elapsed / duration, 1);
        if (direction === 'backward') {
          progress = 1 - progress;
        }

        renderPeelFrame(progress);

        if ((direction === 'forward' && progress < 1) || (direction === 'backward' && progress > 0)) {
          peelAnimId = requestAnimationFrame(tick);
        } else {
          isPeeling = false;
          peelCanvas.classList.remove('animating');
          pctx.clearRect(0, 0, peelCanvas.width, peelCanvas.height);

          if (direction === 'forward') {
            tccOverlay.classList.add('active');
            tccOverlay.setAttribute('aria-hidden', 'false');
            tccOverlay.scrollTop = 0;
            try {
              history.pushState({ page: 'tcc' }, '', 'projeto-tcc.html');
              document.title = tccTitle;
            } catch (err) {}
          } else {
            setCornerVisibility(true);
            try {
              history.pushState(null, '', originalPath);
              document.title = originalTitle;
            } catch (err) {}
          }
        }
      }

      peelAnimId = requestAnimationFrame(tick);
    }

    peelLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        runPeelTransition('forward');
      });
    });

    tccOverlay.addEventListener('click', (e) => {
      const backBtn = e.target.closest('.tcc-back-btn');
      if (backBtn) {
        e.preventDefault();
        e.stopPropagation();
        runPeelTransition('backward');
      }
    });

    window.addEventListener('popstate', () => {
      if (tccOverlay.classList.contains('active')) {
        runPeelTransition('backward');
      }
    });
  }

  // ==========================================
  // ONDAS DO LOGO R: RECOLHIMENTO E FADE SUAVE NO SCROLL
  // ==========================================
  function initHeaderWavesScroll() {
    const setupWavesScroll = (svgEl, scrollContainer = window) => {
      const wavesGroup = svgEl.querySelector('.header-waves-group');
      if (!wavesGroup) return;

      wavesGroup.style.transformOrigin = '660.95px 107.56px';

      let ticking = false;
      const maxScroll = 120; // 120px de scroll para recolher 100%

      const handleScroll = () => {
        const scrollY = (scrollContainer === window)
          ? (window.scrollY || window.pageYOffset || 0)
          : (scrollContainer.scrollTop || 0);
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

        // Base scale reduzida em 30% (de 1.0 para 0.70)
        // Recolhe suavemente em direção ao centro da letra R (de 0.70 a 0.084)
        const baseScale = 0.70;
        const scale = baseScale * (1 - (progress * 0.88));
        // Diminui e some suavemente (de 1.0 a 0.0)
        const opacity = Math.max(0, 1 - progress * 1.15);

        wavesGroup.style.transform = `scale(${scale.toFixed(3)})`;
        wavesGroup.style.opacity = opacity.toFixed(3);
        wavesGroup.style.visibility = progress >= 1 ? 'hidden' : 'visible';

        ticking = false;
      };

      scrollContainer.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(handleScroll);
          ticking = true;
        }
      }, { passive: true });

      // Aplica imediatamente caso a página seja recarregada já com scroll
      handleScroll();
    };

    // 1. Conecta todos os SVGs inline de logo no documento
    const inlineSvgs = document.querySelectorAll('.header-logo-link svg.header-logo-r');
    inlineSvgs.forEach(svg => {
      const overlayParent = svg.closest('.tcc-project-overlay');
      setupWavesScroll(svg, overlayParent || window);
    });

    // 2. Se houver <img>, converte para SVG inline para controle do grupo de ondas
    const imgLogos = document.querySelectorAll('.header-logo-link img.header-logo-r');
    imgLogos.forEach(imgLogo => {
      if (imgLogo && imgLogo.src && imgLogo.src.includes('LOGOR_animated_negative.svg')) {
        fetch(imgLogo.src)
          .then(res => res.text())
          .then(svgText => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgText, 'image/svg+xml');
            const svg = doc.querySelector('svg');
            if (svg) {
              svg.setAttribute('class', 'header-logo-r');
              svg.setAttribute('id', 'header-logo-svg');
              svg.setAttribute('aria-label', 'Logo R Animado');
              const overlayParent = imgLogo.closest('.tcc-project-overlay');
              imgLogo.replaceWith(svg);
              setupWavesScroll(svg, overlayParent || window);
            }
          })
          .catch(err => console.warn('Não foi possível inlinar o SVG do logo:', err));
      }
    });
  }

  /* ==========================================================================
     CARROSSEL DE FOCO 3D / COVERFLOW (CARD CENTRAL EM DESTAQUE E LATERAIS ATRÁS)
     ========================================================================== */
  function initFocusCarousels() {
    const carousels = document.querySelectorAll('.focus-carousel');
    if (!carousels.length) return;

    carousels.forEach(carousel => {
      const cards = Array.from(carousel.querySelectorAll('.focus-carousel-card'));
      const prevBtns = carousel.querySelectorAll('.prev-btn, .stage-prev');
      const nextBtns = carousel.querySelectorAll('.next-btn, .stage-next');
      const counter = carousel.querySelector('.focus-carousel-counter');
      const dotsContainer = carousel.querySelector('.focus-carousel-dots');
      const total = cards.length;
      if (!total) return;

      let activeIndex = 0;

      // Cria indicadores (dots)
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        cards.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.className = `focus-carousel-dot ${idx === 0 ? 'active' : ''}`;
          dot.setAttribute('type', 'button');
          dot.setAttribute('aria-label', `Ir para slide ${idx + 1}`);
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            updateCarousel(idx);
          });
          dotsContainer.appendChild(dot);
        });
      }

      function updateCarousel(newIndex) {
        activeIndex = (newIndex + total) % total;

        // Atualiza contador textual (01 / 07)
        if (counter) {
          const curStr = String(activeIndex + 1).padStart(2, '0');
          const totStr = String(total).padStart(2, '0');
          counter.textContent = `${curStr} / ${totStr}`;
        }

        // Atualiza dots
        if (dotsContainer) {
          const dots = dotsContainer.querySelectorAll('.focus-carousel-dot');
          dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIndex);
          });
        }

        // Posiciona cada carta calculando a menor distância circular
        cards.forEach((card, i) => {
          let diff = i - activeIndex;
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          if (diff === 0) {
            card.setAttribute('data-pos', '0');
          } else if (diff === -1) {
            card.setAttribute('data-pos', '-1');
          } else if (diff === 1) {
            card.setAttribute('data-pos', '1');
          } else if (diff === -2) {
            card.setAttribute('data-pos', '-2');
          } else if (diff === 2) {
            card.setAttribute('data-pos', '2');
          } else {
            card.setAttribute('data-pos', 'hidden');
          }
        });
      }

      // Eventos de clique nas setas
      prevBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          updateCarousel(activeIndex - 1);
        });
      });

      nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          updateCarousel(activeIndex + 1);
        });
      });

      // Clique direto nas cartas laterais para rodar para ela
      cards.forEach((card, idx) => {
        card.addEventListener('click', (e) => {
          const pos = card.getAttribute('data-pos');
          if (pos === '-1') {
            e.stopPropagation();
            updateCarousel(activeIndex - 1);
          } else if (pos === '1') {
            e.stopPropagation();
            updateCarousel(activeIndex + 1);
          }
        });
      });

      // Suporte a swipe por toque
      let touchStartX = 0;
      let touchEndX = 0;
      const stage = carousel.querySelector('.focus-carousel-stage');
      if (stage) {
        stage.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        stage.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const delta = touchEndX - touchStartX;
          if (Math.abs(delta) > 35) {
            if (delta > 0) {
              updateCarousel(activeIndex - 1);
            } else {
              updateCarousel(activeIndex + 1);
            }
          }
        }, { passive: true });
      }

      // Inicializa na posição 0
      updateCarousel(0);
    });
  }

  /* ==========================================================================
     CARROSSEIS DE COMPARAÇÃO ANTES & DEPOIS (CPFL SOLUÇÕES)
     ========================================================================== */
  function initComparisonCarousels() {
    const cards = document.querySelectorAll('.cpfl-ba-card');
    if (!cards.length) return;

    cards.forEach(card => {
      const slides = card.querySelectorAll('.cpfl-ba-slide');
      const prevBtn = card.querySelector('.comp-prev');
      const nextBtn = card.querySelector('.comp-next');
      const counter = card.querySelector('.cpfl-ba-counter');
      const dotsContainer = card.querySelector('.cpfl-ba-dots');
      const total = slides.length;
      if (!total) return;

      let current = 0;

      // Cria os dots
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.className = `cpfl-ba-dot ${idx === 0 ? 'active' : ''}`;
          dot.type = 'button';
          dot.setAttribute('aria-label', `Slide ${idx + 1}`);
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(idx);
          });
          dotsContainer.appendChild(dot);
        });
      }

      function goToSlide(newIdx) {
        current = (newIdx + total) % total;
        slides.forEach((s, idx) => {
          s.classList.toggle('active', idx === current);
        });
        if (counter) {
          counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
        }
        if (dotsContainer) {
          const dots = dotsContainer.querySelectorAll('.cpfl-ba-dot');
          dots.forEach((d, idx) => {
            d.classList.toggle('active', idx === current);
          });
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          goToSlide(current - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          goToSlide(current + 1);
        });
      }

      // Suporte a swipe
      let startX = 0;
      const viewport = card.querySelector('.cpfl-ba-viewport');
      if (viewport) {
        viewport.addEventListener('touchstart', (e) => {
          startX = e.changedTouches[0].screenX;
        }, { passive: true });
        viewport.addEventListener('touchend', (e) => {
          const endX = e.changedTouches[0].screenX;
          if (endX - startX > 35) goToSlide(current - 1);
          if (startX - endX > 35) goToSlide(current + 1);
        }, { passive: true });
      }

      goToSlide(0);
    });
  }

  initFocusCarousels();
  initComparisonCarousels();
  initHeaderWavesScroll();
});
