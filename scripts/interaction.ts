import { ethers } from "hardhat";

async function main() {
  //const[admin, admin2, admin3, beneficiary, beneficiary2, beneficiary3] = await ethers.getSigners();

  const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
  const projectDuration = currentTimestampInSeconds + 60;

  const projectTarget = ethers.utils.parseEther("2");
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

  
 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
