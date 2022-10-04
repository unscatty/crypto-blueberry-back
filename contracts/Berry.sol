// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "hardhat/console.sol";

contract Berry {
    struct SubscriptionPlan {
        uint providerID;
        string name;
        string description;
        uint recurrence; // in days
        uint price;
        bool active;
        uint8 maxMembers;
        uint256 pricePerMember;
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

    function createProvider(
        string memory name,
        string memory imageURL,
        address payable owner
    ) external onlyContractOwner returns (uint providerID) {
        providerID = numProviders++;

        // Create new service provider
        ServiceProvider storage newProvider = providers[providerID];
        newProvider.name = name;
        newProvider.imageURL = imageURL;
        newProvider.serviceOwner = owner;
    }

    function addPlan(
        uint providerID,
        string memory name,
        string memory description,
        uint recurrence,
        uint price,
        uint8 maxMembers
    ) external returns (uint planID) {
        // function addPlan(uint providerID, string memory name, string memory description, uint recurrence, uint price, uint8 maxMembers, uint pricePerMember) external returns (uint planID) {
        // Get selected provider
        ServiceProvider storage provider = providers[providerID];
        console.log(
            "Plan %s has a member price of %s",
            name,
            price / maxMembers
        );

        require(
            address(msg.sender) == provider.serviceOwner,
            "You are not allowed to create a plan"
        );

        planID = provider.numPlans;
        // pricePerMember = price / maxMembers;
        // provider.plans[planID] = SubscriptionPlan(name, description, recurrence, price, true, maxMembers, (price / maxMembers) / 1e18);
        provider.plans[planID] = SubscriptionPlan(
            providerID,
            name,
            description,
            recurrence,
            price,
            true,
            maxMembers,
            price / maxMembers
        );

        provider.numPlans++;
    }

    function register(string memory name) external {
        User storage newUser = users[msg.sender];
        newUser.name = name;

        numUsers++;
    }

    function createGroup(
        uint providerID,
        uint planID,
        string memory groupName
    ) external payable returns (uint groupID) {
        // Get desired plan
        SubscriptionPlan storage desiredPlan = providers[providerID].plans[
            planID
        ];
        // SubscriptionPlan storage desiredPlan = provider;

        require(desiredPlan.maxMembers > 0, "Plan is empty");
        require(
            msg.value >= desiredPlan.pricePerMember,
            "You need more cash to pay for this plan"
        );

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

        require(group.initialized, "Group does not exist");
        require(group.numMembers < plan.maxMembers, "Group is full already");
        require(
            msg.value >= plan.pricePerMember,
            "You need more cash to pay for this plan"
        );

        // Create new GroupMember
        GroupMember storage newMember = group.members[msg.sender];
        // Set user
        newMember.member = users[msg.sender];
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

        if (group.numMembers == plan.maxMembers) {
            // Pay the subscription
            // block.timestamp
            ServiceProvider storage provider = providers[plan.providerID];
            payable(provider.serviceOwner).transfer(group.totalBalance);
            // group.totalBalance = group.totalBalance / 2;
            // payable(provider.serviceOwner).transfer(1 ether);
        }

        return true;
    }

    function withdrawFromGroup(uint groupID) external payable {
        Group storage group = groups[groupID];
        SubscriptionPlan storage plan = group.activePlan;
        ServiceProvider storage provider = providers[plan.providerID];

        require(
            address(msg.sender) == provider.serviceOwner,
            "You cannot withdraw from this account"
        );

        if (group.numMembers == plan.maxMembers) {
            // Pay the subscription
            payable(msg.sender).transfer(group.totalBalance);
        }
    }

    // function payPlan(uint providerID, uint planID) internal {
    //   // SubscriptionPlan storage desiredPlan = providers[providerID].plans[planID];
    // }

    function leaveGroup(uint groupID) external returns (bool) {
        // Get group
        Group storage group = groups[groupID];

        require(group.initialized, "Group does not exist");

        // Get group member of current user
        // GroupMember storage currentGM = group.members[msg.sender];

        // Delete member from group
        delete group.members[msg.sender];

        // Update member count
        group.numMembers--;

        // Update groupBalance

        return true;
    }
}
