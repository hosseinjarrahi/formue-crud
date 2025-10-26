<template>
  <transition name="fade" appear>
    <div v-if="modelValue" @keydown.escape="close" class="relative z-50" role="dialog">
      <!-- Backdrop - only show when not minimized -->
      <div
        v-if="!isMinimized"
        class="fixed inset-0 bg-black bg-opacity-30 transition-opacity backdrop-blur-sm"
        @click="close"
      ></div>

      <!-- Dialog Container -->
      <div class="fixed z-50 inset-0 overflow-hidden pointer-events-none">
        <!-- Dialog Panel -->
        <div
          ref="dialogRef"
          :class="[
            'absolute bg-white shadow-2xl border border-gray-200 pointer-events-auto transition-all duration-300',
            isDragging ? 'select-none' : '',
            isResizing ? 'select-none' : '',
            isMinimized ? 'rounded-t-xl shadow-lg' : 'rounded-xl'
          ]"
          :style="dialogStyle"
        >
          <!-- Header -->
          <div
            ref="headerRef"
            :class="[
              'flex items-center justify-between px-4 py-3 border-gray-200',
              isMinimized
                ? 'border-b-0 rounded-t-xl bg-gradient-to-r from-blue-100 to-indigo-100'
                : 'border-b rounded-t-xl bg-gradient-to-r from-blue-50 to-indigo-50',
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            ]"
            @mousedown="startDrag"
            @dblclick="isMinimized ? toggleMinimize() : toggleMaximize()"
          >
            <h3
              class="text-lg font-semibold text-gray-900 flex items-center gap-2 pointer-events-none"
            >
              <div
                :class="[
                  'w-2 h-2 rounded-full',
                  isMinimized ? 'bg-orange-500 animate-pulse' : 'bg-blue-500 animate-pulse'
                ]"
              ></div>
              {{ props.title }}
              <span v-if="isMinimized" class="text-sm text-gray-500 font-normal">(minimized)</span>
            </h3>

            <!-- Control Buttons -->
            <div class="flex items-center gap-1 pointer-events-auto">
              <!-- Minimize Button -->
              <button
                @click="toggleMinimize"
                class="p-1.5 rounded-full hover:bg-white/70 transition-colors group"
                :title="isMinimized ? 'Restore' : 'Minimize'"
              >
                <svg
                  class="w-4 h-4 text-gray-600 group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="!isMinimized"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H4"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>

              <!-- Maximize/Restore Button -->
              <button
                @click="toggleMaximize"
                class="p-1.5 rounded-full hover:bg-white/70 transition-colors group"
                :title="isMaximized ? 'Restore' : 'Maximize'"
                v-if="!isMinimized"
              >
                <svg
                  class="w-4 h-4 text-gray-600 group-hover:text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="!isMaximized"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m-4 12h2a2 2 0 002-2v-2"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 9h6v6H9V9zm0 0V7a2 2 0 012-2h2a2 2 0 012 2v2M9 15v2a2 2 0 002 2h2a2 2 0 002-2v-2"
                  />
                </svg>
              </button>

              <!-- Close Button -->
              <button
                @click="close"
                class="p-1.5 rounded-full hover:bg-red-100 transition-colors group"
                title="Close"
              >
                <svg
                  class="w-4 h-4 text-gray-600 group-hover:text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <transition name="slide-down">
            <div
              v-if="!isMinimized"
              class="flex flex-col overflow-hidden"
              :style="dialogContentStyle"
            >
              <!-- Scrollable Content Area -->
              <div class="flex-1 px-4 py-4 overflow-y-auto" :style="contentStyle">
                <slot></slot>
              </div>

              <!-- Fixed Actions Footer -->
              <div class="flex-shrink-0 bg-gray-50 px-4 py-3 border-t border-gray-200 rounded-b-xl">
                <div class="flex justify-end gap-2">
                  <slot name="actions">
                    <button
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                      @click="close"
                    >
                      لغو
                    </button>
                    <button
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                      @click="close"
                    >
                      تایید
                    </button>
                  </slot>
                </div>
              </div>
            </div>
          </transition>

          <!-- Resize Handle - Positioned as overlay -->
          <div
            v-if="!isMinimized && !isMaximized"
            class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hover:bg-blue-100 rounded-tl-lg transition-colors z-10"
            @mousedown="startResize"
            title="Resize"
          >
            <svg class="w-full h-full text-gray-400 p-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 22H20V20h2v2zm0-4H18v-2h4v2zm0-4H16v-2h6v2zm0-4H14v-2h8v2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { inject, ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { defineEmits, defineProps } from 'vue'

const store = inject('store')
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  title: { default: '' },
  modelValue: {}
})

// Refs
const dialogRef = ref(null)
const headerRef = ref(null)

// State
const position = ref({ x: 0, y: 0 })
const size = ref({ width: 512, height: window.innerHeight > 1080 ? window.innerHeight * 0.5 : window.innerHeight - 100 })
const isDragging = ref(false)
const isResizing = ref(false)
const isMinimized = ref(false)
const isMaximized = ref(false)
const originalState = ref({ position: { x: 0, y: 0 }, size: { width: 512, height: window.innerHeight > 1080 ? window.innerHeight * 0.5 : window.innerHeight - 100 } })

// Animation frame for smooth updates
let animationFrame = null

