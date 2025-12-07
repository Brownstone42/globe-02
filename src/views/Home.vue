<template>
    <home-banner></home-banner>
    <home-sub-banner></home-sub-banner>
    <home-category></home-category>
    <home-contact></home-contact>
    <home-news></home-news>
</template>

<script>
import HomeBanner from '../components/home/homeBanner.vue'
import HomeSubBanner from '../components/home/homeSubBanner.vue'
import HomeCategory from '../components/home/homeCategory.vue'
import HomeContact from '../components/home/homeContact.vue'
import HomeNews from '../components/home/homeNews.vue'

export default {
    name: 'Home',
    components: {
        HomeBanner,
        HomeSubBanner,
        HomeCategory,
        HomeContact,
        HomeNews,
    },
}
</script>
