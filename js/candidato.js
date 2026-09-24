// ==========================================================
// CANDIDATO
// Liverpool Talento
// LiverHack 2026
// ==========================================================



// ==========================================================
// ELEMENTOS
// ==========================================================

const toast =
    document.getElementById(
        "toast"
    );


const modalOverlay =
    document.getElementById(
        "modalOverlay"
    );


const modalContent =
    document.getElementById(
        "modalContent"
    );


const modalClose =
    document.getElementById(
        "modalClose"
    );



// ==========================================================
// RECUPERAR SESIÓN DEL LOGIN
// ==========================================================

const storedSession =
    localStorage.getItem(
        "talentoSession"
    );


if (storedSession) {

    try {

        const session =
            JSON.parse(
                storedSession
            );


        if (
            session.role ===
            "candidate"
        ) {

            const candidateEmail =
                document.getElementById(
                    "candidateEmail"
                );


            if (candidateEmail) {

                candidateEmail.textContent =
                    session.email;

            }

        }

    }
    catch (error) {

        console.warn(
            "No se pudo leer la sesión.",
            error
        );

    }

}



// ==========================================================
// TOAST
// ==========================================================

function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        showToast.timeout
    );


    showToast.timeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}



// ==========================================================
// MODAL
// ==========================================================

function openModal(html) {

    modalContent.innerHTML =
        html;


    modalOverlay.classList.add(
        "active"
    );

}



function closeModal() {

    modalOverlay.classList.remove(
        "active"
    );

}



modalClose.addEventListener(
    "click",
    closeModal
);


modalOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modalOverlay
        ) {

            closeModal();

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

            closeModal();

        }

    }
);



// ==========================================================
// VER PRÓXIMA CITA
// ==========================================================

document
    .getElementById(
        "nextAppointmentButton"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "interviewSection"
                )
                .scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "center"

                });

        }
    );



// ==========================================================
// DETALLES DE ENTREVISTA
// ==========================================================

document
    .getElementById(
        "viewSessionButton"
    )
    .addEventListener(
        "click",
        () => {

            openModal(`

                <h2>
                    Panel Técnico y de Competencias
                </h2>

                <p>
                    Tu próxima sesión está confirmada.
                    Participarán integrantes del equipo técnico
                    y People Partner Liverpool.
                </p>

                <div class="modal-info">

                    <strong>
                        Jueves, 24 de Septiembre 2026
                    </strong>

                    <span>
                        11:00 AM – 12:15 PM CST
                    </span>

                    <span>
                        Microsoft Teams
                    </span>

                    <span>
                        Duración aproximada:
                        75 minutos
                    </span>

                </div>

            `);

        }
    );



// ==========================================================
// CALENDARIO
// ==========================================================

document
    .getElementById(
        "addCalendarButton"
    )
    .addEventListener(
        "click",
        () => {

            showToast(
                "La entrevista fue preparada para agregarse a tu calendario."
            );

        }
    );



// ==========================================================
// VIDEOLLAMADA
// ==========================================================

document
    .getElementById(
        "joinMeetingButton"
    )
    .addEventListener(
        "click",
        () => {

            showToast(
                "El enlace de Teams estará disponible 15 minutos antes de la entrevista."
            );

        }
    );



// ==========================================================
// ACTUALIZAR CV
// ==========================================================

const updateCvButton =
    document.getElementById(
        "updateCvButton"
    );


const cvInput =
    document.getElementById(
        "cvInput"
    );


const cvFileName =
    document.getElementById(
        "cvFileName"
    );


updateCvButton.addEventListener(
    "click",
    () => {

        cvInput.click();

    }
);


cvInput.addEventListener(
    "change",
    () => {

        const file =
            cvInput.files[0];


        if (!file) {
            return;
        }


        const isPdf =

            file.type ===
            "application/pdf"

            ||

            file.name
                .toLowerCase()
                .endsWith(
                    ".pdf"
                );


        if (!isPdf) {

            showToast(
                "Selecciona un archivo PDF."
            );


            cvInput.value =
                "";


            return;

        }


        cvFileName.textContent =
            file.name;


        showToast(
            "Currículum actualizado correctamente en esta demostración."
        );

    }
);



