// Lógica del módulo Hiring Manager: alineación, selección de candidatos,
// entrevistas propias y decisión final.
//
// Los candidatos provienen de candidatos-db.js a través de edat-flow.js.
// Este módulo no guarda datos propios de candidatos.

const HM_ACTOR = "hm";
const HM_MAX_SELECCION = 4;

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
        .filter(Boolean)
        .slice(0, 2)
        .map(parte => parte[0])
        .join("")
        .toUpperCase();

const hmDinero = valor =>
    typeof valor === "number"
        ? new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            maximumFractionDigits: 0
        }).format(valor)
        : "No especificado";

const hmCompatibilidad = candidato =>
    Number(String(candidato.assessfirst?.compatibilidad || "0").replace("%", "")) || 0;

const hmCandidato = id => EDAT.candidato(Number(id));

const hmClaseEstado = estado => {

    if (estado === EDAT.ESTADOS.FINALISTA || estado === EDAT.ESTADOS.INCORPORADO) {
        return "finalista";
    }

    if (
        estado === EDAT.ESTADOS.DESCARTADO
        || estado === EDAT.ESTADOS.NO_SELECCIONADO
    ) {
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


// Ejecuta una acción del flujo y avisa el resultado con el toast de siempre.
function hmEjecutar(accion) {

    const resultado = accion();

    hmToast(resultado.mensaje);

    return resultado.ok;

}


// ===== Encabezado, notificaciones y banner =====

function hmRenderVacante() {

    const estado = EDAT.estado();

    hmEl("hm-vacancy-folio").textContent = `VACANTE ACTIVA · ${HM_VACANTE.folio}`;

    hmEl("hm-vacancy-title").textContent =
        estado.requisicion?.titulo || "Sin requisición recibida";

    hmEl("hm-vacancy-meta").textContent =
        `${HM_VACANTE.area} · ${HM_VACANTE.ubicacion} · ${HM_VACANTE.nivel} · Reclutadora: ${HM_VACANTE.reclutador}`;

    hmEl("hm-user-initials").textContent = hmIniciales(HM_USUARIO.nombre);
    hmEl("hm-user-name").textContent = HM_USUARIO.nombre;
    hmEl("hm-user-role").textContent = HM_USUARIO.rol;

    const etapas = EDAT.etapasVacante();

    const consumido = etapas.reduce((total, etapa) => total + etapa.transcurrido, 0);
    const sla = etapas.reduce((total, etapa) => total + etapa.sla, 0);

    hmEl("hm-sla-pill").textContent = `${consumido} de ${sla} días hábiles consumidos`;

}


function hmRenderNotificaciones() {

    const notas = EDAT.notificaciones(HM_ACTOR);

    hmEl("hm-alerts-list").innerHTML = notas.length === 0
        ? '<p class="hm-empty">Sin notificaciones por ahora.</p>'
        : notas
            .map(
                nota => `
                    <article class="hm-alert hm-alert--${nota.nivel === "critica" ? "critica" : "info"}">
                        <h4>${nota.titulo}</h4>
                        <p>${nota.mensaje}</p>
                        <small>${EDAT.tiempoRelativo(nota.fecha)}</small>
                    </article>
                `
            )
            .join("");

    const sinLeer = EDAT.noLeidas(HM_ACTOR);
    const contador = hmEl("hm-alert-count");

    contador.textContent = sinLeer;
    contador.hidden = sinLeer === 0;

}


function hmSiguienteAccion() {

    const estado = EDAT.estado();

    if (!estado.requisicion) {
        return "Todavía no recibes la requisición de HRBP para esta vacante.";
    }

    if (EDAT.vacanteDetenida()) {
        return `El proceso está detenido: la requisición fue declinada por ${estado.vacante.detenidaPor}.`;
    }

    if (estado.alineacion.at.estado === "Pendiente") {
        return "Atracción de Talento está definiendo los requisitos no negociables.";
    }

    if (estado.alineacion.hm.estado === "Pendiente") {
        return "Revisa los requisitos de la vacante y registra tu decisión en Mis Vacantes.";
    }

    if (!estado.evaluacionesEnviadas) {
        return "Atracción de Talento está entrevistando y evaluando a los candidatos.";
    }

    if (estado.seleccionHM.length === 0) {
        return "Selecciona exactamente 4 candidatos para entrevistar en la sección Candidatos.";
    }

    if (EDAT.entrevistasHmPendientes().length > 0) {
        return `Tienes ${EDAT.entrevistasHmPendientes().length} entrevista(s) por finalizar.`;
    }

    if (!estado.finalista) {
        return "Finalizaste tus entrevistas. Selecciona al candidato con el que se cubrirá la vacante.";
    }

    if (estado.incorporacion) {
        return "El candidato seleccionado ya fue incorporado. El proceso de selección finalizó.";
    }

    return "Tu decisión está registrada. HRBP y Atracción de Talento continúan con la oferta.";

}


function hmRenderBanner() {

    hmEl("hm-banner-text").textContent = hmSiguienteAccion();
    hmEl("hm-banner").hidden = false;

}


function hmInitBanner() {

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

        if (abrir) {
            EDAT.marcarLeidas(HM_ACTOR);
        }

    };

    boton.addEventListener("click", () => alternar(panel.hidden));
    hmEl("hm-alerts-close").addEventListener("click", () => alternar(false));

    document.addEventListener("click", evento => {

        if (!panel.hidden && !evento.target.closest(".hm-bell-wrap")) {
            alternar(false);
        }

    });

}


// ===== Timeline de la vacante =====

function hmRenderTimeline() {

    hmEl("hm-timeline").innerHTML = EDAT.etapasVacante()
        .map(etapa => {

            const accionable =
                etapa.clave === "alineacion" || etapa.clave === "entrevistas_hm";

            const clases = [
                "hm-stage",
                `hm-stage--${etapa.estado === "detenida" ? "en-curso" : etapa.estado}`,
                accionable ? "hm-stage--action" : "hm-stage--locked",
                hmState.etapaAbierta === etapa.clave ? "is-open" : ""
            ]
                .filter(Boolean)
                .join(" ");

            const marca = etapa.estado === "completada" ? "✓" : etapa.numero;

            return `
                <li>
                    <article class="${clases}" ${accionable ? `data-stage="${etapa.clave}" tabindex="0"` : ""}>
                        <div class="hm-stage__top">
                            <span class="hm-stage__number">${marca}</span>
                            <h3>${etapa.nombre}</h3>
                        </div>
                        <p class="hm-stage__owner">${etapa.responsable}</p>
                        <p class="hm-stage__time">◷ ${etapa.transcurrido}/${etapa.sla} días</p>
                        ${accionable ? '<span class="hm-stage__tag">Acción del HM</span>' : ""}
                    </article>
                </li>
            `;

        })
        .join("");

}


function hmAbrirEtapa(clave) {

    const panel = hmEl("hm-stage-panel");

    if (hmState.etapaAbierta === clave) {

        hmState.etapaAbierta = null;
        panel.hidden = true;
        hmRenderTimeline();

        return;

    }

    hmState.etapaAbierta = clave;

    hmRenderTimeline();

    if (clave === "alineacion") {

        panel.hidden = true;

        hmEl("hm-requisicion-card").scrollIntoView({ behavior: "smooth", block: "start" });
        hmEl("hm-requisicion-card").classList.add("is-highlight");

        setTimeout(() => hmEl("hm-requisicion-card").classList.remove("is-highlight"), 1800);

        return;

    }

    panel.hidden = true;

    hmSetVista("entrevistas");

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

}


// ===== Requisición y alineación =====

function hmRenderRequisicion() {

    const estado = EDAT.estado();
    const detalle = hmEl("hm-requisicion-detalle");
    const acciones = hmEl("hm-requisicion-acciones");
    const pill = hmEl("hm-requisicion-pill");

    if (!estado.requisicion) {

        detalle.innerHTML =
            '<p class="hm-empty">HRBP todavía no envía la requisición de la vacante.</p>';

        acciones.innerHTML = "";
        pill.textContent = "Pendiente";

        hmEl("hm-requisicion-sub").textContent = "Esperando la requisición de HRBP.";

        return;

    }

    const requisicion = estado.requisicion;
    const alineacionAt = estado.alineacion.at;

    const campos = [
        ["Título", requisicion.titulo],
        ["Descripción general", requisicion.descripcion],
        ["Conocimientos técnicos", requisicion.conocimientos],
        ["Hard Skills", requisicion.hardSkills],
        ["Soft Skills", requisicion.softSkills],
        ["Estudios / escolaridad", requisicion.escolaridad],
        ["Propuesta salarial", requisicion.salario],
        ["DSQ", requisicion.dsq]
    ];

    const noNegociables = alineacionAt.noNegociables.length > 0
        ? `
            <h3>Requisitos no negociables definidos por Atracción de Talento</h3>
            <ul class="hm-requisitos">
                ${alineacionAt.noNegociables.map(item => `<li><span>✓</span>${item}</li>`).join("")}
            </ul>
        `
        : '<p>Atracción de Talento todavía no envía los requisitos no negociables.</p>';

    detalle.innerHTML = `
        <div class="hm-stage-panel" style="display:block">
            <h3>Información de la vacante</h3>
            <ul class="hm-requisitos">
                ${campos
                    .map(([etiqueta, valor]) => `<li><span>·</span><strong>${etiqueta}:</strong>&nbsp;${valor}</li>`)
                    .join("")}
            </ul>
            ${noNegociables}
        </div>
    `;

    pill.textContent = estado.alineacion.hm.estado;

    hmEl("hm-requisicion-sub").textContent =
        estado.alineacion.hm.estado === "Pendiente"
            ? "Revisa los requisitos y registra tu decisión."
            : `Registraste tu decisión el ${EDAT.fecha(estado.alineacion.hm.fecha)}.`;

    const puedeDecidir =
        alineacionAt.estado === "Aceptada"
        && estado.alineacion.hm.estado === "Pendiente";

    acciones.innerHTML = puedeDecidir
        ? `
            <button class="hm-button hm-button--ghost" type="button" data-hm-declinar>
                Declinar requisición
            </button>
            <button class="hm-button hm-button--primary" type="button" data-hm-aceptar>
                Aceptar requisitos de la vacante
            </button>
        `
        : "";

}


function hmInitRequisicion() {

    hmEl("hm-requisicion-acciones").addEventListener("click", evento => {

        if (evento.target.closest("[data-hm-aceptar]")) {
            hmEjecutar(EDAT.hmAceptarRequisitos);
            return;
        }

        if (evento.target.closest("[data-hm-declinar]")) {
            hmEjecutar(EDAT.hmDeclinar);
        }

    });

}


// ===== Candidatos enviados por Atracción de Talento =====

function hmSeleccionBloqueada() {

    return EDAT.estado().seleccionHM.length > 0;

}


function hmRenderShortlist() {

    const estado = EDAT.estado();
    const candidatos = EDAT.candidatosActivos();

    if (!EDAT.etapaAlcanzada("busqueda")) {

        hmEl("hm-shortlist-counter").textContent =
            "La búsqueda inicia cuando la vacante queda alineada.";

        hmEl("hm-shortlist-pill").textContent = "En espera";

        hmEl("hm-shortlist").innerHTML =
            '<p class="hm-empty">Todavía no hay candidatos asignados a esta vacante.</p>';

        hmRenderAccionesShortlist();

        return;

    }

    hmEl("hm-shortlist-counter").textContent = estado.evaluacionesEnviadas
        ? `${candidatos.length} perfiles evaluados por Atracción de Talento · selecciona exactamente ${HM_MAX_SELECCION}.`
        : `${candidatos.length} perfiles En Proceso. Puedes consultarlos mientras AT termina sus entrevistas.`;

    hmEl("hm-shortlist-pill").textContent = hmSeleccionBloqueada()
        ? `${estado.seleccionHM.length} enviados a entrevista`
        : `${hmState.seleccionados.length} de ${HM_MAX_SELECCION} seleccionados`;

    hmEl("hm-shortlist").innerHTML = candidatos
        .map(candidato => {

                const seleccionado = hmState.seleccionados.includes(candidato.id);
                const compatibilidad = hmCompatibilidad(candidato);

                const evaluacion = candidato.evaluacionAT
                    ? `
                        <span class="hm-chip hm-chip--ok">Hard ${candidato.evaluacionAT.hard}/5</span>
                        <span class="hm-chip hm-chip--ok">Soft ${candidato.evaluacionAT.soft}/5</span>
                    `
                    : '<span class="hm-chip hm-chip--neutral">Evaluación pendiente de AT</span>';

                const cierre = candidato.cierre
                    ? `<span class="hm-chip hm-chip--no">${candidato.cierre.motivo}</span>`
                    : "";

                const marcaEnviado = estado.seleccionHM.includes(candidato.id)
                    ? '<span class="hm-chip hm-chip--ok">En entrevista contigo</span>'
                    : "";

                return `
                    <article class="hm-candidate ${seleccionado ? "is-selected" : ""}">

                        <input
                            class="compare-cb"
                            type="checkbox"
                            data-compare="${candidato.id}"
                            aria-label="Seleccionar a ${candidato.nombre}"
                            ${seleccionado ? "checked" : ""}
                            ${hmSeleccionBloqueada() || !estado.evaluacionesEnviadas ? "disabled" : ""}
                        >

                        <div class="hm-candidate__top">
                            <span class="hm-avatar">${hmIniciales(candidato.nombre)}</span>
                            <div>
                                <h3>${candidato.nombre}</h3>
                                <p>${candidato.puesto_actual} · ${candidato.empresa_actual}</p>
                            </div>
                        </div>

                        <span class="hm-status hm-status--${hmClaseEstado(candidato.estado)}">${candidato.estado}</span>

                        <div class="hm-compat">
                            <div class="hm-compat__head">
                                <span>Compatibilidad AssessFirst</span>
                                <strong>${compatibilidad}%</strong>
                            </div>
                            <progress class="hm-progress" max="100" value="${compatibilidad}"></progress>
                        </div>

                        <div class="hm-candidate__meta">
                            <span>🎓 ${candidato.escolaridad}</span>
                            <span>💰 Deseada: ${hmDinero(candidato.compensacion_deseada)}</span>
                            <span>🌐 ${candidato.idiomas}</span>
                        </div>

                        <div class="hm-verdicts">${evaluacion}${marcaEnviado}${cierre}</div>

                        <button class="hm-evaluate" type="button" data-evaluar="${candidato.id}">
                            Ver perfil completo
                        </button>

                    </article>
                `;

        })
        .join("");

    hmRenderAccionesShortlist();

}


function hmRenderAccionesShortlist() {

    const estado = EDAT.estado();
    const acciones = hmEl("hm-shortlist-acciones");

    if (!estado.evaluacionesEnviadas || hmSeleccionBloqueada()) {
        acciones.innerHTML = "";
        return;
    }

    const listo = hmState.seleccionados.length === HM_MAX_SELECCION;

    acciones.innerHTML = `
        <button
            class="hm-button hm-button--primary"
            type="button"
            data-enviar-seleccion
            ${listo ? "" : "disabled"}
        >
            Enviar ${HM_MAX_SELECCION} candidatos seleccionados a entrevista con Hiring Manager
        </button>
    `;

}


function hmToggleSeleccion(id, activo) {

    const numero = Number(id);

    if (hmSeleccionBloqueada()) {
        hmToast("La selección ya fue enviada a Atracción de Talento.");
        hmRenderShortlist();
        return;
    }

    if (activo) {

        if (hmState.seleccionados.length >= HM_MAX_SELECCION) {

            hmToast(`Debes seleccionar exactamente ${HM_MAX_SELECCION} candidatos.`);
            hmRenderShortlist();

            return;

        }

        hmState.seleccionados.push(numero);

    }
    else {

        hmState.seleccionados = hmState.seleccionados.filter(item => item !== numero);

    }

    hmRenderShortlist();
    hmRenderFab();

}


function hmRenderFab() {

    const fab = hmEl("hm-fab");
    const total = hmState.seleccionados.length;

    hmEl("hm-fab-count").textContent = total;

    fab.classList.toggle(
        "is-visible",
        total >= 2 && !hmState.arenaAbierta && hmState.vista === "candidatos"
    );

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

    hmEl("hm-shortlist-acciones").addEventListener("click", evento => {

        if (!evento.target.closest("[data-enviar-seleccion]")) {
            return;
        }

        if (hmEjecutar(() => EDAT.hmSeleccionarCuatro(hmState.seleccionados))) {
            hmSetVista("entrevistas");
        }

    });

}


// ===== Arena Mode =====

function hmFilasArena() {

    return [
        { etiqueta: "Puesto actual", valor: c => `${c.puesto_actual} — ${c.empresa_actual}` },
        { etiqueta: "Escolaridad", valor: c => c.escolaridad },
        { etiqueta: "Otros estudios", valor: c => c.otros_estudios },
        { etiqueta: "Idiomas", valor: c => c.idiomas },
        { etiqueta: "Resumen profesional", valor: c => c.resumen_profesional },
        { etiqueta: "Compensación actual", valor: c => hmDinero(c.compensacion_actual) },
        { etiqueta: "Compensación deseada", valor: c => hmDinero(c.compensacion_deseada) },
        { etiqueta: "Fortalezas", valor: c => c.assessfirst?.fortalezas || "No registradas" },
        { etiqueta: "Áreas de oportunidad", valor: c => c.assessfirst?.areas_oportunidad || "No registradas" },
        {
            etiqueta: "Evaluación de Atracción de Talento",
            valor: c =>
                c.evaluacionAT
                    ? `Hard Skills ${c.evaluacionAT.hard}/5 · Soft Skills ${c.evaluacionAT.soft}/5`
                    : "Sin evaluar"
        },
        {
            etiqueta: "Comentario de Atracción de Talento",
            valor: c => c.evaluacionAT?.comentario || "Sin comentario"
        }
    ];

}


function hmRenderArena() {

    const seleccionados = hmState.seleccionados.map(hmCandidato).filter(Boolean);
    const filas = hmFilasArena();

    hmEl("hm-arena").innerHTML = `
        <div class="hm-arena__head">
            <div>
                <h3>⚖ Arena Mode</h3>
                <p>Comparativa lado a lado con la información de la base y la evaluación de Atracción de Talento.</p>
            </div>
            <button class="hm-button hm-button--ghost" type="button" data-cerrar-arena>Volver a los candidatos</button>
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
                                        <strong>${hmCompatibilidad(candidato)}%</strong>
                                        <progress class="hm-progress" max="100" value="${hmCompatibilidad(candidato)}"></progress>
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
                        <td class="hm-arena__criterion">Perfil</td>
                        ${seleccionados
                            .map(
                                candidato => `
                                    <td>
                                        <button class="hm-button hm-button--primary" type="button" data-evaluar-arena="${candidato.id}">
                                            Ver perfil completo
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


// ===== Cajón de perfil =====

function hmDocumentoCv(candidato) {

    const secciones = [
        {
            titulo: "Perfil profesional",
            lineas: [
                candidato.resumen_profesional,
                `Puesto actual: ${candidato.puesto_actual}`,
                `Empresa actual: ${candidato.empresa_actual}`
            ]
        },
        {
            titulo: "Educación e idiomas",
            lineas: [
                `Escolaridad: ${candidato.escolaridad}`,
                `Otros estudios: ${candidato.otros_estudios}`,
                `Idiomas: ${candidato.idiomas}`
            ]
        },
        {
            titulo: "Expectativas",
            lineas: [
                `Compensación actual: ${hmDinero(candidato.compensacion_actual)}`,
                `Compensación deseada: ${hmDinero(candidato.compensacion_deseada)}`
            ]
        }
    ]
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
                header { padding-bottom: 12px; border-bottom: 2px solid #d90873; }
                h1 { color: #20202a; font-size: 17px; }
                header p { margin-top: 4px; color: #6b6b76; font-size: 10px; }
                section { margin-top: 16px; }
                h2 {
                    margin-bottom: 7px;
                    padding-bottom: 5px;
                    border-bottom: 1px dashed #ddd;
                    color: #d90873;
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
                    <p>${candidato.puesto_actual} · ${candidato.empresa_actual}</p>
                </header>
                ${secciones}
            </article>
        </body>
        </html>`;

}


function hmRenderEvaluacion(candidato) {

    hmEl("hm-evaluacion").innerHTML = candidato.evaluacionAT
        ? `
            <article class="hm-history__item">
                <div class="hm-history__top">
                    <div>
                        <h4>Entrevista de Atracción de Talento</h4>
                        <small>${EDAT.fecha(candidato.evaluacionAT.fecha)}</small>
                    </div>
                    <span class="hm-history__score">${candidato.evaluacionAT.hard}/5 · ${candidato.evaluacionAT.soft}/5</span>
                </div>
                <p>${candidato.evaluacionAT.comentario || "Sin comentario registrado."}</p>
                <span class="hm-chip hm-chip--ok">Hard Skills ${candidato.evaluacionAT.hard}/5</span>
                <span class="hm-chip hm-chip--ok">Soft Skills ${candidato.evaluacionAT.soft}/5</span>
            </article>
        `
        : '<p class="hm-empty">Atracción de Talento todavía no registra la evaluación de este candidato.</p>';

}


function hmRenderHistorial(candidato) {

    if (!Array.isArray(candidato.entrevistas) || candidato.entrevistas.length === 0) {

        hmEl("hm-history").innerHTML = '<p class="hm-empty">Sin entrevistas previas registradas.</p>';

        return;

    }

    hmEl("hm-history").innerHTML = candidato.entrevistas
        .map(
            entrevista => `
                <article class="hm-history__item">
                    <div class="hm-history__top">
                        <div>
                            <h4>Entrevista</h4>
                            <small>${EDAT.fecha(entrevista.fecha)} · ${entrevista.entrevistadores.join(", ")}</small>
                        </div>
                    </div>
                    <p>${entrevista.notas}</p>
                    <span class="hm-chip hm-chip--${hmClaseVeredicto(entrevista.veredicto)}">${entrevista.veredicto}</span>
                </article>
            `
        )
        .join("");

}


function hmRenderAccionesSheet(candidato) {

    const estado = EDAT.estado();
    const acciones = hmEl("hm-sheet-acciones");
    const pista = hmEl("hm-hint");

    const enSeleccion = estado.seleccionHM.includes(candidato.id);

    if (!estado.evaluacionesEnviadas) {

        pista.textContent =
            "Podrás seleccionar candidatos cuando Atracción de Talento envíe las evaluaciones.";

        pista.classList.add("is-warning");
        acciones.innerHTML = "";

        return;

    }

    if (!hmSeleccionBloqueada()) {

        const marcado = hmState.seleccionados.includes(candidato.id);

        pista.textContent = `Llevas ${hmState.seleccionados.length} de ${HM_MAX_SELECCION} candidatos seleccionados.`;
        pista.classList.toggle("is-warning", hmState.seleccionados.length !== HM_MAX_SELECCION);

        acciones.innerHTML = `
            <button class="hm-button ${marcado ? "hm-button--ghost" : "hm-button--primary"}" type="button" data-toggle-seleccion="${candidato.id}">
                ${marcado ? "Quitar de la selección" : "Agregar a los 4 seleccionados"}
            </button>
        `;

        return;

    }

    if (!enSeleccion) {

        pista.textContent = candidato.cierre
            ? `Proceso concluido · ${candidato.cierre.motivo}`
            : "Este candidato no forma parte de tus entrevistas.";

        pista.classList.remove("is-warning");
        acciones.innerHTML = "";

        return;

    }

    const entrevista = candidato.entrevistaHM;
    const botones = [];

    if (entrevista && entrevista.estado !== "Finalizada") {

        botones.push(`
            <button class="hm-button hm-button--primary" type="button" data-finalizar-entrevista="${candidato.id}">
                Marcar entrevista con Hiring Manager como finalizada
            </button>
        `);

    }

    const puedeDecidir =
        !estado.finalista
        && EDAT.entrevistasHmPendientes().length === 0;

    if (puedeDecidir) {

        botones.push(`
            <button class="hm-button hm-button--primary" type="button" data-seleccionar-final="${candidato.id}">
                Seleccionar candidato y enviar decisión a HRBP
            </button>
        `);

    }

    pista.textContent = estado.finalista
        ? estado.finalista === candidato.id
            ? "Este es el candidato seleccionado para la vacante."
            : "La decisión final ya fue registrada con otro candidato."
        : EDAT.entrevistasHmPendientes().length > 0
            ? `Finaliza las ${EDAT.entrevistasHmPendientes().length} entrevista(s) pendientes antes de decidir.`
            : "Puedes registrar tu decisión final.";

    pista.classList.toggle("is-warning", !estado.finalista && !puedeDecidir);

    acciones.innerHTML = botones.join("");

}


function hmRenderSheet(candidato) {

    hmEl("hm-sheet-initials").textContent = hmIniciales(candidato.nombre);
    hmEl("hm-sheet-name").textContent = candidato.nombre;
    hmEl("hm-sheet-role").textContent = `${candidato.puesto_actual} · ${candidato.empresa_actual}`;

    hmEl("hm-sheet-chips").innerHTML = `
        <span class="hm-chips__compat">${hmCompatibilidad(candidato)}% AssessFirst</span>
        <span>${candidato.estado}</span>
        <span>${candidato.escolaridad}</span>
        <span>Deseada: ${hmDinero(candidato.compensacion_deseada)}</span>
    `;

    hmEl("hm-cv-file").textContent = `📄 ${candidato.cv_path.split("/").pop()}`;
    hmEl("hm-cv-frame").srcdoc = hmDocumentoCv(candidato);

    hmRenderEvaluacion(candidato);
    hmRenderHistorial(candidato);
    hmRenderAccionesSheet(candidato);

}


function hmAbrirSheet(id) {

    const candidato = hmCandidato(id);

    if (!candidato) {
        return;
    }

    hmState.candidatoActivo = candidato.id;

    hmRenderSheet(candidato);

    hmEl("hm-sheet").classList.add("is-open");
    hmEl("hm-overlay").classList.add("is-open");

}


function hmCerrarSheet() {

    hmState.candidatoActivo = null;

    hmEl("hm-sheet").classList.remove("is-open");
    hmEl("hm-overlay").classList.remove("is-open");

}


function hmInitSheet() {

    hmEl("hm-sheet-close").addEventListener("click", hmCerrarSheet);
    hmEl("hm-overlay").addEventListener("click", hmCerrarSheet);

    document.addEventListener("keydown", evento => {

        if (evento.key === "Escape") {
            hmCerrarSheet();
        }

    });

    hmEl("hm-sheet-acciones").addEventListener("click", evento => {

        const alternar = evento.target.closest("[data-toggle-seleccion]");

        if (alternar) {

            const id = Number(alternar.dataset.toggleSeleccion);

            hmToggleSeleccion(id, !hmState.seleccionados.includes(id));
            hmRenderSheet(hmCandidato(id));

            return;

        }

        const finalizar = evento.target.closest("[data-finalizar-entrevista]");

        if (finalizar) {
            hmEjecutar(() => EDAT.hmFinalizarEntrevista(finalizar.dataset.finalizarEntrevista));
            return;
        }

        const decidir = evento.target.closest("[data-seleccionar-final]");

        if (decidir) {

            if (hmEjecutar(() => EDAT.hmSeleccionarFinalista(decidir.dataset.seleccionarFinal))) {
                hmCerrarSheet();
            }

        }

    });

}


// ===== Mis entrevistas =====

function hmRenderEntrevistas() {

    const estado = EDAT.estado();
    const contenedor = hmEl("hm-interviews");

    if (estado.seleccionHM.length === 0) {

        contenedor.innerHTML =
            '<p class="hm-empty">Todavía no envías candidatos a entrevista contigo.</p>';

        hmEl("hm-interviews-pill").textContent = "Sin entrevistas";
        hmEl("hm-decision-acciones").innerHTML = "";

        return;

    }

    const pendientes = EDAT.entrevistasHmPendientes().length;

    hmEl("hm-interviews-pill").textContent =
        `${estado.seleccionHM.length - pendientes} de ${estado.seleccionHM.length} finalizadas`;

    contenedor.innerHTML = estado.seleccionHM
        .map(id => {

            const candidato = hmCandidato(id);
            const entrevista = candidato.entrevistaHM;
            const finalizada = entrevista?.estado === "Finalizada";

            return `
                <article class="hm-interview">

                    <span class="hm-avatar">${hmIniciales(candidato.nombre)}</span>

                    <div class="hm-interview__info">
                        <h3>${candidato.nombre}</h3>
                        <p>${EDAT.fecha(entrevista.fecha)} · ${entrevista.hora}</p>
                        <p>${candidato.puesto_actual} · ${candidato.empresa_actual}</p>
                    </div>

                    <span class="hm-chip hm-chip--${finalizada ? "ok" : "neutral"}">
                        Entrevista ${finalizada ? "finalizada" : "pendiente"}
                    </span>

                    <span class="hm-status hm-status--${hmClaseEstado(candidato.estado)}">${candidato.estado}</span>

                    ${finalizada
                        ? `<button class="hm-button hm-button--ghost" type="button" data-abrir-perfil="${candidato.id}">
                                Ver perfil y decidir
                           </button>`
                        : `<button class="hm-button hm-button--primary" type="button" data-finalizar="${candidato.id}">
                                Marcar entrevista con Hiring Manager como finalizada
                           </button>`}

                </article>
            `;

        })
        .join("");

    hmRenderAccionesDecision();

}


function hmRenderAccionesDecision() {

    const estado = EDAT.estado();
    const acciones = hmEl("hm-decision-acciones");

    if (!estado.finalista) {
        acciones.innerHTML = "";
        return;
    }

    const restantes = estado.seleccionHM.filter(
        id => id !== estado.finalista
            && EDAT.estadoCandidato(id) !== EDAT.ESTADOS.NO_SELECCIONADO
    );

    acciones.innerHTML = restantes.length === 0
        ? ""
        : `
            <button class="hm-button hm-button--ghost" type="button" data-cerrar-no-seleccionados>
                Registrar candidatos no seleccionados y cerrar sus procesos
            </button>
        `;

}


function hmInitEntrevistas() {

    hmEl("hm-interviews").addEventListener("click", evento => {

        const finalizar = evento.target.closest("[data-finalizar]");

        if (finalizar) {
            hmEjecutar(() => EDAT.hmFinalizarEntrevista(finalizar.dataset.finalizar));
            return;
        }

        const perfil = evento.target.closest("[data-abrir-perfil]");

        if (perfil) {
            hmAbrirSheet(perfil.dataset.abrirPerfil);
        }

    });

    hmEl("hm-decision-acciones").addEventListener("click", evento => {

        if (evento.target.closest("[data-cerrar-no-seleccionados]")) {
            hmEjecutar(EDAT.hmCerrarNoSeleccionados);
        }

    });

}


// ===== Navegación =====

function hmRenderBadges() {

    const estado = EDAT.estado();

    const porSeleccionar = estado.evaluacionesEnviadas && !hmSeleccionBloqueada()
        ? EDAT.candidatosActivos().length
        : 0;

    const badgeShortlist = hmEl("hm-shortlist-badge");

    badgeShortlist.textContent = porSeleccionar;
    badgeShortlist.hidden = porSeleccionar === 0;

    const pendientes = EDAT.entrevistasHmPendientes().length;
    const badgePendientes = hmEl("hm-pending-badge");

    badgePendientes.textContent = pendientes;
    badgePendientes.hidden = pendientes === 0;

}


function hmSetVista(vista) {

    hmState.vista = vista;

    hmEl("hm-view-vacantes").hidden = vista !== "vacantes";
    hmEl("hm-view-candidatos").hidden = vista !== "candidatos";
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

    hmEl("hm-logout").addEventListener("click", EDAT.cerrarSesion);

}


// ===== Arranque =====

function hmRender() {

    // La selección se mantiene alineada con lo que ya quedó guardado.
    if (hmSeleccionBloqueada()) {
        hmState.seleccionados = [...EDAT.estado().seleccionHM];
    }

    hmRenderVacante();
    hmRenderNotificaciones();
    hmRenderBanner();
    hmRenderTimeline();
    hmRenderRequisicion();
    hmRenderShortlist();
    hmRenderEntrevistas();
    hmRenderBadges();
    hmRenderFab();

    if (hmState.candidatoActivo) {
        hmRenderSheet(hmCandidato(hmState.candidatoActivo));
    }

    if (hmState.arenaAbierta) {
        hmRenderArena();
    }

}


function hmInit() {

    hmInitNav();
    hmInitBanner();
    hmInitAlertas();
    hmInitTimeline();
    hmInitRequisicion();
    hmInitShortlist();
    hmInitArena();
    hmInitSheet();
    hmInitEntrevistas();

    EDAT.suscribir(hmRender);

    hmRender();

}


hmInit();
