/* ==========================================================================
   APP.JS - GIGATRACKER LOGIC
   Banco de dados nativo de treinos, persistência local, timers e relatórios.
   ========================================================================== */

// 1. BANCO DE DADOS DOS TREINOS (Configuração Inicial Dinâmica)
const INITIAL_WORKOUTS_DATABASE = {
    'push_1': {
        name: "PUSH",
        category: "Push",
        focus: "Volume de peitoral e progressão de força.",
        themeClass: "theme-a",
        exercises: [
            { id: "sup_inc_halt", name: "Supino Inclinado (Halteres)", sets: 4, reps: "5-6", defaultWeight: "18 kg cada lado", tip: "Foco na amplitude e controle na descida." },
            { id: "sup_reto_bar", name: "Supino Reto (Barra)", sets: 4, reps: "5-6", defaultWeight: "20 kg cada lado + barra", tip: "Controle a descida até tocar levemente o peito." },
            { id: "paralelas", name: "Paralelas", sets: 3, reps: "Falha", defaultWeight: "Peso corporal", tip: "Incline o tronco levemente para frente para focar no peito." },
            { id: "cross_alta", name: "Crossover Polia Alta", sets: 4, reps: "6-8", defaultWeight: "3 placas", tip: "Aperte o peitoral na parte baixa do movimento." },
            { id: "cross_baixa", name: "Crossover Polia Baixa", sets: 4, reps: "6-8", defaultWeight: "2 placas + 2 halteres 1kg", tip: "Movimento de baixo para cima, excelente para peito superior." },
            { id: "desenv_sent", name: "Desenvolvimento Sentado", sets: 4, reps: "10-12", defaultWeight: "10 kg cada halter", tip: "Não curve a lombar, empurre os halteres para cima." },
            { id: "elev_lateral", name: "Elevação Lateral", sets: 4, reps: "15", defaultWeight: "8 kg", tip: "Mantenha os braços levemente flexionados, eleve até a linha do ombro." },
            { id: "tricep_corda", name: "Tríceps Corda (Polia)", sets: 3, reps: "12", defaultWeight: "4 placas", tip: "Abra a corda no final do movimento para contração máxima." },
            { id: "tricep_franc", name: "Tríceps Francês (Sentado)", sets: 3, reps: "12", defaultWeight: "12 kg", tip: "Covelos apontados para cima e fechados durante o movimento." },
            { id: "abdominal_barra_fixa", name: "Abdominal na Barra Fixa", sets: 4, reps: "Falha", defaultWeight: "Peso corporal", tip: "Foco na estabilização do core. Eleve as pernas/joelhos controladamente." }
        ]
    },
    'pull_1': {
        name: "PULL",
        category: "Pull",
        focus: "Largura, correção postural e proteção lombar.",
        themeClass: "theme-b",
        exercises: [
            { id: "barra_fixa", name: "Barra Fixa", sets: 3, reps: "Máximo", defaultWeight: "Peso corporal", tip: "Use auxílio (elástico/graviton) se precisar. Foco em puxar com os cotovelos." },
            { id: "puxada_alta", name: "Puxada Alta (Polia)", sets: 3, reps: "10-12", defaultWeight: "6 placas", tip: "Tronco levemente inclinado para trás. Puxe até o peito superior." },
            { id: "remada_serrote", name: "Remada Serrote (Halter)", sets: 3, reps: "10-12", defaultWeight: "16 kg", tip: "Apoiado no banco. Essencial para estabilização da lombar." },
            { id: "crucifixo_inv", name: "Crucifixo Reverso (Banco Inclinado)", sets: 3, reps: "15", defaultWeight: "5 kg cada lado", tip: "Peito apoiado no banco inclinado. Foco em aproximar as escápulas." },
            { id: "face_pull", name: "Face Pull (Corda)", sets: 3, reps: "15", defaultWeight: "4 placas", tip: "Puxe a corda em direção à altura da testa, abrindo bem os cotovelos." },
            { id: "rosca_martelo", name: "Rosca Martelo (Halteres)", sets: 4, reps: "10-12", defaultWeight: "10 kg cada halter", tip: "Pode fazer sentado. Excelente para braquiorradial e bíceps." },
            { id: "abdominal_prancha", name: "Abdominal (Prancha Lateral)", sets: 3, reps: "30-45s", defaultWeight: "Tempo", tip: "Foco na estabilidade lateral da coluna." },
            { id: "abdominal_dec", name: "Abdominal Declinado", sets: 4, reps: "Falha", defaultWeight: "Peso corporal", tip: "Controle a descida e suba contraindo o abdômen sem forçar o pescoço." }
        ]
    },
    'legs_1': {
        name: "LEGS & CORE",
        category: "Legs",
        focus: "Força sem compressão da coluna e estabilidade.",
        themeClass: "theme-c",
        exercises: [
            { id: "elev_pelvica", name: "Elevação Pélvica (Ponte)", sets: 3, reps: "15", defaultWeight: "20 kg", tip: "Ativar glúteos isometricamente antes de iniciar com carga." },
            { id: "leg_press_45", name: "Leg Press 45°", sets: 4, reps: "8-10", defaultWeight: "120 kg", tip: "Pés altos na plataforma para aliviar a compressão nos joelhos." },
            { id: "agach_ciclista", name: "Agachamento Ciclista", sets: 3, reps: "10-12", defaultWeight: "14 kg", tip: "Anilha no calcanhar + halter no peito. Foco no quadríceps." },
            { id: "afundo_halt", name: "Afundo com Halteres", sets: 3, reps: "10 cada lado", defaultWeight: "10 kg cada halter", tip: "Tronco bem reto. Joelho de trás quase toca o chão." },
            { id: "stiff_halt", name: "Stiff com Halteres", sets: 4, reps: "8-10", defaultWeight: "16 kg cada halter", tip: "Descer até a altura do joelho. Mantenha a coluna neutra (proteção lombar)." },
            { id: "panturrilha_pe", name: "Panturrilha em pé", sets: 4, reps: "15-20", defaultWeight: "Peso corporal", tip: "Amplitude máxima de movimento na descida e subida." },
            { id: "stomach_vacuum", name: "Stomach Vacuum", sets: 3, reps: "30s", defaultWeight: "Tempo", tip: "Ao finalizar o treino ou em jejum. Expire todo o ar e encolha o abdômen." },
            { id: "banco_romano_lombar", name: "Banco Romano para Lombar", sets: 4, reps: "Falha", defaultWeight: "Peso corporal", tip: "Coluna neutra, suba ativando os glúteos e posterior de coxa, sem hiperextender." }
        ]
    }
};

let WORKOUTS_DATABASE = {};

function loadWorkoutsDatabase() {
    const saved = localStorage.getItem('gigaTracker_workoutsDatabase');
    if (saved) {
        WORKOUTS_DATABASE = JSON.parse(saved);
    } else {
        // Cópia profunda dos dados originais
        WORKOUTS_DATABASE = JSON.parse(JSON.stringify(INITIAL_WORKOUTS_DATABASE));
        saveWorkoutsDatabase();
    }
}

function saveWorkoutsDatabase() {
    localStorage.setItem('gigaTracker_workoutsDatabase', JSON.stringify(WORKOUTS_DATABASE));
}

// 2. VARIÁVEIS DE ESTADO GLOBAL
let currentWorkoutLetter = 'push_1';
let currentCategory = 'Push';
let currentSession = null;
let workoutTimerInterval = null;
let workoutSeconds = 0;

// Estado do Timer de Descanso (Rest Timer)
let restTimerInterval = null;
let restDurationTotal = 60; // 60 segundos por padrão
let restSecondsRemaining = 0;
let soundEnabled = true;

// Audio Context para Bipe Sintético
let audioCtx = null;

// ==========================================================================
// 3. INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 0. Carrega banco de dados dinâmico de treinos (v1.3.8)
    loadWorkoutsDatabase();

    // 1. Carrega histórico do localStorage
    loadHistory();

    // 2. Carrega ou inicia uma nova sessão
    const savedSession = localStorage.getItem('gigaTracker_currentSession');
    if (savedSession) {
        currentSession = JSON.parse(savedSession);
        currentWorkoutLetter = currentSession.letter;
        workoutSeconds = currentSession.elapsedSeconds || 0;
        
        // Altera a classe de tema no body
        const workoutDef = WORKOUTS_DATABASE[currentWorkoutLetter];
        if (workoutDef) {
            document.body.className = `dark-theme ${workoutDef.themeClass}`;
            currentCategory = workoutDef.category;
        }
        
        // Sincroniza visual do seletor
        renderWorkoutSelector();
        
        // Renderiza exercícios a partir do estado salvo
        renderExercises();
        
        // Mantém pausado, mas formata o display com o tempo salvo!
        const hrs = Math.floor(workoutSeconds / 3600);
        const mins = Math.floor((workoutSeconds % 3600) / 60);
        const secs = workoutSeconds % 60;
        document.getElementById('workout-timer').innerText = 
            `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
        // Atualiza botão do Timer na UI para o estado "Retomar" (pois está carregado pausado)
        const btnStart = document.getElementById('btn-start-workout');
        const btnStartText = document.getElementById('btn-start-text');
        if (btnStart) {
            btnStart.className = "btn btn-sm btn-success";
            btnStartText.innerText = "Retomar Treino";
        }
    } else {
        // Se não há sessão salva, inicia do zero com o último treino ativo registrado ou o push_1 (v1.3.8)
        const lastActiveId = localStorage.getItem('gigaTracker_activeWorkoutId') || 'push_1';
        const finalId = WORKOUTS_DATABASE[lastActiveId] ? lastActiveId : Object.keys(WORKOUTS_DATABASE)[0];
        initNewSession(finalId);
    }

    // 3. Verifica se havia timer de descanso ativo no localStorage
    const savedRestTimer = localStorage.getItem('gigaTracker_restTimer');
    if (savedRestTimer) {
        const timerData = JSON.parse(savedRestTimer);
        const elapsed = Math.floor((Date.now() - timerData.savedAt) / 1000);
        const remaining = timerData.remaining - elapsed;
        
        if (remaining > 0) {
            restDurationTotal = timerData.total;
            startRestTimerCountdown(remaining);
        } else {
            localStorage.removeItem('gigaTracker_restTimer');
        }
    }

    // 4. Carrega preferências de som
    const savedSound = localStorage.getItem('gigaTracker_soundEnabled');
    if (savedSound !== null) {
        soundEnabled = JSON.parse(savedSound);
        updateSoundUI();
    }
});

// ==========================================================================
// 4. GERENCIAMENTO DE SESSÃO & TREINO ATIVO
// ==========================================================================

// Inicializa uma nova sessão de treino
// Inicializa uma nova sessão de treino (v1.3.8)
function initNewSession(id) {
    currentWorkoutLetter = id;
    const workoutDef = WORKOUTS_DATABASE[id];
    if (!workoutDef) return;
    
    // Altera a classe de tema no body
    document.body.className = `dark-theme ${workoutDef.themeClass}`;
    
    // Zera o cronômetro do treino (deixa pausado)
    stopWorkoutTimer();
    workoutSeconds = 0;
    document.getElementById('workout-timer').innerText = "00:00:00";
    
    // Reseta botões e ícones do Timer na UI
    const btnStart = document.getElementById('btn-start-workout');
    const btnStartText = document.getElementById('btn-start-text');
    const playIcon = document.getElementById('play-timer-icon');
    const pauseIcon = document.getElementById('pause-timer-icon');
    if (btnStart) {
        btnStart.className = "btn btn-sm btn-success";
        btnStartText.innerText = "Começar Treino";
        btnStart.style.borderColor = "";
        btnStart.style.color = "";
    }
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
    
    // Recupera cargas e repetições do último treino realizado deste tipo para preencher automaticamente (v1.3.9)
    const lastWeights = getLastCompletedWeights(id);
    const lastReps = getLastCompletedReps(id);

    // Estrutura a sessão atual
    currentSession = {
        letter: id,
        name: workoutDef.name,
        category: workoutDef.category,
        focus: workoutDef.focus,
        startTime: Date.now(),
        elapsedSeconds: 0,
        exercises: workoutDef.exercises.map(ex => {
            const lastSessionWeights = lastWeights[ex.id] || [];
            const lastSessionReps = lastReps[ex.id] || [];
            const setsArray = [];
            
            for (let i = 0; i < ex.sets; i++) {
                const weight = lastSessionWeights[i] !== undefined ? lastSessionWeights[i] : ex.defaultWeight;
                const reps = lastSessionReps[i] !== undefined ? lastSessionReps[i] : parseReps(ex.reps);
                setsArray.push({
                    setNum: i + 1,
                    completed: false,
                    weight: weight,
                    reps: reps
                });
            }
            
            return {
                id: ex.id,
                name: ex.name,
                reps: ex.reps,
                tip: ex.tip || '',
                isDoubleWeight: isExerciseDoubleWeight(ex),
                sets: setsArray
            };
        })
    };
    
    saveCurrentSessionState();
    renderExercises();
    
    currentCategory = workoutDef.category;
    renderWorkoutSelector();
    
    // Atualiza texto do Foco
    const focusText = document.getElementById('workout-focus-text');
    if (focusText) {
        focusText.innerHTML = `<strong>Foco:</strong> ${workoutDef.focus}`;
    }
}

// Altera o treino ativo pelo ID com aviso se houver progresso feito (v1.3.8)
function changeWorkout(id) {
    if (id === currentWorkoutLetter && currentSession && currentSession.letter === id) return;
    
    // Verifica se há alguma série já marcada como concluída na sessão ativa
    const hasProgress = currentSession && currentSession.exercises.some(ex => ex.sets.some(s => s.completed));
    
    if (hasProgress) {
        const confirmChange = confirm("Você já iniciou e marcou séries no treino atual. Deseja realmente mudar de treino? Seu progresso atual será perdido.");
        if (!confirmChange) {
            // Restaura o select para o valor anterior
            const select = document.getElementById('workout-select');
            if (select) select.value = currentWorkoutLetter;
            return;
        }
    }
    
    currentWorkoutLetter = id;
    localStorage.setItem('gigaTracker_activeWorkoutId', id);
    
    const workoutDef = WORKOUTS_DATABASE[id];
    if (workoutDef) {
        localStorage.setItem('gigaTracker_lastWorkoutId_' + workoutDef.category, id);
    }
    
    initNewSession(id);
}

// Seleciona a categoria ativa (Push, Pull, Legs) (v1.3.8)
function selectCategory(category) {
    if (category === currentCategory && currentSession && currentSession.category === category) return;
    
    currentCategory = category;
    
    // Procura o último ID ativo desta categoria ou escolhe a primeira disponível nela
    const lastWorkoutId = localStorage.getItem('gigaTracker_lastWorkoutId_' + category);
    
    let targetId = lastWorkoutId;
    if (!targetId || !WORKOUTS_DATABASE[targetId] || WORKOUTS_DATABASE[targetId].category !== category) {
        // Encontra o primeiro treino desta categoria no banco
        const firstMatch = Object.entries(WORKOUTS_DATABASE).find(([wId, w]) => w.category === category);
        targetId = firstMatch ? firstMatch[0] : null;
    }
    
    if (targetId) {
        changeWorkout(targetId);
    } else {
        renderWorkoutSelector();
    }
}

// Renderiza as opções de treinos da categoria e atualiza abas (v1.3.8)
function renderWorkoutSelector() {
    const select = document.getElementById('workout-select');
    if (!select) return;
    
    select.innerHTML = '';
    
    // Filtra treinos da categoria atual
    const workouts = Object.entries(WORKOUTS_DATABASE)
        .filter(([id, w]) => w.category === currentCategory)
        .map(([id, w]) => ({ id, ...w }));
        
    workouts.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w.id;
        opt.textContent = w.name;
        if (w.id === currentWorkoutLetter) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });
    
    // Atualiza classes das abas de categorias
    document.querySelectorAll('.btn-category').forEach(btn => {
        btn.className = 'btn-category';
    });
    
    const activeBtn = document.getElementById(`btn-cat-${currentCategory.toLowerCase()}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.classList.add(`${currentCategory.toLowerCase()}-active`);
    }
}

// Callback do seletor suspenso de treinos (v1.3.8)
function onWorkoutSelectChange(id) {
    changeWorkout(id);
}

// ==========================================================================
// 5. RENDERIZAÇÃO DA INTERFACE (DOM) & REORDENAÇÃO
// ==========================================================================

// Retorna se o exercício usa peso bilateral (ambos os lados)
function isExerciseDoubleWeight(ex) {
    if (!ex) return false;
    if (ex.isDoubleWeight !== undefined) return !!ex.isDoubleWeight;
    const nameStr = (ex.name || '').toLowerCase();
    const weightStr = (ex.defaultWeight || '').toLowerCase();
    return nameStr.includes('halter') || nameStr.includes('halteres') ||
           nameStr.includes('cada lado') || weightStr.includes('cada lado') ||
           weightStr.includes('halter') || nameStr.includes('dumbell') || nameStr.includes('dumbbell');
}

