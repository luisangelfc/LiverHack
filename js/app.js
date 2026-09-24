// ==========================================================
// ATRACCIÓN DE TALENTO
// LiverHack 2026
//
// Este archivo consume:
// ../js/candidatos-db.js   (base de candidatos)
// ../js/edat-flow.js       (etapas, decisiones y notificaciones)
//
// Ambos DEBEN cargarse antes que app.js
// ==========================================================


const AT_ACTOR = "at";


// ==========================================================
// VERIFICAR BASE DE DATOS
// ==========================================================

const rawCandidatesDb =
    typeof CANDIDATOS_RAW_DB !== "undefined"
        ? CANDIDATOS_RAW_DB
        : [];


if (rawCandidatesDb.length === 0) {

    console.error(
        "No se encontró CANDIDATOS_RAW_DB. Revisa que candidatos-db.js se cargue antes que app.js."
    );

}



// ==========================================================
// UTILIDADES PARA ADAPTAR LA BASE
// ==========================================================

function formatMoney(value) {

    if (value === null || value === undefined || value === "") {
        return "No especificado";
    }

    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0
    }).format(value);

}


function normalizeCompatibility(value) {

    const numberValue = Number(String(value ?? "").replace("%", "").trim());

    return Number.isNaN(numberValue) ? 0 : numberValue;

}


function textToArray(value) {

    if (!value) {
        return [];
    }

    return String(value)
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);

}


function initials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0])
        .join("")
        .toUpperCase();

}


// Los estados nuevos del flujo reutilizan las mismas clases
// visuales que ya existían para no inventar otra paleta.
function statusClass(status) {

    if (
        status === EDAT.ESTADOS.FINALISTA
        || status === EDAT.ESTADOS.INCORPORADO
        || status === EDAT.ESTADOS.OFERTA_ENVIADA
        || status === EDAT.ESTADOS.OFERTA_ACEPTADA
    ) {
        return "finalista";
    }

    if (
        status === EDAT.ESTADOS.DESCARTADO
        || status === EDAT.ESTADOS.NO_SELECCIONADO
    ) {
        return "descartado";
    }

    return "proceso";

}


function verdictClass(verdict) {

    if (verdict === "Recomendado") {
        return "recomendado";
    }

    if (verdict === "No recomendado") {
        return "no-recomendado";
    }

    return "reservas";

}


const el = id => document.getElementById(id);



// ==========================================================
// CONVERTIR BASE DE DATOS AL FORMATO DE LA INTERFAZ
//
// El estado de cada candidato NO se lee del archivo crudo:
// lo entrega el flujo compartido, que sabe si el candidato
// avanzó, cerró proceso o fue incorporado.
// ==========================================================

function buildCandidates() {

    return rawCandidatesDb.map(raw => {

        const compatibility = normalizeCompatibility(raw.assessfirst?.compatibilidad);

        const flow = EDAT.candidato(raw.id);

        return {

            id: `c${raw.id}`,
            rawId: raw.id,

            name: raw.nombre || "Sin nombre",
            currentRole: raw.puesto_actual || "No especificado",
            company: raw.empresa_actual || "No especificada",

            status: flow.estado,
            compatibility,

            education: raw.escolaridad || "No especificada",
            otherStudies: raw.otros_estudios || "No especificados",
            languages: raw.idiomas || "No especificados",
            summary: raw.resumen_profesional || "Información no disponible",

            currentComp: formatMoney(raw.compensacion_actual),
            desiredComp: formatMoney(raw.compensacion_deseada),

            statusJustification: raw.status_justificacion || "",

            assess: {
                compatibility,
                description: raw.assessfirst?.descripcion || "Sin descripción registrada.",
                strengths: textToArray(raw.assessfirst?.fortalezas),
                opportunities: textToArray(raw.assessfirst?.areas_oportunidad),
                leadershipStyle: raw.assessfirst?.estilo_liderazgo || "No especificado",
                strategicVision: raw.assessfirst?.vision_estrategica || "No especificada",
                decisionMaking: raw.assessfirst?.toma_decisiones || "No especificada",
                recommendation: raw.assessfirst?.recomendaciones || "Sin recomendación registrada."
            },

            interviews: Array.isArray(raw.entrevistas)
                ? raw.entrevistas.map(interview => ({
                    id: interview.entrevista_id,
                    date: interview.fecha || "Fecha no registrada",
                    stage: "Entrevista",
                    interviewer: Array.isArray(interview.entrevistadores)
                        ? interview.entrevistadores.join(", ")
                        : "No registrado",
                    notes: interview.notas || "Sin notas registradas.",
                    verdict: interview.veredicto || "Pendiente"
                }))
                : [],

            cv: {
                path: raw.cv_path || "",
                fileName: raw.cv_path
                    ? raw.cv_path.split("/").pop()
                    : `CV_${raw.nombre || "candidato"}.pdf`,

                // Todavía no cargamos PDFs reales: el visor arma las
                // páginas con la información de la propia base.
                pages: [
                    {
                        title: "Perfil profesional",
                        blocks: [
                            `${(raw.nombre || "Candidato").toUpperCase()} — ${raw.puesto_actual || "Puesto no registrado"}`,
                            raw.resumen_profesional || "Resumen profesional no disponible.",
                            `EMPRESA ACTUAL\n${raw.empresa_actual || "No especificada"}`
                        ]
                    },
                    {
                        title: "Educación y competencias",
                        blocks: [
                            `ESCOLARIDAD\n${raw.escolaridad || "No especificada"}`,
                            `OTROS ESTUDIOS\n${raw.otros_estudios || "No especificados"}`,
                            `IDIOMAS\n${raw.idiomas || "No especificados"}`
                        ]
                    }
                ]
            },

            flow

        };

    });

}


let candidates = buildCandidates();



// ==========================================================
// ESTADO DE LA INTERFAZ
// ==========================================================

let currentView = "vacante";

let currentFilter = "Todos";

let searchTerm = "";

let selectedIds = [];

let currentCandidate = null;

let cvPage = 0;

let cvZoom = 1;

