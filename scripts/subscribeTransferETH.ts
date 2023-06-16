import { ethers } from "hardhat";
import BridgePOLY from "../artifacts/contracts/BridgePOLY.sol/BridgePOLY.json";
import BridgeETH from "../artifacts/contracts/BridgeETH.sol/BridgeETH.json";

const providerPOLY = new ethers.AlchemyProvider(80001, process.env.POLYGON_API);
const providerETH = new ethers.AlchemyProvider(11155111, process.env.ETHEREUM_API);

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, providerPOLY);

const abiBridgePOLY = BridgePOLY.abi;
const bridgePOLYAddress = "0x753759911F21116fE8f61f8E541c66B77B68eFe7";
const bridgePOLYContract = new ethers.Contract(bridgePOLYAddress, abiBridgePOLY, providerPOLY);

const abiBridgeETH = BridgeETH.abi;
const bridgeETHAddress = "0xbf751DB310dff433145D47e7b51BfC07c9410Eb5";
const bridgeETHContract = new ethers.Contract(bridgeETHAddress, abiBridgeETH, providerETH);

const processedEvents = new Set();
bridgeETHContract.on("Transfer", async (from, to, amount, date, nonce, step) => {
    if (!processedEvents.has(`${nonce}-${step}`)) {
        processedEvents.add(`${nonce}-${step}`);
        if (step.toString() == 0) {
            await bridgePOLYContract.connect(signer).mint(to, amount, nonce);
            console.log("Transfer successful");
        }
        else{
            console.log("Transfer event received:");
            console.log("From:", from.toString());
            console.log("To:", to.toString());
            console.log("Amount:", amount.toString());
            console.log("Date:", date.toString());
            console.log("Nonce:", nonce.toString());
            console.log("Step:", step.toString());
        }
    }
});