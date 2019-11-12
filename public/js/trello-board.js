import { API } from './apiService.js';
import './trello-column.js';
import './add-column.js'

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host { display: block; }
        .trello-board-wrapper,
        .trello-column-wrapper {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
                -ms-flex-direction: row;
                    flex-direction: row;
        }

        .trello-column-wrapper {
            margin: 0 4px;
            height: 100%;
            box-sizing: border-box;
            vertical-align: top;
            white-space: nowrap;
        }
    </style>
    <div class="trello-board-wrapper">
        <div class="trello-column-wrapper"></div>
        <add-column></add-column>
    </div>
`
class TrelloBoard extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.$columnsContainer = this.shadowRoot.querySelector('.trello-column-wrapper');
        this.$columnCreator = this.shadowRoot.querySelector('add-column');

        this.$columnCreator.addEventListener('addColumn', this.addColumn.bind(this));
    
        // initial state
        this._columns = [];
    
        this.fetchData.bind(this);
        this.fetchData();
    }

    async fetchData() {
        const columns = await API.get.columns();
    
        this._columns = columns;
        this._render();
    }

    async addColumn(e) {
        const { title } = e.detail;
    
        const data = await API.create.column({ title });
    
        this._columns.push(data);
    
        this._render();
    }
    
    _render() {
        if (!this.$columnsContainer) return;
    
        // redraw everything
        //
        // NOTE: poor performance but it should be ok for small boards
        //       We may run into issues quickly when we'll start
        //       drag'n'dropping cards.
        this.$columnsContainer.innerHTML = '';
    
        this._columns.forEach(({ id, title }, index) => {
            const $item = document.createElement('trello-column');
        
            $item.setAttribute('id', id);
            $item.setAttribute('title', title);
            $item.index = index;
        
            // Add event listeners
        
            this.$columnsContainer.appendChild($item);
        });
    }
}

window.customElements.define('trello-board', TrelloBoard)