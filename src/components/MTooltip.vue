<template>
  <div id="tooltip" class="tooltip"></div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.addEventListener('DOMContentLoaded', function () {
    const tooltip = document.getElementById('tooltip')

    // Function to show the tooltip
    function showTooltip(event) {
      const parentWithTooltip = event.target.closest('[data-tooltip]')
      if (parentWithTooltip) {
        const tooltipText = parentWithTooltip.getAttribute('data-tooltip')
        tooltip.textContent = tooltipText
        tooltip.style.display = 'block'
        tooltip.style.left = `${event.pageX + 10}px`
        tooltip.style.top = `${event.pageY + 10}px`
      }
    }

    // Function to hide the tooltip
    function hideTooltip() {
      tooltip.style.display = 'none'
    }

    // Event listeners for mouseover and mouseout
    document.addEventListener('mouseover', showTooltip)
    document.addEventListener('mouseout', hideTooltip)
  })
})
</script>

<style scoped>
.tooltip {
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 4px;
  font-size: 14px;
  display: none;
  z-index: 1000;
}
</style>
