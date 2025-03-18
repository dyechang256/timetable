import { basicStyle } from "../shared/style.mjs";

export class TimetableComponent extends HTMLElement {
  /** @type {ShadowRoot | undefined} */
  shadowRoot = undefined;

  css = () => /* css */ `
    ${basicStyle}

    :host .timetable {
      width: 100%;
      height: 100%;
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: 32px repeat(4, 1fr);
      place-content: center;

      & > div {
        width: 100%;
        height: 100%;
        display: grid;
        place-content: center;
      }
    }
  `;

  html = () => /* html */ `
    <style>${this.css()}</style>
    <div class="timetable">
      ${["月", "火", "水", "木", "金"]
        .map((day) =>
          [0, 1, 2, 3, 4]
            .map((period) =>
              period === 0
                ? /* html */ `
                <div class="table-header">
                  <span>${day}</span>
                </div>
              `
                : /* html */ `
                <div class="class-item">
                  <span>${day}${period}</span>
                </div>
              `
            )
            .join("")
        )
        .join("")}
    </div>
  `;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = this.html();
  }
}
