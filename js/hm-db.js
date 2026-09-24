// Datos semilla del módulo Hiring Manager (prototipo local, sin backend)

const HM_USUARIO = {
    nombre: "Daniel Ramírez",
    rol: "Hiring Manager · Dirección Digital"
};

const HM_VACANTE = {
    folio: "REQ-2841",
    titulo: "Gerente de E-commerce",
    area: "Dirección Digital",
    ubicacion: "Ciudad de México · Híbrido",
    nivel: "Nivel medio",
    reclutador: "Karla Méndez",
    hrbp: "Alejandra Torres"
};

const HM_ETAPAS = [
    {
        numero: 1,
        nombre: "Requisición",
        responsable: "HRBP · Alejandra Torres",
        sla: 2,
        transcurrido: 2,
        estado: "completada",
        fecha: "10 sep 2026",
        accion: null
    },
    {
        numero: 2,
        nombre: "Alineación",
        responsable: "AT + Hiring Manager",
        sla: 3,
        transcurrido: 3,
        estado: "completada",
        fecha: "12 sep 2026",
        accion: "requisitos"
    },
    {
        numero: 3,
        nombre: "Búsqueda",
        responsable: "Reclutamiento",
        sla: 5,
        transcurrido: 5,
        estado: "completada",
        fecha: "15 sep 2026",
        accion: null
    },
    {
        numero: 4,
        nombre: "Atracción",
        responsable: "Reclutamiento",
        sla: 7,
        transcurrido: 7,
        estado: "completada",
        fecha: "20 sep 2026",
        accion: null
    },
    {
        numero: 5,
        nombre: "Selección",
        responsable: "Hiring Manager + AT",
        sla: 6,
        transcurrido: 5,
        estado: "en-curso",
        fecha: "En curso",
        accion: "shortlist"
    },
    {
        numero: 6,
        nombre: "Oferta",
        responsable: "Compensaciones + AT",
        sla: 4,
        transcurrido: 0,
        estado: "pendiente",
        fecha: "Por iniciar",
        accion: null
    }
];

const HM_REQUISITOS = [
    "Liderazgo de canal digital con P&L propio",
    "Experiencia en marketplace y tienda propia",
    "Manejo de squads multidisciplinarios",
    "Inglés conversacional de negocios",
    "Analítica de conversión y forecasting"
];

const HM_ALERTAS = [
    {
        nivel: "critica",
        titulo: "Evaluaciones pendientes de tu veredicto",
        detalle: "Tienes {pendientes} candidato(s) esperando tu decisión. El más antiguo lleva 4 días hábiles.",
        tiempo: "Hace 4 h"
    },
    {
        nivel: "alerta",
        titulo: "SLA de Selección al 83%",
        detalle: "5 de 6 días hábiles consumidos en la etapa de Selección.",
        tiempo: "Hoy"
    },
    {
        nivel: "info",
        titulo: "Nuevo feedback del Líder Técnico",
        detalle: "Valeria Soto fue calificada 9/10 en la entrevista técnica.",
        tiempo: "Ayer"
    }
];

const HM_BANNER =
    "La etapa de Selección corre contra SLA: 5 de 6 días hábiles consumidos. Registra tus veredictos para no frenar la cobertura de la vacante.";

