import { BigNumberish, Signer, providers } from 'ethers';
import { ethers } from "hardhat";
import { Berry } from "../typechain-types";

export const getAllProviders = async (berry: Berry, ) => {
  const totalProviders = (await berry.numProviders()).toNumber()
  return Promise.all(Array.from({ length: totalProviders }, async (_, providerID) => await berry.providers(providerID)))
}

async function createProviders(berry: Berry, accountOwner: Signer, courserAccount: Signer) {
  
  // const duolingoAccount = await ethers.getSigner(process.env.PROVIDER_2_DOULINGO!)
  
  // const providers = "0xBE7bAEb4Bc8500433F94A576AA737fe1a38850B6";
  

  await berry.connect(accountOwner).createProvider('Coursera', 'https://yt3.ggpht.com/a/AGF-l7-rOqnsoRaW8LTM75Y2vuElIySnOe18OPUNnA=s900-c-k-c0xffffffff-no-rj-mo', courserAccount.getAddress())
  console.log('Creado proveedor Coursera')

  await berry.connect(accountOwner).createProvider('Duolingo', 'https://descargar.org/wp-content/uploads/2015/09/duolingo-iphone-logo.jpeg', courserAccount.getAddress())
  console.log('Creado proveedor Duolingo')

  await berry.connect(accountOwner).createProvider('Udemy', 'https://s.udemycdn.com/meta/default-meta-image-v2.png', courserAccount.getAddress())
  console.log('Creado proveedor Udemy')

  await berry.connect(accountOwner).createProvider('HboMax', 'https://www.cineuropa.org/imgCache/2022/07/05/1657010333451_0620x0435_44x0x1001x702_1657010361233.jpg', courserAccount.getAddress())
  console.log('Creado proveedor HboMax')

  await berry.connect(accountOwner).createProvider('Prime Video', 'https://play-lh.googleusercontent.com/VojafVZNddI6JvdDGWFrRmxc-prrcInL2AuBymsqGoeXjT4f9sv7KnetB-v3iLxk_Koi', courserAccount.getAddress())
  console.log('Creado proveedor Prime Video')
}

async function createDuolingoPlans(berry: Berry, providerAccount: Signer, providerID: BigNumberish) {
  await berry.connect(providerAccount).addPlan(providerID, 'Duolingo+ mensual', 'Subscripción familiar a Duolingo+. mensual.', 30, ethers.utils.parseEther('0.0002'), 50)
  await berry.connect(providerAccount).addPlan(providerID, 'Duolingo+ trimestral', 'Subscripción familiar a Duolingo+. trimestral.', 90, ethers.utils.parseEther('0.002'), 50)
  await berry.connect(providerAccount).addPlan(providerID, 'Duolingo+ anual', 'Subscripción familiar a Duolingo+. anual.', 365, ethers.utils.parseEther('0.002'), 50)
}

async function createCourseraPlans(berry: Berry, providerAccount: Signer, providerID: BigNumberish) {
  await berry.connect(providerAccount).addPlan(providerID, 'Coursera+ mensual', 'Subscripción familiar a Coursera+. mensual.', 30, ethers.utils.parseEther('0.0002'), 50)
  await berry.connect(providerAccount).addPlan(providerID, 'Coursera+ trimestral', 'Subscripción familiar a Coursera+. trimestral.', 90, ethers.utils.parseEther('0.002'), 50)
  await berry.connect(providerAccount).addPlan(providerID, 'Coursera+ anual', 'Subscripción familiar a Coursera+. anual.', 365, ethers.utils.parseEther('0.002'), 50)
}

