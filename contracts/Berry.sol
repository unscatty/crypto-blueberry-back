// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Berry {
  struct SubscriptionPlan {
    // uint planId;
    string name;
    string description;
    uint recurrence;  // in days
    uint price;
    bool active;
    uint8 maxMembers;
  }

  struct User {
    address owner;
    string name;
  }

  struct ServiceProvider {
    // uint providerId;
    string name;
    string imageURL;
    address serviceOwner;
    // Plan id
    uint numPlans;
    mapping(uint => SubscriptionPlan) plans;
  }

  struct Group {
    // uint groupId;
    string name;
    uint256 totalBalance;
    SubscriptionPlan activePlan;
    uint numMembers;
    mapping(address => GroupMember) members;
    bool initialized;
  }

  // The user inside a group
  struct GroupMember {
    // uint groupId;
    User member;
    // address member; // memberID
    uint256 balance;
  }

  // How many providers | providerId counter
  uint numProviders;
  // How many groups | groupId counter
  uint numGroups;
  // How many users | userId counter
  uint numUsers;

  // Collection of providers by id
  mapping(uint => ServiceProvider) public providers;
  // Collection of groups by groupId
  mapping(uint => Group) public groups;
  // Collection of users
  mapping(address => User) public users;
  // // Collection of plans by providerId
  // mapping(uint => SubscriptionPlan) public providerPlans;
  // // Collection of Members by groupId 
  // mapping(uint => GroupMember) public groupMembers;
  
  // constructor() public {
  // }

  // TODO: string optimizations

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
    // Get selected provider
    ServiceProvider storage provider = providers[providerID];

    require(address(msg.sender) == provider.serviceOwner, 'You are not allowed to do that');

    planID = provider.numPlans;
    provider.plans[planID] = SubscriptionPlan(name, description, recurrence, price, true, maxMembers);

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
    newMember.balance = msg.value;

    // Update number of members in group
    newGroup.numMembers++;

    // Update group balance
    newGroup.totalBalance += newMember.balance;
    newGroup.initialized = true;
  }

  function joinGroup(uint groupID) external payable returns (bool) {
    // Get group
    Group storage group = groups[groupID];
    
    require(group.initialized, 'Group does not exist');
    require(group.numMembers < group.activePlan.maxMembers, 'Group is full already');

    // Create new GroupMember
    GroupMember storage newMember = group.members[msg.sender];
    // Set user
    newMember.member = users[msg.sender];
    newMember.balance = msg.value;

    // Update group balance
    group.totalBalance += newMember.balance;

    // Update number of members in group
    group.numMembers++;

    // if ()

    return true;
  }

  function leaveGroup(uint groupID) external returns (bool){
    // Get group
    Group storage group = groups[groupID];

    require(group.initialized, 'Group does not exist');
    
    // Get group member of current user
    // GroupMember storage currentGM = group.members[msg.sender];

    // Delete member from group
    delete group.members[msg.sender];

    // Update member count
    group.numMembers--;

    return true;
  }
}
