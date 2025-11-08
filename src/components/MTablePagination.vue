<template>
  <div
    id="paginate"
    v-if="store.mainPagination.lastPage && store.mainPagination.lastPage > 1"
    :dir="dir"
  >
    <!-- Desktop Layout -->
    <div
      class="hidden lg:flex flex-row items-center justify-between gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <!-- Page Information -->
      <div class="text-sm text-gray-600 dark:text-gray-300">
        <span v-if="store.mainPagination.total">
          {{ $fcTr('showing') }} {{ startItem }}-{{ endItem }} {{ $fcTr('of') }}
          {{ store.mainPagination.total }} {{ $fcTr('results') }}
        </span>
      </div>

      <!-- Page Size Selector -->
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap"
          >{{ $fcTr('show') }}:</label
        >
        <select
          v-model="pageSize"
          @change="changePageSize"
          class="text-sm border border-gray-300 dark:border-gray-600 rounded-md pr-6 pl-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <!-- Pagination Controls -->
      <div class="flex items-center gap-1">
        <!-- First Page Button -->
        <button
          @click="goToPage(1)"
          :disabled="store.mainPagination.currentPage === 1"
          class="hidden sm:flex p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          :title="$fcTr('first')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Previous Page Button -->
        <button
          @click="prevPage"
          :disabled="store.mainPagination.currentPage === 1"
          class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          :title="$fcTr('previous')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Page Numbers -->
        <div class="flex items-center gap-1">
          <template v-for="(page, index) in showNum()" :key="`page-${index}-${page}`">
            <!-- Ellipsis -->
            <span
              v-if="page === '...'"
              class="px-2 sm:px-3 py-1 text-gray-500 dark:text-gray-400 text-sm"
            >
              ...
            </span>

            <!-- Page Number -->
            <button
              v-else
              @click="goToPage(page)"
              :class="[
                'px-2 sm:px-3 py-1 text-sm font-medium rounded-md transition-all duration-200',
                store.mainPagination.currentPage === page
                  ? 'bg-indigo-600 text-white shadow-sm transform scale-105'
                  : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              {{ page }}
            </button>
          </template>
        </div>

        <!-- Next Page Button -->
        <button
          @click="nextPage"
          :disabled="store.mainPagination.currentPage === store.mainPagination.lastPage"
          class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          :title="$fcTr('next')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- Last Page Button -->
        <button
          @click="goToPage(store.mainPagination.lastPage)"
          :disabled="store.mainPagination.currentPage === store.mainPagination.lastPage"
          class="hidden sm:flex p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          :title="$fcTr('last')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <!-- Jump to Page Input -->
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap"
          >{{ $fcTr('page') }}:</label
        >
        <input
          v-model.number="jumpToPage"
          @keyup.enter="handleJumpToPage"
          type="number"
          :min="1"
          :max="store.mainPagination.lastPage"
          class="w-16 text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          :placeholder="$fcTr('go_to_page')"
        />
        <span class="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap"
          >{{ $fcTr('of') }} {{ store.mainPagination.lastPage }}</span
        >
      </div>
    </div>

    <!-- Tablet Layout -->
    <div
      class="hidden md:flex lg:hidden flex-col gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <!-- Top Row: Page Info and Page Size -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="text-sm text-gray-600 dark:text-gray-300">
          <span v-if="store.mainPagination.total">
            {{ $fcTr('showing') }} {{ startItem }}-{{ endItem }} {{ $fcTr('of') }}
            {{ store.mainPagination.total }} {{ $fcTr('results') }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap"
            >{{ $fcTr('show') }}:</label
          >
          <select
            v-model="pageSize"
            @change="changePageSize"
            class="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option v-for="size in pageSizeOptions" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
      </div>

      <!-- Bottom Row: Pagination Controls and Jump to Page -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-1">
          <!-- Previous Page Button -->
          <button
            @click="prevPage"
            :disabled="store.mainPagination.currentPage === 1"
            class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            :title="$fcTr('previous')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <!-- Page Numbers -->
          <div class="flex items-center gap-1">
            <template v-for="(page, index) in showNum()" :key="`page-${index}-${page}`">
              <!-- Ellipsis -->
              <span
                v-if="page === '...'"
                class="px-2 py-1 text-gray-500 dark:text-gray-400 text-sm"
              >
                ...
              </span>

              <!-- Page Number -->
              <button
                v-else
                @click="goToPage(page)"
                :class="[
                  'px-2 py-1 text-sm font-medium rounded-md transition-all duration-200',
                  store.mainPagination.currentPage === page
                    ? 'bg-indigo-600 text-white shadow-sm transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
            </template>
          </div>

          <!-- Next Page Button -->
          <button
            @click="nextPage"
            :disabled="store.mainPagination.currentPage === store.mainPagination.lastPage"
            class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            :title="$fcTr('next')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <!-- Jump to Page Input -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap"
            >{{ $fcTr('page') }}:</label
          >
          <input
            v-model.number="jumpToPage"
            @keyup.enter="handleJumpToPage"
            type="number"
            :min="1"
            :max="store.mainPagination.lastPage"
            class="w-16 text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            :placeholder="$fcTr('go_to_page')"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap"
            >{{ $fcTr('of') }} {{ store.mainPagination.lastPage }}</span
          >
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div
      class="flex md:hidden flex-col gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <!-- Page Information -->
      <div class="text-center text-sm text-gray-600 dark:text-gray-300">
        <span v-if="store.mainPagination.total">
          {{ $fcTr('showing') }} {{ startItem }}-{{ endItem }} {{ $fcTr('of') }}
          {{ store.mainPagination.total }} {{ $fcTr('results') }}
        </span>
      </div>

      <!-- Page Size Selector -->
      <div class="flex items-center justify-center gap-2">
        <label class="text-sm text-gray-600 dark:text-gray-300">{{ $fcTr('show') }}:</label>
        <select
          v-model="pageSize"
          @change="changePageSize"
          class="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <!-- Pagination Controls -->
      <div class="flex items-center justify-center gap-1">
        <!-- Previous Page Button -->
        <button
          @click="prevPage"
          :disabled="store.mainPagination.currentPage === 1"
          class="p-3 rounded-md text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          :title="$fcTr('previous')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- Current Page Display -->
        <div class="flex items-center gap-2 px-3">
          <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{
            store.mainPagination.currentPage
          }}</span>
          <span class="text-sm text-gray-500 dark:text-gray-400">/</span>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{
            store.mainPagination.lastPage
          }}</span>
        </div>

        <!-- Next Page Button -->
        <button
          @click="nextPage"
          :disabled="store.mainPagination.currentPage === store.mainPagination.lastPage"
          class="p-3 rounded-md text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          :title="$fcTr('next')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <!-- Jump to Page Input -->
      <div class="flex items-center justify-center gap-2">
        <label class="text-sm text-gray-600 dark:text-gray-300">{{ $fcTr('page') }}:</label>
        <input
          v-model.number="jumpToPage"
          @keyup.enter="handleJumpToPage"
          type="number"
          :min="1"
          :max="store.mainPagination.lastPage"
          class="w-20 text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          :placeholder="$fcTr('go_to_page')"
        />
      </div>
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50"
      style="backdrop-filter: blur(2px)"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
        <div class="flex items-center space-x-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          <span class="text-sm text-gray-600 dark:text-gray-300">{{ $fcTr('loading') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, computed, watch, onMounted, onUnmounted } from 'vue'