// Borradores de la evaluación de AT antes de guardarlos.
const evaluationDrafts = {};



// ==========================================================
// TOAST
// ==========================================================

function showToast(message) {

    const toast = el("toast");

    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("active");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(
        () => toast.classList.remove("active"),
        3200
    );

}


// Ejecuta una acción del flujo y muestra su resultado.
function runFlow(action) {

    const result = action();

    showToast(result.mensaje);

    return result.ok;

}



// ==========================================================
// KPIs
// ==========================================================

function renderKPIs() {

    const container = el("kpiContainer");

    if (!container) {
        return;
    }

    const cuenta = estado =>
        candidates.filter(candidate => candidate.status === estado).length;

    const kpis = [
        {
            label: "Candidatos registrados",
            value: candidates.length,
            delta: "Base de talento",
            tone: "grape"
        },
        {
            label: "Candidatos en proceso",
            value: cuenta(EDAT.ESTADOS.EN_PROCESO),
            delta: `${EDAT.candidatosActivos().length} en esta vacante`,
            tone: "pink"
        },
        {
            label: "Finalistas",
            value: cuenta(EDAT.ESTADOS.FINALISTA),
            delta: "Perfiles avanzados",
            tone: "flame"
        },
        {
            label: "Procesos cerrados",
            value: cuenta(EDAT.ESTADOS.DESCARTADO) + cuenta(EDAT.ESTADOS.NO_SELECCIONADO),
            delta: "Descartados y no seleccionados",
            tone: "grape"
        }
    ];

    container.innerHTML = kpis
        .map(
            kpi => `
                <article class="kpi-card">
                    <div class="kpi-line ${kpi.tone}"></div>
                    <span>${kpi.label}</span>
                    <strong>${kpi.value}</strong>
                    <p>${kpi.delta}</p>
                </article>
            `
        )
        .join("");

}



// ==========================================================
// NOTIFICACIONES
// ==========================================================

function renderNotifications() {

    const container = el("alertsContainer");

    if (!container) {
        return;
    }

    const notas = EDAT.notificaciones(AT_ACTOR);

    const iconMap = {
        critica: "⚠",
        info: "ⓘ"
    };

    container.innerHTML = notas.length === 0
        ? '<div class="empty-state">Todavía no tienes notificaciones.</div>'
        : notas
            .map(
                nota => `
                    <article class="alert ${nota.nivel === "critica" ? "critical" : "info"}">

                        <span class="alert-icon">${iconMap[nota.nivel] || "ⓘ"}</span>

                        <div>
                            <h4>${nota.titulo}</h4>
                            <p>${nota.mensaje}</p>
                            <small>${EDAT.tiempoRelativo(nota.fecha)}</small>
                        </div>

                    </article>
                `
            )
            .join("");

    const badge = el("criticalBadge");

    if (badge) {

        const sinLeer = EDAT.noLeidas(AT_ACTOR);

        badge.textContent = sinLeer;
        badge.style.display = sinLeer === 0 ? "none" : "";

    }

}



// ==========================================================
// ENCABEZADO DE LA VACANTE
// ==========================================================

function renderVacancyHeader() {

    const estado = EDAT.estado();

    const titulo = estado.requisicion?.titulo || "Sin requisición recibida";

    el("atVacancyTitle").textContent = titulo;
    el("atVacancyHeadline").textContent = titulo;

    el("atVacancyState").textContent = EDAT.vacanteDetenida()
        ? `● Detenida por ${estado.vacante.detenidaPor}`
        : `● ${estado.vacante.estado}`;

}



// ==========================================================
// TIMELINE DE LA VACANTE (solo lectura)
// ==========================================================

function renderTimeline() {

    const timeline = el("timelineContainer");

    if (!timeline) {
        return;
    }

    const etapas = EDAT.etapasVacante();

    const totalElapsed = etapas.reduce((total, etapa) => total + etapa.transcurrido, 0);
    const totalSLA = etapas.reduce((total, etapa) => total + etapa.sla, 0);

    const globalStatus = el("globalStageStatus");

    if (globalStatus) {
        globalStatus.textContent = `${totalElapsed} de ${totalSLA} días hábiles consumidos`;
    }

    timeline.innerHTML = etapas
        .map(etapa => {

            const percent = Math.min(
                100,
                Math.round((etapa.transcurrido / etapa.sla) * 100)
            );

            const clase = etapa.estado === "completada"
                ? "done"
                : etapa.estado === "pendiente"
                    ? "pending"
                    : "current";

            return `
                <article class="timeline-stage ${clase}">

                    <div class="timeline-stage-header">
                        <span class="stage-number">${etapa.estado === "completada" ? "✓" : etapa.numero}</span>
                        <h4>${etapa.nombre}</h4>
                    </div>

                    <p class="stage-owner">${etapa.responsable}</p>

                    <p class="stage-time">◷ ${etapa.transcurrido}/${etapa.sla} días hábiles</p>

                    <div class="progress">
                        <div class="progress-fill" style="width: ${percent}%;"></div>
                    </div>

                </article>
            `;

        })
        .join("");

}



// ==========================================================
// REQUISICIÓN RECIBIDA
// ==========================================================

function renderRequisition() {

    const estado = EDAT.estado();
    const detalle = el("atRequisitionDetail");

    if (!estado.requisicion) {

        el("atRequisitionSubtitle").textContent =
            "HRBP todavía no envía la requisición de la vacante.";

        detalle.innerHTML =
            '<div class="at-note">En cuanto HRBP envíe la requisición la verás aquí.</div>';

        return;

    }

    el("atRequisitionSubtitle").textContent =
        `Recibida de HRBP el ${EDAT.fecha(estado.requisicion.fecha)}.`;

    const campos = [
        ["Título de la vacante", estado.requisicion.titulo],
        ["Estudios / escolaridad", estado.requisicion.escolaridad],
        ["Descripción general", estado.requisicion.descripcion],
        ["Conocimientos técnicos", estado.requisicion.conocimientos],
        ["Hard Skills", estado.requisicion.hardSkills],
        ["Soft Skills", estado.requisicion.softSkills],
        ["Propuesta salarial", estado.requisicion.salario],
        ["DSQ", estado.requisicion.dsq]
    ];

    detalle.innerHTML = `
        <ul class="at-detail-list">
            ${campos
                .map(([etiqueta, valor]) => `<li><span>${etiqueta}</span><strong>${valor}</strong></li>`)
                .join("")}
        </ul>
    `;

}



