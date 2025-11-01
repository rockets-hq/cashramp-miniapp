import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount, useReadContract } from "@wagmi/vue";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { formatUnits } from "viem";
import { wagmiConfig } from "@/wagmi";
import {
  USDC_BASE_ADDRESS,
  USDC_DECIMALS,
  ERC20_BALANCE_ABI,
} from "@/utilities/constants";

export function useConnectMiniApp() {
  const { address } = useAccount();
  const { connect } = useAccount();

  async function connectToWallet() {
    const isMiniApp = await sdk.isInMiniApp();
    const isReady = await sdk.actions.ready();
    if (isMiniApp && isReady) {
      connect({ connector: miniAppConnector() });
    }
  }

  async function getUsdcBalance() {
    if (!address.value) {
      return 0;
    }

    try {
      const { data: balance } = await readContractAsync({
        address: USDC_BASE_ADDRESS,
        abi: ERC20_BALANCE_ABI,
        functionName: "balanceOf",
        args: [address.value],
      });

      return formatUnits(balance, USDC_DECIMALS);
    } catch (error) {
      console.error("Error fetching USDC balance:", error);
      return 0;
    }
  }

  return { address, connectToWallet, getUsdcBalance };
}
