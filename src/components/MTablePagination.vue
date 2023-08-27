<template>
  <div>
    <nav>
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: store.mainPagination.currentPage === 1 }">
          <a class="page-link" @click="goToFirstPage">First</a>
        </li>
        <li class="page-item" :class="{ disabled: store.mainPagination.currentPage === 1 }">
          <a class="page-link" @click="prevPage">Previous</a>
        </li>
        <li
          v-for="n in store.mainPagination.lastPage"
          :key="n"
          class="page-item"
          :class="{ active: store.mainPagination.currentPage === n }"
        >
          <a class="page-link" @click="goToPage(n)">{{ n }}</a>
        </li>
        {{
          store.mainPagination.lastPage
        }}
        <li
          class="page-item"
          :class="{ disabled: store.mainPagination.currentPage === store.mainPagination.lastPage }"
        >
          <a class="page-link" @click="nextPage">Next</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: store.mainPagination.currentPage === store.mainPagination.lastPage }"
        >
          <a class="page-link" @click="goToLastPage">Last</a>
        </li>
      </ul>
    </nav>
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

function goToLastPage() {
  paginate(store.mainPagination.lastPage)
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
