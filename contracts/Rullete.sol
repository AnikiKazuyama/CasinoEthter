pragma solidity ^0.4.24;
import  "installed_contracts/oraclize-api/contracts/usingOraclize.sol";

contract Rullete is usingOraclize {

  address owner;

  string winNumber;

  uint numberOfBets;
  uint pool;

  uint public constant MAX_PLAYERS_COUNT = 4;
  uint public constant MIN_BET = 200 finney;

  address[] public playersId;

  struct Player {
    string name;
    bool voted;
    string bet;
    string betTo;
  }

  enum GameStatuses { Waiting, Started, Ended }

  GameStatuses status = GameStatuses.Waiting;

  mapping(string => address[]) betToPlayers;

  mapping(address => Player) public players;

  constructor() public payable {
    OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    owner = msg.sender;
  }

  // Modifiers starts
  modifier onlyOwner() {
    require(
        owner == msg.sender, 
        "Вы не владелец контракта"
    );
    _;
  }

  modifier onlyWaiting() {
    require(
      status == GameStatuses.Waiting, 
      "Игра уже началась, вы не можете сделать ставку"
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

  modifier allPlayersDidBets() {
    require(
      numberOfBets == playersId.length, 
      "Не все люди сделали ставку"
    );

    _;
  }

  modifier minBet() {
    require(
      msg.value > MIN_BET, 
      "Ваша ставка меньше минимальной"
    );

    _;
  }

  //Modifiers ends

  event PlayerEnter(string name);
  event GameEnd(string winNumber, address[] winners);
  event GameStart();
  event Log(string currentBalance);

  function addPlayer(string name) public {
    require(
      playersId.length <= MAX_PLAYERS_COUNT,
      "Мест больше нет"
    );
    
    playersId.push(msg.sender);
    players[msg.sender] = Player(name, false, "0", "0");

    emit PlayerEnter(name);
  }

 function __callback(
    bytes32 _queryId,
    string _result
  ) {
    emit Log(_result);
    // Checks that the sender of this callback was in fact oraclize
    require(msg.sender == oraclize_cbAddress(), "Это не оракловский адрес");

    emit GameEnd(_result, betToPlayers[_result]);
  }
    
  function calculateWinner() 
    public
    payable
    onlyOwner
    allPlayersDidBets
    returns(address[]) {
    
    emit GameStart();
    status = GameStatuses.Started;

    require(
      playersId.length != 0, 
      "Нету игроков"
    );

    require(
      oraclize_getPrice("URL") < msg.value,
      "Недостаточно средств на контракте"
    );

    oraclize_query("URL", "json(https://api.random.org/json-rpc/1/invoke).result.random.data.0", '\n{"jsonrpc":"2.0","method":"generateIntegers","params":{"apiKey":"c4c35f5a-5641-4344-9d60-0c2c613d2505","n":1,"min":1,"max":10,"replacement":true,"base":10},"id":1}');

    status = GameStatuses.Ended;

    status = GameStatuses.Waiting;
  }

  function toString(address x) returns (string) {
    bytes memory b = new bytes(20);
    for (uint i = 0; i < 20; i++)
        b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    return string(b);
  }

  function bet(string _betNumber) 
    public
    payable 
    onlyWaiting 
    onlyPlayer 
    minBet {

    emit Log(_betNumber);
    betToPlayers[_betNumber].push(msg.sender);
    
    pool = pool + msg.value;

    players[msg.sender].betTo = _betNumber;
    players[msg.sender].voted = true;

    numberOfBets++;
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

  function stringToUint(string s) constant returns (uint result) {
    bytes memory b = bytes(s);
    uint i;
    result = 0;
    for (i = 0; i < b.length; i++) {
        uint c = uint(b[i]);
        if (c >= 48 && c <= 57) {
            result = result * 10 + (c - 48);
        }
    }
  }

  function getPlayerByBet(string betNumber) returns(address[]) {
    return betToPlayers[betNumber];
  }

  function getBet() returns(string) {
    return players[msg.sender].betTo;
  }

}
