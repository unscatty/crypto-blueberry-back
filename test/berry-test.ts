import { expect } from 'chai';
import { ethers } from 'hardhat';

describe("Berry contract", function () {
  it("Show group creation and plan payment", async function () {
    const BerryContract = await ethers.getContractFactory('Berry');
    const berry = await BerryContract.deploy();

    await berry.deployed();
    //addres to ganache
    const [owner, netflix, udemy, user1, user2, user3, user4] = await ethers.getSigners();

    // console.log(`Netflix address: ${netflix.address}`)
    // console.log(`User1 address: ${user1.address}`)
    // console.log(`User2 address: ${user2.address}`)

    // create providers
    await berry.connect(owner).createProvider('nextflix', '', netflix.address);
    await berry.connect(owner).createProvider('udemy', '', udemy.address);
    const numProviders = await berry.numProviders();

    const createdProvider = await berry.providers(0);
    const createdProvider2 = await berry.providers(1);

    // console.log(`Number od providers: ${numProviders.toNumber()}`)
    // console.log(`Netflix Provider: id: ${0}, address: ${netflix.address}`)
    // console.log(`udemy Provider: id: ${1}, address: ${udemy.address}`)
    // console.log(`Created provider: name: ${createdProvider2.name}, address: ${createdProvider2.serviceOwner}`)


    // console.log(`Balance of netflix before joining group: ${(await netflix.getBalance()).toString()}`);

    // test
    expect(createdProvider.serviceOwner).to.equal(netflix.address);

    // create plants in providers only providers they can create plans
    await berry.connect(netflix).addPlan(0, 'monthly netflix', 'pay netflix every month', 30, ethers.utils.parseEther('10'), 2);
    await berry.connect(udemy).addPlan(1, 'monthly udemy', 'pay udemy every month', 30, ethers.utils.parseEther('10'), 2);

    // create groups inside providers
    await berry.connect(user1).createGroup(0, 0, 'mi grupo chido', { value: ethers.utils.parseEther('15.0') });
    await berry.connect(user1).createGroup(1, 0, 'mi grupo chido de udemy', { value: ethers.utils.parseEther('15.0') });


    let group = await berry.groups(0);
    let group2 = await berry.groups(1);

    // console.log(`Balance of user1 after creating group: ${(await user1.getBalance()).toString()}`);
    // console.log(`Balance of user2 after creating group: ${(await user2.getBalance()).toString()}`);
    // console.log(`Balance of netflix after creating group: ${(await netflix.getBalance()).toString()}`);
    // console.log(`antes Members in el gurpo 0 : ${group.numMembers.toString()}; Members in el gurpo 1 : ${group2.numMembers.toString()}`)

    // join group
    await berry.connect(user2).joinGroup(0, { value: ethers.utils.parseEther('15.0') });


    // await berry.connect(user3).joinGroup(0, { value: ethers.utils.parseEther('15.0') });
    /* Calling the joinGroup function of the Berry contract. */
    // await berry.connect(user2).joinGroup(1, { value: ethers.utils.parseEther('15.0') });
    // group = await berry.groups(0);
    // group2 = await berry.groups(1);
    // const joinedToGroup = await berry.connect(user2).joinGroup(0, { value: ethers.utils.parseEther('5.0') });
    // console.log(`intermedio Members in el gurpo 0 : ${group.numMembers.toString()}; Members in el gurpo 1 : ${group2.numMembers.toString()}`)
    // await berry.connect(user2).leaveGroup(0);
    // await berry.connect(user2).leaveGroup(1);
    // await berry.connect(user1).leaveGroup(0);
    // await berry.connect(user1).leaveGroup(1);
    group = await berry.groups(0);
    // group2 = await berry.groups(1);
    console.log(`  Members in el gurpo 0 : ${group.numMembers.toString()}`)
    // await berry.connect(user3).joinGroup(0, { value: ethers.utils.parseEther('15.0') })
    // const withdrawn = await berry.connect(netflix).withdrawFromGroup(0, 0);

    // try {
    //   expect(await berry.connect(user3).joinGroup(0, { value: ethers.utils.parseEther('15.0') })).to.throw()
    //   expect(await berry.connect(user3).joinGroup(1, { value: ethers.utils.parseEther('15.0') })).to.throw()
    //   // expect (await berry.connect(user3).leaveGroup(0)).to.throw();
    //   // expect (await berry.connect(user3).leaveGroup(0)).to.throw();

    // } catch(e: any) {
    //   console.error(`Error joining group: ${e.message}`);
    // }
    let balanceGroup = await berry.connect(user1).getBalanceGroup(0);
    console.log("balance antes de  withdrawFromGroup:  " + balanceGroup.toString());
    let balanceProvider = await berry.connect(netflix).getBalanceProvider(0);
    console.log("balance antes de  provider antes de witdraw: " + balanceProvider.toString());
    // await berry.connect(netflix).withdrawFromGroup(0);
    console.log(`user 1 have berrys: ${(await berry.connect(user1).getBerryUser()).toString()}`);
    console.log(`user 2 have berrys: ${(await berry.connect(user2).getBerryUser()).toString()}`);
    
    balanceGroup = await berry.connect(user1).getBalanceGroup(0);
    balanceProvider = await berry.connect(netflix).getBalanceProvider(0);
    console.log(`Balance of user1 after joining group: ${(await user1.getBalance()).toString()}`);
    console.log(`Balance of user2 after joining group: ${(await user2.getBalance()).toString()}`);
    console.log(`Balance of netflix after joining group: ${(await netflix.getBalance()).toString()}`);
    console.log(`balance group: ${balanceGroup.toString()}`);// = 0
    console.log(`balance provider: ${balanceProvider.toString()}`); /// =vaklue

  });
});