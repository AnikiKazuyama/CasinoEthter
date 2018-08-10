pragma solidity ^0.4.24;
import "./usingOraclize.sol";

contract Rullete is usingOraclize {

  address owner;
  
  uint winNumber;

  uint public constant MAX_PLAYERS_COUNT = 2;
  address[] public playersId;

  struct Player {
    string name;
    bool voted;
    uint bet;
    uint betTo;
  }

  enum GameStatuses { Waiting, Started, Ended }

  GameStatuses status = GameStatuses.Waiting;

  mapping(address => Player) public players;

  constructor() public {
    oraclize_setProof(proofType_Ledger);
    owner = msg.sender;
  }

  //Start Oraclize callback
  function __callback() {
    
  }
  //End Oraclize callback
  // Modifiers starts
  modifier onlyOwner() {
    require(
        owner == msg.sender, 
        "Вы не владелец контракта"
    );
    _;
  }

  modifier onlyPlayer() {
    bool isPlayer = false;

    for(uint i = 0; i < playersId.length; i++) {
      if(playersId[i] == msg.sender) {
        isPlayer = true;
        break;
      }
    }

    require(
      isPlayer,
      "Вы не в игре"
     );

     _;
  }
  //Modifiers ends

  event PlayerEnter(string name);
  event GameEnd(uint winNumber, address[] winners);
  event GameStart();

  function addPlayer(string name) public {
    require(
      playersId.length <= MAX_PLAYERS_COUNT,
      "Мест больше нет"
    );
    
    playersId.push(msg.sender);
    players[msg.sender] = Player(name, false, 0, 0);

    emit PlayerEnter(name);
  }
  
  function winigNumber() pure internal 
      returns(uint) {
    return 2;
  }
    
  function countWinners(uint winNumber) public view returns(uint){
    uint winnersCount = 0;
    
    for(uint i = 0; i < playersId.length; i++) {
        if(winNumber == players[playersId[i]].betTo){
            winnersCount++;
        }
    }
    
    return winnersCount;
  }
    
  function calculateWinner() public onlyOwner returns(address[]) {
    emit GameStart();
    status = GameStatuses.Started;

    uint winNumber = winigNumber();
    uint winnersCount = countWinners(winNumber);
    
    uint winIteration = 0;
    
    address[] memory winners = new address[](winnersCount);
    
    for(uint i = 0; i < playersId.length; i++) {
        if(winNumber == players[playersId[i]].betTo){
            winners[winIteration] = playersId[i];
            winIteration++;
        }
    }
    
    status = GameStatuses.Ended;
    emit GameEnd(winNumber, winners);
  }
    
  function bet(uint _betNumber) public onlyPlayer {
    players[msg.sender].betTo = _betNumber;
    players[msg.sender].voted = true;
  }
  
  function getPalyersCount() public view returns(uint){
    return playersId.length;
  }
  
  function getPlayersIds() public view returns(address[]) {
    return playersId;
  }

  function checkAuth() public view returns(bool) {
    bool isPlayer = false;

    for(uint i = 0; i < playersId.length; i++) {
      if(playersId[i] == msg.sender) {
        isPlayer = true;
        break;
      }
    }

    return isPlayer;
  }

  function getGameStatus() public view returns(GameStatuses) {
    return status;
  }

  function isOwner() public view returns(bool) {
    if(msg.sender == owner) {
      return true;
    } else {
      return false;
    }
  }
}
