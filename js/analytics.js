// ==============================================================================
// GOOGLE ANALYTICS 4 (GA4) - RASTREAMENTO INVISÍVEL
// ==============================================================================
// Como usar:
// 1. Crie uma conta no Google Analytics (analytics.google.com) se ainda não tiver.
// 2. Crie uma propriedade para o seu site e pegue o "ID da Métrica" (ex: G-ABC1234567).
// 3. Substitua 'G-SEU_ID_AQUI' abaixo pelo seu ID real.
// O rastreamento roda 100% invisível em segundo plano, sem banners nem avisos visuais.
// ==============================================================================

(function () {
  const GA_MEASUREMENT_ID = 'G-GETJRG2BZR';

  // Se o ID ainda não foi configurado, não envia eventos de teste
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-SEU_ID_AQUI') {
    return;
  }

  // Injeta o script oficial do Google Tag de forma assíncrona
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gtagScript);

  // Inicializa o dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: true
  });
})();
