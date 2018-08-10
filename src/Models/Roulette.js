import Web3Provider from '../utils/Web3Provider';
import RouletteContract from '../../build/contracts/Rullete.json';

class Roulette {
    constructor(instance) {
        this.casino = instance;
        this.EndGameEvent = instance.GameEnd();
    }

    addPlayer = async (name, options) => {
        await this.casino.addPlayer(name, { from: options.from });
    }

    checkAuth = async (address) => {
        const isAuth = await this.casino.checkAuth({ from: address });
        return isAuth;
    }

    startGame = async (options) => {
        await this.casino.calculateWinner({ from: options.from }); 
    }

    bet = async (number, options) => {
        await this.casino.bet(number, { from: options.from });
    }

    watchGameEnd(func) {
        this.EndGameEvent.watch(( error, result ) => func(error, result));
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