import os
import re
import json
import xml.etree.ElementTree as ET

folder = os.path.dirname(os.path.abspath(__file__))

angles_config = [
    (0,    '0.svg',                           'Frente (0°)',                  'Frente',               '0deg'),
    (15,   'Generative Object (15, 0).svg',   '15° Direita',                  'Frontal Direito',      '15deg'),
    (30,   'Generative Object (30, 0).svg',   '30° Direita',                  'Frontal Direito',      '30deg'),
    (45,   'Generative Object (45, 0).svg',   '45° 3/4 Direita',              '3/4 Frontal Direito',  '45deg'),
    (60,   'Generative Object (60, 0).svg',   '60° Direita',                  '3/4 Frontal Direito',  '60deg'),
    (75,   'Generative Object (75, 0).svg',   '75° Direita',                  'Quase Perfil Direito', '75deg'),
    (90,   'Generative Object (90, 0).svg',   '90° Perfil Direito',           'Perfil Direito',       '90deg'),
    (105,  'Generative Object (105, 0).svg',  '105° Trás-Direita',            '3/4 Traseiro Direito', '105deg'),
    (120,  'Generative Object (120, 0).svg',  '120° Trás-Direita',            '3/4 Traseiro Direito', '120deg'),
    (135,  'Generative Object (135, 0).svg',  '135° Costas 3/4 Dir',          '3/4 Traseiro Direito', '135deg'),
    (150,  'Generative Object (150, 0).svg',  '150° Costas Dir',              'Quase Costas',         '150deg'),
    (165,  'Generative Object (165, 0).svg',  '165° Costas Dir',              'Quase Costas',         '165deg'),
    (180,  'Generative Object (180, 0).svg',  '180° Costas',                  'Costas',               '180deg'),
    (-165, 'Generative Object (-165, 0).svg', '195° Costas Esq (-165°)',      'Quase Costas',         '195deg'),
    (-150, 'Generative Object (-150, 0).svg', '210° Costas Esq (-150°)',      'Quase Costas',         '210deg'),
    (-135, 'Generative Object (-135, 0).svg', '225° Costas 3/4 Esq (-135°)',  '3/4 Traseiro Esquerdo','225deg'),
    (-120, 'Generative Object (-120, 0).svg', '240° Trás-Esq (-120°)',        '3/4 Traseiro Esquerdo','240deg'),
    (-105, 'Generative Object (-105, 0).svg', '255° Trás-Esq (-105°)',        '3/4 Traseiro Esquerdo','255deg'),
    (-90,  'Generative Object (-90, 0).svg',  '270° Perfil Esquerdo (-90°)',  'Perfil Esquerdo',      '270deg'),
    (-75,  'Generative Object (-75, 0).svg',  '285° Esquerda (-75°)',         'Quase Perfil Esquerdo','285deg'),
    (-60,  'Generative Object (-60, 0).svg',  '300° Esquerda (-60°)',         '3/4 Frontal Esquerdo', '300deg'),
    (-45,  'Generative Object (-45, 0).svg',  '315° 3/4 Esquerda (-45°)',     '3/4 Frontal Esquerdo', '315deg'),
    (-30,  'Generative Object (-30, 0).svg',  '330° Esquerda (-30°)',         'Frontal Esquerdo',     '330deg'),
    (-15,  'Generative Object (-15, 0).svg',  '345° Esquerda (-15°)',         'Frontal Esquerdo',     '345deg'),
]

frames_meta = []
frames_dom = []