// Computed
const dialogStyle = computed(() => {
  if (isMinimized.value) {
    return {
      bottom: '1rem',
      left: '1rem',
      width: '300px',
      height: 'auto',
      transform: 'none'
    }
  }

  if (isMaximized.value) {
    return {
      top: '1rem',
      left: '1rem',
      width: 'calc(100vw - 2rem)',
      height: 'calc(100vh - 2rem)',
      transform: 'none'
    }
  }

  const style = {
    left: '50%',
    top: '50%',
    transform: `translate(calc(-50% + ${position.value.x}px), calc(-50% + ${position.value.y}px))`,
    width: `${size.value.width}px`,
    height: `${size.value.height}px`,
    minWidth: '300px',
    minHeight: '200px',
    maxWidth: '90vw',
    maxHeight: '90vh'
  }

  return style
})

const dialogContentStyle = computed(() => {
  if (isMaximized.value) {
    return { height: 'calc(100vh - 2rem - 50px)' } // Full height minus margins and header
  }
  return { height: `${size.value.height - 50}px` } // Dialog height minus header
})

const contentStyle = computed(() => {
  // Content area takes remaining space minus footer height (approx 65px)
  return { minHeight: '100px' }
})

// Methods
function close() {
  emit('update:modelValue', false)
  resetDialog()
}

function resetDialog() {
  position.value = { x: 0, y: 0 }
  size.value = { width: 512, height: window.innerHeight > 1080 ? window.innerHeight * 0.5 : window.innerHeight - 100 }
  isMinimized.value = false
  isMaximized.value = false
}

function toggleMinimize() {
  if (!isMinimized.value) {
    // Store current state before minimizing
    originalState.value = {
      position: { ...position.value },
      size: { ...size.value }
    }
    isMinimized.value = true
    isMaximized.value = false
  } else {
    // Restore from minimized state
    position.value = { ...originalState.value.position }
    size.value = { ...originalState.value.size }
    isMinimized.value = false
  }
}

function toggleMaximize() {
  if (!isMaximized.value) {
    originalState.value = {
      position: { ...position.value },
      size: { ...size.value }
    }
  } else {
    position.value = { ...originalState.value.position }
    size.value = { ...originalState.value.size }
  }
  isMaximized.value = !isMaximized.value
  isMinimized.value = false
}

function startDrag(event) {
  if (isMaximized.value || event.target.closest('button')) return

  event.preventDefault()
  isDragging.value = true

  const startX = event.clientX
  const startY = event.clientY
  const startPosX = position.value.x
  const startPosY = position.value.y

  function onDrag(event) {
    if (!isDragging.value) return

    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }

    animationFrame = requestAnimationFrame(() => {
      const deltaX = event.clientX - startX
      const deltaY = event.clientY - startY

      const newX = startPosX + deltaX
      const newY = startPosY + deltaY

      // Don't constrain minimized dialogs - let them be dragged anywhere
      if (isMinimized.value) {
        // For minimized state, we don't use position offset since it's positioned absolutely
        return
      }

      // Calculate constraints to keep dialog within window bounds
      const dialogWidth = size.value.width
      const dialogHeight = size.value.height
      
      // Calculate max position based on dialog dimensions
      const maxX = (window.innerWidth / 2) - (dialogWidth / 2)
      const minX = -(window.innerWidth / 2) + (dialogWidth / 2)
      const maxY = (window.innerHeight / 2) - (dialogHeight / 2)
      const minY = -(window.innerHeight / 2) + (dialogHeight / 2)

      position.value = {
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(minY, Math.min(maxY, newY))
      }
    })
  }

  function stopDrag() {
    isDragging.value = false
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
    document.removeEventListener('mousemove', onDrag, { passive: true })
    document.removeEventListener('mouseup', stopDrag)
  }

  document.addEventListener('mousemove', onDrag, { passive: true })
  document.addEventListener('mouseup', stopDrag)
}

function startResize(event) {
  event.preventDefault()
  event.stopPropagation()
  isResizing.value = true

  const startX = event.clientX
  const startY = event.clientY
  const startWidth = size.value.width
  const startHeight = size.value.height

  function onResize(event) {
    if (!isResizing.value) return

    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }

    animationFrame = requestAnimationFrame(() => {
      const deltaX = event.clientX - startX
      const deltaY = event.clientY - startY

      const newWidth = Math.max(300, Math.min(window.innerWidth * 0.9, startWidth + deltaX))
      const newHeight = Math.max(200, Math.min(window.innerHeight * 0.9, startHeight + deltaY))

      size.value = { width: newWidth, height: newHeight }
    })
  }

  function stopResize() {
    isResizing.value = false
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
    document.removeEventListener('mousemove', onResize, { passive: true })
    document.removeEventListener('mouseup', stopResize)
  }

  document.addEventListener('mousemove', onResize, { passive: true })
  document.addEventListener('mouseup', stopResize)
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  // Center the dialog initially
  position.value = { x: 0, y: 0 }
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Smooth transitions only when not dragging/resizing */
.absolute {
  transition: none;
}

/* Prevent text selection during interactions */
.select-none {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Improve cursor feedback */
.cursor-move {
  cursor: move;
}

.cursor-se-resize {
  cursor: se-resize;
}

.cursor-grabbing {
  cursor: grabbing;
}

.cursor-grab {
  cursor: grab;
}
</style>
