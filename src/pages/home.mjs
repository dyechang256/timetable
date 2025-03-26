import { basicStyle } from "../shared/style.mjs";
import { TIME } from "../shared/classtime.mjs";

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
      & > .bottom {
        height: 40%;
        display: flex;
        border-top: 2px solid green;

        & > .nextClock {
          width:30%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          & > .time {
            font-size: 32px;
          }
        }

        & > timetable-detail {
          width:70%;
        }
      }

    }
  `;

  html = () => /* html */ `
    <style>${this.css()}</style>
    <div class="home">
      <timetable-component render-id="${this.renderId}"></timetable-component>
      <div class="bottom">
        <div class="nextClock">
          <span>次は</span>
          <span class="time">13:30</span>
        </div>
        <timetable-detail dayperiod="${this.dayperiod ?? ""}"></timetable-detail>
      </div>
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
