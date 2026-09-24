// Lógica del módulo Hiring Manager: SLA, shortlist, cajón de entrevista y comparador

const HM_MAX_COMPARAR = 3;
const HM_MIN_JUSTIFICACION = 20;

const hmState = {
    vista: "vacantes",
    seleccionados: [],
    candidatoActivo: null,
    etapaAbierta: null,
    arenaAbierta: false
};

const hmEl = id => document.getElementById(id);

const hmIniciales = nombre =>
    nombre
        .split(" ")
        .slice(0, 2)
        .map(parte => parte[0])
        .join("")
        .toUpperCase();

const hmPendientes = () => HM_CANDIDATOS.filter(candidato => !candidato.evaluacionHM);

const hmCandidato = id => HM_CANDIDATOS.find(candidato => candidato.id === id);

const hmClaseEstado = estado => {
    if (estado === "Finalista") {
        return "finalista";
    }

    if (estado === "Descartado") {
        return "descartado";
    }

    return "pendiente";
};

const hmClaseVeredicto = veredicto => (veredicto === "Recomendado" ? "ok" : "no");

function hmToast(mensaje) {
    const toast = hmEl("hm-toast");

    toast.textContent = mensaje;
    toast.classList.add("is-visible");

    clearTimeout(hmToast.timer);

    hmToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 3400);
}

// ===== Encabezado y alertas =====

function hmRenderVacante() {
    hmEl("hm-vacancy-folio").textContent = `VACANTE ACTIVA · ${HM_VACANTE.folio}`;
    hmEl("hm-vacancy-title").textContent = HM_VACANTE.titulo;
    hmEl("hm-vacancy-meta").textContent =
        `${HM_VACANTE.area} · ${HM_VACANTE.ubicacion} · ${HM_VACANTE.nivel} · Reclutadora: ${HM_VACANTE.reclutador}`;

    hmEl("hm-user-initials").textContent = hmIniciales(HM_USUARIO.nombre);
    hmEl("hm-user-name").textContent = HM_USUARIO.nombre;
    hmEl("hm-user-role").textContent = HM_USUARIO.rol;

    const consumido = HM_ETAPAS.reduce((total, etapa) => total + etapa.transcurrido, 0);
    const sla = HM_ETAPAS.reduce((total, etapa) => total + etapa.sla, 0);

    hmEl("hm-sla-pill").textContent = `${consumido} de ${sla} días hábiles consumidos`;
}

function hmRenderBadge() {
    const badge = hmEl("hm-pending-badge");
    const total = hmPendientes().length;

    badge.textContent = total;
    badge.hidden = total === 0;
}

function hmRenderAlertas() {
    const pendientes = hmPendientes().length;

    const alertas = HM_ALERTAS.filter(alerta => !(alerta.nivel === "critica" && pendientes === 0)).map(alerta => ({
        ...alerta,
        detalle: alerta.detalle.replace("{pendientes}", pendientes)
    }));

    hmEl("hm-alerts-list").innerHTML = alertas
        .map(
            alerta => `
                <article class="hm-alert hm-alert--${alerta.nivel}">
                    <h4>${alerta.titulo}</h4>
                    <p>${alerta.detalle}</p>
                    <small>${alerta.tiempo}</small>
                </article>
            `
        )
        .join("");

    const contador = hmEl("hm-alert-count");

    contador.textContent = alertas.length;
    contador.hidden = alertas.length === 0;
}

function hmInitBanner() {
    hmEl("hm-banner-text").textContent = HM_BANNER;
    hmEl("hm-banner").hidden = false;

    hmEl("hm-banner-close").addEventListener("click", () => {
        hmEl("hm-banner").hidden = true;
    });
}

function hmInitAlertas() {
    const boton = hmEl("hm-bell");
    const panel = hmEl("hm-alerts");

    const alternar = abrir => {
        panel.hidden = !abrir;
        boton.setAttribute("aria-expanded", String(abrir));
    };

    boton.addEventListener("click", () => alternar(panel.hidden));
    hmEl("hm-alerts-close").addEventListener("click", () => alternar(false));

    document.addEventListener("click", evento => {
        if (!panel.hidden && !evento.target.closest(".hm-bell-wrap")) {
            alternar(false);
        }
    });
}

// ===== Timeline de solo lectura =====

