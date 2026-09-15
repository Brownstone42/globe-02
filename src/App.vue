<template>
    <app-slide-header></app-slide-header>
    <app-main-header></app-main-header>

    <router-view></router-view>

    <home-footer v-if="!isAdminRoute"></home-footer>
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
    computed: {
        isAdminRoute() {
            return this.$route.path.startsWith('/admin')
        },
    },
    mounted() {
        document.addEventListener('contextmenu', this.preventContextMenu)
        document.addEventListener('dragstart', this.preventImageDrag)
    },
    beforeUnmount() {
        document.removeEventListener('contextmenu', this.preventContextMenu)
        document.removeEventListener('dragstart', this.preventImageDrag)
    },
    methods: {
        preventContextMenu(event) {
            event.preventDefault()
        },
        preventImageDrag(event) {
            if (event.target instanceof HTMLImageElement) event.preventDefault()
        },
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

html,
body,
#app {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
}

img {
    -webkit-touch-callout: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    user-select: none;
}

input,
textarea,
select,
[contenteditable='true'],
.ql-editor {
    -webkit-touch-callout: default;
    -webkit-user-select: text;
    user-select: text;
}

input::placeholder,
textarea::placeholder {
    color: #aeb5bc;
    opacity: 1;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
    color: #aeb5bc;
    opacity: 1;
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
