import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Contact } from '@/interfaces/contact'
import type { Phone } from '@/interfaces/phone'

export const useContactStore = defineStore('contactManagement', () => {
  const contacts = ref<[]>([])
  const contactCreated = ref<Contact>({} as Contact)

  const findAll = async () => {
    const url = 'http://localhost:3000/contact'
    try {
      const response = await fetch(url)
      contacts.value = await response.json()
    } catch (error) {
      console.error(error)
    }
  }

  const getContactByName = async (name: string) => {
    const url = 'http://localhost:3000/contact'
    try {
      const response = await fetch(url + '?name=' + name)
      return response.json()
    } catch (error) {
      console.error(error)
    }
  }

  const getContactByPhoneNumber = async (number: number) => {
    const url = 'http://localhost:3000/contact'
    try {
      const response = await fetch(url + '?phoneNumber=' + number)
      return response.json()
    } catch (error) {
      console.error(error)
    }
  }

  const createContact = async (contact: Contact) => {
    const url = 'http://localhost:3000/contact'
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
      })

      contactCreated.value = await response.json()
    } catch (error) {
      console.error(error)
    }
  }

  const createPhone = async (phone: Phone) => {
    const url = 'http://localhost:3000/phone'
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(phone)
      })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteContact = async (id: number) => {
    const url = 'http://localhost:3000/contact/'
    try {
      await fetch(url + id, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error(error)
    }
  }

  const updateContact = async (contact: Contact) => {
    const url = 'http://localhost:3000/contact'
    try {
      await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
      })
    } catch (error) {
      console.error(error)
    }
  }

  const updatePhone = async (phone: Phone) => {
    const url = 'http://localhost:3000/phone'
    try {
      await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(phone)
      })
    } catch (error) {
      console.error(error)
    }
  }

  return {
    contacts,
    contactCreated,
    findAll,
    getContactByName,
    createContact,
    createPhone,
    deleteContact,
    updateContact,
    updatePhone,
    getContactByPhoneNumber
  }
})