async function createUdemyPlans(berry: Berry, providerAccount: Signer, providerID: BigNumberish) {
  await berry.connect(providerAccount).addPlan(providerID, 'Udemy+ mensual', 'Subscripción familiar a Udemy+. mensual.', 30, ethers.utils.parseEther('0.0002'), 50)
  await berry.connect(providerAccount).addPlan(providerID, 'Udemy+ trimestral', 'Subscripción familiar a Udemy+. trimestral.', 90, ethers.utils.parseEther('0.002'), 50)
  await berry.connect(providerAccount).addPlan(providerID, 'Udemy+ anual', 'Subscripción familiar a Udemy+. anual.', 365, ethers.utils.parseEther('0.002'), 50)
}

async function createHboMaxPlans(berry: Berry, providerAccount: Signer, providerID: BigNumberish) {
  await berry.connect(providerAccount).addPlan(providerID, 'HboMax+ mensual', 'Subscripción familiar a HboMax+. mensual.', 30, ethers.utils.parseEther('0.0002'), 50)
  await berry.connect(providerAccount).addPlan(providerID, 'HboMax+ trimestral', 'Subscripción familiar a HboMax+. trimestral.', 90, ethers.utils.parseEther('0.002'), 50)
  await berry.connect(providerAccount).addPlan(providerID, 'HboMax+ anual', 'Subscripción familiar a HboMax+. anual.', 365, ethers.utils.parseEther('0.002'), 50)
}

async function createPrimeVideoPlans(berry: Berry, providerAccount: Signer, providerID: BigNumberish) {
  await berry.connect(providerAccount).addPlan(providerID, 'Prime Video+ mensual', 'Subscripción familiar a Prime Video+. mensual.', 30, ethers.utils.parseEther('0.0002'), 50)
  await berry.connect(providerAccount).addPlan(providerID, 'Prime Video+ trimestral', 'Subscripción familiar a Prime Video+. trimestral.', 90, ethers.utils.parseEther('0.002'), 50)
  await berry.connect(providerAccount).addPlan(providerID, 'Prime Video+ anual', 'Subscripción familiar a Prime Video+. anual.', 365, ethers.utils.parseEther('0.002'), 50)
}

async function createDoulingoGroup(berry: Berry, account: Signer, providerID: BigNumberish) {
  await berry.connect(account).createGroup(providerID, 0, 'Duolingo+ Grupo 1', { value: ethers.utils.parseEther('0.02') })
  await berry.connect(account).createGroup(providerID, 1, 'Duolingo+ Grupo 2', { value: ethers.utils.parseEther('0.02') })
  await berry.connect(account).createGroup(providerID, 2, 'Duolingo+ Grupo 3', { value: ethers.utils.parseEther('0.02') })
  console.log('Creado grupo Duolingo')
}
async function createExtraGroup(berry: Berry, account: Signer, providerID: BigNumberish){
  await berry.connect(account).addPlan(providerID, 'Duolingo+ mensual reducida', 'Subscripción familiar a Duolingo+. mensual. 3 integrantes', 30, ethers.utils.parseEther('0.0002'), 3)
  await berry.connect(account).createGroup(providerID, 3, 'Grupo mensual de 3 integrantes', { value: ethers.utils.parseEther('0.02') })
  console.log('Creado grupo Extra')
}
async function createCourseraGroup(berry: Berry, account: Signer, providerID: BigNumberish) {
  // await berry.connect(account).createGroup(providerID, 0, 'Coursera+ Grupo 1', { value: ethers.utils.parseEther('0.0002') })
  await berry.connect(account).createGroup(providerID, 1, 'Coursera+ Grupo 2', { value: ethers.utils.parseEther('0.02') })
  await berry.connect(account).createGroup(providerID, 2, 'Coursera+ Grupo 3', { value: ethers.utils.parseEther('0.02') })
  console.log('Creado grupo Coursera')
}

async function createUdemyGroup(berry: Berry, account: Signer, providerID: BigNumberish) {
  await berry.connect(account).createGroup(providerID, 0, 'Udemy+ Grupo 1', { value: ethers.utils.parseEther('0.02') })
  await berry.connect(account).createGroup(providerID, 1, 'Udemy+ Grupo 2', { value: ethers.utils.parseEther('0.02') })
  await berry.connect(account).createGroup(providerID, 2, 'Udemy+ Grupo 3', { value: ethers.utils.parseEther('0.02') })
  console.log('Creado grupo Udemy')
}

