// Estado de la aplicación
let participants = {
    spain: ['Yolimar', 'Víctor', 'Paola', 'Geral', 'Vanesa', 'Edimar', 'Pedro'],
    venezuela: [
        'Ángel',
        'Carolina y Dylan',
        'Daylin',
        'Elodia',
        'Fanny',
        'Jennifer',
        'Junior y Simón',
        'Marilín',
        'Miriam',
        'Robert',
        'Romer',
        'Roswell',
        'Royer y Dereck',
        'Santiago'
    ]
};

// Cómplices: para cada español, quién es su cómplice
let complices = {
    'Paola': 'Yolimar',
    'Yolimar': 'Víctor',
    'Víctor': 'Paola',
    'Vanesa': 'Geral',
    'Geral': 'Vanesa',
    'Edimar': 'Pedro',
    'Pedro': 'Edimar'
};

// Restricciones de pareja en España (no pueden regalarse entre sí)
const spainCoupleRestrictions = {
    'Víctor': 'Paola',
    'Paola': 'Víctor',
    'Geral': 'Vanesa',
    'Vanesa': 'Geral',
    'Edimar': 'Pedro',
    'Pedro': 'Edimar'
};

// Resultado del sorteo
let sorteoResult = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderParticipants();
    renderComplices();
    renderRestrictions();
});

// Renderizar lista de participantes
function renderParticipants() {
    renderCountryList('spain', 'spain-list');
    renderCountryList('venezuela', 'venezuela-list');
}

function renderCountryList(country, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    participants[country].forEach((name, index) => {
        const li = document.createElement('li');
        li.className = 'participant-item';

        const isCouple = name.includes(' y ');
        const coupleIcon = isCouple ? '👨‍👩‍👦' : (country === 'spain' ? '🇪🇸' : '🇻🇪');

        li.innerHTML = `
            <span style="font-size: 1.2rem;">${coupleIcon}</span>
            <input type="text" value="${name}" onchange="updateParticipant('${country}', ${index}, this.value)">
            <button class="remove-btn" onclick="removeParticipant('${country}', ${index})">×</button>
        `;
        container.appendChild(li);
    });
}

// Añadir participante
function addParticipant(country) {
    participants[country].push('Nuevo');
    renderParticipants();
    if (country === 'spain') {
        renderComplices();
    }
}

// Actualizar nombre de participante
function updateParticipant(country, index, newName) {
    const oldName = participants[country][index];
    participants[country][index] = newName;

    // Si es de España, actualizar cómplices
    if (country === 'spain') {
        // Actualizar si este era un cómplice
        for (let key in complices) {
            if (complices[key] === oldName) {
                complices[key] = newName;
            }
        }
        // Actualizar si este tenía cómplice asignado
        if (complices[oldName]) {
            complices[newName] = complices[oldName];
            delete complices[oldName];
        }
        renderComplices();
    }
}

// Eliminar participante
function removeParticipant(country, index) {
    const name = participants[country][index];
    participants[country].splice(index, 1);

    if (country === 'spain') {
        delete complices[name];
        for (let key in complices) {
            if (complices[key] === name) {
                complices[key] = participants.spain[0] || '';
            }
        }
        renderComplices();
    }

    renderParticipants();
}

// Renderizar configuración de cómplices
function renderComplices() {
    const container = document.getElementById('complices-container');
    container.innerHTML = '';

    participants.spain.forEach(person => {
        const row = document.createElement('div');
        row.className = 'complice-row';

        let options = participants.spain
            .filter(p => p !== person)
            .map(p => `<option value="${p}" ${complices[person] === p ? 'selected' : ''}>${p}</option>`)
            .join('');

        row.innerHTML = `
            <div>
                <strong>Si regalas a:</strong><br>
                <span style="color: var(--gold); font-size: 1.1rem;">${person}</span>
            </div>
            <span>→ hablas con →</span>
            <select onchange="updateComplice('${person}', this.value)">
                ${options}
            </select>
        `;
        container.appendChild(row);
    });
}

// Renderizar restricciones
function renderRestrictions() {
    const container = document.getElementById('restrictions-info');
    if (container) {
        container.innerHTML = `
            <div class="restriction-item">
                <span>🚫</span>
                <span>Víctor ↔ Paola no se regalan entre sí</span>
            </div>
            <div class="restriction-item">
                <span>🚫</span>
                <span>Geral ↔ Vanesa no se regalan entre sí</span>
            </div>
            <div class="restriction-item">
                <span>🚫</span>
                <span>Edimar ↔ Pedro no se regalan entre sí</span>
            </div>
            <div class="restriction-item">
                <span>🚫</span>
                <span>El cómplice no puede regalar a quien le pide ayuda</span>
            </div>
        `;
    }
}

