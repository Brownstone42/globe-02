<template>
    <div class="header">
        <div class="row">
            <img src="/images/logo.png" alt="Company Logo" class="header-logo" />

            <nav class="nav-menu">
                <a href="#" class="nav-item">หน้าแรก</a>
                <a href="#" class="nav-item">สินค้า</a>
                <a href="#" class="nav-item">เกี่ยวกับเรา</a>
                <a href="#" class="nav-item">ติดต่อ</a>
            </nav>
        </div>
    </div>
</template>

<script>
export default {
    name: 'mainHeader',
}
</script>

<style scoped>
.header {
    display: flex;
    height: 100px;
    background: linear-gradient(to top, #216e74, #2b8489, #3cabae);
    align-items: center;
    justify-content: center;
}
.header .row {
    display: flex;
    width: 90%;
    align-items: center;
}
.header-logo {
    max-height: 60px;
    width: auto;
}
.nav-menu {
    display: flex;
    gap: 30px;
    margin-left: 60px;
}
.nav-item {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
}
.nav-item:hover {
    opacity: 0.8;
}
</style>
