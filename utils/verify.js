//该合约的作用是验证fundme合约
const { run } = require("hardhat") //run 被用来运行 Hardhat 的一个插件任务 verify:verify，用于验证智能合约的源代码。

async function verify(ContractAddress, args) {
    //args代表构造函数的参数
    console.log("verifying   contracts ......")
    try {
        await run("verify:verify", {
            //run: 是 Hardhat 提供的一个函数，用于运行任务和脚本
            //第二个verify是相当于verify的一个功能，用来验证的
            address: ContractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!") //如果异常消息中包含 "already verified"，则输出 "Already Verified!"，否则打印异常信息。
        } else {
            console.log(e)
        }
    }
}
module.exports = { verify }
