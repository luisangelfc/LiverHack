// Acceso por perfil. Las rutas de destino son relativas a html/login.html.

const profiles = {

    recruiter: {
        name: "Atracción de Talento",
        page: "index.html"
    },

    hrbp: {

        name:
            "HRBP",

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

let selectedRole =
    null;

roleButtons.forEach(

    button => {

        button.addEventListener(

            "click",

            () => {

                const role =
                    button.dataset.role;

                const profile =
                    profiles[role];

                if (!profile) {

                    return;

                }

                selectedRole =
                    role;

                roleButtons.forEach(

                    currentButton => {

                        currentButton
                            .classList
                            .remove(
                                "active"
                            );

                    }

                );

                button
                    .classList
                    .add(
                        "active"
                    );

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

                emailInput.disabled =
                    false;

                selectedRoleText.textContent =
                    `Ingresarás como ${profile.name}.`;

                emailInput.value =
                    "";

                loginButton.disabled =
                    true;

                hideMessage();

                emailInput.focus();

            }

        );

    }

);

emailInput.addEventListener(

    "input",

    () => {

        hideMessage();

        if (!selectedRole) {

            loginButton.disabled =
                true;

            return;

        }

        const email =
            emailInput
                .value
                .trim();

        const emailIsValid =

            email !== ""

            &&

            emailInput.validity.valid;

        loginButton.disabled =
            !emailIsValid;

    }

);

loginForm.addEventListener(

    "submit",

    event => {

        event.preventDefault();

        if (!selectedRole) {

            showMessage(

                "Selecciona primero el perfil al que deseas ingresar."

            );

            return;

        }

        const email =
            emailInput
                .value
                .trim();

        if (email === "") {

            showMessage(

                "Ingresa un correo electrónico."

            );

            return;

        }

        if (!emailInput.validity.valid) {

            showMessage(

                "Ingresa un correo electrónico válido."

            );

            return;

        }

        const profile =
            profiles[selectedRole];

        if (!profile) {

            showMessage(

                "No fue posible determinar el perfil seleccionado."

            );

            return;

        }

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

        window.location.href =
            profile.page;

    }

);

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

function hideMessage() {

    loginMessage.textContent =
        "";

    loginMessage
        .classList
        .remove(
            "show"
        );

}