// ==========================================================
// ALINEACIÓN · REQUISITOS NO NEGOCIABLES
// ==========================================================

let draftRequirements = [];


function renderAlignment() {

    const estado = EDAT.estado();
    const body = el("atAlignmentBody");

    if (!estado.requisicion) {

        body.innerHTML =
            '<div class="at-note">La alineación inicia cuando HRBP envía la requisición.</div>';

        return;

    }

    if (estado.alineacion.at.estado !== "Pendiente") {

        const lista = estado.alineacion.at.noNegociables;

        body.innerHTML = `
            <ul class="at-chip-list">
                ${lista.length === 0
                    ? "<li>Sin requisitos registrados</li>"
                    : lista.map(item => `<li>${item}</li>`).join("")}
            </ul>

            <ul class="at-detail-list">
                <li>
                    <span>Decisión de Atracción de Talento</span>
                    <strong>${estado.alineacion.at.estado} · ${EDAT.fecha(estado.alineacion.at.fecha)}</strong>
                </li>
                <li>
                    <span>Decisión del Hiring Manager</span>
                    <strong>${estado.alineacion.hm.estado}${estado.alineacion.hm.fecha ? ` · ${EDAT.fecha(estado.alineacion.hm.fecha)}` : ""}</strong>
                </li>
            </ul>
        `;

        return;

    }

    body.innerHTML = `
        <div class="at-inline-field">

            <div class="at-field">
                <label for="requirementInput">Agregar requisito indispensable</label>
                <input id="requirementInput" type="text" placeholder="Ej. Licenciatura concluida en área afín">
            </div>

            <button class="at-button at-button--ghost" type="button" data-add-requirement>
                Agregar
            </button>

        </div>

        <ul class="at-chip-list">
            ${draftRequirements.length === 0
                ? "<li>Sin requisitos definidos todavía</li>"
                : draftRequirements
                    .map(
                        (item, index) => `
                            <li>
                                ${item}
                                <button type="button" data-remove-requirement="${index}" title="Quitar">×</button>
                            </li>
                        `
                    )
                    .join("")}
        </ul>

        <div class="at-actions">

            <button class="at-button at-button--ghost" type="button" data-decline-requisition>
                Declinar requisición
            </button>

            <button class="at-button" type="button" data-accept-requisition ${draftRequirements.length === 0 ? "disabled" : ""}>
                Aceptar perfil y enviar alineación a Hiring Manager
            </button>

        </div>

        <p class="at-hint">
            Registra únicamente lo indispensable: escolaridad, habilidades técnicas
            y conocimientos requeridos.
        </p>
    `;

}


function configureAlignment() {

    el("atAlignmentBody").addEventListener("click", event => {

        if (event.target.closest("[data-add-requirement]")) {

            const input = el("requirementInput");
            const value = input.value.trim();

            if (value === "") {
                showToast("Escribe el requisito antes de agregarlo.");
                return;
            }

            draftRequirements.push(value);

            renderAlignment();

            return;

        }

        const remove = event.target.closest("[data-remove-requirement]");

        if (remove) {

            draftRequirements.splice(Number(remove.dataset.removeRequirement), 1);

            renderAlignment();

            return;

        }

        if (event.target.closest("[data-accept-requisition]")) {

            runFlow(() => EDAT.atAceptarAlineacion(draftRequirements));

            return;

        }

        if (event.target.closest("[data-decline-requisition]")) {
            runFlow(EDAT.atDeclinar);
        }

    });

    el("atAlignmentBody").addEventListener("keydown", event => {

        if (event.key === "Enter" && event.target.id === "requirementInput") {

            event.preventDefault();

            el("atAlignmentBody")
                .querySelector("[data-add-requirement]")
                .click();

        }

    });

}



// ==========================================================
// ENTREVISTAS DE ATRACCIÓN DE TALENTO
// ==========================================================

function renderInterviews() {

    const lista = el("atInterviewsList");
    const activos = EDAT.candidatosActivos();

    if (!EDAT.etapaAlcanzada("entrevistas_at")) {

        el("atInterviewsSubtitle").textContent =
            "Las entrevistas inician cuando la vacante queda alineada.";

        el("atInterviewsPill").textContent = "";

        lista.innerHTML =
            '<div class="at-note">Aún no hay entrevistas agendadas para esta vacante.</div>';

        return;

    }

    const finalizadas = activos.filter(
        candidato => candidato.entrevistaAT?.estado === "Finalizada"
    ).length;

    el("atInterviewsSubtitle").textContent =
        `${activos.length} candidatos En Proceso asignados a esta vacante.`;

    el("atInterviewsPill").textContent =
        `${finalizadas} de ${activos.length} entrevistas finalizadas`;

    lista.innerHTML = activos
        .map(candidato => {

            const entrevista = candidato.entrevistaAT;
            const finalizada = entrevista?.estado === "Finalizada";

            return `
                <article class="at-interview">

                    <span class="at-interview__avatar">${initials(candidato.nombre)}</span>

                    <div class="at-interview__info">
                        <strong>${candidato.nombre}</strong>
                        <p>${candidato.puesto_actual} · ${candidato.empresa_actual}</p>
                        <p>${EDAT.fecha(entrevista.fecha)} · ${entrevista.hora}</p>
                    </div>

                    <span class="at-tag ${finalizada ? "at-tag--lista" : "at-tag--pendiente"}">
                        Entrevista ${finalizada ? "finalizada" : "pendiente"}
                    </span>

                    ${finalizada
                        ? '<span class="at-tag at-tag--neutral">Lista para evaluar</span>'
                        : `<button class="at-button" type="button" data-finish-interview="${candidato.id}">
                                Marcar entrevista como finalizada
                           </button>`}

                </article>
            `;

        })
        .join("");

}