function hmRenderTimeline() {
    hmEl("hm-timeline").innerHTML = HM_ETAPAS.map(etapa => {
        const bloqueada = etapa.accion === null;
        const clases = [
            "hm-stage",
            `hm-stage--${etapa.estado}`,
            bloqueada ? "hm-stage--locked" : "hm-stage--action",
            hmState.etapaAbierta === etapa.accion ? "is-open" : ""
        ]
            .filter(Boolean)
            .join(" ");

        const marca = etapa.estado === "completada" ? "✓" : etapa.numero;

        return `
            <li>
                <article class="${clases}" ${bloqueada ? "" : `data-stage="${etapa.accion}" tabindex="0"`}>
                    <div class="hm-stage__top">
                        <span class="hm-stage__number">${marca}</span>
                        <h3>${etapa.nombre}</h3>
                    </div>
                    <p class="hm-stage__owner">${etapa.responsable}</p>
                    <p class="hm-stage__time">◷ ${etapa.transcurrido}/${etapa.sla} días · ${etapa.fecha}</p>
                    ${bloqueada ? "" : '<span class="hm-stage__tag">Acción del HM</span>'}
                </article>
            </li>
        `;
    }).join("");
}

function hmRenderPanelRequisitos() {
    const panel = hmEl("hm-stage-panel");

    panel.innerHTML = `
        <h3>Alineación de la vacante</h3>
        <p>Requisitos acordados con reclutamiento. Confirma que siguen vigentes para esta búsqueda.</p>
        <ul class="hm-requisitos">
            ${HM_REQUISITOS.map(requisito => `<li><span>✓</span>${requisito}</li>`).join("")}
        </ul>
        <div class="hm-form__actions">
            <button class="hm-button hm-button--primary" type="button" data-validar-requisitos>
                Confirmar requisitos
            </button>
        </div>
    `;

    panel.hidden = false;
}

function hmAbrirEtapa(accion) {
    const panel = hmEl("hm-stage-panel");

    if (hmState.etapaAbierta === accion) {
        hmState.etapaAbierta = null;
        panel.hidden = true;
        hmRenderTimeline();
        return;
    }

    hmState.etapaAbierta = accion;
    hmRenderTimeline();

    if (accion === "requisitos") {
        hmRenderPanelRequisitos();
        return;
    }

    panel.hidden = true;
    hmDestacarShortlist();
}

function hmDestacarShortlist() {
    const tarjeta = hmEl("hm-shortlist-card");

    tarjeta.scrollIntoView({ behavior: "smooth", block: "start" });
    tarjeta.classList.add("is-highlight");

    setTimeout(() => tarjeta.classList.remove("is-highlight"), 1800);
    hmToast("Elige al finalista desde el shortlist.");
}

function hmInitTimeline() {
    const timeline = hmEl("hm-timeline");

    timeline.addEventListener("click", evento => {
        const etapa = evento.target.closest("[data-stage]");

        if (etapa) {
            hmAbrirEtapa(etapa.dataset.stage);
        }
    });

    timeline.addEventListener("keydown", evento => {
        const etapa = evento.target.closest("[data-stage]");

        if (etapa && (evento.key === "Enter" || evento.key === " ")) {
            evento.preventDefault();
            hmAbrirEtapa(etapa.dataset.stage);
        }
    });

    hmEl("hm-stage-panel").addEventListener("click", evento => {
        if (evento.target.closest("[data-validar-requisitos]")) {
            hmToast("Requisitos validados. Reclutamiento queda notificado.");
        }
    });
}

// ===== Shortlist en bento =====

