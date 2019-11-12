import { API } from './apiService.js';
import './trello-card.js'

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

        .column-item h3 {
            font-size: 20px;
            line-height: 24px;
            margin: 0;
            padding: 0 8px;
        }
        
        .column-container__header {
            text-align: center;
        }
        
        #cards {
            height: -webkit-fill-available;
        }
    </style>
    <div class="column-item">
        <h3 id="column-wrapper__header"></h3>
        <div class="cards-container"></div>
    </div>
`;

class TrelloColumn extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        // init state
        this._id = this.getAttribute('id') || null;
        this._title = this.getAttribute('title') || null;
        this._cards = [];
    }

    connectedCallback() {
        this.$title = this.shadowRoot.querySelector('#column-wrapper__header');
        this.$cardsContainer = this.shadowRoot.querySelector('.cards-container');

        this._render();
        this.fetchData();
    }

    static get observedAttributes() {
        return ['id', 'title'];
    }
    
    attributeChangedCallback(name, _, newValue) {
        this[`_${name}`] = newValue;
    }

    async fetchData() {
        const cards = await API.get.cards(`columnId=${this._id}`);
        console.log(cards);
        this._cards = cards;

        this._render();
    }

    _render() {
        this.$title.textContent = this._title;

        this.$cardsContainer.innerHTML = '';

        this._cards.forEach(({ id, title, description, columnId }, index) => {
            // instantiate a new column
            const $item = document.createElement('trello-card');

            $item.setAttribute('id', id);
            $item.setAttribute('title', title);
            $item.setAttribute('columnId', columnId);
            $item.setAttribute('description', description || '');

            $item.index = index;

            // Add evenlistners

            this.$cardsContainer.appendChild($item);
        });
    }
}

window.customElements.define('trello-column', TrelloColumn);