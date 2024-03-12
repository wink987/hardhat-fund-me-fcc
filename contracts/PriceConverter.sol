// SPDX-License-Identifier: MIT
//get funds from users，从用户获得酬金
//withdraw funds提取酬金
//t a minimum funding value，设置最小的酬金金额
pragma solidity ^0.8.0;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//AggregatorV3Interface 是 Chainlink 的价格预言机（Oracle）合约的接口。价格预言机用于向以太坊智能合约提供外部数据

library PriceConvert {
    //接口
    function getprice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        //接口的函数用internal
        //ABI
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function getConvertionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getprice(priceFeed); //使用了一个参数来传入价格预言机的接口 AggregatorV3Interface priceFeed，这样可以在调用库函数时传入不同的价格预言机地址，实现灵活性和复用性。
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
