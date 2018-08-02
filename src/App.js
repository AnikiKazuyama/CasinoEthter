import React, { Component } from 'react'
import CasinoContract from '../build/contracts/Casino.json'
import getWeb3 from './utils/getWeb3'

import Card from './components/Card';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const NUMBER_OF_CARDS = 10;
const GREET = "Добро пожаловать в наше казино";

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accounts: [],
      CasinoInstance: null,
      web3: null
    }
  }

  async componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    const web3 = await getWeb3;
    await this.setState({
      web3: web3.web3
    })
  
    await this.getAccounts()
    await this.instantiateContract()
  }
  
  getAccounts = async () => {
    const eth = await this.state.web3.eth;
    await eth.getAccounts((error, accounts) => { this.setState({ accounts }); console.log(accounts) });
  }

  instantiateContract = async () => {
    const contract = require('truffle-contract')
    const Casino = contract(CasinoContract)
    Casino.setProvider(this.state.web3.currentProvider)
    Casino.deployed().then((instance) => {
      this.setState({CasinoInstance: instance});
    })
  }

  render() {
    return (
      <main className="main">
        <div className="main__inner">
          <h1 className="article article--1">{ GREET }</h1>
          <p>Описание будет тут</p>
          <div className="cards-container">
            { this.renderContent() }
          </div>
          <button onClick={ this.resetDapp }>Ресет</button>
          <button onClick={ this.showPool }>Показать пулл</button>
        </div> 
      </main>
    );
  }

  renderContent() {
    return this.renderCards(NUMBER_OF_CARDS);
  }

  renderCards(numberOfCard) {
  
    let cards = [];

    for (let i = 0; i < numberOfCard; i++) {
      cards.push(<div className="card-container" key={ i }><Card onClick={ () => this.handleClick(i + 1) } number={ i + 1 }/></div>)
    }

    return cards;
  }

  handleClick = (number) => {
    this.bet(number)
  }

  bet = (number) => {
    const web3 = this.state.web3;

    const CasinoInstance = this.state.CasinoInstance;

    CasinoInstance.playerInfo.call(this.state.accounts[0]).then((value) => { console.log(value) });
    CasinoInstance.bet(number, { from: this.state.accounts[0], value: web3.toWei(0.3, 'ether'), gas: 771704 });
  }

  resetDapp = () => {
    console.log(this.state.accounts[0]);
    this.state.CasinoInstance.resetData({ from: this.state.accounts[0], gas: 771704 });
  }

  showPool = async () => {
    const pool = await this.state.CasinoInstance.totalBet();
    
    console.log(pool);
  }

}

export default App
