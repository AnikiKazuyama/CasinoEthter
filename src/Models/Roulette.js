import Web3Provider from '../utils/Web3Provider';
import RouletteContract from '../../build/contracts/Rullete.json';

class Roulette {
    constructor(instance) {
        this.casino = instance;
        this.EndGameEvent = instance.GameEnd();
        this.LogEvent = instance.Log();
        this.PlayerEnter = instance.PlayerEnter();
        // this.LogBalanceEvent = instance.LogBalance();
    }

    addPlayer = async (name, options) => {
        await this.casino.addPlayer(name, { from: options.from });
    }

    playersCount = async (options) => {
        const playersCount = await this.casino.getPalyersCount.call({ ...options }); 
        return playersCount;
    }

    checkAuth = async (address) => {
        const isAuth = await this.casino.checkAuth({ from: address });
        return isAuth;
    }

    startGame = async (options) => {
        await this.casino.calculateWinner({ ...options, from: options.from }); 
    }

    getPlayerByBet = async (bet, options) => {
        return await this.casino.getPlayerByBet.call(bet, { ...options });
    } 

    bet = async (number, options) => {
        await this.casino.bet(number.toString(), { ...options, from: options.from });
    }

    getBet = async (options) => {
        const bet = await this.casino.getBet.call({ ...options });
        console.log(bet);
        return bet; 
    } 

    watchPlayerEnter(callback) {
        this.PlayerEnter.watch((error, result) => callback(error, result));
    }

    watchGameEnd(func) {
        this.EndGameEvent.watch(( error, result ) => func(error, result));
    }

    watchLogs() {
        this.LogEvent.watch((eror, result) => console.log(result));
    }

    stopWatchGameEnd() {
        this.EndGameEvent.stopWatching();
    }

    isOwner = (options) => {
        return  this.casino.isOwner.call({ from: options.from });
    }

    static async init() {
        const web3 = await Web3Provider;

        const rouletteInstance = await web3.deployContract(RouletteContract);

        const instance = new Roulette(rouletteInstance);

        return instance;
    }
}

async function returnRoulette() {
    const initializedRoulette = await Roulette.init();

    return initializedRoulette;
}

export default returnRoulette();    