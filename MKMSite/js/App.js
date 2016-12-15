import React, {Component} from 'react';
import Requestform from './Requestform';
import Responsetable from './Responsetable';
import CardsList from './CardsList';
import Loader from 'react-loader';

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
            loaded: true,
        };
    }

    onSearch(string) {
        this.setState({
            loaded: false,
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
                loaded: true,
            });
        })
        .catch((e) => {
            this.setState({
                listVisible: false,
                searched: true,
                found: false,
                lastSearch: string,
                loaded: true,
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
        var options = {
            lines: 13,
            length: 20,
            width: 10,
            radius: 30,
            scale: 0.25,
            corners: 1,
            color: '#3D5760',
            opacity: 0.25,
            rotate: 0,
            direction: 1,
            speed: 2,
            trail: 60,
            fps: 20,
            zIndex: 2e9,
            top: '50%',
            left: '50%',
            shadow: false,
            hwaccel: true,
            position: 'absolute'
        };


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
                <div className="container">
                    <Loader loaded={this.state.loaded} options={options}>
                        {this.state.listVisible &&
                            <CardsList
                                cards={this.state.cardList}
                                onClick={(card) => this.handleClick(card)} />
                        }
                        <Responsetable
                            searched={this.state.searched}
                            cards={this.state.cards}
                            found={this.state.found}
                            lastSearch={this.state.lastSearch} />
                    </Loader>
                </div>
            </div>
        );
    }
};
