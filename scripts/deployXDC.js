const { ethers } = require('hardhat');
const { writeFileSync } = require('fs');

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

async function main() {

  const ehr = await deploy('EHR', "0xb3db178db835b4dfcb4149b2161644058393267d");
  console.log("EHR deployed to:", ehr.address);

  writeFileSync('deployxdc.json', JSON.stringify({
    EHR: ehr.address
  }, null, 2));

}

if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}