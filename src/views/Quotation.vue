<template>
    <main class="quotation-page">
        <section v-if="submitted" class="quotation-success">
            <div class="success-mark">✓</div>
            <h1>เราได้รับข้อมูลของคุณแล้ว</h1>
            <p>เจ้าหน้าที่จะติดต่อกลับภายใน 24–48 ชั่วโมง เพื่อเสนอราคาพิเศษสำหรับหน่วยงานของคุณ</p>
            <div class="reference-box">
                <span>เลขที่อ้างอิงคำขอ</span>
                <strong>{{ referenceNumber }}</strong>
            </div>
            <p class="success-note">ⓘ คุณสามารถตรวจสอบสถานะคำขอได้ที่ Line โดยแจ้งเลขที่อ้างอิง</p>
            <RouterLink to="/product" class="back-products">กลับไปหน้าสินค้า</RouterLink>
        </section>

        <div v-else class="quotation-shell">
            <header class="quotation-heading">
                <h1>ขอใบเสนอราคา <small>(Request a Quote)</small></h1>
                <p>กรอกข้อมูลความต้องการ เพื่อให้ทีมงาน Ideal Globe ติดต่อกลับ<br />พร้อมใบเสนอราคาและคำแนะนำที่เหมาะสมโดยเร็วที่สุด</p>
            </header>

            <form class="quotation-layout" @submit.prevent="submitQuotation">
                <div class="quotation-main">
                    <section class="product-table">
                        <div class="table-head">
                            <span>รายการสินค้า</span><span>จำนวน</span><span>หน่วย</span><span></span>
                        </div>
                        <div v-if="productStore.loading" class="empty-products">กำลังโหลดสินค้า...</div>
                        <div v-else-if="!selectedItems.length" class="empty-products">ยังไม่ได้เลือกสินค้า</div>
                        <div v-for="item in selectedItems" :key="item.productId" class="product-row">
                            <div class="selected-product">
                                <img v-if="item.product.mainImageUrl" :src="item.product.mainImageUrl" :alt="item.product.name" />
                                <div v-else class="product-placeholder"></div>
                                <div><strong>{{ item.product.name }}</strong><small class="product-sku">SKU: {{ item.product.sku || '-' }}</small><small>{{ item.product.shortDescription || 'รายละเอียดสินค้า' }}</small></div>
                            </div>
                            <input v-model.number="item.quantity" type="number" min="1" required aria-label="จำนวนสินค้า" />
                            <select v-model="item.unit" aria-label="หน่วยสินค้า"><option>ชิ้น</option><option>กล่อง</option><option>แพ็ค</option><option>ลัง</option><option>ชุด</option></select>
                            <button type="button" class="remove-item" aria-label="ลบสินค้า" @click="removeProduct(item.productId)">
                                <i class="fa-regular fa-trash-can" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="add-product-row">
                            <button type="button" class="add-product-btn" @click="showProductPicker = !showProductPicker">＋ เพิ่มสินค้า</button>
                            <span>คุณสามารถเพิ่มสินค้าหลายรายการเพื่อขอใบเสนอราคาในครั้งเดียว</span>
                        </div>
                        <div v-if="showProductPicker" class="product-picker product-card-picker">
                            <button
                                v-for="product in availableProducts"
                                :key="product.id"
                                type="button"
                                class="product-pick-card"
                                @click="addProduct(product.id)"
                            >
                                <img v-if="product.mainImageUrl" :src="product.mainImageUrl" :alt="product.name" />
                                <span v-else class="picker-image-placeholder"><i class="fa-regular fa-image"></i></span>
                                <span class="picker-product-info">
                                    <strong>{{ product.name }}</strong>
                                    <small>SKU: {{ product.sku || '-' }}</small>
                                </span>
                                <i class="fa-solid fa-plus picker-add-icon" aria-hidden="true"></i>
                            </button>
                            <p v-if="!availableProducts.length" class="no-products-to-add">เพิ่มสินค้าทุกรายการแล้ว</p>
                        </div>
                    </section>

                    <section class="contact-fields">
                        <label><span>ชื่อ – นามสกุล <b>*</b></span><input v-model.trim="form.name" required placeholder="กรุณากรอกชื่อ นามสกุล" /></label>
                        <label><span>เบอร์ติดต่อ <b>*</b></span><input v-model.trim="form.phone" type="tel" required placeholder="02-123-4567" /></label>
                        <label><span>บริษัท / หน่วยงาน <b>*</b></span><input v-model.trim="form.company" required placeholder="กรุณากรอกชื่อบริษัท / หน่วยงาน" /></label>
                        <label><span>อีเมลติดต่อ <b>*</b></span><input v-model.trim="form.email" type="email" required placeholder="Your Email @Company.com" /></label>
                        <label><span>Line ID</span><input v-model.trim="form.lineId" placeholder="Your Line id" /></label>
                        <label class="message-field"><span>หมายเหตุเพิ่มเติม</span><textarea v-model.trim="form.message" rows="4" placeholder="ระบุรายละเอียดความต้องการเพิ่มเติม เช่น การใช้งาน สเปคที่ต้องการ ระยะเวลาที่ต้องการ หน่วยงานหรือสาขา"></textarea></label>
                    </section>

                    <p v-if="submitError" class="submit-error">{{ submitError }}</p>
                    <button class="submit-quote" type="submit" :disabled="submitting"><span>➤</span>{{ submitting ? 'กำลังส่งข้อมูล...' : 'ขอใบเสนอราคา' }}</button>
                    <p class="response-note">ระยะเวลาตอบกลับ 1–2 วันทำการ หรือสอบถามเบื้องต้น LineOA @idealglobe (มี@)</p>
                </div>

                <aside class="quotation-aside">
                    <section class="help-card">
                        <h2>ต้องการความช่วยเหลือ?</h2>
                        <p>ทีมงานพร้อมให้คำแนะนำและช่วยคุณเลือกสินค้าที่เหมาะสมที่สุด</p>
                        <a href="tel:028601525"><i class="fa-solid fa-phone"></i><span><b>โทรศัพท์</b>02-860-1525</span></a>
                        <a href="https://line.me/R/ti/p/%40idealglobe" target="_blank" rel="noopener"><i class="fa-brands fa-line"></i><span><b>Line OA</b>@idealglobe (มี@)</span></a>
                        <a href="mailto:sales@idealglobe.com"><i class="fa-regular fa-envelope"></i><span><b>อีเมล</b>sales@idealglobe.com</span></a>
                        <div class="help-item"><i class="fa-regular fa-clock"></i><span><b>เวลาทำการ</b>จันทร์ – ศุกร์ 08:00 – 17:00 น.</span></div>
                    </section>
                    <section class="trust-card">
                        <h2><i class="fa-solid fa-shield-halved" aria-hidden="true"></i>มั่นใจในคุณภาพ</h2>
                        <p><i class="fa-regular fa-circle-check" aria-hidden="true"></i>สินค้าคุณภาพมาตรฐานสากล</p>
                        <p><i class="fa-regular fa-circle-check" aria-hidden="true"></i>ให้คำปรึกษาโดยทีมงานมืออาชีพ</p>
                        <p><i class="fa-regular fa-circle-check" aria-hidden="true"></i>จัดส่งทั่วประเทศ</p>
                        <p><i class="fa-regular fa-circle-check" aria-hidden="true"></i>บริการหลังการขายโดยผู้เชี่ยวชาญ</p>
                    </section>
                    <section class="why-card">
                        <h2>ทำไมต้อง Ideal Globe?</h2>
                        <p><i class="fa-solid fa-award" aria-hidden="true"></i><span><b>ประสบการณ์มากกว่า 30 ปี</b><small>ในอุตสาหกรรมคลีนรูมและ ESD</small></span></p>
                        <p><i class="fa-solid fa-boxes-stacked" aria-hidden="true"></i><span><b>สินค้าครบครัน</b><small>ตอบโจทย์ทุกความต้องการ</small></span></p>
                        <p><i class="fa-solid fa-user-tie" aria-hidden="true"></i><span><b>บริการอย่างมืออาชีพ</b><small>ให้คำแนะนำโดยผู้เชี่ยวชาญ</small></span></p>
                        <p><i class="fa-solid fa-truck-fast" aria-hidden="true"></i><span><b>จัดส่งรวดเร็วทั่วประเทศ</b><small>มั่นใจว่าสินค้าถึงมืออย่างปลอดภัย</small></span></p>
                    </section>
                </aside>
            </form>
        </div>
    </main>
