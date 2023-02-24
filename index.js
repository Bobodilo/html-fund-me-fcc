import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undenifed") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "connected"
    } else {
        connectButton.innerHTML = "Please install Metamask"
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undenifed") {
        console.log("Withdrawing....")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenforTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funded with ${ethAmount}...`)
    //check if there's metamask
    if (typeof window.ethereum !== "undenifed") {
        //we need a provider/ connection to the blockchain
        // signer/ wallet/ person with gas
        //contract to interact with
        //ABI and Address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // Wait for this tx to finish
            await listenforTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undenifed") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        try {
            const balance = await provider.getBalance(contractAddress)
            console.log(ethers.utils.formatEther(balance))
        } catch (error) {
            console.log(error)
        }
    }
}

function listenforTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)

    // return new Promise()
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations`
                )
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}
