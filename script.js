// Datos de los escenarios
const scenarios = {
    1: {
        title: "Roswell (Venezuela) le regala a Paola (España)",
        giver: { name: "Roswell", country: "Venezuela", flag: "ve", avatar: "👨" },
        receiver: { name: "Paola", country: "España", flag: "es", avatar: "👩" },
        complice: { name: "Yolimar", country: "España", flag: "es", avatar: "👩" },
        compliceReceiver: { name: "Romer", country: "Venezuela", flag: "ve", avatar: "👨" },
        giftIdea: "un libro de cocina",
        compliceGiftIdea: "una gorra deportiva",
        steps: [
            {
                title: "Paso 1: El Sorteo",
                description: "A <strong>Roswell</strong> (Venezuela) le ha tocado regalar a <strong>Paola</strong> (España) en el sorteo del amigo secreto.",
                visual: "sorteo"
            },
            {
                title: "Paso 2: El Problema",
                description: "Roswell está en <strong>Venezuela</strong> y no puede comprar ni entregar un regalo físico a Paola que está en <strong>España</strong>. ¿Qué hacer?",
                visual: "problema"
            },
            {
                title: "Paso 3: Buscar al Cómplice",
                description: "Según las reglas: <em>'Si te tocó <strong>PAOLA</strong>, habla con <strong>YOLIMAR</strong>'</em>. Roswell debe contactar a Yolimar, que es el cómplice de Paola.",
                visual: "buscar_complice"
            },
            {
                title: "Paso 4: Contactar al Cómplice",
                description: "Roswell contacta a <strong>Yolimar</strong> y le dice qué regalo quiere hacerle a Paola.",
                visual: "contacto"
            },
            {
                title: "Paso 5: El Intercambio de Información",
                description: "A su vez, Yolimar le dice a Roswell qué quiere <strong>su</strong> amigo secreto de Venezuela (Romer). ¡Es un intercambio!",
                visual: "intercambio"
            },
            {
                title: "Paso 6: Las Compras",
                description: "<strong>Yolimar</strong> compra el regalo en España para Paola. <strong>Roswell</strong> compra el regalo en Venezuela para Romer.",
                visual: "compras"
            },
            {
                title: "Paso 7: ¡Feliz Navidad!",
                description: "El día 24, cada uno entrega el regalo que compró en su país. ¡Todos reciben sus regalos aunque estén a miles de kilómetros!",
                visual: "final"
            }
        ]
    },
    2: {
        title: "Elodia (Venezuela) le regala a Geral (España)",
        giver: { name: "Elodia", country: "Venezuela", flag: "ve", avatar: "👩" },
        receiver: { name: "Geral", country: "España", flag: "es", avatar: "👨" },
        complice: { name: "Vanessa", country: "España", flag: "es", avatar: "👩" },
        compliceReceiver: { name: "Marilin", country: "Venezuela", flag: "ve", avatar: "👩" },
        giftIdea: "un perfume",
        compliceGiftIdea: "unos aretes bonitos",
        steps: [
            {
                title: "Paso 1: El Sorteo",
                description: "A <strong>Elodia</strong> (Venezuela) le ha tocado regalar a <strong>Geral</strong> (España) en el sorteo del amigo secreto.",
                visual: "sorteo"
            },
            {
                title: "Paso 2: El Problema",
                description: "Elodia está en <strong>Venezuela</strong> y no puede entregar un regalo en <strong>España</strong>. ¡Necesita ayuda!",
                visual: "problema"
            },
            {
                title: "Paso 3: Buscar al Cómplice",
                description: "Según las reglas: <em>'Si te tocó <strong>GERAL</strong>, habla con <strong>VANESSA</strong>'</em>. Elodia debe contactar a Vanessa.",
                visual: "buscar_complice"
            },
            {
                title: "Paso 4: Contactar al Cómplice",
                description: "Elodia contacta a <strong>Vanessa</strong> y le cuenta que quiere regalarle un perfume a Geral.",
                visual: "contacto"
            },
            {
                title: "Paso 5: El Intercambio de Información",
                description: "Vanessa le dice a Elodia que su amigo secreto <strong>Marilin</strong> quiere unos aretes. ¡Ahora Elodia sabe qué comprar!",
                visual: "intercambio"
            },
            {
                title: "Paso 6: Las Compras",
                description: "<strong>Vanessa</strong> compra el perfume en España para Geral. <strong>Elodia</strong> compra los aretes en Venezuela para Marilin.",
                visual: "compras"
            },
            {
                title: "Paso 7: ¡Feliz Navidad!",
                description: "Todos reciben sus regalos gracias al sistema de cómplices. ¡La distancia no es un problema!",
                visual: "final"
            }
        ]
    },
    3: {
        title: "Eduardo (Venezuela) le regala a Rober (Venezuela)",
        giver: { name: "Eduardo", country: "Venezuela", flag: "ve", avatar: "👨" },
        receiver: { name: "Rober", country: "Venezuela", flag: "ve", avatar: "👨" },
        complice: null,
        compliceReceiver: null,
        giftIdea: "una camisa",
        steps: [
            {
                title: "Paso 1: El Sorteo",
                description: "A <strong>Eduardo</strong> (Venezuela) le ha tocado regalar a <strong>Rober</strong> (Venezuela) en el sorteo del amigo secreto.",
                visual: "sorteo"
            },
            {
                title: "Paso 2: ¡Sin Problema!",
                description: "¡Ambos están en <strong>Venezuela</strong>! Eduardo puede comprar y entregar el regalo directamente a Rober. <strong>No necesita cómplice.</strong>",
                visual: "sin_problema"
            },
            {
                title: "Paso 3: La Compra Directa",
                description: "Eduardo va a la tienda, compra el regalo para Rober y lo guarda hasta el día del evento.",
                visual: "compra_directa"
            },
            {
                title: "Paso 4: ¡Feliz Navidad!",
                description: "El 24 de diciembre, Eduardo le entrega su regalo directamente a Rober. ¡Así de simple cuando ambos están en el mismo país!",
                visual: "final_simple"
            }
        ]
    }
};

