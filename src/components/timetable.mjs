import { CLASS_STORE_NAME, DB, TABLE_STORE_NAME } from "../shared/db.mjs";
import { basicStyle } from "../shared/style.mjs";

export class TimetableComponent extends HTMLElement {
  /** @type {ShadowRoot | undefined} */
  shadowRoot = undefined;
  /** @type {import("../types.mjs").ClassData[]} */
  classDatas = [];
  /** @type {import("../types.mjs").TableData[]} */
  tableDatas = [];
  /** @type {render} */
  numberofItem = 0;

  static observedAttributes = ["render-id"];
  get renderId() {
    return this.getAttribute("render-id");
  }

  classDataDayPeriod = (dayperiod) => {
    const id = this.tableDatas.find((tabledata) => tabledata.dayperiod === dayperiod)?.classId;
    return this.classDatas.find((classData) => classData.id === id);
  };

  css = () => /* css */ `
    ${basicStyle}

    :host .timetable {
      width: 100%;
      height: 100%;
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: 32px repeat(5, 1fr); /**縦列を増やす */
      place-content: center;

      & > :nth-child(n + ${this.numberOfItem + 1}):nth-child(-n + ${this.numberOfItem + 5}) {
        background-color: lightgreen;
      }

      & > :nth-child(${this.numberOfItem}) {
        background-color: green;
        color: white;
      }

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
          [0, 1, 2, 3, 4, 5]
            .map((period) =>
              period === 0
                ? /* html */ `
                <div class="table-header">
                  <span>${day}</span>
                </div>
              `
                : /* html */ `
                <div class="class-item" dayperiod="${`${day}-${period}`}" >
                  <span>${this.classDataDayPeriod(`${day}-${period}`)?.name || "空き"}</span>
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

  async attributeChangedCallback(name, oldValue, newValue) {
    if ((name = "render-id")) {
      this.render();
    }
  }

  async connectedCallback() {
    this.classDatas = await DB.getAll(CLASS_STORE_NAME);
    this.tableDatas = await DB.getAll(TABLE_STORE_NAME);

    //日曜から初めて０～６
    const dayOfWeek = new Date().getDay() - 1;
    //本来日曜が０だけど、月曜が０の方が解りやすいよね
    this.numberOfItem = 6 * dayOfWeek + 1;

    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = this.html();

    this.shadowRoot.querySelectorAll("div.class-item").forEach((elem) => {
      elem.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("tableItemClick", {
            bubbles: true,
            composed: true,
            detail: elem.getAttribute("dayperiod"),
          })
        );
      });
    });
  }
}
