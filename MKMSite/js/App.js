import React, {Component} from 'react';
import Requestform from './Requestform';
import Responsetable from './Responsetable';
import CardsList from './CardsList';

export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searched: false,
            found: false,
            lastSearch: '',
            cardList: [],
            listVisible: false,
            cards: [],
        };
    }

    onSearch(string) {
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
            var names = [];
            data.forEach(function(el) {
                var singleName = el.names[0].replace(/\s\(Version\s\d+\)/, '');

                if(names.indexOf(singleName) === -1)
                    names.push(singleName);
            });
            return names;
        })
        .then(data => {
            this.setState({
                cardList: data,
                listVisible: true,
                searched: false,
                found: false,
            });
        })
        .catch((e) => {
            this.setState({
                listVisible: false,
                searched: true,
                found: false,
                lastSearch: string,
            });
        });
    }

    handleClick(card) {
        fetch(`http://localhost:3002/price?name=${card.trim()}`)
        .then(response => {
            return response.json();
        })
        .then(res => {
            var results = res.filter(el => el.names[0] === card);
            return results;
        })
        .then(data => {
            this.setState({
                listVisible: true,
                cards: data,
                found: true,
                searched: true,
                lastSearch: card,
            });
        })
        .catch((e) => {
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
                <CardsList
                    cards={this.state.cardList}
                    listVisible={this.state.listVisible}
                    onClick={(card) => this.handleClick(card)} />
                <Responsetable
                    searched={this.state.searched}
                    cards={this.state.cards}
                    found={this.state.found}
                    lastSearch={this.state.lastSearch} />
            </div>
        );
    }
};