</template>

<script>
import { mapStores } from 'pinia'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { useProductStore } from '@/stores/productStore'

export default {
    name: 'Quotation',
    data() {
        return {
            selectedItems: [], showProductPicker: false,
            form: { name: '', phone: '', company: '', email: '', lineId: '', message: '' },
            submitting: false, submitted: false, submitError: '', referenceNumber: '',
        }
    },
    computed: {
        ...mapStores(useProductStore),
        availableProducts() {
            const selected = new Set(this.selectedItems.map((item) => item.productId))
            return this.productStore.products.filter((product) => !selected.has(product.id))
        },
    },
    async created() {
        if (!this.productStore.products.length) await this.productStore.fetchProducts()
        const productId = String(this.$route.query.productId || '')
        if (productId) this.addProduct(productId)
    },
    methods: {
        addProduct(productId) {
            if (!productId || this.selectedItems.some((item) => item.productId === productId)) return
            const product = this.productStore.products.find((item) => item.id === productId)
            if (product) {
                this.selectedItems.push({ productId, product, quantity: 1, unit: 'ชิ้น' })
                this.showProductPicker = false
            }
        },
        removeProduct(productId) { this.selectedItems = this.selectedItems.filter((item) => item.productId !== productId) },
        async submitQuotation() {
            if (!this.selectedItems.length) { this.submitError = 'กรุณาเลือกสินค้าอย่างน้อย 1 รายการ'; return }
            this.submitting = true; this.submitError = ''
            this.referenceNumber = `RFQ-${String(Date.now()).slice(-7)}`
            try {
                await addDoc(collection(db, 'quotationRequests'), {
                    referenceNumber: this.referenceNumber,
                    customer: { ...this.form },
                    products: this.selectedItems.map(({ productId, product, quantity, unit }) => ({ productId, name: product.name || '', sku: product.sku || '', quantity, unit })),
                    status: 'new', createdAt: serverTimestamp(),
                })
                this.submitted = true; window.scrollTo({ top: 0, behavior: 'smooth' })
            } catch (error) {
                console.error('quotation submit error:', error)
                this.submitError = 'ไม่สามารถส่งคำขอได้ในขณะนี้ กรุณาลองใหม่อีกครั้งหรือติดต่อผ่าน Line'
            } finally { this.submitting = false }
        },
    },
}
</script>

