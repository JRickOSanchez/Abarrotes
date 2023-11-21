export default class Login extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    await this.#render(shadow);
    this.#setupEventListeners(shadow);
    this.#funcion(shadow); // Llamamos a la función #funcion después de configurar los eventos
  }

  async #render(shadow) {
    try {
      const response = await fetch("./LoginComponent/login.html");
      if (!response.ok) {
        throw new Error(`Error loading HTML: ${response.status}`);
      }

      const html = await response.text();
      shadow.innerHTML = html;
    } catch (error) {
      console.error(error);
    }
  }

  #setupEventListeners(shadow) {
    const forms = shadow.querySelector(".forms");

    forms.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Obtener los valores del formulario
      const username = shadow.querySelector("#username").value;
      const password = shadow.querySelector("#password").value;

      try {
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Obtener el usuario después de hacer login
          const loggedInUser = data.user; // Ajusta según la respuesta del backend

          // Puedes usar loggedInUser según tu lógica aquí
          console.log("Usuario después de login:", loggedInUser);

          // Ejemplo de redirección después del login
          window.location.href = "/dashboard";
        } else {
          console.error("Error en el inicio de sesión:", data.message);
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    });
  }

  #funcion(shadow) {
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
  }
}