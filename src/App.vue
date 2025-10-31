<template>
  <div class="app-container">
    <img src="@/assets/cashramp.svg" alt="Cashramp" class="logo" />
    <p class="text-introduction text-gray-500">
      Deposit or withdraw via Bank/MoMo in
      <span class="text--primary font-bold">{{ countries.length }}</span>
      African countries
    </p>
    <div class="buttons-container">
      <button class="btn--primary mb-8" @click="openModal('deposit')">
        Deposit
      </button>
      <button class="btn--outline" @click="openModal('withdraw')">
        Withdraw
      </button>
    </div>
    <TransferModal v-model="showModal" :mode="mode" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import TransferModal from "./components/TransferModal.vue";
import { cashrampClient } from "./utilities/cashramp";
import { useConnect } from "./composables/useConnect";

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

  await useConnect();
});
</script>

<style scoped>
.app-container {
  text-align: center;
  width: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.logo {
  height: 28px;
  margin-bottom: 8px;
}

.text-introduction {
  font-size: 1.8rem;
  width: 60%;
  margin-bottom: 16px;
}

.account-info {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  width: 100%;
  text-align: left;
}

label {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.5);
}

.text {
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 2px;
}

button img {
  height: 20px;
  margin-left: 4px;
}

.buttons-container {
  min-width: 200px;
}

@media screen and (max-width: 768px) {
  .logo {
    height: 24px;
  }

  .app-container {
    width: 90%;
  }

  .text-introduction {
    width: 100%;
    font-size: 1.2rem;
  }

  .buttons-container {
    min-width: 70%;
  }
}
</style>
