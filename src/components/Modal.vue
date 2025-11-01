<template>
  <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal" @click.stop>
      <div class="flex justify-between items-center p-4">
        <h3 class="text-2xl font-bold text-gray-800">{{ title }}</h3>
        <button class="btn--reset modal-close bg-gray-200" @click="close">
          <div
            class="bg-gray-200 rounded-full p-1 w-8 h-8 flex items-center justify-center"
          >
            <icon :icon="['fas', 'xmark']" class="h-[16px] w-[16px]" />
          </div>
        </button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: "" },
  closeOnEsc: { type: Boolean, default: true },
  closeOnOverlay: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue"]);

function close() {
  emit("update:modelValue", false);
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    close();
  }
}

function handleKeydown(event) {
  if (!props.closeOnEsc) {
    return;
  }
  if (event.key === "Escape") {
    close();
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}

.modal {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.modal-body {
  padding: 8px 20px 20px 20px;
}

.modal-footer {
  padding: 0 20px 20px 20px;
}
</style>
