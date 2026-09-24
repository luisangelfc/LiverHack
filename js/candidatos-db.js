// Datos de prueba y autenticación local. En producción, el servidor debe autenticar y filtrar los datos privados.

// DATOS CRUDOS (tal como viven en candidates_data)

const CANDIDATOS_RAW_DB = [

    {
        id: 1,
        nombre: "Ana López",
        puesto_actual: "Gerente de Proyectos E-commerce",
        empresa_actual: "Retail Digital S.A.",
        resumen_profesional:
            "Gerente de Proyectos con 8 años de experiencia liderando la implementación de plataformas de e-commerce y optimizando la experiencia de usuario. Experta en metodologías ágiles y gestión de equipos multidisciplinarios.",
        cv_path: "/cvs/ana_lopez.pdf",
        compensacion_actual: 1000000,
        compensacion_deseada: 1200000,
        escolaridad: "Licenciatura en Marketing Digital",
        otros_estudios: "Certificación PMP, Diplomado en UX/UI",
        idiomas: "Inglés (C1), Español (Nativo)",
        assessfirst: {
            compatibilidad: "92%",
            descripcion:
                "Perfil orientado a resultados, con altas capacidades de liderazgo y visión estratégica. Excelente para roles de gestión.",
            fortalezas: "Liderazgo, Planificación estratégica, Comunicación efectiva.",
            areas_oportunidad: "Profundizar en análisis de datos técnicos.",
            estilo_liderazgo: "Transformacional",
            vision_estrategica: "Alta",
            toma_decisiones: "Basada en datos y experiencia.",
            recomendaciones: "Altamente recomendada para liderar proyectos de alto impacto."
        },
        status_proceso: "Finalista",
        status_justificacion:
            "Candidata con la mejor combinación de experiencia técnica y habilidades de liderazgo. Fuerte alineación cultural.",
        entrevistas: [
            {
                entrevista_id: 101,
                fecha: "2024-09-28",
                entrevistadores: ["Sofia Rodriguez (Líder Técnico)"],
                notas:
                    "Sólido conocimiento técnico en plataformas e-commerce. Respondió con seguridad a preguntas sobre arquitectura de sistemas.",
                veredicto: "Recomendado"
            },
            {
                entrevista_id: 102,
                fecha: "2024-10-05",
                entrevistadores: ["Carlos Sanchez (Director de Marketing)", "Aileen Vargas (Hiring Manager)"],
                notas:
                    "Excelente visión de negocio y enfoque en el cliente. Presentó casos de éxito relevantes. Aileen Vargas: 'Su experiencia en optimización de conversión es justo lo que buscamos'.",
                veredicto: "Recomendado"
            }
        ]
    },

    {
        id: 2,
        nombre: "Carlos Mendoza",
        puesto_actual: "Desarrollador Backend Senior",
        empresa_actual: "Soluciones Tech S. de R.L.",
        resumen_profesional:
            "Desarrollador Backend con 6 años de experiencia en la construcción de APIs RESTful y microservicios con Java y Spring Boot. Apasionado por el código limpio y las buenas prácticas de desarrollo.",
        cv_path: "/cvs/carlos_mendoza.pdf",
        compensacion_actual: 850000,
        compensacion_deseada: 950000,
        escolaridad: "Ingeniería en Sistemas Computacionales",
        otros_estudios: "Certificación AWS Certified Developer",
        idiomas: "Inglés (B2), Español (Nativo)",
        assessfirst: {
            compatibilidad: "88%",
            descripcion:
                "Perfil técnico robusto, con gran capacidad de análisis y resolución de problemas. Colaborador y proactivo.",
            fortalezas: "Resolución de problemas, Lógica de programación, Trabajo en equipo.",
            areas_oportunidad: "Desarrollar habilidades de mentoría.",
            estilo_liderazgo: "N/A (Colaborador individual)",
            vision_estrategica: "Media",
            toma_decisiones: "Analítica y metódica.",
            recomendaciones: "Recomendado para roles Senior que requieran alta capacidad técnica."
        },
        status_proceso: "Descartado",
        status_justificacion:
            "Aunque es técnicamente muy sólido, buscamos un perfil con más experiencia en liderazgo de equipos para la posición actual.",
        entrevistas: [
            {
                entrevista_id: 201,
                fecha: "2024-09-29",
                entrevistadores: ["Sofia Rodriguez (Líder Técnico)"],
                notas:
                    "Dominio excepcional de Spring Boot y microservicios. Resolvió el reto técnico en tiempo récord. Muy buen fit técnico.",
                veredicto: "Recomendado"
            },
            {
                entrevista_id: 202,
                fecha: "2024-10-06",
                entrevistadores: ["Aileen Vargas (Hiring Manager)"],
                notas:
                    "Gran actitud y habilidades técnicas. Sin embargo, en la conversación sobre liderazgo de proyectos, mostró menos experiencia de la requerida.",
                veredicto: "No recomendado"
            }
        ]
    },

    {
        id: 3,
        nombre: "Sofia Herrera",
        puesto_actual: "Analista de Datos Jr.",
        empresa_actual: "Consultoría Analítica Co.",
        resumen_profesional:
            "Analista de Datos con 2 años de experiencia en la extracción y visualización de datos para la toma de decisiones. Experiencia con SQL, Python (Pandas) y Tableau.",
        cv_path: "/cvs/sofia_herrera.pdf",
        compensacion_actual: 500000,
        compensacion_deseada: 600000,
        escolaridad: "Actuaría",
        otros_estudios: "Curso intensivo de Ciencia de Datos",
        idiomas: "Inglés (C1), Español (Nativo)",
        assessfirst: {
            compatibilidad: "95%",
            descripcion:
                "Perfil con alto potencial, muy analítica y con una gran curiosidad intelectual. Rápido aprendizaje y alta motivación.",
            fortalezas: "Análisis numérico, Curiosidad, Atención al detalle.",
            areas_oportunidad: "Experiencia en proyectos de gran escala.",
            estilo_liderazgo: "N/A",
            vision_estrategica: "Baja (en desarrollo)",
            toma_decisiones: "Basada en evidencia y datos.",
            recomendaciones: "Excelente candidata para una posición de entrada con alto potencial de crecimiento."
        },
        status_proceso: "En Proceso",
        status_justificacion: "",
        entrevistas: [
            {
                entrevista_id: 301,
                fecha: "2024-10-01",
                entrevistadores: ["Juan Perez (Gerente de BI)"],
                notas:
                    "Conocimientos sólidos en SQL y Tableau. Demostró gran capacidad para interpretar datos y comunicar hallazgos. Potencial a desarrollar.",
                veredicto: "Recomendado"
            },
            {
                entrevista_id: 302,
                fecha: "2024-10-08",
                entrevistadores: ["Aileen Vargas (Hiring Manager)"],
                notas:
                    "Muy entusiasta y con ganas de aprender. Se alinea bien con la cultura del equipo. Pendiente de la entrevista final con el director del área.",
                veredicto: "Recomendado"
            }
        ]
    },

    {
        id: 4,
        nombre: "Javier Torres",
        puesto_actual: "Diseñador UX/UI Senior",
        empresa_actual: "Creativos App Factory",
        resumen_profesional:
            "Diseñador UX/UI con más de 7 años de experiencia en la creación de interfaces intuitivas para aplicaciones móviles y web. Experto en Figma, Sketch y Adobe XD.",
        cv_path: "/cvs/javier_torres.pdf",
        compensacion_actual: 900000,
        compensacion_deseada: 1050000,
        escolaridad: "Licenciatura en Diseño Gráfico",
        otros_estudios: "Certificación en Interacción Humano-Computadora",
        idiomas: "Inglés (C1), Español (Nativo)",
        assessfirst: {
            compatibilidad: "85%",
            descripcion: "Creativo y enfocado en el usuario.",
            fortalezas: "Creatividad, Empatía",
            areas_oportunidad: "Gestión de proyectos",
            recomendaciones: "Fuerte para roles de diseño senior."
        },
        status_proceso: "En Proceso",
        status_justificacion: "",
        entrevistas: []
    },

    {
        id: 5,
        nombre: "Laura Jimenez",
        puesto_actual: "Especialista en Marketing Digital",
        empresa_actual: "Agencia Impacto Online",
        resumen_profesional:
            "Especialista en Marketing Digital con 4 años de experiencia en campañas de SEO/SEM, redes sociales y email marketing.",
        cv_path: "/cvs/laura_jimenez.pdf",
        compensacion_actual: 650000,
        compensacion_deseada: 750000,
        escolaridad: "Licenciatura en Comunicación",
        otros_estudios: "Certificación Google Ads",
        idiomas: "Inglés (B2), Español (Nativo)",
        assessfirst: {
            compatibilidad: "89%",
            descripcion: "Orientada a resultados, proactiva.",
            fortalezas: "Análisis de métricas, Creatividad",
            areas_oportunidad: "Liderazgo de equipos",
            recomendaciones: "Buen fit para roles de ejecución de campañas."
        },
        status_proceso: "En Proceso",
        status_justificacion: "",
        entrevistas: []
    },

    {
        id: 6,
        nombre: "David Peña",
        puesto_actual: "Arquitecto de Soluciones Cloud",
        empresa_actual: "Nube Segura Inc.",
        resumen_profesional:
            "Arquitecto Cloud con 10 años de experiencia diseñando e implementando soluciones escalables y seguras en AWS y Azure.",
        cv_path: "/cvs/david_pena.pdf",
        compensacion_actual: 1500000,
        compensacion_deseada: 1700000,
        escolaridad: "Ingeniería en Telemática",
        otros_estudios: "Certificaciones AWS Solutions Architect Professional y Azure Solutions Architect Expert",
        idiomas: "Inglés (C2), Español (Nativo)",
        assessfirst: {
            compatibilidad: "91%",
            descripcion: "Visión estratégica y profundo conocimiento técnico.",
            fortalezas: "Arquitectura de sistemas, Seguridad",
            areas_oportunidad: "Gestión de presupuesto",
            recomendaciones: "Candidato ideal para roles de arquitectura de alto nivel."
        },
        status_proceso: "Descartado",
        status_justificacion: "Las expectativas salariales exceden el presupuesto para la vacante.",
        entrevistas: []
    },

    {
        id: 7,
        nombre: "Fernanda Morales",
        puesto_actual: "Scrum Master",
        empresa_actual: "Agile Development Corp.",
        resumen_profesional:
            "Scrum Master certificada con 5 años de experiencia facilitando ceremonias ágiles y removiendo impedimentos para equipos de desarrollo.",
        cv_path: "/cvs/fernanda_morales.pdf",
        compensacion_actual: 750000,
        compensacion_deseada: 850000,
        escolaridad: "Licenciatura en Administración de Empresas",
        otros_estudios: "Certified ScrumMaster (CSM), SAFe Agilist",
        idiomas: "Inglés (C1), Español (Nativo)",
        assessfirst: {
            compatibilidad: "93%",
            descripcion: "Facilitadora natural, excelentes habilidades de comunicación.",
            fortalezas: "Comunicación, Resolución de conflictos",
            areas_oportunidad: "Conocimiento técnico profundo",
            recomendaciones: "Recomendada para mejorar la agilidad de los equipos."
        },
        status_proceso: "En Proceso",
        status_justificacion: "",
        entrevistas: []
    },

    {
        id: 8,
        nombre: "Ricardo Salas",
        puesto_actual: "Desarrollador Frontend",
        empresa_actual: "Innovación Web",
        resumen_profesional:
            "Desarrollador Frontend con 3 años de experiencia construyendo interfaces de usuario responsivas con React y TypeScript.",
        cv_path: "/cvs/ricardo_salas.pdf",
        compensacion_actual: 600000,
        compensacion_deseada: 700000,
        escolaridad: "Ingeniería en Tecnologías de la Información",
        otros_estudios: "Cursos avanzados de React en Platzi",
        idiomas: "Inglés (B2), Español (Nativo)",
        assessfirst: {
            compatibilidad: "87%",
            descripcion: "Apasionado por la tecnología y la experiencia de usuario.",
            fortalezas: "React, CSS, Trabajo en equipo",
            areas_oportunidad: "Automatización de pruebas",
            recomendaciones: "Buen candidato para un equipo de desarrollo frontend."
        },
        status_proceso: "En Proceso",
        status_justificacion: "",
        entrevistas: []
    },

    {
        id: 9,
        nombre: "Mariana Castillo",
        puesto_actual: "HR Business Partner",
        empresa_actual: "Talento Humano Global",
        resumen_profesional:
            "HRBP con 6 años de experiencia gestionando el ciclo de vida del empleado, relaciones laborales y desarrollo organizacional.",
        cv_path: "/cvs/mariana_castillo.pdf",
        compensacion_actual: 800000,
        compensacion_deseada: 900000,
        escolaridad: "Licenciatura en Psicología Organizacional",
        otros_estudios: "Maestría en Desarrollo Humano",
        idiomas: "Inglés (C1), Español (Nativo)",
        assessfirst: {
            compatibilidad: "90%",
            descripcion: "Empática, estratégica y con fuerte enfoque en el negocio.",
            fortalezas: "Relaciones laborales, Comunicación",
            areas_oportunidad: "Análisis de datos de RH",
            recomendaciones: "Fuerte candidata para una posición de HRBP."
        },
        status_proceso: "Descartado",
        status_justificacion: "Se decidió por un candidato interno.",
        entrevistas: []
    },

    {
        id: 10,
        nombre: "Oscar Paredes",
        puesto_actual: "Becario de Calidad de Software",
        empresa_actual: "Pruebas Perfectas Ltda.",
        resumen_profesional:
            "Estudiante de último semestre de Ingeniería de Software buscando experiencia en el área de QA. Conocimientos básicos en Selenium y Cypress.",
        cv_path: "/cvs/oscar_paredes.pdf",
        compensacion_actual: 100000,
        compensacion_deseada: 150000,
        escolaridad: "Estudiante de Ingeniería de Software",
        otros_estudios: "Ninguno",
        idiomas: "Inglés (B1), Español (Nativo)",
        assessfirst: {
            compatibilidad: "82%",
            descripcion: "Alto potencial, con ganas de aprender.",
            fortalezas: "Atención al detalle, Lógica",
            areas_oportunidad: "Experiencia práctica",
            recomendaciones: "Buen candidato para un programa de becarios."
        },
        status_proceso: "En Proceso",
        status_justificacion: "",
        entrevistas: []
    }

];

