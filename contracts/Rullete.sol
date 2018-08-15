pragma solidity ^0.4.24;

contract Rullete {

    address owner;

    event Log(string);

    constructor() payable {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner, 
            "You are not an owner of contract"
        );

        _;
    }

    function transferToWinner(bool isWinner, uint profit) public payable {
        if(isWinner) {
            msg.sender.transfer(msg.value + profit);
        } else {
            owner.transfer(msg.value);
        }
    }

    function sendMoney() public onlyOwner {
    
    } 

}
