const template = document.createElement('template');
template.innerHTML = `
    <style>
        .column-item {
            color: #172b4d;
            width: 300px;
            overflow: auto;
            margin-right: 10px;
            padding: 20px;
            background-color: #ebecf0;
            border-radius: 3px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            max-height: 100%;
            position: relative;
            white-space: normal;
        }

        .column-item input {
            color: #172b4d;
            box-sizing: border-box;
            -webkit-appearance: none;
            border-radius: 3px;
            padding: 8px 12px;
            line-height: 20px;
        }

        .column-item.mod-add input {
            background: #fff;
            border: none;
            box-shadow: inset 0 0 0 2px #0079bf;
            display: block;
            margin: 0;
            transition: margin 85ms ease-in,background 85ms ease-in;
            width: 100%;
        }

        .column-item button.primary {
            background-color: #5aac44;
            box-shadow: none;
            border: none;
            border-radius: 4px;
            color: #fff;
            height: 32px;
            padding: 4px 10px;
            margin-top: 10px;
        }
    </style>
    <div class="column-item mod-add">
        <form id="new-column-form">
            <input id="new-column-input" type="text" placeholder="Enter column title..." />
            <button class="primary" type="submit">Add column</button>
        </form>
    </div>
`

class AddColumn extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.$form = this.shadowRoot.querySelector('form');
        this.$input = this.shadowRoot.querySelector('input');
        this.$form.addEventListener('submit', e => {
        e.preventDefault();

        if (!this.$input.value) return;
        // TODO: check unicity of title here ?
        this.dispatchEvent(
            new CustomEvent('addColumn', { detail: { title: this.$input.value } })
        );
        this.$input.value = '';
        });
    }
}

window.customElements.define('add-column', AddColumn);