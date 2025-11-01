<template>
  <div class="app-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <img src="@/assets/cashramp.svg" alt="Cashramp" class="logo" />
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-headline">Your cash, without borders.</h1>
          <p class="hero-subheadline">
            Add cash from your bank or MoMo instantly. Pay across Africa or cash
            out anytime.
          </p>
        </div>
        <div class="buttons-container">
          <button class="btn--primary" @click="openModal('deposit')">
            Add cash
          </button>
          <button class="btn--outline" @click="openModal('withdraw')">
            Cash out
          </button>
        </div>
      </div>
    </section>

    <section v-if="countries.length > 0" class="countries-section">
      <div class="section-header">
        <h2 class="section-title">Spend across Africa</h2>
        <p class="section-subtitle">
          Send money to <strong>{{ countries.length }}</strong> countries in
          minutes <span class="emoji" aria-label="fast">⚡️</span>
        </p>
      </div>
      <div class="countries-grid">
        <div
          v-for="country in countries"
          :key="country.code"
          class="country-card"
        >
          <div class="country-flag">{{ getCountryFlag(country.code) }}</div>
          <div class="country-info">
            <span class="country-name">{{ country.name }}</span>
            <span class="country-currency">{{ country.currency.symbol }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="section-header">
        <h2 class="section-title">How it works</h2>
        <p class="section-subtitle">Fast, easy, and secure.</p>
      </div>
      <div class="steps-container">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3 class="step-title">Add cash</h3>
            <p class="step-description">
              Deposit money from your Bank or MoMo. Your funds are instantly
              converted to USDC and sent to your wallet.
            </p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3 class="step-title">Send across Africa</h3>
            <p class="step-description">
              Instantly cash out your USDC to any Bank or MoMo account in
              Africa.
            </p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3 class="step-title">Cash out</h3>
            <p class="step-description">
              Withdraw USDC to your Bank or MoMo account anytime. Funds arrive
              in your preferred currency.
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
import { getCountryFlag } from "./utilities";

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
});
</script>

<style scoped>
.app-container {
  width: 45%;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  background-color: var(--background-color);
  padding: 64px 32px;
  border-radius: 0 0 32px 32px;
}

.logo {
  height: 24px;
  margin-bottom: 48px;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-text {
  margin-bottom: 28px;
}

.hero-headline {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 8px;
  color: #000;
}

.hero-headline .emoji {
  display: inline-block;
  margin-left: 8px;
  font-size: 3rem;
  vertical-align: middle;
}

.hero-subheadline {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.buttons-container {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.buttons-container button {
  min-width: 200px;
}

.countries-section {
  padding: 64px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #000;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.countries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.country-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: #fff;
  transition: all 0.2s ease;
}

.country-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 53, 222, 0.1);
  transform: translateY(-2px);
}

.country-flag {
  font-size: 2rem;
  line-height: 1;
}

.country-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.country-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #000;
}

.country-currency {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.how-it-works-section {
  padding: 64px 0;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-top: 48px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.step {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.step:hover {
  border-color: var(--primary-color);
  box-shadow: 0 8px 24px rgba(0, 53, 222, 0.12);
  transform: translateY(-4px);
}

.step-number {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #000;
}

.step-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

@media screen and (max-width: 768px) {
  .app-container {
    width: 100%;
  }

  .hero-section {
    padding: 64px 24px;
  }

  .logo {
    height: 20px;
    margin-bottom: 24px;
  }

  .hero-headline {
    font-size: 2.4rem;
  }

  .hero-headline .emoji {
    font-size: 2rem;
  }

  .hero-subheadline {
    font-size: 1rem;
  }

  .countries-section,
  .how-it-works-section {
    padding: 48px 24px;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .countries-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .country-card {
    padding: 12px;
  }

  .country-flag {
    font-size: 1.5rem;
  }

  .steps-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .step {
    padding: 20px;
  }

  .buttons-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .buttons-container button {
    width: 120px !important;
    min-width: auto;
  }
}
</style>
