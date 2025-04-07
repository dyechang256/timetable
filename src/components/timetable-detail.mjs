import { basicStyle } from "../shared/style.mjs";
import { TABLE_STORE_NAME, CLASS_STORE_NAME, DB, TABLE_STORE_KEY } from "../shared/db.mjs";

export class TimetableDetailComponent extends HTMLElement {
  /** @type {ShadowRoot | undefined} */
  shadowRoot = undefined;

  /** @type {import("../types.mjs").TableData} */
  tableData = undefined;
  /** @type {import("../types.mjs").ClassData[]} */
  classDatas = [];

  get classData() {
    return this.classDatas.find((classData) => classData.id === this.tableData?.classId);
  }

  /** 編集モードに入っていれば真 */
  isEditing = false;

  static observedAttributes = ["day-period"];
  get dayPeriod() {
    return this.getAttribute("dayperiod");
  }

  get day() {
    return this.dayPeriod.split("-")[0];
  }
  get period() {
    return this.dayPeriod.split("-")[1];
  }

  css = () => /* css */ `
    ${basicStyle}

    :host .timetable-detail {
      height: 100%;
      width: 100%;
      padding: 16px;

      > .empty {
        height: 100%;
        width: 100%;
        display: grid;
        place-content: center;
        color: gray;
      }

      > .header {
        height: 32px;
        width: 100%;
        display: flex;
        align-items: center;

        & > button.header-button {
          height: 32px;
          width: 32px;
          margin-left: auto;
          border: none;
          display: grid;
          place-content: center;
          background-color: transparent;
          font-size 24px;
        }

        & > button.header-button > img {
          height: 24px;
          width: 24px;
          object-fit: contain;
        }


      }

      & select {
        height: 32px;
        width: 100%;
        padding: 0 16px;
        border-radius: 100vh;
      }
    }
  `;

  html = () => {
    /** 時間が未選択のときに表示する内容 */
    const empty = () => /* html */ `
      <div class="empty">
        <span>授業を選択してください</span>
      </div>
    `;

    /** 空きコマが設定できるように、セレクトボックスの候補で使う配列に空きコマを追加しておく */
    const classDatas = [{ id: "empty", name: "空き" }, ...this.classDatas];
    /** 時間が選択済みのときに表示する内容 */
    const contentfull = () => /* html */ `
      <div class="header">
        <span>${this.day}曜日 ${this.period}時間目</span>
        <button class="header-button">
        <img src="src/assets/icons/${this.isEditing ? "save_icon.svg" : "pencil_icon.svg"}" alt="${
      this.isEditing ? "保存" : "編集"
    }" />
          </button>
      </div>
      <div>${
        this.isEditing
          ? /* html */ `<select id="class-select">${classDatas.map(
              (classData) => /* html */ `
                  <option value="${classData.id}" ${
                classData.id === this.classData?.id ? "selected" : ""
              }>${classData.name}</option>
              `
            )}</select>`
          : !this.tableData || !this.classData
          ? /* html */ `<span>空きコマ</span>`
          : /* html */ `<span>${this.classData.name}</span>`
      }</div>
    `;

    return /* html */ `
    <style>${this.css()}</style>
    <div class="timetable-detail">
      ${!this.dayPeriod ? empty() : contentfull()}
    </div>
    `;
  };

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    if (this.dayPeriod) {
      this.tableData = await DB.get(TABLE_STORE_NAME, this.dayPeriod);
    }
    this.classDatas = await DB.getAll(CLASS_STORE_NAME);

    this.classList = this.render();
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === "dayperiod") {
      this.isEditing = false;
      this.tableData = /** @type {import("../types/table-data.mjs").TableData} */ (
        await DB.get(TABLE_STORE_NAME, newValue)
      );
      this.render();
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.html();

    if (this.dayPeriod) {
      this.shadowRoot
        .querySelector("button.header-button")
        .addEventListener("click", this.onClickHeaderButton);
    }
  }

  onClickHeaderButton = async () => {
    if (this.isEditing) {
      const id = /** @type {HTMLSelectElement} */ (
        this.shadowRoot.querySelector("select#class-select")
      ).value;
      if (id === "empty") {
        this.tableData = undefined;
        await DB.delete(TABLE_STORE_NAME, this.dayPeriod);
      } else {
        this.tableData = { dayperiod: this.dayPeriod, classId: id };
        await DB.set(
          TABLE_STORE_NAME,
          /** @type {import("../types.mjs").TableData} */ (this.tableData)
        );
      }
      // 親になるHomePageで時間割表の内容が書き換えられたことを検知するため
      this.dispatchEvent(
        new CustomEvent("tableItemChange", { bubbles: true, composed: true, detail: null })
      );

      // location.reload(); // ページ全体をリロード
    }
    this.isEditing = !this.isEditing;
    this.render();
  };
}
