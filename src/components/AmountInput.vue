<template>
  <div class="section">
    <label v-if="title" :for="inputId" class="section-label">{{ title }}</label>
    <div class="input-wrapper">
      <input
        :id="inputId"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="number"
        class="input"
        :placeholder="placeholder"
      />
      <div v-if="$slots.suffix" class="input-suffix">
        <slot name="suffix" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  title: { type: String, default: "" },
  placeholder: { type: String, default: "0.00" },
});

defineEmits(["update:modelValue"]);

const inputId = computed(() => {
  return `amount-input-${Math.random().toString(36).substr(2, 9)}`;
});
</script>

<style scoped>
.section {
  margin-bottom: 16px;
  text-align: left;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper .input {
  padding-right: 100px;
}

.input-suffix {
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  pointer-events: none;
}
</style>
