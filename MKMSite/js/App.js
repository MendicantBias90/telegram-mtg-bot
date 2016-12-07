import React, {Component} from 'react';
import Requestform from './Requestform';
import Responsetable from './Responsetable';

export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searched: false,
            found: false,
            lastSearch: '',
            cards: [],
        };
    }

    onSearch(string) {
        this.setState({
            lastSearch: string,
        });

        var promises = string.split(',').map(el => {
            return fetch(`http://localhost:3002/price?name=${el.trim()}`)
                .then(response => {
                    return response.json();
                });
        });

        Promise.all(promises)
        .then(res => {
            return res.reduce((a, b) => {
                return a.concat(b);
            });
        })
        .then(data => {
            console.log('Data');
            console.log(data);

            this.setState({
                cards: data,
                found: true,
                searched: !data.message,
            });
        })
        .catch((e) => {
            console.log('Yep, an error occourred');
            console.log(e);
            this.setState({
                found: false,
                searched: true,
            });
        });
    }

    render() {
        return (
            <div className="container">
                <div className="jumbotron">
                    <h1>BOT di ricerca prezzi</h1>
                    <span></span>
                </div>
                <Requestform
                    onSearch={(stringa) => this.onSearch(stringa)}
                    lastSearch={this.state.lastSearch}
                    searched={this.state.searched} />
                <Responsetable
                    searched={this.state.searched}
                    cards={this.state.cards}
                    found={this.state.found} />
            </div>
        );
    }
};
