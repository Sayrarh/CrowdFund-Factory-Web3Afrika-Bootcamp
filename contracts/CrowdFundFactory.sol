// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;
import {ICrowdFund} from "./ICrowdFund.sol";
import {CrowdFund} from "./CrowdFund.sol";

contract CrowdFundFactory{
    event CrowdFundCreated(address indexed contractAddress, uint256 _contractIndex);

    address[] AllCrowdFundAddresses;

    uint256 contractIndex = 1;

    mapping(uint256 => address) public crowdFundAddress;

    function createCrowdFundProject(string memory _title, uint256 _target, uint32 _duration, address _admin, address _ben) external returns(address){
        bytes memory bytecode = type(CrowdFund).creationCode;

        address newCrowdcontractAddress;
          assembly {
            newCrowdcontractAddress := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        crowdFundAddress[contractIndex] = newCrowdcontractAddress;
        ICrowdFund(newCrowdcontractAddress).setUpProject(_title, _target, _duration, _admin, _ben);
        AllCrowdFundAddresses.push(newCrowdcontractAddress);

        contractIndex++;

        emit CrowdFundCreated(newCrowdcontractAddress, AllCrowdFundAddresses.length);

        return newCrowdcontractAddress;

    }

    function getAllCrowdFundCreatedByFactory() external view returns(address[] memory){
        return AllCrowdFundAddresses;
    }

    function getFactoryLength() external view returns(uint256){
        return AllCrowdFundAddresses.length;
    }
}