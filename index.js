// To connect MetaMask

import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
const getFunders = document.getElementById("myFunders")
const myETH = document.getElementById("myETH")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
getFunders.onclick = funders
myETH.onclick = ownerAmount

async function connect() {
  //Connect to MetaMask
  if (typeof window.ethereum != "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
    } catch (error) {
      console.error(error)
    }

    document.getElementById("connectButton").innerHTML = "Connected"
  } else {
    console.log("No MetaMask")
    document.getElementById("connectButton").innerHTML =
      "Please install MetaMask"
  }
}

//Fund funtion
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`funding with ${ethAmount}`)
  if (typeof window.ethereum != "undefined") {
    //Provide /Connection to blockchain
    //singer / wallet / someone with some gas
    //contract that we are intracting with
    //ABI & Address
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      //Listen to transaction to be mined

      await listenForTransactionMined(transactionResponse, provider)
      console.log("done")
    } catch (error) {
      console.error(error)
    }
  }
}

function listenForTransactionMined(transactionResponse, provider) {
  console.log(`Transaction hash ${transactionResponse.hash}`)
  //listen for event to be complete

  return new Promise((reslove, reject) => {
    provider.once(transactionResponse.hash, (transactionRecipt) => {
      console.log(
        `Completed with ${transactionRecipt.confirmations} confiramtion`
      )
      reslove()
    })
  })
}

//To get contract Balance
async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
  }
}

//Withdraw Eth to owner's wallet
async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const balance = await contract.withdraw()
  }
}

//Get Funders address
async function funders() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const funders = await contract.Funders(0)
    console.log(funders)
  }
}

//return total funded amount
async function ownerAmount() {
  const address = document.getElementById("address").value
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, abi, signer)
  const myETH = await contract.addressToAmount(address)
  console.log(myETH.toString())
}
