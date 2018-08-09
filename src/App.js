import React, { Component } from 'react'
import CasinoContract from '../build/contracts/Casino.json'

import Web3Provider from './utils/Web3Provider';

import Card from './components/Card';
import EnterGameContainer from './containers/EnterGameContainer';

import './App.css'

const NUMBER_OF_CARDS = 10;
const GREET = "Добро пожаловать в наше казино";

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bet: '',
      inGame: false,
      accounts: [],
      CasinoInstance: null,
      winingNumber: null,
      web3: null
    }
  }

  async componentWillMount() {
    this.instantiateContract();
  }
  
  getAccounts = async () => {
    const eth = await this.state.web3.eth;
    await eth.getAccounts((error, accounts) => { this.setState({ accounts }); console.log(accounts) });
  }

  instantiateContract = async () => {
    const web3 = await Web3Provider;

    const contract = require('truffle-contract')
    const Casino = contract(CasinoContract)

    Casino.setProvider(await web3.getCurrentProvider())
    return await Casino.deployed();
  }

  render() {
    return (
      <main className="main">
        <div className="main__inner">
          <h1 className="article article--1">{ GREET }</h1>
          { this.renderWiningNumber() }
          { this.renderContent() }
        </div> 
      </main>
    );
  }

  renderContent() {
    return this.state.inGame ? (
      <div>
        <input type='text' placeholder="Ваша ставка" value={ this.state.bet } onChange={ this.handleInputChange } ref={ (ref) => this.input = ref } />
        <div className="cards-container">
          { this.renderCards(NUMBER_OF_CARDS) }
        </div>
      </div>  
    ) :
        this.renderEnterTheGame();
  }

  renderCards(numberOfCard) {
  
    let cards = [];

    for (let i = 0; i < numberOfCard; i++) {
      cards.push(<div className="card-container" key={ i }><Card onClick={ () => this.handleClick(i + 1) } number={ i + 1 }/></div>)
    }

    return cards;
  }

  renderEnterTheGame() {
    return <EnterGameContainer/>
  }

  renderWiningNumber() {
    const content = (
      <p>Выигрышный номер - { this.state.winingNumber }</p>
    );

    return this.state.winingNumber ? content : '';
  }

  handleInputChange = (event) => {
    this.setState({
      bet: event.target.value
    })
  }

  handleClick = (number) => {
    this.bet(number)
  }

  bet = (number) => {
    const web3 = this.state.web3; 

    const CasinoInstance = this.state.CasinoInstance;
    console.log(number);
    CasinoInstance.bet(number, { from: this.state.accounts[0], value: web3.toWei(this.state.bet, 'ether'), gas: 771704 });
  }

  contractBalance = async () => {
    const contractBalance = await this.state.CasinoInstance.balanceOFCS.call();

    console.log(this.state.web3.fromWei(contractBalance.toString(), 'ether'));
  }

  showPool = async () => {
    const pool = await this.state.CasinoInstance.totalBet.call({from: this.state.accounts[0]});

    console.log(this.state.web3.fromWei(pool, 'ether').toString());
  }

  showBets = async () => {
    const bets = await this.state.CasinoInstance.numberOfBets.call({from: this.state.accounts[0]});

    console.log(bets.toString())
  }

  getOwnerAddress = async () => {
    const address = await this.state.CasinoInstance.getOwner.call(); 
    console.log("Адрес хранителя контракта " + address.toString());
  }

  getPlayer = async () => {
    const players = await this.state.CasinoInstance.getPlayer.call(0);

    console.log(players);
  }

  getAccountInfo = async () => {
    const accountAddress = this.state.accounts[0];
    const accountInfo = await this.state.CasinoInstance.getPlayerInfo.call(accountAddress, { from: accountAddress });

    console.log(accountInfo[0].toString(), accountInfo[1].toString());
  }

  start = async () => {
    const CasinoInstance = this.state.CasinoInstance;

    const winingNumber = await CasinoInstance.generateNumberWinner.call({ from: this.state.accounts[0], gas: 771704 });
    await CasinoInstance.generateNumberWinner({ from: this.state.accounts[0], gas: 771704 })
    this.setState({
      winingNumber: winingNumber.toString()
    })
  }

  sendContractBalanceToOwner = async () => {
    await this.state.CasinoInstance.sendContractBalanceToOwner({ from: this.state.accounts[0], gas: 771704 });
  }
}

export default App
