<template>
    <app-slide-header></app-slide-header>
    <app-main-header></app-main-header>

    <home-banner></home-banner>
    <home-sub-banner></home-sub-banner>
    <home-category></home-category>
    <home-contact></home-contact>
    <home-news></home-news>

    <home-footer></home-footer>
</template>

<script>
import appSlideHeader from './components/common/appSlideHeader.vue'
import appMainHeader from './components/common/appMainHeader.vue'

import homeBanner from './components/home/homeBanner.vue'
import homeSubBanner from './components/home/homeSubBanner.vue'
import homeCategory from './components/home/homeCategory.vue'
import homeContact from './components/home/homeContact.vue'
import homeNews from './components/home/homeNews.vue'
import homeFooter from './components/home/homeFooter.vue'

export default {
    name: 'App',
    components: {
        appSlideHeader,
        appMainHeader,
        homeBanner,
        homeSubBanner,
        homeCategory,
        homeContact,
        homeNews,
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
