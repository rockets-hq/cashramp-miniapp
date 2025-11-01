<template>
  <div class="app-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <img src="@/assets/cashramp.svg" alt="Cashramp" class="logo" />

      <div class="mb-8 usp-marquee-container">
        <div class="usp-marquee">
          <div class="usp-marquee-track">
            <span class="usp-pill">Best rates 💸</span>
            <span class="usp-pill">90s delivery ⚡️</span>
            <span class="usp-pill">24/7 support 🕑</span>
            <span class="usp-pill">Reliable ✅</span>
            <span class="usp-pill">Secure 🔒</span>
            <span class="usp-pill">Easy onboarding 🤝</span>
            <span class="usp-pill">Across Africa 🌍</span>
            <!-- Duplicate for seamless loop -->
            <span class="usp-pill">Best rates 💸</span>
            <span class="usp-pill">90s delivery ⚡️</span>
            <span class="usp-pill">24/7 support 🕑</span>
            <span class="usp-pill">Reliable ✅</span>
            <span class="usp-pill">Secure 🔒</span>
            <span class="usp-pill">Easy onboarding 🤝</span>
            <span class="usp-pill">Across Africa 🌍</span>
          </div>
        </div>
      </div>

      <div class="hero-content">
        <h1 class="text-4xl lg:text-5xl font-bold">
          Cash ↔ USDC, as easy as MoMo. 🌍⚡️
        </h1>
        <div class="mt-8 flex flex-row gap-4 justify-center">
          <button
            class="btn--primary lg:min-w-[120px]"
            @click="openModal('deposit')"
          >
            <span class="mr-2"><icon :icon="['fas', 'plus']" /></span> Deposit
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
          Send money anywhere in Africa
          <span><icon :icon="['fas', 'earth-africa']" /></span>
        </h2>
        <p class="mt-2 text-gray-500 text-lg lg:text-xl">
          Pay any Bank or MoMo account within Africa <strong>in seconds</strong>
          <span class="emoji" aria-label="fast">⚡️</span>
        </p>
      </div>
      <div class="countries-grid">
        <div
          v-for="country in countries.sort(
            (a, b) => a.name.length - b.name.length
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
        <p class="mt-2 text-gray-500 text-lg lg:text-xl">
          The easiest, fastest, and most reliable way to send money across
          Africa.
        </p>
      </div>
      <div class="explanations-container">
        <div class="explanation">
          <div class="explanation-icon"><icon :icon="['fas', 'globe']" /></div>
          <div class="explanation-content">
            <h3 class="explanation-title">P2P agent network</h3>
            <p class="explanation-description">
              Cashramp connects you to trusted agents across Africa, making it
              possible to seamlessly go from cash to USDC and back,
              <span class="font-bold text-blue-800">easy as MoMo</span>.
            </p>
          </div>
        </div>
        <div class="explanation">
          <div class="explanation-icon"><icon :icon="['fas', 'plus']" /></div>
          <div class="explanation-content">
            <h3 class="explanation-title">Adding cash</h3>
            <p class="explanation-description">
              Deposit from your Bank or MoMo account
              <span class="font-bold text-blue-800">in seconds</span>. Your
              deposit is instantly converted to USDC and delivered to your
              wallet.
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
              Whether it's a friend, family member, or a business, send local
              currency directly to their
              <span class="font-bold text-blue-800">Bank or MoMo account</span>.
            </p>
          </div>
        </div>
        <div class="explanation">
          <div class="explanation-icon"><icon :icon="['fas', 'minus']" /></div>
          <div class="explanation-content">
            <h3 class="explanation-title">Cashing out</h3>
            <p class="explanation-description">
              Instantly withdraw USDC to your
              <span class="font-bold text-blue-800">Bank or MoMo account</span>.
              Receive your money in your preferred local currency
              <span class="font-bold text-blue-800">in seconds</span>.
            </p>
          </div>
        </div>
      </div>
    </section>

    <TransferModal
      v-model="showModal"
      :mode="mode"
      :usdcBalance="usdcBalance"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import TransferModal from "./components/TransferModal.vue";
import { cashrampClient } from "./utilities/cashramp";
import { useConnectMiniApp } from "./composables/useConnectMiniApp";
import { getCountryFlag } from "./utilities";
import { useUSDCBalance } from "./composables/useUsdcBalance";

const { usdcBalance, fetchBalance } = useUSDCBalance();
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
  @apply flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-500 transition-all duration-300;
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
  @apply flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-500 transition-all duration-300;
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

.usp-marquee-container {
  @apply overflow-hidden w-full;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
}

.usp-marquee {
  @apply overflow-hidden;
}

.usp-marquee-track {
  @apply flex gap-4;
  animation: marquee 20s linear infinite;
  will-change: transform;
}

.usp-pill {
  @apply px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap bg-white;
  flex-shrink: 0;
  color: black;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  transform: scale(1);
  transition: all 0.3s ease;
  animation: pulse-glow 3s ease-in-out infinite;
}

.usp-pill::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(191, 191, 233, 0.153),
    transparent
  );
  animation: shine 3s infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 4px 14px 0 rgba(255, 255, 255, 0.39),
      0 0 20px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 6px 20px 0 rgba(255, 255, 255, 0.5),
      0 0 30px rgba(255, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
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

  .explanations-container {
    @apply grid grid-cols-1 gap-8 mt-12 max-w-7xl mx-auto;
  }
}
</style>
