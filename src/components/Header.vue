<script setup lang="ts">
export interface HeaderLinks {
  id: number
  name: string
  to: string
}

const props = defineProps({
  links: {
    type: Array<HeaderLinks>,
    default: []
  }
})
</script>

<template>
  <div class="container-header">
    <header>
      <h1>LOGO</h1>
      <nav>
        <ul>
          <li v-for="link in props.links" :key="link.id">
            <router-link :to="link.to">
              <a>{{ link.name }}</a>
            </router-link>
          </li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<style scoped>
.container-header {
  display: flex;
  width: 100%;
  height: 60px;
  background-color: #fa6400;
}

header {
  display: flex;
  max-width: 1200px;
  width: 100%;
  padding: 0px 10px;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
}

ul {
  display: flex;
}

nav li a {
  color: black;
  font-weight: bold;
  padding-left: 10px;
  font-size: 16px;
  letter-spacing: 1px;
}

nav li a:hover {
  color: white;
}
</style>