// Alterna o estado de peso duplo (ambos os lados) para o exercício
function toggleDoubleWeight(exId) {
    if (!currentSession) return;
    const ex = currentSession.exercises.find(e => e.id === exId);
    if (!ex) return;
    
    ex.isDoubleWeight = !isExerciseDoubleWeight(ex);
    
    // Sincroniza também no WORKOUTS_DATABASE permanente
    if (WORKOUTS_DATABASE[currentSession.letter] && WORKOUTS_DATABASE[currentSession.letter].exercises) {
        const dbEx = WORKOUTS_DATABASE[currentSession.letter].exercises.find(e => e.id === exId || e.name === ex.name);
        if (dbEx) {
            dbEx.isDoubleWeight = ex.isDoubleWeight;
            saveWorkoutsDatabase();
        }
    }
    
    saveCurrentSessionState();
    renderExercises();
}

// Move um exercício de uma posição para outra (Drag & Drop e Botões)
function moveExercise(fromIndex, toIndex) {
    if (!currentSession || !currentSession.exercises) return;
    if (fromIndex < 0 || fromIndex >= currentSession.exercises.length) return;
    if (toIndex < 0 || toIndex >= currentSession.exercises.length) return;
    if (fromIndex === toIndex) return;
    
    const [movedEx] = currentSession.exercises.splice(fromIndex, 1);
    currentSession.exercises.splice(toIndex, 0, movedEx);
    
    // Atualiza a ordem no banco de dados permanente deste treino
    if (WORKOUTS_DATABASE[currentSession.letter] && WORKOUTS_DATABASE[currentSession.letter].exercises) {
        const dbList = WORKOUTS_DATABASE[currentSession.letter].exercises;
        const dbFrom = dbList.findIndex(e => e.id === movedEx.id || e.name === movedEx.name);
        if (dbFrom !== -1) {
            const [movedDbEx] = dbList.splice(dbFrom, 1);
            dbList.splice(toIndex, 0, movedDbEx);
            saveWorkoutsDatabase();
        }
    }
    
    saveCurrentSessionState();
    renderExercises();
}

// Mover exercício para cima
function moveExerciseUp(exId) {
    if (!currentSession) return;
    const idx = currentSession.exercises.findIndex(e => e.id === exId);
    if (idx > 0) {
        moveExercise(idx, idx - 1);
    }
}

// Mover exercício para baixo
function moveExerciseDown(exId) {
    if (!currentSession) return;
    const idx = currentSession.exercises.findIndex(e => e.id === exId);
    if (idx !== -1 && idx < currentSession.exercises.length - 1) {
        moveExercise(idx, idx + 1);
    }
}

