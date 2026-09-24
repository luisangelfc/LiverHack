// ======================================================
// EDAT · MOTOR DE FLUJO COMPARTIDO
// Ecosistema Digital de Atracción de Talento
//
// Este archivo NO es una base de datos: la fuente de los
// candidatos sigue siendo candidatos-db.js (CANDIDATOS_RAW_DB).
// Aquí sólo viven:
//
//   · la etapa en la que va la vacante,
//   · las decisiones que toma cada actor,
//   · las notificaciones entre actores,
//   · y su persistencia en LocalStorage.
//
// Debe cargarse DESPUÉS de candidatos-db.js.
// ======================================================


const EDAT_LLAVE_FLUJO = "edatFlujo";
const EDAT_LLAVE_SESION = "talentoSession";

// Fecha ancla de la demo: todas las fechas simuladas se calculan
// como desplazamientos sobre esta base para que el calendario del
// proceso sea coherente de principio a fin.
const EDAT_FECHA_BASE = "2026-09-24";


// ======================================================
// NOMENCLATURA ÚNICA DE ESTADOS
// Los estados individuales reutilizan los nombres que ya
// usa candidatos-db.js (status_proceso).
// ======================================================

const EDAT_ESTADOS = {
    EN_PROCESO: "En Proceso",
    FINALISTA: "Finalista",
    DESCARTADO: "Descartado",
    NO_SELECCIONADO: "No Seleccionado",
    OFERTA_ENVIADA: "Oferta Enviada",
    OFERTA_ACEPTADA: "Oferta Aceptada",
    INCORPORADO: "Incorporado"
};


// Etapas internas del proceso, en orden estricto.
const EDAT_ETAPAS = [
    "requisicion",
    "alineacion",
    "busqueda",
    "entrevistas_at",
    "seleccion_hm",
    "entrevistas_hm",
    "oferta",
    "aceptacion",
    "incorporacion",
    "finalizado"
];


// Las interfaces existentes muestran la vacante en 6 etapas.
// Este mapa traduce las etapas internas a esa vista sin
// inventar una segunda nomenclatura.
const EDAT_ETAPAS_VACANTE = [
    {
        clave: "requisicion",
        nombre: "Requisición",
        responsable: "HRBP · Alejandra Torres",
        sla: 2,
        internas: ["requisicion"]
    },
    {
        clave: "alineacion",
        nombre: "Alineación",
        responsable: "AT + Hiring Manager",
        sla: 3,
        internas: ["alineacion"]
    },
    {
        clave: "busqueda",
        nombre: "Búsqueda",
        responsable: "Atracción de Talento",
        sla: 5,
        internas: ["busqueda"]
    },
    {
        clave: "entrevistas_at",
        nombre: "Entrevistas AT",
        responsable: "Atracción de Talento",
        sla: 7,
        internas: ["entrevistas_at"]
    },
    {
        clave: "entrevistas_hm",
        nombre: "Entrevistas HM",
        responsable: "Hiring Manager",
        sla: 6,
        internas: ["seleccion_hm", "entrevistas_hm"]
    },
    {
        clave: "oferta",
        nombre: "Oferta y cierre",
        responsable: "HRBP + Atracción de Talento",
        sla: 4,
        internas: ["oferta", "aceptacion", "incorporacion", "finalizado"]
    }
];


const EDAT_ACTORES = {
    hrbp: "HRBP",
    at: "Atracción de Talento",
    hm: "Hiring Manager",
    candidato: "Candidato"
};


// Motivos predefinidos para los candidatos que no avanzan.
// Se eligen a partir de la información que ya vive en la BD y
// en los no negociables, para no pedirle al HM que redacte.
const EDAT_MOTIVOS_CIERRE = [
    "No cumple con el nivel de estudios requerido.",
    "No cumple con uno o más conocimientos técnicos requeridos.",
    "El perfil no se ajusta completamente a los requisitos de la vacante.",
    "Se continuará con otro perfil con mayor compatibilidad con los requisitos definidos."
];


const EDAT_MENSAJE_CIERRE_CANDIDATO =
    "Tu proceso para esta vacante ha concluido. Agradecemos tu interés y te invitamos a continuar atento a futuras oportunidades en Liverpool.";


// ======================================================
// UTILIDADES DE FECHA
// ======================================================

function edatFechaDemo(diasDespues) {

    const fecha = new Date(`${EDAT_FECHA_BASE}T09:00:00`);

    fecha.setDate(fecha.getDate() + diasDespues);

    return fecha.toISOString().slice(0, 10);

}


