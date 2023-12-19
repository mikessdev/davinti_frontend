<script setup lang="ts">
import Header from '@/components/Header.vue'
import BaseInput from '@/components/BaseInput.vue'
import Button from '@/components/Button.vue'
import { useContactStore } from '@/stores/contactStore'
import { reactive, ref } from 'vue'
import type { Contact } from '@/interfaces/contact'
import type { Phone } from '@/interfaces/phone'
import { validateEmptyText } from '@/validations/emptyText'

const contactStore = useContactStore()

const headerLinks = ref([
  { id: 1, name: 'Pesquisar', to: '/search' },
  { id: 2, name: 'Lista de Contatos', to: '/' }
])

const contactForm = reactive({
  name: {
    value: '',
    error: '',
    validator: () => {
      contactForm.name.error = validateEmptyText(contactForm.name.value)
    }
  },
  age: {
    value: '',
    error: '',
    validator: () => {
      contactForm.age.error = validateEmptyText(contactForm.age.value)
    }
  },
  phone01: {
    value: ''
  },
  phone02: {
    value: ''
  }
})

const createContact = async (e: Event) => {
  e.preventDefault()

  const contact: Contact = {
    name: contactForm.name.value,
    age: Number(contactForm.age.value)
  }

  await contactStore.createContact(contact)

  const { id } = contactStore.contactCreated

  if (contactForm.phone01.value && id) {
    const phone01: Phone = {
      contactId: id,
      number: contactForm.phone01.value
    }
    await contactStore.createPhone(phone01)
  }

  if (contactForm.phone02.value && id) {
    const phone02: Phone = {
      contactId: id,
      number: contactForm.phone02.value
    }
    await contactStore.createPhone(phone02)
  }

  alert('Contato cadastrado com sucesso!')
  clearFileds()
}

const clearFileds = () => {
  contactForm.age.value = ''
  contactForm.name.value = ''
  contactForm.phone01.value = ''
  contactForm.phone02.value = ''
}

const buttonIsDisabled = () => {
  const name = !!validateEmptyText(contactForm.name.value)
  const age = !!validateEmptyText(contactForm.age.value)

  const nameHasError = !!contactForm.name.error
  const ageHasError = !!contactForm.age.error

  const withoutEmptyField = name || age
  const withoutFieldError = nameHasError || ageHasError

  return withoutEmptyField || withoutFieldError
}
</script>

<template>
  <Header :links="headerLinks"></Header>
  <main>
    <form>
      <h1>Cadastre um contato</h1>
      <br />
      <BaseInput
        label="Nome"
        :max-length="100"
        v-model="contactForm.name.value"
        @validate="contactForm.name.validator"
        :error-message="contactForm.name.error"
      />
      <br />
      <BaseInput
        label="Idade"
        :max-length="3"
        v-model="contactForm.age.value"
        @validate="contactForm.age.validator"
        :error-message="contactForm.age.error"
        type="number"
      />
      <br />
      <BaseInput
        label="Telefone 01"
        :max-length="16"
        type="number"
        v-model="contactForm.phone01.value"
      />
      <br />
      <BaseInput
        label="Telefone 02"
        :max-length="16"
        type="number"
        v-model="contactForm.phone02.value"
      />
      <br />
      <Button
        @click="(e) => createContact(e)"
        label="Cadastrar Contato"
        :is-disabled="buttonIsDisabled()"
      />
    </form>
  </main>
</template>

<style>
main {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  display: flex;
  flex-direction: column;
  width: 400px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
  margin-top: 60px;
}
form h1 {
  text-align: center;
}
</style>
