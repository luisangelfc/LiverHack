// ======================================================
// TALENT RECRUITMENT HUB
// LiverHack 2026
// JavaScript puro
// ======================================================


// ======================================================
// ETAPAS DEL PROCESO
// ======================================================

const stages = [

    {
        key: "requisicion",
        name: "Requisición",
        sla: 2,
        elapsed: 2,
        status: "done",
        owner: "Talent Ops",
        date: "2026-09-10"
    },

    {
        key: "alineacion",
        name: "Alineación",
        sla: 3,
        elapsed: 3,
        status: "done",
        owner: "HM · Daniel Ramírez",
        date: "2026-09-12"
    },

    {
        key: "busqueda",
        name: "Búsqueda",
        sla: 5,
        elapsed: 5,
        status: "done",
        owner: "Reclutamiento",
        date: "2026-09-15"
    },

    {
        key: "atraccion",
        name: "Atracción",
        sla: 7,
        elapsed: 6,
        status: "current",
        owner: "Reclutamiento",
        date: "2026-09-20"
    },

    {
        key: "seleccion",
        name: "Selección",
        sla: 6,
        elapsed: 0,
        status: "pending",
        owner: "HM + Reclutamiento",
        date: ""
    },

    {
        key: "oferta",
        name: "Oferta",
        sla: 4,
        elapsed: 0,
        status: "pending",
        owner: "Compensaciones",
        date: ""
    }

];


// ======================================================
// ALERTAS
// ======================================================

const alerts = [

    {
        id: "a1",
        level: "critical",
        title: "Feedback de HM vencido",
        detail:
            "Daniel Ramírez aún no registra su veredicto para Ana López.",
        time: "Hace 5 h"
    },

    {
        id: "a2",
        level: "warning",
        title: "SLA de Atracción al 86%",
        detail:
            "La vacante lleva 6 de 7 días hábiles asignados a la etapa.",
        time: "Hace 1 día"
    },

    {
        id: "a3",
        level: "info",
        title: "AssessFirst completado",
        detail:
            "Mariana Ortiz terminó su evaluación con 91% de compatibilidad.",
        time: "Hace 2 días"
    }

];


// ======================================================
// CANDIDATOS
// ======================================================

