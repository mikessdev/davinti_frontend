<script setup lang="ts">
const props = defineProps({
  maxLength: {
    type: Number,
    default: 30
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  }
})

const emit = defineEmits(['update:modelValue', 'validate'])

const handleInput = (e: Event) => {
  emit('update:modelValue', e.target.value ?? '')
  emit('validate')
}
</script>

<template>
  <div id="container">
    <label>{{ props.label }}</label>
    <input
      :type="props.type"
      oninput="this.value=this.value.slice(0,this.maxLength)"
      :maxlength="props.maxLength"
      :value="props.modelValue"
      @input="(e) => handleInput(e)"
    />
    <label id="error-message" v-show="props.errorMessage">{{ props.errorMessage }}</label>
  </div>
</template>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
}

input {
  padding: 10px;
  border-width: 0px;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

#error-message {
  color: red;
}
</style>