async function createHboMaxGroup(berry: Berry, account: Signer, providerID: BigNumberish) {
  await berry.connect(account).createGroup(providerID, 0, 'HboMax+ Grupo 1', { value: ethers.utils.parseEther('0.02') })
  await berry.connect(account).createGroup(providerID, 1, 'HboMax+ Grupo 2', { value: ethers.utils.parseEther('0.02') })
  await berry.connect(account).createGroup(providerID, 2, 'HboMax+ Grupo 3', { value: ethers.utils.parseEther('0.02') })
  console.log('Creado grupo HboMax')
}

async function createPrimeVideoGroup(berry: Berry, account: Signer, providerID: BigNumberish) {
  await berry.connect(account).createGroup(providerID, 0, 'Prime Video+ Grupo 1', { value: ethers.utils.parseEther('0.02') })
  await berry.connect(account).createGroup(providerID, 1, 'Prime Video+ Grupo 2', { value: ethers.utils.parseEther('0.02') })
  await berry.connect(account).createGroup(providerID, 2, 'Prime Video+ Grupo 3', { value: ethers.utils.parseEther('0.02') })
  console.log('Creado grupo Prime Video')
}

export const getAllGroups = async (berry: Berry) => {
  const totalGroups = (await berry.numGroups()).toNumber();

  return Promise.all(
    Array.from(
      { length: totalGroups },
      async (_, groupID) => await berry.groups(groupID)
    )
  );
};


async function main() {
  const accountOwner = await ethers.getSigner(process.env.SIGNER_ADDR!)
  // const berry = await ethers.getContractAt('Berry', process.env.CONTRACT_ADDR!, accountOwner)
  const providerss = "0xBE7bAEb4Bc8500433F94A576AA737fe1a38850B6";
  // const providerAccount = await ethers.getSigner(providerss)
  
  const BerryContract = await ethers.getContractFactory('Berry');
  const berry = await BerryContract.deploy();

  // const providerAccount = await ethers.getSigner(process.env.PROVIDER_1_COURSERA!)
  await berry.deployed();

  console.log(`Contract Berry deployed at ${berry.address}`)



  //create providers
  await createProviders(berry, accountOwner, accountOwner);

  // create plan
  await createCourseraPlans(berry, accountOwner, 0);
  await createDuolingoPlans(berry, accountOwner, 1);
  await createUdemyPlans(berry, accountOwner, 2);
  await createHboMaxPlans(berry, accountOwner, 3);
  await createPrimeVideoPlans(berry, accountOwner, 4);

  // Crea grupos
  await createCourseraGroup(berry, accountOwner, 0)
  await createDoulingoGroup(berry, accountOwner, 1)
  await createUdemyGroup(berry, accountOwner, 2)
  await createHboMaxGroup(berry, accountOwner, 3)
  await createPrimeVideoGroup(berry, accountOwner, 4)

  // createExtraGroup(berry, accountOwner, 1)

  const numProviders = (await berry.numProviders()).toNumber()
  console.log(`Hay un total de ${numProviders} proveedores\n`)

  const providers = await getAllProviders(berry)

  providers.forEach((provider) => {
    console.log(`Proveedor ${provider.providerID}, nombre: ${provider.name}, planes: ${provider.numPlans}`)
  })

  const numGroups = await berry.numGroups()
  console.log(`Hay un total de ${numGroups.toString()} grupos`)

  const allGroups = await getAllGroups(berry)

  allGroups.forEach((group) => {
    console.log(`Nombre del grupo: ${group.name}, id del grupo: ${group.groupID}, creado: ${new Date(group.creationTimestamp.toNumber() * 1000)}`)
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