// Actualizar cómplice
function updateComplice(person, newComplice) {
    complices[person] = newComplice;
}

// Mezclar array (Fisher-Yates)
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Realizar el sorteo
function realizarSorteo() {
    const spain = [...participants.spain];
    const venezuela = [...participants.venezuela];

    if (spain.length === 0 || venezuela.length === 0) {
        alert('Debe haber al menos un participante en cada país');
        return;
    }

    if (spain.length > venezuela.length) {
        alert('Debe haber al menos tantos venezolanos como españoles para que todos reciban regalo');
        return;
    }

    // Intentar sorteo válido (máximo 5000 intentos)
    let assignments = null;
    let attempts = 0;
    const maxAttempts = 5000;

    while (!assignments && attempts < maxAttempts) {
        attempts++;
        assignments = tryGenerateAssignments(spain, venezuela);
    }

    if (!assignments) {
        alert('No se pudo generar un sorteo válido después de ' + maxAttempts + ' intentos. Las restricciones pueden ser demasiado estrictas.');
        return;
    }

    console.log(`Sorteo completado en ${attempts} intentos`);
    sorteoResult = assignments;
    showResults(assignments);
}

// Intentar generar asignaciones válidas
function tryGenerateAssignments(spain, venezuela) {
    const assignments = {};
    const receivers = new Set(); // Track who already receives a gift

    // Todos los participantes
    const allParticipants = [...spain, ...venezuela];

    // 1. Primero asignar a los españoles (solo pueden regalar a venezolanos)
    const shuffledVenezuelaForSpain = shuffle(venezuela);

    for (let i = 0; i < spain.length; i++) {
        const giver = spain[i];
        let assigned = false;

        for (const receiver of shuffledVenezuelaForSpain) {
            if (receivers.has(receiver)) continue;

            // Verificar restricción de pareja en España
            // (aunque los españoles solo regalan a venezolanos, dejamos la verificación por si acaso)

            assignments[giver] = {
                giver: giver,
                giverCountry: 'spain',
                receiver: receiver,
                receiverCountry: 'venezuela',
                complice: null
            };
            receivers.add(receiver);
            assigned = true;
            break;
        }

        if (!assigned) {
            return null;
        }
    }

    // 2. Asignar a los venezolanos
    // Necesitan regalar a: todos los españoles + venezolanos que no reciben de españoles
    const venezuelansNotReceiving = venezuela.filter(v => !receivers.has(v));
    const allReceiversForVenezuelans = shuffle([...spain, ...venezuelansNotReceiving]);

    const shuffledVenezuelansGivers = shuffle(venezuela);

    for (const giver of shuffledVenezuelansGivers) {
        let assigned = false;

        for (const receiver of allReceiversForVenezuelans) {
            if (receivers.has(receiver)) continue;
            if (receiver === giver) continue; // No auto-regalo

            const receiverCountry = spain.includes(receiver) ? 'spain' : 'venezuela';

            // Si el receptor es español, verificar restricciones
            if (receiverCountry === 'spain') {
                const compliceName = complices[receiver];

                // RESTRICCIÓN PRINCIPAL: El cómplice no puede regalar al venezolano que le pide ayuda
                if (assignments[compliceName] && assignments[compliceName].receiver === giver) {
                    continue;
                }

                // Verificar que el cómplice no tenga como receptor a este giver
                // (esto se verifica arriba, pero también verificar el caso inverso)
            }

            // Verificar que no haya ciclo de 2 directo
            if (assignments[receiver] && assignments[receiver].receiver === giver) {
                continue;
            }

            // Asignar
            assignments[giver] = {
                giver: giver,
                giverCountry: 'venezuela',
                receiver: receiver,
                receiverCountry: receiverCountry,
                complice: receiverCountry === 'spain' ? complices[receiver] : null
            };
            receivers.add(receiver);
            assigned = true;
            break;
        }

        if (!assigned) {
            return null;
        }
    }

    // Verificar que todos los españoles reciben regalo
    const spanishReceiving = Object.values(assignments)
        .filter(a => a.receiverCountry === 'spain')
        .map(a => a.receiver);

    const uniqueSpanishReceiving = new Set(spanishReceiving);
    if (uniqueSpanishReceiving.size !== spain.length) {
        return null;
    }

    // Verificación final de la restricción principal
    for (const [giver, assignment] of Object.entries(assignments)) {
        if (assignment.receiverCountry === 'spain') {
            const receiver = assignment.receiver;
            const compliceName = complices[receiver];

            // El cómplice no puede estar regalando al giver
            if (assignments[compliceName] && assignments[compliceName].receiver === giver) {
                return null;
            }
        }
    }

    return assignments;
}

