<template>
    <div class="category">
        <div class="columns is-8">
            <div class="column is-3">Column1</div>
            <div class="column is-3">Column2</div>
            <div class="column is-3">Column3</div>
            <div class="column is-3">Column4</div>
            <div class="column is-3">Column5</div>
            <div class="column is-3">Column6</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'homeCategory',
}
</script>

<style scoped>
.category {
    margin: auto;
    width: min(1100px, 92vw);
}
.columns {
    overflow: auto;
}
</style>
