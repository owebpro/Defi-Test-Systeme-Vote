import hre from "hardhat";

async function main() {

  const simpleStorage = await hre.ethers.getContractFactory('SimpleStorage')
  
  const contract = simpleStorage.attach( "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9" )
  
  let number = await contract.getNumber()
  console.log('Default number : ' + number.toString())
  await contract.setNumber(7)
  number = await contract.getNumber()
  console.log('Updated number : ' + number.toString())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});