// ==========================================================
// PREVISUALIZAR CV
// ==========================================================

document
    .getElementById(
        "previewCvButton"
    )
    .addEventListener(
        "click",
        () => {

            openModal(`

                <h2>
                    Currículum de Sofía Valdés
                </h2>

                <p>
                    Vista previa del documento compartido
                    con el comité evaluador.
                </p>

                <div class="modal-info">

                    <strong>
                        ${cvFileName.textContent}
                    </strong>

                    <span>
                        Documento PDF
                    </span>

                    <span>
                        Compartido con Reclutamiento,
                        Hiring Manager y People Partner.
                    </span>

                </div>

            `);

        }
    );



// ==========================================================
// DESCARGAR CV
// ==========================================================

document
    .getElementById(
        "downloadCvButton"
    )
    .addEventListener(
        "click",
        () => {

            showToast(
                "Descarga de CV preparada."
            );

        }
    );



// ==========================================================
// MENSAJE RECLUTADORA
// ==========================================================

document
    .getElementById(
        "sendMessageButton"
    )
    .addEventListener(
        "click",
        () => {

            openModal(`

                <h2>
                    Mensaje para Daniela Morales
                </h2>

                <p>
                    En la implementación completa,
                    este módulo permitirá conversar
                    directamente con la reclutadora
                    responsable de tu proceso.
                </p>

                <div class="modal-info">

                    <strong>
                        Daniela Morales
                    </strong>

                    <span>
                        Talent Attraction Specialist
                    </span>

                    <span>
                        Tiempo habitual de respuesta:
                        menos de 3 horas hábiles.
                    </span>

                </div>

            `);

        }
    );



// ==========================================================
// FAQs
// ==========================================================

function openFaq() {

    openModal(`

        <h2>
            Preguntas Frecuentes
        </h2>

        <p>
            Aquí puedes consultar información relacionada
            con entrevistas, cambios de horario,
            documentación y seguimiento de tu proceso.
        </p>

        <div class="modal-info">

            <strong>
                ¿Puedo cambiar la fecha de mi entrevista?
            </strong>

            <span>
                Comunícate con tu reclutadora asignada
                para revisar disponibilidad.
            </span>

        </div>


        <div class="modal-info">

            <strong>
                ¿Cuándo recibiré una actualización?
            </strong>

            <span>
                Tu portal se actualiza cada vez que existe
                un cambio importante dentro del proceso.
            </span>

        </div>

    `);

}



document
    .getElementById(
        "questionsButton"
    )
    .addEventListener(
        "click",
        openFaq
    );


document
    .getElementById(
        "faqNav"
    )
    .addEventListener(
        "click",
        openFaq
    );


document
    .getElementById(
        "footerFaqButton"
    )
    .addEventListener(
        "click",
        openFaq
    );



// ==========================================================
// MENSAJES Y CITAS
// ==========================================================

document
    .getElementById(
        "messagesNav"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "recruiterSection"
                )
                .scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "center"

                });

        }
    );



// ==========================================================
// BENEFICIOS
// ==========================================================

document
    .getElementById(
        "benefitsButton"
    )
    .addEventListener(
        "click",
        () => {

            openModal(`

                <h2>
                    Cultura y Beneficios Liverpool
                </h2>

                <p>
                    Conoce algunos de los elementos que
                    forman parte de la experiencia de
                    trabajar en Liverpool Tech.
                </p>

                <div class="modal-info">

                    <strong>
                        Liverpool Tech
                    </strong>

                    <span>
                        Desarrollo profesional y capacitación.
                    </span>

                    <span>
                        Esquemas de trabajo flexibles.
                    </span>

                    <span>
                        Beneficios y descuentos corporativos.
                    </span>

                    <span>
                        Proyectos de transformación digital.
                    </span>

                </div>

            `);

        }
    );