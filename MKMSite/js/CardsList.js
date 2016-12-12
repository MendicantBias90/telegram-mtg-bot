import React, {Component} from 'react';
import CardButton from './CardButton.js';

export default class CardsList extends Component {
    handleClick(card) {
        this.props.onClick(card);
    }

    render () {
        const items = this.props.cards.map(el => {
            return (
            <CardButton
                card={el}
                onClick={() => this.handleClick(el)} />
            );
        });

        return (
                <div>
                    <p>Quale carta stai cercando?</p>
                    <div className='card-container'>
                        {items}
                    </div>
                </div>
        );
    };
}
