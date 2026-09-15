<template>
    <home-banner></home-banner>
    <home-category></home-category>
    <home-contact></home-contact>
    <home-standards></home-standards>
    <home-clients></home-clients>
    <home-news></home-news>
</template>

<script>
import HomeBanner from '../components/home/homeBanner.vue'
import HomeCategory from '../components/home/homeCategory.vue'
import HomeContact from '../components/home/homeContact.vue'
import HomeStandards from '../components/home/homeStandards.vue'
import HomeClients from '../components/home/homeClients.vue'
import HomeNews from '../components/home/homeNews.vue'

export default {
    name: 'Home',
    components: {
        HomeBanner,
        HomeCategory,
        HomeContact,
        HomeStandards,
        HomeClients,
        HomeNews,
    },
}
</script>