function configureInterviews() {

    el("atInterviewsList").addEventListener("click", event => {

        const boton = event.target.closest("[data-finish-interview]");

        if (boton) {
            runFlow(() => EDAT.atFinalizarEntrevista(boton.dataset.finishInterview));
        }

    });

}



// ==========================================================
// EVALUACIÓN DE CANDIDATOS
// ==========================================================

function scoreOptions(selected) {

    const escala = [
        { value: 1, label: "1 · Muy por debajo" },
        { value: 2, label: "2 · Por debajo" },
        { value: 3, label: "3 · Cumple" },
        { value: 4, label: "4 · Supera lo esperado" },
        { value: 5, label: "5 · Sobresaliente" }
    ];

    return escala
        .map(
            item => `<option value="${item.value}" ${Number(selected) === item.value ? "selected" : ""}>${item.label}</option>`
        )
        .join("");
}


function renderEvaluations() {

    const lista = el("atEvalList");
    const acciones = el("atEvalActions");
    const activos = EDAT.candidatosActivos();

    if (!EDAT.etapaAlcanzada("entrevistas_at")) {

        el("atEvalPill").textContent = "";

        lista.innerHTML =
            '<div class="at-note">Podrás evaluar cuando inicien las entrevistas.</div>';

        acciones.innerHTML = "";

        return;

    }

    const evaluados = activos.filter(candidato => candidato.evaluacionAT).length;

    el("atEvalPill").textContent = `${evaluados} de ${activos.length} candidatos evaluados`;

    const enviadas = EDAT.estado().evaluacionesEnviadas;

    lista.innerHTML = activos
        .map(candidato => {

            const finalizada = candidato.entrevistaAT?.estado === "Finalizada";
            const evaluacion = candidato.evaluacionAT;
            const borrador = evaluationDrafts[candidato.id] || {};

            let cuerpo;

            if (!finalizada) {

                cuerpo = `
                    <p class="at-hint">
                        Marca la entrevista como finalizada para registrar su evaluación.
                    </p>
                `;

            }
            else if (evaluacion && enviadas) {

                cuerpo = `
                    <div class="at-eval-done">
                        <span>Hard Skills: ${evaluacion.hard}/5</span>
                        <span>Soft Skills: ${evaluacion.soft}/5</span>
                    </div>
                    ${evaluacion.comentario
                        ? `<p class="at-eval-comment">${evaluacion.comentario}</p>`
                        : ""}
                `;

            }
            else {

                cuerpo = `
                    <div class="at-score-grid">

                        <div class="at-field">
                            <label for="hard-${candidato.id}">Hard Skills (1 a 5)</label>
                            <select id="hard-${candidato.id}" data-score="hard" data-candidate="${candidato.id}">
                                <option value="">Sin calificar</option>
                                ${scoreOptions(borrador.hard ?? evaluacion?.hard)}
                            </select>
                        </div>

                        <div class="at-field">
                            <label for="soft-${candidato.id}">Soft Skills (1 a 5)</label>
                            <select id="soft-${candidato.id}" data-score="soft" data-candidate="${candidato.id}">
                                <option value="">Sin calificar</option>
                                ${scoreOptions(borrador.soft ?? evaluacion?.soft)}
                            </select>
                        </div>

                    </div>

                    <div class="at-field">
                        <label for="comment-${candidato.id}">Comentario (opcional)</label>
                        <textarea id="comment-${candidato.id}" rows="2" data-score="comentario" data-candidate="${candidato.id}"
                            placeholder="Observaciones de la entrevista">${borrador.comentario ?? evaluacion?.comentario ?? ""}</textarea>
                    </div>

                    <div class="at-actions">
                        <button class="at-button" type="button" data-save-evaluation="${candidato.id}">
                            Guardar evaluación
                        </button>
                    </div>
                `;

            }

            return `
                <article class="at-eval-card">

                    <div class="at-eval-card__head">

                        <span class="at-interview__avatar">${initials(candidato.nombre)}</span>

                        <div>
                            <strong>${candidato.nombre}</strong>
                            <p>${candidato.puesto_actual}</p>
                        </div>

                        <span class="at-tag ${evaluacion ? "at-tag--lista" : "at-tag--pendiente"}">
                            ${evaluacion ? "Evaluación registrada" : "Evaluación pendiente"}
                        </span>

                    </div>

                    ${cuerpo}

                </article>
            `;

        })
        .join("");

    const pendientes = EDAT.evaluacionesPendientes().length;

    acciones.innerHTML = enviadas
        ? `<p class="at-hint">Las evaluaciones de los ${activos.length} candidatos ya fueron enviadas al Hiring Manager.</p>`
        : `
            <button class="at-button" type="button" data-send-evaluations ${pendientes > 0 ? "disabled" : ""}>
                Enviar evaluaciones de los ${activos.length} candidatos a Hiring Manager
            </button>
            ${pendientes > 0
                ? `<p class="at-hint">Faltan ${pendientes} evaluación(es) por registrar.</p>`
                : ""}
        `;

}


function configureEvaluations() {

    const lista = el("atEvalList");

    lista.addEventListener("change", event => {

        const campo = event.target.closest("[data-score]");

        if (!campo) {
            return;
        }

        const id = campo.dataset.candidate;

        evaluationDrafts[id] = evaluationDrafts[id] || {};
        evaluationDrafts[id][campo.dataset.score] = campo.value;

    });

    lista.addEventListener("input", event => {

        const campo = event.target.closest('[data-score="comentario"]');

        if (!campo) {
            return;
        }

        const id = campo.dataset.candidate;

        evaluationDrafts[id] = evaluationDrafts[id] || {};
        evaluationDrafts[id].comentario = campo.value;

    });

    lista.addEventListener("click", event => {

        const boton = event.target.closest("[data-save-evaluation]");

        if (!boton) {
            return;
        }

        const id = boton.dataset.saveEvaluation;
        const borrador = evaluationDrafts[id] || {};

        runFlow(() => EDAT.atGuardarEvaluacion(id, borrador));

    });

    el("atEvalActions").addEventListener("click", event => {

        if (event.target.closest("[data-send-evaluations]")) {
            runFlow(EDAT.atEnviarEvaluaciones);
        }

    });

}



