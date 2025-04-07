import { CLASS_STORE_NAME, DB } from "../shared/db.mjs";
import { basicStyle } from "../shared/style.mjs";

export class ClassEditPage extends HTMLElement {
  /** @type {ShadowRoot | undefined} */
  shadowRoot = undefined;

  classId = new URLSearchParams(window.location.search).get("classId") || crypto.randomUUID();
  /** @type {import("../types.mjs").ClassData} */
  classData = undefined;

  css = () => /* css */ `
    ${basicStyle}

    :host .class-edit {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: auto;

      & > .header {
        height: 32px;
        width: 100%;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        
        & > button {
          height: 34px;
          width: 34px;
          border: none;
          background-color: transparent;
          display:flex;
          justify-content: center;
          align-items: center;
          margin-left: 10px;
          font-size: 24px;
          text-align: center;
          text-shadow: 1px 1px 2px black;

        & > img {
          width: 34px;
          height: 34px;
          object-fit: contain;
        }
      }

        & > span {
          width: 100%;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
        }
      }

      & > .input-container {
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-columns: 100px 1fr;
        grid-template-rows: repeat(1, 32px);
        gap: 8px;

        & span {
          text-align: center;
          display: flex;
          align-items:center;
          justify-content: center;
        }

        & input {
          height: 32px;
          padding: 0 16px;
          border-radius: 100vh;
        }
      }
    }
  `;

  html = () => /* html */ `
  <style>${this.css()}</style>
  <div class="class-edit">
  <div class="class-edit">
    <div class="header">
      <button class="move-list">⬅️</button>
      
      <span>科目の編集</span>
      <button class="delete">
      <img src="src/assets/icons/trash_icon.svg" alt="削除" />
      </button>
      <button class="save">
      <img src="src/assets/icons/save_icon.svg" alt="保存" />
      </button>
      </div>
    <div class="input-container">
      <span>科目名</span>
      <input type="text" id="class-name" value="${this.classData?.name ?? ""}"/>    </div>
  </div>
`;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    this.classData = await DB.get(CLASS_STORE_NAME, this.classId);

    this.render();

    const deleteButton = this.shadowRoot.querySelector(".delete");

    deleteButton.addEventListener("click", async () => {
      const className = /** @type {HTMLInputElement} */ (
        this.shadowRoot.getElementById("class-name")
      ).value;

      if (!className) {
        alert("削除する科目名を入力してください！");
        return;
      }

      const isConfirmed = confirm(`「${className}」を削除しますか？`);
      if (!isConfirmed) return;

      try {
        await DB.delete(CLASS_STORE_NAME, this.classId);
        alert(`「${className}」を削除しました！`);
        const url = new URL(location.href);
        url.hash = "#class-list";
        location.href = url.href;
      } catch (error) {
        alert("削除に失敗しました。");
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = this.html();

    const saveButton = this.shadowRoot.querySelector("button.save");
    saveButton.addEventListener("click", async () => {
      const className = /** @type {HTMLInputElement} */ (
        this.shadowRoot.getElementById("class-name")
      ).value.trim(); // 入力した中身の空白を削除

      if (!className) {
        alert("科目名を入力してください！");
        return; // 空白の場合は処理を止める
      }

      /** @type {import("../types.mjs").ClassData} */
      const data = {
        id: this.classId,
        name: className,
      };
      await DB.set(CLASS_STORE_NAME, data);

      this.moveToList();
    });

    const moveToListButton = this.shadowRoot.querySelector("button.move-list");
    moveToListButton.addEventListener("click", this.moveToList);
  }

  moveToList() {
    const url = new URL(location.href);
    url.hash = "#class-list";
    url.search = "";
    location.href = url.href;
  }
}