function hmRenderShortlist() {
    const pendientes = hmPendientes().length;
    const finalistas = HM_CANDIDATOS.filter(candidato => candidato.estado === "Finalista").length;

    hmEl("hm-shortlist-counter").textContent =
        `${HM_CANDIDATOS.length} perfiles enviados por reclutamiento · selecciona 2 o más para comparar.`;

    hmEl("hm-shortlist-pill").textContent = `${pendientes} por evaluar · ${finalistas} finalistas`;

    hmEl("hm-shortlist").innerHTML = HM_CANDIDATOS.map(candidato => {
        const seleccionado = hmState.seleccionados.includes(candidato.id);

        const veredictos = candidato.entrevistas
            .map(
                entrevista =>
                    `<span class="hm-chip hm-chip--${hmClaseVeredicto(entrevista.veredicto)}">
                        ${entrevista.entrevistador.split(" ")[0]} ${entrevista.calificacion}/10
                    </span>`
            )
            .join("");

        const decision = candidato.evaluacionHM
            ? `<span class="hm-chip hm-chip--neutral">Tu veredicto: ${candidato.evaluacionHM.veredicto}</span>`
            : "";

        return `
            <article class="hm-candidate ${seleccionado ? "is-selected" : ""}">

                <input
                    class="compare-cb"
                    type="checkbox"
                    data-compare="${candidato.id}"
                    aria-label="Comparar a ${candidato.nombre}"
                    ${seleccionado ? "checked" : ""}
                >

                <div class="hm-candidate__top">
                    <span class="hm-avatar">${hmIniciales(candidato.nombre)}</span>
                    <div>
                        <h3>${candidato.nombre}</h3>
                        <p>${candidato.puestoActual} · ${candidato.empresa}</p>
                    </div>
                </div>

                <span class="hm-status hm-status--${hmClaseEstado(candidato.estado)}">${candidato.estado}</span>

                <div class="hm-compat">
                    <div class="hm-compat__head">
                        <span>Compatibilidad AssessFirst</span>
                        <strong>${candidato.compatibilidad}%</strong>
                    </div>
                    <progress class="hm-progress" max="100" value="${candidato.compatibilidad}"></progress>
                </div>

                <div class="hm-candidate__meta">
                    <span>📍 ${candidato.ubicacion}</span>
                    <span>💰 Deseada: ${candidato.compensacionDeseada}</span>
                    <span>📅 Disponibilidad: ${candidato.disponibilidad}</span>
                </div>

                <div class="hm-verdicts">${veredictos}${decision}</div>

                <button class="hm-evaluate" type="button" data-evaluar="${candidato.id}">
                    Evaluar Perfil
                </button>

            </article>
        `;
    }).join("");
}

function hmToggleSeleccion(id, activo) {
    if (activo) {
        if (hmState.seleccionados.length >= HM_MAX_COMPARAR) {
            hmToast(`Puedes comparar hasta ${HM_MAX_COMPARAR} candidatos a la vez.`);
            hmRenderShortlist();
            return;
        }

        hmState.seleccionados.push(id);
    } else {
        hmState.seleccionados = hmState.seleccionados.filter(seleccionado => seleccionado !== id);
    }

    hmRenderShortlist();
    hmRenderFab();
}

function hmRenderFab() {
    const fab = hmEl("hm-fab");
    const total = hmState.seleccionados.length;

    hmEl("hm-fab-count").textContent = total;
    fab.classList.toggle("is-visible", total >= 2 && !hmState.arenaAbierta);
}

function hmInitShortlist() {
    const contenedor = hmEl("hm-shortlist");

    contenedor.addEventListener("change", evento => {
        const checkbox = evento.target.closest(".compare-cb");

        if (checkbox) {
            hmToggleSeleccion(checkbox.dataset.compare, checkbox.checked);
        }
    });

    contenedor.addEventListener("click", evento => {
        const boton = evento.target.closest("[data-evaluar]");

        if (boton) {
            hmAbrirSheet(boton.dataset.evaluar);
        }
    });
}

// ===== Arena Mode =====

function hmFilasArena() {
    return [
        { etiqueta: "Puesto actual", valor: c => `${c.puestoActual} — ${c.empresa}` },
        { etiqueta: "Ubicación", valor: c => c.ubicacion },
        { etiqueta: "Educación", valor: c => c.educacion },
        { etiqueta: "Otros estudios", valor: c => c.otrosEstudios },
        { etiqueta: "Idiomas", valor: c => c.idiomas },
        { etiqueta: "Experiencia", valor: c => c.experiencia },
        { etiqueta: "Compensación actual", valor: c => c.compensacionActual },
        { etiqueta: "Compensación deseada", valor: c => c.compensacionDeseada },
        { etiqueta: "Disponibilidad", valor: c => c.disponibilidad },
        { etiqueta: "Skills", valor: c => c.skills.join(" · ") },
        {
            etiqueta: "Calificaciones del panel",
            valor: c =>
                `<ul>${c.entrevistas
                    .map(
                        entrevista =>
                            `<li>${entrevista.entrevistador} (${entrevista.rol}): ${entrevista.calificacion}/10 · ${entrevista.veredicto}</li>`
                    )
                    .join("")}</ul>`
        },
        {
            etiqueta: "Notas de entrevista",
            valor: c => `<ul>${c.entrevistas.map(entrevista => `<li>${entrevista.notas}</li>`).join("")}</ul>`
        },
        {
            etiqueta: "Tu decisión",
            valor: c =>
                c.evaluacionHM
                    ? `<strong>${c.evaluacionHM.veredicto}</strong> · ${c.evaluacionHM.fecha}<br>${c.evaluacionHM.justificacion}`
                    : "Sin registrar"
        }
    ];
}

