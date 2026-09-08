<template>
    <app-slide-header></app-slide-header>
    <app-main-header></app-main-header>

    <router-view></router-view>

    <home-footer></home-footer>
</template>

<script>
import appSlideHeader from './components/common/appSlideHeader.vue'
import appMainHeader from './components/common/appMainHeader.vue'
import homeFooter from './components/home/homeFooter.vue'

export default {
    name: 'App',
    components: {
        appSlideHeader,
        appMainHeader,
        homeFooter,
    },
}
</script>

<style>
#app {
    display: flex;
    flex-direction: column;
    font-family: 'Sukhumvit-Text', 'Helvetica';
    background-color: #f8f8f8;
}
@font-face {
    font-family: 'Sukhumvit-Text';
    src: url('./fonts/SukhumvitSet-Text.ttf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
@font-face {
    font-family: 'Sukhumvit-Thin';
    src: url('./fonts/SukhumvitSet-Thin.ttf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
</style>
