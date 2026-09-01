const SITE_URL = 'https://idealglobe.com'
const SITE_NAME = 'Ideal Globe'
const DEFAULT_IMAGE = `${SITE_URL}/icon-512.png`

function upsertMeta(selector, attributes) {
    let element = document.head.querySelector(selector)
    if (!element) {
        element = document.createElement('meta')
        document.head.appendChild(element)
    }
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

function upsertCanonical(href) {
    let element = document.head.querySelector('link[rel="canonical"]')
    if (!element) {
        element = document.createElement('link')
        element.setAttribute('rel', 'canonical')
        document.head.appendChild(element)
    }
    element.setAttribute('href', href)
}

function absoluteUrl(value, fallback) {
    if (!value) return fallback
    try {
        return new URL(value, SITE_URL).href
    } catch {
        return fallback
    }
}

export function setSeo({
    title,
    description,
    path,
    image,
    type = 'website',
    robots = 'index, follow',
}) {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
    const canonical = absoluteUrl(path || window.location.pathname, SITE_URL)
    const socialImage = absoluteUrl(image, DEFAULT_IMAGE)
    const cleanDescription = String(description || defaultSeo.description)
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 160)

    document.title = fullTitle
    upsertCanonical(canonical)
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
    upsertMeta('meta[name="googlebot"]', { name: 'googlebot', content: robots })
    upsertMeta('meta[name="description"]', { name: 'description', content: cleanDescription })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:description"]', {
        property: 'og:description',
        content: cleanDescription,
    })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: socialImage })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'th_TH' })
    upsertMeta('meta[name="twitter:card"]', {
        name: 'twitter:card',
        content: 'summary_large_image',
    })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle })
    upsertMeta('meta[name="twitter:description"]', {
        name: 'twitter:description',
        content: cleanDescription,
    })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: socialImage })
}

export const defaultSeo = {
    title: 'อุปกรณ์ Cleanroom, ESD และ Safety สำหรับโรงงาน | Ideal Globe',
    description:
        'จำหน่ายอุปกรณ์ Cleanroom, ESD, Safety และอุปกรณ์โรงงาน พร้อมคำปรึกษาจากทีมงานที่มีประสบการณ์กว่า 30 ปี',
    path: '/',
}

export function setStructuredData(id, data) {
    let element = document.head.querySelector(`script[data-structured-data="${id}"]`)
    if (!element) {
        element = document.createElement('script')
        element.type = 'application/ld+json'
        element.dataset.structuredData = id
        document.head.appendChild(element)
    }
    element.textContent = JSON.stringify(data)
}

export function clearStructuredData() {
    document.head
        .querySelectorAll('script[data-structured-data]')
        .forEach((element) => element.remove())
}

export const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Ideal Globe',
    legalName: 'บริษัท ไอเดียล โกลบ จำกัด',
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/images/footer-logo.png`,
    email: 'admin@idealglobe.com',
    telephone: '+66-2-860-1525',
    address: {
        '@type': 'PostalAddress',
        streetAddress: '46 ซอยประชาอุทิศ 27 แขวงบางมด',
        addressLocality: 'เขตทุ่งครุ',
        addressRegion: 'กรุงเทพมหานคร',
        postalCode: '10140',
        addressCountry: 'TH',
    },
    contactPoint: [
        {
            '@type': 'ContactPoint',
            telephone: '+66-2-860-1525',
            contactType: 'customer service',
            areaServed: 'TH',
            availableLanguage: ['th', 'en'],
        },
        {
            '@type': 'ContactPoint',
            telephone: '+66-91-010-8349',
            contactType: 'sales',
            areaServed: 'TH',
            availableLanguage: ['th', 'en'],
        },
    ],
}
