module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.4.24", // Specify the compiler version you need
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: "byzantium"
      }
    }
  }
};
