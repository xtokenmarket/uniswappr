# UniSwappr

UniSwappr provides Uniswap V3 liquidity providers with the ability to reposition liquidity quickly, easily and precisely. LPs can fine-tune their repositioning parameters via our simulation interface and then execute their strategy in a few clicks.

UniSwappr is an experimental product and the smart contract has not been audited. While the contract does not take custody of user funds, it does process value during the atomic repositioning transaction. As such, we recommend only using Uniswappr for smaller liquidity positions as we battle-test it.

For now, the Uniswappr contract is deployed on Optimism, Arbitrum and Polygon at address `[INSERT]`. 

## How Does it Work
UniSwappr is a combination of a smart contract, off-chain scripts and an easy-to-use, intuitive front-end. 

The smart contract[ADD LINK]:
- removes liquidity from the old liquidity NFT position
- collect any unclaimed fees from the old position
- swaps from one token to another if necessary to accommodate new NFT position
- deposits liquidity into new position
- returns any remaining undeposited dust in the two tokens

The off-chain scripts:
- calculate the current ratio of deposited assets in equivalent terms
- calculate the target ratio of deposited assets in equivalent terms for the new position
- calculate the swap token and swap amount for the rebalance
- simulate the atomic transaction via the Alchemy simulation API
- parse the simulation results to return a digest of the asset changes

The frontend:
- queries for the user's open NFT liquidity positions
- renders important data on each position, including ticks, equivalent prices, deposited balances, etc.
- accepts a new price range denominated in the ratio between the assets (prices are converted to price ticks behind the scenes)
- produces a simulation of the reposition transaction
- executes the (NFT) approval and reposition transactions