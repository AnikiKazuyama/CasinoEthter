pragma solidity ^0.4.10;

contract StringHolder {
    string savedString;

    function setString( string newString ) public {
        savedString = newString;
    }

    function getString() public constant returns( string ) {
        return savedString;
    }
}