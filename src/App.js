import React, { Component, Fragment } from 'react'

import Web3Provider from './utils/Web3Provider';
import Roulette from './Models/Roulette';

import Card from './components/Card';
import EnterGameContainer from './containers/EnterGameContainer';

import './App.css'
import './css/header.css';
import './css/gameMasterInfo.css';
import './css/gameInfo.css';
import './css/winnersList.css';

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
      owner: '', 
      etherBet: 0
    }
  }

  async componentDidMount() {
    this.watchGameEnd();
    this.watchLogs();

    await this.getPlayersCount();
    await this.inGameCheck();
    await this.isOwner();
    await this.getBet();
  }

  async componentWillUnmount() {
    this.unSubscribeInGameCheck();
  }

  render() {
    return (
      <Fragment>
        <header className="header"><div className="header__title text--center">{ GREET }</div></header>
        <main className="main">
          { this.renderGameMasterInfo() }
          { this.renderContent() }
        </main>
      </Fragment>
    );
  }

  // Start-Render-stuff
  renderContent() {
    if(this.state.inGame) {     
      return (
        <div className="content">
          { this.renderEndGameInfo() }
          <div className="container" style={{ marginBottom: 10 }}>
            <input className="container__item" type="text" onChange={ this.handleInputChnage } placeholder="Сделайте вашу ставку"/>
          </div>
          <div className="container">
            { this.renderCards(NUMBER_OF_CARDS) }
          </div>
        </div>  
      )
    }  

    return this.renderEnterTheGame();
  }

  handleInputChnage = (event) => {
    this.setState({ etherBet: event.target.value });
  }

  renderGameMasterInfo() {
    const content = (
      <div className="game-master-info container container--col">
        <div className="game-master-info__title container__item">Панель управления</div>
        { this.renderButton() }
      </div>
    );

    if(this.state.isOwner) {
      return content;
    }

    return null;
  }

  renderEndGameInfo() {
    return (
      <div className="game-info container container--col">
        <div className="game-info__title container__item">Информация о игре</div>
        { this.renderPlayersCount() }
        { this.renderWiningNumber() }
        { this.renderUserBet() }
        { this.renderWinners() }
      </div>
    );
  }

  renderCards(numberOfCard) {
    let cards = [];

    for (let i = 0; i < numberOfCard; i++) {
      cards.push(<div className="container__item card-container" key={ i }><Card onClick={ async () => await this.handleClick(i + 1) } number={ i + 1 }/></div>)
    }

    return cards;
  }

  renderEnterTheGame() {
    return <EnterGameContainer inGameCheck={ this.inGameCheck }/>
  }

  renderWinners = () => {
    if(this.state.gameStatus === "Ended") {
        return (
          <ul className="winners-list container__item">
            <div className="winners-list__title">Победители:</div>
            { this.winners() }
          </ul>
        );
    }

    return null;
  }

  winners() {
    return this.state.winners.map((winer, index) => {
      return <li className="winners-list__item" key={ index }>{ winer }</li>
    });
  }

  renderPlayersCount = () => {
    return <div className="container__item">Количество игроков: { this.state.playersCount }</div>
  }

  renderWiningNumber() {
    const content = (
      <div className="container__item">Выигрышный номер: { this.state.winNumber }</div>
    );

    if(this.state.gameStatus === "Ended") {
      return this.state.winNumber ? content : '';
    }

    return null;
  }

  renderUserBet() {
    return <div className="container__item">{ `Ваша ставка: ${ this.state.bet }` }</div>
  }

  renderButton() {
    const button = <button className="container__item " onClick={ this.startGame }>Начать розыгрыш</button>; 
    
    return button;
  }

  // End-Render-stuff

  //Start-handling-inputs

  handleInputChange = (event) => {
    this.setState({
      bet: Number(event.target.value)
    })
  }

  handleClick = async (number) => {
    await this.bet(number);
  }

  //End-handling-inputs
  //Start-Game-action
  startGame = async () => {
    const web3Instance = await Web3Provider;
    const roulette = await Roulette;
    
    await roulette.startGame({ from: await web3Instance.getUserAddress(), value: web3Instance.web3.toWei(0.5, "ether") });
    this.setState({ gameStatus: 'Started' });
  }
  
  bet = async (number) => {
    const web3 = await Web3Provider;
    const roulette = await Roulette;
    
    await roulette.bet(number, { from: await web3.getUserAddress(), value: web3.web3.toWei(this.state.etherBet, "ether") });
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

  watchLogs = async () => {
    const roulette = await Roulette; 

    roulette.watchLogs();
  }

  getPlayersCount = async () => {
    const web3 = await Web3Provider;
    const roulette = await Roulette;

    const playersCount = await roulette.playersCount({ from: await web3.getUserAddress() });

    this.setState({
      playersCount: playersCount.toString()
    });
  }

  getBet = async () => {
    const web3 = await Web3Provider;
    const roulette = await Roulette;

    const bet = await roulette.getBet({ from: await web3.getUserAddress() });
    
    this.setState({ bet });
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
