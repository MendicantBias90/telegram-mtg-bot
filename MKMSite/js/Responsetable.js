import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class Responsetable extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    };

    componentDidUpdate() {
        var node = ReactDOM.findDOMNode(this);
        if(node) {
            node.scrollIntoView({block: 'start', behavior: 'smooth'});
        }
    }

    render() {

        if (!this.props.searched && !this.props.found)
            return null;

        if (this.props.lastSearch === '')
            return (
            <div className="resoults-container">
                <div className="row">
                    Ho bisogno di almeno una carta da cercare.
                </div>
            </div>
            );

        if(this.props.searched && !this.props.found) {
            return(
                <div className="resoults-container">
                    <div className="row">
                        Mi dispiace, non riesco a trovare una o più carte.
                    </div>
                </div>
            );
        }

        var rows = this.props.cards.map(el => {
            return (
            <div className="row">
                <div className="grid-cell">
                    {el.names[0]} - {el.expansion}
                </div>
                <div className="grid-cell">
                    {el.prices.LOWEX}
                </div>
                <div className="grid-cell">
                    {el.prices.TREND}
                </div>
            </div>
           );
        });

        return (
            <div className="resoults-container">
                <div className="row">
                    <div className="grid-cell">
                        Titolo della carta
                    </div>
                    <div className="grid-cell">
                        Prezzo minimo (€)
                    </div>
                    <div className="grid-cell">
                        Prezzo di tendenza (€)
                    </div>
                </div>
                {rows}
            </div>
        );
    };
};
