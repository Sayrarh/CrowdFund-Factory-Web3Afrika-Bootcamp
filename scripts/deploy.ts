import { ethers } from "hardhat";

async function main() {
  //const[admin, admin2, admin3, beneficiary, beneficiary2, beneficiary3] = await ethers.getSigners();
  
  const AdminAddr= "0x637CcDeBB20f849C0AA1654DEe62B552a058EA87";
  const BenAddr = "0xfb9Aa24caF3b9fb9F758347AC2496157EA683BE7";

  const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
  const projectDuration = currentTimestampInSeconds + 60;

  const projectTarget = ethers.utils.parseEther("2");

  const CrowdFundFactory = await ethers.getContractFactory("CrowdFundFactory");
  const crowdfundFactory = await CrowdFundFactory.deploy();

  await crowdfundFactory.deployed();

  console.log("Address of CrowdFund Factory", crowdfundFactory.address);

 //Setting up or creating the first crowdfund project
  const CreateFirstCrowdFundProject = await crowdfundFactory.createCrowdFundProject("Laptop for Devs", projectTarget, projectDuration, AdminAddr, BenAddr );
  await CreateFirstCrowdFundProject.wait();

  const GetFirstCrowdFundAddress = await crowdfundFactory.crowdFundAddress(1);
  console.log("First CrowdFund Contract is", GetFirstCrowdFundAddress);

  //Setting up or creating the Second crowdfund project
  const CreateSecCrowdFundProject = await crowdfundFactory.createCrowdFundProject("Finance", projectTarget, projectDuration, AdminAddr, BenAddr);
  await CreateSecCrowdFundProject.wait();

  const GetSecCrowdFundAddress = await crowdfundFactory.crowdFundAddress(2);
  console.log("Second CrowdFund Contract is", GetSecCrowdFundAddress);

  //Setting up or creating the third crowdfund project
  const CreateThirdCrowdFundProject = await crowdfundFactory.createCrowdFundProject("Agriculture", projectTarget, projectDuration, AdminAddr, BenAddr);
  await CreateThirdCrowdFundProject.wait();

  const GetThirdCrowdFundAddress = await crowdfundFactory.crowdFundAddress(3);
  console.log("Third CrowdFund Contract is", GetThirdCrowdFundAddress);

  const AllCreatedContract = await crowdfundFactory.getAllCrowdFundCreatedByFactory();
  console.log("All crowd fund project created from factory is", AllCreatedContract);

  const FactoryLength = await crowdfundFactory.getFactoryLength();
  console.log("CrowdFund Factory Length is", FactoryLength);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
