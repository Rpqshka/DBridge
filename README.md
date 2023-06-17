<h1 align="center">DBridge</h1>

DBridge - an application that can transfer tokens from the ethereum blockchain to the Polygon blockchain and vice versa. The application tracks the Transfer event and mints new coins in one blockchain while burning coins in the other.

___

<h2>Test</h2>

```npx hardhat test```

✔ Should be successfully deployed token contracts
✔ Should be a successful mint only by the owner of the contracts
✔ Should be a successful burn only by the owner of the contracts
✔ Should be successfully added a new admin

✔ Should be successfully transfer token from ETH to POLY chain and POLY to ETH

___

<h2>Deploy</h2>

In ```hadhat.config.ts``` change url and accounts variables. then go to the next step.

Use ```npx hardhat run --network ethereum scripts/deployETH.ts``` to deploy TokenETH and BridgeETH contracts.

Use ```npx hardhat run --network polygon scripts/deployPOLY.ts``` to deploy TokenPOLY and BridgePOLY contracts.

___

<h2>Using the application</h2>

Befor using you need to call a ```addAdmin``` function  with Bridge contracts address as a argument. 

Use ```npx hardhat run scripts/subscribeTransferPOLY.ts``` to subscribe to Transfer event in Polygon blockchain

[![2023-06-17-195314.png](https://i.postimg.cc/gJTMr8yt/2023-06-17-195314.png)](https://postimg.cc/Fd0bBfB0)

Use ```npx hardhat run scripts/subscribeTransferETH.ts``` to subscribe to Transfer event in Polygon blockchain

[![2023-06-17-195751.png](https://i.postimg.cc/tCQhCBQn/2023-06-17-195751.png)](https://postimg.cc/kDsVTF57)
