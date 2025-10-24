<template>
    <app-slide-header></app-slide-header>
    <app-main-header></app-main-header>

    <home-banner></home-banner>
    <home-sub-banner></home-sub-banner>
    <home-category></home-category>
</template>

<script>
import appSlideHeader from './components/common/appSlideHeader.vue'
import appMainHeader from './components/common/appMainHeader.vue'

import homeBanner from './components/home/homeBanner.vue'
import homeSubBanner from './components/home/homeSubBanner.vue'
import homeCategory from './components/home/homeCategory.vue'

export default {
    name: 'App',
    components: {
        appSlideHeader,
        appMainHeader,
        homeBanner,
        homeSubBanner,
        homeCategory,
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
