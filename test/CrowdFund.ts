import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CrowdFundFactory", function () {
 
  async function deployCrowdFundFactoryFixture() {


    // Contracts are deployed using the first signer/account by default
    const [admin, admin2, otherAccount, beneficiary, beneficiary2, user2, user3] = await ethers.getSigners();

    const CrowdFundFactory = await ethers.getContractFactory("CrowdFundFactory");
    const crowdFundFactory = await CrowdFundFactory.deploy();

    return { crowdFundFactory, admin, admin2, beneficiary, beneficiary2, otherAccount, user2, user3};
  }

   describe("Deployment", function () {
     it("Should deploy a new crowdfund contract successfully", async function () {
       const { crowdFundFactory, admin, beneficiary} = await loadFixture(deployCrowdFundFactoryFixture);
      
       const ONE_GWEI = 1_000_000_000;

       const projectTarget = ONE_GWEI;
       const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
       const projectDuration = currentTimestampInSeconds + 60;

       const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Education",projectTarget, projectDuration, admin.address, beneficiary.address );
       await createNewCrowdFund.wait();

       const AllCreatedContract = await crowdFundFactory.getAllCrowdFundCreatedByFactory();
       console.log("All crowd fund project created from factory is", AllCreatedContract);

       await expect(AllCreatedContract.length).to.equal(1);
     
      });

      it("Should set the project title successfully", async function(){
        const { crowdFundFactory, admin, beneficiary} = await loadFixture(deployCrowdFundFactoryFixture);
      
        const ONE_GWEI = 1_000_000_000;
 
        const projectTarget = ONE_GWEI;
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const projectDuration = currentTimestampInSeconds + 60;
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Agriculture", projectTarget, projectDuration, admin.address, beneficiary.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);
        console.log("First CrowdFund Contract is", GetFirstCrowdFundAddress);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);

        await expect(await Interaction.projectTitle()).to.equal("Agriculture");

 
      })

      it("Should ensure that the crowd contract was deployed by the crowdfund factory", async function(){
        const { crowdFundFactory, admin, beneficiary} = await loadFixture(deployCrowdFundFactoryFixture);
      
        const ONE_GWEI = 1_000_000_000;
 
        const projectTarget = ONE_GWEI;
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const projectDuration = currentTimestampInSeconds + 60;
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Agriculture", projectTarget, projectDuration, admin.address, beneficiary.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);
        console.log("First CrowdFund Contract is", GetFirstCrowdFundAddress);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);

        //To ensure the factory address is actually the same
        await expect(await Interaction.factory()).to.equal(crowdFundFactory.address);
 
      })

      it("Should ensure the project target set during project initialization is correct", async function(){
        const { crowdFundFactory, admin, beneficiary} = await loadFixture(deployCrowdFundFactoryFixture);
      
        const ONE_GWEI = 1_000_000_000;
 
        const projectTarget = ONE_GWEI;
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const projectDuration = currentTimestampInSeconds + 60;
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Agriculture", projectTarget, projectDuration, admin.address, beneficiary.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);

        await expect(await Interaction.projectTarget()).to.equal(ethers.utils.parseUnits("1000000000"));

      })
      it("Should set crowd fund admin correctly", async function(){
        const { crowdFundFactory, admin2, beneficiary2} = await loadFixture(deployCrowdFundFactoryFixture);
 
        const projectTarget = 1_000_000_000;
        const projectDuration = Math.floor(Date.now() / 1000) + 60;
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, projectDuration, admin2.address, beneficiary2.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);

        await expect(await Interaction.projectAdmin()).to.equal(admin2.address);

      })

      it("Should set crowd fund project beneficiary correctly", async function(){
        const { crowdFundFactory, admin2, beneficiary2} = await loadFixture(deployCrowdFundFactoryFixture);
 
        const projectTarget = 1_000_000_000;
        const projectDuration = Math.floor(Date.now() / 1000) + 60;
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, projectDuration, admin2.address, beneficiary2.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);

        await expect(await Interaction.projectBenefiary()).to.equal(beneficiary2.address);

      })

      describe("SetUpProject", function (){
        it("Should revert since contract has already been setup from the factory", async function(){
          const { crowdFundFactory, admin2, beneficiary2} = await loadFixture(deployCrowdFundFactoryFixture);
   
          const projectTarget = 1_000_000_000;
          const projectDuration = Math.floor(Date.now() / 1000) + 60;
   
          const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, projectDuration, admin2.address, beneficiary2.address );
          await createNewCrowdFund.wait();
   
          const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);
  
          //Interact with the first created crowd project
          const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);

          await expect(Interaction.setUpProject("Charity", 2000, 12, admin2.address, beneficiary2.address)).to.be.revertedWith("Contract already Initialized")
  
        })
      })

      describe("FundProject", function(){
        it("Should revert if ETH passed is zero", async function(){
          const { crowdFundFactory, otherAccount, admin2, beneficiary2} = await loadFixture(deployCrowdFundFactoryFixture);
   
          const projectTarget = 1_000_000_000;
          const projectDuration = Math.floor(Date.now() / 1000) + 60;
   
          const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, projectDuration, admin2.address, beneficiary2.address );
          await createNewCrowdFund.wait();
   
          const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);
  
          //Interact with the first created crowd project
          const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);

          await expect(Interaction.connect(otherAccount).fundProject({ value: 0})).to.be.revertedWith("Zero ETH Not Allowed");

        })

        it("Should revert if project duration has exceeded", async function(){
          const { crowdFundFactory, otherAccount, admin2, beneficiary2} = await loadFixture(deployCrowdFundFactoryFixture);
   
          const projectTarget = 20;
   
          const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, 0, admin2.address, beneficiary2.address );
          await createNewCrowdFund.wait();
   
          const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);
  
          //Interact with the first created crowd project
          const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);
          const amount = ethers.utils.parseEther("1")
          await expect(Interaction.connect(otherAccount).fundProject({value: amount})).to.be.revertedWith("Project duration exceeded");
      })


      it("Should increment the donorslist and make checkings", async function(){
        const { crowdFundFactory, otherAccount, admin2, beneficiary2, user2, user3} = await loadFixture(deployCrowdFundFactoryFixture);
 
        const projectTarget = 20;
        const projectDuration = Math.floor(Date.now() / 1000) + 60;
   
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, projectDuration, admin2.address, beneficiary2.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);
        const amount = ethers.utils.parseEther("1")
        
        const FundProject = await Interaction.connect(otherAccount).fundProject({value:amount});
        await FundProject.wait();

        const FundProject2 = await Interaction.connect(user2).fundProject({value:amount});
        await FundProject2.wait();

        const FundProject3 = await Interaction.connect(user3).fundProject({value:amount});
        await FundProject3.wait();

        //At this point three accounts has funded the project
        await expect( await Interaction.getDonorsLength()).to.be.equal(3);
    })


    it("Should check that contract is incremented accordingly", async function(){
      const { crowdFundFactory, otherAccount, admin2, beneficiary2, user2, user3} = await loadFixture(deployCrowdFundFactoryFixture);

      const projectTarget = 20;
      const projectDuration = Math.floor(Date.now() / 1000) + 60;
 

      const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, projectDuration, admin2.address, beneficiary2.address );
      await createNewCrowdFund.wait();

      const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

      //Interact with the first created crowd project
      const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);
      const amount = ethers.utils.parseEther("1")
      
      const FundProject = await Interaction.connect(otherAccount).fundProject({value:amount});
      await FundProject.wait();

      const FundProject2 = await Interaction.connect(user2).fundProject({value:amount});
      await FundProject2.wait();

      const FundProject3 = await Interaction.connect(user3).fundProject({value:amount});
      await FundProject3.wait();

      await expect(await Interaction.getContractBalance()).to.be.equal(ethers.utils.parseEther("3"));

    })
    })

    describe("TransferToBeneficiary", function(){

      it("Should revert if caller is not admin", async function(){
        const { crowdFundFactory, otherAccount, admin2, beneficiary2, user2, user3} = await loadFixture(deployCrowdFundFactoryFixture);
 
        const projectTarget = 20;
        const projectDuration = Math.floor(Date.now() / 1000) + 60;
   
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, projectDuration, admin2.address, beneficiary2.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);
        const amount = ethers.utils.parseEther("1")
        
        const FundProject = await Interaction.connect(otherAccount).fundProject({value:amount});
        await FundProject.wait();

        const FundProject2 = await Interaction.connect(user2).fundProject({value:amount});
        await FundProject2.wait();

        await expect(Interaction.connect(otherAccount).transferToBenefiary(beneficiary2.address, amount)).to.be.revertedWith("Not Project Admin");
      })

      it("Should revert if project funding is still in progress", async function(){
        const { crowdFundFactory, otherAccount, admin2, beneficiary2, user2, user3} = await loadFixture(deployCrowdFundFactoryFixture);
 
        const projectTarget = 20;
        const projectDuration = Math.floor(Date.now() / 1000) + 60;
   
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, projectDuration, admin2.address, beneficiary2.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);
        const amount = ethers.utils.parseEther("1")
        
        const FundProject = await Interaction.connect(otherAccount).fundProject({value:amount});
        await FundProject.wait();

        const FundProject2 = await Interaction.connect(user2).fundProject({value:amount});
        await FundProject2.wait();

        await expect(Interaction.connect(admin2).transferToBenefiary(beneficiary2.address, amount)).to.be.revertedWith("Funding still in progress");
      })

      it("Should revert if amount is incorrect", async function(){
        const { crowdFundFactory, otherAccount, admin2, beneficiary2, user2} = await loadFixture(deployCrowdFundFactoryFixture);
 
        const projectTarget = 15;
        
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, 2, admin2.address, beneficiary2.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);
        const amount = ethers.utils.parseEther("1")
        
        const FundProject = await Interaction.connect(otherAccount).fundProject({value:amount});
        await FundProject.wait();

        const FundProject2 = await Interaction.connect(user2).fundProject({value:amount});
        await FundProject2.wait();

        await expect(Interaction.connect(admin2).transferToBenefiary(beneficiary2.address, amount)).to.be.revertedWith("Incorrect Amount");
      })

      it("Should revert if the beneficiary address set is incorrect", async function(){
        const { crowdFundFactory, otherAccount, admin2, beneficiary2, user2} = await loadFixture(deployCrowdFundFactoryFixture);
 
        const projectTarget = 6;
   
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, 1, admin2.address, beneficiary2.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);
        const amount = ethers.utils.parseEther("6")
        
        const FundProject = await Interaction.connect(otherAccount).fundProject({value:amount});
        await FundProject.wait();

        await expect(Interaction.connect(admin2).transferToBenefiary(user2.address, projectTarget)).to.be.revertedWith("NotProjectBenefiaciary");
      })

      it("Should revert if the project target is not reached", async function(){
        const { crowdFundFactory, otherAccount, admin2, beneficiary2} = await loadFixture(deployCrowdFundFactoryFixture);
 
        const projectTarget = 6;
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, 1, admin2.address, beneficiary2.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);
        const amount = ethers.utils.parseEther("2")
        
        const FundProject = await Interaction.connect(otherAccount).fundProject({value:amount});
        await FundProject.wait();

        await expect( Interaction.connect(admin2).transferToBenefiary(beneficiary2.address, projectTarget)).to.be.revertedWith("Target Not Reached");
      })

      it("Should revert if transfer to beneficiary if transaction fails", async function(){
        const { crowdFundFactory, otherAccount, admin2, beneficiary2, user2, user3} = await loadFixture(deployCrowdFundFactoryFixture);
 
        const projectTarget = 2;
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, 2, admin2.address, beneficiary2.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);
        const amount = ethers.utils.parseEther("4");
        
        const FundProject = await Interaction.connect(otherAccount).fundProject({value:amount});
        await FundProject.wait();

        const FundProject2 = await Interaction.connect(user3).fundProject({value: amount});
        await FundProject2.wait();

       
        const getContractBal = await Interaction.getContractBalance();
        console.log("Contract Bal is", getContractBal);

        console.log("See contract target", await Interaction.projectTarget())


        const Transfer = await Interaction.connect(admin2).transferToBenefiary(beneficiary2.address, projectTarget);
        await Transfer.wait();

        await expect(Interaction.connect(admin2).transferToBenefiary(beneficiary2.address, projectTarget)).to.be.revertedWith("Funds Transfered");
      })

      
    })

    describe("Project Refund", function(){
      it("Should revert project contribution is still ongoing", async function(){
        const { crowdFundFactory, otherAccount, admin2, beneficiary2, user2, user3} = await loadFixture(deployCrowdFundFactoryFixture);
 
        const projectTarget = 15;
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, 20, admin2.address, beneficiary2.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);
        const amount = ethers.utils.parseEther("3")
        
        const FundProject = await Interaction.connect(otherAccount).fundProject({value:amount});
        await FundProject.wait();

        const FundProject2 = await Interaction.connect(user2).fundProject({value:amount});
        await FundProject2.wait();

        await expect(Interaction.connect(user2).refund()).to.be.revertedWith("Project still in progress");
      })

      it("Should revert is caller didnt make any contribution", async function(){
        const { crowdFundFactory, otherAccount, admin2, beneficiary2, user2, user3} = await loadFixture(deployCrowdFundFactoryFixture);
 
        const projectTarget = 6;
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, 2, admin2.address, beneficiary2.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);
        const amount = ethers.utils.parseEther("3")
        
        const FundProject = await Interaction.connect(otherAccount).fundProject({value:amount});
        await FundProject.wait();

        const FundProject2 = await Interaction.connect(user2).fundProject({value:amount});
        await FundProject2.wait();

        await expect(Interaction.connect(user3).refund()).to.be.revertedWith("You didnt make contribution");
      })

      it("Should revert if refund transaction failed", async function(){
        const { crowdFundFactory, otherAccount, admin2, beneficiary2, user2, user3} = await loadFixture(deployCrowdFundFactoryFixture);
 
        const projectTarget = 13;
 
        const createNewCrowdFund = await crowdFundFactory.createCrowdFundProject("Tech", projectTarget, 2, admin2.address, beneficiary2.address );
        await createNewCrowdFund.wait();
 
        const GetFirstCrowdFundAddress = await crowdFundFactory.crowdFundAddress(1);

        //Interact with the first created crowd project
        const Interaction = await ethers.getContractAt("ICrowdFund", GetFirstCrowdFundAddress);
        const amount = ethers.utils.parseEther("3")
        
        const FundProject = await Interaction.connect(otherAccount).fundProject({value:amount});
        await FundProject.wait();

        const FundProject2 = await Interaction.connect(user2).fundProject({value:amount});
        await FundProject2.wait();

        await expect(Interaction.connect(user2).refund()).to.be.revertedWith("Target Reached");
      })
    
    })
    
   });

 
});