const candidates = [

    {
        id: "c1",

        name: "Ana López",

        currentRole:
            "Subgerente de E-commerce",

        company:
            "Retail Group MX",

        location:
            "CDMX · Híbrido",

        status:
            "Finalista",

        compatibility:
            94,

        appliedDays:
            12,

        education:
            "Lic. Mercadotecnia · MBA Digital Business",

        languages:
            "Español nativo · Inglés C1",

        experience:
            "8 años en retail omnicanal",

        currentComp:
            "$78,000 MXN mensual",

        desiredComp:
            "$95,000 MXN mensual",

        notice:
            "30 días",

        summary:
            "Líder comercial con 8 años de experiencia en retail omnicanal. Ha liderado operaciones de e-commerce, marketplace, conversión y experiencia de cliente.",

        assess: {

            strengths: [
                "Orientación a resultados",
                "Liderazgo colaborativo",
                "Pensamiento analítico"
            ],

            opportunities: [
                "Tolerancia a la ambigüedad",
                "Delegación bajo presión"
            ],

            recommendation:
                "Perfil altamente alineado con la vacante. Se recomienda avanzar a ronda final con Hiring Manager.",

            dimensions: [

                {
                    label: "Personalidad",
                    value: 92
                },

                {
                    label: "Motivaciones",
                    value: 96
                },

                {
                    label: "Razonamiento",
                    value: 89
                },

                {
                    label: "Fit cultural",
                    value: 95
                }

            ]

        },

        interviews: [

            {
                date:
                    "14 sep 2026",

                stage:
                    "Entrevista de filtro",

                interviewer:
                    "Karla Méndez",

                role:
                    "Reclutadora Senior",

                notes:
                    "Comunicación clara, métricas sólidas y expectativa salarial dentro de banda.",

                verdict:
                    "Recomendado"
            },

            {
                date:
                    "19 sep 2026",

                stage:
                    "Entrevista técnica",

                interviewer:
                    "Luis Barrera",

                role:
                    "Head of Digital",

                notes:
                    "Dominio de P&L digital y marketplace. Buen planteamiento estratégico.",

                verdict:
                    "Recomendado"
            }

        ],

        cv: {

            fileName:
                "CV_Ana_Lopez_2026.pdf",

            pages: [

                {
                    title:
                        "Perfil profesional",

                    blocks: [

                        "ANA LÓPEZ — Subgerente de E-commerce | CDMX",

                        "Líder comercial con experiencia en retail omnicanal, crecimiento de canal digital, marketplace y CRO.",

                        "EXPERIENCIA\nRetail Group MX — Subgerente de E-commerce\n• Crecimiento de GMV.\n• Implementación de marketplace.\n• Liderazgo de equipo multidisciplinario."

                    ]
                },

                {
                    title:
                        "Educación y habilidades",

                    blocks: [

                        "EDUCACIÓN\nMBA Digital Business\nLic. en Mercadotecnia",

                        "IDIOMAS\nEspañol nativo · Inglés C1",

                        "HABILIDADES\nGoogle Analytics · Salesforce Commerce · SQL · Power BI · Liderazgo"

                    ]
                }

            ]

        }

    },


    {
        id: "c2",

        name: "Mariana Ortiz",

        currentRole:
            "Gerente de Marketplace",

        company:
            "Comercio Digital SA",

        location:
            "Monterrey · Remoto",

        status:
            "Finalista",

        compatibility:
            91,

        appliedDays:
            9,

        education:
            "Ing. Industrial · Diplomado en Growth",

        languages:
            "Español nativo · Inglés B2",

        experience:
            "10 años en comercio digital",

        currentComp:
            "$88,000 MXN mensual",

        desiredComp:
            "$105,000 MXN mensual",

        notice:
            "15 días",

        summary:
            "Especialista en marketplace y logística de última milla. Construyó y escaló operaciones digitales con más de mil sellers activos.",

        assess: {

            strengths: [
                "Visión estratégica",
                "Negociación",
                "Resiliencia"
            ],

            opportunities: [
                "Stakeholders senior",
                "Detalle operativo"
            ],

            recommendation:
                "Fuerte encaje técnico. Validar estilo de liderazgo en estructuras matriciales.",

            dimensions: [

                {
                    label: "Personalidad",
                    value: 88
                },

                {
                    label: "Motivaciones",
                    value: 90
                },

                {
                    label: "Razonamiento",
                    value: 94
                },

                {
                    label: "Fit cultural",
                    value: 86
                }

            ]

        },

        interviews: [

            {
                date:
                    "15 sep 2026",

                stage:
                    "Entrevista de filtro",

                interviewer:
                    "Karla Méndez",

                role:
                    "Reclutadora Senior",

                notes:
                    "Perfil sólido. Expectativa salarial en la parte superior de la banda.",

                verdict:
                    "Recomendado"
            },

            {
                date:
                    "20 sep 2026",

                stage:
                    "Entrevista técnica",

                interviewer:
                    "Luis Barrera",

                role:
                    "Head of Digital",

                notes:
                    "Excelente conocimiento de marketplace. Menor experiencia en tienda propia.",

                verdict:
                    "Con reservas"
            }

        ],

        cv: {

            fileName:
                "CV_Mariana_Ortiz.pdf",

            pages: [

                {
                    title:
                        "Perfil profesional",

                    blocks: [

                        "MARIANA ORTIZ — Gerente de Marketplace | Monterrey",

                        "10 años construyendo operaciones de comercio digital y ecosistemas de sellers.",

                        "EXPERIENCIA\nComercio Digital SA — Gerente de Marketplace\n• 1,200 sellers activos.\n• Reducción de tiempos de entrega.\n• Gestión de operación digital."

                    ]
                },

                {
                    title:
                        "Educación",

                    blocks: [

                        "Ing. Industrial",

                        "Diplomado en Growth",

                        "SQL · Looker · Forecasting · Negociación comercial"

                    ]
                }

            ]

        }

    },


    {
        id: "c3",

        name: "Carlos Medina",

        currentRole:
            "Head of Growth",

        company:
            "Fintech Norte",

        location:
            "Guadalajara · Híbrido",

        status:
            "En Proceso",

        compatibility:
            78,

        appliedDays:
            6,

        education:
            "Lic. Economía",

        languages:
            "Español · Inglés C2 · Portugués B1",

        experience:
            "7 años en growth y adquisición",

        currentComp:
            "$92,000 MXN mensual",

        desiredComp:
            "$115,000 MXN mensual",

        notice:
            "45 días",

        summary:
            "Perfil de growth con fuerte base analítica y experiencia en performance marketing.",

        assess: {

            strengths: [
                "Pensamiento analítico",
                "Innovación",
                "Autonomía"
            ],

            opportunities: [
                "Procesos corporativos",
                "Paciencia"
            ],

            recommendation:
                "Compatibilidad media. Revisar expectativa salarial y adaptación a procesos corporativos.",

            dimensions: [

                {
                    label: "Personalidad",
                    value: 74
                },

                {
                    label: "Motivaciones",
                    value: 70
                },

                {
                    label: "Razonamiento",
                    value: 93
                },

                {
                    label: "Fit cultural",
                    value: 68
                }

            ]

        },

        interviews: [

            {
                date:
                    "18 sep 2026",

                stage:
                    "Entrevista de filtro",

                interviewer:
                    "Karla Méndez",

                role:
                    "Reclutadora Senior",

                notes:
                    "Buen dominio de adquisición digital. Expectativa salarial sobre la banda.",

                verdict:
                    "Con reservas"
            }

        ],

        cv: {

            fileName:
                "CV_Carlos_Medina.pdf",

            pages: [

                {
                    title:
                        "Perfil profesional",

                    blocks: [

                        "CARLOS MEDINA — Head of Growth | Guadalajara",

                        "Experiencia en performance marketing, data y adquisición digital.",

                        "Fintech Norte\n• Reducción de CAC.\n• Equipo multidisciplinario.\n• Estrategias de adquisición."

                    ]
                }

            ]

        }

    },


    {
        id: "c4",

        name: "Sofía Rangel",

        currentRole:
            "Coordinadora de Retail Digital",

        company:
            "Moda Urbana",

        location:
            "CDMX · Presencial",

        status:
            "En Proceso",

        compatibility:
            83,

        appliedDays:
            4,

        education:
            "Lic. Administración",

        languages:
            "Español · Inglés B2",

        experience:
            "5 años en retail",

        currentComp:
            "$52,000 MXN mensual",

        desiredComp:
            "$70,000 MXN mensual",

        notice:
            "Inmediata",

        summary:
            "Perfil en crecimiento con buena adaptabilidad y conocimiento de retail de moda.",

        assess: {

            strengths: [
                "Adaptabilidad",
                "Colaboración",
                "Orientación al cliente"
            ],

            opportunities: [
                "Liderazgo",
                "Visión financiera"
            ],

            recommendation:
                "Buen potencial de desarrollo.",

            dimensions: [

                {
                    label: "Personalidad",
                    value: 85
                },

                {
                    label: "Motivaciones",
                    value: 88
                },

                {
                    label: "Razonamiento",
                    value: 76
                },

                {
                    label: "Fit cultural",
                    value: 84
                }

            ]

        },

        interviews: [

            {
                date:
                    "21 sep 2026",

                stage:
                    "Entrevista de filtro",

                interviewer:
                    "Jorge Pineda",

                role:
                    "Reclutador",

                notes:
                    "Muy motivada por la marca.",

                verdict:
                    "Recomendado"
            }

        ],

        cv: {

            fileName:
                "CV_Sofia_Rangel.pdf",

            pages: [

                {
                    title:
                        "Perfil profesional",

                    blocks: [

                        "SOFÍA RANGEL — Coordinadora de Retail Digital",

                        "Experiencia en catálogo digital y campañas estacionales.",

                        "Habilidades\nRetail digital · Gestión de catálogo · Campañas · Analítica"

                    ]
                }

            ]

        }

    },


    {
        id: "c5",

        name: "Ricardo Peña",

        currentRole:
            "Gerente de Tienda",

        company:
            "Grupo Comercial Sur",

        location:
            "Puebla · Presencial",

        status:
            "Descartado",

        compatibility:
            61,

        appliedDays:
            17,

        education:
            "Lic. Negocios Internacionales",

        languages:
            "Español · Inglés A2",

        experience:
            "12 años en retail físico",

        currentComp:
            "$61,000 MXN mensual",

        desiredComp:
            "$80,000 MXN mensual",

        notice:
            "30 días",

        summary:
            "Amplia experiencia en operación física pero exposición limitada al canal digital.",

        assess: {

            strengths: [
                "Ejecución operativa",
                "Manejo de equipos"
            ],

            opportunities: [
                "Competencias digitales",
                "Data",
                "Inglés"
            ],

            recommendation:
                "Existe una brecha importante contra los requisitos digitales de la posición.",

            dimensions: [

                {
                    label: "Personalidad",
                    value: 72
                },

                {
                    label: "Motivaciones",
                    value: 65
                },

                {
                    label: "Razonamiento",
                    value: 58
                },

                {
                    label: "Fit cultural",
                    value: 60
                }

            ]

        },

        interviews: [

            {
                date:
                    "10 sep 2026",

                stage:
                    "Entrevista de filtro",

                interviewer:
                    "Jorge Pineda",

                role:
                    "Reclutador",

                notes:
                    "No cumple con la experiencia requerida en canal digital.",

                verdict:
                    "No recomendado"
            }

        ],

        cv: {

            fileName:
                "CV_Ricardo_Pena.pdf",

            pages: [

                {
                    title:
                        "Perfil profesional",

                    blocks: [

                        "RICARDO PEÑA — Gerente de Tienda",

                        "12 años de experiencia en operación de tiendas y manejo de equipos.",

                        "Experiencia predominantemente presencial."

                    ]
                }

            ]

        }

    },


    createCandidate(
        "c6",
        "Fernanda Vega",
        "Product Manager",
        "Marketplace MX",
        "CDMX · Híbrido",
        "En Proceso",
        89,
        5
    ),


    createCandidate(
        "c7",
        "Alejandro Ruiz",
        "E-commerce Lead",
        "Retail Online",
        "Querétaro · Remoto",
        "Finalista",
        87,
        8
    ),


    createCandidate(
        "c8",
        "Daniela Cruz",
        "Digital Commerce Manager",
        "Moda Digital",
        "CDMX · Híbrido",
        "En Proceso",
        85,
        6
    ),


    createCandidate(
        "c9",
        "Miguel Torres",
        "Marketplace Specialist",
        "Commerce Lab",
        "Monterrey · Remoto",
        "En Proceso",
        80,
        4
    ),


    createCandidate(
        "c10",
        "Valeria Soto",
        "Digital Retail Manager",
        "Grupo Centro",
        "CDMX · Presencial",
        "Finalista",
        92,
        7
    )

];


