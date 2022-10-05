// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "hardhat/console.sol";

contract Berry {
  struct SubscriptionPlan {
    uint providerID;
    string name;
    string description;
    uint recurrence;  // in days
    uint price;
    bool active;
    uint8 maxMembers;
    uint256 pricePerMember;
  }

  struct User {
    address owner;
    string name;
    uint256 berrys;
  }

  struct ServiceProvider {
    string name;
    string imageURL;
    address serviceOwner;
    uint numPlans;
    mapping(uint => SubscriptionPlan) plans;
  }

  struct Group {
    string name;
    uint256 totalBalance;
    SubscriptionPlan activePlan;
    uint numMembers;
    mapping(address => GroupMember) members;
    bool initialized;
  }

  // The user inside a group
  struct GroupMember {
    User member;
    uint256 balance;
  }

  // How many providers | providerId counter
  uint public numProviders;
  // How many groups | groupId counter
  uint public numGroups;
  // How many users | userId counter
  uint public numUsers;

  // Collection of providers by id
  mapping(uint => ServiceProvider) public providers;
  // Collection of groups by groupId
  mapping(uint => Group) public groups;
  // Collection of users
  mapping(address => User) public users;


  // TODO: track contract owner/deployer for service provider creation
  modifier onlyContractOwner() {
    // Require the contract owner to make operations
    _;
  }

  function createProvider(string memory name, string memory imageURL, address payable owner) external onlyContractOwner returns (uint providerID) {
    providerID = numProviders++;

    // Create new service provider
    ServiceProvider storage newProvider = providers[providerID];
    newProvider.name = name;
    newProvider.imageURL = imageURL;
    newProvider.serviceOwner = owner;
  }

  function addPlan(uint providerID, string memory name, string memory description, uint recurrence, uint price, uint8 maxMembers) external returns (uint planID) {
    // Get the provider
    ServiceProvider storage provider = providers[providerID];
    console.log("Plan %s has a member price of %s", name, price / maxMembers);

    require(address(msg.sender) == provider.serviceOwner, 'You are not allowed to create a plan');

    planID = provider.numPlans;
    provider.plans[planID] = SubscriptionPlan(providerID, name, description, recurrence, price, true, maxMembers, price / maxMembers);

    provider.numPlans++;
  }

  function register(string memory name) external {
    User storage newUser = users[msg.sender];
    newUser.name = name;

    numUsers++;
  }

  function createGroup(uint providerID, uint planID, string memory groupName) external payable returns (uint groupID) {
    // Get desired plan
    SubscriptionPlan storage desiredPlan = providers[providerID].plans[planID];
    // SubscriptionPlan storage desiredPlan = provider;

    require(desiredPlan.maxMembers > 0, 'Plan is empty');
    require(msg.value >= desiredPlan.pricePerMember, 'You need more cash to pay for this plan');

    groupID = numGroups++;

    // Create new group
    Group storage newGroup = groups[groupID];
    // Set the group subscription plan
    newGroup.activePlan = desiredPlan;
    newGroup.name = groupName;

    // Add user to newly created group
    GroupMember storage newMember = newGroup.members[msg.sender];
    // Set user
    newMember.member = users[msg.sender];
    setBerryUser();
    

    // Check if user gave more than needed
    uint excess = msg.value - desiredPlan.pricePerMember;

    if (excess > 0) {
      newMember.balance += desiredPlan.pricePerMember;
      // Refund excessing
      payable(msg.sender).transfer(excess);
    } else {
      newMember.balance = msg.value;
    }

    // Update number of members in group
    newGroup.numMembers++;

    // Update group balance
    newGroup.totalBalance += newMember.balance;
    newGroup.initialized = true;
  }

  function joinGroup(uint groupID) external payable returns (bool) {
    // Get group
    Group storage group = groups[groupID];
    SubscriptionPlan storage plan = group.activePlan;
    
    require(group.initialized, 'Group does not exist');
    require(group.numMembers < plan.maxMembers, 'Group is full already');
    require(msg.value >= plan.pricePerMember, 'You need more cash to pay for this plan');

    // Create new GroupMember
    GroupMember storage newMember = group.members[msg.sender];
    // Set user
    newMember.member = users[msg.sender];
    setBerryUser();
    // newMember.balance = msg.value;

    // Check if user gave more than needed
    uint excess = msg.value - plan.pricePerMember;

    if (excess > 0) {
      newMember.balance += plan.pricePerMember;

      // Refund excessing
      payable(msg.sender).transfer(excess);
    } else {
      newMember.balance = msg.value;
    }

    // Update group balance
    group.totalBalance += newMember.balance;

    // Update number of members in group
    group.numMembers++;
    return true;
  }


  function leaveGroup(uint groupID) external returns (bool){
    // Get group
    Group storage group = groups[groupID];
    require(group.initialized, 'Group does not exist');
    // Delete member from group
    delete group.members[msg.sender];
    // Update member count
    group.numMembers--;
    return true;
  }

  function sendValue(uint providerId, address payable adProvider) public payable{
    for(uint i = 0; i < numGroups;  i++){
      Group storage group = groups[i];
      if(group.activePlan.providerID == providerId && group.numMembers == group.activePlan.maxMembers){
        payable(adProvider).transfer(group.totalBalance);
      }
    }
  }
  
  function withdrawFromGroup(uint groupID) external payable{
    Group storage group = groups[groupID];
    SubscriptionPlan storage plan = group.activePlan;
    ServiceProvider storage provider = providers[plan.providerID];
    require(address(msg.sender) == provider.serviceOwner,"You cannot withdraw from this account");
    require(group.initialized, 'Group does not exist');
    require(group.numMembers == group.activePlan.maxMembers, 'Group is not full yet');
    payable(provider.serviceOwner).transfer(group.totalBalance);
  }

  function setBerryUser() private  {
    User storage userBerry = users[msg.sender];
    userBerry.berrys += 5;
  }
  function setName(string memory name) public {
    User storage user = users[msg.sender];
    user.name = name;
  }

  function getName() public view returns (string memory) {
    User storage user = users[msg.sender];
    return user.name;
  }


  function getBerryUser() public view returns (uint){
    User storage userBerry = users[msg.sender];
    return userBerry.berrys;
  }

    
  function getBalanceProvider(uint256  providerID) public view returns (uint256 ) {
    ServiceProvider storage provider = providers[providerID];
    return provider.serviceOwner.balance;
  }

  function getBalanceGroup(uint256  groupID) public view returns (uint256 ) {
    Group storage group = groups[groupID];
    return group.totalBalance;
  }

  function getProvider(uint256  providerID) public view returns (string memory, string memory, address) {
    ServiceProvider storage provider = providers[providerID];
    return (provider.name, provider.imageURL, provider.serviceOwner);
  }

  function getPlan(uint256  providerID, uint256  planID) public view returns (string memory, string memory, uint256 , uint256 , bool, uint256, uint256 ) {
    SubscriptionPlan storage plan = providers[providerID].plans[planID];
    return (plan.name, plan.description, plan.recurrence, plan.price, plan.active, plan.maxMembers, plan.pricePerMember);
  }

  function getGroup(uint256  groupID) public view returns (string memory, uint256 , uint256 , uint256 , bool) {
    Group storage group = groups[groupID];
    return (group.name, group.numMembers, group.totalBalance, group.activePlan.price, group.initialized);
  }

  function getNumProviders() public view returns (uint256 ) {
    return numProviders;
  }

  function getNumPlans(uint256  providerID) public view returns (uint256 ) {
    return providers[providerID].numPlans;
  }

  function getNumGroups() public view returns (uint256 ) {
    return numGroups;
  }

  function getNumUsers() public view returns (uint256 ) {
    return numUsers;
  }

  function getNumGroupMembers(uint256  groupID) public view returns (uint256 ) {
    return groups[groupID].numMembers;
  }
}
