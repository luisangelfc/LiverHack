// ==========================================================
// LOGIN TALENTO
// LiverHack 2026
// ==========================================================



// ==========================================================
// PERFILES Y PÁGINAS
//
// IMPORTANTE:
//
// login.html, index.html y candidato.html
// están todos dentro de la carpeta /html.
//
// window.location.href trabaja tomando como referencia
// la página actual (html/login.html).
//
// Por eso:
// "index.html"
// "candidato.html"
//
// funcionan correctamente.
// ==========================================================

const profiles = {


    recruiter: {
        name: "Recruiter / AT",
        page: "index.html"
    },


    hrbp: {

        name:
            "HRBP / Talent",

        page:
            "hrbp.html"

    },


    manager: {

        name:
            "Hiring Manager",

        page:
            "hiring-manager.html"

    },


    candidate: {

        name:
            "Candidato",

        page:
            "candidato.html"

    }


};



// ==========================================================
// ELEMENTOS DEL HTML
// ==========================================================

const roleButtons =
    document.querySelectorAll(
        ".role-button"
    );


const stepTwo =
    document.getElementById(
        "stepTwo"
    );


const selectedRoleText =
    document.getElementById(
        "selectedRoleText"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );


const emailInput =
    document.getElementById(
        "email"
    );


const loginButton =
    document.getElementById(
        "loginButton"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );



// ==========================================================
// PERFIL ACTUAL
// ==========================================================

let selectedRole =
    null;



// ==========================================================
// PASO 1
// SELECCIÓN DEL PERFIL
// ==========================================================

roleButtons.forEach(

    button => {


        button.addEventListener(

            "click",

            () => {


                // ------------------------------------------
                // LEER PERFIL DEL BOTÓN
                // ------------------------------------------

                const role =
                    button.dataset.role;


                const profile =
                    profiles[role];



                if (!profile) {

                    return;

                }



                // ------------------------------------------
                // GUARDAR PERFIL
                // ------------------------------------------

                selectedRole =
                    role;



                // ------------------------------------------
                // QUITAR ACTIVE DE TODOS LOS BOTONES
                // ------------------------------------------

                roleButtons.forEach(

                    currentButton => {


                        currentButton
                            .classList
                            .remove(
                                "active"
                            );


                    }

                );



                // ------------------------------------------
                // ACTIVAR EL BOTÓN ELEGIDO
                // ------------------------------------------

                button
                    .classList
                    .add(
                        "active"
                    );



                // ------------------------------------------
                // ACTIVAR PASO 2
                // ------------------------------------------

                stepTwo
                    .classList
                    .remove(
                        "disabled-step"
                    );


                stepTwo
                    .classList
                    .add(
                        "active-step"
                    );



                // ------------------------------------------
                // ACTIVAR CAMPO DE CORREO
                // ------------------------------------------

                emailInput.disabled =
                    false;



                // ------------------------------------------
                // MOSTRAR PERFIL SELECCIONADO
                // ------------------------------------------

                selectedRoleText.textContent =
                    `Ingresarás como ${profile.name}.`;



                // ------------------------------------------
                // LIMPIAR CORREO
                // ------------------------------------------

                emailInput.value =
                    "";



                // ------------------------------------------
                // DESACTIVAR BOTÓN HASTA TENER CORREO
                // ------------------------------------------

                loginButton.disabled =
                    true;



                hideMessage();



                // ------------------------------------------
                // PONER CURSOR EN EL CORREO
                // ------------------------------------------

                emailInput.focus();


            }

        );


    }

);



// ==========================================================
// PASO 2
// VALIDACIÓN DEL CORREO
// ==========================================================

emailInput.addEventListener(

    "input",

    () => {


        hideMessage();



        // Sin perfil seleccionado no se puede entrar

        if (!selectedRole) {


            loginButton.disabled =
                true;


            return;


        }



        // --------------------------------------------------
        // VALIDACIÓN
        //
        // type="email" realiza parte de la validación.
        // Además verificamos que exista contenido.
        // --------------------------------------------------

        const email =
            emailInput
                .value
                .trim();



        const emailIsValid =

            email !== ""

            &&

            emailInput.validity.valid;



        // --------------------------------------------------
        // ACTIVAR O DESACTIVAR BOTÓN
        // --------------------------------------------------

        loginButton.disabled =
            !emailIsValid;


    }

);



// ==========================================================
// ENVIAR FORMULARIO
// ==========================================================

loginForm.addEventListener(

    "submit",

    event => {


        // Evitamos que HTML recargue la página

        event.preventDefault();



        // ==================================================
        // VALIDAR PERFIL
        // ==================================================

        if (!selectedRole) {


            showMessage(

                "Selecciona primero el perfil al que deseas ingresar."

            );


            return;


        }



        // ==================================================
        // CORREO
        // ==================================================

        const email =
            emailInput
                .value
                .trim();



        // ==================================================
        // CORREO VACÍO
        // ==================================================

        if (email === "") {


            showMessage(

                "Ingresa un correo electrónico."

            );


            return;


        }



        // ==================================================
        // FORMATO INCORRECTO
        // ==================================================

        if (!emailInput.validity.valid) {


            showMessage(

                "Ingresa un correo electrónico válido."

            );


            return;


        }



        // ==================================================
        // PERFIL SELECCIONADO
        // ==================================================

        const profile =
            profiles[selectedRole];



        if (!profile) {


            showMessage(

                "No fue posible determinar el perfil seleccionado."

            );


            return;


        }



        // ==================================================
        // GUARDAR SESIÓN
        //
        // Nos servirá posteriormente para mostrar:
        //
        // correo
        // perfil
        // nombre
        // permisos
        // etc.
        // ==================================================

        const session = {


            email:
                email,


            role:
                selectedRole,


            roleName:
                profile.name,


            loginAt:
                new Date()
                    .toISOString()


        };



        localStorage.setItem(

            "talentoSession",

            JSON.stringify(
                session
            )

        );



        // ==================================================
        // REDIRECCIÓN
        //
        // ESTA ES LA PARTE QUE ENVÍA A CADA PÁGINA.
        // ==================================================

        window.location.href =
            profile.page;


    }

);



// ==========================================================
// MOSTRAR ERROR
// ==========================================================

function showMessage(
    message
) {


    loginMessage.textContent =
        message;


    loginMessage
        .classList
        .add(
            "show"
        );


}



// ==========================================================
// OCULTAR ERROR
// ==========================================================

function hideMessage() {


    loginMessage.textContent =
        "";


    loginMessage
        .classList
        .remove(
            "show"
        );


}

