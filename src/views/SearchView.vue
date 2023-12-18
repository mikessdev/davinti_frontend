<script setup lang="ts">
import Header from '@/components/Header.vue'
import BaseInput from '@/components/BaseInput.vue'
import Button from '@/components/Button.vue'
import { reactive, ref } from 'vue'
import { useContactStore } from '@/stores/contactStore'
import type { Phone } from '@/interfaces/phone'

const headerLinks = ref([
  { id: 1, name: 'Cadastro', to: '/register' },
  { id: 2, name: 'Lista de Contatos', to: '/' }
])

const showIconsId = ref<number>()

interface contactWithPhones {
  id: number
  name: string
  age: number
  Phones: Phone[]
}

const contactStore = useContactStore()

const contactSearched = ref<contactWithPhones[]>([])

const searchForm = reactive({
  input: {
    value: ''
  }
})

const searchContact = async (e: Event) => {
  e.preventDefault()
  contactSearched.value = (await contactStore.getContactByName(
    searchForm.input.value
  )) as contactWithPhones[]
}

const selectCard = (cardId: number) => {
  showIconsId.value = cardId
}

const editCard = (e: Event) => {
  e.preventDefault()
}

const deleteCard = async (e: Event, id: number) => {
  e.preventDefault()
  await contactStore.deleteContact(id)
  await searchContact(e)

  alert('Contato deletado com sucesso!')
}
</script>

<template>
  <Header :links="headerLinks"></Header>
  <main>
    <h1>Pesquisar Contato</h1>
    <div class="search-bar">
      <BaseInput v-model="searchForm.input.value" />
      <Button :is-disabled="false" label="Pesquisar" @click="(e) => searchContact(e)" />
    </div>
    <ul>
      <li
        @click="selectCard(contact.id)"
        v-for="contact in contactSearched"
        :key="contact.id"
        class="card"
      >
        <div>
          <p>Nome: {{ contact.name }}</p>
          <p>Idade: {{ contact.age }}</p>
          <ul>
            <li v-for="phone in contact.Phones" :key="phone.id">
              <p>Telefone: {{ phone.number }}</p>
            </li>
          </ul>
        </div>
        <div class="actions-buttons" v-if="showIconsId === contact.id">
          <Button :is-disabled="false" label="Deletar" @click="(e) => deleteCard(e, contact.id)" />
          <Button :is-disabled="false" label="Editar" @click="(e) => editCard(e)" />
        </div>
      </li>
    </ul>
  </main>
</template>
<style scoped>
main {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

h1 {
  margin-top: 60px;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 40px;
}

.card {
  display: flex;
  flex-direction: column;
  box-shadow: rgba(84, 84, 85, 0.2) 0px 7px 29px 0px;
  background-color: #7c7b7a;
  padding: 10px;
  border-radius: 10px;
  color: white;
  margin-top: 20px;
  width: 300px;
  padding: 20px;
  gap: 20px;
}

.actions-buttons {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>
