<template>
    <home-banner></home-banner>
    <home-sub-banner></home-sub-banner>
    <home-category></home-category>
    <home-contact></home-contact>
    <home-news></home-news>
</template>

<script>
import homeBanner from '../components/home/homeBanner.vue'
import homeSubBanner from '../components/home/homeSubBanner.vue'
import homeCategory from '../components/home/homeCategory.vue'
import homeContact from '../components/home/homeContact.vue'
import homeNews from '../components/home/homeNews.vue'

export default {
    name: 'Home',
    components: {
        homeBanner,
        homeSubBanner,
        homeCategory,
        homeContact,
        homeNews,
    },
}
</script>
