<template>
    <slide-header></slide-header>
    <main-header></main-header>
</template>

<script>
import slideHeader from './components/common/slideHeader.vue'
import mainHeader from './components/common/mainHeader.vue'

export default {
    name: 'App',
    components: {
        slideHeader,
        mainHeader,
    },
}
</script>

<style>
#app {
    display: flex;
    flex-direction: column;
    font-family: 'Helvetica';
}
</style>
