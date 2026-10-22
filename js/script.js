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
  // EASTER EGG: TRANSIÇÃO PUXANDO A DOBRA E VIRANDO A PÁGINA
  // ==========================================
  const peelLinks = document.querySelectorAll('.easter-egg-peel .peel-link');
  if (peelLinks.length > 0) {
    let pageTurnOverlay = document.getElementById('pageTurnOverlay');
    if (!pageTurnOverlay) {
      pageTurnOverlay = document.createElement('div');
      pageTurnOverlay.id = 'pageTurnOverlay';
      pageTurnOverlay.className = 'page-turn-overlay';
      pageTurnOverlay.setAttribute('aria-hidden', 'true');
      pageTurnOverlay.innerHTML = `
        <div class="turn-yellow-reveal">
          <svg class="turn-central-spiral" viewBox="0 0 100 100" fill="none" stroke="#111111" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M 52,50 C 53,50 54,51 53,52 C 52,54 48,53 48,50 C 48,46 53,45 55,48 C 58,52 55,57 50,57 C 43,57 42,49 45,44 C 49,38 58,38 62,44 C 67,51 63,61 54,63 C 43,65 37,55 40,46 C 44,35 57,33 66,39 C 75,47 72,63 60,68 C 47,73 35,65 34,50 C 33,35 48,27 63,31 C 77,35 83,53 76,68 C 69,82 48,84 34,75 C 21,66 21,44 32,29"/>
          </svg>
          <div class="turn-caption">O Rei de Amarelo ✶ TCC</div>
        </div>
        <div class="turn-page-flap"></div>
      `;
      document.body.appendChild(pageTurnOverlay);
    }

    peelLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetUrl = link.getAttribute('href') || 'projeto-tcc.html';
        
        // Ativa a animação de puxar a dobra através da tela inteira
        pageTurnOverlay.classList.add('active');
        pageTurnOverlay.setAttribute('aria-hidden', 'false');

        // Aguarda a virada de página cobrir tudo em amarelo e navega para o TCC
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 980);
      });
    });

    // Reset em caso de retorno pelo botão Voltar (bfcache)
    window.addEventListener('pageshow', () => {
      if (pageTurnOverlay) {
        pageTurnOverlay.classList.remove('active');
        pageTurnOverlay.setAttribute('aria-hidden', 'true');
      }
    });
  }
});