for i, (deg, fname, title, view_name, deg_str) in enumerate(angles_config):
    with open(os.path.join(folder, fname)) as fp:
        c = fp.read()
    
    vb_match = re.search(r'viewBox=\"0 0 ([0-9\.]+) ([0-9\.]+)\"', c)
    vw, vh = float(vb_match.group(1)), float(vb_match.group(2))
    
    c = re.sub(r'<\?xml.*?\?>', '', c)
    c = re.sub(r'<metadata.*?</metadata>', '', c, flags=re.DOTALL)
    c = re.sub(r'<defs>.*?</defs>', '', c, flags=re.DOTALL)
    
    if deg == 0:
        c = c.replace('class="cls-1"', 'stroke="var(--avatar-color, #000000)" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" fill="var(--avatar-color, #000000)"')
        c = c.replace('class="cls-2"', 'stroke="var(--avatar-color, #000000)" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.39" fill="none"')
        c = c.replace('class="cls-3"', 'stroke="var(--avatar-color, #000000)" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.38" fill="none"')
        c = c.replace('class="cls-4"', 'stroke="var(--avatar-color, #000000)" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" fill="none"')
    
    root = ET.fromstring(c)
    inner_xml = ''.join(ET.tostring(child, encoding='unicode') for child in root)
    inner_xml = inner_xml.replace('xmlns="http://www.w3.org/2000/svg"', '').replace('xmlns:c2pa="http://c2pa.org/manifest"', '')
    
    active_cls = ' active' if i == 0 else ''
    
    frame_svg = f'''<svg id="frame-svg-{i}" class="avatar-frame-svg{active_cls}" viewBox="0 0 {vw} {vh}" preserveAspectRatio="xMidYMid meet">
      {inner_xml}
    </svg>'''
    frames_dom.append(frame_svg)
    
    frames_meta.append({
        'index': i,
        'deg': deg,
        'degStr': deg_str,
        'title': title,
        'view': view_name,
        'file': fname,
        'width': vw,
        'height': vh
    })

frames_dom_str = '\n'.join(frames_dom)
frames_json = json.dumps(frames_meta, ensure_ascii=False)

