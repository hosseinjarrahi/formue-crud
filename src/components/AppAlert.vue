<script setup>
import { emitter } from '@/helpers/emitter'

emitter.listen('alert', ({ text, color }) => {
  alert(text)
})
</script>
