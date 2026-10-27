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
          alert('Mensagem enviada com sucesso! Em breve Renan W. Santana (Ren-San) entrará em contato.');
          contactForm.reset();
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
            <img src="assets/LOGOR_animated_negative.svg" alt="Logo R Animado" class="header-logo-r">
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
    const setupWavesScroll = (svgEl) => {
      const wavesGroup = svgEl.querySelector('.header-waves-group');
      if (!wavesGroup) return;

      wavesGroup.style.transformOrigin = '660.95px 107.56px';

      let ticking = false;
      const maxScroll = 120; // 120px de scroll para recolher 100%

      const handleScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

        // Recolhe suavemente em direção ao centro da letra R (de 1.0 a 0.12)
        const scale = 1 - (progress * 0.88);
        // Diminui e some suavemente (de 1.0 a 0.0)
        const opacity = Math.max(0, 1 - progress * 1.15);

        wavesGroup.style.transform = `scale(${scale.toFixed(3)})`;
        wavesGroup.style.opacity = opacity.toFixed(3);
        wavesGroup.style.visibility = progress >= 1 ? 'hidden' : 'visible';

        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(handleScroll);
          ticking = true;
        }
      }, { passive: true });

      // Aplica imediatamente caso a página seja recarregada já com scroll
      handleScroll();
    };

    // 1. Se o SVG já estiver inline no header
    const inlineSvg = document.querySelector('.header-logo-link svg.header-logo-r');
    if (inlineSvg) {
      setupWavesScroll(inlineSvg);
      return;
    }

    // 2. Se for <img>, converte para SVG inline para permitir o controle do grupo de ondas
    const imgLogo = document.querySelector('.header-logo-link img.header-logo-r');
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
            imgLogo.replaceWith(svg);
            setupWavesScroll(svg);
          }
        })
        .catch(err => console.warn('Não foi possível inlinar o SVG do logo:', err));
    }
  }

  initHeaderWavesScroll();
});
