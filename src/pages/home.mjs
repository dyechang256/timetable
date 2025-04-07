import { basicStyle } from "../shared/style.mjs";
import { time } from "../shared/classtime.mjs";
import { CLASS_STORE_NAME, DB, TABLE_STORE_NAME } from "../shared/db.mjs";

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
            font-size: 24px;
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
          <span class="time">読み込み中</span>
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

    this.updateTime();

    this.shadowRoot.addEventListener("tableItemClick", (event) => {
      this.dayperiod = event.detail;
      this.render();
      this.updateTime(); // 時間を再更新
    });
    this.shadowRoot.addEventListener("tableItemChange", async () => {
      const timetableComponent = this.shadowRoot.querySelector("timetable-component");
      timetableComponent.classDatas = await DB.getAll(CLASS_STORE_NAME);
      timetableComponent.tableDatas = await DB.getAll(TABLE_STORE_NAME);
      timetableComponent.render(); // 時間割を再描画

      // 時間を再計算して更新
      this.updateTime();
    });
  }

  async updateTime() {
    try {
      const nextTime = await time(); // time() の結果を待機
      const timeElement = this.shadowRoot.querySelector(".time");
      timeElement.textContent = nextTime; // 結果を設定
    } catch (error) {
      console.error("Error updating time:", error);
      const timeElement = this.shadowRoot.querySelector(".time");
      timeElement.textContent = "エラーが発生しました";
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.html();
  }
}
