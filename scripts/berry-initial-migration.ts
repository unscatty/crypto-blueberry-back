import { BigNumberish, Signer } from "ethers";
import { ethers } from "hardhat";
import { Berry } from "../typechain-types";

export const getAllProviders = async (berry: Berry, ) => {
  const totalProviders = (await berry.numProviders()).toNumber()
  return Promise.all(Array.from({ length: totalProviders }, async (_, providerID) => await berry.providers(providerID)))
}

async function createProviders(berry: Berry, accountOwner: Signer) {
  const courserAccount = await ethers.getSigner(process.env.PROVIDER_1_COURSERA!)
  const duolingoAccount = await ethers.getSigner(process.env.PROVIDER_2_DOULINGO!)

  await berry.connect(accountOwner).createProvider('Coursera', 'https://yt3.ggpht.com/a/AGF-l7-rOqnsoRaW8LTM75Y2vuElIySnOe18OPUNnA=s900-c-k-c0xffffffff-no-rj-mo', courserAccount.getAddress())
  console.log('Creado proveedor Coursera')

  await berry.connect(accountOwner).createProvider('Duolingo', 'https://descargar.org/wp-content/uploads/2015/09/duolingo-iphone-logo.jpeg', duolingoAccount.getAddress())
  console.log('Creado proveedor Duolingo')
}

async function createDuolingoPlans(berry: Berry, duolingoAccount: Signer, providerID: BigNumberish) {
  await berry.connect(duolingoAccount).addPlan(providerID, 'Duolingo+ 12 personas', 'Subscripción familiar a Duolingo+. Hasta 12 personas.', 30, ethers.utils.parseEther('0.06'), 12)
  await berry.connect(duolingoAccount).addPlan(providerID, 'Duolingo+ 6 personas', 'Subscripción familiar a Duolingo+. Hasta 6 personas.', 30, ethers.utils.parseEther('0.032'), 6)
  await berry.connect(duolingoAccount).addPlan(providerID, 'Duolingo+ 3 personas', 'Subscripción familiar a Duolingo+. Hasta 3 personas.', 30, ethers.utils.parseEther('0.02'), 3)
}

async function main() {
  const accountOwner = await ethers.getSigner(process.env.SIGNER_ADDR!)
  const berry = await ethers.getContractAt('Berry', process.env.CONTRACT_ADDR!, accountOwner)

  await berry.deployed();

  console.log(`Contract Berry deployed at ${berry.address}`)

  // Crea proveedores
  // await createProviders(berry, accountOwner)

  // Crea planes
  // const courserAccount = await ethers.getSigner(process.env.PROVIDER_1_COURSERA!)
  // const duolingoAccount = await ethers.getSigner(process.env.PROVIDER_2_DOULINGO!)
  // await createDuolingoPlans(berry, duolingoAccount, 1)

  const numProviders = (await berry.numProviders()).toNumber()
  console.log(`Hay un total de ${numProviders} proveedores\n`)

  const providers = await getAllProviders(berry)

  providers.forEach((provider) => {
    console.log(`Proveedor ${provider.providerID}, nombre: ${provider.name}, planes: ${provider.numPlans}`)
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
