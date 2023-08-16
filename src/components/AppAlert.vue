<script setup>
import { emitter } from 'formue'

emitter.listen('alert', ({ text, color }) => {
  alert(text)
})
</script>
