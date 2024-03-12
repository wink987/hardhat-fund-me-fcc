const { network } = require("hardhat")
const { verify } = require("../utils/verify")
const { developmentChains, networkConfig } = require("../helper-hardhat-config") // 从helper-hardhat-config中导入网络配置信息
//使用 { networkConfig }，可以将 networkConfig 对象从导入的模块中提取出来，使得在当前模块中可以直接使用 networkConfig 变量来访问这个对象。这种语法用于从导入的模块中提取"特定的属性或方法"
module.exports = async ({ getNamedAccounts, deployments }) => {
    //导出这个异步函数可以让其他模块引入并调用这个函数
    //module.exports 导出模块
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    //当我们使用本地的hardhat  network时，我们会引入mock

    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"] //通过chainid查找对应的测试网络的投喂地址

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        //判断用哪个PriceFeedAddress
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log("----------------------------------------------------")
    log("Deploying Fundme and waiting for confirmations...")
    const args = [ethUsdPriceFeedAddress]
    const fundme = await deploy("Fundme", {
        from: deployer, //from: deployer：指定了部署者的地址，也就是部署合约的账户。
        args: args, //ethUsdPriceFeedAddress 是一个价格预言机合约的地址，作为参数传递给 FundMe 合约的构造函数。args 属性来传递构造函数需要的参数
        log: true, //表示在部署过程中输出日志，用于显示部署的详细信息。
        waitConfirmations: network.config.blockConfirmations || 1, //如果在hardhat.config.js中没指定区块数量，那等待区块的数量为1
    })

    if (
        //不在本地的测试网络的话就验证合约
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundme.address, args)
    }
} //“{箭头函数体}”箭头函数接收一个参数，这个参数是一个对象，对象中包含了两个属性 getNamedAccounts 和 deployments
module.exports.tags = ["all", "fundme"] //将 "fundme" 标签添加到了 "all" 标签中