// ======================================================
// FUNCIÓN PARA CANDIDATOS ADICIONALES
// ======================================================

function createCandidate(
    id,
    name,
    role,
    company,
    location,
    status,
    compatibility,
    days
) {

    return {

        id,

        name,

        currentRole:
            role,

        company,

        location,

        status,

        compatibility,

        appliedDays:
            days,

        education:
            "Licenciatura relacionada con negocios digitales",

        languages:
            "Español nativo · Inglés B2",

        experience:
            "6 años de experiencia profesional",

        currentComp:
            "$70,000 MXN mensual",

        desiredComp:
            "$85,000 MXN mensual",

        notice:
            "30 días",

        summary:
            `${name} cuenta con experiencia en comercio digital, liderazgo de proyectos y operaciones omnicanal.`,

        assess: {

            strengths: [
                "Orientación a resultados",
                "Colaboración",
                "Pensamiento analítico"
            ],

            opportunities: [
                "Delegación",
                "Priorización"
            ],

            recommendation:
                "Perfil compatible con la posición. Se recomienda continuar con validación del Hiring Manager.",

            dimensions: [

                {
                    label:
                        "Personalidad",
                    value:
                        compatibility - 3
                },

                {
                    label:
                        "Motivaciones",
                    value:
                        compatibility
                },

                {
                    label:
                        "Razonamiento",
                    value:
                        Math.min(
                            compatibility + 3,
                            100
                        )
                },

                {
                    label:
                        "Fit cultural",
                    value:
                        compatibility
                }

            ]

        },

        interviews: [

            {
                date:
                    "22 sep 2026",

                stage:
                    "Entrevista de filtro",

                interviewer:
                    "Karla Méndez",

                role:
                    "Reclutadora Senior",

                notes:
                    "Perfil alineado con la experiencia general requerida.",

                verdict:
                    "Recomendado"
            }

        ],

        cv: {

            fileName:
                `CV_${name.replaceAll(" ", "_")}.pdf`,

            pages: [

                {
                    title:
                        "Perfil profesional",

                    blocks: [

                        `${name.toUpperCase()} — ${role}`,

                        `Experiencia profesional en ${company}.`,

                        "Experiencia en proyectos digitales, liderazgo y análisis de negocio."

                    ]
                }

            ]

        }

    };

}


