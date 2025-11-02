<template>
  <Modal v-model="open" :title="computedTitle">
    <label>Wallet address</label>
    <div class="flex justify-between w-full items-center mb-4">
      <p class="text-lg font-bold">
        {{ shortenAddress(address) || "N/A" }}
      </p>
      <button class="btn--reset" @click="copyToClipboard(address)">
        <icon
          :icon="['fas', 'copy']"
          class="wallet-address-copy h-[16px] w-[16px]"
        />
      </button>
    </div>

    <label>Country</label>
    <div class="country-select-wrapper">
      <select id="country" v-model="selectedCurrency" class="input">
        <option
          v-for="country in countries"
          :key="country.currency.isoCode"
          :value="country.currency.isoCode"
        >
          {{ country.name }} • {{ country.currency.isoCode }}
          {{ getCountryFlag(country.code) }}
        </option>
      </select>
      <span
        v-if="marketRate && selectedCountryCode"
        class="text-xs text-blue-800 mt-1 local-currency-estimate"
      >
        $1 ≈
        <strong>{{
          formatAmount(
            mode === "deposit"
              ? marketRate.depositRate
              : marketRate.withdrawalRate,
            selectedCurrency
          )
        }}</strong>
      </span>
    </div>

    <AmountInput v-model="amount" title="Amount" class="mt-4">
      <template #suffix>
        <img src="@/assets/usdc.webp" alt="USDC" class="h-4 w-4" />
        <span class="text-sm font-semibold text-gray-500">USDC</span>
      </template>
    </AmountInput>
    <span class="text-xs text-gray-500 mt-1"
      ><strong>{{ usdcBalance }}</strong> USDC balance</span
    >

    <template #footer>
      <button
        class="btn--primary w-full"
        @click="initiateTransfer"
        :disabled="!amountMeetsMinimum"
      >
        Continue
      </button>
    </template>
  </Modal>

  <div v-if="showIframe" class="iframe-overlay">
    <div class="iframe-wrapper" @click.stop>
      <iframe
        class="iframe"
        :src="iframeUrl"
        title="Cashramp Flow"
        allow="clipboard-write; payment *; accelerometer; autoplay; camera; gyroscope; microphone"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Modal from "./Modal.vue";
import AmountInput from "./AmountInput.vue";
import { cashrampClient } from "@/utilities/cashramp";
import { useConnectMiniApp } from "@/composables/useConnectMiniApp";
import { useWriteContract } from "@wagmi/vue";
import { parseUnits } from "viem";
import { getCountryFlag, shortenAddress, formatAmount } from "@/utilities";
import {
  USDC_BASE_ADDRESS,
  USDC_DECIMALS,
  ERC20_TRANSFER_ABI,
  COUNTRIES_STORAGE_KEY,
} from "@/utilities/constants";
import { useToast } from "vue-toast-notification";
import { useCopyToClipboard } from "@/composables/useCopyToClipboard";

const { copyToClipboard } = useCopyToClipboard();
const { address } = useConnectMiniApp();
const { writeContractAsync } = useWriteContract();
const $toast = useToast();

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  mode: { type: String, default: "deposit" },
  usdcBalance: { type: String, default: "0.00" },
});

const emit = defineEmits(["update:modelValue"]);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const computedTitle = computed(() => {
  return props.mode === "deposit" ? "Deposit" : "Cash out";
});

const amount = ref("");
const amountMeetsMinimum = computed(() => {
  return parseFloat(amount.value) >= 1;
});

const countries = ref([]);
const selectedCurrency = ref("NGN");
const marketRate = ref(null);
const selectedCountryCode = ref(null);

function close() {
  emit("update:modelValue", false);
}

const showIframe = ref(false);
const iframeUrl = ref("");

function initiateTransfer() {
  const params = new URLSearchParams({
    key: import.meta.env.VITE_CASHRAMP_PUBLIC_KEY,
    amount: parseFloat(amount.value),
    network: "BASE",
    coin: "USDC",
    paymentType: props.mode === "deposit" ? "deposit" : "withdrawal",
    currency: selectedCurrency.value || "",
    address: address.value,
    isWalletContext: false,
  });

  const url = `${import.meta.env.VITE_CASHRAMP_URL}?${params.toString()}`;

  iframeUrl.value = url;
  showIframe.value = true;

  close();
}

