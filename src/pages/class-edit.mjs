export class ClassEditPage extends HTMLElement {
  /** @type {ShadowRoot | undefined} */
  shadowRoot = undefined;

  html = () => /* html */ `
    <span>科目の編集</span>
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
