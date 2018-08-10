import getWeb3 from './getWeb3';

class Web3Provider {
    constructor(_web3) {
        if (typeof _web3 === 'undefined') {
            throw new Error('Cannot be called directly');
        }

        this.web3 = _web3.web3;
    }

    initWeb3 = async () => {
        const web3 = await getWeb3.web3;
        
        return web3;
    }

    getAccounts = async () => {
        const accounts = this.web3.eth.accounts; 

        return accounts;
    }

    getUserAddress = async () => {
        const accounts = await this.getAccounts();
        
        if(accounts.length) {
            return accounts[0];
        }

        return '';
    }

    getCurrentProvider = async () => {
        const currentProvider = await this.web3.currentProvider;
        
        return currentProvider;
    }

    async deployContract(contractJson) {
        const contract = require('truffle-contract');
        const MyContract = contract(contractJson);

        MyContract.setProvider(await this.getCurrentProvider());

        const ContractInstance = await MyContract.deployed();

        return ContractInstance;
    }

    static asyncBuild = async () => {
        const web3 = await getWeb3;
        const instance = new Web3Provider(web3);

        return instance;
    }
}

async function returnInstance() {
  const buildedWeb3 = await Web3Provider.asyncBuild();  

  return buildedWeb3;
}  

export default returnInstance();