// Credenciales de prueba: nombre.apellido sin acentos y contraseña 0000.

function candidatoSlugify(text) {

    return text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z\s]/g, "")
        .replace(/\s+/g, ".");

}

function candidatoBuildEmail(nombreCompleto) {

    const parts = nombreCompleto.trim().split(/\s+/);

    const firstName = parts[0];

    const lastName = parts.slice(1).join(" ") || parts[0];

    return `${candidatoSlugify(firstName)}.${candidatoSlugify(lastName)}@candidatos.liverpool.com`;

}

const CANDIDATOS_CREDENCIALES = CANDIDATOS_RAW_DB.map(candidate => ({

    id: candidate.id,
    nombre: candidate.nombre,
    email: candidatoBuildEmail(candidate.nombre),
    password: "0000"

}));

function candidatoAuthenticate(email, password) {

    const normalizedEmail = (email || "").trim().toLowerCase();

    const credential = CANDIDATOS_CREDENCIALES.find(
        item => item.email === normalizedEmail
    );

    if (!credential) {

        return { ok: false, error: "No encontramos una cuenta con ese correo." };

    }

    if (credential.password !== password) {

        return { ok: false, error: "La contraseña no es correcta." };

    }

    return { ok: true, id: credential.id };

}

// El portal del candidato omite evaluaciones internas, notas y veredictos.

