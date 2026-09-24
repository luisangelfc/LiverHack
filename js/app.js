// ==========================================================
// TALENT RECRUITMENT HUB
// LiverHack 2026
//
// Este archivo consume:
// ../js/candidatos-db.js
//
// candidatos-db.js DEBE cargarse antes que app.js
// ==========================================================



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

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "No especificado";

    }


    return new Intl.NumberFormat(
        "es-MX",
        {
            style: "currency",
            currency: "MXN",
            maximumFractionDigits: 0
        }
    ).format(value);

}



function normalizeCompatibility(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return 0;

    }


    const numberValue =
        Number(
            String(value)
                .replace("%", "")
                .trim()
        );


    return Number.isNaN(numberValue)
        ? 0
        : numberValue;

}



function textToArray(value) {

    if (!value) {

        return [];

    }


    return String(value)
        .split(",")
        .map(
            item =>
                item.trim()
        )
        .filter(Boolean);

}



function initials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
            part =>
                part[0]
        )
        .join("")
        .toUpperCase();

}



function statusClass(status) {

    if (
        status === "Finalista"
    ) {

        return "finalista";

    }


    if (
        status === "Descartado"
    ) {

        return "descartado";

    }


    return "proceso";

}



function verdictClass(verdict) {

    if (
        verdict === "Recomendado"
    ) {

        return "recomendado";

    }


    if (
        verdict === "No recomendado"
    ) {

        return "no-recomendado";

    }


    return "reservas";

}



// ==========================================================
// CONVERTIR BASE DE DATOS AL FORMATO DE LA INTERFAZ
// ==========================================================

const candidates =
    rawCandidatesDb.map(
        raw => {


            const compatibility =
                normalizeCompatibility(
                    raw.assessfirst?.compatibilidad
                );


            return {

                // ------------------------------------------
                // DATOS GENERALES
                // ------------------------------------------

                id:
                    `c${raw.id}`,


                rawId:
                    raw.id,


                name:
                    raw.nombre ||
                    "Sin nombre",


                currentRole:
                    raw.puesto_actual ||
                    "No especificado",


                company:
                    raw.empresa_actual ||
                    "No especificada",


                // La base entregada actualmente no tiene
                // ubicación.
                location:
                    "Ubicación no registrada",


                status:
                    raw.status_proceso ||
                    "En Proceso",


                compatibility,


                // La base tampoco contiene días exactos
                // en proceso.
                appliedDays:
                    null,



                // ------------------------------------------
                // PERFIL
                // ------------------------------------------

                education:
                    raw.escolaridad ||
                    "No especificada",


                otherStudies:
                    raw.otros_estudios ||
                    "No especificados",


                languages:
                    raw.idiomas ||
                    "No especificados",


                experience:
                    raw.resumen_profesional ||
                    "Información no disponible",


                summary:
                    raw.resumen_profesional ||
                    "Información no disponible",



                // ------------------------------------------
                // COMPENSACIÓN
                // ------------------------------------------

                currentComp:
                    formatMoney(
                        raw.compensacion_actual
                    ),


                desiredComp:
                    formatMoney(
                        raw.compensacion_deseada
                    ),


                notice:
                    "No registrado",



                // ------------------------------------------
                // ESTADO INTERNO
                // ------------------------------------------

                statusJustification:
                    raw.status_justificacion ||
                    "",



                // ------------------------------------------
                // ASSESSFIRST
                // ------------------------------------------

                assess: {

                    compatibility,


                    description:
                        raw.assessfirst?.descripcion ||
                        "Sin descripción registrada.",


                    strengths:
                        textToArray(
                            raw.assessfirst?.fortalezas
                        ),


                    opportunities:
                        textToArray(
                            raw.assessfirst?.areas_oportunidad
                        ),


                    leadershipStyle:
                        raw.assessfirst?.estilo_liderazgo ||
                        "No especificado",


                    strategicVision:
                        raw.assessfirst?.vision_estrategica ||
                        "No especificada",


                    decisionMaking:
                        raw.assessfirst?.toma_decisiones ||
                        "No especificada",


                    recommendation:
                        raw.assessfirst?.recomendaciones ||
                        "Sin recomendación registrada.",


                    dimensions: [

                        {
                            label:
                                "Compatibilidad general",

                            value:
                                compatibility
                        }

                    ]

                },



                // ------------------------------------------
                // ENTREVISTAS
                // ------------------------------------------

                interviews:
                    Array.isArray(
                        raw.entrevistas
                    )
                        ?
                        raw.entrevistas.map(
                            interview => {

                                return {

                                    id:
                                        interview.entrevista_id,


                                    date:
                                        interview.fecha ||
                                        "Fecha no registrada",


                                    stage:
                                        "Entrevista",


                                    interviewer:
                                        Array.isArray(
                                            interview.entrevistadores
                                        )
                                            ?
                                            interview
                                                .entrevistadores
                                                .join(", ")
                                            :
                                            "No registrado",


                                    notes:
                                        interview.notas ||
                                        "Sin notas registradas.",


                                    verdict:
                                        interview.veredicto ||
                                        "Pendiente"

                                };

                            }
                        )
                        :
                        [],



                // ------------------------------------------
                // CV
                // ------------------------------------------

                cv: {

                    path:
                        raw.cv_path ||
                        "",


                    fileName:
                        raw.cv_path
                            ?
                            raw.cv_path
                                .split("/")
                                .pop()
                            :
                            `CV_${raw.nombre || "candidato"}.pdf`,


                    // Como todavía no estamos cargando
                    // PDFs reales, el visor usa información
                    // proveniente de la propia base.
                    pages: [

                        {

                            title:
                                "Perfil profesional",


                            blocks: [

                                `${(
                                    raw.nombre ||
                                    "Candidato"
                                ).toUpperCase()} — ${
                                    raw.puesto_actual ||
                                    "Puesto no registrado"
                                }`,

                                raw.resumen_profesional ||
                                "Resumen profesional no disponible.",

                                `EMPRESA ACTUAL
${
    raw.empresa_actual ||
    "No especificada"
}`

                            ]

                        },


                        {

                            title:
                                "Educación y competencias",


                            blocks: [

                                `ESCOLARIDAD
${
    raw.escolaridad ||
    "No especificada"
}`,

                                `OTROS ESTUDIOS
${
    raw.otros_estudios ||
    "No especificados"
}`,

                                `IDIOMAS
${
    raw.idiomas ||
    "No especificados"
}`

                            ]

                        }

                    ]

                }

            };

        }
    );



