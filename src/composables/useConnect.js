import { sdk } from "@farcaster/miniapp-sdk";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

export async function useConnect() {
  const isMiniApp = await sdk.isInMiniApp();
  const isReady = await sdk.actions.ready();
  if (isMiniApp && isReady) {
    connect({ connector: miniAppConnector() });
  }
}
