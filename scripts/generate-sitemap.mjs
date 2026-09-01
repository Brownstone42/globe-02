import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { firebaseConfig } from '../src/firebaseConfig.js'

const SITE_URL = 'https://idealglobe.com'
const outputPath = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url))

const staticPaths = ['/', '/about', '/product', '/blogs', '/contact', '/quotation']

function encodePathSegment(value) {
    return encodeURIComponent(String(value || '').trim())
}

function timestampToIso(value) {
    if (!value) return undefined
    if (typeof value.toDate === 'function') return value.toDate().toISOString()
    if (typeof value.seconds === 'number') return new Date(value.seconds * 1000).toISOString()
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

function escapeXml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;')
}

function urlEntry({ path, lastmod }) {
    const location = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
    const lastModified = lastmod ? `\n        <lastmod>${escapeXml(lastmod)}</lastmod>` : ''
    return `    <url>\n        <loc>${escapeXml(location)}</loc>${lastModified}\n    </url>`
}

function productCategory(product) {
    const categories = Array.isArray(product.categories) ? product.categories : []
    return categories.find((value) => String(value || '').trim()) || product.category || 'all'
}

function decodeFirestoreValue(value = {}) {
    if ('stringValue' in value) return value.stringValue
    if ('booleanValue' in value) return value.booleanValue
    if ('integerValue' in value) return Number(value.integerValue)
    if ('doubleValue' in value) return value.doubleValue
    if ('timestampValue' in value) return value.timestampValue
    if ('nullValue' in value) return null
    if ('arrayValue' in value) {
        return (value.arrayValue.values || []).map(decodeFirestoreValue)
    }
    if ('mapValue' in value) return decodeFirestoreFields(value.mapValue.fields || {})
    return undefined
}

function decodeFirestoreFields(fields = {}) {
    return Object.fromEntries(
        Object.entries(fields).map(([name, value]) => [name, decodeFirestoreValue(value)]),
    )
}

async function listCollection(collectionName) {
    const documents = []
    let pageToken = ''

    do {
        const endpoint = new URL(
            `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}`,
        )
        endpoint.searchParams.set('key', firebaseConfig.apiKey)
        endpoint.searchParams.set('pageSize', '300')
        if (pageToken) endpoint.searchParams.set('pageToken', pageToken)

        const response = await fetch(endpoint)
        if (!response.ok) {
            throw new Error(
                `Firestore returned ${response.status} for ${collectionName}: ${await response.text()}`,
            )
        }

        const payload = await response.json()
        for (const document of payload.documents || []) {
            documents.push({
                id: document.name.split('/').at(-1),
                ...decodeFirestoreFields(document.fields),
            })
        }
        pageToken = payload.nextPageToken || ''
    } while (pageToken)

    return documents
}

try {
    const [categories, products, articles] = await Promise.all([
        listCollection('categories'),
        listCollection('products'),
        listCollection('news'),
    ])

    const entries = staticPaths.map((path) => ({ path }))

    categories.forEach((category) => {
        if (category.visibility === false || !category.slug) return
        entries.push({ path: `/product/${encodePathSegment(category.slug)}` })
    })

    products.forEach((product) => {
        const category = productCategory(product)
        entries.push({
            path: `/product/${encodePathSegment(category)}/${encodePathSegment(product.id)}`,
            lastmod: timestampToIso(product.updatedAt || product.createdAt),
        })
    })

    articles.forEach((article) => {
        if (article.status !== 'published') return
        entries.push({
            path: `/blogs/${encodePathSegment(article.id)}`,
            lastmod: timestampToIso(article.updatedAt || article.createdAt),
        })
    })

    const uniqueEntries = [...new Map(entries.map((entry) => [entry.path, entry])).values()]
    const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...uniqueEntries.map(urlEntry),
        '</urlset>',
        '',
    ].join('\n')

    await writeFile(outputPath, sitemap, 'utf8')
    console.log(
        `Generated sitemap.xml with ${uniqueEntries.length} URLs (${categories.length} categories, ${products.length} products, ${articles.length} articles checked).`,
    )
} catch (error) {
    console.error('Unable to generate sitemap from Firebase:', error)
    process.exitCode = 1
}
