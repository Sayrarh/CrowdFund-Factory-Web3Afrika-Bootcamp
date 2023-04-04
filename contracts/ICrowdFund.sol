// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;

interface ICrowdFund{
    struct Donorslist{
        address donor;
        uint256 amountContributed;
    }
    function factory() external view returns(address);
    function projectTitle() external view returns(string memory);
    function projectAdmin() external view returns(address);
    function projectBenefiary() external view returns(address);
    function projectFundWithdrawn() external view returns(bool);
    function initialized() external view returns(bool);
    function projectDuration() external view returns(uint32);
    function projectTarget() external view returns(uint256);
    function setUpProject(string memory _title, uint256 _target, uint32 _duration, address _admin, address _ben) external;
    function fundProject() external payable;
    function transferToBenefiary(address _ben, uint256 amount) external payable;
    function refund() external payable;
    function getAllDonorsList() external view returns(Donorslist[] memory);
    function getDonorsLength() external view returns(uint256);
    function getContractBalance() external view returns(uint256);

}