// Estado actual
let currentScenario = 1;
let currentStep = 0;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configurar botones de escenario
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const scenario = parseInt(btn.dataset.scenario);
            selectScenario(scenario);
        });
    });

    // Configurar navegación
    document.getElementById('prev-btn').addEventListener('click', prevStep);
    document.getElementById('next-btn').addEventListener('click', nextStep);

    // Cargar escenario inicial
    renderScenario();
});

function selectScenario(scenario) {
    currentScenario = scenario;
    currentStep = 0;

    // Actualizar botones activos
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.scenario) === scenario);
    });

    renderScenario();
}

function renderScenario() {
    const scenario = scenarios[currentScenario];
    const step = scenario.steps[currentStep];

    // Renderizar indicadores de pasos
    renderStepIndicators(scenario.steps.length);

    // Renderizar contenido del paso
    const container = document.getElementById('example-container');
    container.innerHTML = generateStepContent(scenario, step);

    // Actualizar botones de navegación
    document.getElementById('prev-btn').disabled = currentStep === 0;
    document.getElementById('next-btn').disabled = currentStep === scenario.steps.length - 1;
}

function renderStepIndicators(totalSteps) {
    const container = document.getElementById('step-indicators');
    container.innerHTML = '';

    for (let i = 0; i < totalSteps; i++) {
        const dot = document.createElement('div');
        dot.className = `step-dot ${i === currentStep ? 'active' : ''}`;
        dot.addEventListener('click', () => goToStep(i));
        container.appendChild(dot);
    }
}

function generateStepContent(scenario, step) {
    const visual = generateVisual(scenario, step.visual);

    return `
        <div class="step-content">
            <h3 class="step-title">${step.title}</h3>
            ${visual}
            <div class="step-description">${step.description}</div>
        </div>
    `;
}

