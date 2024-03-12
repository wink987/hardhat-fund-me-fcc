// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./PriceConverter.sol";

contract Fundme {
    using PriceConvert for uint256; //接口，调用的PriceConvert合约
    address[] public funders; //捐款者数组
    address public immutable i_owner; //合约拥有者，当i_owner不再改变时使用immutable会更省gas
    mapping(address => uint256) public addressToAmountFunders; //映射
    uint public constant MINIMUMUSD = 50 * 1e18; //当MINIMUMUSD不再改变时使用constant会更省gas
    error NotOwner(); //回滚之前的提示语，比直接在require中的字符串更省gas
    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    } //构造函数，在合约编辑完成时就自动运行一次

    function fund() public payable {
        require(
            msg.value.getConvertionRate(priceFeed) > MINIMUMUSD,
            //getConvertionRate(priceFeed)需要使用外部传入的价格预言机接口来获取以太坊价格
            "didn't send enough"
        ); //如果value不够，将会执行revert，即撤回上述操作，并且返回剩余的gas。
        funders.push(msg.sender); //将捐钱用户放入数组
        addressToAmountFunders[msg.sender] += msg.value; //根据地址查找用户捐钱数目,累加
    }

    function withdraw() public onlyOwner {
        //require(msg.sender==owner);判断是否是合约所有者
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunders[funder] = 0; //将对应的账户金额清零
        }
        funders = new address[](0); //取出钱后，将捐赠者组清零
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }(""); //取合约剩余资产
        require(callSuccess, "Call,failed"); //成功返回1，不成功回滚
    }

    modifier onlyOwner() {
        //修饰器作用：在执行原函数中的代码之前，先执行onlyonwer
        //require(msg.sender==i_owner,NotOwner());
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _; //先执行require，再执行withdraw的函数体。
    }

    //如果有人没使用fund函数给这个合约转钱会发生什么呢？？
    receive() external payable {
        fund(); //调用fund函数
    }

    fallback() external payable {
        fund();
    }
}
