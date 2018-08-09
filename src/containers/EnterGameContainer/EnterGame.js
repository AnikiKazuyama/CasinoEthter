import React, { Component } from 'react';

import EnterGame from '../../components/EnderGame';


import Web3Provider from '../../utils/Web3Provider';
import Roulette from '../../Models/Roulette';

export default class EnterGameContainer extends Component {

    constructor() {
        super();

        this.state = {
            name: '', 
            error: {
                exist: false,
                type: 'Validation error',
                message: 'Имя не должно быть пустым'
            }
        }
    }

    render() {
       return <EnterGame enter={ this.enterGame } onNameChange={ this.onNameInputChange } error={ this.state.error }/>
    }

    enterGame = async () => {
        const roulette = Roulette;
        const name = this.state.name;

        if(name) {
            const web3 = Web3Provider;
            const user = await web3.getUserAddress();
            console.log(user);
            // await roulette.addPlayer(name, { from: user, gas: 30000 });
            this.toggleError();
        }

        this.toggleError();
    }

    toggleError() {
        this.setState((prevState) => {
            return {
                ...prevState, 
                exist: !prevState.exist
            }
        });
    }

    onNameInputChange = (name) => {
        this.setState({ name });
    }
}