// ==========================================================
// SELECCIÓN DEL HIRING MANAGER Y CIERRE
// ==========================================================

function renderSelection() {

    const estado = EDAT.estado();
    const lista = el("atSelectionList");

    if (estado.seleccionHM.length === 0) {

        el("atSelectionSubtitle").textContent =
            "Aquí verás a los candidatos que el Hiring Manager envía a entrevista.";

        lista.innerHTML =
            '<div class="at-note">El Hiring Manager todavía no registra su selección.</div>';

        return;

    }

    el("atSelectionSubtitle").textContent =
        `${estado.seleccionHM.length} candidatos enviados a entrevista con Hiring Manager.`;

    const enviados = estado.seleccionHM.map(id => EDAT.candidato(id));

    const cerrados = EDAT.candidatosActivos().filter(
        candidato => candidato.estado === EDAT.ESTADOS.NO_SELECCIONADO
    );

    lista.innerHTML = [...enviados, ...cerrados.filter(c => !estado.seleccionHM.includes(c.id))]
        .map(candidato => {

            const entrevista = candidato.entrevistaHM;

            const detalle = entrevista
                ? `${EDAT.fecha(entrevista.fecha)} · ${entrevista.hora} · Entrevista ${entrevista.estado.toLowerCase()}`
                : candidato.cierre?.motivo || "Proceso concluido";

            return `
                <article class="at-interview">

                    <span class="at-interview__avatar">${initials(candidato.nombre)}</span>

                    <div class="at-interview__info">
                        <strong>${candidato.nombre}</strong>
                        <p>${candidato.puesto_actual} · ${candidato.empresa_actual}</p>
                        <p>${detalle}</p>
                    </div>

                    <span class="at-tag ${statusClass(candidato.estado) === "finalista" ? "at-tag--lista" : "at-tag--neutral"}">
                        ${candidato.estado}
                    </span>

                </article>
            `;

        })
        .join("");

}


function renderClosing() {

    const estado = EDAT.estado();
    const detalle = el("atClosingDetail");
    const acciones = el("atClosingActions");

    const finalista = estado.finalista ? EDAT.candidato(estado.finalista) : null;

    detalle.innerHTML = [
        {
            titulo: "Candidato seleccionado",
            valor: finalista ? finalista.nombre : "Pendiente de decisión del HM"
        },
        {
            titulo: "Oferta",
            valor: !estado.oferta
                ? "Sin generar"
                : `${estado.oferta.estado} · ${EDAT.fecha(estado.oferta.fecha)}`
        },
        {
            titulo: "Disponibilidad de ingreso",
            valor: estado.oferta?.disponibilidad || "Sin confirmar"
        },
        {
            titulo: "Incorporación",
            valor: estado.incorporacion
                ? `Confirmada · ${EDAT.fecha(estado.incorporacion.fecha)}`
                : "Pendiente"
        }
    ]
        .map(caja => `<li><span>${caja.titulo}</span><strong>${caja.valor}</strong></li>`)
        .join("");

    if (estado.incorporacion) {

        el("atClosingSubtitle").textContent =
            "La vacante quedó cubierta y el proceso está finalizado.";

        acciones.innerHTML = "";

        return;

    }

    if (estado.oferta?.estado === "Aceptada") {

        el("atClosingSubtitle").textContent =
            `${finalista.nombre} aceptó la oferta y confirmó su disponibilidad de ingreso.`;

        acciones.innerHTML = `
            <button class="at-button" type="button" data-confirm-onboarding>
                Confirmar incorporación y finalizar proceso
            </button>
        `;

        return;

    }

    el("atClosingSubtitle").textContent =
        "Oferta, aceptación del candidato e incorporación.";

    acciones.innerHTML = "";

}


function configureClosing() {

    el("atClosingActions").addEventListener("click", event => {

        if (event.target.closest("[data-confirm-onboarding]")) {
            runFlow(EDAT.atConfirmarIncorporacion);
        }

    });

}



// ==========================================================
// FILTROS
// ==========================================================

function renderFilters() {

    const container = el("filtersContainer");

    if (!container) {
        return;
    }

    const filters = ["Todos", "En Proceso", "Finalista", "Descartado"];

    container.innerHTML = filters
        .map(
            filter => `
                <button
                    class="filter-button ${currentFilter === filter ? "active" : ""}"
                    data-filter="${filter}"
                    type="button"
                >
                    ${filter}
                </button>
            `
        )
        .join("");

    container.querySelectorAll("[data-filter]").forEach(button => {

        button.addEventListener("click", () => {

            currentFilter = button.dataset.filter;

            renderFilters();
            renderCandidates();

        });

    });

}


function getVisibleCandidates() {

    const term = searchTerm.toLowerCase().trim();

    return candidates.filter(candidate => {

        const matchesFilter =
            currentFilter === "Todos"
            || candidate.status === currentFilter
            || (
                currentFilter === "Finalista"
                && [
                    EDAT.ESTADOS.FINALISTA,
                    EDAT.ESTADOS.OFERTA_ENVIADA,
                    EDAT.ESTADOS.OFERTA_ACEPTADA,
                    EDAT.ESTADOS.INCORPORADO
                ].includes(candidate.status)
            )
            || (
                currentFilter === "Descartado"
                && (
                    candidate.status === EDAT.ESTADOS.DESCARTADO
                    || candidate.status === EDAT.ESTADOS.NO_SELECCIONADO
                )
            );

        const matchesSearch =
            candidate.name.toLowerCase().includes(term)
            || candidate.currentRole.toLowerCase().includes(term)
            || candidate.company.toLowerCase().includes(term);

        return matchesFilter && matchesSearch;

    });

}



// ==========================================================
// RENDERIZAR CANDIDATOS
// ==========================================================

