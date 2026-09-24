// ==========================================================
// CANDIDATO
// Liverpool Talento · LiverHack 2026
//
// Consume:
//   ../js/candidatos-db.js
//   ../js/edat-flow.js
//
// El portal es un tracker: el candidato ve su estado y,
// cuando corresponde, acepta la oferta. No ejecuta acciones
// de HRBP, AT ni Hiring Manager.
// ==========================================================


const CANDIDATO_ACTOR = "candidato";

const candEl = id => document.getElementById(id);


function candIniciales(nombre) {

    return String(nombre || "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(parte => parte[0])
        .join("")
        .toUpperCase();

}


function candFechaPartes(iso) {

    if (!iso) {
        return null;
    }

    const fecha = new Date(`${iso}T09:00:00`);

    if (Number.isNaN(fecha.getTime())) {
        return null;
    }

    return {
        mes: fecha
            .toLocaleDateString("es-MX", { month: "short" })
            .replace(".", "")
            .toUpperCase(),
        dia: String(fecha.getDate()).padStart(2, "0"),
        larga: fecha.toLocaleDateString("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    };

}


function candSesion() {

    return typeof EDAT !== "undefined" ? EDAT.sesion() : null;

}


function candActual() {

    return typeof EDAT !== "undefined" ? EDAT.candidatoDeSesion() : null;

}



// ==========================================================
// TOAST Y MODAL
// ==========================================================

function showToast(message) {

    const toast = candEl("toast");

    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => toast.classList.remove("show"), 3000);

}


function openModal(html) {

    const overlay = candEl("modalOverlay");
    const content = candEl("modalContent");

    if (!overlay || !content) {
        return;
    }

    content.innerHTML = html;
    overlay.classList.add("active");

}


function closeModal() {

    candEl("modalOverlay")?.classList.remove("active");

}



// ==========================================================
// NOTIFICACIONES
// ==========================================================

function candRenderBadge() {

    const badge = candEl("noticesBadge");

    if (!badge || typeof EDAT === "undefined") {
        return;
    }

    const candidato = candActual();
    const total = EDAT.noLeidas(CANDIDATO_ACTOR, candidato?.id);

    badge.textContent = total;
    badge.hidden = total === 0;

}


function candAbrirNotificaciones() {

    const candidato = candActual();
    const notas = EDAT.notificaciones(CANDIDATO_ACTOR, candidato?.id);

    const lista = notas.length === 0
        ? "<p>Todavía no tienes notificaciones de este proceso.</p>"
        : notas
            .map(
                nota => `
                    <div class="modal-info">
                        <strong>${nota.titulo}</strong>
                        <span>${nota.mensaje}</span>
                        <span>${EDAT.tiempoRelativo(nota.fecha)}</span>
                    </div>
                `
            )
            .join("");

    openModal(`
        <h2>Notificaciones</h2>
        <p>Actualizaciones de tu proceso en Liverpool Talento.</p>
        ${lista}
    `);

    EDAT.marcarLeidas(CANDIDATO_ACTOR, candidato?.id);
    candRenderBadge();

}



// ==========================================================
// IDENTIDAD, VACANTE Y MÉTRICAS
// ==========================================================

function candRenderIdentidad() {

    const candidato = candActual();
    const sesion = candSesion();
    const estado = EDAT.estado();

    if (!candidato) {
        return;
    }

    const primerNombre = candidato.nombre.split(" ")[0];

    if (candEl("navCandidateName")) {
        candEl("navCandidateName").textContent = candidato.nombre;
    }

    if (candEl("navAvatar")) {
        candEl("navAvatar").textContent = candIniciales(candidato.nombre).slice(0, 1);
    }

    if (candEl("candidateFirstName")) {
        candEl("candidateFirstName").textContent = primerNombre;
    }

    if (candEl("candidateEmail")) {
        candEl("candidateEmail").textContent =
            sesion?.email || `${primerNombre.toLowerCase()}@correo.com`;
    }

    if (candEl("cvFileName")) {
        candEl("cvFileName").textContent =
            `${candidato.nombre.replace(/\s+/g, "_")}_CV.pdf`;
    }

    if (candEl("candidateFolio")) {
        candEl("candidateFolio").textContent = `#${estado.vacante.folio}`;
    }

    if (candEl("jobTitle")) {
        candEl("jobTitle").textContent =
            estado.requisicion?.titulo || "Vacante en seguimiento";
    }

    if (candEl("jobStatusPill")) {
        candEl("jobStatusPill").textContent = candidato.estado;
    }

    const etapas = EDAT.etapasVacante();
    const actual = etapas.find(etapa => etapa.estado !== "completada") || etapas[etapas.length - 1];

    if (candEl("jobStagePill")) {
        candEl("jobStagePill").textContent = `● Etapa 0${actual.numero} · ${actual.nombre}`;
    }

    const ultima = EDAT.notificaciones(CANDIDATO_ACTOR, candidato.id)[0];

    if (candEl("lastUpdate")) {
        candEl("lastUpdate").textContent = ultima
            ? `Última actualización: ${EDAT.tiempoRelativo(ultima.fecha)}`
            : "Sin movimientos registrados";
    }

}


function candRenderStats() {

    const contenedor = candEl("jobStats");
    const candidato = candActual();

    if (!contenedor || !candidato) {
        return;
    }

    const estado = EDAT.estado();
    const ofertaPropia =
        estado.oferta && Number(estado.oferta.candidatoId) === Number(candidato.id)
            ? estado.oferta
            : null;

    const tarjetas = [
        {
            titulo: "ESTADO DEL PROCESO",
            valor: candidato.estado,
            nota: candidato.cierre ? "Proceso concluido para esta vacante" : "Seguimiento en tiempo real",
            destacado: true
        },
        {
            titulo: "ENTREVISTA AT",
            valor: candidato.entrevistaAT
                ? candidato.entrevistaAT.estado
                : "Por agendar",
            nota: candidato.entrevistaAT
                ? `${EDAT.fecha(candidato.entrevistaAT.fecha)} · ${candidato.entrevistaAT.hora}`
                : "Atracción de Talento"
        },
        {
            titulo: "ENTREVISTA HM",
            valor: candidato.entrevistaHM
                ? candidato.entrevistaHM.estado
                : estado.seleccionHM.includes(candidato.id)
                    ? "Por agendar"
                    : "—",
            nota: candidato.entrevistaHM
                ? `${EDAT.fecha(candidato.entrevistaHM.fecha)} · ${candidato.entrevistaHM.hora}`
                : "Hiring Manager"
        },
        {
            titulo: "OFERTA",
            valor: !ofertaPropia
                ? "Sin oferta"
                : ofertaPropia.estado === "Aceptada"
                    ? "Aceptada"
                    : "Recibida",
            nota: ofertaPropia?.disponibilidad
                ? `Ingreso: ${ofertaPropia.disponibilidad}`
                : ofertaPropia
                    ? "Consulta los detalles abajo"
                    : "Pendiente de decisión"
        }
    ];

    contenedor.innerHTML = tarjetas
        .map(
            tarjeta => `
                <article class="job-stat ${tarjeta.destacado ? "pink-stat" : ""}">
                    <span>${tarjeta.titulo}</span>
                    <strong class="${tarjeta.destacado ? "pink-text" : ""}">${tarjeta.valor}</strong>
                    <small>${tarjeta.nota}</small>
                </article>
            `
        )
        .join("");

}



// ==========================================================
// TIMELINE
// ==========================================================

function candDetalleEtapa(clave, candidato) {

    const estado = EDAT.estado();
    const propia = Number(estado.finalista) === Number(candidato.id);
    const ofertaPropia =
        estado.oferta && Number(estado.oferta.candidatoId) === Number(candidato.id);

    if (candidato.estado === EDAT.ESTADOS.DESCARTADO) {
        return {
            requisicion: "Tu postulación quedó registrada en la base de talento.",
            alineacion: "El perfil de la vacante se alineó con el área.",
            busqueda: "Tu perfil fue revisado durante la búsqueda.",
            entrevistas_at: "Esta vacante continuó con otros perfiles.",
            entrevistas_hm: "Tu proceso para esta vacante no avanzó a entrevista con Hiring Manager.",
            oferta: candidato.status_justificacion || "Tu proceso para esta vacante concluyó."
        }[clave];
    }

    if (candidato.estado === EDAT.ESTADOS.NO_SELECCIONADO) {
        return {
            requisicion: "Tu postulación quedó registrada.",
            alineacion: "El perfil de la vacante quedó alineado.",
            busqueda: "Tu perfil formó parte de los candidatos En Proceso.",
            entrevistas_at: candidato.evaluacionAT
                ? "Concluiste tu entrevista con Atracción de Talento."
                : "Tu perfil participó en la etapa de entrevistas de Atracción de Talento.",
            entrevistas_hm: candidato.entrevistaHM
                ? "Concluiste tu entrevista con Hiring Manager."
                : "Esta vacante continuó con otros perfiles.",
            oferta: EDAT.MENSAJE_CIERRE_CANDIDATO
        }[clave];
    }

    return {

        requisicion: estado.requisicion
            ? "La vacante ya tiene requisición y tu postulación está asociada a ella."
            : "Tu postulación quedó registrada. La vacante inicia cuando HRBP abre la requisición.",

        alineacion: EDAT.etapaAlcanzada("alineacion")
            ? "El perfil de la vacante está en alineación entre Atracción de Talento y Hiring Manager."
            : "Pendiente de alineación del perfil.",

        busqueda: EDAT.etapaAlcanzada("busqueda")
            ? "Tu perfil forma parte de los candidatos En Proceso de esta vacante."
            : "Tu perfil se revisará cuando la vacante pase a búsqueda.",

        entrevistas_at: candidato.entrevistaAT
            ? `Entrevista con Atracción de Talento · ${EDAT.fecha(candidato.entrevistaAT.fecha)} · ${candidato.entrevistaAT.estado}.`
            : "Pendiente de agendar entrevista con Atracción de Talento.",

        entrevistas_hm: candidato.entrevistaHM
            ? `Entrevista con Hiring Manager · ${EDAT.fecha(candidato.entrevistaHM.fecha)} · ${candidato.entrevistaHM.estado}.`
            : "Pendiente de decisión del Hiring Manager.",

        oferta: !ofertaPropia
            ? propia
                ? "Fuiste seleccionado. HRBP está generando tu oferta."
                : "La oferta se comparte únicamente con el candidato seleccionado."
            : estado.incorporacion && propia
                ? "Tu incorporación ya fue registrada. El proceso finalizó."
                : estado.oferta.estado === "Aceptada"
                    ? `Oferta aceptada · disponibilidad de ingreso: ${estado.oferta.disponibilidad}.`
                    : "Recibiste una oferta. Revisa los detalles y confirma tu disponibilidad de ingreso."

    }[clave];

}


function candRenderTimeline() {

    const contenedor = candEl("candidateTimeline");
    const candidato = candActual();

    if (!contenedor || !candidato) {
        return;
    }

    contenedor.innerHTML = EDAT.etapasVacante()
        .map(etapa => {

            const clase = etapa.estado === "completada"
                ? "completed"
                : etapa.estado === "pendiente"
                    ? "pending"
                    : "current";

            const marca = etapa.estado === "completada"
                ? '<svg class="talento-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m5 12 4 4L19 6"/></svg>'
                : '<svg class="talento-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>';

            const etiqueta = etapa.estado === "completada"
                ? '<span class="step-done">Completada</span>'
                : etapa.estado === "detenida"
                    ? '<span class="step-next">En pausa</span>'
                    : etapa.estado === "pendiente"
                        ? '<span class="step-next">Próxima</span>'
                        : '<span class="current-pill">EN CURSO</span>';

            return `
                <article class="timeline-step ${clase}">

                    <div class="timeline-marker">${marca}</div>

                    <div class="timeline-content">

                        <div class="timeline-title-row">
                            <strong>${etapa.numero}. ${etapa.nombre}</strong>
                            ${etiqueta}
                        </div>

                        <p>${candDetalleEtapa(etapa.clave, candidato)}</p>

                    </div>

                </article>
            `;

        })
        .join("");

}



// ==========================================================
// OFERTA
// ==========================================================

function candRenderOferta() {

    const seccion = candEl("offerSection");
    const candidato = candActual();

    if (!seccion || !candidato) {
        return;
    }

    const estado = EDAT.estado();
    const oferta = estado.oferta;
    const propia = oferta && Number(oferta.candidatoId) === Number(candidato.id);

    if (!propia) {
        seccion.hidden = true;
        return;
    }

    seccion.hidden = false;

    candEl("offerPill").textContent =
        oferta.estado === "Aceptada" ? "Oferta aceptada" : "Oferta recibida";

    candEl("offerSubtitle").textContent =
        oferta.estado === "Aceptada"
            ? "Registramos tu aceptación y tu disponibilidad de ingreso."
            : "Revisa la propuesta y confirma tu disponibilidad de ingreso.";

    candEl("offerDetail").innerHTML = [
        ["Puesto ofertado", oferta.puesto],
        ["Sueldo mensual bruto", oferta.sueldo],
        ["Esquema de trabajo", oferta.esquema],
        ["Fecha propuesta de ingreso", oferta.ingreso],
        ["Beneficios incluidos", oferta.beneficios],
        ["Disponibilidad confirmada", oferta.disponibilidad || "Pendiente de confirmar"]
    ]
        .map(
            ([etiqueta, valor]) => `
                <article>
                    <span>${etiqueta}</span>
                    <strong>${valor}</strong>
                </article>
            `
        )
        .join("");

    const acciones = candEl("offerActions");

    if (oferta.estado === "Aceptada") {

        acciones.innerHTML = `
            <p class="privacy-note">
                Oferta aceptada. Atracción de Talento confirmará tu incorporación para cerrar el proceso.
            </p>
        `;

        return;

    }

    acciones.innerHTML = `
        <div class="offer-field">
            <label for="offerAvailability">Disponibilidad de ingreso</label>
            <input id="offerAvailability" type="text" value="${oferta.ingreso || ""}" required>
        </div>
        <button class="pink-action offer-accept" type="button" id="acceptOfferButton">
            Aceptar oferta y confirmar disponibilidad de ingreso
        </button>
    `;

}


function candAceptarOferta() {

    const disponibilidad = candEl("offerAvailability")?.value.trim();

    const resultado = EDAT.candidatoAceptarOferta(disponibilidad);

    showToast(resultado.mensaje);

}



// ==========================================================
// ENTREVISTA Y RECLUTADORA
// ==========================================================

function candRenderEntrevista() {

    const candidato = candActual();

    if (!candidato) {
        return;
    }

    const entrevista = candidato.entrevistaHM || candidato.entrevistaAT;
    const partes = candFechaPartes(entrevista?.fecha);
    const concluido =
        candidato.estado === EDAT.ESTADOS.NO_SELECCIONADO
        || candidato.estado === EDAT.ESTADOS.DESCARTADO
        || candidato.estado === EDAT.ESTADOS.INCORPORADO;

    if (candEl("interviewPill")) {

        candEl("interviewPill").textContent = concluido
            ? candidato.estado
            : entrevista
                ? entrevista.estado === "Finalizada"
                    ? "Finalizada"
                    : "Confirmada"
                : "Por agendar";

    }

    if (partes) {

        if (candEl("interviewMonth")) {
            candEl("interviewMonth").textContent = partes.mes;
        }

        if (candEl("interviewDay")) {
            candEl("interviewDay").textContent = partes.dia;
        }

        if (candEl("interviewDate")) {
            candEl("interviewDate").textContent = partes.larga;
        }

        if (candEl("interviewHour")) {
            candEl("interviewHour").textContent =
                `${entrevista.hora} · ${candidato.entrevistaHM ? "Hiring Manager" : "Atracción de Talento"}`;
        }

    }
    else if (candEl("interviewDate")) {

        candEl("interviewDate").textContent = concluido
            ? "No tienes entrevistas pendientes"
            : "Tu entrevista se agendará cuando el proceso avance";

        if (candEl("interviewHour")) {
            candEl("interviewHour").textContent = "El equipo de Talento te avisará aquí.";
        }

    }

    const mensaje = candEl("recruiterMessage");

    if (mensaje) {

        if (candidato.estado === EDAT.ESTADOS.INCORPORADO) {
            mensaje.textContent =
                "Tu proceso ha finalizado y tu incorporación ha sido registrada. Bienvenida a Liverpool.";
        }
        else if (candidato.estado === EDAT.ESTADOS.OFERTA_ACEPTADA) {
            mensaje.textContent =
                "Recibimos tu aceptación y tu disponibilidad de ingreso. Estamos confirmando tu incorporación.";
        }
        else if (candidato.estado === EDAT.ESTADOS.OFERTA_ENVIADA) {
            mensaje.textContent =
                "Ya tienes una oferta disponible. Revísala en esta misma pantalla y confirma tu fecha de ingreso.";
        }
        else if (candidato.estado === EDAT.ESTADOS.NO_SELECCIONADO) {
            mensaje.textContent = EDAT.MENSAJE_CIERRE_CANDIDATO;
        }
        else if (candidato.estado === EDAT.ESTADOS.DESCARTADO) {
            mensaje.textContent =
                candidato.status_justificacion
                || "Tu proceso para esta vacante concluyó. Quedamos atentos a futuras oportunidades.";
        }
        else {
            mensaje.textContent =
                `Hola, ${candidato.nombre.split(" ")[0]}. Estoy acompañando tu proceso. Cualquier duda sobre entrevistas o documentos, escríbeme desde aquí.`;
        }

    }

}



// ==========================================================
// RENDER GENERAL
// ==========================================================

function candRender() {

    if (typeof EDAT === "undefined") {
        return;
    }

    candRenderIdentidad();
    candRenderStats();
    candRenderTimeline();
    candRenderOferta();
    candRenderEntrevista();
    candRenderBadge();

}



// ==========================================================
// INTERACCIONES QUE YA TENÍA EL PORTAL
// ==========================================================

function candInitInteracciones() {

    candEl("modalClose")?.addEventListener("click", closeModal);

    candEl("modalOverlay")?.addEventListener("click", evento => {

        if (evento.target === candEl("modalOverlay")) {
            closeModal();
        }

    });

    document.addEventListener("keydown", evento => {

        if (evento.key === "Escape") {
            closeModal();
        }

    });

    candEl("nextAppointmentButton")?.addEventListener("click", () => {

        candEl("interviewSection")?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

    candEl("joinMeetingButton")?.addEventListener("click", () => {

        showToast("El enlace de Teams estará disponible 15 minutos antes de la entrevista.");

    });

    const cvInput = candEl("cvInput");
    const cvFileName = candEl("cvFileName");

    candEl("updateCvButton")?.addEventListener("click", () => cvInput?.click());

    cvInput?.addEventListener("change", () => {

        const file = cvInput.files[0];

        if (!file) {
            return;
        }

        const isPdf =
            file.type === "application/pdf"
            || file.name.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            showToast("Selecciona un archivo PDF.");
            cvInput.value = "";
            return;
        }

        if (cvFileName) {
            cvFileName.textContent = file.name;
        }

        showToast("Currículum actualizado correctamente en esta demostración.");

    });

    candEl("previewCvButton")?.addEventListener("click", () => {

        const candidato = candActual();

        openModal(`
            <h2>Currículum de ${candidato?.nombre || "la candidatura"}</h2>
            <p>Vista previa del documento compartido con el comité evaluador.</p>
            <div class="modal-info">
                <strong>${cvFileName?.textContent || "CV.pdf"}</strong>
                <span>Documento PDF</span>
                <span>Compartido con Atracción de Talento, Hiring Manager y HRBP.</span>
            </div>
        `);

    });

    candEl("downloadCvButton")?.addEventListener("click", () => {
        showToast("Descarga de CV preparada.");
    });

    candEl("sendMessageButton")?.addEventListener("click", () => {

        openModal(`
            <h2>Mensaje para Karla Méndez</h2>
            <p>En esta demostración el mensaje queda registrado para tu reclutadora asignada.</p>
            <div class="modal-info">
                <strong>Karla Méndez</strong>
                <span>Atracción de Talento</span>
                <span>Tiempo habitual de respuesta: menos de 3 horas hábiles.</span>
            </div>
        `);

    });

    const openFaq = () => {

        openModal(`
            <h2>Preguntas Frecuentes</h2>
            <p>Información sobre entrevistas, documentación y seguimiento de tu proceso.</p>
            <div class="modal-info">
                <strong>¿Puedo cambiar la fecha de mi entrevista?</strong>
                <span>Comunícate con tu reclutadora asignada para revisar disponibilidad.</span>
            </div>
            <div class="modal-info">
                <strong>¿Cuándo recibiré una actualización?</strong>
                <span>Tu portal se actualiza cada vez que existe un cambio importante dentro del proceso.</span>
            </div>
        `);

    };

    candEl("questionsButton")?.addEventListener("click", openFaq);
    candEl("faqNav")?.addEventListener("click", openFaq);
    candEl("footerFaqButton")?.addEventListener("click", openFaq);

    candEl("messagesNav")?.addEventListener("click", () => {

        candEl("recruiterSection")?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

    candEl("noticesNav")?.addEventListener("click", candAbrirNotificaciones);

    candEl("benefitsButton")?.addEventListener("click", () => {

        openModal(`
            <h2>Cultura y Beneficios Liverpool</h2>
            <p>Elementos que forman parte de la experiencia de trabajar en Liverpool.</p>
            <div class="modal-info">
                <strong>Liverpool Talento</strong>
                <span>Desarrollo profesional y capacitación.</span>
                <span>Esquemas de trabajo flexibles.</span>
                <span>Beneficios y descuentos corporativos.</span>
            </div>
        `);

    });

    candEl("exitButton")?.addEventListener("click", EDAT.cerrarSesion);
    candEl("footerExitButton")?.addEventListener("click", EDAT.cerrarSesion);

    candEl("offerActions")?.addEventListener("click", evento => {

        if (evento.target.closest("#acceptOfferButton")) {
            candAceptarOferta();
        }

    });

}



// ==========================================================
// ARRANQUE
// ==========================================================

function candInit() {

    candInitInteracciones();

    if (typeof EDAT !== "undefined") {
        EDAT.suscribir(candRender);
    }

    candRender();

}


candInit();