<style scoped>
.quotation-aside .trust-card {
    background: #02b54f !important;
    border-color: #02b54f;
}

.quotation-aside .trust-card h2,
.quotation-aside .trust-card h2 i,
.quotation-aside .trust-card p,
.quotation-aside .trust-card p i {
    color: #d6efc7 !important;
}

.quotation-aside h2 {
    font-size: 1.05rem !important;
}

.quotation-aside p {
    font-size: 0.78rem !important;
}

.quotation-aside .help-card span {
    font-size: 0.76rem;
}

.product-picker.product-card-picker {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    max-height: 340px;
    overflow-y: auto;
    padding: 4px 14px 16px;
}

.product-picker .product-pick-card {
    align-items: center;
    background: #fff !important;
    border: 1px solid #e0e2e5;
    border-radius: 8px;
    color: #30343a;
    display: grid;
    gap: 8px;
    grid-template-columns: 48px minmax(0, 1fr) 22px;
    min-width: 0;
    padding: 8px;
    text-align: left;
    white-space: normal;
}

.product-pick-card:hover {
    border-color: #a38c67;
    box-shadow: 0 3px 10px rgba(35, 39, 45, 0.1);
}

.product-pick-card > img,
.picker-image-placeholder {
    align-items: center;
    background: #f5f6f7;
    border-radius: 5px;
    display: flex;
    height: 48px;
    justify-content: center;
    object-fit: contain;
    width: 48px;
}

