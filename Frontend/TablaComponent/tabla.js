export default class Tabla extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    await this.#render(shadow);
    this.#validateForm(shadow);
  }

  async #render(shadow) {
    await fetch("./TablaComponent/tabla.html")
      .then((response) => response.text())
      .then((html) => {
        shadow.innerHTML += html;
      })
      .catch((error) => {
        console.error("Error loading HTML: " + error);
      });
  }

  #validateForm(shadow) {
    //Aqui entra el codigo del crud para la tabla
  }
}
