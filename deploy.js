// Does how we import ethers to our script
const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    // http://127.0.0.1:7545 the API of our local ganache blockchain
    // Here we defined the RCP that we're going to connect
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    // Now we set up a wallet from ganache, and we paste the PK
    // The way to create a Wallet without encryption
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    //Let's create a wallet with its PRIVATE KEY encripted
    const encryptedJSON = fs.readFileSync("./encryptedKey.json", "utf-8")
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJSON,
        process.env.PRIVATE_KEY_PASSWORD
    )
    wallet = await wallet.connect(provider)
    // Now we can delete PRIVATE_KEY from .env
    // We can delete the PASSWORD too, but I let it to be able to remmeber it
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8"
    )
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("I'm deploying motherfucker...")
    const contract = await contractFactory.deploy()
    // console.log(contract);
    await contract.deployTransaction.wait(1)
    // Now we interact with the contract
    const favouriteNumber = await contract.retrieve()
    console.log(`The actual favourite number is ${favouriteNumber.toString()}`)
    const transactionResponse = await contract.store("85")
    const transactionReceipt = await transactionResponse.wait(1)
    const updatedFavouriteNumber = await contract.retrieve()
    console.log(`The new favourite number is ${updatedFavouriteNumber}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
