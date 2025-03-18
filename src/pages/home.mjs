import { basicStyle } from "../shared/style.mjs";

export class HomePage extends HTMLElement {
  /** @type {ShadowRoot | undefined} */
  shadowRoot = undefined;

  renderId = undefined;

  css = () => /* css */ `
    ${basicStyle}

    :host .home {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      & > timetable-component {
        height: 60%;
      }
    }
  `;

  html = () => /* html */ `
    <style>${this.css()}</style>
    <div class="home">
      <timetable-component render-id="${this.renderId}"></timetable-component>
      <timetable-detail dayperiod="${this.dayperiod ?? ""}"></timetable-detail>
      <floating-link href="#class-list" emoji="📚"></floating-link>
    </div>
  `;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    this.shadowRoot.addEventListener("tableItemClick", (event) => {
      this.dayperiod = event.detail;
      this.render();
    });
    this.shadowRoot.addEventListener("tableItemChange", () => {
      this.renderId = crypto.randomUUID();
      this.render();
    });
  }

  render() {
    this.shadowRoot.innerHTML = this.html();
  }
}
