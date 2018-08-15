import React, { Component, Fragment } from 'react'

import Web3Provider from './utils/Web3Provider';
import Roulette from './Models/Roulette';

import Card from './components/Card';
import EnterGameContainer from './containers/EnterGameContainer';

import randomInt from './utils/randomInt';

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
      inGame: true,
      isOwner: false,
      gameStatus: 'Waitnig',
      winners: [],
      winNumber: null,
      owner: '',
      etherBet: 0
    }
  }

  async componentDidMount() {
  }

  async componentWillUnmount() {
    this.unSubscribeInGameCheck();
  }

  render() {
    // console.log(this.state.inGame);

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
        { this.renderWiningNumber() }
        { this.renderUserBet() }
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
    this.setState({ 
      bet: number,
     });
  }

  //End-handling-inputs
  //Start-Game-action
  startGame = async () => {
    const web3Inst = await Web3Provider;
    const roulette = await Roulette;

    this.setState({ gameStatus: 'Started' });
  
    const etherBet = this.state.etherBet;

    const bet = this.state.bet;
    const winNumber = randomInt(1, 2);
    
    const isUserWin = bet == winNumber ? true : false;

    roulette.tranferToWInner(isUserWin, { from: await web3Inst.getUserAddress(), value: etherBet });
  }
  
  bet = async (number) => {
    const web3 = await Web3Provider;
    const roulette = await Roulette;
    
    await roulette.bet(number, { from: await web3.getUserAddress(), value: web3.web3.toWei(this.state.etherBet, "ether") });
  }

  enterGame = async () => {
    const roulette = await Roulette;
    const name = "";
    
    const web3 = await Web3Provider;
    const userAddress = await web3.getUserAddress();
    // console.log(userAddress)
    await roulette.addPlayer(name, { from: userAddress });
}

  //End-Game-action
  //Start-Events

  //End-Events
  //Start-Common

  //EndC-Common
}

export default App