const store = inject('store')
const tableOptions = inject('tableOptions')
const dir = inject('dir', 'ltr')

// Reactive state
const pageSize = ref(tableOptions?.paginationSize || 10)
const jumpToPage = ref(null)
const isLoading = ref(false)

// Page size options - match with tabulator defaults
const pageSizeOptions = tableOptions?.paginationSizeSelector || [5, 10, 15, 25, 50, 100]

// Computed properties
const startItem = computed(() => {
  if (!store.mainPagination.total) return 0
  return (store.mainPagination.currentPage - 1) * pageSize.value + 1
})

const endItem = computed(() => {
  if (!store.mainPagination.total) return 0
  const end = store.mainPagination.currentPage * pageSize.value
  return Math.min(end, store.mainPagination.total)
})

// Watch for pagination changes to update jumpToPage
watch(
  () => store.mainPagination.currentPage,
  (newPage) => {
    jumpToPage.value = newPage
  }
)

// Keyboard navigation
const handleKeyDown = (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      prevPage()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextPage()
      break
    case 'Home':
      event.preventDefault()
      goToPage(1)
      break
    case 'End':
      event.preventDefault()
      goToPage(store.mainPagination.lastPage)
      break
  }
}

onMounted(() => {
  jumpToPage.value = store.mainPagination.currentPage
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// Pagination functions
async function paginate(page) {
  if (page < 1 || page > store.mainPagination.lastPage) return

  isLoading.value = true
  try {
    await store.paginate(page)
  } finally {
    isLoading.value = false
  }
}

function prevPage() {
  if (store.mainPagination.currentPage > 1) {
    paginate(store.mainPagination.currentPage - 1)
  }
}

function nextPage() {
  if (store.mainPagination.currentPage < store.mainPagination.lastPage) {
    paginate(store.mainPagination.currentPage + 1)
  }
}

function goToPage(pageNumber) {
  if (pageNumber >= 1 && pageNumber <= store.mainPagination.lastPage) {
    paginate(pageNumber)
  }
}

function handleJumpToPage() {
  const page = parseInt(jumpToPage.value)
  if (!isNaN(page) && page >= 1 && page <= store.mainPagination.lastPage) {
    goToPage(page)
  } else {
    jumpToPage.value = store.mainPagination.currentPage
  }
}

async function changePageSize() {
  isLoading.value = true
  try {
    // Update the table options with new page size
    if (tableOptions) {
      tableOptions.paginationSize = pageSize.value
    }

    // Reload data with new page size
    await store.loadItems(store.mainKey, 1)
  } finally {
    isLoading.value = false
  }
}

function showNum() {
  const array = []
  const lastPage = store.mainPagination.lastPage
  const currentPage = store.mainPagination.currentPage

  if (lastPage <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= lastPage; i++) {
      array.push(i)
    }
  } else {
    // Always show first page
    array.push(1)

    if (currentPage > 3) {
      array.push('...')
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(lastPage - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      array.push(i)
    }

    if (currentPage < lastPage - 2) {
      array.push('...')
    }

    // Always show last page
    if (lastPage > 1) {
      array.push(lastPage)
    }
  }

  return array
}
</script>

<style scoped>
/* Custom animations and transitions */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

#paginate {
  animation: fadeIn 0.3s ease-out;
}

/* Focus styles for accessibility */
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .dark\:border-gray-600 {
    border-color: #4b5563;
  }

  .dark\:bg-gray-700 {
    background-color: #374151;
  }

  .dark\:text-gray-100 {
    color: #f3f4f6;
  }
}

