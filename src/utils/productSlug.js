export function slugifyProductName(value) {
    return String(value || '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('en')
        .replace(/&/g, ' and ')
        .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-')
}

export function uniqueProductSlug(name, products = [], excludeId = null) {
    const base = slugifyProductName(name) || 'product'
    const used = new Set(
        products
            .filter((product) => product.id !== excludeId && product.slug)
            .map((product) => product.slug),
    )
    if (!used.has(base)) return base

    let number = 2
    while (used.has(`${base}-${number}`)) number += 1
    return `${base}-${number}`
}

export function productRouteKey(product) {
    return product?.slug || slugifyProductName(product?.name) || product?.id || ''
}

export function primaryProductCategory(product) {
    if (Array.isArray(product?.categories) && product.categories.length) {
        return product.categories[0]
    }
    return product?.category || 'all'
}
