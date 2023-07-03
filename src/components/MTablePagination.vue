<script setup>
import { listen } from "formue";
import { usePagination } from "./../composables/usePagination";

const { paginate } = usePagination();

listen("pageChanged", (page) => {
  paginate(page);
});
</script>
