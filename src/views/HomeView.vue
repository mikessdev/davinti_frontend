<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useContactStore } from '@/stores/contactStore'

const contactStore = useContactStore()
const contacts = ref()

onMounted(async () => {
  await contactStore.findAll()
  contacts.value = contactStore.contacts
  console.table(contacts.value)
})
import { onMounted, ref } from 'vue'

const headerLinks = ref([
  { id: 1, name: 'Cadastro', to: '/register' },
  { id: 2, name: 'Pesquisar', to: '/search' }
])
</script>

<template>
  <Header :links="headerLinks"></Header>
  <div class="container-home">
    <div class="wrapper-home">
      <h1>Lista de Contatos</h1>
      <ul v-for="contact in contacts" :key="contact.id">
        <li>
          <span>Nome: {{ contact.name }}</span>
          <span>Idade: {{ contact.age }}</span>
        </li>
        <br />
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container-home {
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 20px;
}
.wrapper-home {
  margin: 0 auto;
}
h1 {
  text-align: center;
  margin-bottom: 20px;
}

li {
  display: flex;
  flex-direction: column;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  background-color: #7c7b7a;
  padding: 10px;
  border-radius: 10px;
  color: white;
}
</style>