.picker-product-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.picker-product-info strong {
    display: -webkit-box;
    font-size: 0.72rem;
    line-height: 1.25;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.picker-product-info small {
    color: #737983;
    font-size: 0.62rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.picker-add-icon { color: #a38c67; }
.no-products-to-add { color: #737983; grid-column: 1 / -1; margin: 12px; text-align: center; }

@media (max-width: 700px) {
    .product-picker.product-card-picker {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .product-picker .product-pick-card {
        grid-template-columns: 42px minmax(0, 1fr) 18px;
        padding: 7px;
    }

    .product-pick-card > img,
    .picker-image-placeholder {
        height: 42px;
        width: 42px;
    }
}

.product-picker button,
.submit-quote {
    background: #a38c67 !important;
}
.why-card p {
    align-items: flex-start;
    display: flex;
    gap: 10px;
    margin: 14px 0;
}

.why-card p > i {
    color: #496b9b;
    flex: 0 0 22px;
    font-size: 1.05rem;
    margin-top: 2px;
    text-align: center;
}

.why-card p > span {
    display: flex;
    flex-direction: column;
}

.why-card p b {
    color: #23272d !important;
    font-size: 0.86rem;
    line-height: 1.35;
}

.why-card p small {
    color: inherit;
    font-size: 0.75rem;
    line-height: 1.4;
}

.quotation-aside .why-card h2 {
    color: #405779;
    font-weight: 700;
}

.trust-card p {
    align-items: center;
    color: #405779 !important;
    display: flex;
    gap: 6px;
}

.trust-card p i {
    color: #4aa36f;
    flex: 0 0 auto;
}

.quotation-aside .trust-card h2 {
    align-items: center;
    color: #405779 !important;
    display: flex;
    font-weight: 700;
    gap: 8px;
}

.trust-card h2 i {
    color: #496b9b;
    font-size: 1rem;
}

.help-card h2 {
    color: #405779 !important;
    font-weight: 700;
}

.help-card i {
    color: #496b9b !important;
}

.help-card .fa-line {
    color: #36b84a !important;
}

.response-note {
    margin-top: 14px;
}

.quotation-heading h1 {
    font-size: 2.5rem !important;
}

.quotation-heading h1 small {
    font-size: 1.15rem !important;
    font-weight: 600 !important;
}

.quotation-heading p {
    font-size: 1.18rem !important;
    font-weight: 600;
}

@media (max-width: 800px) {
    .quotation-heading h1 {
        font-size: 2rem !important;
    }

    .quotation-heading h1 small {
        font-size: 1rem !important;
    }

    .quotation-heading p {
        font-size: 1.05rem !important;
    }
}

.selected-product .product-sku {
    align-self: flex-start;
    background: #ead9c7;
    border-radius: 3px;
    color: #a0805b;
    line-height: 1.25;
    margin: 2px 0;
    padding: 2px 6px;
}
.product-picker button {
    flex: 0 0 auto;
    min-width: 105px;
    white-space: nowrap;
}
.quotation-page{background:#f4f4f4;color:#30343a;min-height:70vh;padding:54px 0 70px}.quotation-shell{margin:auto;width:min(1180px,91vw)}.quotation-heading{margin:0 0 42px 24px}.quotation-heading h1{color:#a0805b;font-size:2.1rem;margin:0 0 4px}.quotation-heading h1 small{font-size:.9rem;font-weight:500}.quotation-heading p{font-size:1.05rem;line-height:1.55;margin:0}.quotation-layout{align-items:start;display:grid;gap:34px;grid-template-columns:minmax(0,1fr) 260px}.product-table{background:#fff;border-radius:9px;box-shadow:0 5px 18px rgba(30,35,40,.05);overflow:hidden}.table-head,.product-row{align-items:center;display:grid;gap:12px;grid-template-columns:minmax(0,1fr) 65px 80px 34px}.table-head{background:#a0805b;color:#fff;font-size:.8rem;padding:9px 14px;text-align:center}.table-head span:first-child{text-align:center}.product-row{border-bottom:1px solid #e4e0db;padding:13px 14px}.selected-product{align-items:center;display:flex;gap:13px;min-width:0}.selected-product img,.product-placeholder{height:58px;object-fit:contain;width:68px}.product-placeholder{background:#f2f2f2}.selected-product div{display:flex;flex-direction:column;min-width:0}.selected-product strong{font-size:.78rem}.selected-product small{color:#828282;font-size:.66rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.product-row input,.product-row select,.product-picker select{border:1px solid #cfd2d4;border-radius:5px;box-sizing:border-box;font:inherit;min-width:0;padding:7px;width:100%}.remove-item{align-items:center;background:none;border:0;color:#8a8a8a;cursor:pointer;display:flex;font-size:.95rem;height:32px;justify-content:center;padding:0;width:34px}.remove-item:hover{color:#a0805b}.add-product-row{align-items:center;display:flex;gap:15px;padding:10px 14px}.add-product-row span{color:#8b8b8b;font-size:.67rem}.add-product-btn{background:#fff;border:1px solid #a0805b;border-radius:5px;color:#a0805b;cursor:pointer;font:inherit;padding:6px 12px}.product-picker{display:flex;gap:9px;padding:0 14px 14px}.product-picker button{background:#a0805b;border:0;border-radius:5px;color:#fff;cursor:pointer;padding:0 16px}.product-picker button:disabled{opacity:.5}.empty-products{color:#888;padding:22px;text-align:center}.contact-fields{display:grid;gap:19px 24px;grid-template-columns:repeat(2,minmax(0,1fr));margin:34px 6px}.contact-fields label{display:flex;flex-direction:column;gap:6px}.contact-fields span{font-size:.86rem}.contact-fields b{color:#a0805b}.contact-fields input,.contact-fields textarea{background:#fff;border:1px solid transparent;border-radius:6px;font:inherit;padding:13px 15px}.contact-fields input:focus,.contact-fields textarea:focus{border-color:#a0805b;outline:none}.message-field{grid-column:1/-1}.submit-quote{align-items:center;background:#a0805b;border:0;border-radius:9px;color:#fff;cursor:pointer;display:flex;font:inherit;font-size:1.05rem;font-weight:700;gap:10px;justify-content:center;margin-top:8px;padding:14px;width:100%}.submit-quote:disabled{opacity:.65}.response-note{color:#a0805b;font-size:.75rem;text-align:center}.submit-error{color:#b42318;text-align:center}.quotation-aside{display:grid;gap:14px}.quotation-aside section{background:#fff;border-radius:5px;padding:18px}.quotation-aside h2{color:#4d6380;font-size:.92rem;margin:0 0 10px}.quotation-aside p{font-size:.7rem;line-height:1.5}.help-card>a,.help-item{align-items:center;color:#333;display:flex;gap:10px;margin-top:12px;text-decoration:none}.help-card i{color:#4d6380;font-size:1.15rem;width:22px}.help-card span{display:flex;flex-direction:column;font-size:.68rem}.trust-card{background:#fff8e8!important;border:1px solid #ead9c7}.trust-card h2{color:#a0805b!important}.trust-card p{color:#52725f}.why-card b{color:#4d6380}.quotation-success{margin:40px auto;max-width:560px;padding:35px;text-align:center}.success-mark{align-items:center;background:#a0805b;clip-path:polygon(50% 0,61% 10%,75% 7%,81% 20%,95% 25%,91% 40%,100% 50%,91% 61%,95% 76%,81% 81%,75% 94%,61% 90%,50% 100%,39% 90%,25% 94%,19% 81%,5% 76%,9% 61%,0 50%,9% 40%,5% 25%,19% 20%,25% 7%,39% 10%);color:#fff;display:flex;font-size:2.6rem;height:115px;justify-content:center;margin:0 auto 55px;width:115px}.quotation-success h1{font-size:1.3rem}.quotation-success>p{line-height:1.5}.reference-box{background:#e8ded3;border:1px solid #a0805b;border-radius:14px;display:flex;flex-direction:column;margin:28px auto;padding:15px}.reference-box strong{font-size:2rem;font-weight:500}.success-note{color:#9a8068}.back-products{color:#a0805b}.quote-btn{text-decoration:none}
@media(max-width:800px){.quotation-page{padding-top:34px}.quotation-heading{margin-left:0}.quotation-heading h1{font-size:1.75rem}.quotation-layout{grid-template-columns:1fr}.quotation-aside{grid-template-columns:1fr}.contact-fields{grid-template-columns:1fr}.message-field{grid-column:auto}}@media(max-width:520px){.quotation-shell{width:92vw}.table-head{display:none}.product-row{grid-template-columns:1fr 70px 85px 28px;gap:7px}.selected-product{grid-column:1/-1}.selected-product img,.product-placeholder{height:70px;width:78px}.add-product-row{align-items:flex-start;flex-direction:column}.product-picker{flex-direction:column}.product-picker button{padding:9px}.contact-fields{margin-left:0;margin-right:0}.quotation-success{padding:18px}.reference-box strong{font-size:1.65rem}}
</style>