// ======================================================
// ESTADO GLOBAL
// ======================================================

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


// ======================================================
// UTILIDADES
// ======================================================

function initials(name) {

    return name
        .split(" ")
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
        verdict ===
        "No recomendado"
    ) {

        return "no-recomendado";

    }


    return "reservas";

}


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );

    toast.textContent =
        message;

    toast.classList.add(
        "active"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "active"
            );

        },
        3200
    );

}


// ======================================================
// KPIS
// ======================================================

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


    const kpis = [

        {
            label:
                "Vacantes activas",

            value:
                "18",

            delta:
                "+3 vs. mes pasado",

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
                "SLA global",

            value:
                "87%",

            delta:
                "Meta 90%",

            tone:
                "flame"
        },

        {
            label:
                "Time to hire",

            value:
                "27 días",

            delta:
                "−4 días vs. Q3",

            tone:
                "grape"
        }

    ];


    document.getElementById(
        "kpiContainer"
    ).innerHTML =
        kpis.map(
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
        ).join("");

}


// ======================================================
// ALERTAS
// ======================================================

function renderAlerts() {

    const iconMap = {

        critical:
            "⚠",

        warning:
            "◷",

        info:
            "ⓘ"

    };


    document.getElementById(
        "alertsContainer"
    ).innerHTML =
        alerts.map(
            alert => `

                <article
                    class="alert ${alert.level}"
                >

                    <span class="alert-icon">
                        ${iconMap[alert.level]}
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
        ).join("");


    const criticals =
        alerts.filter(
            alert =>
                alert.level ===
                "critical"
        ).length;


    document.getElementById(
        "criticalBadge"
    ).textContent =
        criticals;

}


// ======================================================
// TIMELINE
// ======================================================

function renderTimeline() {

    const totalElapsed =
        stages.reduce(
            (total, stage) =>
                total + stage.elapsed,
            0
        );


    const totalSLA =
        stages.reduce(
            (total, stage) =>
                total + stage.sla,
            0
        );


    document.getElementById(
        "globalStageStatus"
    ).textContent =
        `${totalElapsed} de ${totalSLA} días hábiles consumidos`;


    document.getElementById(
        "timelineContainer"
    ).innerHTML =
        stages.map(
            (stage, index) => {

                const percent =
                    Math.min(
                        100,
                        Math.round(
                            (
                                stage.elapsed /
                                stage.sla
                            ) * 100
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
                    percent >= 80
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
                            class="timeline-stage-header"
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
                            >
                                ✎
                            </button>

                        </div>


                        <p
                            class="stage-owner"
                        >
                            ${stage.owner}
                        </p>


                        <p
                            class="
                                stage-time
                                ${over ? "over" : ""}
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
                                    ${percent}%
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
                                data-save-stage="${index}"
                            >
                                Guardar
                            </button>

                        </div>

                    </article>

                `;

            }
        ).join("");


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
                            button.dataset
                                .stageIndex;


                        document
                            .getElementById(
                                `editor-${index}`
                            )
                            .classList
                            .toggle(
                                "active"
                            );

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
                                button.dataset
                                    .saveStage
                            );


                        stages[index].date =
                            document.getElementById(
                                `stageDate-${index}`
                            ).value;


                        stages[index].elapsed =
                            Number(
                                document.getElementById(
                                    `stageElapsed-${index}`
                                ).value
                            );


                        stages[index].status =
                            document.getElementById(
                                `stageStatus-${index}`
                            ).value;


                        renderTimeline();


                        showToast(
                            `Etapa "${stages[index].name}" actualizada.`
                        );

                    }
                );

            }
        );

}


