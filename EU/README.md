# 🔄 Avatar 360° • Animação & Visualizador Interativo

Todos os arquivos desta animação 360° foram gerados e organizados diretamente nesta pasta:
`/Users/renmac/Library/CloudStorage/GoogleDrive-rennsant.design@gmail.com/My Drive/ANTIGRAVITY/AVATAR/EU`

---

## 🚀 Como Visualizar e Interagir

### 1. `index.html` (ou `viewer.html`) — **Visualizador Interativo Principal**
Basta **dar dois cliques no arquivo `index.html`** para abrir no seu navegador (Chrome, Safari, Edge, Firefox). Não precisa de servidor nem internet.

**Recursos incluídos:**
- 🎚️ **Slider Interativo ("Slide pra correr"):** Arraste o slide de 0° a 360° para controlar a rotação do avatar com precisão instantânea.
- 🖱️ **Giro Direto (Turntable 3D):** Clique e arraste o mouse (ou deslize o dedo no trackpad/celular) diretamente sobre o avatar para girá-lo em 360°.
- ▶️ **Auto-Play 360°:** Botão de reprodução contínua (com atalho na **barra de espaço**).
- ⏱️ **Controle de Velocidade:** Ajuste de FPS (2 a 30 quadros por segundo) com reprodução suave.
- 🔄 **Direção & Modo:** Alternância entre sentido Horário / Anti-horário e modo 360° Contínuo vs Vai-e-Volta (Yoyo).
- 🎨 **Personalização de Cores e Cenário:**
  - Cor do avatar: Preto original, Branco, Ciano Neon, Verde Neon, Roxo ou Seletor Livre.
  - Cenários: Estúdio com holofote, Fundo Escuro, Fundo Claro, Cyberpunk e Grade Transparente (Grid).
- 🔍 **Zoom & Reset:** Controle de zoom de 50% a 200% ou roda do mouse (scroll).
- ⌨️ **Atalhos de Teclado:**
  - `Espaço`: Play / Pausar
  - `←` / `→`: Girar quadro a quadro (passos de 15°)
  - `R`: Resetar para 0° e zoom padrão

---

## 📦 Arquivos Gerados de Animação

| Arquivo | Formato | Descrição |
| :--- | :--- | :--- |
| **`index.html`** | Web App | Player interativo completo com slide, arrastar com mouse e controles |
| **`avatar_animated.svg`** | SVG Vetorial | SVG animado autônomo em loop contínuo 360° (Vetor puro, resolução infinita) |
| **`avatar_interactive.svg`** | SVG Interativo | SVG com slide e controles interativos dentro do próprio arquivo SVG |
| **`avatar_animated.gif`** | GIF | GIF 360° universal para compartilhamento fácil |
| **`avatar_animated.png`** | APNG | PNG animado com suporte a transparência alpha limpa |
| **`build_viewer.py`** | Python | Script de geração automatizada dos arquivos |

---

## 📐 Estrutura dos 24 Quadros (Passo de 15°)

1. `0°`: Frente (`0.svg`)
2. `15°` a `75°`: Rotação Frontal Direita
3. `90°`: Perfil Direito
4. `105°` a `165°`: Rotação Traseira Direita
5. `180°`: Costas
6. `195°` a `255°`: Rotação Traseira Esquerda (`-165°` a `-105°`)
7. `270°`: Perfil Esquerdo (`-90°`)
8. `285°` a `345°`: Rotação Frontal Esquerda (`-75°` a `-15°`)
9. Volta para `0°` / `360°`