function renderCandidates() {

    const grid = el("candidateGrid");

    if (!grid) {
        return;
    }

    const visible = getVisibleCandidates();

    const counter = el("candidateCounter");

    if (counter) {
        counter.textContent =
            `${visible.length} perfiles · selecciona 2 o más para comparar en Arena Mode`;
    }

    if (visible.length === 0) {

        grid.innerHTML = '<div class="empty-state">No hay candidatos con este filtro.</div>';

        return;

    }

    grid.innerHTML = visible
        .map(candidate => {

            const selected = selectedIds.includes(candidate.id);

            const evaluacion = candidate.flow.evaluacionAT;

            const processText = evaluacion
                ? `Evaluación AT · Hard ${evaluacion.hard}/5 · Soft ${evaluacion.soft}/5`
                : candidate.flow.entrevistaAT
                    ? `Entrevista AT ${candidate.flow.entrevistaAT.estado.toLowerCase()}`
                    : "Sin entrevista asignada en esta vacante";

            return `
                <article class="candidate-card ${selected ? "selected" : ""}">

                    <div class="candidate-top">

                        <input
                            class="candidate-checkbox"
                            type="checkbox"
                            data-select="${candidate.id}"
                            ${selected ? "checked" : ""}
                        >

                        <span class="candidate-avatar">${initials(candidate.name)}</span>

                        <div class="candidate-basic">
                            <h4>${candidate.name}</h4>
                            <p>${candidate.currentRole}</p>
                            <span class="location">${candidate.company}</span>
                        </div>

                        <span class="status ${statusClass(candidate.status)}">${candidate.status}</span>

                    </div>


                    <div class="compatibility">

                        <div class="compatibility-header">
                            <span>Compatibilidad AssessFirst</span>
                            <strong>${candidate.compatibility}%</strong>
                        </div>

                        <div class="progress">
                            <div class="progress-fill" style="width: ${candidate.compatibility}%;"></div>
                        </div>

                    </div>


                    <div class="candidate-footer">

                        <span class="process-days">${processText}</span>

                        <div class="candidate-buttons">

                            <button class="small-button" type="button" data-open="${candidate.id}">
                                📄 CV
                            </button>

                            <button class="small-button primary" type="button" data-open="${candidate.id}">
                                👁 Ver perfil
                            </button>

                        </div>

                    </div>

                </article>
            `;

        })
        .join("");

    grid.querySelectorAll("[data-select]").forEach(checkbox => {

        checkbox.addEventListener("change", () => {
            toggleCandidateSelection(checkbox.dataset.select);
        });

    });

    grid.querySelectorAll("[data-open]").forEach(button => {

        button.addEventListener("click", () => {
            openCandidate(button.dataset.open);
        });

    });

}



// ==========================================================
// SELECCIÓN PARA ARENA
// ==========================================================

function toggleCandidateSelection(id) {

    if (selectedIds.includes(id)) {

        selectedIds = selectedIds.filter(candidateId => candidateId !== id);

    }
    else {

        if (selectedIds.length >= 4) {

            showToast("Puedes comparar máximo 4 candidatos.");

            renderCandidates();

            return;

        }

        selectedIds.push(id);

    }

    updateArenaButton();
    renderCandidates();

}


function updateArenaButton() {

    const counter = el("selectedCounter");
    const button = el("arenaButton");

    if (counter) {
        counter.textContent = selectedIds.length;
    }

    if (button) {
        button.disabled = selectedIds.length < 2;
    }

}



// ==========================================================
// PERFIL DEL CANDIDATO
// ==========================================================

function createInfoBox(icon, label, value) {

    return `
        <div class="info-box">

            <span class="info-icon">${icon}</span>

            <div>
                <span>${label}</span>
                <strong>${value}</strong>
            </div>

        </div>
    `;

}


function openCandidate(id) {

    currentCandidate = candidates.find(candidate => candidate.id === id);

    if (!currentCandidate) {
        return;
    }

    cvPage = 0;
    cvZoom = 1;

    renderCandidateSheet();

    el("sheetOverlay")?.classList.add("active");
    el("candidateSheet")?.classList.add("active");

}


function closeCandidate() {

    el("sheetOverlay")?.classList.remove("active");
    el("candidateSheet")?.classList.remove("active");

}


