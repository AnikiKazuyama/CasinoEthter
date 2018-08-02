module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    "development": {
      network_id: 2,
      host: "localhost",
      port: 8545, 
      from: '0x627306090abab3a6e1400e9345bc60c78a8bef57'
    },
  }
};