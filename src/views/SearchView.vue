<script setup lang="ts">
import Header from '@/components/Header.vue'
import BaseInput from '@/components/BaseInput.vue'
import Button from '@/components/Button.vue'
import { reactive, ref } from 'vue'
import { useContactStore } from '@/stores/contactStore'
import type { Phone } from '@/interfaces/phone'
import { validateEmptyText } from '@/validations/emptyText'
import type { Contact } from '@/interfaces/contact'

const contactStore = useContactStore()

const showIconsId = ref<number>()
const toggleEditModal = ref<boolean>(false)
const contactSearched = ref<contactWithPhones[]>([])
const contactSelected = ref<contactWithPhones>({} as contactWithPhones)

const headerLinks = ref([
  { id: 1, name: 'Cadastro', to: '/register' },
  { id: 2, name: 'Lista de Contatos', to: '/' }
])

interface contactWithPhones {
  id: number
  name: string
  age: number
  Phones: Phone[]
}

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

const searchForm = reactive({
  input: {
    value: '',
    error: '',
    validator: () => {
      searchForm.input.error = validateEmptyText(searchForm.input.value)
    }
  }
})

const searchContact = async (e: Event) => {
  e.preventDefault()

  const isNumber = Number(searchForm.input.value)

  if (isNumber) {
    return (contactSearched.value = (await contactStore.getContactByPhoneNumber(
      Number(searchForm.input.value)
    )) as contactWithPhones[])
  }

  if (!isNumber) {
    return (contactSearched.value = (await contactStore.getContactByName(
      searchForm.input.value
    )) as contactWithPhones[])
  }
}

const selectCard = (cardId: number) => {
  showIconsId.value = cardId
}

const editCard = async (e: Event) => {
  e.preventDefault()

  const contact: Contact = {
    id: contactSelected.value.id,
    name: contactForm.name.value,
    age: Number(contactForm.age.value)
  }

  await contactStore.updateContact(contact)

  const { id: contactId } = contactSelected.value

  if (contactForm.phone01.value) {
    const phone01Exist = contactSelected.value.Phones[0]
    if (phone01Exist) {
      const { id } = contactSelected.value.Phones[0]
      const phone01: Phone = {
        id: id,
        contactId: contactId,
        number: contactForm.phone01.value
      }
      await contactStore.updatePhone(phone01)
    }

    if (!phone01Exist) {
      const phone01: Phone = {
        contactId: contactId,
        number: contactForm.phone01.value
      }
      await contactStore.createPhone(phone01)
    }
  }

  if (contactForm.phone02.value) {
    const phone02Exist = contactSelected.value.Phones[1]

    if (phone02Exist) {
      const { id } = contactSelected.value.Phones[1]
      const phone02: Phone = {
        id: id,
        contactId: contactId,
        number: contactForm.phone02.value
      }
      await contactStore.updatePhone(phone02)
    }

    if (!phone02Exist) {
      const phone02: Phone = {
        contactId: contactId,
        number: contactForm.phone02.value
      }
      await contactStore.createPhone(phone02)
    }
  }

  await searchContact(e)
  toggleEditModal.value = !toggleEditModal.value

  alert('Contato Atualizado com sucesso!')
}

const deleteCard = async (e: Event, id: number) => {
  e.preventDefault()
  await contactStore.deleteContact(id)
  await searchContact(e)

  alert('Contato deletado com sucesso!')
}

const buttonEditIsDisabled = () => {
  const name = !!validateEmptyText(contactForm.name.value)
  const age = !!validateEmptyText(contactForm.age.value)

  const nameHasError = !!contactForm.name.error
  const ageHasError = !!contactForm.age.error

  const withoutEmptyField = name || age
  const withoutFieldError = nameHasError || ageHasError

  return withoutEmptyField || withoutFieldError
}

const buttonSearchIsDisabled = () => {
  const input = !!validateEmptyText(searchForm.input.value)
  const inputHasError = !!searchForm.input.error

  return input || inputHasError
}

const openEditModal = (e: Event, contact: contactWithPhones) => {
  e.preventDefault()
  toggleEditModal.value = !toggleEditModal.value
  contactSelected.value = contact
  contactForm.name.value = contact.name
  contactForm.age.value = String(contact.age)

  if (contact.Phones[0]) {
    contactForm.phone01.value = contact.Phones[0].number || ''
  }

  if (contact.Phones[1]) {
    contactForm.phone02.value = contact.Phones[1].number || ''
  }
}
</script>

<template>
  <Header :links="headerLinks"></Header>
  <main>
    <h1>Pesquisar Contato</h1>
    <div class="search-bar">
      <BaseInput v-model="searchForm.input.value" />
      <Button
        :is-disabled="buttonSearchIsDisabled()"
        label="Pesquisar"
        @click="
          (e) => {
            if (!buttonSearchIsDisabled()) searchContact(e)
          }
        "
      />
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
            <li v-for="(phone, index) in contact.Phones" :key="phone.id">
              <p>Telefone {{ index + 1 }}: {{ phone.number }}</p>
            </li>
          </ul>
        </div>
        <div class="actions-buttons" v-if="showIconsId === contact.id">
          <Button :is-disabled="false" label="Deletar" @click="(e) => deleteCard(e, contact.id)" />
          <Button :is-disabled="false" label="Editar" @click="(e) => openEditModal(e, contact)" />
        </div>
      </li>
    </ul>

    <form class="editmodal" v-if="toggleEditModal">
      <h1>Edição de Contato</h1>
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
      <Button @click="(e) => editCard(e)" label="Salvar" :is-disabled="buttonEditIsDisabled()" />
      <Button
        @click="(e) => (toggleEditModal = !toggleEditModal)"
        label="Cancelar"
        :is-disabled="false"
      />
    </form>
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

.editmodal {
  position: absolute;

  z-index: 50;
  background-color: white;
  top: 60px;
}
</style>
