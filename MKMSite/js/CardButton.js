import React, {Component} from 'react';

export default class CardButton extends Component {

    render () {
        return <button type="card" onClick={() => this.props.onClick()}>{this.props.card}</button>;
    };
}