function hmRenderArena() {
    const seleccionados = HM_CANDIDATOS.filter(candidato => hmState.seleccionados.includes(candidato.id));
    const filas = hmFilasArena();

    hmEl("hm-arena").innerHTML = `
        <div class="hm-arena__head">
            <div>
                <h3>⚖ Arena Mode</h3>
                <p>Comparativa lado a lado con el feedback que ya dejó el panel de entrevistas.</p>
            </div>
            <button class="hm-button hm-button--ghost" type="button" data-cerrar-arena>Volver al shortlist</button>
        </div>

        <div class="hm-arena__scroll">
            <table>
                <thead>
                    <tr>
                        <th class="hm-arena__criterion">Criterio</th>
                        ${seleccionados.map(candidato => `<th>${candidato.nombre}</th>`).join("")}
                    </tr>
                </thead>
                <tbody>
                    <tr class="hm-arena__row--compat">
                        <td class="hm-arena__criterion">Compatibilidad AssessFirst</td>
                        ${seleccionados
                            .map(
                                candidato => `
                                    <td>
                                        <strong>${candidato.compatibilidad}%</strong>
                                        <progress class="hm-progress" max="100" value="${candidato.compatibilidad}"></progress>
                                    </td>
                                `
                            )
                            .join("")}
                    </tr>

                    ${filas
                        .map(
                            fila => `
                                <tr>
                                    <td class="hm-arena__criterion">${fila.etiqueta}</td>
                                    ${seleccionados.map(candidato => `<td>${fila.valor(candidato)}</td>`).join("")}
                                </tr>
                            `
                        )
                        .join("")}

                    <tr>
                        <td class="hm-arena__criterion">Decidir</td>
                        ${seleccionados
                            .map(
                                candidato => `
                                    <td>
                                        <button class="hm-button hm-button--primary" type="button" data-evaluar-arena="${candidato.id}">
                                            Evaluar Perfil
                                        </button>
                                    </td>
                                `
                            )
                            .join("")}
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function hmAbrirArena() {
    if (hmState.seleccionados.length < 2) {
        return;
    }

    hmState.arenaAbierta = true;

    hmRenderArena();

    hmEl("hm-arena").hidden = false;
    hmEl("hm-shortlist").hidden = true;

    hmRenderFab();
}

function hmCerrarArena() {
    hmState.arenaAbierta = false;

    hmEl("hm-arena").hidden = true;
    hmEl("hm-shortlist").hidden = false;

    hmRenderFab();
}

function hmInitArena() {
    hmEl("hm-fab").addEventListener("click", hmAbrirArena);

    hmEl("hm-arena").addEventListener("click", evento => {
        if (evento.target.closest("[data-cerrar-arena]")) {
            hmCerrarArena();
            return;
        }

        const boton = evento.target.closest("[data-evaluar-arena]");

        if (boton) {
            hmAbrirSheet(boton.dataset.evaluarArena);
        }
    });
}

// ===== Cajón de entrevista =====

function hmDocumentoCv(candidato) {
    const secciones = candidato.cv.secciones
        .map(
            seccion => `
                <section>
                    <h2>${seccion.titulo}</h2>
                    ${seccion.lineas.map(linea => `<p>${linea}</p>`).join("")}
                </section>
            `
        )
        .join("");

    return `<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    padding: 18px;
                    background: #eeeef2;
                    font-family: Inter, system-ui, Arial, sans-serif;
                    color: #3f3f4a;
                }
                article {
                    max-width: 520px;
                    margin: 0 auto;
                    padding: 26px;
                    border-radius: 5px;
                    background: #fff;
                    box-shadow: 0 4px 16px rgba(0,0,0,.09);
                }
                header { padding-bottom: 12px; border-bottom: 2px solid #e10098; }
                h1 { color: #20202a; font-size: 17px; }
                header p { margin-top: 4px; color: #6b6b76; font-size: 10px; }
                section { margin-top: 16px; }
                h2 {
                    margin-bottom: 7px;
                    padding-bottom: 5px;
                    border-bottom: 1px dashed #ddd;
                    color: #e10098;
                    font-size: 10px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }
                section p { margin-top: 5px; font-size: 11px; line-height: 1.55; }
            </style>
        </head>
        <body>
            <article>
                <header>
                    <h1>${candidato.nombre}</h1>
                    <p>${candidato.puestoActual} · ${candidato.empresa} · ${candidato.cv.contacto}</p>
                </header>
                ${secciones}
            </article>
        </body>
        </html>`;
}

function hmRenderHistorial(candidato) {
    if (candidato.entrevistas.length === 0) {
        hmEl("hm-history").innerHTML = '<p class="hm-empty">Sin entrevistas registradas.</p>';
        return;
    }

    hmEl("hm-history").innerHTML = candidato.entrevistas
        .map(
            entrevista => `
                <article class="hm-history__item">
                    <div class="hm-history__top">
                        <div>
                            <h4>${entrevista.etapa}</h4>
                            <small>${entrevista.fecha} · ${entrevista.entrevistador} (${entrevista.rol})</small>
                        </div>
                        <span class="hm-history__score">${entrevista.calificacion}/10</span>
                    </div>
                    <p>${entrevista.notas}</p>
                    <span class="hm-chip hm-chip--${hmClaseVeredicto(entrevista.veredicto)}">${entrevista.veredicto}</span>
                </article>
            `
        )
        .join("");
}

function hmRenderSheet(candidato) {
    hmEl("hm-sheet-initials").textContent = hmIniciales(candidato.nombre);
    hmEl("hm-sheet-name").textContent = candidato.nombre;
    hmEl("hm-sheet-role").textContent = `${candidato.puestoActual} · ${candidato.empresa}`;

    hmEl("hm-sheet-chips").innerHTML = `
        <span class="hm-chips__compat">${candidato.compatibilidad}% AssessFirst</span>
        <span>${candidato.estado}</span>
        <span>${candidato.ubicacion}</span>
        <span>Deseada: ${candidato.compensacionDeseada}</span>
    `;

    hmEl("hm-cv-file").textContent = `📄 ${candidato.cv.archivo}`;
    hmEl("hm-cv-frame").srcdoc = hmDocumentoCv(candidato);

    hmRenderHistorial(candidato);

    const formulario = hmEl("hm-feedback-form");

    formulario.reset();

    if (candidato.evaluacionHM) {
        const radio = formulario.querySelector(`input[name="hm-verdict"][value="${candidato.evaluacionHM.veredicto}"]`);

        if (radio) {
            radio.checked = true;
        }

        hmEl("hm-feedback").value = candidato.evaluacionHM.justificacion;
    }

    hmActualizarAcciones();
}

function hmAbrirSheet(id) {
    const candidato = hmCandidato(id);

    if (!candidato) {
        return;
    }

    hmState.candidatoActivo = candidato;

    hmRenderSheet(candidato);

    hmEl("hm-sheet").classList.add("is-open");
    hmEl("hm-overlay").classList.add("is-open");
}

function hmCerrarSheet() {
    hmState.candidatoActivo = null;

    hmEl("hm-sheet").classList.remove("is-open");
    hmEl("hm-overlay").classList.remove("is-open");
}

// Sin justificación no se habilita ninguna decisión: trazabilidad obligatoria
function hmActualizarAcciones() {
    const justificacion = hmEl("hm-feedback").value.trim();
    const veredicto = hmEl("hm-feedback-form").querySelector('input[name="hm-verdict"]:checked');
    const bloqueado = justificacion === "" || !veredicto;

    hmEl("hm-feedback-form")
        .querySelectorAll("[data-decision]")
        .forEach(boton => {
            boton.disabled = bloqueado;
        });

    const pista = hmEl("hm-hint");

    if (!veredicto) {
        pista.textContent = "Selecciona un veredicto para habilitar la decisión.";
        pista.classList.add("is-warning");
        return;
    }

    if (justificacion.length < HM_MIN_JUSTIFICACION) {
        pista.textContent = `Justificación obligatoria: ${justificacion.length}/${HM_MIN_JUSTIFICACION} caracteres mínimos.`;
        pista.classList.add("is-warning");
        return;
    }

    pista.textContent = "Justificación válida. La decisión quedará registrada con tu nombre y fecha.";
    pista.classList.remove("is-warning");
}

function hmGuardarDecision(decision, veredicto, justificacion) {
    const candidato = hmState.candidatoActivo;

    candidato.estado = decision === "finalista" ? "Finalista" : "Descartado";
    candidato.evaluacionHM = {
        veredicto,
        justificacion,
        fecha: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })
    };
    candidato.proximaEntrevista = null;

    hmState.seleccionados = hmState.seleccionados.filter(id => id !== candidato.id);

    hmRenderShortlist();
    hmRenderBadge();
    hmRenderAlertas();
    hmRenderEntrevistas();
    hmRenderFab();

    if (hmState.arenaAbierta) {
        if (hmState.seleccionados.length < 2) {
            hmCerrarArena();
        } else {
            hmRenderArena();
        }
    }

    hmToast(`${candidato.nombre} quedó como ${candidato.estado.toLowerCase()}.`);
    hmCerrarSheet();
}

function hmInitSheet() {
    const formulario = hmEl("hm-feedback-form");

    hmEl("hm-sheet-close").addEventListener("click", hmCerrarSheet);
    hmEl("hm-overlay").addEventListener("click", hmCerrarSheet);

    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") {
            hmCerrarSheet();
        }
    });

    hmEl("hm-feedback").addEventListener("input", hmActualizarAcciones);
    formulario.addEventListener("change", hmActualizarAcciones);

    formulario.addEventListener("submit", evento => {
        evento.preventDefault();

        const decision = evento.submitter?.dataset.decision;
        const veredicto = formulario.querySelector('input[name="hm-verdict"]:checked');
        const justificacion = hmEl("hm-feedback").value.trim();

        if (!decision || !hmState.candidatoActivo) {
            return;
        }

        if (!veredicto) {
            alert("Operación denegada: Registra un veredicto explícito antes de continuar.");
            return;
        }

        if (justificacion.length < HM_MIN_JUSTIFICACION) {
            if (decision === "descartar") {
                alert(
                    "Operación denegada: Debes justificar la decisión técnica para descartar al candidato. Esto garantiza la trazabilidad del proceso."
                );
            } else {
                alert(
                    "Operación denegada: Debes justificar la decisión técnica antes de marcar al candidato como finalista. Esto garantiza la trazabilidad del proceso."
                );
            }

            hmEl("hm-feedback").focus();
            return;
        }

        hmGuardarDecision(decision, veredicto.value, justificacion);
    });
}

// ===== Vista de entrevistas =====

function hmRenderEntrevistas() {
    const pendientes = hmPendientes();

    if (pendientes.length === 0) {
        hmEl("hm-interviews").innerHTML =
            '<p class="hm-empty">No tienes veredictos pendientes. Todo el shortlist está evaluado.</p>';
        return;
    }

    hmEl("hm-interviews").innerHTML = pendientes
        .map(candidato => {
            const cita = candidato.proximaEntrevista;

            return `
                <article class="hm-interview">

                    <span class="hm-avatar">${hmIniciales(candidato.nombre)}</span>

                    <div class="hm-interview__info">
                        <h3>${candidato.nombre}</h3>
                        <p>${cita ? `${cita.fecha} · ${cita.modalidad}` : "Sin sesión agendada"}</p>
                        <p>${cita ? cita.panel : `${candidato.puestoActual} · ${candidato.empresa}`}</p>
                    </div>

                    <span class="hm-chip hm-chip--neutral">${candidato.diasEsperando} día(s) esperando</span>

                    <button class="hm-button hm-button--primary" type="button" data-evaluar-entrevista="${candidato.id}">
                        Evaluar Perfil
                    </button>

                </article>
            `;
        })
        .join("");
}

function hmInitEntrevistas() {
    hmEl("hm-interviews").addEventListener("click", evento => {
        const boton = evento.target.closest("[data-evaluar-entrevista]");

        if (boton) {
            hmAbrirSheet(boton.dataset.evaluarEntrevista);
        }
    });
}

// ===== Navegación =====

function hmSetVista(vista) {
    hmState.vista = vista;

    hmEl("hm-view-vacantes").hidden = vista !== "vacantes";
    hmEl("hm-view-entrevistas").hidden = vista !== "entrevistas";

    document.querySelectorAll(".hm-nav__link").forEach(enlace => {
        enlace.classList.toggle("is-active", enlace.dataset.view === vista);
    });

    hmRenderFab();
}

function hmInitNav() {
    document.querySelectorAll(".hm-nav__link").forEach(enlace => {
        enlace.addEventListener("click", () => hmSetVista(enlace.dataset.view));
    });
}

// ===== Arranque =====

function hmInit() {
    hmRenderVacante();
    hmRenderBadge();
    hmRenderAlertas();
    hmRenderTimeline();
    hmRenderShortlist();
    hmRenderEntrevistas();

    hmInitBanner();
    hmInitAlertas();
    hmInitTimeline();
    hmInitShortlist();
    hmInitArena();
    hmInitSheet();
    hmInitEntrevistas();
    hmInitNav();
}

hmInit();
