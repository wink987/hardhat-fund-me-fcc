const networkConfig = {
    31337: {
        name: "localhost", //这种格式为“键值对”
    },
    // 币值投喂转换地址https://docs.chain.link/data-feeds/price-feeds/addresses
    11155111: {
        //通过hardhat.config.js来确定的哪个测试网络对应哪个chainid
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    }, //sepolia对应的投喂地址
}

const developmentChains = ["hardhat", "localhost"] //在本地进行合约的测试
const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000
module.exports = {
    networkConfig,
    DECIMALS,
    developmentChains,
    INITIAL_PRICE,
}
