import { expect } from 'chai';
import { ethers } from 'hardhat';

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const BerryContract = await ethers.getContractFactory('Berry');
    const berry = await BerryContract.deploy();

    await berry.deployed();

    const [owner, netflix, user1, user2, user3] = await ethers.getSigners();
    // const netflix = await ethers.getSigner(process.env.SERVICE_PROVIDER_ADDR!)

    console.log(`Netflix address: ${netflix.address}`)
    console.log(`User1 address: ${user1.address}`)
    console.log(`User2 address: ${user2.address}`)

    const netflixProviderID = await berry.connect(owner).createProvider('nextflix', '', netflix.address);
    const numProviders = await berry.numProviders();

    const createdProvider = await berry.providers(netflixProviderID.value);

    console.log(`Number od providers: ${numProviders.toNumber()}`)
    console.log(`Netflix Provider: id: ${netflixProviderID.value.toNumber()}, address: ${netflix.address}`)
    console.log(`Created provider: name: ${createdProvider.name}, address: ${createdProvider.serviceOwner}`)

    console.log(`Balance of user1 before joining group: ${(await user1.getBalance()).toString()}`);
    console.log(`Balance of user2 before joining group: ${(await user2.getBalance()).toString()}`);

    console.log(`Balance of netflix before joining group: ${(await netflix.getBalance()).toString()}`);

    expect(createdProvider.serviceOwner).to.equal(netflix.address);
    // ethers.utils.parseEther

    // const netflixMonthPlan = await berry.addPlan(berry.numProviders(), 'monthly netflix', 'pay netflix every month', 30, 6, 2);
    await berry.connect(netflix).addPlan(netflixProviderID.value, 'monthly netflix 2', 'pay netflix every month', 30, 15, 5);

    // const netflixMonthPlanID = await berry.connect(netflix).addPlan(netflixProviderID.value, 'monthly netflix', 'pay netflix every month', 30, ethers.utils.parseEther('10'), 2);
    const netflixMonthPlanID = await berry.connect(netflix).addPlan(netflixProviderID.value, 'monthly netflix', 'pay netflix every month', 30, ethers.utils.parseEther('10.0'), 2);


    // console.log(`Price per member: ${netflixMonthPlanValues.pricePerMember.toString()}`)


    // const netflixMonthPlan = (await berry.providers(netflixProviderID.value)).

    const groupID = await berry.connect(user1).createGroup(0, 1, 'mi grupo chido', { value: ethers.utils.parseEther('15.0') });
    // const groupID = await berry.connect(user1).createGroup(0, 1, 'mi grupo chido');
    const group = await berry.groups(0);
    const plan = group.activePlan

    console.log(`Balance of user1 after creating group: ${(await user1.getBalance()).toString()}`);
    console.log(`Balance of user2 after creating group: ${(await user2.getBalance()).toString()}`);
    console.log(`Balance of netflix after creating group: ${(await netflix.getBalance()).toString()}`);

    console.log(`Members in this group: ${group.numMembers.toString()}; Max members for this plan: ${plan.maxMembers.toString()}, price per member : ${plan.pricePerMember.toString()}`)
    const joinedToGroup = await berry.connect(user2).joinGroup(0, 0, { value: ethers.utils.parseEther('15.0') });
    // const joinedToGroup = await berry.connect(user2).joinGroup(0, { value: ethers.utils.parseEther('5.0') });

    // const withdrawn = await berry.connect(netflix).withdrawFromGroup(0, 0);

    try {
      expect(await berry.connect(user2).joinGroup(0, 0, { value: ethers.utils.parseEther('15.0') })).to.throw()
    } catch(e: any) {
      console.log(e.message);
    }

    console.log(`Balance of user1 after joining group: ${(await user1.getBalance()).toString()}`);
    console.log(`Balance of user2 after joining group: ${(await user2.getBalance()).toString()}`);
    console.log(`Balance of netflix after joining group: ${(await netflix.getBalance()).toString()}`);
  });
});