const HM_CANDIDATOS = [
    {
        id: "hm-1",
        nombre: "Ana López",
        puestoActual: "Subgerente de E-commerce",
        empresa: "Retail Group MX",
        ubicacion: "CDMX · Híbrido",
        compatibilidad: 94,
        diasEsperando: 4,
        resumen:
            "Líder comercial con 8 años en retail omnicanal. Ha operado marketplace, tienda propia y proyectos de conversión con equipos de 12 personas.",
        educacion: "Lic. Mercadotecnia",
        otrosEstudios: "MBA Digital Business",
        idiomas: "Español nativo · Inglés C1",
        experiencia: "8 años en retail omnicanal",
        compensacionActual: "$78,000 MXN mensual",
        compensacionDeseada: "$95,000 MXN mensual",
        disponibilidad: "30 días",
        skills: ["Marketplace", "P&L digital", "CRO", "Power BI", "Liderazgo"],
        estado: "Listo para HM",
        evaluacionHM: null,
        proximaEntrevista: {
            fecha: "25 sep 2026 · 10:00 h",
            modalidad: "Videollamada",
            panel: "Daniel Ramírez (HM) · Alejandra Torres (HRBP)"
        },
        entrevistas: [
            {
                etapa: "Entrevista de filtro",
                fecha: "14 sep 2026",
                entrevistador: "Karla Méndez",
                rol: "Reclutadora Senior",
                calificacion: 9,
                veredicto: "Recomendado",
                notas:
                    "Comunicación clara y métricas sólidas de GMV. Expectativa salarial dentro de banda."
            },
            {
                etapa: "Entrevista técnica",
                fecha: "19 sep 2026",
                entrevistador: "Luis Barrera",
                rol: "Head of Digital",
                calificacion: 9,
                veredicto: "Recomendado",
                notas:
                    "Dominio de P&L digital y marketplace. Buen planteamiento de roadmap a 12 meses."
            }
        ],
        cv: {
            archivo: "CV_Ana_Lopez_2026.pdf",
            contacto: "ana.lopez@correo.com · CDMX",
            secciones: [
                {
                    titulo: "Perfil profesional",
                    lineas: [
                        "Subgerente de E-commerce con foco en crecimiento de canal digital y experiencia de cliente.",
                        "Responsable de un P&L de 180 MDP anuales y de la operación de marketplace."
                    ]
                },
                {
                    titulo: "Experiencia",
                    lineas: [
                        "Retail Group MX · Subgerente de E-commerce (2021 - actual)",
                        "Crecimiento de GMV de 34% interanual con inversión plana.",
                        "Implementación de marketplace con 400 sellers activos.",
                        "Moda Digital · Coordinadora de Comercio Electrónico (2018 - 2021)"
                    ]
                },
                {
                    titulo: "Educación y habilidades",
                    lineas: [
                        "MBA Digital Business · Lic. Mercadotecnia",
                        "Google Analytics · Salesforce Commerce · SQL · Power BI"
                    ]
                }
            ]
        }
    },
    {
        id: "hm-2",
        nombre: "Valeria Soto",
        puestoActual: "Digital Retail Manager",
        empresa: "Grupo Centro",
        ubicacion: "CDMX · Presencial",
        compatibilidad: 92,
        diasEsperando: 3,
        resumen:
            "Perfil híbrido de negocio y tecnología. Escaló la operación digital de una cadena departamental con foco en logística de última milla.",
        educacion: "Ing. Sistemas Computacionales",
        otrosEstudios: "Diplomado en Retail Analytics",
        idiomas: "Español nativo · Inglés C1 · Francés B1",
        experiencia: "9 años en comercio digital",
        compensacionActual: "$85,000 MXN mensual",
        compensacionDeseada: "$100,000 MXN mensual",
        disponibilidad: "21 días",
        skills: ["Omnicanalidad", "Última milla", "SQL", "Forecasting", "Squads ágiles"],
        estado: "Listo para HM",
        evaluacionHM: null,
        proximaEntrevista: {
            fecha: "25 sep 2026 · 12:30 h",
            modalidad: "Presencial · Torre Corporativa",
            panel: "Daniel Ramírez (HM) · Luis Barrera (Head of Digital)"
        },
        entrevistas: [
            {
                etapa: "Entrevista de filtro",
                fecha: "13 sep 2026",
                entrevistador: "Karla Méndez",
                rol: "Reclutadora Senior",
                calificacion: 8,
                veredicto: "Recomendado",
                notas: "Trayectoria consistente y motivación clara por la marca."
            },
            {
                etapa: "Entrevista técnica",
                fecha: "18 sep 2026",
                entrevistador: "Sofía Rodríguez",
                rol: "Líder Técnico",
                calificacion: 9,
                veredicto: "Recomendado",
                notas:
                    "Sólida en arquitectura de integraciones y métricas de operación. Aporta visión de producto."
            },
            {
                etapa: "Entrevista de cultura",
                fecha: "21 sep 2026",
                entrevistador: "Alejandra Torres",
                rol: "HRBP",
                calificacion: 8,
                veredicto: "Recomendado",
                notas: "Buen encaje con el estilo colaborativo de la dirección."
            }
        ],
        cv: {
            archivo: "CV_Valeria_Soto.pdf",
            contacto: "valeria.soto@correo.com · CDMX",
            secciones: [
                {
                    titulo: "Perfil profesional",
                    lineas: [
                        "Digital Retail Manager con experiencia en integración de tiendas físicas y canal digital.",
                        "Especialista en operación de última milla y analítica de inventario."
                    ]
                },
                {
                    titulo: "Experiencia",
                    lineas: [
                        "Grupo Centro · Digital Retail Manager (2020 - actual)",
                        "Reducción de 28% en tiempos de entrega nacional.",
                        "Integración de inventario omnicanal en 42 tiendas.",
                        "Commerce Lab · Analista Senior de Operaciones (2017 - 2020)"
                    ]
                },
                {
                    titulo: "Educación y habilidades",
                    lineas: [
                        "Ing. Sistemas Computacionales · Diplomado en Retail Analytics",
                        "SQL · Looker · Forecasting · Gestión de squads"
                    ]
                }
            ]
        }
    },
    {
        id: "hm-3",
        nombre: "Fernanda Vega",
        puestoActual: "Product Manager",
        empresa: "Marketplace MX",
        ubicacion: "CDMX · Híbrido",
        compatibilidad: 89,
        diasEsperando: 2,
        resumen:
            "Product Manager de marketplace con fuerte base analítica. Ha liderado descubrimiento de producto y roadmap de sellers.",
        educacion: "Lic. Administración de Empresas",
        otrosEstudios: "Certificación Product Owner",
        idiomas: "Español nativo · Inglés B2",
        experiencia: "6 años en producto digital",
        compensacionActual: "$72,000 MXN mensual",
        compensacionDeseada: "$88,000 MXN mensual",
        disponibilidad: "Inmediata",
        skills: ["Discovery", "Roadmap", "A/B testing", "Sellers", "Jira"],
        estado: "Listo para HM",
        evaluacionHM: null,
        proximaEntrevista: {
            fecha: "26 sep 2026 · 09:00 h",
            modalidad: "Videollamada",
            panel: "Daniel Ramírez (HM)"
        },
        entrevistas: [
            {
                etapa: "Entrevista de filtro",
                fecha: "20 sep 2026",
                entrevistador: "Jorge Pineda",
                rol: "Reclutador",
                calificacion: 8,
                veredicto: "Recomendado",
                notas: "Perfil analítico y ordenado. Menor exposición a tienda propia."
            },
            {
                etapa: "Entrevista técnica",
                fecha: "22 sep 2026",
                entrevistador: "Luis Barrera",
                rol: "Head of Digital",
                calificacion: 7,
                veredicto: "Recomendado",
                notas:
                    "Buen manejo de métricas de producto. Necesitará acompañamiento en gestión de P&L."
            }
        ],
        cv: {
            archivo: "CV_Fernanda_Vega.pdf",
            contacto: "fernanda.vega@correo.com · CDMX",
            secciones: [
                {
                    titulo: "Perfil profesional",
                    lineas: [
                        "Product Manager enfocada en marketplaces y ecosistemas de sellers.",
                        "Experiencia en discovery, priorización y experimentación continua."
                    ]
                },
                {
                    titulo: "Experiencia",
                    lineas: [
                        "Marketplace MX · Product Manager (2022 - actual)",
                        "Lanzamiento del portal de sellers con 1,100 cuentas activas.",
                        "Incremento de 19% en conversión de checkout.",
                        "Comercio Digital SA · Analista de Producto (2019 - 2022)"
                    ]
                },
                {
                    titulo: "Educación y habilidades",
                    lineas: [
                        "Lic. Administración de Empresas · Certificación Product Owner",
                        "SQL · Amplitude · Figma · Jira"
                    ]
                }
            ]
        }
    },
    {
        id: "hm-4",
        nombre: "Mariana Ortiz",
        puestoActual: "Gerente de Marketplace",
        empresa: "Comercio Digital SA",
        ubicacion: "Monterrey · Remoto",
        compatibilidad: 91,
        diasEsperando: 0,
        resumen:
            "Construyó y escaló un marketplace con más de mil sellers. Fuerte en negociación comercial y operación logística.",
        educacion: "Ing. Industrial",
        otrosEstudios: "Diplomado en Growth",
        idiomas: "Español nativo · Inglés B2",
        experiencia: "10 años en comercio digital",
        compensacionActual: "$88,000 MXN mensual",
        compensacionDeseada: "$105,000 MXN mensual",
        disponibilidad: "15 días",
        skills: ["Marketplace", "Negociación", "Logística", "Looker", "Escalamiento"],
        estado: "Finalista",
        evaluacionHM: {
            veredicto: "Recomendado",
            justificacion:
                "Cumple el perfil técnico y comercial que necesita la dirección. Su experiencia escalando sellers reduce la curva de aprendizaje del primer trimestre.",
            fecha: "22 sep 2026"
        },
        proximaEntrevista: null,
        entrevistas: [
            {
                etapa: "Entrevista de filtro",
                fecha: "15 sep 2026",
                entrevistador: "Karla Méndez",
                rol: "Reclutadora Senior",
                calificacion: 8,
                veredicto: "Recomendado",
                notas: "Perfil sólido. Expectativa salarial en la parte alta de la banda."
            },
            {
                etapa: "Entrevista técnica",
                fecha: "20 sep 2026",
                entrevistador: "Luis Barrera",
                rol: "Head of Digital",
                calificacion: 8,
                veredicto: "Recomendado",
                notas: "Excelente conocimiento de marketplace, menor experiencia en tienda propia."
            }
        ],
        cv: {
            archivo: "CV_Mariana_Ortiz.pdf",
            contacto: "mariana.ortiz@correo.com · Monterrey",
            secciones: [
                {
                    titulo: "Perfil profesional",
                    lineas: [
                        "Gerente de Marketplace con 10 años construyendo operaciones de comercio digital.",
                        "Especialista en ecosistemas de sellers y logística nacional."
                    ]
                },
                {
                    titulo: "Experiencia",
                    lineas: [
                        "Comercio Digital SA · Gerente de Marketplace (2019 - actual)",
                        "1,200 sellers activos y 22% de crecimiento en take rate.",
                        "Retail Online · Coordinadora Comercial (2016 - 2019)"
                    ]
                },
                {
                    titulo: "Educación y habilidades",
                    lineas: [
                        "Ing. Industrial · Diplomado en Growth",
                        "SQL · Looker · Forecasting · Negociación comercial"
                    ]
                }
            ]
        }
    },
    {
        id: "hm-5",
        nombre: "Alejandro Ruiz",
        puestoActual: "E-commerce Lead",
        empresa: "Retail Online",
        ubicacion: "Querétaro · Remoto",
        compatibilidad: 87,
        diasEsperando: 0,
        resumen:
            "Lead de e-commerce con buen manejo de performance marketing, aunque con poca exposición a estructuras corporativas grandes.",
        educacion: "Lic. Negocios Internacionales",
        otrosEstudios: "Certificación Google Ads",
        idiomas: "Español nativo · Inglés B2",
        experiencia: "7 años en comercio digital",
        compensacionActual: "$80,000 MXN mensual",
        compensacionDeseada: "$110,000 MXN mensual",
        disponibilidad: "45 días",
        skills: ["Performance", "SEO", "Shopify", "Email marketing", "CRO"],
        estado: "Descartado",
        evaluacionHM: {
            veredicto: "No recomendado",
            justificacion:
                "La expectativa de compensación queda 18% arriba de la banda autorizada y no acredita gestión de equipos mayores a cinco personas, que es el alcance real del puesto.",
            fecha: "21 sep 2026"
        },
        proximaEntrevista: null,
        entrevistas: [
            {
                etapa: "Entrevista de filtro",
                fecha: "16 sep 2026",
                entrevistador: "Jorge Pineda",
                rol: "Reclutador",
                calificacion: 7,
                veredicto: "Recomendado",
                notas: "Buen dominio de adquisición digital. Expectativa salarial sobre banda."
            }
        ],
        cv: {
            archivo: "CV_Alejandro_Ruiz.pdf",
            contacto: "alejandro.ruiz@correo.com · Querétaro",
            secciones: [
                {
                    titulo: "Perfil profesional",
                    lineas: [
                        "E-commerce Lead con foco en performance marketing y conversión.",
                        "Experiencia en tiendas propias de catálogo medio."
                    ]
                },
                {
                    titulo: "Experiencia",
                    lineas: [
                        "Retail Online · E-commerce Lead (2021 - actual)",
                        "Reducción de 23% en CAC y crecimiento de 31% en sesiones orgánicas.",
                        "Moda Urbana · Especialista Digital (2018 - 2021)"
                    ]
                },
                {
                    titulo: "Educación y habilidades",
                    lineas: [
                        "Lic. Negocios Internacionales · Certificación Google Ads",
                        "Shopify · Meta Ads · GA4 · Klaviyo"
                    ]
                }
            ]
        }
    },
    {
        id: "hm-6",
        nombre: "Carlos Medina",
        puestoActual: "Head of Growth",
        empresa: "Fintech Norte",
        ubicacion: "Guadalajara · Híbrido",
        compatibilidad: 78,
        diasEsperando: 1,
        resumen:
            "Perfil de growth con base analítica fuerte. Viene de fintech, por lo que la operación de retail físico le es nueva.",
        educacion: "Lic. Economía",
        otrosEstudios: "Especialidad en Analítica de Datos",
        idiomas: "Español nativo · Inglés C2 · Portugués B1",
        experiencia: "7 años en growth y adquisición",
        compensacionActual: "$92,000 MXN mensual",
        compensacionDeseada: "$115,000 MXN mensual",
        disponibilidad: "45 días",
        skills: ["Growth", "Data", "Experimentación", "Python", "Adquisición"],
        estado: "Listo para HM",
        evaluacionHM: null,
        proximaEntrevista: {
            fecha: "26 sep 2026 · 16:00 h",
            modalidad: "Videollamada",
            panel: "Daniel Ramírez (HM) · Karla Méndez (AT)"
        },
        entrevistas: [
            {
                etapa: "Entrevista de filtro",
                fecha: "18 sep 2026",
                entrevistador: "Karla Méndez",
                rol: "Reclutadora Senior",
                calificacion: 6,
                veredicto: "No recomendado",
                notas:
                    "Perfil técnico interesante, pero sin experiencia en retail y con expectativa sobre banda."
            }
        ],
        cv: {
            archivo: "CV_Carlos_Medina.pdf",
            contacto: "carlos.medina@correo.com · Guadalajara",
            secciones: [
                {
                    titulo: "Perfil profesional",
                    lineas: [
                        "Head of Growth con experiencia en performance, data y adquisición digital.",
                        "Trayectoria concentrada en servicios financieros digitales."
                    ]
                },
                {
                    titulo: "Experiencia",
                    lineas: [
                        "Fintech Norte · Head of Growth (2022 - actual)",
                        "Reducción de 35% en CAC y modelo de atribución propio.",
                        "Commerce Lab · Growth Manager (2019 - 2022)"
                    ]
                },
                {
                    titulo: "Educación y habilidades",
                    lineas: [
                        "Lic. Economía · Especialidad en Analítica de Datos",
                        "Python · SQL · Amplitude · Experimentación"
                    ]
                }
            ]
        }
    }
];
