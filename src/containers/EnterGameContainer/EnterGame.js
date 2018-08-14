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
        const roulette = await Roulette;
        const name = this.state.name;
        
        if(name) {
            const web3 = await Web3Provider;
            const userAddress = await web3.getUserAddress();
            console.log(userAddress)
            await roulette.addPlayer(name, { from: userAddress });
        }
    }

    toggleError() {
        this.setState((prevState) => {
            return {
                ...prevState, 
                exist: !prevState.exist
            }
        });
    }

    onNameInputChange = (event) => {
        this.setState({ name: event.target.value });
    }
}