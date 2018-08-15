import Web3Provider from '../utils/Web3Provider';
import RouletteContract from '../../build/contracts/Rullete.json';

class Roulette {
    constructor(instance) {
        this.casino = instance;
    } 

    isOwner = (options) => {
        return  this.casino.isOwner.call({ from: options.from });
    }

    transferToWinner = (isUserWin, profit, options) => {
        this.casino.transferToWinner(isUserWin, profit, { ...options });
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