// ==========================================================
// ETAPAS DEL PROCESO
// ==========================================================

const stages = [

    {

        key:
            "requisicion",

        name:
            "Requisición",

        sla:
            2,

        elapsed:
            2,

        status:
            "done",

        owner:
            "Talent Ops",

        date:
            "2026-09-10"

    },


    {

        key:
            "alineacion",

        name:
            "Alineación",

        sla:
            3,

        elapsed:
            3,

        status:
            "done",

        owner:
            "HM · Daniel Ramírez",

        date:
            "2026-09-12"

    },


    {

        key:
            "busqueda",

        name:
            "Búsqueda",

        sla:
            5,

        elapsed:
            5,

        status:
            "done",

        owner:
            "Reclutamiento",

        date:
            "2026-09-15"

    },


    {

        key:
            "atraccion",

        name:
            "Atracción",

        sla:
            7,

        elapsed:
            6,

        status:
            "current",

        owner:
            "Reclutamiento",

        date:
            "2026-09-20"

    },


    {

        key:
            "seleccion",

        name:
            "Selección",

        sla:
            6,

        elapsed:
            0,

        status:
            "pending",

        owner:
            "HM + Reclutamiento",

        date:
            ""

    },


    {

        key:
            "oferta",

        name:
            "Oferta",

        sla:
            4,

        elapsed:
            0,

        status:
            "pending",

        owner:
            "Compensaciones",

        date:
            ""

    }

];



// ==========================================================
// ALERTAS
// ==========================================================

const alerts = [

    {

        id:
            "a1",

        level:
            "critical",

        title:
            "Feedback de HM vencido",

        detail:
            "Existe feedback pendiente por parte del Hiring Manager.",

        time:
            "Hace 5 h"

    },


    {

        id:
            "a2",

        level:
            "warning",

        title:
            "SLA de Atracción al 86%",

        detail:
            "La vacante lleva 6 de 7 días hábiles asignados a la etapa.",

        time:
            "Hace 1 día"

    },


    {

        id:
            "a3",

        level:
            "info",

        title:
            "Evaluaciones actualizadas",

        detail:
            "Los resultados de AssessFirst están disponibles para consulta.",

        time:
            "Hace 2 días"

    }

];



// ==========================================================
// ESTADO GLOBAL
// ==========================================================

let currentFilter =
    "Todos";


let searchTerm =
    "";


let selectedIds =
    [];


let currentCandidate =
    null;


let cvPage =
    0;


let cvZoom =
    1;


let arenaFinalists =
    [];



// ==========================================================
// TOAST
// ==========================================================

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "active"
    );


    clearTimeout(
        showToast.timeout
    );


    showToast.timeout =
        setTimeout(

            () => {

                toast.classList.remove(
                    "active"
                );

            },

            3200

        );

}



// ==========================================================
// KPIs
// ==========================================================

