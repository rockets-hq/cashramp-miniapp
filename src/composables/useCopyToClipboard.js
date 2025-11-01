import { ref } from "vue";
import { useToast } from "vue-toast-notification";

const $toast = useToast();

export function useCopyToClipboard() {
  const isCopied = ref(false);

  async function copyToClipboard(text) {
    if (!text) {
      return false;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        $toast.success("Copied to clipboard");
        isCopied.value = true;

        setTimeout(() => {
          isCopied.value = false;
        }, 2000);

        return true;
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  }

  return {
    copyToClipboard,
    isCopied,
  };
}
