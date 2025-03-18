import { basicStyle } from "../shared/style.mjs";

export class TimetableDetailComponent extends HTMLElement {
  /** @type {ShadowRoot | undefined} */
  shadowRoot = undefined;

  static observedAttributes = ["day-period"];
  /** @type {import("../types.mjs").ClassData} */
  get dayPeriod() {
    return this.getAttribute("dayperiod");
  }

  get day() {
    return this.dayperiod.split("-")[0];
  }
  get period() {
    return this.dayperiod.split("-")[1];
  }

  css = () => /* css */ `
    ${basicStyle}

    :host .timetable-detail {
      height: 100%;
      width: 100%;
      padding: 16px;
      border-top: 2px solid lightgray;

      > .empty {
        width: 100%;
        height: 100%;
        display: grid;
        place-content: center;
        color: gray;
      }
    }
  `;

  html = () => /* html */ `
    <style>${this.css()}</style>
    <div class="timetable-detail">
      ${
        !this.dayperiod
          ? /*html */ `
              <div class="empty">
                <span>授業を選択してください</span>
              </div>
            `
          : /*html */ `<span>${this.dayPeriod}</span>`
      }
    </div>
  `;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = this.html();
  }
}