function renderKPIs() {

    const finalistas =
        candidates.filter(
            candidate =>
                candidate.status ===
                "Finalista"
        ).length;


    const enProceso =
        candidates.filter(
            candidate =>
                candidate.status ===
                "En Proceso"
        ).length;


    const descartados =
        candidates.filter(
            candidate =>
                candidate.status ===
                "Descartado"
        ).length;


    const kpis = [

        {

            label:
                "Candidatos registrados",

            value:
                candidates.length,

            delta:
                "Base de talento",

            tone:
                "grape"

        },


        {

            label:
                "Candidatos en proceso",

            value:
                enProceso,

            delta:
                `${finalistas} finalistas`,

            tone:
                "pink"

        },


        {

            label:
                "Finalistas",

            value:
                finalistas,

            delta:
                "Perfiles avanzados",

            tone:
                "flame"

        },


        {

            label:
                "Descartados",

            value:
                descartados,

            delta:
                "Proceso cerrado",

            tone:
                "grape"

        }

    ];


    const container =
        document.getElementById(
            "kpiContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        kpis
            .map(

                kpi => `

                    <article class="kpi-card">

                        <div
                            class="kpi-line ${kpi.tone}"
                        >
                        </div>

                        <span>
                            ${kpi.label}
                        </span>

                        <strong>
                            ${kpi.value}
                        </strong>

                        <p>
                            ${kpi.delta}
                        </p>

                    </article>

                `

            )
            .join("");

}



// ==========================================================
// ALERTAS
// ==========================================================

function renderAlerts() {

    const iconMap = {

        critical:
            "⚠",

        warning:
            "◷",

        info:
            "ⓘ"

    };


    const container =
        document.getElementById(
            "alertsContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        alerts
            .map(

                alert => `

                    <article
                        class="alert ${alert.level}"
                    >

                        <span class="alert-icon">

                            ${
                                iconMap[
                                    alert.level
                                ]
                            }

                        </span>


                        <div>

                            <h4>
                                ${alert.title}
                            </h4>

                            <p>
                                ${alert.detail}
                            </p>

                            <small>
                                ${alert.time}
                            </small>

                        </div>

                    </article>

                `

            )
            .join("");


    const criticals =
        alerts.filter(

            alert =>
                alert.level ===
                "critical"

        ).length;


    const badge =
        document.getElementById(
            "criticalBadge"
        );


    if (badge) {

        badge.textContent =
            criticals;

    }

}



// ==========================================================
// TIMELINE
// ==========================================================

function renderTimeline() {

    const totalElapsed =
        stages.reduce(

            (
                total,
                stage
            ) =>
                total +
                stage.elapsed,

            0

        );


    const totalSLA =
        stages.reduce(

            (
                total,
                stage
            ) =>
                total +
                stage.sla,

            0

        );


    const globalStatus =
        document.getElementById(
            "globalStageStatus"
        );


    if (globalStatus) {

        globalStatus.textContent =
            `${totalElapsed} de ${totalSLA} días hábiles consumidos`;

    }


    const timeline =
        document.getElementById(
            "timelineContainer"
        );


    if (!timeline) {

        return;

    }


    timeline.innerHTML =
        stages
            .map(

                (
                    stage,
                    index
                ) => {


                    const percent =
                        Math.min(

                            100,

                            Math.round(

                                (
                                    stage.elapsed /
                                    stage.sla
                                )
                                *
                                100

                            )

                        );


                    const over =
                        stage.elapsed >
                        stage.sla;


                    let progressClass =
                        "";


                    if (over) {

                        progressClass =
                            "danger";

                    }
                    else if (
                        percent >=
                        80
                    ) {

                        progressClass =
                            "warning";

                    }


                    return `

                        <article
                            class="
                                timeline-stage
                                ${stage.status}
                            "
                        >


                            <div
                                class="
                                    timeline-stage-header
                                "
                            >


                                <span
                                    class="stage-number"
                                >

                                    ${
                                        stage.status ===
                                        "done"
                                            ?
                                            "✓"
                                            :
                                            index + 1
                                    }

                                </span>


                                <h4>
                                    ${stage.name}
                                </h4>


                                <button
                                    class="edit-stage"
                                    data-stage-index="${index}"
                                    title="Editar etapa"
                                    type="button"
                                >
                                    ✎
                                </button>


                            </div>



                            <p class="stage-owner">
                                ${stage.owner}
                            </p>



                            <p
                                class="
                                    stage-time
                                    ${
                                        over
                                            ?
                                            "over"
                                            :
                                            ""
                                    }
                                "
                            >

                                ◷

                                ${stage.elapsed}
                                /
                                ${stage.sla}

                                días hábiles

                            </p>



                            <div class="progress">


                                <div
                                    class="
                                        progress-fill
                                        ${progressClass}
                                    "

                                    style="
                                        width:
                                        ${percent}%;
                                    "
                                >
                                </div>


                            </div>



                            <div
                                id="editor-${index}"
                                class="stage-editor"
                            >


                                <label>

                                    Fecha

                                    <input
                                        id="stageDate-${index}"
                                        type="date"
                                        value="${stage.date}"
                                    >

                                </label>



                                <label>

                                    Días hábiles

                                    <input
                                        id="stageElapsed-${index}"
                                        type="number"
                                        min="0"
                                        value="${stage.elapsed}"
                                    >

                                </label>



                                <label>

                                    Estado

                                    <select
                                        id="stageStatus-${index}"
                                    >

                                        <option
                                            value="pending"

                                            ${
                                                stage.status ===
                                                "pending"
                                                    ?
                                                    "selected"
                                                    :
                                                    ""
                                            }
                                        >
                                            Pendiente
                                        </option>


                                        <option
                                            value="current"

                                            ${
                                                stage.status ===
                                                "current"
                                                    ?
                                                    "selected"
                                                    :
                                                    ""
                                            }
                                        >
                                            En curso
                                        </option>


                                        <option
                                            value="done"

                                            ${
                                                stage.status ===
                                                "done"
                                                    ?
                                                    "selected"
                                                    :
                                                    ""
                                            }
                                        >
                                            Completada
                                        </option>

                                    </select>

                                </label>



                                <button
                                    type="button"
                                    data-save-stage="${index}"
                                >

                                    Guardar

                                </button>


                            </div>


                        </article>

                    `;

                }

            )
            .join("");


    document
        .querySelectorAll(
            "[data-stage-index]"
        )
        .forEach(

            button => {


                button.addEventListener(

                    "click",

                    () => {


                        const index =
                            button
                                .dataset
                                .stageIndex;


                        const editor =
                            document.getElementById(
                                `editor-${index}`
                            );


                        if (editor) {

                            editor
                                .classList
                                .toggle(
                                    "active"
                                );

                        }

                    }

                );

            }

        );


    document
        .querySelectorAll(
            "[data-save-stage]"
        )
        .forEach(

            button => {


                button.addEventListener(

                    "click",

                    () => {


                        const index =
                            Number(
                                button
                                    .dataset
                                    .saveStage
                            );


                        const dateInput =
                            document.getElementById(
                                `stageDate-${index}`
                            );


                        const elapsedInput =
                            document.getElementById(
                                `stageElapsed-${index}`
                            );


                        const statusInput =
                            document.getElementById(
                                `stageStatus-${index}`
                            );


                        stages[index].date =
                            dateInput.value;


                        stages[index].elapsed =
                            Number(
                                elapsedInput.value
                            );


                        stages[index].status =
                            statusInput.value;


                        renderTimeline();


                        showToast(
                            `Etapa "${stages[index].name}" actualizada.`
                        );

                    }

                );

            }

        );

}



// ==========================================================
// FILTROS
// ==========================================================

function renderFilters() {

    const filters = [

        "Todos",
        "En Proceso",
        "Finalista",
        "Descartado"

    ];


    const container =
        document.getElementById(
            "filtersContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        filters
            .map(

                filter => `

                    <button
                        class="
                            filter-button
                            ${
                                currentFilter ===
                                filter
                                    ?
                                    "active"
                                    :
                                    ""
                            }
                        "

                        data-filter="${filter}"

                        type="button"
                    >

                        ${filter}

                    </button>

                `

            )
            .join("");


    document
        .querySelectorAll(
            "[data-filter]"
        )
        .forEach(

            button => {


                button.addEventListener(

                    "click",

                    () => {


                        currentFilter =
                            button
                                .dataset
                                .filter;


                        renderFilters();

                        renderCandidates();

                    }

                );

            }

        );

}



// ==========================================================
// OBTENER CANDIDATOS VISIBLES
// ==========================================================

function getVisibleCandidates() {

    return candidates.filter(

        candidate => {


            const matchesFilter =

                currentFilter ===
                "Todos"

                ||

                candidate.status ===
                currentFilter;



            const term =
                searchTerm
                    .toLowerCase()
                    .trim();



            const matchesSearch =

                candidate.name
                    .toLowerCase()
                    .includes(
                        term
                    )

                ||

                candidate.currentRole
                    .toLowerCase()
                    .includes(
                        term
                    )

                ||

                candidate.company
                    .toLowerCase()
                    .includes(
                        term
                    );



            return (
                matchesFilter &&
                matchesSearch
            );

        }

    );

}



// ==========================================================
// RENDERIZAR CANDIDATOS
// ==========================================================

function renderCandidates() {

    const visible =
        getVisibleCandidates();


    const counter =
        document.getElementById(
            "candidateCounter"
        );


    if (counter) {

        counter.textContent =
            `${visible.length} perfiles · selecciona 2 o más para comparar en Arena Mode`;

    }


    const grid =
        document.getElementById(
            "candidateGrid"
        );


    if (!grid) {

        return;

    }


    if (
        visible.length ===
        0
    ) {

        grid.innerHTML = `

            <div class="empty-state">

                No hay candidatos
                con este filtro.

            </div>

        `;


        return;

    }


    grid.innerHTML =
        visible
            .map(

                candidate => {


                    const selected =
                        selectedIds.includes(
                            candidate.id
                        );


                    const processText =
                        candidate.appliedDays !==
                        null

                            ?

                            `${candidate.appliedDays} días en proceso`

                            :

                            "Tiempo en proceso no registrado";


                    return `

                        <article
                            class="
                                candidate-card
                                ${
                                    selected
                                        ?
                                        "selected"
                                        :
                                        ""
                                }
                            "
                        >


                            <div class="candidate-top">


                                <input
                                    class="candidate-checkbox"

                                    type="checkbox"

                                    data-select="${candidate.id}"

                                    ${
                                        selected
                                            ?
                                            "checked"
                                            :
                                            ""
                                    }
                                >



                                <span
                                    class="candidate-avatar"
                                >

                                    ${
                                        initials(
                                            candidate.name
                                        )
                                    }

                                </span>



                                <div
                                    class="candidate-basic"
                                >

                                    <h4>
                                        ${candidate.name}
                                    </h4>

                                    <p>
                                        ${candidate.currentRole}
                                    </p>

                                    <span class="location">

                                        ${candidate.company}

                                    </span>

                                </div>



                                <span
                                    class="
                                        status
                                        ${
                                            statusClass(
                                                candidate.status
                                            )
                                        }
                                    "
                                >

                                    ${candidate.status}

                                </span>


                            </div>



                            <div class="compatibility">


                                <div
                                    class="
                                        compatibility-header
                                    "
                                >

                                    <span>

                                        Compatibilidad AssessFirst

                                    </span>

                                    <strong>

                                        ${candidate.compatibility}%

                                    </strong>

                                </div>



                                <div class="progress">

                                    <div
                                        class="progress-fill"

                                        style="
                                            width:
                                            ${candidate.compatibility}%;
                                        "
                                    >
                                    </div>

                                </div>


                            </div>



                            <div class="candidate-footer">


                                <span
                                    class="process-days"
                                >

                                    ${processText}

                                </span>



                                <div
                                    class="
                                        candidate-buttons
                                    "
                                >


                                    <button
                                        class="small-button"

                                        type="button"

                                        data-open="${candidate.id}"
                                    >

                                        📄 CV

                                    </button>



                                    <button
                                        class="
                                            small-button
                                            primary
                                        "

                                        type="button"

                                        data-open="${candidate.id}"
                                    >

                                        👁 Ver perfil

                                    </button>


                                </div>


                            </div>


                        </article>

                    `;

                }

            )
            .join("");


    document
        .querySelectorAll(
            "[data-select]"
        )
        .forEach(

            checkbox => {


                checkbox.addEventListener(

                    "change",

                    () => {


                        toggleCandidateSelection(
                            checkbox
                                .dataset
                                .select
                        );

                    }

                );

            }

        );


    document
        .querySelectorAll(
            "[data-open]"
        )
        .forEach(

            button => {


                button.addEventListener(

                    "click",

                    () => {


                        openCandidate(
                            button
                                .dataset
                                .open
                        );

                    }

                );

            }

        );

}



// ==========================================================
// SELECCIÓN PARA ARENA
// ==========================================================

function toggleCandidateSelection(id) {

    if (
        selectedIds.includes(
            id
        )
    ) {

        selectedIds =
            selectedIds.filter(

                candidateId =>
                    candidateId !==
                    id

            );

    }
    else {


        if (
            selectedIds.length >=
            4
        ) {

            showToast(
                "Puedes comparar máximo 4 candidatos."
            );


            renderCandidates();


            return;

        }


        selectedIds.push(
            id
        );

    }


    updateArenaButton();

    renderCandidates();

}



// ==========================================================
// ACTUALIZAR BOTÓN ARENA
// ==========================================================

function updateArenaButton() {

    const counter =
        document.getElementById(
            "selectedCounter"
        );


    const button =
        document.getElementById(
            "arenaButton"
        );


    if (counter) {

        counter.textContent =
            selectedIds.length;

    }


    if (button) {

        button.disabled =
            selectedIds.length <
            2;

    }

}



// ==========================================================
// INFO BOX
// ==========================================================

function createInfoBox(
    icon,
    label,
    value
) {

    return `

        <div class="info-box">


            <span class="info-icon">

                ${icon}

            </span>


            <div>

                <span>
                    ${label}
                </span>

                <strong>
                    ${value}
                </strong>

            </div>


        </div>

    `;

}



// ==========================================================
// ABRIR PERFIL
// ==========================================================

function openCandidate(id) {

    currentCandidate =
        candidates.find(

            candidate =>
                candidate.id ===
                id

        );


    if (!currentCandidate) {

        return;

    }


    cvPage =
        0;


    cvZoom =
        1;


    renderCandidateSheet();


    document
        .getElementById(
            "sheetOverlay"
        )
        ?.classList
        .add(
            "active"
        );


    document
        .getElementById(
            "candidateSheet"
        )
        ?.classList
        .add(
            "active"
        );

}



// ==========================================================
// CERRAR PERFIL
// ==========================================================

function closeCandidate() {

    document
        .getElementById(
            "sheetOverlay"
        )
        ?.classList
        .remove(
            "active"
        );


    document
        .getElementById(
            "candidateSheet"
        )
        ?.classList
        .remove(
            "active"
        );

}



// ==========================================================
// RENDER PERFIL COMPLETO
// ==========================================================

function renderCandidateSheet() {

    if (!currentCandidate) {

        return;

    }


    const candidate =
        currentCandidate;


    const sheet =
        document.getElementById(
            "candidateSheetContent"
        );


    if (!sheet) {

        return;

    }


    const interviewsHtml =
        candidate.interviews.length >

        0

            ?

            candidate.interviews
                .map(

                    interview => `

                        <article
                            class="interview-item"
                        >


                            <div
                                class="
                                    interview-top
                                "
                            >


                                <div>

                                    <h4>
                                        ${interview.stage}
                                    </h4>

                                    <small>

                                        ${interview.date}

                                        ·

                                        ${interview.interviewer}

                                    </small>

                                </div>



                                <span
                                    class="
                                        verdict
                                        ${
                                            verdictClass(
                                                interview.verdict
                                            )
                                        }
                                    "
                                >

                                    ${interview.verdict}

                                </span>


                            </div>



                            <p>

                                ${interview.notes}

                            </p>


                        </article>

                    `

                )
                .join("")

            :

            `

                <div class="summary-box">

                    No hay entrevistas registradas
                    para este candidato.

                </div>

            `;



    const justificationHtml =
        candidate.statusJustification

            ?

            `

                <section class="sheet-section">

                    <h3>
                        Justificación del estado
                    </h3>

                    <div class="recommendation">

                        ${
                            candidate
                                .statusJustification
                        }

                    </div>

                </section>

            `

            :

            "";



    sheet.innerHTML = `


        <div class="sheet-header">


            <span
                class="sheet-header-avatar"
            >

                ${initials(candidate.name)}

            </span>



            <div
                class="sheet-header-info"
            >

                <h2>
                    ${candidate.name}
                </h2>


                <p>

                    ${candidate.currentRole}

                    ·

                    ${candidate.company}

                </p>



                <div class="sheet-tags">


                    <span class="sheet-tag">

                        ${candidate.status}

                    </span>


                    <span
                        class="
                            sheet-tag
                            compatibility-tag
                        "
                    >

                        ${candidate.compatibility}%
                        AssessFirst

                    </span>


                </div>


            </div>



            <button
                id="closeCandidateButton"

                class="close-sheet"

                type="button"
            >

                ×

            </button>


        </div>



        <div class="sheet-scroll">


            <section class="sheet-section">


                <h3>
                    Resumen profesional
                </h3>


                <div class="summary-box">

                    ${candidate.summary}

                </div>



                <div class="info-grid">


                    ${
                        createInfoBox(
                            "🎓",
                            "Escolaridad",
                            candidate.education
                        )
                    }


                    ${
                        createInfoBox(
                            "📚",
                            "Otros estudios",
                            candidate.otherStudies
                        )
                    }


                    ${
                        createInfoBox(
                            "🌐",
                            "Idiomas",
                            candidate.languages
                        )
                    }


                    ${
                        createInfoBox(
                            "💰",
                            "Compensación actual",
                            candidate.currentComp
                        )
                    }


                    ${
                        createInfoBox(
                            "💵",
                            "Compensación deseada",
                            candidate.desiredComp
                        )
                    }


                    ${
                        createInfoBox(
                            "🏢",
                            "Empresa actual",
                            candidate.company
                        )
                    }


                </div>


            </section>



            <section class="sheet-section">


                <h3>
                    Currículum · visor embebido
                </h3>


                <div
                    id="cvViewerContainer"
                >
                </div>


            </section>



            <section class="sheet-section">


                <h3>
                    Resultados AssessFirst
                </h3>



                <div class="assess-card">


                    <div class="assess-main">


                        <div
                            class="
                                compatibility-circle
                            "
                        >

                            ${candidate.compatibility}%

                        </div>



                        <div class="dimensions">


                            <div class="dimension">


                                <div
                                    class="
                                        dimension-header
                                    "
                                >

                                    <span>

                                        Compatibilidad general

                                    </span>

                                    <strong>

                                        ${candidate.compatibility}%

                                    </strong>

                                </div>



                                <div class="progress">


                                    <div
                                        class="progress-fill"

                                        style="
                                            width:
                                            ${candidate.compatibility}%;
                                        "
                                    >
                                    </div>


                                </div>


                            </div>


                            <div class="summary-box">

                                ${
                                    candidate
                                        .assess
                                        .description
                                }

                            </div>


                        </div>


                    </div>



                    <div class="strengths-grid">


                        <div
                            class="
                                strength-box
                                good
                            "
                        >

                            <strong>
                                Fortalezas
                            </strong>

                            <ul>

                                ${
                                    candidate
                                        .assess
                                        .strengths
                                        .map(

                                            item => `

                                                <li>
                                                    ${item}
                                                </li>

                                            `

                                        )
                                        .join("")
                                }

                            </ul>

                        </div>



                        <div
                            class="
                                strength-box
                                opportunity
                            "
                        >

                            <strong>
                                Áreas de oportunidad
                            </strong>

                            <ul>

                                ${
                                    candidate
                                        .assess
                                        .opportunities
                                        .map(

                                            item => `

                                                <li>
                                                    ${item}
                                                </li>

                                            `

                                        )
                                        .join("")
                                }

                            </ul>

                        </div>


                    </div>



                    <div class="info-grid">


                        ${
                            createInfoBox(
                                "👥",
                                "Estilo de liderazgo",
                                candidate
                                    .assess
                                    .leadershipStyle
                            )
                        }


                        ${
                            createInfoBox(
                                "🎯",
                                "Visión estratégica",
                                candidate
                                    .assess
                                    .strategicVision
                            )
                        }


                        ${
                            createInfoBox(
                                "🧠",
                                "Toma de decisiones",
                                candidate
                                    .assess
                                    .decisionMaking
                            )
                        }


                    </div>



                    <div class="recommendation">


                        <strong>

                            Recomendación interna:

                        </strong>


                        ${
                            candidate
                                .assess
                                .recommendation
                        }


                    </div>


                </div>


            </section>



            ${justificationHtml}



            <section class="sheet-section">


                <h3>
                    Historial de entrevistas
                </h3>


                ${interviewsHtml}


            </section>


        </div>

    `;


    document
        .getElementById(
            "closeCandidateButton"
        )
        ?.addEventListener(

            "click",

            closeCandidate

        );


    renderCvViewer();

}



// ==========================================================
// VISOR DE CV
// ==========================================================

function renderCvViewer() {

    const container =
        document.getElementById(
            "cvViewerContainer"
        );


    if (
        !container ||
        !currentCandidate
    ) {

        return;

    }


    const pages =
        currentCandidate
            .cv
            .pages;


    const page =
        pages[cvPage];


    container.innerHTML = `


        <div class="cv-viewer">


            <div class="cv-toolbar">


                <span>

                    ${
                        currentCandidate
                            .cv
                            .fileName
                    }

                </span>



                <div
                    class="
                        cv-toolbar-actions
                    "
                >


                    <button
                        id="cvPrevious"
                        type="button"
                    >
                        ←
                    </button>


                    <span>

                        ${cvPage + 1}

                        /

                        ${pages.length}

                    </span>


                    <button
                        id="cvNext"
                        type="button"
                    >
                        →
                    </button>


                    <button
                        id="cvZoomOut"
                        type="button"
                    >
                        −
                    </button>


                    <button
                        id="cvZoomIn"
                        type="button"
                    >
                        +
                    </button>


                </div>


            </div>



            <div class="cv-paper-wrap">


                <div
                    class="cv-paper"

                    style="
                        transform:
                        scale(${cvZoom});

                        width:
                        ${100 / cvZoom}%;
                    "
                >


                    <h4>

                        ${page.title}

                    </h4>



                    ${
                        page.blocks
                            .map(

                                block => `

                                    <div
                                        class="cv-block"
                                    >

                                        ${block}

                                    </div>

                                `

                            )
                            .join("")
                    }


                </div>


            </div>


        </div>

    `;


    document
        .getElementById(
            "cvPrevious"
        )
        ?.addEventListener(

            "click",

            () => {


                if (
                    cvPage >
                    0
                ) {

                    cvPage--;

                    renderCvViewer();

                }

            }

        );


    document
        .getElementById(
            "cvNext"
        )
        ?.addEventListener(

            "click",

            () => {


                if (
                    cvPage <
                    pages.length - 1
                ) {

                    cvPage++;

                    renderCvViewer();

                }

            }

        );


    document
        .getElementById(
            "cvZoomOut"
        )
        ?.addEventListener(

            "click",

            () => {


                cvZoom =
                    Math.max(
                        0.7,
                        cvZoom - 0.1
                    );


                renderCvViewer();

            }

        );


    document
        .getElementById(
            "cvZoomIn"
        )
        ?.addEventListener(

            "click",

            () => {


                cvZoom =
                    Math.min(
                        1.5,
                        cvZoom + 0.1
                    );


                renderCvViewer();

            }

        );

}



// ==========================================================
// ARENA
// ==========================================================

function openArena() {

    if (
        selectedIds.length <
        2
    ) {

        return;

    }


    arenaFinalists =
        [];


    renderArena();


    document
        .getElementById(
            "arenaOverlay"
        )
        ?.classList
        .add(
            "active"
        );

}



function closeArena() {

    document
        .getElementById(
            "arenaOverlay"
        )
        ?.classList
        .remove(
            "active"
        );

}



// ==========================================================
// RENDER ARENA
// ==========================================================

function renderArena() {

    const selected =
        candidates.filter(

            candidate =>
                selectedIds.includes(
                    candidate.id
                )

        );


    const rows = [

        {

            label:
                "Puesto actual",

            render:
                candidate =>
                    candidate.currentRole

        },


        {

            label:
                "Empresa actual",

            render:
                candidate =>
                    candidate.company

        },


        {

            label:
                "Escolaridad",

            render:
                candidate =>
                    candidate.education

        },


        {

            label:
                "Otros estudios",

            render:
                candidate =>
                    candidate.otherStudies

        },


        {

            label:
                "Idiomas",

            render:
                candidate =>
                    candidate.languages

        },


        {

            label:
                "Compensación actual",

            render:
                candidate =>
                    candidate.currentComp

        },


        {

            label:
                "Compensación deseada",

            render:
                candidate =>
                    candidate.desiredComp

        },


        {

            label:
                "Estilo de liderazgo",

            render:
                candidate =>
                    candidate
                        .assess
                        .leadershipStyle

        },


        {

            label:
                "Visión estratégica",

            render:
                candidate =>
                    candidate
                        .assess
                        .strategicVision

        },


        {

            label:
                "Toma de decisiones",

            render:
                candidate =>
                    candidate
                        .assess
                        .decisionMaking

        },


        {

            label:
                "Fortalezas",

            render:
                candidate =>
                    candidate
                        .assess
                        .strengths
                        .join(
                            " · "
                        )

        },


        {

            label:
                "Áreas de oportunidad",

            render:
                candidate =>
                    candidate
                        .assess
                        .opportunities
                        .join(
                            " · "
                        )

        }

    ];


    const arenaContent =
        document.getElementById(
            "arenaContent"
        );


    if (!arenaContent) {

        return;

    }


    arenaContent.innerHTML = `


        <table class="arena-table">


            <thead>


                <tr>


                    <th class="criterion">

                        Criterio

                    </th>



                    ${
                        selected
                            .map(

                                candidate => `

                                    <th>


                                        <div
                                            class="
                                                arena-candidate
                                            "
                                        >


                                            <span
                                                class="
                                                    candidate-avatar
                                                "
                                            >

                                                ${
                                                    initials(
                                                        candidate.name
                                                    )
                                                }

                                            </span>


                                            <div>

                                                <strong>

                                                    ${candidate.name}

                                                </strong>

                                                <div>

                                                    ${candidate.compatibility}%
                                                    AssessFirst

                                                </div>

                                            </div>


                                        </div>


                                    </th>

                                `

                            )
                            .join("")
                    }


                </tr>


            </thead>



            <tbody>


                <tr class="compat-row">


                    <td class="criterion">

                        Compatibilidad

                    </td>


                    ${
                        selected
                            .map(

                                candidate => `

                                    <td>

                                        <strong>

                                            ${candidate.compatibility}%

                                        </strong>

                                    </td>

                                `

                            )
                            .join("")
                    }


                </tr>



                ${
                    rows
                        .map(

                            row => `

                                <tr>


                                    <td class="criterion">

                                        ${row.label}

                                    </td>


                                    ${
                                        selected
                                            .map(

                                                candidate => `

                                                    <td>

                                                        ${
                                                            row.render(
                                                                candidate
                                                            )
                                                        }

                                                    </td>

                                                `

                                            )
                                            .join("")
                                    }


                                </tr>

                            `

                        )
                        .join("")
                }



                <tr class="final-row">


                    <td class="criterion">

                        Pasar a ronda final con HM

                    </td>


                    ${
                        selected
                            .map(

                                candidate => {


                                    const isSelected =
                                        arenaFinalists
                                            .includes(
                                                candidate.id
                                            );


                                    return `

                                        <td>


                                            <button
                                                class="
                                                    finalist-button
                                                    ${
                                                        isSelected
                                                            ?
                                                            "selected"
                                                            :
                                                            ""
                                                    }
                                                "

                                                data-finalist="${candidate.id}"

                                                type="button"
                                            >

                                                ${
                                                    isSelected
                                                        ?
                                                        "Seleccionado ✓"
                                                        :
                                                        "Seleccionar"
                                                }

                                            </button>


                                        </td>

                                    `;

                                }

                            )
                            .join("")
                    }


                </tr>


            </tbody>


        </table>



        <div class="arena-footer">


            <p>

                ${
                    arenaFinalists.length ===
                    0

                        ?

                        "Selecciona los perfiles que avanzarán a la ronda final."

                        :

                        `${arenaFinalists.length} perfil(es) listos para enviar al Hiring Manager.`
                }

            </p>



            <button
                id="sendFinalistsButton"

                class="send-finalists"

                type="button"

                ${
                    arenaFinalists.length ===
                    0
                        ?
                        "disabled"
                        :
                        ""
                }
            >

                Enviar a ronda final con HM

            </button>


        </div>

    `;


    document
        .querySelectorAll(
            "[data-finalist]"
        )
        .forEach(

            button => {


                button.addEventListener(

                    "click",

                    () => {


                        const id =
                            button
                                .dataset
                                .finalist;


                        if (
                            arenaFinalists.includes(
                                id
                            )
                        ) {

                            arenaFinalists =
                                arenaFinalists.filter(

                                    finalistId =>
                                        finalistId !==
                                        id

                                );

                        }
                        else {

                            arenaFinalists.push(
                                id
                            );

                        }


                        renderArena();

                    }

                );

            }

        );


    document
        .getElementById(
            "sendFinalistsButton"
        )
        ?.addEventListener(

            "click",

            () => {


                if (
                    arenaFinalists.length ===
                    0
                ) {

                    return;

                }


                arenaFinalists.forEach(

                    id => {


                        const candidate =
                            candidates.find(

                                candidate =>
                                    candidate.id ===
                                    id

                            );


                        if (candidate) {

                            candidate.status =
                                "Finalista";

                        }

                    }

                );


                showToast(
                    `${arenaFinalists.length} candidato(s) enviados al Hiring Manager.`
                );


                closeArena();


                renderKPIs();

                renderFilters();

                renderCandidates();

            }

        );

}



// ==========================================================
// EVENTOS GENERALES
// ==========================================================

function configureEvents() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (searchInput) {

        searchInput.addEventListener(

            "input",

            event => {


                searchTerm =
                    event.target.value;


                renderCandidates();

            }

        );

    }



    const alertsButton =
        document.getElementById(
            "alertsButton"
        );


    if (alertsButton) {

        alertsButton.addEventListener(

            "click",

            () => {


                document
                    .getElementById(
                        "alertsPanel"
                    )
                    ?.classList
                    .toggle(
                        "hidden"
                    );

            }

        );

    }



    const closeAlertsButton =
        document.getElementById(
            "closeAlertsButton"
        );


    if (closeAlertsButton) {

        closeAlertsButton.addEventListener(

            "click",

            () => {


                document
                    .getElementById(
                        "alertsPanel"
                    )
                    ?.classList
                    .add(
                        "hidden"
                    );

            }

        );

    }



    const arenaButton =
        document.getElementById(
            "arenaButton"
        );


    if (arenaButton) {

        arenaButton.addEventListener(

            "click",

            openArena

        );

    }



    const closeArenaButton =
        document.getElementById(
            "closeArenaButton"
        );


    if (closeArenaButton) {

        closeArenaButton.addEventListener(

            "click",

            closeArena

        );

    }



    const sheetOverlay =
        document.getElementById(
            "sheetOverlay"
        );


    if (sheetOverlay) {

        sheetOverlay.addEventListener(

            "click",

            closeCandidate

        );

    }



    const arenaOverlay =
        document.getElementById(
            "arenaOverlay"
        );


    if (arenaOverlay) {

        arenaOverlay.addEventListener(

            "click",

            event => {


                if (
                    event.target.id ===
                    "arenaOverlay"
                ) {

                    closeArena();

                }

            }

        );

    }



    document.addEventListener(

        "keydown",

        event => {


            if (
                event.key ===
                "Escape"
            ) {

                closeCandidate();

                closeArena();

            }

        }

    );

}



// ==========================================================
// INICIALIZACIÓN
// ==========================================================

function init() {

    renderKPIs();

    renderAlerts();

    renderTimeline();

    renderFilters();

    renderCandidates();

    updateArenaButton();

    configureEvents();

}



// ==========================================================
// EJECUTAR APLICACIÓN
// ==========================================================

init();