<template>
  <div id="tooltip" class="tooltip"></div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const tooltip = document.getElementById('tooltip')

  // Function to show the tooltip
  function showTooltip(event) {
    // Find the closest parent with the `data-tooltip` attribute
    const parentWithTooltip = event.target.closest('[data-tooltip]')
    if (parentWithTooltip) {
      const tooltipText = parentWithTooltip.getAttribute('data-tooltip')
      tooltip.textContent = tooltipText
      tooltip.style.left = `${event.pageX + 10}px`
      tooltip.style.top = `${event.pageY + 10}px`
      tooltip.classList.add('visible') // Add the visible class
    }
  }

  // Function to hide the tooltip
  function hideTooltip() {
    tooltip.classList.remove('visible') // Remove the visible class
  }

  // Event listeners for mouseover and mouseout
  document.addEventListener('mouseover', showTooltip)
  document.addEventListener('mouseout', hideTooltip)
})
</script>

<style scoped>
.tooltip {
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  opacity: 0; /* Start hidden */
  transform: translateY(-10px); /* Start slightly above */
  transition: opacity 0.3s ease, transform 0.3s ease; /* Smooth transition */
  pointer-events: none; /* Ensure the tooltip doesn't interfere with mouse events */
  z-index: 1000;
}

.tooltip.visible {
  opacity: 1; /* Fully visible */
  transform: translateY(0); /* Move to final position */
}
</style>
