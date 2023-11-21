import Login from "./LoginComponent/login.js";
import Signup from "./SignupComponent/signup.js";
import Tabla from "./TablaComponent/tabla.js";

window.customElements.define("login-component", Login);
window.customElements.define("signup-component", Signup);
window.customElements.define("tabla-component", Tabla);

document.addEventListener("DOMContentLoaded", function () {
  page("/index.html", () => showLogin());
  page("/signup", () => showSignup());
  page("/tabla", () => showTabla());
  page();
});

function showLogin() {
  const body = document.querySelector("body");

  body.innerHTML = `<login-component></login-component>`;
}

function showSignup() {
  const body = document.querySelector("body");

  body.innerHTML = `<signup-component></signup-component>`;
}

function showTabla() {
  const body = document.querySelector("body");

  body.innerHTML = `<tabla-component></tabla-component>`;
}
