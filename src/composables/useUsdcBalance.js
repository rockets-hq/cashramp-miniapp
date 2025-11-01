import { ref } from "vue";
import { useAccount } from "@wagmi/vue";
import { USDC_BASE_ADDRESS, USDC_DECIMALS } from "@/utilities/constants";

export function useUSDCBalance() {
  const { address } = useAccount();

  const usdcBalance = ref("0.00");

  const fetchBalance = async () => {
    if (!address.value) {
      return;
    }

    try {
      const rpcUrl = "https://mainnet.base.org";
      const data = `0x70a08231000000000000000000000000${address.value.slice(
        2
      )}`;

      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_call",
          params: [
            {
              to: USDC_BASE_ADDRESS,
              data: data,
            },
            "latest",
          ],
          id: 1,
        }),
      });

      const result = await response.json();
      if (result.error) {
        return;
      }

      usdcBalance.value = (
        Number(BigInt(result.result)) /
        10 ** USDC_DECIMALS
      ).toFixed(2);
    } catch (err) {
      console.error("Error fetching USDC balance:", err);
    }
  };

  return {
    usdcBalance,
    fetchBalance,
  };
}