function renderCandidateSheet() {

    const sheet = el("candidateSheetContent");

    if (!currentCandidate || !sheet) {
        return;
    }

    const candidate = currentCandidate;

    const interviewsHtml = candidate.interviews.length > 0
        ? candidate.interviews
            .map(
                interview => `
                    <article class="interview-item">

                        <div class="interview-top">

                            <div>
                                <h4>${interview.stage}</h4>
                                <small>${interview.date} · ${interview.interviewer}</small>
                            </div>

                            <span class="verdict ${verdictClass(interview.verdict)}">${interview.verdict}</span>

                        </div>

                        <p>${interview.notes}</p>

                    </article>
                `
            )
            .join("")
        : '<div class="summary-box">No hay entrevistas registradas para este candidato.</div>';

    const evaluacion = candidate.flow.evaluacionAT;

    const evaluationHtml = evaluacion
        ? `
            <section class="sheet-section">

                <h3>Evaluación de Atracción de Talento</h3>

                <div class="info-grid">
                    ${createInfoBox("🛠", "Hard Skills", `${evaluacion.hard}/5`)}
                    ${createInfoBox("🤝", "Soft Skills", `${evaluacion.soft}/5`)}
                </div>

                <div class="summary-box">
                    ${evaluacion.comentario || "Sin comentario registrado."}
                </div>

            </section>
        `
        : "";

    const closingHtml = candidate.flow.cierre
        ? `
            <section class="sheet-section">
                <h3>Cierre del proceso</h3>
                <div class="recommendation">${candidate.flow.cierre.motivo}</div>
            </section>
        `
        : "";

    const justificationHtml = candidate.statusJustification
        ? `
            <section class="sheet-section">
                <h3>Justificación del estado</h3>
                <div class="recommendation">${candidate.statusJustification}</div>
            </section>
        `
        : "";

    sheet.innerHTML = `

        <div class="sheet-header">

            <span class="sheet-header-avatar">${initials(candidate.name)}</span>

            <div class="sheet-header-info">

                <h2>${candidate.name}</h2>

                <p>${candidate.currentRole} · ${candidate.company}</p>

                <div class="sheet-tags">
                    <span class="sheet-tag">${candidate.status}</span>
                    <span class="sheet-tag compatibility-tag">${candidate.compatibility}% AssessFirst</span>
                </div>

            </div>

            <button id="closeCandidateButton" class="close-sheet" type="button">×</button>

        </div>


        <div class="sheet-scroll">

            <section class="sheet-section">

                <h3>Resumen profesional</h3>

                <div class="summary-box">${candidate.summary}</div>

                <div class="info-grid">
                    ${createInfoBox("🎓", "Escolaridad", candidate.education)}
                    ${createInfoBox("📚", "Otros estudios", candidate.otherStudies)}
                    ${createInfoBox("🌐", "Idiomas", candidate.languages)}
                    ${createInfoBox("💰", "Compensación actual", candidate.currentComp)}
                    ${createInfoBox("💵", "Compensación deseada", candidate.desiredComp)}
                    ${createInfoBox("🏢", "Empresa actual", candidate.company)}
                </div>

            </section>


            <section class="sheet-section">

                <h3>Currículum · visor embebido</h3>

                <div id="cvViewerContainer"></div>

            </section>


            ${evaluationHtml}


            <section class="sheet-section">

                <h3>Resultados AssessFirst</h3>

                <div class="assess-card">

                    <div class="assess-main">

                        <div class="compatibility-circle">${candidate.compatibility}%</div>

                        <div class="dimensions">

                            <div class="dimension">

                                <div class="dimension-header">
                                    <span>Compatibilidad general</span>
                                    <strong>${candidate.compatibility}%</strong>
                                </div>

                                <div class="progress">
                                    <div class="progress-fill" style="width: ${candidate.compatibility}%;"></div>
                                </div>

                            </div>

                            <div class="summary-box">${candidate.assess.description}</div>

                        </div>

                    </div>


                    <div class="strengths-grid">

                        <div class="strength-box good">
                            <strong>Fortalezas</strong>
                            <ul>${candidate.assess.strengths.map(item => `<li>${item}</li>`).join("")}</ul>
                        </div>

                        <div class="strength-box opportunity">
                            <strong>Áreas de oportunidad</strong>
                            <ul>${candidate.assess.opportunities.map(item => `<li>${item}</li>`).join("")}</ul>
                        </div>

                    </div>


                    <div class="info-grid">
                        ${createInfoBox("👥", "Estilo de liderazgo", candidate.assess.leadershipStyle)}
                        ${createInfoBox("🎯", "Visión estratégica", candidate.assess.strategicVision)}
                        ${createInfoBox("🧠", "Toma de decisiones", candidate.assess.decisionMaking)}
                    </div>


                    <div class="recommendation">
                        <strong>Recomendación interna:</strong>
                        ${candidate.assess.recommendation}
                    </div>

                </div>

            </section>


            ${closingHtml}

            ${justificationHtml}


            <section class="sheet-section">

                <h3>Historial de entrevistas</h3>

                ${interviewsHtml}

            </section>

        </div>
    `;

    el("closeCandidateButton")?.addEventListener("click", closeCandidate);

    renderCvViewer();

}



// ==========================================================
// VISOR DE CV
// ==========================================================

function renderCvViewer() {

    const container = el("cvViewerContainer");

    if (!container || !currentCandidate) {
        return;
    }

    const pages = currentCandidate.cv.pages;
    const page = pages[cvPage];

    container.innerHTML = `

        <div class="cv-viewer">

            <div class="cv-toolbar">

                <span>${currentCandidate.cv.fileName}</span>

                <div class="cv-toolbar-actions">
                    <button id="cvPrevious" type="button">←</button>
                    <span>${cvPage + 1} / ${pages.length}</span>
                    <button id="cvNext" type="button">→</button>
                    <button id="cvZoomOut" type="button">−</button>
                    <button id="cvZoomIn" type="button">+</button>
                </div>

            </div>


            <div class="cv-paper-wrap">

                <div class="cv-paper" style="transform: scale(${cvZoom}); width: ${100 / cvZoom}%;">

                    <h4>${page.title}</h4>

                    ${page.blocks.map(block => `<div class="cv-block">${block}</div>`).join("")}

                </div>

            </div>

        </div>
    `;

    el("cvPrevious")?.addEventListener("click", () => {

        if (cvPage > 0) {
            cvPage--;
            renderCvViewer();
        }

    });

    el("cvNext")?.addEventListener("click", () => {

        if (cvPage < pages.length - 1) {
            cvPage++;
            renderCvViewer();
        }

    });

    el("cvZoomOut")?.addEventListener("click", () => {

        cvZoom = Math.max(0.7, cvZoom - 0.1);
        renderCvViewer();

    });

    el("cvZoomIn")?.addEventListener("click", () => {

        cvZoom = Math.min(1.5, cvZoom + 0.1);
        renderCvViewer();

    });

}



// ==========================================================
// ARENA · COMPARADOR
// ==========================================================

function openArena() {

    if (selectedIds.length < 2) {
        return;
    }

    renderArena();

    el("arenaOverlay")?.classList.add("active");

}


function closeArena() {

    el("arenaOverlay")?.classList.remove("active");

}


