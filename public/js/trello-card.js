const template = document.createElement('template');

template.innerHTML = `
    <style>
        .card-container {
            width: -webkit-fill-available;
            padding: 10px;
            margin-top: 5px;
            margin-bottom: 5px;
            background: white;
            color: #172b4d;
            font-size: 14px;
        }

        .card-container h4 {
            line-height: 24px; font-weight: 600; margin: 0 0 8px;
        }
    </style>
    <div class="card-container">
        <h4 class="card-container__title"></h4>
        <div class="card-container__description"></div>
    </div>
`;

class TrelloCard extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        // init state
        this._title = '';
        this._description = '';
        this._columnId = null;
    }
    
    connectedCallback() {
        this.$card = this.shadowRoot.querySelector('.card-container');
        this.$title = this.shadowRoot.querySelector('.card-container__title');
        this.$description = this.shadowRoot.querySelector('.card-container__description');

        this._render();
    }

    static get observedAttributes() {
        return ['id', 'title', 'description', 'columnid'];
    }

    attributeChangedCallback(name, _, newValue) {
        this[`_${name}`] = newValue;
    }

    _render() {
        this.$title.textContent = this._title;
        this.$description.textContent = this._description;
    }
}

customElements.define('trello-card', TrelloCard)