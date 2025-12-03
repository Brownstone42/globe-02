import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [
            // ---- glove: ถุงมือใช้แล้วทิ้ง ----
            {
                id: 'latex-powder-free',
                category: 'glove',
                group: 'disposable',
                name: 'Disposable Gloves',
                shortDescription: 'ถุงมือใช้แล้วทิ้ง',
                image: '/images/products/glove-01.png',
                images: [
                    '/images/products/glove-01.png',
                    '/images/products/glove-01-side.png',
                    '/images/products/glove-01-box.png',
                ],
                brief: [
                    'ถุงมือยางไนไตร คุณภาพสูง สำหรับห้องคลีนรูม',
                    'ปราศจากแป้ง เหมาะสำหรับงานที่ต้องการความสะอาด',
                ],
                brand: 'IDEAL / TBG',
                packing: '100 pcs / Dispenser Box',
            },
            {
                id: 'vinyl-disposable',
                category: 'glove',
                group: 'disposable',
                name: 'Vinyl Disposable Gloves',
                shortDescription: 'ถุงมือไวนิล ใช้แล้วทิ้ง',
                image: '/images/products/glove-vinyl.png',
                images: ['/images/products/glove-vinyl.png'],
                brief: ['ถุงมือไวนิล สำหรับงานทั่วไปในห้องคลีนรูม'],
                brand: 'IDEAL',
                packing: '100 pcs / Dispenser Box',
            },

            // ---- glove: ถุงมือเฉพาะทาง ----
            {
                id: 'black-esd',
                category: 'glove',
                group: 'special',
                name: 'Specialty Work',
                shortDescription: 'ถุงมือพิเศษงาน ESD',
                image: '/images/products/glove-black.png',
                images: [
                    '/images/products/glove-black.png',
                    '/images/products/glove-black-close.png',
                ],
                brief: ['ถุงมือสำหรับงานป้องกันไฟฟ้าสถิต', 'เหมาะสำหรับงานอิเล็กทรอนิกส์'],
                brand: 'IDEAL',
                packing: '1 pair / pack',
            },
            {
                id: 'cut-resistant',
                category: 'glove',
                group: 'special',
                name: 'Cut Resistant Gloves',
                shortDescription: 'ถุงมือกันบาด',
                image: '/images/products/glove-cut.png',
                images: ['/images/products/glove-cut.png'],
                brief: ['ถุงมือกันบาด สำหรับงานประกอบชิ้นส่วนที่มีคม'],
                brand: 'IDEAL',
                packing: '1 pair / pack',
            },

            // ---- หมวดอื่น (ตัวอย่าง) ----
            {
                id: 'coverall-white',
                category: 'coverall',
                name: 'Coverall Protection',
                shortDescription: 'ชุดป้องกันฝุ่นและสารเคมี',
                image: '/images/products/coverall-white.png',
                images: ['/images/products/coverall-white.png'],
                brief: ['ชุดคลุมป้องกันแบบทั้งตัว สำหรับงานคลีนรูม'],
                brand: 'IDEAL',
                packing: '1 pc / pack',
            },
            {
                id: 'footwear-white',
                category: 'shoe',
                name: 'Footwear Protection',
                shortDescription: 'อุปกรณ์ป้องกันเท้า',
                image: '/images/products/shoe-white.png',
                images: ['/images/products/shoe-white.png'],
                brief: ['รองเท้าสำหรับใช้ในห้องคลีนรูม'],
                brand: 'IDEAL',
                packing: '1 pair / box',
            },
        ],
        categoryMap: {
            all: 'สินค้าทั้งหมด',
            glove: 'ถุงมือ',
            coverall: 'ชุดคลุมป้องกัน',
            mask: 'หน้ากากอนามัย',
            esd: 'ผลิตภัณฑ์ ESD',
            shoe: 'รองเท้า',
        },
    }),

    getters: {
        allProducts: (state) => state.products,

        productsByCategory: (state) => (category) => {
            if (category === 'all') return state.products
            return state.products.filter((p) => p.category === category)
        },

        productById: (state) => (id) => {
            return state.products.find((p) => p.id === id) || null
        },

        relatedProducts: (state) => (product) => {
            if (!product) return []
            return state.products
                .filter((p) => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
        },
    },
})
