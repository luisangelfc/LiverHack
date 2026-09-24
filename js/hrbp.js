// Requisiciones, seguimiento y ofertas de HRBP. Requiere candidatos-db.js y edat-flow.js.

const hrbpEl = id => document.getElementById(id);

const HRBP_ACTOR = "hrbp";

function hrbpIniciales(nombre) {
    return nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(parte => parte[0])
        .join("")
        .toUpperCase();
}

function hrbpClaseEstado(estado) {
    if (estado === EDAT.ESTADOS.FINALISTA) {
        return "finalista";
    }

    if (estado === EDAT.ESTADOS.DESCARTADO) {
        return "descartado";
    }

    if (estado === EDAT.ESTADOS.NO_SELECCIONADO) {
        return "no-seleccionado";
    }

    if (estado === EDAT.ESTADOS.INCORPORADO) {
        return "incorporado";
    }

    if (
        estado === EDAT.ESTADOS.OFERTA_ENVIADA
        || estado === EDAT.ESTADOS.OFERTA_ACEPTADA
    ) {
        return "oferta";
    }

    return "proceso";
}

function hrbpToast(mensaje) {
    const toast = hrbpEl("toast");

    toast.textContent = mensaje;
    toast.classList.add("show");

    clearTimeout(hrbpToast.timer);

    hrbpToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function hrbpAbrirModal(html) {
    hrbpEl("modalContent").innerHTML = html;
    hrbpEl("modalOverlay").classList.add("active");
}

function hrbpCerrarModal() {
    hrbpEl("modalOverlay").classList.remove("active");
}

function hrbpRenderBadge() {
    const total = EDAT.noLeidas(HRBP_ACTOR);
    const badge = hrbpEl("bellCount");

    badge.textContent = total;
    badge.hidden = total === 0;
}

function hrbpAbrirNotificaciones() {
    const notas = EDAT.notificaciones(HRBP_ACTOR);

    const lista = notas.length === 0
        ? '<p class="empty-note">Todavía no tienes notificaciones.</p>'
        : `
            <div class="notice-list">
                ${notas
                    .map(
                        nota => `
                            <article class="notice notice--${nota.nivel}">
                                <strong>${nota.titulo}</strong>
                                <p>${nota.mensaje}</p>
                                <small>${EDAT.tiempoRelativo(nota.fecha)}</small>
                            </article>
                        `
                    )
                    .join("")}
            </div>
        `;

    hrbpAbrirModal(`
        <h2>Notificaciones</h2>
        <p>Actualizaciones que generan Atracción de Talento, Hiring Manager y el candidato.</p>
        ${lista}
    `);

    EDAT.marcarLeidas(HRBP_ACTOR);
}

function hrbpRenderVacante() {
    const estado = EDAT.estado();

    hrbpEl("vacancyFolio").textContent = `#${estado.vacante.folio}`;

    hrbpEl("vacancyTitle").textContent =
        estado.requisicion?.titulo || "Vacante sin requisición";

    const etapas = EDAT.etapasVacante();

    const actual =
        etapas.find(etapa => etapa.estado !== "completada")
        || etapas[etapas.length - 1];

    hrbpEl("vacancyStage").textContent =
        `● Etapa 0${actual.numero} · ${actual.nombre}`;

    const etiquetaVacante = EDAT.vacanteDetenida()
        ? `Detenida por ${estado.vacante.detenidaPor}`
        : estado.vacante.estado;

    hrbpEl("vacancyState").innerHTML = `
        <svg
            class="talento-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <rect x="3" y="5" width="18" height="16" rx="2"/>
            <path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 17h3"/>
        </svg>

        ${etiquetaVacante}
    `;

    const ultima = estado.notificaciones[0];

    hrbpEl("lastUpdate").textContent = ultima
        ? `Última actualización: ${EDAT.tiempoRelativo(ultima.fecha)}`
        : "Sin movimientos registrados";

    const irRequisicion = hrbpEl("goRequisitionButton");

    if (irRequisicion && irRequisicion.lastChild) {
        irRequisicion.lastChild.textContent = estado.requisicion
            ? " Ver requisición enviada"
            : " Ir a la requisición";
    }
}

function hrbpRenderEstadosClave() {
    const estado = EDAT.estado();

    const finalista = estado.finalista
        ? EDAT.candidato(estado.finalista).nombre
        : "Sin definir";

    const oferta = !estado.oferta
        ? "Sin generar"
        : estado.oferta.estado === "Aceptada"
            ? "Aceptada"
            : "Enviada";

    const tarjetas = [
        {
            titulo: "REQUISICIÓN",
            valor: estado.requisicion ? "Enviada" : "Pendiente",
            nota: estado.requisicion
                ? EDAT.fecha(estado.requisicion.fecha)
                : "La abre HRBP"
        },
        {
            titulo: "ALINEACIÓN AT",
            valor: estado.alineacion.at.estado,
            nota: estado.alineacion.at.fecha
                ? EDAT.fecha(estado.alineacion.at.fecha)
                : "En espera"
        },
        {
            titulo: "ALINEACIÓN HM",
            valor: estado.alineacion.hm.estado,
            nota: estado.alineacion.hm.fecha
                ? EDAT.fecha(estado.alineacion.hm.fecha)
                : "En espera"
        },
        {
            titulo: "CANDIDATO FINAL",
            valor: finalista,
            nota: `Oferta: ${oferta}`,
            destacado: true
        }
    ];

    hrbpEl("flowStates").innerHTML = tarjetas
        .map(
            tarjeta => `
                <article class="job-stat ${tarjeta.destacado ? "pink-stat" : ""}">
                    <span>${tarjeta.titulo}</span>

                    <strong class="${tarjeta.destacado ? "pink-text" : ""}">
                        ${tarjeta.valor}
                    </strong>

                    <small>${tarjeta.nota}</small>
                </article>
            `
        )
        .join("");
}

function hrbpRenderTimeline() {
    const detalle = hrbpDetallePorEtapa();

    hrbpEl("flowTimeline").innerHTML = EDAT.etapasVacante()
        .map(etapa => {
            const clase = etapa.estado === "completada"
                ? "completed"
                : etapa.estado === "pendiente"
                    ? "pending"
                    : "current";

            const marca = etapa.estado === "completada"
                ? `
                    <svg
                        class="talento-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path d="m5 12 4 4L19 6"/>
                    </svg>
                `
                : `
                    <svg
                        class="talento-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <circle cx="12" cy="12" r="9"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                `;

            const etiqueta = etapa.estado === "completada"
                ? '<span class="step-done">Completada</span>'
                : etapa.estado === "detenida"
                    ? '<span class="step-next">Detenida</span>'
                    : etapa.estado === "pendiente"
                        ? '<span class="step-next">Próxima</span>'
                        : '<span class="current-pill">EN CURSO</span>';

            return `
                <article class="timeline-step ${clase}">

                    <div class="timeline-marker">
                        ${marca}
                    </div>

                    <div class="timeline-content">

                        <div class="timeline-title-row">
                            <strong>
                                ${etapa.numero}. ${etapa.nombre}
                            </strong>

                            ${etiqueta}
                        </div>

                        <p>
                            ${detalle[etapa.clave]}
                        </p>

                        <span class="resolution-time">
                            ${etapa.responsable}
                        </span>

                    </div>

                </article>
            `;
        })
        .join("");
}

function hrbpDetallePorEtapa() {
    const estado = EDAT.estado();

    const activos = EDAT.candidatosActivos();

    const evaluados =
        activos.filter(candidato => candidato.evaluacionAT).length;

    const entrevistasHm = estado.seleccionHM.filter(
        id => EDAT.candidato(id).entrevistaHM?.estado === "Finalizada"
    ).length;

    return {
        requisicion: estado.requisicion
            ? `Requisición de ${estado.requisicion.titulo} enviada a Atracción de Talento y Hiring Manager.`
            : "Pendiente de abrir la requisición de la vacante.",

        alineacion:
            `Atracción de Talento: ${estado.alineacion.at.estado} · Hiring Manager: ${estado.alineacion.hm.estado}.`,

        busqueda: EDAT.etapaAlcanzada("busqueda")
            ? `${activos.length} candidatos En Proceso identificados en la base de talento.`
            : "La búsqueda inicia cuando ambos actores aceptan la requisición.",

        entrevistas_at: EDAT.etapaAlcanzada("entrevistas_at")
            ? `${evaluados} de ${activos.length} candidatos evaluados por Atracción de Talento${estado.evaluacionesEnviadas ? " · evaluaciones enviadas al Hiring Manager." : "."}`
            : "Pendiente de iniciar las entrevistas de Atracción de Talento.",

        entrevistas_hm: estado.seleccionHM.length === 0
            ? "El Hiring Manager aún no selecciona a los 4 candidatos."
            : `${entrevistasHm} de ${estado.seleccionHM.length} entrevistas con Hiring Manager finalizadas.`,

        oferta: !estado.oferta
            ? estado.finalista
                ? `${EDAT.candidato(estado.finalista).nombre} fue seleccionado. Falta generar la oferta.`
                : "Pendiente de decisión final del Hiring Manager."
            : estado.incorporacion
                ? "Incorporación confirmada por Atracción de Talento. Vacante cubierta."
                : estado.oferta.estado === "Aceptada"
                    ? `Oferta aceptada · disponibilidad de ingreso: ${estado.oferta.disponibilidad}.`
                    : "Oferta enviada al candidato seleccionado."
    };
}

function hrbpRenderRequisicion() {
    const estado = EDAT.estado();

    const enviada = Boolean(estado.requisicion);

    hrbpEl("requisitionPill").hidden = !enviada;

    const formulario = hrbpEl("requisitionForm");

    formulario
        .querySelectorAll("input, textarea, button")
        .forEach(campo => {
            campo.disabled = enviada;
        });

    if (enviada) {
        hrbpEl("reqTitulo").value =
            estado.requisicion.titulo;

        hrbpEl("reqEscolaridad").value =
            estado.requisicion.escolaridad;

        hrbpEl("reqDescripcion").value =
            estado.requisicion.descripcion;

        hrbpEl("reqConocimientos").value =
            estado.requisicion.conocimientos;

        hrbpEl("reqHard").value =
            estado.requisicion.hardSkills;

        hrbpEl("reqSoft").value =
            estado.requisicion.softSkills;

        hrbpEl("reqSalario").value =
            estado.requisicion.salario;

        hrbpEl("reqDsq").value =
            estado.requisicion.dsq;

        hrbpEl("requisitionHint").textContent =
            `Requisición enviada el ${EDAT.fecha(estado.requisicion.fecha)}. Atracción de Talento y Hiring Manager fueron notificados.`;
    }

    hrbpEl("alignmentGrid").innerHTML = [
        {
            titulo: "ATRACCIÓN DE TALENTO",
            valor: estado.alineacion.at.estado,
            nota: estado.alineacion.at.fecha
                ? EDAT.fecha(estado.alineacion.at.fecha)
                : "Sin decisión registrada"
        },
        {
            titulo: "HIRING MANAGER",
            valor: estado.alineacion.hm.estado,
            nota: estado.alineacion.hm.fecha
                ? EDAT.fecha(estado.alineacion.hm.fecha)
                : "Sin decisión registrada"
        },
        {
            titulo: "ESTADO DE LA VACANTE",
            valor: EDAT.vacanteDetenida()
                ? "Detenida"
                : estado.vacante.estado,
            nota: EDAT.vacanteDetenida()
                ? `Declinada por ${estado.vacante.detenidaPor}`
                : "Sin bloqueos registrados"
        }
    ]
        .map(
            caja => `
                <article class="decision-box">

                    <span>
                        ${caja.titulo}
                    </span>

                    <strong>
                        ${caja.valor}
                    </strong>

                    <small>
                        ${caja.nota}
                    </small>

                </article>
            `
        )
        .join("");

    const noNegociables =
        estado.alineacion.at.noNegociables;

    hrbpEl("requirementList").innerHTML =
        noNegociables.length === 0
            ? '<li>Atracción de Talento aún no define los no negociables.</li>'
            : noNegociables
                .map(item => `<li>${item}</li>`)
                .join("");
}

function hrbpInitRequisicion() {
    hrbpEl("requisitionForm")
        .addEventListener("submit", evento => {

            evento.preventDefault();

            const datos = {
                titulo:
                    hrbpEl("reqTitulo").value.trim(),

                escolaridad:
                    hrbpEl("reqEscolaridad").value.trim(),

                descripcion:
                    hrbpEl("reqDescripcion").value.trim(),

                conocimientos:
                    hrbpEl("reqConocimientos").value.trim(),

                hardSkills:
                    hrbpEl("reqHard").value.trim(),

                softSkills:
                    hrbpEl("reqSoft").value.trim(),

                salario:
                    hrbpEl("reqSalario").value.trim(),

                dsq:
                    hrbpEl("reqDsq").value.trim()
            };

            const faltante =
                Object.values(datos)
                    .some(valor => valor === "");

            if (faltante) {
                hrbpToast(
                    "Completa todos los campos de la requisición."
                );

                return;
            }

            const resultado =
                EDAT.enviarRequisicion(datos);

            hrbpToast(resultado.mensaje);
        });

    hrbpEl("goRequisitionButton")
        .addEventListener("click", () => {

            hrbpSetVista("requisicion");

        });
}

function hrbpRenderCandidatos() {
    const candidatos =
        EDAT.candidatos();

    const estado =
        EDAT.estado();

    const activos =
        EDAT.candidatosActivos().length;

    hrbpEl("candidatesCounter").textContent =
        `${candidatos.length} perfiles en la base · ${activos} entraron al flujo de esta vacante.`;

    hrbpEl("candidateTrack").innerHTML =
        candidatos
            .map(candidato => {

                const detalles = [];

                if (candidato.evaluacionAT) {
                    detalles.push(
                        `Evaluación AT · Hard ${candidato.evaluacionAT.hard}/5 · Soft ${candidato.evaluacionAT.soft}/5`
                    );
                }

                if (
                    estado.seleccionHM.includes(
                        candidato.id
                    )
                ) {
                    detalles.push(
                        "Enviado a entrevista con Hiring Manager"
                    );
                }

                if (candidato.cierre) {
                    detalles.push(
                        candidato.cierre.motivo
                    );
                }

                if (
                    candidato.id === estado.finalista
                    && estado.oferta
                ) {
                    detalles.push(
                        estado.oferta.estado === "Aceptada"
                            ? `Oferta aceptada · ingreso ${estado.oferta.disponibilidad}`
                            : "Oferta enviada"
                    );
                }

                return `
                    <article class="track-row">

                        <span class="track-row__avatar">
                            ${hrbpIniciales(candidato.nombre)}
                        </span>

                        <div class="track-row__info">

                            <strong>
                                ${candidato.nombre}
                            </strong>

                            <p>
                                ${candidato.puesto_actual} · ${candidato.empresa_actual}
                            </p>

                            ${
                                detalles.length > 0
                                    ? `<small>${detalles.join(" · ")}</small>`
                                    : ""
                            }

                        </div>

                        <span class="track-state track-state--${hrbpClaseEstado(candidato.estado)}">
                            ${candidato.estado}
                        </span>

                    </article>
                `;
            })
            .join("");
}

function hrbpRenderOferta() {
    const estado =
        EDAT.estado();

    const bloqueado =
        hrbpEl("offerLocked");

    const formulario =
        hrbpEl("offerForm");

    if (!estado.finalista) {
        bloqueado.hidden = false;
        formulario.hidden = true;

        hrbpEl("offerStatus").innerHTML = "";

        hrbpEl("offerPill").hidden = true;

        return;
    }

    const candidato =
        EDAT.candidato(estado.finalista);

    bloqueado.hidden = true;

    formulario.hidden = false;

    hrbpEl("offerSubtitle").textContent =
        `${candidato.nombre} fue seleccionado por el Hiring Manager.`;

    hrbpEl("offerCandidato").value =
        candidato.nombre;

    if (!hrbpEl("offerPuesto").value) {
        hrbpEl("offerPuesto").value =
            estado.requisicion?.titulo || "";
    }

    if (!hrbpEl("offerIngreso").value) {
        hrbpEl("offerIngreso").value =
            EDAT.fecha(
                EDAT.fechaDemo(30)
            );
    }

    const enviada =
        Boolean(estado.oferta);

    hrbpEl("offerPill").hidden =
        !enviada;

    formulario
        .querySelectorAll("input, button")
        .forEach(campo => {
            campo.disabled = enviada;
        });

    if (enviada) {
        hrbpEl("offerPuesto").value =
            estado.oferta.puesto;

        hrbpEl("offerSueldo").value =
            estado.oferta.sueldo;

        hrbpEl("offerEsquema").value =
            estado.oferta.esquema;

        hrbpEl("offerIngreso").value =
            estado.oferta.ingreso;

        hrbpEl("offerBeneficios").value =
            estado.oferta.beneficios;

        hrbpEl("offerStatus").innerHTML = [
            {
                titulo: "ESTADO DE LA OFERTA",
                valor: estado.oferta.estado,
                nota:
                    `Enviada el ${EDAT.fecha(estado.oferta.fecha)}`
            },
            {
                titulo: "DISPONIBILIDAD CONFIRMADA",
                valor:
                    estado.oferta.disponibilidad || "En espera",
                nota:
                    estado.oferta.estado === "Aceptada"
                        ? "Confirmada por el candidato"
                        : "El candidato aún no responde"
            },
            {
                titulo: "INCORPORACIÓN",
                valor:
                    estado.incorporacion
                        ? "Confirmada"
                        : "Pendiente",
                nota:
                    estado.incorporacion
                        ? `Registrada por Atracción de Talento el ${EDAT.fecha(estado.incorporacion.fecha)}`
                        : "La confirma Atracción de Talento"
            }
        ]
            .map(
                caja => `
                    <article class="decision-box">

                        <span>
                            ${caja.titulo}
                        </span>

                        <strong>
                            ${caja.valor}
                        </strong>

                        <small>
                            ${caja.nota}
                        </small>

                    </article>
                `
            )
            .join("");
    }
    else {
        hrbpEl("offerStatus").innerHTML = "";
    }
}

function hrbpInitOferta() {
    hrbpEl("offerForm")
        .addEventListener("submit", evento => {

            evento.preventDefault();

            const datos = {
                puesto:
                    hrbpEl("offerPuesto").value.trim(),

                sueldo:
                    hrbpEl("offerSueldo").value.trim(),

                esquema:
                    hrbpEl("offerEsquema").value.trim(),

                ingreso:
                    hrbpEl("offerIngreso").value.trim(),

                beneficios:
                    hrbpEl("offerBeneficios").value.trim()
            };

            if (
                Object.values(datos)
                    .some(valor => valor === "")
            ) {
                hrbpToast(
                    "Completa la información de la oferta."
                );

                return;
            }

            const resultado =
                EDAT.hrbpEnviarOferta(datos);

            hrbpToast(resultado.mensaje);
        });
}

function hrbpSetVista(vista) {
    document
        .querySelectorAll(".view")
        .forEach(seccion => {

            seccion.hidden =
                seccion.id !== `view-${vista}`;

        });

    document
        .querySelectorAll(".nav-link")
        .forEach(enlace => {

            enlace.classList.toggle(
                "active",
                enlace.dataset.view === vista
            );

        });
}

function hrbpInitNav() {
    document
        .querySelectorAll(".nav-link")
        .forEach(enlace => {

            enlace.addEventListener(
                "click",
                () => hrbpSetVista(
                    enlace.dataset.view
                )
            );

        });

    hrbpEl("bellButton")
        .addEventListener(
            "click",
            hrbpAbrirNotificaciones
        );

    hrbpEl("footerNoticesButton")
        .addEventListener(
            "click",
            hrbpAbrirNotificaciones
        );

    hrbpEl("exitButton")
        .addEventListener(
            "click",
            EDAT.cerrarSesion
        );

    hrbpEl("footerExitButton")
        .addEventListener(
            "click",
            EDAT.cerrarSesion
        );

    const accountTrigger =
        hrbpEl("navAvatar");

    const accountPanel =
        hrbpEl("edatAccountPanel");

    const accountLogout =
        hrbpEl("exitButton");

    function closeAccountPanel(
        restoreFocus = false
    ) {
        accountPanel.hidden = true;

        accountTrigger.setAttribute(
            "aria-expanded",
            "false"
        );

        if (restoreFocus) {
            accountTrigger.focus();
        }
    }

    accountTrigger
        .addEventListener(
            "click",
            () => {

                const open =
                    accountPanel.hidden;

                accountPanel.hidden =
                    !open;

                accountTrigger.setAttribute(
                    "aria-expanded",
                    String(open)
                );

                if (open) {
                    accountLogout.focus();
                }

            }
        );

    document.addEventListener(
        "click",
        evento => {

            if (
                !accountPanel.contains(
                    evento.target
                )
                && !accountTrigger.contains(
                    evento.target
                )
            ) {
                closeAccountPanel();
            }

        }
    );

    document.addEventListener(
        "focusin",
        evento => {

            if (
                !accountPanel.contains(
                    evento.target
                )
                && !accountTrigger.contains(
                    evento.target
                )
            ) {
                closeAccountPanel();
            }

        }
    );

    hrbpEl("modalClose")
        .addEventListener(
            "click",
            hrbpCerrarModal
        );

    hrbpEl("modalOverlay")
        .addEventListener(
            "click",
            evento => {

                if (
                    evento.target ===
                    hrbpEl("modalOverlay")
                ) {
                    hrbpCerrarModal();
                }

            }
        );

    document.addEventListener(
        "keydown",
        evento => {

            if (evento.key === "Escape") {

                hrbpCerrarModal();

                if (!accountPanel.hidden) {
                    closeAccountPanel(true);
                }

            }

        }
    );
}

function hrbpRender() {
    hrbpRenderVacante();

    hrbpRenderEstadosClave();

    hrbpRenderTimeline();

    hrbpRenderRequisicion();

    hrbpRenderCandidatos();

    hrbpRenderOferta();

    hrbpRenderBadge();
}

function hrbpInit() {
    const sesion =
        EDAT.sesion();

    if (sesion?.email) {
        hrbpEl("hrbpEmail").textContent =
            sesion.email;
    }

    hrbpInitNav();

    hrbpInitRequisicion();

    hrbpInitOferta();

    EDAT.suscribir(
        hrbpRender
    );

    hrbpRender();
}

hrbpInit();