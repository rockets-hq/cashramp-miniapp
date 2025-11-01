import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount, useReadContract } from "@wagmi/vue";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { formatUnits } from "viem";
import {
  USDC_BASE_ADDRESS,
  USDC_DECIMALS,
  ERC20_BALANCE_ABI,
} from "@/utilities/constants";

export function useConnectMiniApp() {
  const { address, connect } = useAccount();
  const walletUsdcBalance = ref(0);

  async function connectToWallet() {
    const isMiniApp = await sdk.isInMiniApp();
    const isReady = await sdk.actions.ready();
    if (isMiniApp && isReady) {
      connect({ connector: miniAppConnector() });
      getUsdcBalance();
    }
  }

  async function getUsdcBalance() {
    if (!address.value) {
      return;
    }

    try {
      const { data: balance } = await useReadContract({
        address: USDC_BASE_ADDRESS,
        abi: ERC20_BALANCE_ABI,
        functionName: "balanceOf",
        args: [address.value],
      });

      walletUsdcBalance.value = formatUnits(balance, USDC_DECIMALS);
    } catch (error) {
      console.error("Error fetching USDC balance:", error);
      walletUsdcBalance.value = 0;
    }
  }

  return { address, walletUsdcBalance, connectToWallet, getUsdcBalance };
}