html_content = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Avatar 360° Turntable • Visualizador & Animador</title>
  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-panel: rgba(18, 24, 38, 0.82);
      --bg-card: rgba(255, 255, 255, 0.04);
      --border-panel: rgba(255, 255, 255, 0.1);
      --border-focus: #00d2ff;
      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
      --accent: #00d2ff;
      --accent-glow: rgba(0, 210, 255, 0.35);
      --accent-gradient: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
      --pedestal-glow: rgba(0, 0, 0, 0.08);
      --avatar-color: #000000;
      --stage-bg: radial-gradient(circle at 50% 50%, #ffffff 0%, #e2e8f0 75%, #cbd5e1 100%);
      --stage-border: rgba(255, 255, 255, 0.15);
    }

    [data-theme="dark"] {
      --bg-main: #0b0f19;
      --bg-panel: rgba(18, 24, 38, 0.85);
      --avatar-color: #ffffff;
      --pedestal-glow: rgba(0, 210, 255, 0.25);
      --stage-bg: radial-gradient(circle at 50% 50%, #1e293b 0%, #0b0f19 80%);
      --stage-border: rgba(0, 210, 255, 0.2);
    }

    [data-theme="light"] {
      --bg-main: #f1f5f9;
      --bg-panel: rgba(255, 255, 255, 0.92);
      --bg-card: rgba(0, 0, 0, 0.03);
      --border-panel: rgba(0, 0, 0, 0.08);
      --border-focus: #0284c7;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --accent: #0284c7;
      --accent-glow: rgba(2, 132, 199, 0.25);
      --accent-gradient: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      --pedestal-glow: rgba(0, 0, 0, 0.06);
      --avatar-color: #0f172a;
      --stage-bg: radial-gradient(circle at 50% 50%, #ffffff 0%, #f1f5f9 85%);
      --stage-border: rgba(0, 0, 0, 0.08);
    }

    [data-theme="cyber"] {
      --bg-main: #060810;
      --bg-panel: rgba(13, 17, 30, 0.9);
      --bg-card: rgba(0, 255, 204, 0.03);
      --border-panel: rgba(0, 255, 204, 0.2);
      --border-focus: #00ffcc;
      --text-main: #e0fff9;
      --text-muted: #6ee7b7;
      --accent: #00ffcc;
      --accent-glow: rgba(0, 255, 204, 0.4);
      --accent-gradient: linear-gradient(135deg, #00ffcc 0%, #0099ff 100%);
      --pedestal-glow: rgba(0, 255, 204, 0.3);
      --avatar-color: #00ffcc;
      --stage-bg: radial-gradient(circle at 50% 50%, #0d1a2d 0%, #060810 85%);
      --stage-border: rgba(0, 255, 204, 0.3);
    }

    [data-theme="grid"] {
      --avatar-color: #ffffff;
      --stage-bg: repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 50% / 24px 24px;
      --stage-border: rgba(255, 255, 255, 0.2);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-main);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      user-select: none;
      transition: background-color 0.3s ease, color 0.3s ease;
      overflow-x: hidden;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 28px;
      background: var(--bg-panel);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-panel);
      z-index: 10;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-badge {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--accent-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 15px;
      color: #fff;
      box-shadow: 0 4px 12px var(--accent-glow);
    }

    .logo-title h1 {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }

    .logo-title span {
      font-size: 12px;
      color: var(--text-muted);
    }

    .header-badges {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-panel);
      color: var(--text-main);
    }

    .status-pill .indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 8px var(--accent);
    }

    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 24px;
      gap: 20px;
    }

    .stage-card {
      position: relative;
      background: var(--bg-panel);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-panel);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 28px 24px 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .stage-canvas-area {
      position: relative;
      width: 100%;
      height: 440px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--stage-bg);
      border-radius: 18px;
      border: 1px solid var(--stage-border);
      cursor: grab;
      overflow: hidden;
      transition: background 0.3s ease, border-color 0.3s ease;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .stage-canvas-area:active {
      cursor: grabbing;
    }

    .pedestal-ring {
      position: absolute;
      bottom: 45px;
      width: 320px;
      height: 75px;
      border-radius: 50%;
      background: radial-gradient(ellipse at center, var(--pedestal-glow) 0%, transparent 70%);
      border: 1px dashed var(--border-panel);
      pointer-events: none;
      transform: rotateX(60deg);
      transition: all 0.3s ease;
    }

    .pedestal-compass {
      position: absolute;
      bottom: 22px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: var(--text-muted);
      opacity: 0.6;
      pointer-events: none;
    }

    .avatar-viewport {
      position: relative;
      width: 330px;
      height: 330px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s ease-out;
    }

    .avatar-frame-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.16));
      pointer-events: none;
    }

    .avatar-frame-svg.active {
      display: block;
    }

    .avatar-frame-svg * {
      fill: var(--avatar-color, #000000);
      stroke: var(--avatar-color, #000000);
    }
    .avatar-frame-svg [fill="none"] {
      fill: none !important;
    }
    .avatar-frame-svg [stroke="none"] {
      stroke: none !important;
    }

    .stage-hud {
      position: absolute;
      top: 20px;
      left: 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      pointer-events: none;
      z-index: 5;
    }

    .hud-angle {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -1px;
      color: var(--accent);
      text-shadow: 0 0 20px var(--accent-glow);
    }

    .hud-desc {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .stage-hint {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 12px;
      padding: 6px 14px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      color: #cbd5e1;
      border: 1px solid var(--border-panel);
      z-index: 5;
    }

    /* Scrubber Section - O SLIDE PRA CORRER */
    .scrubber-section {
      width: 100%;
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .slider-container {
      position: relative;
      width: 100%;
      padding: 10px 0;
    }

    input[type="range"] {
      -webkit-appearance: none;
      width: 100%;
      height: 12px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      outline: none;
      cursor: pointer;
      position: relative;
      z-index: 2;
    }

    [data-theme="light"] input[type="range"] {
      background: #cbd5e1;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #ffffff;
      border: 3px solid var(--accent);
      box-shadow: 0 0 16px var(--accent-glow), 0 3px 6px rgba(0, 0, 0, 0.35);
      cursor: grab;
      transition: transform 0.1s ease, border-color 0.2s ease;
    }

    input[type="range"]::-webkit-slider-thumb:active {
      cursor: grabbing;
      transform: scale(1.2);
    }

    .slider-progress-bar {
      position: absolute;
      top: 14px;
      left: 0;
      height: 12px;
      border-radius: 6px;
      background: var(--accent-gradient);
      pointer-events: none;
      z-index: 1;
    }

    .slider-ticks {
      display: flex;
      justify-content: space-between;
      padding: 0 4px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .slider-tick {
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 4px;
      transition: color 0.15s ease;
    }

    .slider-tick:hover, .slider-tick.active {
      color: var(--accent);
    }

    .preset-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-top: 6px;
    }

    .chip-btn {
      padding: 6px 14px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-panel);
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .chip-btn:hover {
      color: var(--text-main);
      border-color: var(--accent);
      background: rgba(0, 210, 255, 0.08);
    }

    .chip-btn.active {
      color: #fff;
      background: var(--accent-gradient);
      border-color: transparent;
      box-shadow: 0 4px 12px var(--accent-glow);
    }

    .controls-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      width: 100%;
    }

    .panel-card {
      background: var(--bg-panel);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-panel);
      border-radius: 20px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-panel);
      padding-bottom: 10px;
    }

    .btn-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-main {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 18px;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 700;
      background: var(--accent-gradient);
      color: #ffffff;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px var(--accent-glow);
      transition: all 0.2s ease;
    }

    .btn-main:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px var(--accent-glow);
    }

    .btn-main:active {
      transform: translateY(0);
    }

    .btn-secondary {
      padding: 12px 16px;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-panel);
      color: var(--text-main);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      border-color: var(--border-focus);
      background: rgba(255, 255, 255, 0.08);
    }

    .control-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      font-size: 13px;
    }

    .control-row label {
      font-weight: 600;
      color: var(--text-main);
    }

    .control-val {
      font-weight: 700;
      color: var(--accent);
      min-width: 45px;
      text-align: right;
    }

    .speed-slider {
      flex: 1;
      margin: 0 10px;
    }

    .swatches-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .swatch {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid var(--border-panel);
      cursor: pointer;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .swatch:hover, .swatch.active {
      transform: scale(1.2);
      border-color: #ffffff;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }

    .color-picker-wrapper {
      position: relative;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid var(--border-panel);
      cursor: pointer;
    }

    .color-picker-wrapper input[type="color"] {
      position: absolute;
      top: -10px;
      left: -10px;
      width: 50px;
      height: 50px;
      cursor: pointer;
      border: none;
    }

    .export-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .export-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-panel);
      color: var(--text-main);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .export-btn:hover {
      border-color: var(--accent);
      background: rgba(0, 210, 255, 0.08);
      color: var(--accent);
    }

    footer {
      margin-top: auto;
      padding: 16px 28px;
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      border-top: 1px solid var(--border-panel);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .kbd-list {
      display: flex;
      gap: 12px;
    }

    kbd {
      padding: 2px 6px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid var(--border-panel);
      font-family: inherit;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-main);
    }

    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #0f172a;
      color: #fff;
      padding: 12px 24px;
      border-radius: 30px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      border: 1px solid var(--border-focus);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
      z-index: 100;
    }

    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  </style>
