<template>
  <div id="paginate" v-if="store.mainPagination.lastPage">
    <div class="flex items-center justify-center py-2 lg:px-0 sm:px-6 px-4">
      <div class="lg:w-5/5 w-full flex items-center justify-between border-t border-gray-200">
        <div class="sm:flex hidden">
          <div
            @click="prevPage"
            class="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
          >
            <svg
              class="rtl:rotate-180 w-[10px] fill-muted-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                d="M15 239c-9.4 9.4-9.4 24.6 0 33.9L207 465c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L65.9 256 241 81c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L15 239z"
              />
            </svg>
          </div>
          <template v-for="n in showNum()" :key="n">
            <p
              v-if="typeof n === 'number'"
              :class="
                store.mainPagination.currentPage === n
                  ? 'text-sm font-medium leading-none cursor-pointer text-indigo-700  !border-indigo-400 border-t-[1px] pt-3 mr-4 px-2'
                  : 'text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t-[1px] border-transparent hover:border-indigo-400 pt-3 mr-4 px-2'
              "
              @click="goToPage(n)"
            >
              {{ n }}
            </p>
            <p
              class="text-sm font-medium leading-none text-gray-600 pt-3 px-2"
              :class="{ 'mr-4': showNum() > 1 }"
              v-else
            >
              {{ n }}
            </p>
          </template>
          <div
            @click="nextPage"
            class="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
          >
            <svg
              class="ltr:rotate-180 w-[10px] fill-muted-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                d="M15 239c-9.4 9.4-9.4 24.6 0 33.9L207 465c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L65.9 256 241 81c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L15 239z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const store = inject('store')

function paginate(page) {
  store.paginate(page)
}

function prevPage() {
  if (store.mainPagination.currentPage > 1) {
    paginate(store.mainPagination.currentPage - 1)
  }
}

function goToPage(pageNumber) {
  paginate(pageNumber)
}

function nextPage() {
  if (store.mainPagination.currentPage < store.mainPagination.lastPage) {
    paginate(store.mainPagination.currentPage + 1)
  }
}

function showNum() {
  let array = []

  if (store.mainPagination.lastPage > 10) {
    let currentPage = store.mainPagination.currentPage
    let currentPage1 = currentPage - 1
    let currentPage2 = currentPage + 1
    if (currentPage != 1) array.push(1)
    if (currentPage != 1 && currentPage != 2 && currentPage1 != 2) array.push('...')
    if (currentPage1 > 1) array.push(currentPage1)
    array.push(currentPage)
    if (currentPage2 < store.mainPagination.lastPage) array.push(currentPage2)
    if (
      currentPage != store.mainPagination.lastPage &&
      currentPage != store.mainPagination.lastPage - 1 &&
      currentPage2 != store.mainPagination.lastPage - 1
    )
      array.push('...')
    if (store.mainPagination.lastPage != currentPage) array.push(store.mainPagination.lastPage)
  } else array = store.mainPagination.lastPage
  return array
}
</script>

<style scoped>
.pagination {
  display: flex;
  list-style: none;
  padding: 0;
}

.page-item {
  margin: 0 5px;
  cursor: pointer;
}

.page-item.disabled a {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-item.active a {
  font-weight: bold;
}
</style>