// Renderiza a lista de exercícios na tela
function renderExercises() {
    const container = document.getElementById('exercises-list');
    container.innerHTML = '';
    
    currentSession.exercises.forEach((ex, exIndex) => {
        const card = document.createElement('div');
        card.className = 'exercise-card glass';
        card.id = `exercise-${ex.id}`;
        card.dataset.index = exIndex;
        card.dataset.exId = ex.id;
        
        const isDouble = isExerciseDoubleWeight(ex);
        
        // Verifica se todas as séries do exercício foram concluídas
        const allCompleted = ex.sets.length > 0 && ex.sets.every(s => s.completed);
        if (allCompleted) {
            card.classList.add('exercise-all-completed');
        }
        
        // Calcula porcentagem do exercício individual
        const completedSets = ex.sets.filter(s => s.completed).length;
        const totalSets = ex.sets.length;
        const percent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
        
        let setsHTML = '';
        ex.sets.forEach((set, setIndex) => {
            const isCompletedClass = set.completed ? 'completed' : '';
            
            // Determina a repetição padrão selecionada (v1.3.5)
            let defaultReps = parseReps(ex.reps);
            if (set.reps) defaultReps = set.reps; // se já houver repetição editada salva
            
            // Gera as opções de repetição (1 a max) (v1.3.9)
            let repsOptions = '';
            const maxRepsRange = Math.max(25, defaultReps);
            for (let r = 1; r <= maxRepsRange; r++) {
                const selected = r === defaultReps ? 'selected' : '';
                repsOptions += `<option value="${r}" ${selected}>${r} reps</option>`;
            }
            
            // Gera as opções de peso (Peso corporal, e 1 a 80 kg) (v1.3.5)
            const currentWeightNum = extractNumericWeight(set.weight);
            const isPesoCorporal = !set.weight || set.weight.toLowerCase().includes('corporal') || set.weight.toLowerCase().includes('corpo');
            
            let weightOptions = `<option value="Peso corporal" ${isPesoCorporal ? 'selected' : ''}>Peso corporal</option>`;
            const maxWeightRange = Math.max(80, currentWeightNum);
            for (let w = 1; w <= maxWeightRange; w++) {
                const selected = (!isPesoCorporal && currentWeightNum === w) ? 'selected' : '';
                weightOptions += `<option value="${w} kg" ${selected}>${w} kg${isDouble ? ' cada lado' : ''}</option>`;
            }
            
            setsHTML += `
                <div class="set-row ${isCompletedClass}" id="row-${ex.id}-${setIndex}">
                    <div class="set-number center">#${set.setNum}</div>
                    <div class="set-target" style="padding: 0;">
                        <select class="reps-select glass" 
                                id="reps-select-${ex.id}-${setIndex}" 
                                onchange="updateReps('${ex.id}', ${setIndex}, this.value)"
                                style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-color); border-radius: 8px; padding: 6px; color: var(--text-primary); font-family: var(--font-heading); font-size: 12px; font-weight: 700; outline: none; width: 100%; cursor: pointer;">
                            ${repsOptions}
                        </select>
                    </div>
                    <div>
                        <div class="weight-input-group" style="border: none; padding: 0; background: transparent;">
                            <select class="weight-select glass" 
                                    id="weight-select-${ex.id}-${setIndex}" 
                                    onchange="updateWeight('${ex.id}', ${setIndex}, this.value)"
                                    style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-color); border-radius: 8px; padding: 6px; color: var(--text-primary); font-family: var(--font-heading); font-size: 12px; font-weight: 700; outline: none; width: 100%; cursor: pointer;">
                                ${weightOptions}
                            </select>
                        </div>
                    </div>
                    <div class="set-checkbox-container">
                        <button type="button" 
                                class="btn-check-set" 
                                onclick="toggleSet('${ex.id}', ${setIndex})" 
                                aria-label="Marcar série como concluída">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        });
        
        card.innerHTML = `
            <div class="exercise-header">
                <div style="display: flex; align-items: flex-start; gap: 8px; width: 100%;">
                    <div class="exercise-drag-controls">
                        <div class="drag-handle" title="Segure e arraste para reordenar" draggable="true" data-index="${exIndex}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                                <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                                <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                            </svg>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 2px;">
                            <button type="button" class="btn-move-order" onclick="moveExerciseUp('${ex.id}')" ${exIndex === 0 ? 'disabled' : ''} title="Subir exercício">▲</button>
                            <button type="button" class="btn-move-order" onclick="moveExerciseDown('${ex.id}')" ${exIndex === currentSession.exercises.length - 1 ? 'disabled' : ''} title="Descer exercício">▼</button>
                        </div>
                    </div>
                    
                    <div class="exercise-title-section" style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 10px;">
                            <h3 class="exercise-title">${ex.name}</h3>
                            <span class="exercise-percent-label" id="percent-${ex.id}" style="font-family: var(--font-heading); font-size: 13px; font-weight: 800; color: var(--theme-primary);">${percent}%</span>
                        </div>
                        
                        <!-- Barra de progresso individual do exercício -->
                        <div class="exercise-progress-container" style="background: rgba(255, 255, 255, 0.04); height: 5px; border-radius: 3px; overflow: hidden; margin-top: 6px; position: relative; border: 1px solid rgba(255,255,255,0.02);">
                            <div class="exercise-progress-bar" id="progress-${ex.id}" style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, var(--theme-primary), var(--theme-secondary)); border-radius: 3px; transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 6px var(--theme-primary);"></div>
                        </div>

                        <div class="exercise-meta-badges" style="margin-top: 8px; align-items: center; flex-wrap: wrap; gap: 6px;">
                            <span class="badge badge-reps">${ex.sets.length} séries × ${ex.reps}</span>
                            ${allCompleted ? '<span class="badge badge-info" style="background: var(--theme-glow); color: var(--theme-primary)">Concluído!</span>' : ''}
                            <button type="button" 
                                    class="btn-double-weight ${isDouble ? 'active' : ''}" 
                                    onclick="toggleDoubleWeight('${ex.id}')" 
                                    title="${isDouble ? 'Volume em dobro (peso para cada lado)' : 'Volume simples (peso único)'}">
                                ⚖️ ${isDouble ? '2x Cada lado' : '1x Total'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            ${ex.tip ? `<div class="exercise-tip">${ex.tip}</div>` : ''}
            
            <div class="sets-table-container">
                <div class="sets-header-row">
                    <div class="center">Série</div>
                    <div>Meta</div>
                    <div class="center">Carga ${isDouble ? '(cada lado)' : '/ Peso'}</div>
                    <div class="center">Feito</div>
                </div>
                ${setsHTML}
            </div>

            <div class="exercise-footer-actions">
                <button type="button" class="btn-set-control" onclick="removeSetFromExercise('${ex.id}')">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Série
                </button>
                <button type="button" class="btn-set-control" onclick="addSetToExercise('${ex.id}')">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Série
                </button>
                <button type="button" class="btn-set-control" onclick="removeExerciseFromSession('${ex.id}')" style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.15); color: #f87171; margin-left: auto;">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Remover
                </button>
            </div>
        `;
        
        // Listeners para Drag and Drop
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            card.classList.add('drag-over');
        });
        card.addEventListener('dragleave', () => {
            card.classList.remove('drag-over');
        });
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
            const toIndex = exIndex;
            if (!isNaN(fromIndex) && fromIndex !== toIndex) {
                moveExercise(fromIndex, toIndex);
            }
        });
        
        const handle = card.querySelector('.drag-handle');
        if (handle) {
            handle.addEventListener('dragstart', (e) => {
                card.classList.add('dragging');
                e.dataTransfer.setData('text/plain', exIndex.toString());
                e.dataTransfer.effectAllowed = 'move';
            });
            handle.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                document.querySelectorAll('.exercise-card').forEach(c => c.classList.remove('drag-over', 'dragging'));
            });
            
            // Suporte tátil para smartphones/tablets
            let touchStartIndex = exIndex;
            handle.addEventListener('touchstart', (e) => {
                touchStartIndex = exIndex;
                card.classList.add('dragging');
            }, { passive: true });
            
            handle.addEventListener('touchmove', (e) => {
                const touch = e.touches[0];
                const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
                const targetCard = targetEl ? targetEl.closest('.exercise-card') : null;
                document.querySelectorAll('.exercise-card').forEach(c => c.classList.remove('drag-over'));
                if (targetCard && targetCard !== card) {
                    targetCard.classList.add('drag-over');
                }
            }, { passive: true });
            
            handle.addEventListener('touchend', (e) => {
                card.classList.remove('dragging');
                const touch = e.changedTouches[0];
                const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
                const targetCard = targetEl ? targetEl.closest('.exercise-card') : null;
                document.querySelectorAll('.exercise-card').forEach(c => c.classList.remove('drag-over'));
                if (targetCard && targetCard.dataset.index !== undefined) {
                    const targetIndex = parseInt(targetCard.dataset.index, 10);
                    if (!isNaN(targetIndex) && targetIndex !== touchStartIndex) {
                        moveExercise(touchStartIndex, targetIndex);
                    }
                }
            });
        }
        
        container.appendChild(card);
    });
    
    // Adiciona botão para inserir exercício na sessão de forma dinâmica (v1.3.9)
    const addExContainer = document.createElement('div');
    addExContainer.style.margin = '20px 0 10px 0';
    addExContainer.style.display = 'flex';
    addExContainer.style.justifyContent = 'center';
    addExContainer.innerHTML = `
        <button type="button" class="btn btn-outline" onclick="addExerciseToSession()" style="width: 100%; border-radius: 12px; font-weight: 700; height: 46px; display: flex; align-items: center; justify-content: center; gap: 8px; border-color: rgba(255,255,255,0.1); color: var(--text-secondary); background: rgba(255,255,255,0.02);">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Adicionar Exercício
        </button>
    `;
    container.appendChild(addExContainer);
    
    updateGlobalProgress();
}

// Alterna o estado de conclusão de uma série
function toggleSet(exId, setIndex) {
    const exercise = currentSession.exercises.find(e => e.id === exId);
    if (!exercise) return;
    
    const set = exercise.sets[setIndex];
    if (!set) return;
    
    set.completed = !set.completed;
    
    // Salva o estado da sessão imediatamente
    saveCurrentSessionState();
    
    // Atualiza apenas a linha e o progresso global para performance
    const row = document.getElementById(`row-${exId}-${setIndex}`);
    if (set.completed) {
        row.classList.add('completed');
        
        // Se a série foi completada e o cronômetro geral está pausado, inicia-o automaticamente!
        if (!workoutTimerInterval) {
            toggleWorkoutTimer();
        }
        
        // Se a série foi completada, dispara o Rest Timer!
        triggerAutoRestTimer();
    } else {
        row.classList.remove('completed');
    }
    
    // Recarrega o cartão para atualizar os badges e barra de porcentagem
    renderExercises();
}

// Atualiza o peso de uma série específica com replicação em cascata a partir do primeiro set
function updateWeight(exId, setIndex, value) {
    const exercise = currentSession.exercises.find(e => e.id === exId);
    if (!exercise) return;
    
    const set = exercise.sets[setIndex];
    if (!set) return;
    
    set.weight = value;
    
    // Salva preferência global do peso para preencher nos próximos treinos
    saveLastUsedWeight(currentWorkoutLetter, exId, setIndex, value);
    
    // Se for a primeira série (index 0), replica para todas as séries seguintes do exercício
    if (setIndex === 0) {
        for (let i = 1; i < exercise.sets.length; i++) {
            exercise.sets[i].weight = value;
            saveLastUsedWeight(currentWorkoutLetter, exId, i, value);
        }
        // Sincroniza também como defaultWeight no banco definitivo deste treino
        if (WORKOUTS_DATABASE[currentWorkoutLetter] && WORKOUTS_DATABASE[currentWorkoutLetter].exercises) {
            const dbEx = WORKOUTS_DATABASE[currentWorkoutLetter].exercises.find(e => e.id === exId || e.name === exercise.name);
            if (dbEx) {
                dbEx.defaultWeight = value;
                saveWorkoutsDatabase();
            }
        }
        // Como alteramos os valores das outras linhas, re-renderizamos para atualizar os dropdowns na tela
        renderExercises();
    }
    
    saveCurrentSessionState();
}

// Atualiza as repetições de uma série específica com replicação em cascata a partir do primeiro set
function updateReps(exId, setIndex, value) {
    const exercise = currentSession.exercises.find(e => e.id === exId);
    if (!exercise) return;
    
    const set = exercise.sets[setIndex];
    if (!set) return;
    
    const repsInt = parseInt(value, 10);
    set.reps = repsInt;
    
    // Salva preferência global das reps para preencher nos próximos treinos (v1.3.9)
    saveLastUsedReps(currentWorkoutLetter, exId, setIndex, repsInt);
    
    // Se for a primeira série (index 0), replica para todas as séries seguintes do exercício
    if (setIndex === 0) {
        for (let i = 1; i < exercise.sets.length; i++) {
            exercise.sets[i].reps = repsInt;
            saveLastUsedReps(currentWorkoutLetter, exId, i, repsInt);
        }
        // Sincroniza também como reps padrão no banco definitivo deste treino
        if (WORKOUTS_DATABASE[currentWorkoutLetter] && WORKOUTS_DATABASE[currentWorkoutLetter].exercises) {
            const dbEx = WORKOUTS_DATABASE[currentWorkoutLetter].exercises.find(e => e.id === exId || e.name === exercise.name);
            if (dbEx) {
                dbEx.reps = `${repsInt}`;
                saveWorkoutsDatabase();
            }
        }
        // Re-renderiza para atualizar os dropdowns na tela
        renderExercises();
    }
    
    saveCurrentSessionState();
}

// Adiciona uma nova série dinamicamente ao exercício herdando peso e repetições anteriores
function addSetToExercise(exId) {
    const exercise = currentSession.exercises.find(e => e.id === exId);
    if (!exercise) return;
    
    const newSetNum = exercise.sets.length + 1;
    // Pega o peso e reps da série anterior como padrão para a nova série
    const defaultWeight = exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1].weight : "8 kg";
    const defaultReps = exercise.sets.length > 0 && exercise.sets[exercise.sets.length - 1].reps 
        ? exercise.sets[exercise.sets.length - 1].reps 
        : parseReps(exercise.reps);
    
    exercise.sets.push({
        setNum: newSetNum,
        completed: false,
        weight: defaultWeight,
        reps: defaultReps
    });
    
    // Sincroniza quantidade de séries no WORKOUTS_DATABASE
    if (WORKOUTS_DATABASE[currentWorkoutLetter] && WORKOUTS_DATABASE[currentWorkoutLetter].exercises) {
        const dbEx = WORKOUTS_DATABASE[currentWorkoutLetter].exercises.find(e => e.id === exId || e.name === exercise.name);
        if (dbEx) {
            dbEx.sets = exercise.sets.length;
            saveWorkoutsDatabase();
        }
    }
    
    saveCurrentSessionState();
    renderExercises();
}

// Remove a última série de um exercício
function removeSetFromExercise(exId) {
    const exercise = currentSession.exercises.find(e => e.id === exId);
    if (!exercise || exercise.sets.length === 0) return;
    
    exercise.sets.pop();
    
    // Sincroniza quantidade de séries no WORKOUTS_DATABASE
    if (WORKOUTS_DATABASE[currentWorkoutLetter] && WORKOUTS_DATABASE[currentWorkoutLetter].exercises) {
        const dbEx = WORKOUTS_DATABASE[currentWorkoutLetter].exercises.find(e => e.id === exId || e.name === exercise.name);
        if (dbEx) {
            dbEx.sets = exercise.sets.length;
            saveWorkoutsDatabase();
        }
    }
    
    saveCurrentSessionState();
    renderExercises();
}

// ==========================================================================
// 6. BARRA DE STATUS & CRONÔMETRO DO TREINO
// ==========================================================================

// Alterna o cronômetro do treino (Play/Pause)
function toggleWorkoutTimer() {
    const btnStart = document.getElementById('btn-start-workout');
    const btnStartText = document.getElementById('btn-start-text');
    const playIcon = document.getElementById('play-timer-icon');
    const pauseIcon = document.getElementById('pause-timer-icon');
    
    if (workoutTimerInterval) {
        // Está rodando, vamos pausar
        stopWorkoutTimer();
        
        // Atualiza botões
        if (btnStart) {
            btnStart.className = "btn btn-sm btn-success";
            btnStartText.innerText = "Retomar Treino";
            btnStart.style.borderColor = "";
            btnStart.style.color = "";
        }
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
    } else {
        // Está pausado, vamos rodar
        startWorkoutTimer(true);
        
        // Atualiza botões
        if (btnStart) {
            btnStart.className = "btn btn-sm btn-outline";
            btnStart.style.borderColor = "var(--theme-primary)";
            btnStart.style.color = "var(--theme-primary)";
            btnStartText.innerText = "Pausar Treino";
        }
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
    }
}

// Inicia o cronômetro corrido do treino (v1.3.9)
function startWorkoutTimer(resume = false) {
    stopWorkoutTimer();
    
    if (!resume) {
        workoutSeconds = 0;
        if (currentSession) {
            currentSession.accumulatedSeconds = 0;
            currentSession.timerLastStarted = Date.now();
        }
    } else {
        if (currentSession) {
            if (currentSession.accumulatedSeconds === undefined) {
                currentSession.accumulatedSeconds = workoutSeconds;
            }
            currentSession.timerLastStarted = Date.now();
        }
    }
    
    workoutTimerInterval = setInterval(() => {
        if (currentSession && currentSession.timerLastStarted) {
            const elapsedSinceStart = Math.floor((Date.now() - currentSession.timerLastStarted) / 1000);
            workoutSeconds = (currentSession.accumulatedSeconds || 0) + elapsedSinceStart;
        } else {
            workoutSeconds++;
        }
        
        // Salva tempo na sessão
        if (currentSession) {
            currentSession.elapsedSeconds = workoutSeconds;
            saveCurrentSessionState();
        }
        
        // Atualiza UI
        updateWorkoutTimerUI();
    }, 1000);
}

// Atualiza o display do cronômetro na tela (v1.3.9)
function updateWorkoutTimerUI() {
    const hrs = Math.floor(workoutSeconds / 3600);
    const mins = Math.floor((workoutSeconds % 3600) / 60);
    const secs = workoutSeconds % 60;
    
    const hrsStr = hrs.toString().padStart(2, '0');
    const minsStr = mins.toString().padStart(2, '0');
    const secsStr = secs.toString().padStart(2, '0');
    
    const timerDisplay = document.getElementById('workout-timer');
    if (timerDisplay) {
        timerDisplay.innerText = `${hrsStr}:${minsStr}:${secsStr}`;
    }
}

// Para o cronômetro do treino (v1.3.9)
function stopWorkoutTimer() {
    if (workoutTimerInterval) {
        clearInterval(workoutTimerInterval);
        workoutTimerInterval = null;
    }
    if (currentSession && currentSession.timerLastStarted) {
        const elapsedSinceStart = Math.floor((Date.now() - currentSession.timerLastStarted) / 1000);
        currentSession.accumulatedSeconds = (currentSession.accumulatedSeconds || 0) + elapsedSinceStart;
        currentSession.timerLastStarted = null;
        workoutSeconds = currentSession.accumulatedSeconds;
        currentSession.elapsedSeconds = workoutSeconds;
        saveCurrentSessionState();
    }
}

// Atualiza a barra de progresso de séries completadas
function updateGlobalProgress() {
    let totalSets = 0;
    let completedSets = 0;
    
    currentSession.exercises.forEach(ex => {
        totalSets += ex.sets.length;
        ex.sets.forEach(s => {
            if (s.completed) completedSets++;
        });
    });
    
    const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
    
    document.getElementById('workout-progress-bar').style.width = `${progressPercent}%`;
    document.getElementById('workout-progress-text').innerText = `${completedSets}/${totalSets} séries`;
}

// ==========================================================================
// 7. CRONÔMETRO DE DESCANSO (REST TIMER)
// ==========================================================================

// Dispara automaticamente ao marcar uma série como feita
function triggerAutoRestTimer() {
    // Só inicia se não houver um timer correndo ou se já estiver na tela
    startRestTimer(restDurationTotal);
}

// Inicializa ou altera o timer de descanso
function startRestTimer(durationSeconds) {
    stopRestTimerInterval();
    
    restDurationTotal = durationSeconds;
    restSecondsRemaining = durationSeconds;
    
    // Atualiza presets ativos na UI
    document.querySelectorAll('.btn-preset').forEach(btn => btn.classList.remove('active'));
    const matchedPresetBtn = document.querySelector(`.btn-preset[onclick="startRestTimer(${durationSeconds})"]`);
    if (matchedPresetBtn) {
        matchedPresetBtn.classList.add('active');
    }
    
    // Mostra o painel
    const timerWidget = document.getElementById('rest-timer-container');
    timerWidget.classList.remove('hidden');
    
    startRestTimerCountdown(durationSeconds);
}

// Contagem regressiva do descanso baseada em tempo absoluto (v1.3.9)
function startRestTimerCountdown(initialSeconds) {
    restSecondsRemaining = initialSeconds;
    updateRestTimerUI();
    
    const targetEndTime = Date.now() + initialSeconds * 1000;
    
    restTimerInterval = setInterval(() => {
        restSecondsRemaining = Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
        
        // Salva estado do descanso no localStorage para persistência de refresh
        localStorage.setItem('gigaTracker_restTimer', JSON.stringify({
            total: restDurationTotal,
            remaining: restSecondsRemaining,
            savedAt: Date.now(),
            targetEndTime: targetEndTime
        }));
        
        updateRestTimerUI();
        
        if (restSecondsRemaining <= 0) {
            triggerRestTimerEnd();
        }
    }, 1000);
}

// Para a contagem do descanso
function stopRestTimerInterval() {
    if (restTimerInterval) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
    }
    localStorage.removeItem('gigaTracker_restTimer');
}

// Pula/cancela o descanso
function skipRestTimer() {
    stopRestTimerInterval();
    const timerWidget = document.getElementById('rest-timer-container');
    timerWidget.classList.add('hidden');
}

// Ajusta o tempo do descanso (+15s / -15s)
function adjustRestTimer(seconds) {
    let newTime = restSecondsRemaining + seconds;
    if (newTime < 0) newTime = 0;
    
    // Mantém a duração total igual para cálculo proporcional do SVG,
    // a menos que o novo tempo supere a duração total original
    if (newTime > restDurationTotal) {
        restDurationTotal = newTime;
    }
    
    stopRestTimerInterval();
    startRestTimerCountdown(newTime);
}

// Atualiza o display visual do descanso
function updateRestTimerUI() {
    // Texto em segundos
    document.getElementById('rest-time-display').innerText = `${restSecondsRemaining}s`;
    
    // Cálculo do círculo SVG de progresso
    const circleFill = document.getElementById('timer-progress-fill');
    
    // Circunferência total de r=45 é aproximadamente 282.7 (2 * PI * r)
    const maxOffset = 283;
    const progress = restSecondsRemaining / restDurationTotal;
    const dashOffset = maxOffset - (maxOffset * progress);
    
    circleFill.style.strokeDashoffset = dashOffset;
}

// Executado quando o timer de descanso chega a zero
function triggerRestTimerEnd() {
    stopRestTimerInterval();
    
    // Som bipe sintético
    if (soundEnabled) {
        playBeepSound();
    }
    
    // Visual flash
    const timerWidget = document.getElementById('rest-timer-container');
    timerWidget.style.border = '2px solid #ef4444';
    timerWidget.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.6)';
    
    document.getElementById('rest-time-display').innerText = "VAI!";
    
    // Esconde o painel automaticamente após 3.5 segundos
    setTimeout(() => {
        timerWidget.classList.add('hidden');
        // Restaura estilo original para a próxima ativação
        timerWidget.style.border = '';
        timerWidget.style.boxShadow = '';
    }, 3500);
}

// Gera som localmente
function playBeepSound() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Toca 3 bipes rápidos e motivacionais
        let playTime = audioCtx.currentTime;
        
        for (let i = 0; i < 3; i++) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            // Frequências crescentes para soar animador
            osc.frequency.setValueAtTime(660 + (i * 120), playTime);
            
            gain.gain.setValueAtTime(0.08, playTime);
            gain.gain.exponentialRampToValueAtTime(0.001, playTime + 0.15);
            
            osc.start(playTime);
            osc.stop(playTime + 0.18);
            
            playTime += 0.22;
        }
    } catch (e) {
        console.warn("Audio Context falhou ou não permitido pelo navegador ainda.", e);
    }
}

// Ativa/Desativa o som
function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('gigaTracker_soundEnabled', JSON.stringify(soundEnabled));
    updateSoundUI();
}

function updateSoundUI() {
    const soundOn = document.getElementById('sound-icon-on');
    const soundOff = document.getElementById('sound-icon-off');
    const soundText = document.querySelector('.btn-sound-toggle span');
    
    if (soundEnabled) {
        soundOn.classList.remove('hidden');
        soundOff.classList.add('hidden');
        soundText.innerText = "Bipe Ativo";
    } else {
        soundOn.classList.add('hidden');
        soundOff.classList.remove('hidden');
        soundText.innerText = "Silencioso";
    }
}

// ==========================================================================
// 8. ABA DO HISTÓRICO
// ==========================================================================

function switchTab(tabName) {
    const navWorkout = document.getElementById('nav-workout');
    const navEvolution = document.getElementById('nav-evolution');
    const navHistory = document.getElementById('nav-history');
    
    const workoutMain = document.querySelector('.workout-main-area');
    const evolutionSection = document.getElementById('evolution-section');
    const historySection = document.getElementById('history-section');
    
    // Remove active do menu
    navWorkout.classList.remove('active');
    if (navEvolution) navEvolution.classList.remove('active');
    navHistory.classList.remove('active');
    
    // Oculta todas as seções
    workoutMain.classList.add('hidden');
    if (evolutionSection) evolutionSection.classList.add('hidden');
    historySection.classList.add('hidden');
    
    // Oculta detalhes do calendário ao mudar de aba (v1.3.2)
    if (tabName !== 'evolution') {
        closeCalendarDayDetails();
    }
    
    if (tabName === 'workout') {
        // Restaura o tema colorido ativo do treino (v1.3.3)
        const workoutDef = WORKOUTS_DATABASE[currentWorkoutLetter];
        document.body.className = `dark-theme ${workoutDef.themeClass}`;
        
        navWorkout.classList.add('active');
        workoutMain.classList.remove('hidden');
    } else if (tabName === 'evolution') {
        // Aplica o tema neutro (branco/prata) para não conflitar com cores dos treinos (v1.3.3)
        document.body.className = `dark-theme theme-neutral`;
        
        if (navEvolution) navEvolution.classList.add('active');
        if (evolutionSection) {
            evolutionSection.classList.remove('hidden');
            // Renderiza o Calendário e o Peso na aba de Evolução
            renderCalendar(currentCalYear, currentCalMonth);
            renderWeightHistory();
        }
    } else if (tabName === 'history') {
        // Aplica o tema neutro (branco/prata) para não conflitar com cores dos treinos (v1.3.3)
        document.body.className = `dark-theme theme-neutral`;
        
        navHistory.classList.add('active');
        historySection.classList.remove('hidden');
        renderHistory();
    }
}

// ==========================================================================
// 8.1. MOTOR DE EVOLUÇÃO E CALENDÁRIO (v1.2)
// ==========================================================================

let currentCalYear = new Date().getFullYear();
let currentCalMonth = new Date().getMonth();

const MONTHS_PT = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Renderiza o Calendário de dias treinados
function renderCalendar(year, month) {
    const monthYearLabel = document.getElementById('calendar-month-year');
    if (monthYearLabel) {
        monthYearLabel.innerText = `${MONTHS_PT[month]} de ${year}`;
    }
    
    const container = document.getElementById('calendar-days-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Primeiro dia da semana do 1º dia do mês
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Número total de dias do mês
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    
    // Carrega treinos do histórico para cruzamento
    const history = loadHistory();
    
    // 1. Injeta os blocos vazios antes do dia 1
    for (let i = 0; i < firstDayIndex; i++) {
        const spacer = document.createElement('div');
        spacer.className = 'cal-day-empty';
        spacer.style.height = '38px';
        container.appendChild(spacer);
    }
    
    // Data de hoje para marcar
    const today = new Date();
    const isTodayMonth = today.getFullYear() === year && today.getMonth() === month;
    
    // 2. Injeta os dias do mês
    for (let day = 1; day <= numberOfDays; day++) {
        // Verifica se há treinos nesta data específica
        const workoutsOnThisDay = history.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getFullYear() === year &&
                   itemDate.getMonth() === month &&
                   itemDate.getDate() === day;
        });
        
        let bgStyle = 'rgba(255, 255, 255, 0.02)';
        let borderStyle = '1px solid rgba(255, 255, 255, 0.05)';
        let shadowStyle = 'none';
        let colorStyle = 'var(--text-primary)';
        let tooltipText = '';
        
        if (workoutsOnThisDay.length > 0) {
            // Se treinou, pega a cor correspondente à divisão do último treino do dia
            const lastWorkout = workoutsOnThisDay[0];
            const themeLetter = getWorkoutThemeLetter(lastWorkout);
            tooltipText = `Treino ${themeLetter} - ${lastWorkout.name}`;
            
            if (themeLetter === 'A') {
                bgStyle = 'rgba(129, 140, 248, 0.15)';
                borderStyle = '1px solid var(--color-push-primary)';
                colorStyle = 'var(--color-push-primary)';
                shadowStyle = '0 0 10px var(--color-push-glow)';
            } else if (themeLetter === 'B') {
                bgStyle = 'rgba(52, 211, 153, 0.15)';
                borderStyle = '1px solid var(--color-pull-primary)';
                colorStyle = 'var(--color-pull-primary)';
                shadowStyle = '0 0 10px var(--color-pull-glow)';
            } else if (themeLetter === 'C') {
                bgStyle = 'rgba(251, 146, 60, 0.15)';
                borderStyle = '1px solid var(--color-legs-primary)';
                colorStyle = 'var(--color-legs-primary)';
                shadowStyle = '0 0 10px var(--color-legs-glow)';
            }
        } else if (isTodayMonth && today.getDate() === day) {
            // Se for hoje e não tiver treino registrado, marca com borda branca discreta
            borderStyle = '1px solid var(--text-secondary)';
        }
        
        const dayCell = document.createElement('div');
        dayCell.className = 'cal-day';
        if (tooltipText) dayCell.title = tooltipText;
        
        dayCell.style.display = 'flex';
        dayCell.style.flexDirection = 'column';
        dayCell.style.alignItems = 'center';
        dayCell.style.justifyContent = 'center';
        dayCell.style.height = '38px';
        dayCell.style.borderRadius = '10px';
        dayCell.style.fontFamily = 'var(--font-heading)';
        dayCell.style.fontSize = '13px';
        dayCell.style.fontWeight = '700';
        dayCell.style.color = colorStyle;
        dayCell.style.background = bgStyle;
        dayCell.style.border = borderStyle;
        dayCell.style.boxShadow = shadowStyle;
        dayCell.style.position = 'relative';
        dayCell.style.cursor = 'pointer'; // Torna todos os dias clicáveis para filtrar histórico
        dayCell.style.transition = 'all var(--transition-fast)';
        
        // Efeitos de Hover Premium
        dayCell.onmouseenter = () => {
            dayCell.style.transform = 'scale(1.1)';
            if (workoutsOnThisDay.length > 0) {
                dayCell.style.filter = 'brightness(1.25)';
            } else {
                dayCell.style.background = 'rgba(255,255,255,0.06)';
            }
        };
        dayCell.onmouseleave = () => {
            dayCell.style.transform = 'scale(1)';
            dayCell.style.filter = 'none';
            dayCell.style.background = bgStyle;
        };
        
        // Clique para exibir os detalhes dos treinos do dia localmente (v1.3.2)
        dayCell.onclick = () => {
            showCalendarDayDetails(year, month, day);
        };
        
        dayCell.innerText = day;
        
        container.appendChild(dayCell);
    }
}

// Navega pelos meses no calendário
function changeMonth(direction) {
    currentCalMonth += direction;
    if (currentCalMonth < 0) {
        currentCalMonth = 11;
        currentCalYear--;
    } else if (currentCalMonth > 11) {
        currentCalMonth = 0;
        currentCalYear++;
    }
    closeCalendarDayDetails(); // Oculta detalhes do mês anterior (v1.3.2)
    renderCalendar(currentCalYear, currentCalMonth);
}

// Exibe os detalhes dos treinos do dia diretamente abaixo do calendário (v1.3.2)
function showCalendarDayDetails(year, month, day) {
    const card = document.getElementById('calendar-day-details-card');
    const title = document.getElementById('calendar-day-details-title');
    const content = document.getElementById('calendar-day-details-content');
    
    if (!card || !title || !content) return;
    
    const mm = (month + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    const clickedDateStr = `${year}-${mm}-${dd}`;
    const formattedFilterDate = `${dd}/${mm}/${year}`;
    
    title.innerText = `Treino(s) no dia ${formattedFilterDate}`;
    
    const history = loadHistory();
    const workouts = history.filter(item => {
        const itemDate = new Date(item.date);
        const itemY = itemDate.getFullYear();
        const itemM = (itemDate.getMonth() + 1).toString().padStart(2, '0');
        const itemD = itemDate.getDate().toString().padStart(2, '0');
        return `${itemY}-${itemM}-${itemD}` === clickedDateStr;
    });
    
    if (workouts.length === 0) {
        content.innerHTML = `
            <div style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 16px 0; border: 1px dashed var(--border-color); border-radius: 12px; background: rgba(0,0,0,0.15);">
                Nenhum treino registrado nesta data.
            </div>
        `;
    } else {
        let contentHTML = '';
        workouts.forEach(item => {
            const themeLetter = getWorkoutThemeLetter(item);
            let exercisesSummary = '';
            item.exercises.forEach(ex => {
                const completedSets = ex.sets.filter(s => s.completed);
                const isDouble = ex.isDoubleWeight !== undefined ? ex.isDoubleWeight : isExerciseDoubleWeight(ex);
                if (completedSets.length > 0) {
                    const seriesDetails = completedSets.map(s => `${s.reps || 10}x ${s.weight}${isDouble ? ' (2x)' : ''}`).join(' | ');
                    exercisesSummary += `<div style="font-size: 11px; margin-top: 4px; color: var(--text-secondary);">• <strong>${ex.name}:</strong> ${seriesDetails}${isDouble ? ' <span style="font-size: 9px; color: var(--theme-primary); font-weight: 700;">[2x cada lado]</span>' : ''}</div>`;
                }
            });
            
            contentHTML += `
                <div class="history-card glass type-${themeLetter}" style="padding: 14px; margin-bottom: 0; border: 1px solid var(--border-color); border-left: 4px solid var(--color-${themeLetter === 'A' ? 'push' : themeLetter === 'B' ? 'pull' : 'legs'}-primary); border-radius: 12px; background: rgba(0,0,0,0.25);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <div style="font-family: var(--font-heading); font-size: 13px; font-weight: 800; color: var(--text-primary);">
                            Treino ${themeLetter} <span style="font-size: 9px; font-weight: 700; background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; margin-left: 6px; color: var(--text-secondary); text-transform: uppercase;">${item.name}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="font-size: 11px; font-weight: 700; color: var(--theme-primary);">${item.duration}</div>
                            <button type="button" onclick="openEditHistoryModal('${item.id}')" style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-secondary); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all var(--transition-fast);" title="Editar treino">
                                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>
                            <button type="button" onclick="deleteHistoryRecord('${item.id}')" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 6px; color: #f87171; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all var(--transition-fast);" title="Excluir treino">
                                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px;">
                        Séries: <strong>${item.completedSetsCount} feitas</strong> | Volume: <strong>${item.totalVolume.toLocaleString('pt-BR')} kg</strong>${item.bodyWeight ? ` | Peso: <strong>${item.bodyWeight} kg</strong>` : ''}
                    </div>
                    <div style="border-top: 1px solid rgba(255,255,255,0.04); padding-top: 6px; display: flex; flex-direction: column; gap: 2px;">
                        ${exercisesSummary}
                    </div>
                    ${item.notes ? `<div style="font-size: 11px; color: var(--text-secondary); font-style: italic; margin-top: 8px; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 8px;"><strong>Notas:</strong> "${item.notes}"</div>` : ''}
                </div>
            `;
        });
        content.innerHTML = contentHTML;
    }
    
    // Mostra o card e rola até ele de forma suave
    card.classList.remove('hidden');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Oculta a janela de detalhes do calendário (v1.3.2)
function closeCalendarDayDetails() {
    const card = document.getElementById('calendar-day-details-card');
    if (card) {
        card.classList.add('hidden');
    }
}

// Carrega os logs de peso do localStorage
function loadWeightLogs() {
    const logs = localStorage.getItem('gigaTracker_weightLogs');
    if (logs) return JSON.parse(logs);
    
    // Se não existir, inicializa com os pesos pré-carregados dos treinos (v1.3.9)
    const initialLogs = [
        { date: Date.parse('2026-06-02T12:00:00'), weight: 69.0, note: "" },
        { date: Date.parse('2026-06-01T12:00:00'), weight: 69.0, note: "" },
        { date: Date.parse('2026-05-28T12:00:00'), weight: 69.0, note: "" },
        { date: Date.parse('2026-05-26T12:00:00'), weight: 69.0, note: "" },
        { date: Date.parse('2026-05-25T12:00:00'), weight: 69.0, note: "" }
    ];
    localStorage.setItem('gigaTracker_weightLogs', JSON.stringify(initialLogs));
    return initialLogs;
}

// Recupera o peso corporal mais recente registrado (v1.3.4)
function getCurrentBodyWeight() {
    const logs = loadWeightLogs();
    if (logs.length === 0) return null;
    // O array está ordenado do mais novo para o mais antigo, logo o índice 0 é o mais recente
    return logs[0].weight;
}

// Registra uma nova medição de peso corporal
function logBodyWeight() {
    const weightInput = document.getElementById('body-weight-input');
    const noteInput = document.getElementById('body-weight-note');
    
    if (!weightInput || !weightInput.value) {
        alert("Por favor, preencha o valor do peso em kg!");
        return;
    }
    
    const weightVal = parseFloat(weightInput.value);
    if (isNaN(weightVal) || weightVal <= 0) {
        alert("Por favor, digite um peso corporal válido!");
        return;
    }
    
    const noteVal = noteInput ? noteInput.value : '';
    
    const logs = loadWeightLogs();
    
    const newLog = {
        id: 'weight_' + Date.now(),
        date: Date.now(),
        weight: weightVal,
        note: noteVal.trim()
    };
    
    logs.unshift(newLog); // Mais recente no início
    localStorage.setItem('gigaTracker_weightLogs', JSON.stringify(logs));
    
    // Limpa campos
    weightInput.value = '';
    if (noteInput) noteInput.value = '';
    
    // Atualiza lista na tela
    renderWeightHistory();
}

// Renderiza a lista de histórico de peso com variações automáticas
function renderWeightHistory() {
    const container = document.getElementById('weight-log-container');
    if (!container) return;
    
    const logs = loadWeightLogs();
    
    if (logs.length === 0) {
        container.innerHTML = `
            <div style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 24px 10px;">
                Nenhum peso registrado ainda. Monitore sua evolução!
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    logs.forEach((log, index) => {
        const date = new Date(log.date);
        const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Calcula a variação de peso comparando com o log cronologicamente anterior
        // Como a lista está ordenada do mais novo para o mais antigo, o anterior é o do index + 1
        let diffText = '—';
        let diffColor = 'var(--text-muted)';
        
        if (index + 1 < logs.length) {
            const prevLog = logs[index + 1];
            const diff = log.weight - prevLog.weight;
            
            if (diff > 0) {
                diffText = `+${diff.toFixed(1)} kg`;
                diffColor = '#fb923c'; // Laranja para ganho sutil
            } else if (diff < 0) {
                diffText = `${diff.toFixed(1)} kg`;
                diffColor = '#34d399'; // Verde esmeralda para perda sutil (ótimo para definição)
            } else {
                diffText = `0.0 kg`;
                diffColor = 'var(--text-secondary)';
            }
        }
        
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.background = 'rgba(255, 255, 255, 0.015)';
        row.style.border = '1px solid var(--border-color)';
        row.style.borderRadius = '10px';
        row.style.padding = '8px 12px';
        row.style.fontSize = '12px';
        row.style.marginBottom = '6px';
        
        row.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 2px;">
                <div style="font-family: var(--font-heading); font-size: 13px; font-weight: 800; color: var(--text-primary);">${log.weight.toFixed(1)} kg</div>
                <div style="font-size: 9px; color: var(--text-muted);">${formattedDate}</div>
            </div>
            ${log.note ? `<div style="font-size: 11px; color: var(--text-secondary); font-style: italic; max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0 8px;">"${log.note}"</div>` : ''}
            <div style="font-family: var(--font-heading); font-weight: 800; color: ${diffColor}; text-align: right; min-width: 55px;">${diffText}</div>
        `;
        
        container.appendChild(row);
    });
}

// Carrega o histórico do localStorage
function loadHistory() {
    const history = localStorage.getItem('gigaTracker_history');
    if (history) {
        return JSON.parse(history);
    }
    
    // Se não houver histórico, inicializa com a semente inicial (v1.3.9)
    const initialHistory = getInitialHistorySeed();
    localStorage.setItem('gigaTracker_history', JSON.stringify(initialHistory));
    
    // Inicializa os parâmetros de última carga e repetições de referência
    seedInitialLastParameters();
    
    // Força a atualização dos logs de peso corporal para sincronizar com o histórico inicial
    loadWeightLogs();
    
    return initialHistory;
}

function getInitialHistorySeed() {
    return [
        {
            id: 'workout_initial_push_2',
            letter: 'push_1',
            name: 'PUSH',
            date: Date.parse('2026-06-02T12:00:00'),
            duration: '37 min',
            completedSetsCount: 40,
            totalVolume: 6984,
            notes: '',
            bodyWeight: 69.0,
            exercises: [
                {
                    name: 'Supino Inclinado (Halteres)',
                    sets: [
                        { setNum: 1, completed: true, weight: '14 kg', reps: 12 },
                        { setNum: 2, completed: true, weight: '16 kg', reps: 10 },
                        { setNum: 3, completed: true, weight: '16 kg', reps: 10 },
                        { setNum: 4, completed: true, weight: '14 kg', reps: 10 }
                    ]
                },
                {
                    name: 'Supino Reto (Barra)',
                    sets: [
                        { setNum: 1, completed: true, weight: '20 kg', reps: 3 },
                        { setNum: 2, completed: true, weight: '20 kg', reps: 5 },
                        { setNum: 3, completed: true, weight: '20 kg', reps: 4 },
                        { setNum: 4, completed: true, weight: '20 kg', reps: 2 }
                    ]
                },
                {
                    name: 'Paralelas',
                    sets: [
                        { setNum: 1, completed: true, weight: '6 kg', reps: 8 },
                        { setNum: 2, completed: true, weight: '6 kg', reps: 6 },
                        { setNum: 3, completed: true, weight: '6 kg', reps: 4 },
                        { setNum: 4, completed: true, weight: '6 kg', reps: 4 }
                    ]
                },
                {
                    name: 'Crossover Polia Alta',
                    sets: [
                        { setNum: 1, completed: true, weight: '15 kg', reps: 8 },
                        { setNum: 2, completed: true, weight: '15 kg', reps: 7 },
                        { setNum: 3, completed: true, weight: '15 kg', reps: 9 },
                        { setNum: 4, completed: true, weight: '15 kg', reps: 7 }
                    ]
                },
                {
                    name: 'Crossover Polia Baixa',
                    sets: [
                        { setNum: 1, completed: true, weight: '11 kg', reps: 9 },
                        { setNum: 2, completed: true, weight: '11 kg', reps: 9 },
                        { setNum: 3, completed: true, weight: '11 kg', reps: 9 },
                        { setNum: 4, completed: true, weight: '11 kg', reps: 8 }
                    ]
                },
                {
                    name: 'Desenvolvimento Sentado',
                    sets: [
                        { setNum: 1, completed: true, weight: '10 kg', reps: 11 },
                        { setNum: 2, completed: true, weight: '10 kg', reps: 9 },
                        { setNum: 3, completed: true, weight: '10 kg', reps: 7 },
                        { setNum: 4, completed: true, weight: '10 kg', reps: 7 }
                    ]
                },
                {
                    name: 'Elevação Lateral',
                    sets: [
                        { setNum: 1, completed: true, weight: '9 kg', reps: 9 },
                        { setNum: 2, completed: true, weight: '9 kg', reps: 9 },
                        { setNum: 3, completed: true, weight: '9 kg', reps: 9 },
                        { setNum: 4, completed: true, weight: '9 kg', reps: 9 }
                    ]
                },
                {
                    name: 'Tríceps Corda (Polia)',
                    sets: [
                        { setNum: 1, completed: true, weight: '20 kg', reps: 12 },
                        { setNum: 2, completed: true, weight: '25 kg', reps: 10 },
                        { setNum: 3, completed: true, weight: '20 kg', reps: 9 },
                        { setNum: 4, completed: true, weight: '20 kg', reps: 8 }
                    ]
                },
                {
                    name: 'Tríceps Francês (Sentado)',
                    sets: [
                        { setNum: 1, completed: true, weight: '15 kg', reps: 8 },
                        { setNum: 2, completed: true, weight: '15 kg', reps: 10 },
                        { setNum: 3, completed: true, weight: '15 kg', reps: 9 },
                        { setNum: 4, completed: true, weight: '15 kg', reps: 8 }
                    ]
                },
                {
                    name: 'Abdominal na Barra Fixa',
                    sets: [
                        { setNum: 1, completed: true, weight: 'Peso corporal', reps: 15 },
                        { setNum: 2, completed: true, weight: 'Peso corporal', reps: 10 },
                        { setNum: 3, completed: true, weight: 'Peso corporal', reps: 9 },
                        { setNum: 4, completed: true, weight: 'Peso corporal', reps: 7 }
                    ]
                }
            ]
        },
        {
            id: 'workout_initial_legs_2',
            letter: 'legs_1',
            name: 'LEGS & CORE',
            date: Date.parse('2026-06-01T12:00:00'),
            duration: '52 min',
            completedSetsCount: 41,
            totalVolume: 16511,
            notes: '',
            bodyWeight: 69.0,
            exercises: [
                {
                    name: 'Elevação Pélvica (Ponte)',
                    sets: [
                        { setNum: 1, completed: true, weight: 'Peso corporal', reps: 12 },
                        { setNum: 2, completed: true, weight: 'Peso corporal', reps: 9 },
                        { setNum: 3, completed: true, weight: 'Peso corporal', reps: 12 },
                        { setNum: 4, completed: true, weight: 'Peso corporal', reps: 12 }
                    ]
                },
                {
                    name: 'Leg Press 45°',
                    sets: [
                        { setNum: 1, completed: true, weight: '80 kg', reps: 12 },
                        { setNum: 2, completed: true, weight: '80 kg', reps: 10 },
                        { setNum: 3, completed: true, weight: '80 kg', reps: 12 },
                        { setNum: 4, completed: true, weight: '80 kg', reps: 12 }
                    ]
                },
                {
                    name: 'Agachamento Ciclista',
                    sets: [
                        { setNum: 1, completed: true, weight: '18 kg', reps: 12 },
                        { setNum: 2, completed: true, weight: '18 kg', reps: 10 },
                        { setNum: 3, completed: true, weight: '18 kg', reps: 12 },
                        { setNum: 4, completed: true, weight: '18 kg', reps: 12 },
                        { setNum: 5, completed: true, weight: '35 kg', reps: 11 },
                        { setNum: 6, completed: true, weight: '35 kg', reps: 10 },
                        { setNum: 7, completed: true, weight: '35 kg', reps: 9 },
                        { setNum: 8, completed: true, weight: '35 kg', reps: 8 }
                    ]
                },
                {
                    name: 'Afundo com Halteres',
                    sets: [
                        { setNum: 1, completed: true, weight: '12 kg', reps: 12 },
                        { setNum: 2, completed: true, weight: '12 kg', reps: 10 },
                        { setNum: 3, completed: true, weight: '12 kg', reps: 10 }
                    ]
                },
                {
                    name: 'Stiff com Halteres',
                    sets: [
                        { setNum: 1, completed: true, weight: '14 kg', reps: 9 },
                        { setNum: 2, completed: true, weight: '14 kg', reps: 9 },
                        { setNum: 3, completed: true, weight: '14 kg', reps: 8 }
                    ]
                },
                {
                    name: 'Panturrilha em pé',
                    sets: [
                        { setNum: 1, completed: true, weight: '30 kg', reps: 10 },
                        { setNum: 2, completed: true, weight: '30 kg', reps: 10 },
                        { setNum: 3, completed: true, weight: '30 kg', reps: 10 },
                        { setNum: 4, completed: true, weight: '30 kg', reps: 10 },
                        { setNum: 5, completed: true, weight: '20 kg', reps: 10 },
                        { setNum: 6, completed: true, weight: '25 kg', reps: 10 },
                        { setNum: 7, completed: true, weight: '25 kg', reps: 10 },
                        { setNum: 8, completed: true, weight: '25 kg', reps: 10 },
                        { setNum: 9, completed: true, weight: '20 kg', reps: 10 },
                        { setNum: 10, completed: true, weight: '20 kg', reps: 10 },
                        { setNum: 11, completed: true, weight: '20 kg', reps: 10 },
                        { setNum: 12, completed: true, weight: '20 kg', reps: 10 }
                    ]
                },
                {
                    name: 'Stomach Vacuum',
                    sets: [
                        { setNum: 1, completed: true, weight: 'Tempo', reps: 30 },
                        { setNum: 2, completed: true, weight: 'Tempo', reps: 30 },
                        { setNum: 3, completed: true, weight: 'Tempo', reps: 30 }
                    ]
                },
                {
                    name: 'Banco Romano para Lombar',
                    sets: [
                        { setNum: 1, completed: true, weight: 'Peso corporal', reps: 12 },
                        { setNum: 2, completed: true, weight: 'Peso corporal', reps: 12 },
                        { setNum: 3, completed: true, weight: 'Peso corporal', reps: 12 },
                        { setNum: 4, completed: true, weight: 'Peso corporal', reps: 12 }
                    ]
                }
            ]
        },
        {
            id: 'workout_initial_pull_1',
            letter: 'pull_1',
            name: 'PULL',
            date: Date.parse('2026-05-28T12:00:00'),
            duration: '53 min',
            completedSetsCount: 34,
            totalVolume: 9362,
            notes: '',
            bodyWeight: 69.0,
            exercises: [
                {
                    name: 'Barra Fixa',
                    sets: [
                        { setNum: 1, completed: true, weight: '7 kg', reps: 10 },
                        { setNum: 2, completed: true, weight: '6 kg', reps: 10 },
                        { setNum: 3, completed: true, weight: '6 kg', reps: 7 },
                        { setNum: 4, completed: true, weight: '6 kg', reps: 6 }
                    ]
                },
                {
                    name: 'Puxada Alta (Polia)',
                    sets: [
                        { setNum: 1, completed: true, weight: '35 kg', reps: 12 },
                        { setNum: 2, completed: true, weight: '40 kg', reps: 8 },
                        { setNum: 3, completed: true, weight: '40 kg', reps: 8 },
                        { setNum: 4, completed: true, weight: '40 kg', reps: 7 }
                    ]
                },
                {
                    name: 'Remada Serrote (Halter)',
                    sets: [
                        { setNum: 1, completed: true, weight: '20 kg', reps: 11 },
                        { setNum: 2, completed: true, weight: '20 kg', reps: 12 },
                        { setNum: 3, completed: true, weight: '20 kg', reps: 11 },
                        { setNum: 4, completed: true, weight: '20 kg', reps: 10 }
                    ]
                },
                {
                    name: 'Crucifixo Reverso (Banco Inclinado)',
                    sets: [
                        { setNum: 1, completed: true, weight: '8 kg', reps: 12 },
                        { setNum: 2, completed: true, weight: '8 kg', reps: 12 },
                        { setNum: 3, completed: true, weight: '8 kg', reps: 12 },
                        { setNum: 4, completed: true, weight: '8 kg', reps: 12 }
                    ]
                },
                {
                    name: 'Face Pull (Corda)',
                    sets: [
                        { setNum: 1, completed: true, weight: '25 kg', reps: 12 },
                        { setNum: 2, completed: true, weight: '30 kg', reps: 12 },
                        { setNum: 3, completed: true, weight: '25 kg', reps: 12 }
                    ]
                },
                {
                    name: 'Rosca Martelo (Halteres)',
                    sets: [
                        { setNum: 1, completed: true, weight: '8 kg', reps: 12 },
                        { setNum: 2, completed: true, weight: '10 kg', reps: 8 },
                        { setNum: 3, completed: true, weight: '10 kg', reps: 7 },
                        { setNum: 4, completed: true, weight: '10 kg', reps: 7 },
                        { setNum: 5, completed: true, weight: '9 kg', reps: 10 },
                        { setNum: 6, completed: true, weight: '9 kg', reps: 10 },
                        { setNum: 7, completed: true, weight: '9 kg', reps: 9 },
                        { setNum: 8, completed: true, weight: '9 kg', reps: 7 }
                    ]
                },
                {
                    name: 'Abdominal (Prancha Lateral)',
                    sets: [
                        { setNum: 1, completed: true, weight: 'Tempo', reps: 38 },
                        { setNum: 2, completed: true, weight: 'Tempo', reps: 38 },
                        { setNum: 3, completed: true, weight: 'Tempo', reps: 38 }
                    ]
                },
                {
                    name: 'Abdominal Declinado',
                    sets: [
                        { setNum: 1, completed: true, weight: 'Peso corporal', reps: 16 },
                        { setNum: 2, completed: true, weight: 'Peso corporal', reps: 20 },
                        { setNum: 3, completed: true, weight: 'Peso corporal', reps: 20 },
                        { setNum: 4, completed: true, weight: 'Peso corporal', reps: 10 }
                    ]
                }
            ]
        },
        {
            id: 'workout_initial_push_1',
            letter: 'push_1',
            name: 'PUSH',
            date: Date.parse('2026-05-26T12:00:00'),
            duration: '60 min',
            completedSetsCount: 33,
            totalVolume: 3490,
            notes: '',
            bodyWeight: 69.0,
            exercises: [
                {
                    name: 'Supino Inclinado (Halteres)',
                    sets: [
                        { setNum: 1, completed: true, weight: '16 kg', reps: 6 },
                        { setNum: 2, completed: true, weight: '16 kg', reps: 5 },
                        { setNum: 3, completed: true, weight: '16 kg', reps: 5 },
                        { setNum: 4, completed: true, weight: '16 kg', reps: 4 }
                    ]
                },
                {
                    name: 'Supino Reto (Barra)',
                    sets: [
                        { setNum: 1, completed: true, weight: '20 kg', reps: 6 },
                        { setNum: 2, completed: true, weight: '20 kg', reps: 5 },
                        { setNum: 3, completed: true, weight: '20 kg', reps: 5 },
                        { setNum: 4, completed: true, weight: '20 kg', reps: 4 }
                    ]
                },
                {
                    name: 'Paralelas',
                    sets: [
                        { setNum: 1, completed: true, weight: '7 kg', reps: 8 },
                        { setNum: 2, completed: true, weight: '7 kg', reps: 8 },
                        { setNum: 3, completed: true, weight: '7 kg', reps: 8 }
                    ]
                },
                {
                    name: 'Crossover Polia Alta',
                    sets: [
                        { setNum: 1, completed: true, weight: '15 kg', reps: 10 },
                        { setNum: 2, completed: true, weight: '15 kg', reps: 10 },
                        { setNum: 3, completed: true, weight: '15 kg', reps: 10 },
                        { setNum: 4, completed: true, weight: '15 kg', reps: 10 }
                    ]
                },
                {
                    name: 'Crossover Polia Baixa',
                    sets: [
                        { setNum: 1, completed: true, weight: '11 kg', reps: 8 },
                        { setNum: 2, completed: true, weight: '11 kg', reps: 8 },
                        { setNum: 3, completed: true, weight: '11 kg', reps: 8 },
                        { setNum: 4, completed: true, weight: '11 kg', reps: 8 }
                    ]
                },
                {
                    name: 'Desenvolvimento Sentado',
                    sets: [
                        { setNum: 1, completed: true, weight: '10 kg', reps: 12 },
                        { setNum: 2, completed: true, weight: '10 kg', reps: 12 },
                        { setNum: 3, completed: true, weight: '10 kg', reps: 10 },
                        { setNum: 4, completed: true, weight: '10 kg', reps: 8 }
                    ]
                },
                {
                    name: 'Elevação Lateral',
                    sets: [
                        { setNum: 1, completed: true, weight: '9 kg', reps: 8 },
                        { setNum: 2, completed: true, weight: '9 kg', reps: 8 },
                        { setNum: 3, completed: true, weight: '9 kg', reps: 8 },
                        { setNum: 4, completed: true, weight: '9 kg', reps: 6 }
                    ]
                },
                {
                    name: 'Tríceps Corda (Polia)',
                    sets: [
                        { setNum: 1, completed: true, weight: '25 kg', reps: 8 },
                        { setNum: 2, completed: true, weight: '25 kg', reps: 8 },
                        { setNum: 3, completed: true, weight: '25 kg', reps: 8 }
                    ]
                },
                {
                    name: 'Tríceps Francês (Sentado)',
                    sets: [
                        { setNum: 1, completed: true, weight: '15 kg', reps: 8 },
                        { setNum: 2, completed: true, weight: '15 kg', reps: 8 },
                        { setNum: 3, completed: true, weight: '15 kg', reps: 8 }
                    ]
                }
            ]
        },
        {
            id: 'workout_initial_legs_1',
            letter: 'legs_1',
            name: 'LEGS & CORE',
            date: Date.parse('2026-05-25T12:00:00'),
            duration: '75 min',
            completedSetsCount: 34,
            totalVolume: 16078,
            notes: '',
            bodyWeight: 69.0,
            exercises: [
                {
                    name: 'Elevação Pélvica (Ponte)',
                    sets: [
                        { setNum: 1, completed: true, weight: 'Peso corporal', reps: 10 },
                        { setNum: 2, completed: true, weight: 'Peso corporal', reps: 10 },
                        { setNum: 3, completed: true, weight: 'Peso corporal', reps: 10 }
                    ]
                },
                {
                    name: 'Leg Press 45°',
                    sets: [
                        { setNum: 1, completed: true, weight: '80 kg', reps: 12 },
                        { setNum: 2, completed: true, weight: '80 kg', reps: 12 },
                        { setNum: 3, completed: true, weight: '80 kg', reps: 12 },
                        { setNum: 4, completed: true, weight: '80 kg', reps: 12 }
                    ]
                },
                {
                    name: 'Agachamento Ciclista',
                    sets: [
                        { setNum: 1, completed: true, weight: '16 kg', reps: 11 },
                        { setNum: 2, completed: true, weight: '16 kg', reps: 11 },
                        { setNum: 3, completed: true, weight: '16 kg', reps: 11 }
                    ]
                },
                {
                    name: 'Afundo com Halteres',
                    sets: [
                        { setNum: 1, completed: true, weight: '12 kg', reps: 10 },
                        { setNum: 2, completed: true, weight: '12 kg', reps: 10 },
                        { setNum: 3, completed: true, weight: '12 kg', reps: 10 }
                    ]
                },
                {
                    name: 'Stiff com Halteres',
                    sets: [
                        { setNum: 1, completed: true, weight: '16 kg', reps: 10 },
                        { setNum: 2, completed: true, weight: '16 kg', reps: 10 },
                        { setNum: 3, completed: true, weight: '16 kg', reps: 10 },
                        { setNum: 4, completed: true, weight: '16 kg', reps: 10 }
                    ]
                },
                {
                    name: 'Panturrilha em pé',
                    sets: [
                        { setNum: 1, completed: true, weight: '30 kg', reps: 18 },
                        { setNum: 2, completed: true, weight: '30 kg', reps: 18 },
                        { setNum: 3, completed: true, weight: '30 kg', reps: 18 },
                        { setNum: 4, completed: true, weight: '30 kg', reps: 18 },
                        { setNum: 5, completed: true, weight: '30 kg', reps: 18 },
                        { setNum: 6, completed: true, weight: '30 kg', reps: 18 },
                        { setNum: 7, completed: true, weight: '30 kg', reps: 18 },
                        { setNum: 8, completed: true, weight: '30 kg', reps: 18 },
                        { setNum: 9, completed: true, weight: '30 kg', reps: 18 }
                    ]
                },
                {
                    name: 'Stomach Vacuum',
                    sets: [
                        { setNum: 1, completed: true, weight: 'Tempo', reps: 30 },
                        { setNum: 2, completed: true, weight: 'Tempo', reps: 30 },
                        { setNum: 3, completed: true, weight: 'Tempo', reps: 30 },
                        { setNum: 4, completed: true, weight: 'Tempo', reps: 30 }
                    ]
                },
                {
                    name: 'Banco Romano para Lombar',
                    sets: [
                        { setNum: 1, completed: true, weight: 'Peso corporal', reps: 12 },
                        { setNum: 2, completed: true, weight: 'Peso corporal', reps: 12 },
                        { setNum: 3, completed: true, weight: 'Peso corporal', reps: 12 },
                        { setNum: 4, completed: true, weight: 'Peso corporal', reps: 12 }
                    ]
                }
            ]
        }
    ];
}

function seedInitialLastParameters() {
    // Push (push_1)
    const pushWeights = {
        "sup_inc_halt": ["14 kg", "16 kg", "16 kg", "14 kg"],
        "sup_reto_bar": ["20 kg", "20 kg", "20 kg", "20 kg"],
        "paralelas": ["6 kg", "6 kg", "6 kg", "6 kg"],
        "cross_alta": ["15 kg", "15 kg", "15 kg", "15 kg"],
        "cross_baixa": ["11 kg", "11 kg", "11 kg", "11 kg"],
        "desenv_sent": ["10 kg", "10 kg", "10 kg", "10 kg"],
        "elev_lateral": ["9 kg", "9 kg", "9 kg", "9 kg"],
        "tricep_corda": ["20 kg", "25 kg", "20 kg", "20 kg"],
        "tricep_franc": ["15 kg", "15 kg", "15 kg", "15 kg"],
        "abdominal_barra_fixa": ["Peso corporal", "Peso corporal", "Peso corporal", "Peso corporal"]
    };
    const pushReps = {
        "sup_inc_halt": [12, 10, 10, 10],
        "sup_reto_bar": [3, 5, 4, 2],
        "paralelas": [8, 6, 4, 4],
        "cross_alta": [8, 7, 9, 7],
        "cross_baixa": [9, 9, 9, 8],
        "desenv_sent": [11, 9, 7, 7],
        "elev_lateral": [9, 9, 9, 9],
        "tricep_corda": [12, 10, 9, 8],
        "tricep_franc": [8, 10, 9, 8],
        "abdominal_barra_fixa": [15, 10, 9, 7]
    };
    localStorage.setItem('gigaTracker_lastWeights_push_1', JSON.stringify(pushWeights));
    localStorage.setItem('gigaTracker_lastReps_push_1', JSON.stringify(pushReps));

    // Legs (legs_1)
    const legsWeights = {
        "elev_pelvica": ["Peso corporal", "Peso corporal", "Peso corporal", "Peso corporal"],
        "leg_press_45": ["80 kg", "80 kg", "80 kg", "80 kg"],
        "agach_ciclista": ["18 kg", "18 kg", "18 kg", "18 kg", "35 kg", "35 kg", "35 kg", "35 kg"],
        "afundo_halt": ["12 kg", "12 kg", "12 kg"],
        "stiff_halt": ["14 kg", "14 kg", "14 kg"],
        "panturrilha_pe": ["30 kg", "30 kg", "30 kg", "30 kg", "20 kg", "25 kg", "25 kg", "25 kg", "20 kg", "20 kg", "20 kg", "20 kg"],
        "stomach_vacuum": ["Tempo", "Tempo", "Tempo"],
        "banco_romano_lombar": ["Peso corporal", "Peso corporal", "Peso corporal", "Peso corporal"]
    };
    const legsReps = {
        "elev_pelvica": [12, 9, 12, 12],
        "leg_press_45": [12, 10, 12, 12],
        "agach_ciclista": [12, 10, 12, 12, 11, 10, 9, 8],
        "afundo_halt": [12, 10, 10],
        "stiff_halt": [9, 9, 8],
        "panturrilha_pe": [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        "stomach_vacuum": [30, 30, 30],
        "banco_romano_lombar": [12, 12, 12, 12]
    };
    localStorage.setItem('gigaTracker_lastWeights_legs_1', JSON.stringify(legsWeights));
    localStorage.setItem('gigaTracker_lastReps_legs_1', JSON.stringify(legsReps));

    // Pull (pull_1)
    const pullWeights = {
        "barra_fixa": ["7 kg", "6 kg", "6 kg", "6 kg"],
        "puxada_alta": ["35 kg", "40 kg", "40 kg", "40 kg"],
        "remada_serrote": ["20 kg", "20 kg", "20 kg", "20 kg"],
        "crucifixo_inv": ["8 kg", "8 kg", "8 kg", "8 kg"],
        "face_pull": ["25 kg", "30 kg", "25 kg"],
        "rosca_martelo": ["8 kg", "10 kg", "10 kg", "10 kg", "9 kg", "9 kg", "9 kg", "9 kg"],
        "abdominal_prancha": ["Tempo", "Tempo", "Tempo"],
        "abdominal_dec": ["Peso corporal", "Peso corporal", "Peso corporal", "Peso corporal"]
    };
    const pullReps = {
        "barra_fixa": [10, 10, 7, 6],
        "puxada_alta": [12, 8, 8, 7],
        "remada_serrote": [11, 12, 11, 10],
        "crucifixo_inv": [12, 12, 12, 12],
        "face_pull": [12, 12, 12],
        "rosca_martelo": [12, 8, 7, 7, 10, 10, 9, 7],
        "abdominal_prancha": [38, 38, 38],
        "abdominal_dec": [16, 20, 20, 10]
    };
    localStorage.setItem('gigaTracker_lastWeights_pull_1', JSON.stringify(pullWeights));
    localStorage.setItem('gigaTracker_lastReps_pull_1', JSON.stringify(pullReps));
}

// Adiciona um treino concluído ao histórico
function saveToHistory(workoutRecord) {
    const history = loadHistory();
    history.unshift(workoutRecord); // Adiciona no início (mais recente primeiro)
    localStorage.setItem('gigaTracker_history', JSON.stringify(history));
}

// Renderiza a lista de histórico na tela
function renderHistory() {
    const container = document.getElementById('history-list-container');
    if (!container) return;
    
    const history = loadHistory();
    
    if (history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                </svg>
                <p>Nenhum treino salvo no histórico ainda. Complete seu primeiro treino!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    history.forEach(item => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('pt-BR', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const themeLetter = getWorkoutThemeLetter(item);
        const card = document.createElement('div');
        card.className = `history-card glass type-${themeLetter}`;
        
        let exercisesSummary = '';
        item.exercises.forEach(ex => {
            const completedSets = ex.sets.filter(s => s.completed);
            const isDouble = ex.isDoubleWeight !== undefined ? ex.isDoubleWeight : isExerciseDoubleWeight(ex);
            if (completedSets.length > 0) {
                const seriesDetails = completedSets.map(s => `${s.reps || 10}x ${s.weight}${isDouble ? ' (2x)' : ''}`).join(' | ');
                exercisesSummary += `<div>• <strong>${ex.name}:</strong> ${seriesDetails}${isDouble ? ' <span style="font-size: 10px; color: var(--theme-primary); font-weight: 700;">[2x cada lado]</span>' : ''}</div>`;
            }
        });
        
        card.innerHTML = `
            <div class="history-card-header" style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                <div class="history-card-title">
                    Treino ${themeLetter}
                    <span class="history-badge">${item.name}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="history-date">${formattedDate}</div>
                    <button type="button" onclick="openEditHistoryModal('${item.id}')" style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-secondary); width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all var(--transition-fast);" title="Editar treino">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                    <button type="button" onclick="deleteHistoryRecord('${item.id}')" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 6px; color: #f87171; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all var(--transition-fast);" title="Excluir treino">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="history-card-meta">
                <span>Duração: <strong>${item.duration}</strong></span>
                <span>Séries: <strong>${item.completedSetsCount} feitas</strong></span>
                <span>Volume Est: <strong>${item.totalVolume.toLocaleString('pt-BR')} kg</strong></span>
                ${item.bodyWeight ? `<span>Peso: <strong>${item.bodyWeight} kg</strong></span>` : ''}
            </div>
            <div style="font-size: 13px; line-height: 1.6; color: var(--text-secondary)">
                ${exercisesSummary}
            </div>
            ${item.notes ? `<div class="history-notes"><strong>Notas:</strong> "${item.notes}"</div>` : ''}
        `;
        
        container.appendChild(card);
    });
}

// Limpa todo o histórico de treinos
function clearAllHistory() {
    const confirmClear = confirm("Tem certeza que deseja apagar permanentemente todo o seu histórico de treinos? Esta ação não pode ser desfeita.");
    if (confirmClear) {
        localStorage.removeItem('gigaTracker_history');
        renderHistory();
        if (typeof renderCalendar === 'function') {
            renderCalendar(currentCalYear, currentCalMonth);
        }
    }
}

// ==========================================================================
// 8.2. REGISTRO RETROATIVO DE TREINOS (v1.3)
// ==========================================================================

// Exibe/oculta o formulário de lançamento retroativo
function togglePastWorkoutForm(show) {
    const card = document.getElementById('past-workout-form-card');
    if (!card) return;
    
    if (show) {
        card.classList.remove('hidden');
        
        // Configura a data máxima como hoje para evitar treinos futuros
        const dateInput = document.getElementById('past-workout-date');
        if (dateInput) {
            const todayStr = new Date().toISOString().split('T')[0];
            dateInput.max = todayStr;
            
            // Configura ontem como data padrão
            const yesterday = new Date(Date.now() - 86400000);
            dateInput.value = yesterday.toISOString().split('T')[0];
        }
        
        // Limpa campos
        const durInput = document.getElementById('past-workout-duration');
        if (durInput) durInput.value = '';
        
        const notesInput = document.getElementById('past-workout-notes');
        if (notesInput) notesInput.value = '';
        
        // Popula o seletor de treinos dinamicamente com optgroups (v1.3.8)
        const select = document.getElementById('past-workout-select');
        if (select) {
            select.innerHTML = '';
            const categories = ['Push', 'Pull', 'Legs'];
            categories.forEach(cat => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = cat;
                const catWorkouts = Object.entries(WORKOUTS_DATABASE)
                    .filter(([id, w]) => w.category === cat)
                    .map(([id, w]) => ({ id, ...w }));
                catWorkouts.forEach(w => {
                    const opt = document.createElement('option');
                    opt.value = w.id;
                    opt.textContent = w.name;
                    optgroup.appendChild(opt);
                });
                if (catWorkouts.length > 0) {
                    select.appendChild(optgroup);
                }
            });
        }
    } else {
        card.classList.add('hidden');
    }
}



// Processa e salva o registro retroativo no histórico
function savePastWorkoutRecord() {
    const dateInput = document.getElementById('past-workout-date');
    const durInput = document.getElementById('past-workout-duration');
    const notesInput = document.getElementById('past-workout-notes');
    
    if (!dateInput || !durInput) return;
    
    const dateVal = dateInput.value;
    const durVal = parseInt(durInput.value);
    const notesVal = notesInput ? notesInput.value.trim() : '';
    
    if (!dateVal) {
        alert("Por favor, selecione a data em que o treino foi realizado.");
        return;
    }
    
    if (!durVal || durVal <= 0) {
        alert("Por favor, informe uma duração válida em minutos.");
        return;
    }
    
    const select = document.getElementById('past-workout-select');
    if (!select) return;
    const letter = select.value;
    const workoutDef = WORKOUTS_DATABASE[letter];
    if (!workoutDef) return;
    
    // Recupera cargas do último treino realizado para manter o diário correto e poupar digitação
    const lastWeights = getLastCompletedWeights(letter);
    
    let totalCompletedSets = 0;
    let estimatedVolume = 0;
    
    // Mapeia exercícios considerando todas as séries completadas
    const exercisesArray = workoutDef.exercises.map(ex => {
        const lastSessionWeights = lastWeights[ex.id] || [];
        const setsArray = [];
        const isDouble = isExerciseDoubleWeight(ex);
        const repsVal = parseReps(ex.reps);
        
        for (let i = 0; i < ex.sets; i++) {
            // Puxa o último peso registrado ou o peso padrão do exercício
            const weight = lastSessionWeights[i] !== undefined ? lastSessionWeights[i] : ex.defaultWeight;
            setsArray.push({
                setNum: i + 1,
                completed: true,
                weight: weight,
                reps: repsVal
            });
            
            totalCompletedSets++;
            
            // Incrementa o volume estimado
            const weightVal = extractNumericWeight(weight, isDouble);
            estimatedVolume += (weightVal * repsVal);
        }
        
        return {
            name: ex.name,
            isDoubleWeight: isDouble,
            sets: setsArray
        };
    });
    
    // Evita dessincronizações de fuso horário local definindo o horário às 12:00 do dia escolhido
    const timestamp = Date.parse(dateVal + 'T12:00:00');
    
    const workoutRecord = {
        id: 'workout_' + Date.now() + Math.random().toString(36).substr(2, 5),
        letter: letter,
        name: workoutDef.name,
        date: timestamp,
        duration: durVal + " min",
        completedSetsCount: totalCompletedSets,
        totalVolume: estimatedVolume,
        notes: notesVal,
        bodyWeight: getCurrentBodyWeight(), // Peso corporal associado (v1.3.4)
        exercises: exercisesArray
    };
    
    // Salva no localStorage do histórico
    saveToHistory(workoutRecord);
    
    // Oculta o formulário de lançamento retroativo
    togglePastWorkoutForm(false);
    
    // Atualiza a visualização do histórico na tela
    renderHistory();
    
    // Se o calendário estiver visível na aba de evolução, atualiza-o
    if (typeof renderCalendar === 'function') {
        renderCalendar(currentCalYear, currentCalMonth);
    }
    
    alert("Treino " + letter + " (" + workoutDef.name + ") lançado no seu histórico com sucesso!");
}

// ==========================================================================
// 8.3. MOTOR DE EDIÇÃO DE TREINOS DO HISTÓRICO (v1.3.4)
// ==========================================================================

// Abre o modal de edição carregando os dados do treino pelo ID
function openEditHistoryModal(id) {
    const history = loadHistory();
    const workout = history.find(h => h.id === id);
    if (!workout) return;
    
    // Configura inputs principais
    document.getElementById('edit-workout-id').value = id;
    
    // Formata a data para YYYY-MM-DD
    const itemDate = new Date(workout.date);
    const yyyy = itemDate.getFullYear();
    const mm = (itemDate.getMonth() + 1).toString().padStart(2, '0');
    const dd = itemDate.getDate().toString().padStart(2, '0');
    document.getElementById('edit-workout-date').value = `${yyyy}-${mm}-${dd}`;
    
    // Configura duração, notas e peso
    const durMatch = workout.duration.match(/\d+/);
    document.getElementById('edit-workout-duration').value = durMatch ? parseInt(durMatch[0]) : 45;
    document.getElementById('edit-workout-notes').value = workout.notes || '';
    document.getElementById('edit-workout-weight').value = workout.bodyWeight || '';
    
    // Constrói inputs para edição de cargas de cada exercício
    const container = document.getElementById('edit-workout-exercises-container');
    if (container) {
        container.innerHTML = '';
        workout.exercises.forEach((ex, idx) => {
            const completedSets = ex.sets.filter(s => s.completed);
            const weightsStr = completedSets.map(s => `${s.reps || 10}x ${s.weight}`).join(' | ');
            
            const row = document.createElement('div');
            row.style.display = 'grid';
            row.style.gridTemplateColumns = '1fr 1fr';
            row.style.gap = '10px';
            row.style.alignItems = 'center';
            row.style.marginBottom = '8px';
            
            row.innerHTML = `
                <span style="font-size: 12px; font-weight: 700; color: var(--text-secondary); word-break: break-word;">${ex.name}</span>
                <input type="text" class="edit-ex-weight-input" data-index="${idx}" value="${weightsStr}" placeholder="Ex: 10x 20 kg | 8x 22 kg" style="background: rgba(0, 0, 0, 0.25); border: 1px solid var(--border-color); border-radius: 8px; padding: 6px 10px; color: var(--text-primary); font-family: var(--font-body); font-size: 12px; outline: none; width: 100%;">
            `;
            container.appendChild(row);
        });
    }
    
    // Abre o modal
    const modal = document.getElementById('edit-history-modal');
    if (modal) modal.classList.remove('hidden');
}

// Fecha o modal de edição de histórico
function closeEditHistoryModal() {
    const modal = document.getElementById('edit-history-modal');
    if (modal) modal.classList.add('hidden');
}

// Salva as alterações feitas no registro de treino e atualiza as visualizações
function saveEditedHistoryRecord() {
    const id = document.getElementById('edit-workout-id').value;
    const dateVal = document.getElementById('edit-workout-date').value;
    const durVal = parseInt(document.getElementById('edit-workout-duration').value);
    const notesVal = document.getElementById('edit-workout-notes').value.trim();
    const weightVal = document.getElementById('edit-workout-weight').value;
    
    if (!dateVal) {
        alert("Por favor, preencha uma data válida.");
        return;
    }
    if (!durVal || durVal <= 0) {
        alert("Por favor, preencha uma duração válida.");
        return;
    }
    
    const history = loadHistory();
    const idx = history.findIndex(h => h.id === id);
    if (idx === -1) return;
    
    const item = history[idx];
    
    // Atualiza metadados básicos
    item.date = Date.parse(dateVal + 'T12:00:00');
    item.duration = durVal + ' min';
    item.notes = notesVal;
    item.bodyWeight = weightVal ? parseFloat(weightVal) : null;
    
    // Recalcula cargas de cada exercício com base nas caixas de texto
    const inputs = document.querySelectorAll('.edit-ex-weight-input');
    let totalCompletedSets = 0;
    let estimatedVolume = 0;
    
    inputs.forEach(input => {
        const exIdx = parseInt(input.dataset.index);
        const weightsText = input.value.trim();
        const ex = item.exercises[exIdx];
        if (ex) {
            // Divide por "|" ou por vírgula se o usuário usou outro delimitador comum
            const delimiter = weightsText.includes('|') ? '|' : ',';
            const weightsArray = weightsText.split(delimiter).map(s => s.trim()).filter(s => s.length > 0);
            
            const setsArray = [];
            weightsArray.forEach((w, setI) => {
                let repsVal = 10;
                let weightStr = w;
                
                // Encontra a definição original de repetições no banco de dados como fallback (v1.3.8)
                const workoutId = (item.letter === 'A' ? 'push_1' : item.letter === 'B' ? 'pull_1' : item.letter === 'C' ? 'legs_1' : item.letter);
                const dbWorkout = WORKOUTS_DATABASE[workoutId];
                if (dbWorkout) {
                    const dbEx = dbWorkout.exercises.find(e => e.name === ex.name);
                    if (dbEx) repsVal = parseReps(dbEx.reps);
                }
                
                // Se a série anterior do mesmo treino no histórico já tinha reps definidas, tenta usar como fallback inicial
                if (ex.sets && ex.sets[setI] && ex.sets[setI].reps) {
                    repsVal = ex.sets[setI].reps;
                }
                
                // Tenta capturar o formato "10x 20 kg" ou "12x Peso corporal"
                const matchRepsWeight = w.match(/^(\d+)\s*[xX]\s*(.+)$/);
                if (matchRepsWeight) {
                    repsVal = parseInt(matchRepsWeight[1], 10);
                    weightStr = matchRepsWeight[2].trim();
                }
                
                setsArray.push({
                    setNum: setI + 1,
                    completed: true,
                    weight: weightStr,
                    reps: repsVal
                });
                
                totalCompletedSets++;
                
                // Extrai peso e calcula volume estimado real
                const isDouble = ex.isDoubleWeight !== undefined ? ex.isDoubleWeight : isExerciseDoubleWeight(ex);
                const weightVal = extractNumericWeight(weightStr, isDouble);
                estimatedVolume += (weightVal * repsVal);
            });
            ex.sets = setsArray;
        }
    });
    
    item.completedSetsCount = totalCompletedSets;
    item.totalVolume = estimatedVolume;
    
    // Grava de volta no array de histórico
    history[idx] = item;
    localStorage.setItem('gigaTracker_history', JSON.stringify(history));
    
    // Fecha o modal
    closeEditHistoryModal();
    
    // Atualiza views
    renderHistory();
    
    if (typeof renderCalendar === 'function') {
        renderCalendar(currentCalYear, currentCalMonth);
    }
    
    // Se o contêiner de detalhes do dia do calendário estiver aberto na Evolução, atualiza-o localmente também!
    const savedD = new Date(item.date);
    if (typeof showCalendarDayDetails === 'function') {
        const detailsCard = document.getElementById('calendar-day-details-card');
        if (detailsCard && !detailsCard.classList.contains('hidden')) {
            showCalendarDayDetails(savedD.getFullYear(), savedD.getMonth(), savedD.getDate());
        }
    }
    
    alert("Registro de treino atualizado com sucesso!");
}

// Exclui permanentemente um registro de treino pelo ID (v1.3.6)
function deleteHistoryRecord(id) {
    const confirmDelete = confirm("Tem certeza que deseja excluir permanentemente este treino do seu histórico? Esta ação não pode ser desfeita.");
    if (!confirmDelete) return;
    
    const history = loadHistory();
    const idx = history.findIndex(h => h.id === id);
    if (idx === -1) return;
    
    const deletedItem = history[idx];
    const deletedDate = new Date(deletedItem.date);
    
    history.splice(idx, 1);
    localStorage.setItem('gigaTracker_history', JSON.stringify(history));
    
    // Atualiza as visualizações principais
    renderHistory();
    
    if (typeof renderCalendar === 'function') {
        renderCalendar(currentCalYear, currentCalMonth);
    }
    
    // Se o contêiner de detalhes do dia do calendário estiver aberto na Evolução, atualiza ou fecha
    const detailsCard = document.getElementById('calendar-day-details-card');
    if (detailsCard && !detailsCard.classList.contains('hidden')) {
        const remainingWorkoutsOnDay = history.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getFullYear() === deletedDate.getFullYear() &&
                   itemDate.getMonth() === deletedDate.getMonth() &&
                   itemDate.getDate() === deletedDate.getDate();
        });
        
        if (remainingWorkoutsOnDay.length === 0) {
            closeCalendarDayDetails();
        } else {
            showCalendarDayDetails(deletedDate.getFullYear(), deletedDate.getMonth(), deletedDate.getDate());
        }
    }
    
    alert("Treino excluído com sucesso!");
}

// ==========================================================================
// 9. MOTOR DE CONTEXTO E PARSER DE CARGAS / VOLUME
// ==========================================================================

// Salva a carga utilizada para preencher automaticamente no futuro
function saveLastUsedWeight(workoutLetter, exId, setIndex, weightText) {
    const key = `gigaTracker_lastWeights_${workoutLetter}`;
    const weights = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {};
    
    if (!weights[exId]) {
        weights[exId] = [];
    }
    
    weights[exId][setIndex] = weightText;
    localStorage.setItem(key, JSON.stringify(weights));
}

// Carrega as cargas da última sessão finalizada deste treino
function getLastCompletedWeights(workoutLetter) {
    const key = `gigaTracker_lastWeights_${workoutLetter}`;
    const weights = localStorage.getItem(key);
    return weights ? JSON.parse(weights) : {};
}

// Salva as repetições utilizadas para preencher automaticamente no futuro (v1.3.9)
function saveLastUsedReps(workoutLetter, exId, setIndex, repsText) {
    const key = `gigaTracker_lastReps_${workoutLetter}`;
    const reps = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {};
    
    if (!reps[exId]) {
        reps[exId] = [];
    }
    
    reps[exId][setIndex] = repsText;
    localStorage.setItem(key, JSON.stringify(reps));
}

// Carrega as repetições da última sessão finalizada deste treino (v1.3.9)
function getLastCompletedReps(workoutLetter) {
    const key = `gigaTracker_lastReps_${workoutLetter}`;
    const reps = localStorage.getItem(key);
    return reps ? JSON.parse(reps) : {};
}

// Salva o estado ativo do treino corrente no localStorage
function saveCurrentSessionState() {
    if (currentSession) {
        localStorage.setItem('gigaTracker_currentSession', JSON.stringify(currentSession));
    }
}

// Reinicia o progresso da sessão ativa atual do zero
function resetActiveWorkout() {
    const confirmReset = confirm("Deseja apagar o progresso deste treino ativo e começar do zero?");
    if (confirmReset) {
        initNewSession(currentWorkoutLetter);
    }
}

// Função inteligente para extrair o peso numérico de strings como "18 kg cada lado" ou "3 placas"
function extractNumericWeight(weightStr, isDouble = false) {
    if (!weightStr) return 0;
    
    // Tratamento especial para placas (multiplica por 10 fictício para fins de volume relativo)
    if (weightStr.toLowerCase().includes('placa')) {
        const match = weightStr.match(/\d+/);
        const base = match ? parseInt(match[0]) * 10 : 0;
        return isDouble ? base * 2 : base;
    }
    
    // Se for peso corporal
    if (weightStr.toLowerCase().includes('corpo') || weightStr.toLowerCase().includes('corporal') || weightStr.toLowerCase().includes('falha')) {
        return 75; // Peso corporal médio padrão fictício para volume
    }
    
    // Extrai o primeiro número encontrado na string
    const match = weightStr.match(/[\d.,]+/);
    if (!match) return 0;
    
    let value = parseFloat(match[0].replace(',', '.'));
    if (isNaN(value)) return 0;
    
    // Se especifica "cada lado" ou o exercício é bilateral (isDouble), dobra para calcular o volume real
    const strHasDouble = weightStr.toLowerCase().includes('lado') || weightStr.toLowerCase().includes('halter');
    if (isDouble || strHasDouble) {
        value = value * 2;
    }
    
    return value;
}

// Função inteligente para estimar repetições numéricas de textos como "5-6", "10-12" ou "Falha"
function parseReps(repsStr) {
    if (!repsStr) return 10;
    if (repsStr.toLowerCase().includes('falha') || repsStr.toLowerCase().includes('máximo') || repsStr.toLowerCase().includes('max')) {
        return 12; // Assume 12 reps para falhas na média de força
    }
    
    // Se for do tipo "10-12", pega a média de 11 reps
    if (repsStr.includes('-')) {
        const parts = repsStr.split('-');
        const val1 = parseInt(parts[0]);
        const val2 = parseInt(parts[1]);
        return (!isNaN(val1) && !isNaN(val2)) ? Math.round((val1 + val2) / 2) : 10;
    }
    
    const match = repsStr.match(/\d+/);
    return match ? parseInt(match[0]) : 10;
}

// ==========================================================================
// 10. GERAÇÃO DE RELATÓRIO E FINALIZAÇÃO
// ==========================================================================

// Prepara e abre o modal de conclusão do treino
function finishWorkout() {
    stopWorkoutTimer();
    
    // Sincroniza botões do Timer na UI para estado pausado
    const btnStart = document.getElementById('btn-start-workout');
    const btnStartText = document.getElementById('btn-start-text');
    const playIcon = document.getElementById('play-timer-icon');
    const pauseIcon = document.getElementById('pause-timer-icon');
    if (btnStart) {
        btnStart.className = "btn btn-sm btn-success";
        btnStartText.innerText = "Retomar Treino";
        btnStart.style.borderColor = "";
        btnStart.style.color = "";
    }
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
    
    // 1. Calcula estatísticas básicas
    const durationMins = Math.round(workoutSeconds / 60);
    const durationStr = durationMins > 0 ? `${durationMins} min` : `${workoutSeconds}s`;
    
    let totalCompletedSets = 0;
    let totalPossibleSets = 0;
    let estimatedVolume = 0;
    
    currentSession.exercises.forEach(ex => {
        totalPossibleSets += ex.sets.length;
        const isDouble = isExerciseDoubleWeight(ex);
        ex.sets.forEach(s => {
            if (s.completed) {
                totalCompletedSets++;
                
                const weightVal = extractNumericWeight(s.weight, isDouble);
                const repsVal = s.reps || parseReps(ex.reps);
                estimatedVolume += (weightVal * repsVal);
            }
        });
    });
    
    // Atualiza valores nas caixinhas do Modal
    document.getElementById('stat-workout-name').innerText = `Treino ${getWorkoutThemeLetter(currentSession)}`;
    document.getElementById('stat-duration').innerText = durationStr;
    document.getElementById('stat-sets').innerText = `${totalCompletedSets}/${totalPossibleSets}`;
    document.getElementById('stat-volume').innerText = `${estimatedVolume.toLocaleString('pt-BR')} kg`;
    
    // Data de hoje
    const dateText = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('report-date-text').innerText = dateText;
    
    // 2. Constrói o texto do relatório formatado
    const formattedReport = generateReportText(totalCompletedSets, durationStr, estimatedVolume);
    document.getElementById('report-text-pre').textContent = formattedReport;
    
    // Limpa o campo de notas
    document.getElementById('workout-notes').value = '';
    
    // Configura data padrão e limite máximo para o date picker do relatório (v1.3.1)
    const reportDateInput = document.getElementById('report-workout-date');
    if (reportDateInput) {
        const todayStr = new Date().toISOString().split('T')[0];
        reportDateInput.max = todayStr;
        reportDateInput.value = todayStr;
    }
    
    // Mostra o Modal
    const modal = document.getElementById('report-modal');
    modal.classList.remove('hidden');
}

// Cria a String formatada com emojis e markdown do relatório
function generateReportText(totalSets, durationStr, volume) {
    let text = `💪 *GigaTracker - Relatório de Treino* 💪\n`;
    text += `📅 Data: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}\n`;
    text += `🏋️‍♂️ Divisão: Treino ${getWorkoutThemeLetter(currentSession)} — *${currentSession.name}*\n`;
    text += `⏱️ Duração: ${durationStr}\n`;
    text += `🔥 Séries Concluídas: ${totalSets} séries\n`;
    text += `📊 Volume Estimado: ${volume.toLocaleString('pt-BR')} kg\n\n`;
    text += `*Exercícios & Cargas Registradas:*\n`;
    
    currentSession.exercises.forEach(ex => {
        const completedSets = ex.sets.filter(s => s.completed);
        if (completedSets.length > 0) {
            const isDouble = isExerciseDoubleWeight(ex);
            const weights = completedSets.map(s => `${s.weight}${isDouble ? ' (2x)' : ''}`).join(' | ');
            text += `• *${ex.name}:* ${completedSets.length} séries (${weights})${isDouble ? ' [Carga bilateral 2x]' : ''}\n`;
        }
    });
    
    return text;
}

// Copia o relatório gerado para o clipboard
function copyReportToClipboard() {
    const reportText = document.getElementById('report-text-pre').textContent;
    
    navigator.clipboard.writeText(reportText).then(() => {
        // Feedback visual
        const btnText = document.getElementById('copy-btn-text');
        const iconReady = document.getElementById('copy-icon-ready');
        const iconSuccess = document.getElementById('copy-icon-success');
        
        btnText.innerText = "Copiado!";
        iconReady.classList.add('hidden');
        iconSuccess.classList.remove('hidden');
        
        setTimeout(() => {
            btnText.innerText = "Copiar Relatório";
            iconReady.classList.remove('hidden');
            iconSuccess.classList.add('hidden');
        }, 2000);
    }).catch(err => {
        console.error("Falha ao copiar texto: ", err);
    });
}

// Fecha o modal de Relatório
function closeReportModal(shouldSave = false) {
    const modal = document.getElementById('report-modal');
    modal.classList.add('hidden');
    
    if (shouldSave) {
        // Salva registro final no histórico
        const durationMins = Math.round(workoutSeconds / 60);
        const durationStr = durationMins > 0 ? `${durationMins} min` : `${workoutSeconds}s`;
        
        let totalCompletedSets = 0;
        let estimatedVolume = 0;
        
        currentSession.exercises.forEach(ex => {
            const isDouble = isExerciseDoubleWeight(ex);
            ex.sets.forEach((s, setI) => {
                if (s.completed) {
                    totalCompletedSets++;
                    const weightVal = extractNumericWeight(s.weight, isDouble);
                    const repsVal = s.reps || parseReps(ex.reps);
                    estimatedVolume += (weightVal * repsVal);
                }
                // Salva o peso e as repetições desta série como referência para o próximo treino (v1.3.9)
                saveLastUsedWeight(currentSession.letter, ex.id, setI, s.weight);
                saveLastUsedReps(currentSession.letter, ex.id, setI, s.reps);
            });

            // Sincroniza a rotina definitiva no WORKOUTS_DATABASE para que novos exercícios e números permaneçam salvos
            if (WORKOUTS_DATABASE[currentSession.letter]) {
                const dbEx = WORKOUTS_DATABASE[currentSession.letter].exercises.find(e => e.id === ex.id || e.name === ex.name);
                if (dbEx) {
                    dbEx.sets = ex.sets.length;
                    dbEx.reps = ex.sets[0] ? (ex.sets[0].reps ? `${ex.sets[0].reps}` : ex.reps) : ex.reps;
                    dbEx.defaultWeight = ex.sets[0] ? ex.sets[0].weight : dbEx.defaultWeight;
                    dbEx.isDoubleWeight = isDouble;
                } else {
                    WORKOUTS_DATABASE[currentSession.letter].exercises.push({
                        id: ex.id,
                        name: ex.name,
                        sets: ex.sets.length,
                        reps: ex.reps,
                        defaultWeight: ex.sets[0] ? ex.sets[0].weight : "20 kg",
                        tip: ex.tip || '',
                        isDoubleWeight: isDouble
                    });
                }
            }
        });
        saveWorkoutsDatabase();

        const notes = document.getElementById('workout-notes').value.trim();

        // Determina o timestamp da data de treino (v1.3.1)
        const dateInput = document.getElementById('report-workout-date');
        let workoutTimestamp = Date.now();
        if (dateInput && dateInput.value) {
            const todayStr = new Date().toISOString().split('T')[0];
            // Se for hoje, mantemos Date.now() com hora e minuto exato.
            // Se for diferente, criamos o timestamp no meio do dia da data escolhida.
            if (dateInput.value !== todayStr) {
                workoutTimestamp = Date.parse(dateInput.value + 'T12:00:00');
            }
        }

        const workoutRecord = {
            id: 'workout_' + Date.now(),
            letter: currentSession.letter,
            name: currentSession.name,
            date: workoutTimestamp,
            duration: durationStr,
            completedSetsCount: totalCompletedSets,
            totalVolume: estimatedVolume,
            notes: notes,
            bodyWeight: getCurrentBodyWeight(), // Peso corporal associado (v1.3.4)
            exercises: currentSession.exercises.map(ex => ({
                name: ex.name,
                isDoubleWeight: isExerciseDoubleWeight(ex),
                sets: ex.sets.map(s => ({
                    setNum: s.setNum,
                    completed: s.completed,
                    weight: s.weight,
                    reps: s.reps || parseReps(ex.reps)
                }))
            }))
        };
        
        saveToHistory(workoutRecord);
        
        // Finaliza sessão ativa do localStorage
        localStorage.removeItem('gigaTracker_currentSession');
        
        // Limpa timers de descanso
        skipRestTimer();
        
        // Reinicia aplicativo carregando o próximo treino em ordem sequencial de bom senso (Push->Pull, Pull->Legs, Legs->Push) (v1.3.8)
        let nextCategory = 'Push';
        if (currentSession && currentSession.category) {
            const currentCat = currentSession.category.toLowerCase();
            if (currentCat === 'push') nextCategory = 'Pull';
            else if (currentCat === 'pull') nextCategory = 'Legs';
            else if (currentCat === 'legs') nextCategory = 'Push';
        }
        
        const lastWorkoutId = localStorage.getItem('gigaTracker_lastWorkoutId_' + nextCategory);
        let nextWorkoutId = lastWorkoutId;
        if (!nextWorkoutId || !WORKOUTS_DATABASE[nextWorkoutId] || WORKOUTS_DATABASE[nextWorkoutId].category !== nextCategory) {
            const firstMatch = Object.entries(WORKOUTS_DATABASE).find(([wId, w]) => w.category === nextCategory);
            nextWorkoutId = firstMatch ? firstMatch[0] : null;
        }
        if (!nextWorkoutId) {
            nextWorkoutId = Object.keys(WORKOUTS_DATABASE)[0];
        }
        
        initNewSession(nextWorkoutId);
        
        // Vai para a tela do histórico para o usuário ver seu registro
        switchTab('history');
    } else {
        // Se cancelou, retoma cronômetro geral para o usuário poder editar
        startWorkoutTimer(true);
    }
}

// Exporta todos os dados do localStorage para a área de transferência como JSON (v1.3.7)
function exportBackup() {
    try {
        const backupData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('gigaTracker_')) {
                backupData[key] = localStorage.getItem(key);
            }
        }
        
        const jsonStr = JSON.stringify(backupData);
        navigator.clipboard.writeText(jsonStr).then(() => {
            alert("Código de backup copiado para a área de transferência com sucesso! Cole em um local seguro (bloco de notas, WhatsApp, etc.).");
        }).catch(err => {
            // Fallback se navigator.clipboard falhar
            const textarea = document.createElement('textarea');
            textarea.value = jsonStr;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert("Código de backup copiado para a área de transferência! (Fallback)");
        });
    } catch (e) {
        alert("Erro ao gerar o backup dos dados.");
        console.error(e);
    }
}

// Importa os dados do backup a partir de uma caixa de texto (v1.3.7)
function importBackup() {
    const jsonStr = prompt("Cole o código de backup (JSON) gerado anteriormente para restaurar seus treinos:");
    if (!jsonStr) return;
    
    try {
        const backupData = JSON.parse(jsonStr.trim());
        let importedKeys = 0;
        
        // Valida se as chaves principais do app estão presentes
        const hasValidKeys = Object.keys(backupData).some(key => key.startsWith('gigaTracker_'));
        if (!hasValidKeys) {
            alert("Código de backup inválido ou sem dados do GigaTracker.");
            return;
        }
        
        const confirmRestore = confirm("Atenção: A restauração substituirá todos os treinos e dados atuais nesta aba. Deseja prosseguir?");
        if (!confirmRestore) return;
        
        // Limpa chaves antigas do gigaTracker para evitar misturas
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith('gigaTracker_')) {
                localStorage.removeItem(key);
            }
        }
        
        // Grava novas chaves do backup
        for (const [key, value] of Object.entries(backupData)) {
            if (key.startsWith('gigaTracker_')) {
                localStorage.setItem(key, value);
                importedKeys++;
            }
        }
        
        alert(`Backup importado com sucesso! ${importedKeys} chaves de dados restauradas.`);
        window.location.reload();
    } catch (e) {
        alert("Erro ao ler o código de backup. Verifique se o texto copiado está completo.");
        console.error(e);
    }
}

// ==========================================================================
// 11. GERENCIAMENTO DINÂMICO DE TREINOS (v1.3.8)
// ==========================================================================

// Retorna a letra do tema (A, B ou C) correspondente ao treino
function getWorkoutThemeLetter(item) {
    if (!item) return 'A';
    
    // 1. Verifica se tem a categoria direta no item
    if (item.category) {
        const cat = item.category.toLowerCase();
        if (cat === 'push') return 'A';
        if (cat === 'pull') return 'B';
        if (cat === 'legs') return 'C';
    }
    
    // 2. Verifica a letra/ID do item
    const letter = (item.letter || '').toLowerCase();
    if (letter === 'a' || letter.startsWith('push')) return 'A';
    if (letter === 'b' || letter.startsWith('pull')) return 'B';
    if (letter === 'c' || letter.startsWith('legs')) return 'C';
    
    // 3. Fallback pesquisando no banco pelo ID do treino
    const dbWorkout = WORKOUTS_DATABASE[item.letter];
    if (dbWorkout && dbWorkout.category) {
        const cat = dbWorkout.category.toLowerCase();
        if (cat === 'push') return 'A';
        if (cat === 'pull') return 'B';
        if (cat === 'legs') return 'C';
    }
    
    return 'A'; // Fallback
}

// Abre modal para criação de novo treino
function openNewWorkoutModal() {
    const modal = document.getElementById('manage-workout-modal');
    if (!modal) return;
    
    document.getElementById('manage-workout-modal-title').innerText = 'Criar Novo Treino';
    document.getElementById('manage-workout-modal-subtitle').innerText = 'Configure os detalhes e exercícios do novo treino';
    
    document.getElementById('manage-workout-id').value = '';
    document.getElementById('manage-workout-name').value = '';
    document.getElementById('manage-workout-focus').value = '';
    document.getElementById('manage-workout-category').value = currentCategory;
    
    const container = document.getElementById('manage-workout-exercises-list');
    container.innerHTML = '';
    
    // Adiciona um campo de exercício inicial
    addExerciseFieldToModal('', 4, '10-12', 'Peso corporal', '');
    
    modal.classList.remove('hidden');
}

// Abre modal para edição do treino ativo atual
function openEditWorkoutModal() {
    const modal = document.getElementById('manage-workout-modal');
    if (!modal) return;
    
    const workoutDef = WORKOUTS_DATABASE[currentWorkoutLetter];
    if (!workoutDef) return;
    
    document.getElementById('manage-workout-modal-title').innerText = 'Editar Estrutura do Treino';
    document.getElementById('manage-workout-modal-subtitle').innerText = 'Adicione ou remova exercícios deste treino';
    
    document.getElementById('manage-workout-id').value = currentWorkoutLetter;
    document.getElementById('manage-workout-name').value = workoutDef.name;
    document.getElementById('manage-workout-focus').value = workoutDef.focus || '';
    document.getElementById('manage-workout-category').value = workoutDef.category;
    
    const container = document.getElementById('manage-workout-exercises-list');
    container.innerHTML = '';
    
    if (workoutDef.exercises && workoutDef.exercises.length > 0) {
        workoutDef.exercises.forEach(ex => {
            addExerciseFieldToModal(ex.name, ex.sets, ex.reps, ex.defaultWeight, ex.tip, ex.id, isExerciseDoubleWeight(ex));
        });
    } else {
        addExerciseFieldToModal('', 4, '10-12', 'Peso corporal', '', '', false);
    }
    
    modal.classList.remove('hidden');
}

// Fecha o modal de gerenciamento de treino
function closeManageWorkoutModal() {
    const modal = document.getElementById('manage-workout-modal');
    if (modal) modal.classList.add('hidden');
}

// Escapa caracteres HTML especiais para prevenir bugs de input
function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Adiciona linha de exercício no modal de gerenciamento
function addExerciseFieldToModal(name = '', sets = 4, reps = '10-12', weight = 'Peso corporal', tip = '', id = '', isDouble = false) {
    const container = document.getElementById('manage-workout-exercises-list');
    if (!container) return;
    
    const rowId = 'ex_row_' + Date.now() + Math.random().toString(36).substr(2, 5);
    const row = document.createElement('div');
    row.id = rowId;
    row.className = 'modal-exercise-row glass';
    row.style.padding = '12px';
    row.style.borderRadius = '10px';
    row.style.border = '1px solid rgba(255, 255, 255, 0.08)';
    row.style.background = 'rgba(255, 255, 255, 0.02)';
    row.style.display = 'flex';
    row.style.flexDirection = 'column';
    row.style.gap = '8px';
    row.style.position = 'relative';
    
    // Auto-detecta isDouble se não veio explicitamente marcado
    const doubleChecked = isDouble || (name && (name.toLowerCase().includes('halter') || name.toLowerCase().includes('cada lado') || weight.toLowerCase().includes('cada lado')));
    
    row.innerHTML = `
        <input type="hidden" class="ex-modal-id" value="${id}">
        
        <div style="display: flex; gap: 8px; align-items: center;">
            <input type="text" class="ex-modal-name" placeholder="Nome do Exercício (ex: Supino Reto)" value="${escapeHtml(name)}" style="background: rgba(0, 0, 0, 0.25); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 10px; color: var(--text-primary); font-size: 13px; font-weight: 600; flex: 1; outline: none;">
            <button type="button" onclick="document.getElementById('${rowId}').remove()" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; color: #f87171; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all var(--transition-fast);" title="Remover Exercício">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1.2fr 1.5fr; gap: 8px;">
            <div>
                <label style="font-size: 9px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 3px;">Séries</label>
                <input type="number" class="ex-modal-sets" placeholder="Séries" value="${sets}" min="1" max="15" style="background: rgba(0, 0, 0, 0.25); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px; color: var(--text-primary); font-size: 12px; font-weight: 600; width: 100%; outline: none; text-align: center;">
            </div>
            <div>
                <label style="font-size: 9px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 3px;">Repetições</label>
                <input type="text" class="ex-modal-reps" placeholder="Ex: 10-12 ou Falha" value="${escapeHtml(reps)}" style="background: rgba(0, 0, 0, 0.25); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px; color: var(--text-primary); font-size: 12px; font-weight: 600; width: 100%; outline: none;">
            </div>
            <div>
                <label style="font-size: 9px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 3px;">Peso Padrão</label>
                <input type="text" class="ex-modal-weight" placeholder="Ex: 20 kg ou Peso corporal" value="${escapeHtml(weight)}" style="background: rgba(0, 0, 0, 0.25); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px; color: var(--text-primary); font-size: 12px; font-weight: 600; width: 100%; outline: none;">
            </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: flex-start; margin-top: 2px;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-secondary); cursor: pointer;">
                <input type="checkbox" class="ex-modal-double" ${doubleChecked ? 'checked' : ''} style="cursor: pointer;">
                ⚖️ Peso em ambos os lados (2x volume para halteres/cada lado)
            </label>
        </div>
        
        <div>
            <input type="text" class="ex-modal-tip" placeholder="Dica de execução (opcional)" value="${escapeHtml(tip)}" style="background: rgba(0, 0, 0, 0.15); border: 1px solid var(--border-color); border-radius: 8px; padding: 6px 8px; color: var(--text-secondary); font-size: 11px; width: 100%; outline: none; font-style: italic;">
        </div>
    `;
    
    container.appendChild(row);
}

// Salva as modificações do modal (criação ou edição de treino)
function saveManageWorkoutModal() {
    const workoutId = document.getElementById('manage-workout-id').value;
    const workoutName = document.getElementById('manage-workout-name').value.trim();
    const workoutFocus = document.getElementById('manage-workout-focus').value.trim();
    const workoutCategory = document.getElementById('manage-workout-category').value;
    
    if (!workoutName) {
        alert("Por favor, insira o nome do treino.");
        return;
    }
    
    const exercisesList = [];
    const rows = document.querySelectorAll('.modal-exercise-row');
    rows.forEach(row => {
        const exName = row.querySelector('.ex-modal-name').value.trim();
        const exSets = parseInt(row.querySelector('.ex-modal-sets').value) || 4;
        const exReps = row.querySelector('.ex-modal-reps').value.trim() || '10';
        const exWeight = row.querySelector('.ex-modal-weight').value.trim() || 'Peso corporal';
        const exTip = row.querySelector('.ex-modal-tip').value.trim() || '';
        const exDouble = row.querySelector('.ex-modal-double') ? row.querySelector('.ex-modal-double').checked : false;
        let exId = row.querySelector('.ex-modal-id').value.trim();
        
        if (!exId) {
            exId = 'ex_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        }
        
        exercisesList.push({
            id: exId,
            name: exName,
            sets: exSets,
            reps: exReps,
            defaultWeight: exWeight,
            tip: exTip,
            isDoubleWeight: exDouble
        });
    });
    
    if (exercisesList.length === 0) {
        alert("Por favor, adicione pelo menos um exercício ao treino.");
        return;
    }
    
    let hasEmptyName = false;
    exercisesList.forEach(ex => {
        if (!ex.name) hasEmptyName = true;
    });
    
    if (hasEmptyName) {
        alert("Todos os exercícios devem ter um nome.");
        return;
    }
    
    const isNew = !workoutId;
    const targetId = isNew ? ('workout_' + Date.now()) : workoutId;
    const themeClass = isNew ? (workoutCategory === 'Push' ? 'theme-a' : workoutCategory === 'Pull' ? 'theme-b' : 'theme-c') : (WORKOUTS_DATABASE[workoutId] ? WORKOUTS_DATABASE[workoutId].themeClass : (workoutCategory === 'Push' ? 'theme-a' : workoutCategory === 'Pull' ? 'theme-b' : 'theme-c'));
    
    // Atualiza/Cria no banco
    WORKOUTS_DATABASE[targetId] = {
        name: workoutName,
        category: workoutCategory,
        focus: workoutFocus,
        themeClass: themeClass,
        exercises: exercisesList
    };
    saveWorkoutsDatabase();
    
    // Sincroniza sessão ativa em andamento se o treino correspondente foi editado
    if (!isNew && currentSession && currentSession.letter === targetId) {
        currentSession.name = workoutName;
        currentSession.category = workoutCategory;
        currentSession.focus = workoutFocus;
        
        currentSession.exercises = exercisesList.map(newEx => {
            const match = currentSession.exercises.find(oldEx => 
                oldEx.id === newEx.id || 
                oldEx.name.toLowerCase() === newEx.name.toLowerCase()
            );
            
            const setsArray = [];
            for (let i = 0; i < newEx.sets; i++) {
                if (match && match.sets[i]) {
                    setsArray.push({
                        setNum: i + 1,
                        completed: match.sets[i].completed,
                        weight: match.sets[i].weight,
                        reps: match.sets[i].reps
                    });
                } else {
                    setsArray.push({
                        setNum: i + 1,
                        completed: false,
                        weight: newEx.defaultWeight,
                        reps: parseReps(newEx.reps)
                    });
                }
            }
            
            return {
                id: newEx.id,
                name: newEx.name,
                reps: newEx.reps,
                tip: newEx.tip || '',
                sets: setsArray
            };
        });
        
        saveCurrentSessionState();
        renderExercises();
    }
    
    // Se for novo ou editamos o ativo atual, selecionamos ele
    if (isNew) {
        currentWorkoutLetter = targetId;
        localStorage.setItem('gigaTracker_activeWorkoutId', targetId);
        localStorage.setItem('gigaTracker_lastWorkoutId_' + workoutCategory, targetId);
        currentCategory = workoutCategory;
        initNewSession(targetId);
    } else {
        if (targetId === currentWorkoutLetter) {
            document.body.className = `dark-theme ${themeClass}`;
            currentCategory = workoutCategory;
        }
        renderWorkoutSelector();
    }
    
    closeManageWorkoutModal();
    alert("Estrutura do treino salva com sucesso!");
}

// Exclui a definição do treino ativo atual
function deleteWorkoutDefinition() {
    const workoutToDelete = WORKOUTS_DATABASE[currentWorkoutLetter];
    if (!workoutToDelete) return;
    
    const category = workoutToDelete.category;
    const sameCategoryWorkouts = Object.values(WORKOUTS_DATABASE).filter(w => w.category === category);
    
    if (sameCategoryWorkouts.length <= 1) {
        alert(`Você não pode excluir o único treino restante na categoria "${category}". Crie outro treino nessa categoria antes de excluir este.`);
        return;
    }
    
    const hasProgress = currentSession && currentSession.exercises.some(ex => ex.sets.some(s => s.completed));
    if (hasProgress && currentSession.letter === currentWorkoutLetter) {
        const confirmProgressLoss = confirm("Você tem um treino em andamento com progresso marcado. Se excluir este treino, seu progresso atual será perdido. Deseja continuar?");
        if (!confirmProgressLoss) return;
    }
    
    const confirmDelete = confirm(`Tem certeza de que deseja excluir o treino "${workoutToDelete.name}"? Esta ação não pode ser desfeita.`);
    if (!confirmDelete) return;
    
    // Remove do banco de dados
    delete WORKOUTS_DATABASE[currentWorkoutLetter];
    saveWorkoutsDatabase();
    
    // Procura outro treino da mesma categoria para ativar
    const nextWorkout = Object.entries(WORKOUTS_DATABASE).find(([id, w]) => w.category === category);
    let targetId = nextWorkout ? nextWorkout[0] : null;
    if (!targetId) {
        targetId = Object.keys(WORKOUTS_DATABASE)[0];
    }
    
    // Inicializa a sessão com o treino substituto
    if (targetId) {
        changeWorkout(targetId);
    }
    
    alert("Treino excluído com sucesso!");
}

// Adiciona um exercício na sessão ativa e persiste na rotina do treino
function addExerciseToSession() {
    if (!currentSession) return;
    
    const exName = prompt("Nome do novo exercício:");
    if (!exName || !exName.trim()) return;
    
    const cleanName = exName.trim();
    // Pergunta se é exercício com pesos separados em ambos os lados (halteres / cada lado)
    const isDouble = confirm(`O exercício "${cleanName}" usa peso em ambos os lados (halteres / cada lado)?\n\nClique em 'OK' para Sim (Volume em dobro 2x)\nClique em 'Cancelar' para Não (Peso único total)`);
    
    const defaultWeightInput = prompt("Carga inicial padrão (ex: '14 kg' ou 'Peso corporal'):", isDouble ? "10 kg cada lado" : "20 kg") || (isDouble ? "10 kg cada lado" : "20 kg");
    const cleanWeight = defaultWeightInput.trim();
    
    const exId = 'ex_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    
    const newEx = {
        id: exId,
        name: cleanName,
        reps: "10-12",
        tip: "",
        isDoubleWeight: isDouble,
        sets: []
    };
    
    // Inicia com 4 séries padrão com a carga definida
    for (let i = 0; i < 4; i++) {
        newEx.sets.push({
            setNum: i + 1,
            completed: false,
            weight: cleanWeight,
            reps: 10
        });
        saveLastUsedWeight(currentSession.letter, exId, i, cleanWeight);
        saveLastUsedReps(currentSession.letter, exId, i, 10);
    }
    
    currentSession.exercises.push(newEx);
    
    // Persiste também no banco de treinos permanente (WORKOUTS_DATABASE)
    if (WORKOUTS_DATABASE[currentSession.letter]) {
        if (!WORKOUTS_DATABASE[currentSession.letter].exercises) {
            WORKOUTS_DATABASE[currentSession.letter].exercises = [];
        }
        WORKOUTS_DATABASE[currentSession.letter].exercises.push({
            id: exId,
            name: cleanName,
            sets: 4,
            reps: "10-12",
            defaultWeight: cleanWeight,
            tip: "",
            isDoubleWeight: isDouble
        });
        saveWorkoutsDatabase();
    }
    
    saveCurrentSessionState();
    renderExercises();
}

// Remove um exercício da sessão ativa e da rotina permanente do treino
function removeExerciseFromSession(exId) {
    if (!currentSession) return;
    
    const exercise = currentSession.exercises.find(e => e.id === exId);
    if (!exercise) return;
    
    const confirmRemove = confirm(`Deseja realmente remover o exercício "${exercise.name}" desta sessão e da rotina permanente deste treino?`);
    if (!confirmRemove) return;
    
    currentSession.exercises = currentSession.exercises.filter(e => e.id !== exId);
    
    // Remove também do WORKOUTS_DATABASE permanente
    if (WORKOUTS_DATABASE[currentSession.letter] && WORKOUTS_DATABASE[currentSession.letter].exercises) {
        WORKOUTS_DATABASE[currentSession.letter].exercises = WORKOUTS_DATABASE[currentSession.letter].exercises.filter(e => e.id !== exId && e.name !== exercise.name);
        saveWorkoutsDatabase();
    }
    
    saveCurrentSessionState();
    renderExercises();
}