</head>
<body>

  <header>
    <div class="logo-area">
      <div class="logo-badge">360°</div>
      <div class="logo-title">
        <h1>Avatar Turntable 360°</h1>
        <span>Visualizador & Controlador de Vetor</span>
      </div>
    </div>

    <div class="header-badges">
      <div class="status-pill">
        <span class="indicator"></span>
        <span id="badge-angle">0° (Frente)</span>
      </div>
      <div class="status-pill">
        <span id="badge-frame">Frame 1 / 24</span>
      </div>
    </div>
  </header>

  <main>
    <div class="stage-card">
      <div class="stage-hud">
        <div class="hud-angle" id="hud-angle-val">0°</div>
        <div class="hud-desc" id="hud-view-desc">Frente (Vista Frontal)</div>
      </div>

      <div class="stage-hint">
        🖱️ Arraste o avatar para girar 360°
      </div>

      <div class="stage-canvas-area" id="stage-area">
        <div class="pedestal-ring"></div>
        <div class="pedestal-compass">FRENTE • 0°</div>
        
        <div class="avatar-viewport" id="avatar-viewport">
""" + frames_dom_str + """
        </div>
      </div>

      <!-- SLIDER PRA CORRER (Scrubber) -->
      <div class="scrubber-section">
        <div class="slider-container">
          <div class="slider-progress-bar" id="slider-progress"></div>
          <input type="range" id="angle-slider" min="0" max="360" step="1" value="0" />
        </div>

        <div class="slider-ticks">
          <span class="slider-tick active" data-angle="0">0° Frente</span>
          <span class="slider-tick" data-angle="45">45°</span>
          <span class="slider-tick" data-angle="90">90° Dir</span>
          <span class="slider-tick" data-angle="135">135°</span>
          <span class="slider-tick" data-angle="180">180° Costas</span>
          <span class="slider-tick" data-angle="225">225°</span>
          <span class="slider-tick" data-angle="270">270° Esq</span>
          <span class="slider-tick" data-angle="315">315°</span>
          <span class="slider-tick" data-angle="360">360°</span>
        </div>

        <div class="preset-chips">
          <button class="chip-btn active" data-angle="0">Frente (0°)</button>
          <button class="chip-btn" data-angle="45">3/4 Dir (45°)</button>
          <button class="chip-btn" data-angle="90">Perfil Dir (90°)</button>
          <button class="chip-btn" data-angle="135">Trás Dir (135°)</button>
          <button class="chip-btn" data-angle="180">Costas (180°)</button>
          <button class="chip-btn" data-angle="225">Trás Esq (225°)</button>
          <button class="chip-btn" data-angle="270">Perfil Esq (270°)</button>
          <button class="chip-btn" data-angle="315">3/4 Esq (315°)</button>
        </div>
      </div>
    </div>

    <div class="controls-grid">
      <div class="panel-card">
        <div class="panel-header">
          <span>Reprodução & Giro</span>
          <span id="play-mode-label">Loop Contínuo</span>
        </div>

        <div class="btn-row">
          <button class="btn-secondary" id="btn-prev" title="Girar 15° para a esquerda">◀ -15°</button>
          <button class="btn-main" id="btn-play">
            <span id="play-icon">►</span>
            <span id="play-text">Girar 360°</span>
          </button>
          <button class="btn-secondary" id="btn-next" title="Girar 15° para a direita">+15° ▶</button>
        </div>

        <div class="control-row">
          <label for="speed-slider">Velocidade (FPS):</label>
          <input type="range" class="speed-slider" id="speed-slider" min="2" max="30" value="14" />
          <span class="control-val" id="speed-val">14 fps</span>
        </div>

        <div class="btn-row">
          <button class="btn-secondary" style="flex: 1;" id="btn-direction">↻ Horário</button>
          <button class="btn-secondary" style="flex: 1;" id="btn-yoyo">Modo: 360° Loop</button>
          <button class="btn-secondary" id="btn-reset-zoom" title="Resetar zoom">🔍 100%</button>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <span>Aparência & Cenário</span>
          <span>Personalizar</span>
        </div>

        <div class="control-row">
          <label>Cor do Avatar:</label>
          <div class="swatches-row">
            <div class="swatch active" style="background: #000000;" data-color="#000000" title="Preto Original"></div>
            <div class="swatch" style="background: #ffffff;" data-color="#ffffff" title="Branco"></div>
            <div class="swatch" style="background: #00d2ff;" data-color="#00d2ff" title="Ciano Neon"></div>
            <div class="swatch" style="background: #00ff87;" data-color="#00ff87" title="Verde Neon"></div>
            <div class="swatch" style="background: #a855f7;" data-color="#a855f7" title="Roxo Elétrico"></div>
            <div class="color-picker-wrapper" title="Cor Personalizada">
              <input type="color" id="custom-color" value="#000000" />
            </div>
          </div>
        </div>

        <div class="control-row">
          <label>Cenário do Palco:</label>
          <div class="btn-row" style="flex: 1; justify-content: flex-end;">
            <button class="chip-btn active" data-theme-btn="studio">💡 Estúdio</button>
            <button class="chip-btn" data-theme-btn="dark">🌑 Escuro</button>
            <button class="chip-btn" data-theme-btn="light">☀️ Claro</button>
            <button class="chip-btn" data-theme-btn="cyber">⚡ Cyber</button>
            <button class="chip-btn" data-theme-btn="grid">🏁 Grid</button>
          </div>
        </div>

        <div class="control-row">
          <label>Zoom do Avatar:</label>
          <input type="range" class="speed-slider" id="zoom-slider" min="50" max="200" value="100" />
          <span class="control-val" id="zoom-val">100%</span>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <span>Exportação & Arquivos</span>
          <span>Download</span>
        </div>

        <div class="export-grid">
          <a class="export-btn" href="avatar_animated.svg" download="avatar_animated.svg" title="Baixar arquivo SVG com animação 360 integrada">
            ⚡ SVG Animado
          </a>
          <a class="export-btn" href="avatar_animated.gif" download="avatar_animated.gif" title="Baixar GIF 360 universal">
            🎞️ GIF 360°
          </a>
          <a class="export-btn" href="avatar_animated.png" download="avatar_animated.png" title="Baixar APNG com transparência">
            🖼️ APNG Transp.
          </a>
          <a class="export-btn" href="avatar_interactive.svg" download="avatar_interactive.svg" title="Baixar SVG com slider interativo embutido">
            🎛️ SVG com Slider
          </a>
        </div>

        <div class="btn-row">
          <button class="btn-secondary" style="flex: 1;" id="btn-download-frame">💾 Baixar Frame Atual (.svg)</button>
          <button class="btn-secondary" style="flex: 1;" id="btn-copy-code">📋 Copiar Código Embed</button>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <div class="kbd-list">
      <span>Atalhos:</span>
      <span><kbd>Espaço</kbd> Play / Pausa</span>
      <span><kbd>←</kbd> <kbd>→</kbd> Girar 15°</span>
      <span><kbd>R</kbd> Resetar</span>
    </div>
    <div>24 Quadros • Rotação 360° Completa • Vetores Nativos SVG</div>
  </footer>

  <div class="toast" id="toast">Mensagem copiada!</div>

  <script>
    const framesData = """ + frames_json + """;
    const totalFrames = framesData.length;

    const slider = document.getElementById('angle-slider');
    const sliderProgress = document.getElementById('slider-progress');
    const hudAngle = document.getElementById('hud-angle-val');
    const hudDesc = document.getElementById('hud-view-desc');
    const badgeAngle = document.getElementById('badge-angle');
    const badgeFrame = document.getElementById('badge-frame');
    const btnPlay = document.getElementById('btn-play');
    const playIcon = document.getElementById('play-icon');
    const playText = document.getElementById('play-text');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnDir = document.getElementById('btn-direction');
    const btnYoyo = document.getElementById('btn-yoyo');
    const speedSlider = document.getElementById('speed-slider');
    const speedVal = document.getElementById('speed-val');
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomVal = document.getElementById('zoom-val');
    const btnResetZoom = document.getElementById('btn-reset-zoom');
    const avatarViewport = document.getElementById('avatar-viewport');
    const stageArea = document.getElementById('stage-area');
    const toast = document.getElementById('toast');

    let currentAngle = 0;
    let currentFrameIdx = 0;
    let isPlaying = false;
    let playTimer = null;
    let playSpeedFps = 14;
    let playDirection = 1;
    let isYoyo = false;
    let yoyoDir = 1;
    let zoomLevel = 1.0;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartAngle = 0;

    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function updateFrame(deg) {
      deg = (deg % 360 + 360) % 360;
      currentAngle = deg;

      const frameIdx = Math.round(deg / 15) % totalFrames;
      currentFrameIdx = frameIdx;
      const meta = framesData[frameIdx];

      for (let i = 0; i < totalFrames; i++) {
        const el = document.getElementById('frame-svg-' + i);
        if (el) {
          if (i === frameIdx) el.classList.add('active');
          else el.classList.remove('active');
        }
      }

      slider.value = Math.round(deg);
      const pct = (deg / 360) * 100;
      sliderProgress.style.width = pct + '%';

      hudAngle.textContent = Math.round(deg) + '°';
      hudDesc.textContent = meta.title + ' • ' + meta.view;
      badgeAngle.textContent = Math.round(deg) + '° (' + meta.view + ')';
      badgeFrame.textContent = 'Frame ' + (frameIdx + 1) + ' / ' + totalFrames;

      document.querySelectorAll('.preset-chips .chip-btn, .slider-ticks .slider-tick').forEach(btn => {
        const a = parseInt(btn.dataset.angle, 10);
        if (Math.abs(a - deg) < 8 || (a === 360 && deg >= 352)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    slider.addEventListener('input', (e) => {
      pause();
      updateFrame(parseFloat(e.target.value));
    });

    document.querySelectorAll('[data-angle]').forEach(el => {
      el.addEventListener('click', () => {
        pause();
        const a = parseInt(el.dataset.angle, 10);
        updateFrame(a % 360);
      });
    });

    function onPointerDown(e) {
      pause();
      isDragging = true;
      dragStartX = e.touches ? e.touches[0].clientX : e.clientX;
      dragStartAngle = currentAngle;
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchend', onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      if (e.cancelable && e.preventDefault) e.preventDefault();
      const currentX = e.touches ? e.touches[0].clientX : e.clientX;
      const deltaX = currentX - dragStartX;
      const sensitivity = 0.8;
      const newAngle = dragStartAngle + deltaX * sensitivity;
      updateFrame(newAngle);
    }

    function onPointerUp() {
      isDragging = false;
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
    }

    stageArea.addEventListener('mousedown', onPointerDown);
    stageArea.addEventListener('touchstart', onPointerDown, { passive: true });

    function play() {
      if (isPlaying) return;
      isPlaying = true;
      playIcon.textContent = '❚❚';
      playText.textContent = 'Pausar';
      btnPlay.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';

      const intervalMs = 1000 / playSpeedFps;
      playTimer = setInterval(() => {
        if (isYoyo) {
          let nextDeg = currentAngle + (15 * yoyoDir);
          if (nextDeg >= 360) {
            nextDeg = 360;
            yoyoDir = -1;
          } else if (nextDeg <= 0) {
            nextDeg = 0;
            yoyoDir = 1;
          }
          updateFrame(nextDeg);
        } else {
          updateFrame(currentAngle + (15 * playDirection));
        }
      }, intervalMs);
    }

    function pause() {
      if (!isPlaying) return;
      isPlaying = false;
      clearInterval(playTimer);
      playTimer = null;
      playIcon.textContent = '►';
      playText.textContent = 'Girar 360°';
      btnPlay.style.background = '';
    }

    function togglePlay() {
      if (isPlaying) pause();
      else play();
    }

    btnPlay.addEventListener('click', togglePlay);

    btnPrev.addEventListener('click', () => {
      pause();
      updateFrame(currentAngle - 15);
    });

    btnNext.addEventListener('click', () => {
      pause();
      updateFrame(currentAngle + 15);
    });

    btnDir.addEventListener('click', () => {
      playDirection *= -1;
      btnDir.textContent = playDirection === 1 ? '↻ Horário' : '↺ Anti-horário';
    });

    btnYoyo.addEventListener('click', () => {
      isYoyo = !isYoyo;
      btnYoyo.textContent = isYoyo ? 'Modo: Vai-e-Volta' : 'Modo: 360° Loop';
      document.getElementById('play-mode-label').textContent = isYoyo ? 'Vai-e-Volta' : 'Loop Contínuo';
    });

    speedSlider.addEventListener('input', (e) => {
      playSpeedFps = parseInt(e.target.value, 10);
      speedVal.textContent = playSpeedFps + ' fps';
      if (isPlaying) {
        pause();
        play();
      }
    });

    function applyZoom(z) {
      zoomLevel = z;
      zoomVal.textContent = Math.round(z * 100) + '%';
      zoomSlider.value = Math.round(z * 100);
      avatarViewport.style.transform = 'scale(' + z + ')';
    }

    zoomSlider.addEventListener('input', (e) => {
      applyZoom(parseInt(e.target.value, 10) / 100);
    });

    btnResetZoom.addEventListener('click', () => applyZoom(1.0));

    stageArea.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY * -0.0015;
      const newZoom = Math.min(2.5, Math.max(0.4, zoomLevel + delta));
      applyZoom(newZoom);
    }, { passive: false });

    function setAvatarColor(color) {
      document.documentElement.style.setProperty('--avatar-color', color);
    }

    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-theme-btn]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const theme = btn.dataset.themeBtn;
        if (theme === 'studio') {
          document.body.removeAttribute('data-theme');
          setAvatarColor('#000000');
        } else {
          document.body.setAttribute('data-theme', theme);
          if (theme === 'dark' || theme === 'grid') setAvatarColor('#ffffff');
          else if (theme === 'light') setAvatarColor('#0f172a');
          else if (theme === 'cyber') setAvatarColor('#00ffcc');
        }
      });
    });

    document.querySelectorAll('.swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        setAvatarColor(sw.dataset.color);
      });
    });

    const customColor = document.getElementById('custom-color');
    customColor.addEventListener('input', (e) => {
      document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      setAvatarColor(e.target.value);
    });

    document.getElementById('btn-download-frame').addEventListener('click', () => {
      const meta = framesData[currentFrameIdx];
      const link = document.createElement('a');
      link.href = encodeURI(meta.file);
      link.download = 'avatar_' + meta.degStr + '.svg';
      link.click();
      showToast('Baixando frame ' + meta.degStr + ' (' + meta.file + ')');
    });

    document.getElementById('btn-copy-code').addEventListener('click', () => {
      const code = '<img src="avatar_animated.svg" width="300" height="300" alt="Avatar 360" />';
      navigator.clipboard.writeText(code).then(() => {
        showToast('Código HTML copiado para a área de transferência!');
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        pause();
        updateFrame(currentAngle - 15);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        pause();
        updateFrame(currentAngle + 15);
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        pause();
        applyZoom(1.0);
        updateFrame(0);
      }
    });

    updateFrame(0);
  </script>
</body>
</html>"""

index_path = os.path.join(folder, 'index.html')
with open(index_path, 'w', encoding='utf-8') as fp:
    fp.write(html_content)

viewer_path = os.path.join(folder, 'viewer.html')
with open(viewer_path, 'w', encoding='utf-8') as fp:
    fp.write(html_content)

print(f'Done! Successfully updated {index_path} and {viewer_path}')
