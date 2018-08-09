import getWeb3 from './getWeb3';

class Rollet { 
    constructor(_web3) {
        this.web3 = _web3;

        this.initAccounts();
    }

    initAccounts = async () => {
        const eth = this.web3.eth;
        
        this.accounts = await eth.getAccounts() || [];
    }

    getAccounts = async () => {
        return await this.accounts;
    }
}

async function returnWeb3() {
    const web3 = await getWeb3();

    return new Rollet(web3.web3);
}

export default returnWeb3();