function edatFechaLarga(iso) {

    if (!iso) {
        return "Sin fecha";
    }

    const fecha = new Date(`${iso}T09:00:00`);

    if (Number.isNaN(fecha.getTime())) {
        return iso;
    }

    return fecha.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


function edatAhora() {

    return new Date().toISOString();

}


// ======================================================
// ESTADO INICIAL
// ======================================================

function edatEstadoInicial() {

    return {

        version: 1,

        etapa: "requisicion",

        vacante: {
            folio: "REQ-2841",
            titulo: "",
            estado: "Por iniciar",
            detenidaPor: ""
        },

        requisicion: null,

        alineacion: {
            at: { estado: "Pendiente", noNegociables: [], fecha: null },
            hm: { estado: "Pendiente", fecha: null }
        },

        // Sólo guardamos lo que cambia respecto a candidatos-db.js.
        candidatos: {},

        evaluacionesEnviadas: false,

        seleccionHM: [],

        finalista: null,

        oferta: null,

        incorporacion: null,

        notificaciones: [],

        secuencia: 1

    };

}


// ======================================================
// PERSISTENCIA
// ======================================================

let edatEstado = edatCargarEstado();

const edatSuscriptores = [];


function edatCargarEstado() {

    try {

        const crudo = localStorage.getItem(EDAT_LLAVE_FLUJO);

        if (!crudo) {
            return edatEstadoInicial();
        }

        const guardado = JSON.parse(crudo);

        // Mezcla superficial para tolerar versiones anteriores.
        return { ...edatEstadoInicial(), ...guardado };

    }
    catch (error) {

        console.warn("No se pudo leer el flujo guardado. Se reinicia.", error);

        return edatEstadoInicial();

    }

}


function edatGuardarEstado() {

    localStorage.setItem(
        EDAT_LLAVE_FLUJO,
        JSON.stringify(edatEstado)
    );

    edatSuscriptores.forEach(fn => fn(edatEstado));

}


// Sincroniza pestañas abiertas con distintos actores.
window.addEventListener("storage", evento => {

    if (evento.key !== EDAT_LLAVE_FLUJO) {
        return;
    }

    edatEstado = edatCargarEstado();

    edatSuscriptores.forEach(fn => fn(edatEstado));

});


// ======================================================
// BASE DE CANDIDATOS (SOLO LECTURA DESDE candidatos-db.js)
// ======================================================

function edatBase() {

    return typeof CANDIDATOS_RAW_DB !== "undefined"
        ? CANDIDATOS_RAW_DB
        : [];

}


function edatCrudo(id) {

    return edatBase().find(candidato => candidato.id === Number(id)) || null;

}


// Los 6 candidatos que la BD marca como "En Proceso" son los
// únicos que entran al flujo activo. El Finalista y los
// Descartados iniciales se conservan tal cual.
function edatCandidatosActivos() {

    return edatBase().filter(
        candidato => candidato.status_proceso === EDAT_ESTADOS.EN_PROCESO
    );

}


function edatFlujoCandidato(id) {

    const clave = String(id);

    if (!edatEstado.candidatos[clave]) {

        edatEstado.candidatos[clave] = {
            estado: null,
            entrevistaAT: null,
            evaluacionAT: null,
            entrevistaHM: null,
            cierre: null
        };

    }

    return edatEstado.candidatos[clave];

}


function edatEstadoCandidato(id) {

    const flujo = edatEstado.candidatos[String(id)];

    if (flujo && flujo.estado) {
        return flujo.estado;
    }

    const crudo = edatCrudo(id);

    return crudo ? crudo.status_proceso : EDAT_ESTADOS.EN_PROCESO;

}


// Vista combinada: datos de la BD + lo que el flujo haya cambiado.
function edatCandidato(id) {

    const crudo = edatCrudo(id);

    if (!crudo) {
        return null;
    }

    const flujo = edatEstado.candidatos[String(id)] || {};

    return {
        ...crudo,
        estado: edatEstadoCandidato(id),
        entrevistaAT: flujo.entrevistaAT || null,
        evaluacionAT: flujo.evaluacionAT || null,
        entrevistaHM: flujo.entrevistaHM || null,
        cierre: flujo.cierre || null
    };

}


function edatCandidatos() {

    return edatBase().map(candidato => edatCandidato(candidato.id));

}


// ======================================================
// NOTIFICACIONES
// ======================================================

function edatNotificar(actores, titulo, mensaje, opciones = {}) {

    const destino = Array.isArray(actores) ? actores : [actores];

    destino.forEach(actor => {

        edatEstado.notificaciones.unshift({
            id: `n${edatEstado.secuencia++}`,
            actor,
            candidatoId: opciones.candidatoId ?? null,
            nivel: opciones.nivel || "info",
            titulo,
            mensaje,
            fecha: edatAhora(),
            leida: false
        });

    });

}


function edatNotificaciones(actor, candidatoId = null) {

    return edatEstado.notificaciones.filter(nota => {

        if (nota.actor !== actor) {
            return false;
        }

        if (actor !== "candidato") {
            return true;
        }

        return nota.candidatoId === null
            || Number(nota.candidatoId) === Number(candidatoId);

    });

}


function edatNoLeidas(actor, candidatoId = null) {

    return edatNotificaciones(actor, candidatoId).filter(nota => !nota.leida).length;

}


function edatMarcarLeidas(actor, candidatoId = null) {

    edatNotificaciones(actor, candidatoId).forEach(nota => {
        nota.leida = true;
    });

    edatGuardarEstado();

}


function edatTiempoRelativo(iso) {

    const minutos = Math.max(
        0,
        Math.round((Date.now() - new Date(iso).getTime()) / 60000)
    );

    if (minutos < 1) {
        return "Hace un momento";
    }

    if (minutos < 60) {
        return `Hace ${minutos} min`;
    }

    const horas = Math.round(minutos / 60);

    if (horas < 24) {
        return `Hace ${horas} h`;
    }

    return `Hace ${Math.round(horas / 24)} día(s)`;

}


// ======================================================
// CONTROL DE ETAPAS
// ======================================================

function edatIndiceEtapa(etapa = edatEstado.etapa) {

    return EDAT_ETAPAS.indexOf(etapa);

}


function edatEtapaAlcanzada(etapa) {

    return edatIndiceEtapa() >= EDAT_ETAPAS.indexOf(etapa);

}


function edatAvanzarA(etapa) {

    if (edatIndiceEtapa(etapa) > edatIndiceEtapa()) {
        edatEstado.etapa = etapa;
    }

}


function edatVacanteDetenida() {

    return edatEstado.alineacion.at.estado === "Declinada"
        || edatEstado.alineacion.hm.estado === "Declinada";

}


function edatVacanteCerrada() {

    return edatEstado.etapa === "finalizado";

}


function edatProcesoBloqueado() {

    if (edatVacanteCerrada()) {
        return edatResultado(false, "La vacante ya está cubierta. El proceso no puede continuar.");
    }

    if (edatVacanteDetenida()) {
        return edatResultado(false, "El proceso está detenido y no puede avanzar.");
    }

    return null;

}


// Traduce el estado interno a las 6 etapas que muestran las vistas.
function edatEtapasVacante() {

    const indiceActual = edatIndiceEtapa();

    return EDAT_ETAPAS_VACANTE.map((etapa, posicion) => {

        const indices = etapa.internas.map(clave => EDAT_ETAPAS.indexOf(clave));

        const inicio = Math.min(...indices);
        const fin = Math.max(...indices);

        let estado = "pendiente";

        if (indiceActual > fin) {
            estado = "completada";
        }
        else if (indiceActual >= inicio) {
            estado = "en-curso";
        }

        if (edatVacanteDetenida() && estado === "en-curso") {
            estado = "detenida";
        }

        return {
            ...etapa,
            numero: posicion + 1,
            estado,
            transcurrido: estado === "completada"
                ? etapa.sla
                : estado === "pendiente"
                    ? 0
                    : Math.max(1, etapa.sla - 1)
        };

    });

}


function edatResultado(ok, mensaje) {

    return { ok, mensaje };

}


// ======================================================
// ETAPA 1 · REQUISICIÓN (HRBP)
// ======================================================

function edatEnviarRequisicion(datos) {

    const bloqueo = edatProcesoBloqueado();

    if (bloqueo) {
        return bloqueo;
    }

    if (edatEstado.requisicion) {
        return edatResultado(false, "La requisición ya fue enviada.");
    }

    edatEstado.requisicion = {
        ...datos,
        fecha: edatFechaDemo(0),
        enviadaEn: edatAhora()
    };

    edatEstado.vacante.titulo = datos.titulo;
    edatEstado.vacante.estado = "Abierta";

    edatAvanzarA("alineacion");

    edatNotificar(
        ["at", "hm"],
        "Nueva requisición pendiente de alineación",
        `HRBP envió la requisición de ${datos.titulo}. Revisa los requisitos y registra tu decisión.`,
        { nivel: "critica" }
    );

    edatNotificar(
        "hrbp",
        "Requisición enviada",
        `La requisición de ${datos.titulo} fue enviada a Atracción de Talento y Hiring Manager.`
    );

    edatGuardarEstado();

    return edatResultado(true, "Requisición enviada a Atracción de Talento y Hiring Manager.");

}


// ======================================================
// ETAPA 2 · ALINEACIÓN (AT + HM)
// ======================================================

function edatRevisarAlineacion() {

    const at = edatEstado.alineacion.at.estado === "Aceptada";
    const hm = edatEstado.alineacion.hm.estado === "Aceptada";

    if (at && hm) {

        edatAvanzarA("busqueda");

        edatNotificar(
            ["hrbp", "at", "hm"],
            "Vacante alineada",
            "Atracción de Talento y Hiring Manager aceptaron la requisición. La vacante pasa a búsqueda."
        );

        // La búsqueda ya está resuelta por la base de candidatos:
        // los 6 perfiles En Proceso quedan disponibles de inmediato.
        edatAvanzarA("entrevistas_at");

        const activos = edatCandidatosActivos();

        activos.forEach((candidato, indice) => {

            const flujo = edatFlujoCandidato(candidato.id);

            if (!flujo.entrevistaAT) {

                flujo.entrevistaAT = {
                    estado: "Pendiente",
                    fecha: edatFechaDemo(5 + Math.floor(indice / 2)),
                    hora: indice % 2 === 0 ? "10:00 h" : "12:30 h"
                };

            }

        });

        edatNotificar(
            "at",
            "Búsqueda concluida",
            `${activos.length} candidatos En Proceso están listos para entrevista de Atracción de Talento.`
        );

        edatNotificar(
            "hm",
            "Perfiles disponibles para consulta",
            `Ya puedes revisar los ${activos.length} perfiles que entraron al proceso mientras AT realiza las entrevistas.`
        );

    }

}


function edatAtAceptarAlineacion(noNegociables) {

    const bloqueo = edatProcesoBloqueado();

    if (bloqueo) {
        return bloqueo;
    }

    if (!edatEstado.requisicion) {
        return edatResultado(false, "Todavía no hay requisición enviada por HRBP.");
    }

    if (edatEstado.alineacion.at.estado !== "Pendiente") {
        return edatResultado(false, "Atracción de Talento ya registró su decisión.");
    }

    const limpios = (noNegociables || [])
        .map(item => String(item).trim())
        .filter(Boolean);

    if (limpios.length === 0) {
        return edatResultado(false, "Define al menos un requisito no negociable.");
    }

    edatEstado.alineacion.at = {
        estado: "Aceptada",
        noNegociables: limpios,
        fecha: edatFechaDemo(1)
    };

    edatNotificar(
        "hm",
        "Alineación recibida de Atracción de Talento",
        "AT aceptó el perfil y definió los requisitos no negociables. Revisa y registra tu decisión."
    );

    edatNotificar(
        "hrbp",
        "Atracción de Talento aceptó la requisición",
        `AT definió ${limpios.length} requisito(s) no negociable(s) y envió la alineación al Hiring Manager.`
    );

    edatRevisarAlineacion();

    edatGuardarEstado();

    return edatResultado(true, "Perfil aceptado y alineación enviada al Hiring Manager.");

}


function edatAtDeclinar() {

    if (edatVacanteCerrada()) {
        return edatResultado(false, "La vacante ya está cubierta. El proceso no puede continuar.");
    }

    if (!edatEstado.requisicion) {
        return edatResultado(false, "Todavía no hay requisición enviada por HRBP.");
    }

    if (edatEstado.alineacion.at.estado !== "Pendiente") {
        return edatResultado(false, "Atracción de Talento ya registró su decisión.");
    }

    edatEstado.alineacion.at = {
        estado: "Declinada",
        noNegociables: [],
        fecha: edatFechaDemo(1)
    };

    edatEstado.vacante.estado = "Detenida";
    edatEstado.vacante.detenidaPor = "Atracción de Talento";

    edatNotificar(
        "hrbp",
        "Atracción de Talento declinó la requisición",
        "El proceso queda detenido. La vacante no puede avanzar a alineación con Hiring Manager.",
        { nivel: "critica" }
    );

    edatNotificar(
        "hm",
        "Requisición declinada por Atracción de Talento",
        "El proceso quedó detenido. No es posible continuar con la alineación."
    );

    edatGuardarEstado();

    return edatResultado(true, "Requisición declinada. HRBP fue notificado.");

}


function edatHmAceptarRequisitos() {

    const bloqueo = edatProcesoBloqueado();

    if (bloqueo) {
        return bloqueo;
    }

    if (edatEstado.alineacion.at.estado !== "Aceptada") {
        return edatResultado(false, "Atracción de Talento aún no envía la alineación.");
    }

    if (edatEstado.alineacion.hm.estado !== "Pendiente") {
        return edatResultado(false, "Ya registraste tu decisión sobre esta requisición.");
    }

    edatEstado.alineacion.hm = {
        estado: "Aceptada",
        fecha: edatFechaDemo(2)
    };

    edatNotificar(
        "hrbp",
        "Hiring Manager aceptó los requisitos",
        "El Hiring Manager validó los requisitos de la vacante."
    );

    edatNotificar(
        "at",
        "Hiring Manager aceptó los requisitos",
        "Puedes iniciar las entrevistas de Atracción de Talento."
    );

    edatRevisarAlineacion();

    edatGuardarEstado();

    return edatResultado(true, "Requisitos aceptados. La vacante queda alineada.");

}


function edatHmDeclinar() {

    if (edatVacanteCerrada()) {
        return edatResultado(false, "La vacante ya está cubierta. El proceso no puede continuar.");
    }

    if (edatEstado.alineacion.at.estado !== "Aceptada") {
        return edatResultado(false, "Atracción de Talento aún no envía la alineación.");
    }

    if (edatEstado.alineacion.hm.estado !== "Pendiente") {
        return edatResultado(false, "Ya registraste tu decisión sobre esta requisición.");
    }

    edatEstado.alineacion.hm = {
        estado: "Declinada",
        fecha: edatFechaDemo(2)
    };

    edatEstado.vacante.estado = "Detenida";
    edatEstado.vacante.detenidaPor = "Hiring Manager";

    edatNotificar(
        "hrbp",
        "Hiring Manager declinó la requisición",
        "El proceso queda detenido y la vacante no puede avanzar a búsqueda.",
        { nivel: "critica" }
    );

    edatNotificar(
        "at",
        "Requisición declinada por Hiring Manager",
        "El proceso quedó detenido. No es posible avanzar a búsqueda."
    );

    edatGuardarEstado();

    return edatResultado(true, "Requisición declinada. HRBP fue notificado.");

}


// ======================================================
// ETAPA 4 · ENTREVISTAS Y EVALUACIÓN DE AT
// ======================================================

function edatAtFinalizarEntrevista(id) {

    const bloqueo = edatProcesoBloqueado();

    if (bloqueo) {
        return bloqueo;
    }

    if (!edatEtapaAlcanzada("entrevistas_at")) {
        return edatResultado(false, "La vacante todavía no llega a la etapa de entrevistas.");
    }

    const flujo = edatFlujoCandidato(id);

    if (!flujo.entrevistaAT) {
        return edatResultado(false, "Este candidato no forma parte del flujo activo.");
    }

    if (flujo.entrevistaAT.estado === "Finalizada") {
        return edatResultado(false, "La entrevista ya estaba marcada como finalizada.");
    }

    flujo.entrevistaAT.estado = "Finalizada";

    edatGuardarEstado();

    return edatResultado(true, "Entrevista marcada como finalizada.");

}


function edatAtGuardarEvaluacion(id, evaluacion) {

    const bloqueo = edatProcesoBloqueado();

    if (bloqueo) {
        return bloqueo;
    }

    const flujo = edatFlujoCandidato(id);

    if (!flujo.entrevistaAT) {
        return edatResultado(false, "Este candidato no forma parte del flujo activo.");
    }

    if (flujo.entrevistaAT.estado !== "Finalizada") {
        return edatResultado(false, "Marca la entrevista como finalizada antes de evaluar.");
    }

    if (edatEstado.evaluacionesEnviadas) {
        return edatResultado(false, "Las evaluaciones ya fueron enviadas al Hiring Manager.");
    }

    const hard = Number(evaluacion.hard);
    const soft = Number(evaluacion.soft);

    if (!(hard >= 1 && hard <= 5) || !(soft >= 1 && soft <= 5)) {
        return edatResultado(false, "Las ponderaciones deben estar entre 1 y 5.");
    }

    flujo.evaluacionAT = {
        hard,
        soft,
        comentario: (evaluacion.comentario || "").trim(),
        fecha: flujo.entrevistaAT.fecha
    };

    edatGuardarEstado();

    return edatResultado(true, "Evaluación registrada.");

}


function edatEvaluacionesPendientes() {

    return edatCandidatosActivos().filter(candidato => {

        const flujo = edatEstado.candidatos[String(candidato.id)];

        return !flujo || !flujo.evaluacionAT;

    });

}


function edatAtEnviarEvaluaciones() {

    const bloqueo = edatProcesoBloqueado();

    if (bloqueo) {
        return bloqueo;
    }

    if (edatEstado.evaluacionesEnviadas) {
        return edatResultado(false, "Las evaluaciones ya fueron enviadas.");
    }

    const pendientes = edatEvaluacionesPendientes();

    if (pendientes.length > 0) {
        return edatResultado(
            false,
            `Faltan ${pendientes.length} evaluación(es) por registrar.`
        );
    }

    edatEstado.evaluacionesEnviadas = true;

    edatAvanzarA("seleccion_hm");

    const total = edatCandidatosActivos().length;

    edatNotificar(
        "hm",
        `Evaluaciones de ${total} candidatos recibidas`,
        "Atracción de Talento envió las evaluaciones. Ya puedes seleccionar a los 4 candidatos que pasarán a entrevista contigo.",
        { nivel: "critica" }
    );

    edatNotificar(
        "hrbp",
        "Atracción de Talento concluyó sus entrevistas",
        `Las evaluaciones de los ${total} candidatos fueron enviadas al Hiring Manager.`
    );

    edatGuardarEstado();

    return edatResultado(true, `Evaluaciones de ${total} candidatos enviadas al Hiring Manager.`);

}


// ======================================================
// ETAPA 5 · SELECCIÓN Y ENTREVISTAS DE HM
// ======================================================

function edatMotivoCierre(candidato) {

    const noNegociables = edatEstado.alineacion.at.noNegociables || [];

    const escolaridad = (candidato.escolaridad || "").toLowerCase();

    if (escolaridad.includes("estudiante")) {
        return EDAT_MOTIVOS_CIERRE[0];
    }

    const texto = [
        candidato.resumen_profesional,
        candidato.otros_estudios,
        candidato.assessfirst?.fortalezas
    ]
        .join(" ")
        .toLowerCase();

    const faltante = noNegociables.find(
        requisito => !texto.includes(String(requisito).toLowerCase())
    );

    if (faltante) {
        return EDAT_MOTIVOS_CIERRE[1];
    }

    const compatibilidad = Number(
        String(candidato.assessfirst?.compatibilidad || "0").replace("%", "")
    );

    if (compatibilidad < 90) {
        return EDAT_MOTIVOS_CIERRE[2];
    }

    return EDAT_MOTIVOS_CIERRE[3];

}


function edatCerrarProceso(id, fecha) {

    const candidato = edatCrudo(id);
    const flujo = edatFlujoCandidato(id);

    flujo.estado = EDAT_ESTADOS.NO_SELECCIONADO;

    flujo.cierre = {
        motivo: edatMotivoCierre(candidato),
        fecha
    };

    edatNotificar(
        "candidato",
        "Tu proceso ha concluido",
        EDAT_MENSAJE_CIERRE_CANDIDATO,
        { candidatoId: id }
    );

}


function edatHmSeleccionarCuatro(ids) {

    const bloqueo = edatProcesoBloqueado();

    if (bloqueo) {
        return bloqueo;
    }

    if (!edatEstado.evaluacionesEnviadas) {
        return edatResultado(false, "Atracción de Talento aún no envía las evaluaciones.");
    }

    if (edatEstado.seleccionHM.length > 0) {
        return edatResultado(false, "La selección de candidatos ya fue enviada.");
    }

    const activos = edatCandidatosActivos().map(candidato => candidato.id);

    const seleccion = [...new Set(ids.map(Number))].filter(id => activos.includes(id));

    if (seleccion.length !== 4) {
        return edatResultado(false, "Debes seleccionar exactamente 4 candidatos.");
    }

    edatEstado.seleccionHM = seleccion;

    seleccion.forEach((id, indice) => {

        const flujo = edatFlujoCandidato(id);

        flujo.entrevistaHM = {
            estado: "Pendiente",
            fecha: edatFechaDemo(11 + Math.floor(indice / 2)),
            hora: indice % 2 === 0 ? "10:00 h" : "13:00 h"
        };

    });

    // Los dos candidatos que no avanzan cierran su proceso aquí.
    activos
        .filter(id => !seleccion.includes(id))
        .forEach(id => edatCerrarProceso(id, edatFechaDemo(10)));

    edatAvanzarA("entrevistas_hm");

    edatNotificar(
        "at",
        "Hiring Manager seleccionó a 4 candidatos",
        "Los 4 perfiles pasan a entrevista con Hiring Manager. Los 2 restantes quedaron como no seleccionados."
    );

    edatNotificar(
        "hrbp",
        "Selección del Hiring Manager registrada",
        "4 candidatos avanzan a entrevista con Hiring Manager y 2 cerraron su proceso."
    );

    edatGuardarEstado();

    return edatResultado(true, "4 candidatos enviados a entrevista con Hiring Manager.");

}


function edatHmFinalizarEntrevista(id) {

    const bloqueo = edatProcesoBloqueado();

    if (bloqueo) {
        return bloqueo;
    }

    const flujo = edatFlujoCandidato(id);

    if (!flujo.entrevistaHM) {
        return edatResultado(false, "Este candidato no tiene entrevista asignada contigo.");
    }

    if (flujo.entrevistaHM.estado === "Finalizada") {
        return edatResultado(false, "La entrevista ya estaba marcada como finalizada.");
    }

    flujo.entrevistaHM.estado = "Finalizada";

    edatNotificar(
        "at",
        "Entrevista con Hiring Manager finalizada",
        `${edatCrudo(id).nombre} concluyó su entrevista con el Hiring Manager.`
    );

    edatGuardarEstado();

    return edatResultado(true, "Entrevista con Hiring Manager marcada como finalizada.");

}


function edatEntrevistasHmPendientes() {

    return edatEstado.seleccionHM.filter(id => {

        const flujo = edatEstado.candidatos[String(id)];

        return !flujo || !flujo.entrevistaHM || flujo.entrevistaHM.estado !== "Finalizada";

    });

}


function edatHmSeleccionarFinalista(id) {

    const bloqueo = edatProcesoBloqueado();

    if (bloqueo) {
        return bloqueo;
    }

    if (edatEstado.finalista) {
        return edatResultado(false, "Ya existe un candidato seleccionado para esta vacante.");
    }

    if (!edatEstado.seleccionHM.includes(Number(id))) {
        return edatResultado(false, "El candidato no forma parte de tus 4 entrevistas.");
    }

    if (edatEntrevistasHmPendientes().length > 0) {
        return edatResultado(false, "Finaliza las 4 entrevistas antes de decidir.");
    }

    edatEstado.finalista = Number(id);

    const flujo = edatFlujoCandidato(id);

    flujo.estado = EDAT_ESTADOS.FINALISTA;

    const candidato = edatCrudo(id);

    edatNotificar(
        "hrbp",
        "Hiring Manager seleccionó al candidato final",
        `${candidato.nombre} fue seleccionado. Ya puedes generar la oferta.`,
        { nivel: "critica" }
    );

    edatNotificar(
        "at",
        "Candidato final seleccionado",
        `${candidato.nombre} fue seleccionado por el Hiring Manager.`
    );

    edatAvanzarA("oferta");

    edatGuardarEstado();

    return edatResultado(true, `${candidato.nombre} fue seleccionado y HRBP quedó notificado.`);

}


function edatHmCerrarNoSeleccionados() {

    const bloqueo = edatProcesoBloqueado();

    if (bloqueo) {
        return bloqueo;
    }

    if (!edatEstado.finalista) {
        return edatResultado(false, "Primero selecciona al candidato final.");
    }

    const restantes = edatEstado.seleccionHM.filter(
        id => id !== edatEstado.finalista
            && edatEstadoCandidato(id) !== EDAT_ESTADOS.NO_SELECCIONADO
    );

    if (restantes.length === 0) {
        return edatResultado(false, "Los procesos de los demás candidatos ya están cerrados.");
    }

    restantes.forEach(id => edatCerrarProceso(id, edatFechaDemo(13)));

    edatNotificar(
        "hrbp",
        "Procesos cerrados de candidatos no seleccionados",
        `${restantes.length} candidato(s) quedaron como no seleccionados con su motivo registrado.`
    );

    edatNotificar(
        "at",
        "Procesos cerrados de candidatos no seleccionados",
        `${restantes.length} candidato(s) fueron notificados del cierre de su proceso.`
    );

    edatGuardarEstado();

    return edatResultado(true, `${restantes.length} proceso(s) cerrados y notificados.`);

}


// ======================================================
// ETAPA 6 · OFERTA, ACEPTACIÓN E INCORPORACIÓN
// ======================================================

function edatHrbpEnviarOferta(datos) {

    const bloqueo = edatProcesoBloqueado();

    if (bloqueo) {
        return bloqueo;
    }

    if (!edatEstado.finalista) {
        return edatResultado(false, "Todavía no hay candidato seleccionado por el Hiring Manager.");
    }

    if (edatEstado.oferta) {
        return edatResultado(false, "La oferta ya fue enviada al candidato.");
    }

    const candidato = edatCrudo(edatEstado.finalista);

    edatEstado.oferta = {
        ...datos,
        candidatoId: edatEstado.finalista,
        fecha: edatFechaDemo(15),
        estado: "Enviada",
        disponibilidad: "",
        aceptadaEn: null
    };

    edatFlujoCandidato(edatEstado.finalista).estado = EDAT_ESTADOS.OFERTA_ENVIADA;

    edatNotificar(
        "candidato",
        "Oferta recibida",
        `Recibiste una oferta para la vacante ${edatEstado.requisicion.titulo}. Consulta los detalles y confirma tu disponibilidad de ingreso.`,
        { candidatoId: edatEstado.finalista, nivel: "critica" }
    );

    edatNotificar(
        "at",
        "Oferta enviada al candidato seleccionado",
        `HRBP envió la oferta a ${candidato.nombre}.`
    );

    edatNotificar(
        "hm",
        "Oferta enviada al candidato seleccionado",
        `HRBP envió la oferta a ${candidato.nombre}.`
    );

    edatNotificar(
        "hrbp",
        "Oferta registrada",
        `La oferta para ${candidato.nombre} quedó enviada.`
    );

    edatGuardarEstado();

    return edatResultado(true, `Oferta enviada a ${candidato.nombre}.`);

}


function edatCandidatoAceptarOferta(disponibilidad) {

    const bloqueo = edatProcesoBloqueado();

    if (bloqueo) {
        return bloqueo;
    }

    if (!edatEstado.oferta) {
        return edatResultado(false, "No hay una oferta disponible.");
    }

    if (edatEstado.oferta.estado === "Aceptada") {
        return edatResultado(false, "Ya aceptaste esta oferta.");
    }

    const fecha = (disponibilidad || "").trim();

    if (fecha === "") {
        return edatResultado(false, "Confirma tu disponibilidad de ingreso.");
    }

    edatEstado.oferta.estado = "Aceptada";
    edatEstado.oferta.disponibilidad = fecha;
    edatEstado.oferta.aceptadaEn = edatAhora();

    edatFlujoCandidato(edatEstado.finalista).estado = EDAT_ESTADOS.OFERTA_ACEPTADA;

    edatAvanzarA("aceptacion");
    edatAvanzarA("incorporacion");

    const candidato = edatCrudo(edatEstado.finalista);

    edatNotificar(
        "at",
        "El candidato aceptó la oferta",
        `${candidato.nombre} aceptó la oferta y confirmó su disponibilidad de ingreso: ${fecha}. Confirma su incorporación para cerrar el proceso.`,
        { nivel: "critica" }
    );

    edatNotificar(
        "hrbp",
        "Oferta aceptada",
        `${candidato.nombre} aceptó la oferta y confirmó disponibilidad de ingreso: ${fecha}.`
    );

    edatNotificar(
        "hm",
        "Oferta aceptada",
        `${candidato.nombre} aceptó la oferta de la vacante.`
    );

    edatNotificar(
        "candidato",
        "Aceptaste la oferta",
        `Registramos tu aceptación y tu disponibilidad de ingreso: ${fecha}.`,
        { candidatoId: edatEstado.finalista }
    );

    edatGuardarEstado();

    return edatResultado(true, "Oferta aceptada y disponibilidad confirmada.");

}


function edatAtConfirmarIncorporacion() {

    if (edatVacanteCerrada()) {
        return edatResultado(false, "La vacante ya está cubierta. El proceso no puede continuar.");
    }

    if (!edatEstado.oferta || edatEstado.oferta.estado !== "Aceptada") {
        return edatResultado(false, "El candidato todavía no acepta la oferta.");
    }

    if (edatEstado.incorporacion) {
        return edatResultado(false, "La incorporación ya fue confirmada.");
    }

    const candidato = edatCrudo(edatEstado.finalista);

    edatEstado.incorporacion = {
        candidatoId: edatEstado.finalista,
        fecha: edatFechaDemo(30),
        confirmadaEn: edatAhora()
    };

    edatFlujoCandidato(edatEstado.finalista).estado = EDAT_ESTADOS.INCORPORADO;

    edatEstado.vacante.estado = "Cubierta";

    edatAvanzarA("finalizado");

    edatNotificar(
        "hrbp",
        "Proceso finalizado",
        "El proceso de la vacante ha finalizado. El candidato seleccionado fue incorporado."
    );

    edatNotificar(
        "hm",
        "Proceso finalizado",
        "El candidato seleccionado ha sido incorporado. El proceso de selección ha finalizado."
    );

    edatNotificar(
        "candidato",
        "Proceso finalizado",
        "Tu proceso ha finalizado y tu incorporación ha sido registrada.",
        { candidatoId: edatEstado.finalista }
    );

    edatNotificar(
        "at",
        "Vacante cubierta",
        `${candidato.nombre} quedó incorporado. La vacante está cerrada.`
    );

    edatGuardarEstado();

    return edatResultado(true, "Incorporación confirmada. La vacante quedó cubierta.");

}


// ======================================================
// SESIÓN
// ======================================================

function edatSesion() {

    try {

        return JSON.parse(localStorage.getItem(EDAT_LLAVE_SESION)) || null;

    }
    catch (error) {

        return null;

    }

}


function edatCerrarSesion() {

    localStorage.removeItem(EDAT_LLAVE_SESION);

    window.location.href = "login.html";

}


// Identifica al candidato que está viendo su portal.
// Si el correo coincide con la base se usa ese registro; si no,
// se muestra el candidato que lleva el proceso activo.
function edatCandidatoDeSesion() {

    const sesion = edatSesion();

    const correo = (sesion?.email || "").trim().toLowerCase();

    if (correo && typeof CANDIDATOS_CREDENCIALES !== "undefined") {

        const credencial = CANDIDATOS_CREDENCIALES.find(
            item => item.email === correo
        );

        if (credencial) {
            return edatCandidato(credencial.id);
        }

    }

    if (edatEstado.finalista) {
        return edatCandidato(edatEstado.finalista);
    }

    const activos = edatCandidatosActivos().map(candidato => edatCandidato(candidato.id));

    const vigente = activos.find(candidato => candidato.estado === EDAT_ESTADOS.EN_PROCESO);

    if (vigente) {
        return vigente;
    }

    return activos[0] || null;

}


// ======================================================
// API PÚBLICA
// ======================================================

const EDAT = {

    ESTADOS: EDAT_ESTADOS,
    ETAPAS: EDAT_ETAPAS,
    ACTORES: EDAT_ACTORES,
    MOTIVOS_CIERRE: EDAT_MOTIVOS_CIERRE,
    MENSAJE_CIERRE_CANDIDATO: EDAT_MENSAJE_CIERRE_CANDIDATO,

    // Lectura
    estado: () => edatEstado,
    etapa: () => edatEstado.etapa,
    etapaAlcanzada: edatEtapaAlcanzada,
    etapasVacante: edatEtapasVacante,
    vacanteDetenida: edatVacanteDetenida,
    vacanteCerrada: edatVacanteCerrada,

    candidatos: edatCandidatos,
    candidato: edatCandidato,
    candidatosActivos: () => edatCandidatosActivos().map(c => edatCandidato(c.id)),
    estadoCandidato: edatEstadoCandidato,
    evaluacionesPendientes: () => edatEvaluacionesPendientes().map(c => edatCandidato(c.id)),
    entrevistasHmPendientes: edatEntrevistasHmPendientes,

    // Notificaciones
    notificaciones: edatNotificaciones,
    noLeidas: edatNoLeidas,
    marcarLeidas: edatMarcarLeidas,
    tiempoRelativo: edatTiempoRelativo,

    // Acciones por actor
    enviarRequisicion: edatEnviarRequisicion,
    atAceptarAlineacion: edatAtAceptarAlineacion,
    atDeclinar: edatAtDeclinar,
    hmAceptarRequisitos: edatHmAceptarRequisitos,
    hmDeclinar: edatHmDeclinar,
    atFinalizarEntrevista: edatAtFinalizarEntrevista,
    atGuardarEvaluacion: edatAtGuardarEvaluacion,
    atEnviarEvaluaciones: edatAtEnviarEvaluaciones,
    hmSeleccionarCuatro: edatHmSeleccionarCuatro,
    hmFinalizarEntrevista: edatHmFinalizarEntrevista,
    hmSeleccionarFinalista: edatHmSeleccionarFinalista,
    hmCerrarNoSeleccionados: edatHmCerrarNoSeleccionados,
    hrbpEnviarOferta: edatHrbpEnviarOferta,
    candidatoAceptarOferta: edatCandidatoAceptarOferta,
    atConfirmarIncorporacion: edatAtConfirmarIncorporacion,

    // Utilidades
    fecha: edatFechaLarga,
    fechaDemo: edatFechaDemo,
    sesion: edatSesion,
    cerrarSesion: edatCerrarSesion,
    candidatoDeSesion: edatCandidatoDeSesion,

    suscribir(fn) {
        edatSuscriptores.push(fn);
    },

    reiniciar() {
        edatEstado = edatEstadoInicial();
        edatGuardarEstado();
    }

};
