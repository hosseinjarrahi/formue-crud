<template>
  <div class="relative inline-block">
    <!-- Trigger element (can be customized) -->
    <slot name="trigger">
      <button
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
        class="text-blue-500 hover:underline"
      >
        Hover me for a tooltip
      </button>
    </slot>

    <!-- Tooltip (customizable content) -->
    <div v-if="showTooltip" :class="tooltipClasses" :style="tooltipStyles">
      <slot name="content"> This is your tooltip content! </slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTooltip: false
    }
  },
  props: {
    // Customize tooltip position (default: bottom-center)
    position: {
      type: String,
      default: 'bottom-center'
    }
  },
  computed: {
    tooltipClasses() {
      // Add custom classes based on position
      return `absolute bg-gray-800 text-white p-2 rounded-md shadow-md z-10 ${this.position}`
    },
    tooltipStyles() {
      // Add custom styles for positioning
      return {
        top: this.position.includes('top') ? '100%' : '',
        bottom: this.position.includes('bottom') ? '100%' : '',
        left: this.position.includes('left') ? '0' : '',
        right: this.position.includes('right') ? '0' : '',
        transform: this.position.includes('center') ? 'translateX(-50%)' : ''
      }
    }
  }
}
</script>

<style scoped>
/* Add any custom styling for your tooltip here */
</style>