/* RTL specific styles */
[dir='rtl'] .flex {
  flex-direction: row-reverse;
}

[dir='rtl'] .gap-1 > * + * {
  margin-right: 0;
  margin-left: 0.25rem;
}

[dir='rtl'] .gap-2 > * + * {
  margin-right: 0;
  margin-left: 0.5rem;
}

[dir='rtl'] .gap-4 > * + * {
  margin-right: 0;
  margin-left: 1rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  /* Mobile specific styles */
  .mobile-touch-target {
    min-height: 44px;
    min-width: 44px;
  }

  /* Ensure proper spacing on mobile */
  .gap-1 > * + * {
    margin-left: 0.125rem;
    margin-right: 0.125rem;
  }

  [dir='rtl'] .gap-1 > * + * {
    margin-left: 0.125rem;
    margin-right: 0.125rem;
  }
}

@media (max-width: 768px) {
  /* Tablet specific styles */
  .tablet-layout {
    padding: 0.75rem;
  }
}

/* RTL responsive adjustments */
[dir='rtl'] .flex-row {
  flex-direction: row-reverse;
}

[dir='rtl'] .flex-col {
  flex-direction: column;
}

[dir='rtl'] .justify-between {
  justify-content: space-between;
}

[dir='rtl'] .items-center {
  align-items: center;
}

[dir='rtl'] .gap-1 > * + * {
  margin-right: 0;
  margin-left: 0.25rem;
}

[dir='rtl'] .gap-2 > * + * {
  margin-right: 0;
  margin-left: 0.5rem;
}

[dir='rtl'] .gap-3 > * + * {
  margin-right: 0;
  margin-left: 0.75rem;
}

[dir='rtl'] .gap-4 > * + * {
  margin-right: 0;
  margin-left: 1rem;
}

/* Touch-friendly adjustments for mobile */
@media (hover: none) and (pointer: coarse) {
  button {
    min-height: 44px;
    min-width: 44px;
  }

  input[type='number'] {
    min-height: 44px;
  }

  select {
    min-height: 44px;
  }
}
</style>
