import { basicStyle } from "../shared/style.mjs";

export class FloatingLink extends HTMLElement {
  static observedAttributes = ["href", "emoji"];
  shadowRoot = undefined;
  dialog = undefined;

  get href() {
    return this.getAttribute("href");
  }

  get emoji() {
    return this.getAttribute("emoji");
  }

  css = /*css*/ `
    ${basicStyle}
    
    :host {
      width: fit-content;
      height: fit-content;
      position: absolute;
      bottom: 1em;
      right: 1em;
      z-index: 10;

      & > button {
        width: 48px;
        height: 48px;
        border: none;
        border-radius: 100vh;
        background-color: lightblue;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        cursor: pointer;
        font-size: 2em;
      }

      & dialog {
        width: fit-content;
        height: fit-content;
        padding: 1em;
        border: none;
        border-radius: 1em;
        margin: auto;

        & .content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1em;

          & .title {
            margin: 0 auto;
            font-size: 1.5em;
            font-weight: bold;
          }
        }
      }
    }
  `;

  html = /*html*/ `
    <style>${this.css}</style>
    <button id="setting-button" type="button">
      <span class="setting-button-text">${this.emoji}</span>
    </button>
  `;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = this.html;
    this.shadowRoot.getElementById("setting-button").addEventListener("click", () => {
      window.location.href = this.href;
    });
  }
}
