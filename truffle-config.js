// var HDWalleetProvider = require('truffle-hdwallet-provider');
var mnemonic = 'green cat owl car truffle house table oceane air blue window wall';
var myAddress = '0xa169eaf6f12594cf3816a89c33230f531aed2fcf';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
  }
};