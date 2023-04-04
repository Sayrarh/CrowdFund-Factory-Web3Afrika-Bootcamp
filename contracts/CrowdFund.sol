// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;
import "./ICrowdFund.sol";

contract CrowdFund{
    //EVENTS
    event ProjectFunded(address indexed caller, uint256 indexed amountMade);

    //State Variables
    address public projectAdmin; 
    address public projectBenefiary;
    address immutable public factory;
    string public projectTitle;
    uint32 public projectDuration;  //
    uint256 public projectTarget; //Amount to raise the project
    bool public initialized;
    bool public projectFundWithdrawn;


    ICrowdFund.Donorslist[] allDonorInformation;

    mapping(address => ICrowdFund.Donorslist) _donorslist;
    mapping(address => bool) donated;


    constructor(){
        factory = msg.sender;
    }

    function setUpProject(string memory _title, uint256 _target, uint32 _duration, address _admin, address _ben) external {
        require(!initialized, "Contract already Initialized");
        require(_admin != address(0), "Address Zero");
        require(_ben != address(0), "Address Zero");

        projectTitle = _title;
        projectTarget = _target * 1e18;
        projectDuration = uint32(block.timestamp) + _duration;
        projectAdmin = _admin;
        projectBenefiary = _ben;
        initialized = true;
    }

    function fundProject() external payable {
        require(block.timestamp <= projectDuration, "Project duration exceeded");
        require(msg.value > 0, "Zero ETH Not Allowed");

        ICrowdFund.Donorslist storage list = _donorslist[msg.sender];
        list.donor = msg.sender;
        list.amountContributed = list.amountContributed + msg.value;

        allDonorInformation.push(list);

        donated[msg.sender] = true;

        emit ProjectFunded(msg.sender, list.amountContributed);

    }

    function transferToBenefiary(address _ben, uint256 amount) external payable{
        require(msg.sender == projectAdmin, "Not Project Admin");
        require(block.timestamp > projectDuration, "Funding still in progress");
      
        require((amount * 1e18) == projectTarget, "Incorrect Amount");
        require(_ben == projectBenefiary, "NotProjectBenefiaciary");

        uint256 contractBalance = address(this).balance;

        require(contractBalance >= projectTarget, "Target Not Reached");

        require(!projectFundWithdrawn, "Funds Transfered");

        uint256 amountTosend = amount * 1e18;
      
        (bool success, ) = _ben.call{value: amountTosend}("");
        require(success, "Transaction Failed");

        projectFundWithdrawn = true;

    }

    function refund() external payable {
        require(block.timestamp > projectDuration, "Project still in progress");
        require(donated[msg.sender] == true, "You didnt make contribution");
        
        uint256 contractBalance = address(this).balance;

        require(projectTarget < contractBalance, "Target Reached");

        ICrowdFund.Donorslist storage list = _donorslist[msg.sender];
        uint256 userContribution = list.amountContributed;

        (bool success, ) = msg.sender.call{value: userContribution}("");
        require(success, "Transaction failed");
    }

    function getAllDonorsList() external view returns(ICrowdFund.Donorslist[] memory){
        return allDonorInformation;
    }

    function getDonorsLength() external view returns(uint256){
        return allDonorInformation.length;
    }

    function getContractBalance() external view returns(uint256){
        return address(this).balance;
    }

    receive() external payable{}

}