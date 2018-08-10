import React, { Component, Fragment } from 'react'

import Web3Provider from './utils/Web3Provider';
import Roulette from './Models/Roulette';

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
      isOwner: false,
      gameStatus: 'Waitnig',
      winners: [],
      winNumber: null,
    }
  }

  async componentDidMount() {
    this.watchGameEnd();
    await this.inGameCheck();
    await this.isOwner();
  }

  async componentWillUnmount() {
    this.unSubscribeInGameCheck();
  }

  render() {
    return (
      <Fragment>
        <header className="header"><div className="container">{ GREET }</div></header>
        <main className="main">
          <div className="container">
            { this.renderContent() }
          </div> 
        </main>
      </Fragment>
    );
  }

  // Start-Render-stuff
  renderContent() {
    if(this.state.inGame){
      const button = <button onClick={ this.startGame }>Начать розыгрыш</button>; 
     
      return (
        <div>
          { this.state.isOwner ? button : null }
          { this.renderEndGameInfo() }
          <div className="cards-container">
            { this.renderCards(NUMBER_OF_CARDS) }
          </div>
        </div>  
      )
    }  

    return this.renderEnterTheGame();
  }

  renderEndGameInfo() {
    if(this.state.gameStatus === "Ended") {
      return (
        <Fragment>
          { this.renderWiningNumber() }
          { this.renderWinners() }
        </Fragment>
      );
    }

    return null;
  }

  renderCards(numberOfCard) {
    let cards = [];

    for (let i = 0; i < numberOfCard; i++) {
      cards.push(<div className="card-container" key={ i }><Card onClick={ async () => await this.handleClick(i + 1) } number={ i + 1 }/></div>)
    }

    return cards;
  }

  renderEnterTheGame() {
    return <EnterGameContainer inGameCheck={ this.inGameCheck }/>
  }

  renderWinners = () => {
    return this.state.winners.map((winer, index) => {
      return <div key={ index }>Победители<span style={{ marginRight: '8px' }}>{ winer }</span></div>
    });
  }

  renderWiningNumber() {
    const content = (
      <p>Выигрышный номер - { this.state.winNumber }</p>
    );

    return this.state.winNumber ? content : '';
  }

  // End-Render-stuff

  //Start-handling-inputs

  handleInputChange = (event) => {
    this.setState({
      bet: event.target.value
    })
  }

  handleClick = async (number) => {
    await this.bet(number);
  }

  //End-handling-inputs
  //Start-Game-action
  startGame = async () => {
    const web3 = await Web3Provider;
    const roulette = await Roulette;

    await roulette.startGame({ from: await web3.getUserAddress() });
    this.setState({ gameStatus: 'Started' });
  }
  
  bet = async (number) => {
    const web3 = await Web3Provider;
    const roulette = await Roulette;

    await roulette.bet(number, { from: await web3.getUserAddress() });
  }
  //End-Game-action
  //Start-Events
  inGameCheck = async () => {
    const web3 = await Web3Provider;
    const roulette = await Roulette;

    const userAddress = await web3.getUserAddress();
    const inGame = await roulette.checkAuth( userAddress ); 
  
    this.setState({ inGame });
  }

  watchGameEnd = async () => {
    const roulette = await Roulette;

    roulette.watchGameEnd(this.onGameEnd);
  }
  
  unSubscribeInGameCheck = async () => {
    const roulette = await Roulette;
    
    roulette.stopWatchGameEnd();
  }

  onGameEnd = (error, result) => {
    const { winners, winNumber } = result.args;
  
    this.setState({
      winners,
      winNumber: winNumber.toString(), 
      gameStatus: 'Ended'
    });
  }

  //End-Events
  //Start-Common
  isOwner = async () => {
    const web3 = await Web3Provider;
    const roulette = await Roulette;

    const isOwner = await roulette.isOwner({ from: await web3.getUserAddress() });
  
    this.setState({ isOwner });
  }
  //EndC-Common
}

export default App
