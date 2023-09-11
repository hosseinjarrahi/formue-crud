<template>
  <div>
    <div class="flex items-center justify-center py-2 lg:px-0 sm:px-6 px-4">
      <!--- more free and premium Tailwind CSS components at https://tailwinduikit.com/ --->

      <div class="lg:w-3/5 w-full flex items-center justify-between border-t border-gray-200">
        <div class="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer">
          <svg
            class="ltr:rotate-180"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.1665 4H12.8332"
              stroke="currentColor"
              stroke-width="1.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.5 7.33333L12.8333 4"
              stroke="currentColor"
              stroke-width="1.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.5 0.666687L12.8333 4.00002"
              stroke="currentColor"
              stroke-width="1.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p class="text-sm rtl:mr-3 ltr:ml-3 font-medium leading-none" @click="prevPage">
            {{ $fcTr('previous') }}
          </p>
        </div>
        <div v-if="n < 6" class="sm:flex hidden">
          <p
            v-for="n in store.mainPagination.lastPage"
            :key="n"
            :class="
              store.mainPagination.currentPage === n
                ? 'text-sm font-medium leading-none cursor-pointer text-indigo-700 border-t border-indigo-400 pt-3 mr-4 px-2'
                : 'text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2'
            "
            @click="goToPage(n)"
          >
            {{ n }}
          </p>
        </div>
        <div v-else class="sm:flex hidden">
          <template v-for="n in showNum()" :key="n">
            <p
              v-if="typeof n === 'number'"
              :class="
                store.mainPagination.currentPage === n
                  ? 'text-sm font-medium leading-none cursor-pointer text-indigo-700 border-t border-indigo-400 pt-3 mr-4 px-2'
                  : 'text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2'
              "
              @click="goToPage(n)"
            >
              {{ n }}
            </p>
            <p
              class="text-sm font-medium leading-none text-gray-600 border-t border-transparent pt-3 mr-4 px-2"
              v-else
            >
              {{ n }}
            </p>
          </template>
        </div>
        <div class="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer">
          <p class="text-sm font-medium leading-none rlt:ml-3 ltr:mr-3" @click="nextPage">
            {{ $fcTr('next') }}
          </p>

          <svg
            class="ltr:rotate-180"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.1665 4H12.8332"
              stroke="currentColor"
              stroke-width="1.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M1.1665 4L4.49984 7.33333"
              stroke="currentColor"
              stroke-width="1.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M1.1665 4.00002L4.49984 0.666687"
              stroke="currentColor"
              stroke-width="1.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
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

function goToFirstPage() {
  paginate(1)
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

function goToLastPage() {
  paginate()
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