async function getCountries() {
  try {
    const result = await cashrampClient.getAvailableCountries();
    countries.value = result;

    const country = result.find(
      (c) => c.currency.isoCode === selectedCurrency.value
    );
    if (country) {
      selectedCountryCode.value = country.code;
      await fetchMarketRate(country.code);
    } else {
      if (result.length > 0) {
        selectedCurrency.value = result[0].currency.isoCode;
      }
    }
  } catch (err) {
    $toast.error(`Failed to load countries: ${err.message}`);
  }
}

async function fetchMarketRate(countryCode) {
  if (!countryCode) {
    marketRate.value = null;
    return;
  }

  try {
    const rate = await cashrampClient.getMarketRate(countryCode);
    marketRate.value = rate;
  } catch (err) {
    console.error(`Failed to load market rate: ${err.message}`);
    marketRate.value = null;
  }
}

watch(selectedCurrency, (newCurrency) => {
  if (newCurrency) {
    localStorage.setItem(COUNTRIES_STORAGE_KEY, newCurrency);
  }

  const country = countries.value.find(
    (c) => c.currency.isoCode === newCurrency
  );
  if (country) {
    selectedCountryCode.value = country.code;
    fetchMarketRate(country.code);
  } else {
    selectedCountryCode.value = null;
    marketRate.value = null;
  }
});

onMounted(() => {
  const savedCurrency = localStorage.getItem(COUNTRIES_STORAGE_KEY);
  if (savedCurrency) {
    selectedCurrency.value = savedCurrency;
  }

  getCountries();
  hookCryptoRequested();
});

async function requestCrypto(amountUsd, destination) {
  try {
    if (!address.value) {
      throw new Error("Wallet not connected");
    }

    if (!destination) {
      throw new Error("Destination address is required");
    }

    const amountInUnits = parseUnits(amountUsd.toString(), USDC_DECIMALS);

    const hash = await writeContractAsync({
      address: USDC_BASE_ADDRESS,
      abi: ERC20_TRANSFER_ABI,
      functionName: "transfer",
      args: [destination, amountInUnits],
    });

    return hash;
  } catch (error) {
    $toast.error(`Error requesting crypto: ${error.message}`);
    return null;
  }
}

const confirmationAttempts = ref(0);
const MAX_CONFIRMATION_ATTEMPTS = 25;
function pollConfirmation(paymentRequestId, hash) {
  if (confirmationAttempts.value >= MAX_CONFIRMATION_ATTEMPTS) {
    return;
  }

  cashrampClient.confirmTransaction(paymentRequestId, hash).then(() => {
    confirmationAttempts.value++;
  });

  setTimeout(() => {
    pollConfirmation(paymentRequestId, hash);
  }, 5000);
}

function hookCryptoRequested() {
  window.addEventListener("message", async (event) => {
    if (event.origin === "https://useaccrue.com") {
      const { event: name, payload } = event.data;
      if (name === "crypto.requested") {
        const amountUsd = Number(payload.amountCents) / 100;
        const destination = payload.destinationAddress;
        const paymentRequestId = payload.paymentRequest;

        const hash = await requestCrypto(amountUsd, destination);
        pollConfirmation(paymentRequestId, hash);
      }
    }
  });
}
</script>

<style>
.usdc-icon {
  width: 16px;
  height: 16px;
}

.usdc-text {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.country-select-wrapper {
  display: flex;
  flex-direction: column;
}

.local-currency-estimate {
  text-align: right;
}

.wallet-balance-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
  margin-top: 4px;
  display: block;
}

.wallet-address-text {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: var(--primary-color);
  color: #fff;
}

.option img {
  width: 24px;
  height: 24px;
  border-radius: 6px;
}

.token-texts {
  display: flex;
  flex-direction: column;
}

.token-symbol {
  font-weight: 800;
}

.token-name {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

.iframe-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 1100;
}

.iframe-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
}

.iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
