<template>
  <Modal v-model="open" :title="computedTitle">
    <div class="section">
      <label for="network" class="section-label">Network</label>
      <div class="options">
        <div class="option" id="network">
          <img src="@/assets/base.webp" alt="Base" />
          <span class="font-bold">Base</span>
        </div>
      </div>
    </div>

    <div class="section">
      <label for="token" class="section-label">Token</label>
      <div class="options">
        <div class="option" id="token">
          <img src="@/assets/usdc.webp" alt="USDC" />
          <div class="token-texts">
            <span class="font-bold">USDC</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <label for="country" class="section-label">Country</label>
      <select id="country" v-model="selectedCurrency" class="input">
        <option
          v-for="country in countries"
          :key="country.currency.symbol"
          :value="country.currency.symbol"
        >
          {{ country.name }}
        </option>
      </select>
    </div>

    <div class="section">
      <label for="amount" class="section-label">Amount (USDC)</label>
      <input
        v-model="amount"
        type="number"
        class="input"
        placeholder="0.00"
        id="amount"
      />
    </div>

    <template #footer>
      <button
        class="btn--primary"
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
import { computed, onMounted, ref } from "vue";
import Modal from "./Modal.vue";
import { cashrampClient } from "@/utilities/cashramp";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  mode: { type: String, default: "deposit" },
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
  return `${props.mode} ${selectedCurrency.value}`;
});

const amount = ref("");
const amountMeetsMinimum = computed(() => {
  return parseFloat(amount.value) >= 1;
});

const countries = ref([]);
const selectedCurrency = ref("NGN");

function close() {
  emit("update:modelValue", false);
}

function initiateTransfer() {
  const params = new URLSearchParams({
    key: import.meta.env.VITE_CASHRAMP_PUBLIC_KEY,
    amount: parseFloat(amount.value),
    network: "BASE",
    coin: "USDC",
    paymentType: props.mode === "deposit" ? "deposit" : "withdrawal",
    currency: selectedCurrency.value || "",
  });

  const url = `${import.meta.env.VITE_CASHRAMP_URL}?${params.toString()}`;

  iframeUrl.value = url;
  showIframe.value = true;

  close();
}

const showIframe = ref(false);
const iframeUrl = ref("");

onMounted(async () => {
  try {
    const result = await cashrampClient.getAvailableCountries();
    countries.value = result;
  } catch (err) {
    console.error("Failed to load countries:", err);
  }
});
</script>

<style scoped>
.section {
  margin-bottom: 16px;
  text-align: left;
}

.section-label {
  display: block;
  font-size: 1rem;
  margin-bottom: 8px;
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
  padding: 10px 8px;
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
