import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount, useConnect } from "@wagmi/vue";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

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

  return { address, connectToWallet };
}
