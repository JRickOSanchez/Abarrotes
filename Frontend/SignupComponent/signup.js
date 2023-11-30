export default class Signup extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    await this.#render(shadow);
    this.#signup(shadow);
  }

  async #render(shadow) {
    await fetch("./SignupComponent/signup.html")
      .then((response) => response.text())
      .then((html) => {
        shadow.innerHTML += html;
      })
      .catch((error) => {
        console.error("Error loading HTML: " + error);
      });
  }

  #signup(shadow) {
    const forms = shadow.querySelector(".forms");
    const pwShowHide = shadow.querySelectorAll(".eye-icon");

    pwShowHide.forEach((eyeIcon) => {
      eyeIcon.addEventListener("click", () => {
        let pwFields =
          eyeIcon.parentElement.parentElement.querySelectorAll(".password");
        pwFields.forEach((password) => {
          if (password.type === "password") {
            password.type = "text";
            eyeIcon.classList.replace("bx-hide", "bx-show");
            return;
          }
          password.type = "password";
          eyeIcon.classList.replace("bx-show", "bx-hide");
        });
      });
    });

    // Agregar el manejo del evento de registro aquí si es necesario
    const signupButton = shadow.querySelector(".signup-button");
    signupButton.addEventListener("click", () => {
      // Lógica para enviar la información del formulario al backend y manejar el registro
      const username = shadow.querySelector(".input-username").value;
      const password = shadow.querySelector(".input-password").value;
      const rol = shadow.querySelector(".input-rol").value;

      // Enviar datos al backend
      fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, rol }),
      })
      .then((response) => {
        if (response.ok) {
          // Registro exitoso, redirigir a la página de inicio de sesión
          window.location.href = '/login';
        } else {
          // Manejar errores en el registro
          console.error('Error en el registro');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    });
  }
}