function renderArena() {

    const arenaContent = el("arenaContent");

    if (!arenaContent) {
        return;
    }

    const selected = candidates.filter(candidate => selectedIds.includes(candidate.id));

    const rows = [
        { label: "Puesto actual", render: c => c.currentRole },
        { label: "Empresa actual", render: c => c.company },
        { label: "Escolaridad", render: c => c.education },
        { label: "Otros estudios", render: c => c.otherStudies },
        { label: "Idiomas", render: c => c.languages },
        { label: "Compensación actual", render: c => c.currentComp },
        { label: "Compensación deseada", render: c => c.desiredComp },
        { label: "Estilo de liderazgo", render: c => c.assess.leadershipStyle },
        { label: "Visión estratégica", render: c => c.assess.strategicVision },
        { label: "Toma de decisiones", render: c => c.assess.decisionMaking },
        { label: "Fortalezas", render: c => c.assess.strengths.join(" · ") },
        { label: "Áreas de oportunidad", render: c => c.assess.opportunities.join(" · ") },
        {
            label: "Evaluación de Atracción de Talento",
            render: c =>
                c.flow.evaluacionAT
                    ? `Hard Skills ${c.flow.evaluacionAT.hard}/5 · Soft Skills ${c.flow.evaluacionAT.soft}/5`
                    : "Sin evaluar"
        },
        {
            label: "Comentario de la entrevista",
            render: c => c.flow.evaluacionAT?.comentario || "Sin comentario"
        },
        { label: "Estado en el proceso", render: c => c.status }
    ];

    arenaContent.innerHTML = `

        <table class="arena-table">

            <thead>

                <tr>

                    <th class="criterion">Criterio</th>

                    ${selected
                        .map(
                            candidate => `
                                <th>
                                    <div class="arena-candidate">

                                        <span class="candidate-avatar">${initials(candidate.name)}</span>

                                        <div>
                                            <strong>${candidate.name}</strong>
                                            <div>${candidate.compatibility}% AssessFirst</div>
                                        </div>

                                    </div>
                                </th>
                            `
                        )
                        .join("")}

                </tr>

            </thead>


            <tbody>

                <tr class="compat-row">

                    <td class="criterion">Compatibilidad</td>

                    ${selected
                        .map(candidate => `<td><strong>${candidate.compatibility}%</strong></td>`)
                        .join("")}

                </tr>

                ${rows
                    .map(
                        row => `
                            <tr>
                                <td class="criterion">${row.label}</td>
                                ${selected.map(candidate => `<td>${row.render(candidate)}</td>`).join("")}
                            </tr>
                        `
                    )
                    .join("")}

            </tbody>

        </table>


        <div class="arena-footer">

            <p>
                La decisión de a quién entrevistar la registra el Hiring Manager
                con estas mismas evaluaciones.
            </p>

            <button id="closeArenaFooterButton" class="send-finalists" type="button">
                Cerrar comparación
            </button>

        </div>
    `;

    el("closeArenaFooterButton")?.addEventListener("click", closeArena);

}



// ==========================================================
// NAVEGACIÓN POR SECCIONES
// ==========================================================

function setView(view) {

    currentView = view;

    document.querySelectorAll(".at-view").forEach(section => {
        section.hidden = section.id !== `at-view-${view}`;
    });

    document.querySelectorAll(".at-nav__link").forEach(link => {
        link.classList.toggle("is-active", link.dataset.view === view);
    });

}


function renderNavBadges() {

    const estado = EDAT.estado();

    const pendientesEntrevista = EDAT.candidatosActivos().filter(
        candidato => candidato.entrevistaAT && candidato.entrevistaAT.estado !== "Finalizada"
    ).length;

    const pendientesEvaluacion = EDAT.etapaAlcanzada("entrevistas_at") && !estado.evaluacionesEnviadas
        ? EDAT.evaluacionesPendientes().length
        : 0;

    const pendientesCierre = estado.oferta?.estado === "Aceptada" && !estado.incorporacion
        ? 1
        : 0;

    const badges = [
        ["atInterviewBadge", pendientesEntrevista],
        ["atEvalBadge", pendientesEvaluacion],
        ["atCloseBadge", pendientesCierre]
    ];

    badges.forEach(([id, total]) => {

        const badge = el(id);

        badge.textContent = total;
        badge.hidden = total === 0;

    });

}



// ==========================================================
// EVENTOS GENERALES
// ==========================================================

function configureEvents() {

    el("searchInput")?.addEventListener("input", event => {

        searchTerm = event.target.value;

        renderCandidates();

    });

    el("alertsButton")?.addEventListener("click", () => {

        const panel = el("alertsPanel");

        panel?.classList.toggle("hidden");

        if (panel && !panel.classList.contains("hidden")) {
            EDAT.marcarLeidas(AT_ACTOR);
        }

    });

    el("closeAlertsButton")?.addEventListener("click", () => {
        el("alertsPanel")?.classList.add("hidden");
    });

    el("arenaButton")?.addEventListener("click", openArena);

    el("closeArenaButton")?.addEventListener("click", closeArena);

    el("sheetOverlay")?.addEventListener("click", closeCandidate);

    el("arenaOverlay")?.addEventListener("click", event => {

        if (event.target.id === "arenaOverlay") {
            closeArena();
        }

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeCandidate();
            closeArena();
        }

    });

    document.querySelectorAll(".at-nav__link").forEach(link => {
        link.addEventListener("click", () => setView(link.dataset.view));
    });

    el("atLogoutButton")?.addEventListener("click", EDAT.cerrarSesion);

    const sesion = EDAT.sesion();

    if (sesion?.email) {
        el("atUserEmail").textContent = sesion.email;
    }

}



// ==========================================================
// RENDER GENERAL
// ==========================================================

function render() {

    candidates = buildCandidates();

    renderVacancyHeader();
    renderNotifications();
    renderTimeline();
    renderRequisition();
    renderAlignment();
    renderKPIs();
    renderFilters();
    renderCandidates();
    renderInterviews();
    renderEvaluations();
    renderSelection();
    renderClosing();
    renderNavBadges();
    updateArenaButton();

    if (currentCandidate) {

        currentCandidate = candidates.find(candidate => candidate.id === currentCandidate.id);

        if (currentCandidate && el("candidateSheet").classList.contains("active")) {
            renderCandidateSheet();
        }

    }

}



// ==========================================================
// INICIALIZACIÓN
// ==========================================================

function init() {

    configureEvents();
    configureAlignment();
    configureInterviews();
    configureEvaluations();
    configureClosing();

    EDAT.suscribir(render);

    setView(currentView);

    render();

}


init();
