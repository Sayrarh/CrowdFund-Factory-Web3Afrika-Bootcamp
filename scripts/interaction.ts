import { ethers } from "hardhat";

async function main() {
  //const[admin, admin2, admin3, beneficiary, beneficiary2, beneficiary3] = await ethers.getSigners();

  const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
  const projectDuration = currentTimestampInSeconds + 60;

  const AdminAddr= "0x637CcDeBB20f849C0AA1654DEe62B552a058EA87";
  const BenAddr = "0xfb9Aa24caF3b9fb9F758347AC2496157EA683BE7";

  const Target = ethers.utils.parseEther("2");
  const contractAddress = "0xF8Ea6944B12500c4a2b3E4cae9C21E0e855014C0";

  //Interact with any of the create crowd project
  const Interaction = await ethers.getContractAt("ICrowdFund", contractAddress);

  //Get Factory Address
  const factoryAddr = await Interaction.factory();
  console.log("Factory Address is", factoryAddr);

  //Get Project Title
  const projectTitle = await Interaction.projectTitle();
  console.log("Project Title is", projectTitle);

  //Get Project Title
  const projectDura = await Interaction.projectDuration();
  console.log("Project Duration is", projectDura);

  //Setting Up Project here should throw an error because contract has already been initialised
//   const SetUpProject = await Interaction.setUpProject("Tech", 2000, 100, AdminAddr, BenAddr);
//   await SetUpProject.wait();

  //Fund Project
  const amountToContribute = ethers.utils.parseEther('1'); // Replace with the amount of ether to contribute
  const FundProject = await Interaction.fundProject({ value: amountToContribute });
  await FundProject.wait();

  //TransferToBeneficiary
  const TransferToBeneficiary = await Interaction.transferToBenefiary(BenAddr, Target );
  await TransferToBeneficiary.wait();

  //Refund Contributed if project target is not reached
  const reFund = await Interaction.refund();
  await reFund.wait();

  //Get All Donors
  const getAllDonorsList = await Interaction.getAllDonorsList();
  console.log("All project donors are", getAllDonorsList);

  //Get donors count
  const DonorsCount = await Interaction.getAllDonorsList();
  console.log("Donors length is", DonorsCount);

  //Get contract balance
  const Balance = await Interaction.getContractBalance();
  console.log("Contract Balance is", Balance);



  
 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
