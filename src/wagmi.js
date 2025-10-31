// src/wagmi.ts
import { createConfig, http } from "@wagmi/vue";
import { base } from "viem/chains";

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});