// ======================================================
// FILTROS
// ======================================================

function renderFilters() {

    const filters = [

        "Todos",
        "En Proceso",
        "Finalista",
        "Descartado"

    ];


    document.getElementById(
        "filtersContainer"
    ).innerHTML =
        filters.map(
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
                >
                    ${filter}
                </button>

            `
        ).join("");


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
                            button.dataset
                                .filter;

                        renderFilters();

                        renderCandidates();

                    }
                );

            }
        );

}


// ======================================================
// OBTENER CANDIDATOS FILTRADOS
// ======================================================

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
                    .includes(term)

                ||

                candidate.currentRole
                    .toLowerCase()
                    .includes(term)

                ||

                candidate.company
                    .toLowerCase()
                    .includes(term);


            return (
                matchesFilter &&
                matchesSearch
            );

        }
    );

}


// ======================================================
// CANDIDATOS
// ======================================================

function renderCandidates() {

    const visible =
        getVisibleCandidates();


    document.getElementById(
        "candidateCounter"
    ).textContent =
        `${visible.length} perfiles · selecciona 2 o más para comparar en Arena Mode`;


    const grid =
        document.getElementById(
            "candidateGrid"
        );


    if (
        visible.length === 0
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
        visible.map(
            candidate => {

                const selected =
                    selectedIds.includes(
                        candidate.id
                    );


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
                                ${initials(candidate.name)}
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

                                <span
                                    class="location"
                                >
                                    📍
                                    ${candidate.location}
                                </span>

                            </div>


                            <span
                                class="
                                    status
                                    ${statusClass(
                                        candidate.status
                                    )}
                                "
                            >
                                ${candidate.status}
                            </span>

                        </div>


                        <div
                            class="compatibility"
                        >

                            <div
                                class="compatibility-header"
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
                                        ${candidate.compatibility}%
                                    "
                                >
                                </div>

                            </div>

                        </div>


                        <div
                            class="candidate-footer"
                        >

                            <span
                                class="process-days"
                            >
                                ${candidate.appliedDays}
                                días en proceso
                            </span>


                            <div
                                class="candidate-buttons"
                            >

                                <button
                                    class="small-button"
                                    data-open="${candidate.id}"
                                >
                                    📄 CV
                                </button>


                                <button
                                    class="
                                        small-button
                                        primary
                                    "
                                    data-open="${candidate.id}"
                                >
                                    👁 Ver perfil
                                </button>

                            </div>

                        </div>

                    </article>

                `;

            }
        ).join("");


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
                            checkbox.dataset
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
                            button.dataset.open
                        );

                    }
                );

            }
        );

}


// ======================================================
// SELECCIONAR CANDIDATO
// ======================================================

function toggleCandidateSelection(id) {

    if (
        selectedIds.includes(id)
    ) {

        selectedIds =
            selectedIds.filter(
                candidateId =>
                    candidateId !== id
            );

    }

    else {

        if (
            selectedIds.length >= 4
        ) {

            showToast(
                "Selecciona máximo 4 candidatos para comparar."
            );

            renderCandidates();

            return;

        }


        selectedIds.push(id);

    }


    updateArenaButton();

    renderCandidates();

}


// ======================================================
// BOTÓN ARENA
// ======================================================

function updateArenaButton() {

    const button =
        document.getElementById(
            "arenaButton"
        );


    document.getElementById(
        "selectedCounter"
    ).textContent =
        selectedIds.length;


    button.disabled =
        selectedIds.length < 2;

}


// ======================================================
// PANEL DE CANDIDATO
// ======================================================

function openCandidate(id) {

    currentCandidate =
        candidates.find(
            candidate =>
                candidate.id === id
        );


    cvPage =
        0;

    cvZoom =
        1;


    renderCandidateSheet();


    document.getElementById(
        "sheetOverlay"
    ).classList.add(
        "active"
    );


    document.getElementById(
        "candidateSheet"
    ).classList.add(
        "active"
    );

}


// ======================================================
// CERRAR PANEL
// ======================================================

function closeCandidate() {

    document.getElementById(
        "sheetOverlay"
    ).classList.remove(
        "active"
    );


    document.getElementById(
        "candidateSheet"
    ).classList.remove(
        "active"
    );


    setTimeout(
        () => {

            currentCandidate =
                null;

        },
        300
    );

}


// ======================================================
// RENDER PANEL
// ======================================================