function candidatoGetPublicView(id) {

    const raw = CANDIDATOS_RAW_DB.find(candidate => candidate.id === Number(id));

    if (!raw) {

        return null;

    }

    const firstName = raw.nombre.split(" ")[0];

    // Se muestra el último entrevistador o, si no hay entrevistas, el contacto de Talento.
    let contactoNombre = "Equipo de Talento Liverpool";
    let contactoRol = "Acompañamiento de tu proceso";

    if (raw.entrevistas.length > 0) {

        const ultima = raw.entrevistas[raw.entrevistas.length - 1];

        const primerEntrevistador = ultima.entrevistadores[0] || "";

        const match = primerEntrevistador.match(/^(.*?)\s*\((.*)\)\s*$/);

        contactoNombre = match ? match[1] : primerEntrevistador;

        contactoRol = match ? match[2] : "Equipo de selección";

    }

    return {

        id: raw.id,
        nombre: raw.nombre,
        firstName,

        puestoActual: raw.puesto_actual,
        empresaActual: raw.empresa_actual,
        resumenProfesional: raw.resumen_profesional,

        compensacionActual: raw.compensacion_actual,
        compensacionDeseada: raw.compensacion_deseada,

        escolaridad: raw.escolaridad,
        otrosEstudios: raw.otros_estudios,
        idiomas: raw.idiomas,

        cvPath: raw.cv_path,

        statusProceso: raw.status_proceso,

        // El candidato solo recibe la parte pública del assessment.
        assessment: {
            descripcion: raw.assessfirst.descripcion,
            fortalezas: raw.assessfirst.fortalezas,
            areasOportunidad: raw.assessfirst.areas_oportunidad
        },

        // Solo fecha y con quién platicó; nunca notas ni veredicto.
        entrevistas: raw.entrevistas.map(entrevista => ({
            fecha: entrevista.fecha,
            entrevistadores: entrevista.entrevistadores
        })),

        contacto: {
            nombre: contactoNombre,
            rol: contactoRol
        }

    };

}