function generateVisual(scenario, visualType) {
    const { giver, receiver, complice, compliceReceiver, giftIdea, compliceGiftIdea } = scenario;

    switch (visualType) {
        case 'sorteo':
            return `
                <div class="step-visual">
                    ${createPersonCard(giver)}
                    <div class="arrow-container">
                        <div class="arrow">➜</div>
                        <span class="arrow-label">Le tocó</span>
                    </div>
                    ${createPersonCard(receiver, true)}
                </div>
            `;

        case 'problema':
            return `
                <div class="step-visual">
                    ${createPersonCard(giver)}
                    <div class="arrow-container">
                        <div class="arrow" style="color: #ff6b6b;">✗</div>
                        <span class="arrow-label" style="background: #ff6b6b; color: white;">¡No puede!</span>
                    </div>
                    ${createPersonCard(receiver)}
                </div>
                <div style="text-align: center; margin-top: 1rem;">
                    <span style="font-size: 3rem;">🌎</span>
                    <p style="margin-top: 0.5rem; opacity: 0.8;">Miles de kilómetros de distancia</p>
                </div>
            `;

        case 'buscar_complice':
            return `
                <div class="step-visual">
                    ${createPersonCard(receiver)}
                    <div class="arrow-container">
                        <div class="arrow">⟷</div>
                        <span class="arrow-label">Cómplice</span>
                    </div>
                    ${createPersonCard(complice, true)}
                </div>
            `;

        case 'contacto':
            return `
                <div class="step-visual">
                    ${createPersonCard(giver, true)}
                    <div class="arrow-container">
                        <div class="arrow">📱</div>
                        <span class="arrow-label">Contacta</span>
                    </div>
                    ${createPersonCard(complice, true)}
                </div>
                <div class="speech-bubble" style="margin-left: 20%;">
                    "Quiero regalarle ${giftIdea} a ${receiver.name}"
                </div>
            `;

        case 'intercambio':
            return `
                <div class="step-visual">
                    ${createPersonCard(giver)}
                    <div class="arrow-container">
                        <div class="arrow">⟷</div>
                        <span class="arrow-label">Intercambio</span>
                    </div>
                    ${createPersonCard(complice)}
                </div>
                <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem; margin-top: 1rem;">
                    <div class="speech-bubble">
                        "${giver.name}: Quiero dar ${giftIdea}"
                    </div>
                    <div class="speech-bubble right">
                        "${complice.name}: ${compliceReceiver.name} quiere ${compliceGiftIdea}"
                    </div>
                </div>
            `;

        case 'compras':
            return `
                <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem;">
                    <div style="text-align: center;">
                        <h4 style="color: var(--gold); margin-bottom: 1rem;">En España 🇪🇸</h4>
                        ${createPersonCard(complice)}
                        <div class="gift-icon">🎁</div>
                        <p>Compra ${giftIdea}<br>para <strong>${receiver.name}</strong></p>
                    </div>
                    <div style="text-align: center;">
                        <h4 style="color: var(--gold); margin-bottom: 1rem;">En Venezuela 🇻🇪</h4>
                        ${createPersonCard(giver)}
                        <div class="gift-icon">🎁</div>
                        <p>Compra ${compliceGiftIdea}<br>para <strong>${compliceReceiver.name}</strong></p>
                    </div>
                </div>
            `;

        case 'final':
            return `
                <div style="text-align: center;">
                    <div class="gift-icon" style="font-size: 5rem;">🎄🎁🎅🎁🎄</div>
                    <h3 style="color: var(--gold); margin: 1rem 0;">¡Todos reciben su regalo!</h3>
                    <div style="display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; margin-top: 2rem;">
                        <div>
                            ${createPersonCard(receiver)}
                            <p style="margin-top: 0.5rem;">Recibe ${giftIdea}</p>
                        </div>
                        <div>
                            ${createPersonCard(compliceReceiver)}
                            <p style="margin-top: 0.5rem;">Recibe ${compliceGiftIdea}</p>
                        </div>
                    </div>
                </div>
            `;

        case 'sin_problema':
            return `
                <div class="step-visual">
                    ${createPersonCard(giver, true)}
                    <div class="arrow-container">
                        <div class="arrow" style="color: #90EE90;">✓</div>
                        <span class="arrow-label" style="background: #228b22;">¡Directo!</span>
                    </div>
                    ${createPersonCard(receiver, true)}
                </div>
                <div style="text-align: center; margin-top: 1rem;">
                    <span style="font-size: 3rem;">🇻🇪</span>
                    <p style="margin-top: 0.5rem; color: #90EE90; font-weight: bold;">¡Mismo país = Sin cómplice!</p>
                </div>
            `;

        case 'compra_directa':
            return `
                <div style="text-align: center;">
                    ${createPersonCard(giver, true)}
                    <div style="margin: 1.5rem 0;">
                        <span style="font-size: 3rem;">🏪</span>
                        <div class="arrow" style="display: block; transform: rotate(90deg); margin: 0.5rem auto;">➜</div>
                        <span style="font-size: 3rem;">🎁</span>
                    </div>
                    <p>Eduardo compra directamente ${giftIdea} para Rober</p>
                </div>
            `;

        case 'final_simple':
            return `
                <div style="text-align: center;">
                    <div class="gift-icon" style="font-size: 5rem;">🎄🎁🎄</div>
                    <h3 style="color: var(--gold); margin: 1rem 0;">¡Entrega directa!</h3>
                    <div class="step-visual" style="margin-top: 2rem;">
                        ${createPersonCard(giver)}
                        <div class="arrow-container">
                            <div class="gift-icon" style="font-size: 2rem;">🎁</div>
                        </div>
                        ${createPersonCard(receiver, true)}
                    </div>
                </div>
            `;

        default:
            return '<p>Visual no disponible</p>';
    }
}

function createPersonCard(person, highlight = false) {
    if (!person) return '';

    return `
        <div class="person-card ${highlight ? 'highlight' : ''}">
            <div class="avatar">${person.avatar}</div>
            <div class="name">${person.name}</div>
            <div class="country">
                <img src="https://flagcdn.com/w20/${person.flag}.png" alt="${person.country}">
                ${person.country}
            </div>
        </div>
    `;
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        renderScenario();
    }
}

function nextStep() {
    const scenario = scenarios[currentScenario];
    if (currentStep < scenario.steps.length - 1) {
        currentStep++;
        renderScenario();
    }
}

function goToStep(step) {
    currentStep = step;
    renderScenario();
}

// Efectos adicionales
document.addEventListener('mousemove', (e) => {
    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach((flake, index) => {
        const speed = (index + 1) * 0.02;
        const x = (e.clientX - window.innerWidth / 2) * speed;
        flake.style.transform = `translateX(${x}px)`;
    });
});