// Mostrar resultados
function showResults(assignments) {
    document.getElementById('config-section').style.display = 'none';
    document.getElementById('results-section').classList.add('visible');

    // Estadísticas
    const stats = {
        total: Object.keys(assignments).length,
        spainGivers: Object.values(assignments).filter(a => a.giverCountry === 'spain').length,
        venezuelaGivers: Object.values(assignments).filter(a => a.giverCountry === 'venezuela').length,
        crossCountry: Object.values(assignments).filter(a => a.giverCountry !== a.receiverCountry).length
    };

    document.getElementById('stats-box').innerHTML = `
        <div class="stat-item">
            <div class="number">${stats.total}</div>
            <div class="label">Total participantes</div>
        </div>
        <div class="stat-item">
            <div class="number">${stats.spainGivers}</div>
            <div class="label">Desde España</div>
        </div>
        <div class="stat-item">
            <div class="number">${stats.venezuelaGivers}</div>
            <div class="label">Desde Venezuela</div>
        </div>
        <div class="stat-item">
            <div class="number">${stats.crossCountry}</div>
            <div class="label">Regalos internacionales</div>
        </div>
    `;

    // Generar tarjetas de resultado
    const container = document.getElementById('results-container');
    container.innerHTML = '';

    // Ordenar: primero España, luego Venezuela
    const sortedAssignments = Object.values(assignments).sort((a, b) => {
        if (a.giverCountry === b.giverCountry) {
            return a.giver.localeCompare(b.giver);
        }
        return a.giverCountry === 'spain' ? -1 : 1;
    });

    sortedAssignments.forEach(assignment => {
        const card = document.createElement('div');
        card.className = 'result-card';

        const flag = assignment.giverCountry === 'spain' ? '🇪🇸' : '🇻🇪';
        const receiverFlag = assignment.receiverCountry === 'spain' ? '🇪🇸' : '🇻🇪';
        const link = generateLink(assignment);
        const safeName = assignment.giver.replace(/[^a-zA-Z0-9]/g, '_');

        let compliceText = '';
        if (assignment.complice) {
            compliceText = ` (Cómplice: <strong>${assignment.complice}</strong>)`;
        }

        // Detectar si es pareja (tiene "y" en el nombre)
        const isCouple = assignment.receiver.includes(' y ');
        const coupleNote = isCouple ? ' <span style="color: #90EE90;">(Regalo doble)</span>' : '';

        card.innerHTML = `
            <h4>${flag} ${assignment.giver}</h4>
            <p class="assignment">
                Regala a: <strong>${assignment.receiver}</strong> ${receiverFlag}${coupleNote}${compliceText}
            </p>
            <div class="link-container">
                <input type="text" value="${link}" readonly id="link-${safeName}">
                <button class="copy-btn" onclick="copyLink('${safeName}', this)">📋 Copiar</button>
                <button class="whatsapp-btn" onclick="shareWhatsApp('${assignment.giver}', '${encodeURIComponent(link)}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Generar enlace único
function generateLink(assignment) {
    const data = {
        giver: assignment.giver,
        receiver: assignment.receiver,
        complice: assignment.complice,
        giverCountry: assignment.giverCountry,
        receiverCountry: assignment.receiverCountry
    };

    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    const baseUrl = window.location.href.replace('sorteo.html', 'mi-regalo.html');
    return `${baseUrl}?d=${encoded}`;
}

// Copiar enlace
function copyLink(safeName, button) {
    const input = document.getElementById(`link-${safeName}`);
    input.select();
    input.setSelectionRange(0, 99999); // Para móviles

    navigator.clipboard.writeText(input.value).then(() => {
        button.textContent = '✓ Copiado';
        button.classList.add('copied');

        setTimeout(() => {
            button.textContent = '📋 Copiar';
            button.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // Fallback
        document.execCommand('copy');
        button.textContent = '✓ Copiado';
        button.classList.add('copied');

        setTimeout(() => {
            button.textContent = '📋 Copiar';
            button.classList.remove('copied');
        }, 2000);
    });
}

// Compartir por WhatsApp
function shareWhatsApp(giver, encodedLink) {
    const link = decodeURIComponent(encodedLink);
    const message = encodeURIComponent(
        `🎄 *Amigo Secreto - Familia Ramírez Pernia* 🎄\n\n` +
        `¡Hola ${giver}! 🎁\n\n` +
        `Aquí está tu asignación secreta:\n` +
        `👉 ${link}\n\n` +
        `📅 24 de Diciembre\n` +
        `🇻🇪 7:00 PM | 🇪🇸 12:00 AM\n\n` +
        `🏆 Premio de $30 al regalo más creativo\n\n` +
        `¡Recuerda mantener el secreto! 🤫`
    );

    window.open(`https://wa.me/?text=${message}`, '_blank');
}

// Volver a configurar
function volverAConfigurar() {
    document.getElementById('config-section').style.display = 'block';
    document.getElementById('results-section').classList.remove('visible');
    sorteoResult = null;
}

// ========== EXPORTAR / IMPORTAR ==========

// Exportar resultados a JSON
function exportarResultados() {
    if (!sorteoResult) {
        alert('No hay resultados para exportar');
        return;
    }

    const exportData = {
        fecha: new Date().toISOString(),
        evento: 'Amigo Secreto - Familia Ramírez Pernia',
        fechaEvento: '24 de Diciembre 2025',
        participantes: {
            spain: [...participants.spain],
            venezuela: [...participants.venezuela]
        },
        complices: { ...complices },
        asignaciones: sorteoResult,
        enlaces: {}
    };

    // Generar todos los enlaces
    Object.values(sorteoResult).forEach(assignment => {
        exportData.enlaces[assignment.giver] = generateLink(assignment);
    });

    // Descargar JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amigo-secreto-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // También mostrar resumen en consola
    console.log('Sorteo exportado:', exportData);
}

// Exportar solo enlaces (texto plano para copiar)
function exportarEnlaces() {
    if (!sorteoResult) {
        alert('No hay resultados para exportar');
        return;
    }

    let texto = '🎄 AMIGO SECRETO - FAMILIA RAMÍREZ PERNIA 🎄\n';
    texto += '📅 24 de Diciembre 2025\n';
    texto += '=' .repeat(50) + '\n\n';
    texto += '⚠️ IMPORTANTE: Envía cada enlace SOLO a la persona correspondiente\n\n';
    texto += '=' .repeat(50) + '\n\n';

    // Ordenar por país
    const sorted = Object.values(sorteoResult).sort((a, b) => {
        if (a.giverCountry === b.giverCountry) {
            return a.giver.localeCompare(b.giver);
        }
        return a.giverCountry === 'spain' ? -1 : 1;
    });

    let currentCountry = '';
    sorted.forEach(assignment => {
        if (assignment.giverCountry !== currentCountry) {
            currentCountry = assignment.giverCountry;
            texto += `\n${'─'.repeat(40)}\n`;
            texto += currentCountry === 'spain' ? '🇪🇸 ESPAÑA\n' : '🇻🇪 VENEZUELA\n';
            texto += `${'─'.repeat(40)}\n\n`;
        }

        const link = generateLink(assignment);
        texto += `👤 ${assignment.giver}\n`;
        texto += `   Regala a: ${assignment.receiver}\n`;
        if (assignment.complice) {
            texto += `   Cómplice: ${assignment.complice}\n`;
        }
        texto += `   🔗 ${link}\n\n`;
    });

    // Descargar como texto
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enlaces-amigo-secreto-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Importar resultados desde JSON
function importarResultados(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            // Validar estructura
            if (!data.asignaciones || !data.participantes) {
                alert('El archivo no tiene el formato correcto');
                return;
            }

            // Restaurar datos
            participants.spain = data.participantes.spain;
            participants.venezuela = data.participantes.venezuela;
            complices = data.complices;
            sorteoResult = data.asignaciones;

            // Actualizar UI
            renderParticipants();
            renderComplices();
            showResults(sorteoResult);

            alert('✅ Sorteo importado correctamente!\n\nFecha del sorteo: ' + new Date(data.fecha).toLocaleString());

        } catch (error) {
            console.error('Error importando:', error);
            alert('Error al leer el archivo. Asegúrate de que sea un JSON válido.');
        }
    };
    reader.readAsText(file);
}

// Copiar todos los enlaces al portapapeles
function copiarTodosEnlaces() {
    if (!sorteoResult) {
        alert('No hay resultados para copiar');
        return;
    }

    let texto = '';
    Object.values(sorteoResult).forEach(assignment => {
        const link = generateLink(assignment);
        texto += `${assignment.giver}: ${link}\n`;
    });

    navigator.clipboard.writeText(texto).then(() => {
        alert('✅ Todos los enlaces copiados al portapapeles');
    }).catch(() => {
        alert('Error al copiar. Usa el botón "Exportar Enlaces" en su lugar.');
    });
}
