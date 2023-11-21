export default class Login extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    await this.#render(shadow);
    this.#funcion(shadow);
  }

  async #render(shadow) {
    await fetch("./LoginComponent/login.html")
      .then((response) => response.text())
      .then((html) => {
        shadow.innerHTML += html;
      })
      .catch((error) => {
        console.error("Error loading HTML: " + error);
      });
  }

  #funcion(shadow) {
    const forms = shadow.querySelector(".forms"),
      pwShowHide = shadow.querySelectorAll(".eye-icon"),
      links = shadow.querySelectorAll(".link");

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
