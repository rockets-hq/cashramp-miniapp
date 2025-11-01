<template>
  <div class="app-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <img src="@/assets/cashramp.svg" alt="Cashramp" class="logo" />
      <div class="hero-content">
        <div>
          <h1 class="text-4xl lg:text-5xl font-bold">
            Cash to USDC and back, instantly.
          </h1>
          <p class="mt-2 mb-8 text-gray-500 text-normal lg:text-xl">
            Add cash from your Bank or MoMo account. Pay across Africa or cash
            out anytime.
          </p>
        </div>
        <div class="flex flex-row gap-4 justify-center">
          <button
            class="btn--primary lg:min-w-[120px]"
            @click="openModal('deposit')"
          >
            <span class="mr-2"><icon :icon="['fas', 'plus']" /></span> Add cash
          </button>
          <button
            class="btn--outline lg:min-w-[120px]"
            @click="openModal('withdraw')"
          >
            <span class="mr-2"><icon :icon="['fas', 'minus']" /></span> Cash out
          </button>
        </div>
      </div>
    </section>

    <section v-if="countries.length > 0" class="countries-section">
      <div class="section-header">
        <h2 class="text-3xl font-bold text-gray-800">
          Pay across Africa
          <span><icon :icon="['fas', 'earth-africa']" /></span>
        </h2>
        <p class="text-gray-500 text-base lg:text-xl">
          Pay any Bank or MoMo account in Africa <strong>in minutes</strong>
          <span class="emoji" aria-label="fast">⚡️</span>
        </p>
      </div>
      <div class="countries-grid">
        <div
          v-for="country in countries.sort((a, b) =>
            a.name.localeCompare(b.name)
          )"
          :key="country.code"
          class="country-card"
        >
          <div class="country-flag">{{ getCountryFlag(country.code) }}</div>
          <div class="country-info">
            <span class="country-name"
              >{{ country.name }} ({{ country.currency.isoCode }})</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="section-header">
        <h2 class="text-3xl font-bold text-gray-800">How it works</h2>
        <p class="text-gray-500 text-base lg:text-xl">
          The quick, secure way to go from cash to crypto — made for everyday
          Africans.
        </p>
      </div>
      <div class="explanations-container">
        <div class="explanation">
          <div class="explanation-icon"><icon :icon="['fas', 'globe']" /></div>
          <div class="explanation-content">
            <h3 class="explanation-title">P2P agent network</h3>
            <p class="explanation-description">
              Cashramp connects you to a continent-wide network of trusted
              agents, making it possible to seamlessly go from cash to USDC and
              back.
            </p>
          </div>
        </div>
        <div class="explanation">
          <div class="explanation-icon"><icon :icon="['fas', 'plus']" /></div>
          <div class="explanation-content">
            <h3 class="explanation-title">Adding cash</h3>
            <p class="explanation-description">
              Add cash from your Bank or MoMo account in seconds. Your deposit
              is instantly converted to USDC and delivered to your wallet.
            </p>
          </div>
        </div>
        <div class="explanation">
          <div class="explanation-icon">
            <icon :icon="['fas', 'paper-plane']" />
          </div>
          <div class="explanation-content">
            <h3 class="explanation-title">Paying across Africa</h3>
            <p class="explanation-description">
              Whether it's a friend, family member, or a business, you can send
              local currency directly to their Bank or MoMo account.
            </p>
          </div>
        </div>
        <div class="explanation">
          <div class="explanation-icon"><icon :icon="['fas', 'minus']" /></div>
          <div class="explanation-content">
            <h3 class="explanation-title">Cashing out</h3>
            <p class="explanation-description">
              Instantly withdraw USDC to your Bank or MoMo account. Receive your
              money in your local currency within minutes.
            </p>
          </div>
        </div>
      </div>
    </section>

    <TransferModal v-model="showModal" :mode="mode" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import TransferModal from "./components/TransferModal.vue";
import { cashrampClient } from "./utilities/cashramp";
import { useConnectMiniApp } from "./composables/useConnectMiniApp";
import { useUSDCBalance } from "@/composables/useUsdcBalance";
import { getCountryFlag } from "./utilities";

const { fetchBalance } = useUSDCBalance();

const showModal = ref(false);
const mode = ref("deposit");
const countries = ref([]);

function openModal(selectedMode) {
  mode.value = selectedMode;
  showModal.value = true;
}

async function getCountries() {
  try {
    const result = await cashrampClient.getAvailableCountries();
    countries.value = result;
  } catch (err) {
    console.error("Failed to get countries:", err);
  }
}

onMounted(async () => {
  getCountries();

  const { connectToWallet } = useConnectMiniApp();
  await connectToWallet();
  await fetchBalance();
});
</script>

<style scoped>
@reference "tailwindcss";

.app-container {
  width: 45%;
  margin: 0 auto;
}

.hero-section {
  @apply text-center bg-blue-100 p-16;
  border-radius: 0 0 32px 32px;
}

.logo {
  @apply h-6 mb-12;
}

.hero-content {
  @apply max-w-2xl mx-auto;
}

.countries-section {
  padding: 64px 0;
}

.section-header {
  @apply text-center mb-12;
}

.countries-grid {
  @apply grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 max-w-7xl mx-auto;
}

.country-card {
  @apply flex items-center gap-4 px-4 p-2 bg-white rounded-xl border border-gray-200 transition-all duration-300;
}

.country-card:hover {
  @apply border-indigo-500 shadow-md transform -translate-y-1;
}

.country-flag {
  @apply text-2xl leading-none;
  line-height: 1;
}

.country-info {
  @apply flex flex-col gap-1 flex-1;
}

.country-name {
  @apply font-semibold text-sm text-gray-800;
}

.country-currency {
  @apply text-sm text-gray-500;
}

.how-it-works-section {
  padding: 64px 0;
}

.explanations-container {
  @apply grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-7xl mx-auto;
}

.explanation {
  @apply flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 transition-all duration-300;
}

.explanation:hover {
  @apply border-indigo-500 shadow-md transform -translate-y-2;
}

.explanation-icon {
  @apply flex-shrink-0 w-12 h-12 rounded-full bg-blue-800 text-white flex items-center justify-center text-2xl font-bold;
}

.explanation-content {
  @apply flex-1;
}

.explanation-title {
  @apply text-xl font-semibold mb-1 text-gray-800;
}

.explanation-description {
  @apply text-sm text-gray-500 leading-relaxed;
}

@media screen and (max-width: 768px) {
  .app-container {
    @apply w-full;
  }

  .hero-section {
    @apply p-12;
  }

  .logo {
    @apply h-5 mb-8;
  }

  .countries-section,
  .how-it-works-section {
    @apply py-12 px-4;
  }

  .country-card {
    @apply flex items-center gap-4 px-4 p-2 bg-white rounded-xl border border-blue-200 transition-all duration-300;
  }

  .country-flag {
    @apply text-2xl leading-none;
    line-height: 1;
  }

  .explanations-container {
    @apply grid grid-cols-1 gap-8 mt-12 max-w-7xl mx-auto;
  }

  .explanation {
    @apply flex items-center gap-4 p-4 bg-white rounded-2xl border border-blue-200 transition-all duration-300;
  }
}
</style>