function renderCandidateSheet() {

    if (
        !currentCandidate
    ) {

        return;

    }


    const candidate =
        currentCandidate;


    document.getElementById(
        "candidateSheetContent"
    ).innerHTML = `

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

                    <span class="sheet-tag">
                        ${candidate.location}
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

                    ${createInfoBox(
                        "🎓",
                        "Escolaridad",
                        candidate.education
                    )}

                    ${createInfoBox(
                        "🌐",
                        "Idiomas",
                        candidate.languages
                    )}

                    ${createInfoBox(
                        "💰",
                        "Compensación actual",
                        candidate.currentComp
                    )}

                    ${createInfoBox(
                        "💰",
                        "Compensación deseada",
                        candidate.desiredComp
                    )}

                    ${createInfoBox(
                        "💼",
                        "Experiencia",
                        candidate.experience
                    )}

                    ${createInfoBox(
                        "📅",
                        "Disponibilidad",
                        candidate.notice
                    )}

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
                            class="compatibility-circle"
                        >
                            ${candidate.compatibility}%
                        </div>


                        <div class="dimensions">

                            ${
                                candidate.assess
                                    .dimensions
                                    .map(
                                        dimension => `

                                            <div
                                                class="dimension"
                                            >

                                                <div
                                                    class="
                                                        dimension-header
                                                    "
                                                >

                                                    <span>
                                                        ${dimension.label}
                                                    </span>

                                                    <strong>
                                                        ${dimension.value}%
                                                    </strong>

                                                </div>


                                                <div
                                                    class="progress"
                                                >

                                                    <div
                                                        class="
                                                            progress-fill
                                                        "

                                                        style="
                                                            width:
                                                            ${dimension.value}%
                                                        "
                                                    >
                                                    </div>

                                                </div>

                                            </div>

                                        `
                                    )
                                    .join("")
                            }

                        </div>

                    </div>


                    <div
                        class="assess-columns"
                    >

                        <div
                            class="
                                assess-list
                                strength
                            "
                        >

                            <h4>
                                Fortalezas
                            </h4>

                            <ul>

                                ${
                                    candidate
                                        .assess
                                        .strengths
                                        .map(
                                            item =>
                                                `<li>${item}</li>`
                                        )
                                        .join("")
                                }

                            </ul>

                        </div>


                        <div
                            class="
                                assess-list
                                opportunity
                            "
                        >

                            <h4>
                                Áreas de oportunidad
                            </h4>

                            <ul>

                                ${
                                    candidate
                                        .assess
                                        .opportunities
                                        .map(
                                            item =>
                                                `<li>${item}</li>`
                                        )
                                        .join("")
                                }

                            </ul>

                        </div>

                    </div>


                    <div class="recommendation">

                        <strong>
                            ✓ Recomendación del sistema
                        </strong>

                        <p>
                            ${candidate.assess.recommendation}
                        </p>

                    </div>

                </div>

            </section>


            <section class="sheet-section">

                <h3>
                    Historial de entrevistas
                </h3>

                ${
                    candidate.interviews
                        .map(
                            interview => `

                                <article
                                    class="interview"
                                >

                                    <div
                                        class="interview-top"
                                    >

                                        <div>

                                            <h4>
                                                ${interview.stage}
                                            </h4>

                                            <small>

                                                ${interview.date}
                                                ·
                                                ${interview.interviewer}
                                                (${interview.role})

                                            </small>

                                        </div>


                                        <span
                                            class="
                                                verdict
                                                ${verdictClass(
                                                    interview.verdict
                                                )}
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
                }

            </section>

        </div>


        <div class="sheet-actions">

            <button
                id="sendHMButton"
                class="send-hm"
            >
                ➤ Enviar al Hiring Manager
            </button>


            <button
                id="advanceButton"
                class="advance"
            >
                👍 Avanzar
            </button>


            <button
                id="discardButton"
                class="discard"
            >
                👎 Descartar
            </button>

        </div>

    `;


    document
        .getElementById(
            "closeCandidateButton"
        )
        .addEventListener(
            "click",
            closeCandidate
        );


    document
        .getElementById(
            "sendHMButton"
        )
        .addEventListener(
            "click",
            () => {

                showToast(
                    `${candidate.name} fue enviado al Hiring Manager.`
                );

            }
        );


    document
        .getElementById(
            "advanceButton"
        )
        .addEventListener(
            "click",
            () => {

                candidate.status =
                    "Finalista";


                showToast(
                    `${candidate.name} avanzó como finalista.`
                );


                renderKPIs();

                renderCandidates();

                renderCandidateSheet();

            }
        );


    document
        .getElementById(
            "discardButton"
        )
        .addEventListener(
            "click",
            () => {

                candidate.status =
                    "Descartado";


                showToast(
                    `${candidate.name} fue marcado como descartado.`
                );


                renderKPIs();

                renderCandidates();

                renderCandidateSheet();

            }
        );


    renderCVViewer();

}


// ======================================================
// INFO BOX
// ======================================================

function createInfoBox(
    icon,
    label,
    value
) {

    return `

        <div class="info-box">

            <span>
                ${icon}
                ${label}
            </span>

            <strong>
                ${value}
            </strong>

        </div>

    `;

}


// ======================================================
// VISOR CV
// ======================================================

function renderCVViewer() {

    if (
        !currentCandidate
    ) {

        return;

    }


    const cv =
        currentCandidate.cv;


    const page =
        cv.pages[cvPage];


    document.getElementById(
        "cvViewerContainer"
    ).innerHTML = `

        <div class="cv-viewer">

            <div class="cv-toolbar">

                <span
                    class="cv-file-name"
                >
                    📄 ${cv.fileName}
                </span>


                <div class="cv-controls">

                    <button
                        id="zoomOutButton"
                    >
                        −
                    </button>

                    <span
                        class="cv-zoom"
                    >
                        ${Math.round(
                            cvZoom * 100
                        )}%
                    </span>


                    <button
                        id="zoomInButton"
                    >
                        +
                    </button>


                    <button
                        id="previousPageButton"
                        ${
                            cvPage === 0
                            ?
                            "disabled"
                            :
                            ""
                        }
                    >
                        ‹
                    </button>


                    <span
                        class="cv-counter"
                    >

                        ${cvPage + 1}
                        /
                        ${cv.pages.length}

                    </span>


                    <button
                        id="nextPageButton"
                        ${
                            cvPage ===
                            cv.pages.length - 1
                            ?
                            "disabled"
                            :
                            ""
                        }
                    >
                        ›
                    </button>


                    <button
                        id="downloadButton"
                    >
                        ↓
                    </button>

                </div>

            </div>


            <div class="cv-area">

                <article
                    class="cv-page"

                    style="
                        font-size:
                        ${cvZoom}rem;
                    "
                >

                    <h4>
                        ${page.title}
                    </h4>


                    ${
                        page.blocks
                            .map(
                                block => `

                                    <p
                                        class="cv-block"
                                    >
                                        ${block}
                                    </p>

                                `
                            )
                            .join("")
                    }

                </article>

            </div>

        </div>

    `;


    document
        .getElementById(
            "zoomOutButton"
        )
        .addEventListener(
            "click",
            () => {

                cvZoom =
                    Math.max(
                        .8,
                        Number(
                            (
                                cvZoom -
                                .1
                            ).toFixed(1)
                        )
                    );

                renderCVViewer();

            }
        );


    document
        .getElementById(
            "zoomInButton"
        )
        .addEventListener(
            "click",
            () => {

                cvZoom =
                    Math.min(
                        1.4,
                        Number(
                            (
                                cvZoom +
                                .1
                            ).toFixed(1)
                        )
                    );

                renderCVViewer();

            }
        );


    document
        .getElementById(
            "previousPageButton"
        )
        .addEventListener(
            "click",
            () => {

                if (
                    cvPage > 0
                ) {

                    cvPage--;

                    renderCVViewer();

                }

            }
        );


    document
        .getElementById(
            "nextPageButton"
        )
        .addEventListener(
            "click",
            () => {

                if (
                    cvPage <
                    cv.pages.length - 1
                ) {

                    cvPage++;

                    renderCVViewer();

                }

            }
        );


    document
        .getElementById(
            "downloadButton"
        )
        .addEventListener(
            "click",
            () => {

                showToast(
                    "En el MVP real aquí se descargaría el archivo PDF."
                );

            }
        );

}


// ======================================================
// ARENA MODE
// ======================================================

function openArena() {

    if (
        selectedIds.length < 2
    ) {

        return;

    }


    arenaFinalists = [];


    renderArena();


    document.getElementById(
        "arenaOverlay"
    ).classList.add(
        "active"
    );

}


// ======================================================
// CERRAR ARENA
// ======================================================

function closeArena() {

    document.getElementById(
        "arenaOverlay"
    ).classList.remove(
        "active"
    );

}


// ======================================================
// RENDER ARENA
// ======================================================

function renderArena() {

    const selected =
        candidates.filter(
            candidate =>
                selectedIds.includes(
                    candidate.id
                )
        );


    const best =
        selected.reduce(
            (winner, candidate) => {

                if (
                    !winner
                    ||
                    candidate.compatibility >
                    winner.compatibility
                ) {

                    return candidate;

                }

                return winner;

            },
            null
        );


    const rows = [

        {
            label:
                "Puesto actual",

            get:
                candidate =>
                    `${candidate.currentRole} — ${candidate.company}`
        },

        {
            label:
                "Ubicación",

            get:
                candidate =>
                    candidate.location
        },

        {
            label:
                "Educación",

            get:
                candidate =>
                    candidate.education
        },

        {
            label:
                "Idiomas",

            get:
                candidate =>
                    candidate.languages
        },

        {
            label:
                "Experiencia",

            get:
                candidate =>
                    candidate.experience
        },

        {
            label:
                "Compensación actual",

            get:
                candidate =>
                    candidate.currentComp
        },

        {
            label:
                "Compensación deseada",

            get:
                candidate =>
                    candidate.desiredComp
        },

        {
            label:
                "Disponibilidad",

            get:
                candidate =>
                    candidate.notice
        },

        {
            label:
                "Fortalezas",

            get:
                candidate =>
                    candidate
                        .assess
                        .strengths
                        .join(" · ")
        },

        {
            label:
                "Áreas de oportunidad",

            get:
                candidate =>
                    candidate
                        .assess
                        .opportunities
                        .join(" · ")
        },

        {
            label:
                "Historial de entrevistas",

            get:
                candidate =>
                    candidate
                        .interviews
                        .map(
                            interview =>
                                `${interview.stage}: ${interview.verdict}`
                        )
                        .join("<br>")
        }

    ];


    document.getElementById(
        "arenaContent"
    ).innerHTML = `

        <table class="arena-table">

            <thead>

                <tr>

                    <th class="criterion">
                        Criterio
                    </th>


                    ${
                        selected.map(
                            candidate => `

                                <th>

                                    <div
                                        class="arena-candidate"
                                    >

                                        <span
                                            class="
                                                candidate-avatar
                                            "
                                        >
                                            ${initials(
                                                candidate.name
                                            )}
                                        </span>


                                        <div>

                                            <strong>
                                                ${candidate.name}
                                            </strong>

                                            ${
                                                best.id ===
                                                candidate.id
                                                ?
                                                `
                                                <span
                                                    class="best-badge"
                                                >
                                                    ♛
                                                </span>
                                                `
                                                :
                                                ""
                                            }

                                            <br>

                                            <small>
                                                ${candidate.status}
                                            </small>

                                        </div>

                                    </div>

                                </th>

                            `
                        ).join("")
                    }

                </tr>

            </thead>


            <tbody>

                <tr class="compat-row">

                    <td class="criterion">
                        Compatibilidad AssessFirst
                    </td>


                    ${
                        selected.map(
                            candidate => `

                                <td>

                                    <strong
                                        style="
                                            color:
                                            var(--liverpool);
                                            font-size:
                                            17px;
                                        "
                                    >
                                        ${candidate.compatibility}%
                                    </strong>


                                    <div class="progress">

                                        <div
                                            class="progress-fill"

                                            style="
                                                width:
                                                ${candidate.compatibility}%
                                            "
                                        >
                                        </div>

                                    </div>

                                </td>

                            `
                        ).join("")
                    }

                </tr>


                ${
                    rows.map(
                        row => `

                            <tr>

                                <td
                                    class="criterion"
                                >
                                    ${row.label}
                                </td>


                                ${
                                    selected.map(
                                        candidate => `

                                            <td>
                                                ${row.get(
                                                    candidate
                                                )}
                                            </td>

                                        `
                                    ).join("")
                                }

                            </tr>

                        `
                    ).join("")
                }


                <tr class="final-row">

                    <td class="criterion">

                        Pasar a ronda final con HM

                    </td>


                    ${
                        selected.map(
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
                        ).join("")
                    }

                </tr>

            </tbody>

        </table>


        <div class="arena-footer">

            <p>

                ${
                    arenaFinalists.length === 0

                    ?

                    "Selecciona los perfiles que avanzarán a la ronda final."

                    :

                    `${arenaFinalists.length} perfil(es) listos para enviar al Hiring Manager.`

                }

            </p>


            <button
                id="sendFinalistsButton"
                class="send-finalists"

                ${
                    arenaFinalists.length === 0
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
                            button.dataset
                                .finalist;


                        if (
                            arenaFinalists
                                .includes(id)
                        ) {

                            arenaFinalists =
                                arenaFinalists
                                    .filter(
                                        finalistId =>
                                            finalistId !==
                                            id
                                    );

                        }

                        else {

                            arenaFinalists
                                .push(id);

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
        .addEventListener(
            "click",
            () => {

                if (
                    arenaFinalists.length === 0
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


                        if (
                            candidate
                        ) {

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

                renderCandidates();

            }
        );

}


// ======================================================
// EVENTOS GENERALES
// ======================================================

function configureEvents() {

    document
        .getElementById(
            "searchInput"
        )
        .addEventListener(
            "input",
            event => {

                searchTerm =
                    event.target.value;

                renderCandidates();

            }
        );


    document
        .getElementById(
            "alertsButton"
        )
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "alertsPanel"
                    )
                    .classList
                    .toggle(
                        "hidden"
                    );

            }
        );


    document
        .getElementById(
            "closeAlertsButton"
        )
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "alertsPanel"
                    )
                    .classList
                    .add(
                        "hidden"
                    );

            }
        );


    document
        .getElementById(
            "arenaButton"
        )
        .addEventListener(
            "click",
            openArena
        );


    document
        .getElementById(
            "closeArenaButton"
        )
        .addEventListener(
            "click",
            closeArena
        );


    document
        .getElementById(
            "sheetOverlay"
        )
        .addEventListener(
            "click",
            closeCandidate
        );


    document
        .getElementById(
            "arenaOverlay"
        )
        .addEventListener(
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


// ======================================================
// INICIALIZACIÓN
// ======================================================

function init() {

    renderKPIs();

    renderAlerts();

    renderTimeline();

    renderFilters();

    renderCandidates();

    updateArenaButton();

    configureEvents();

}


init();