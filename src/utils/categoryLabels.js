export function categoryLabelThai(category) {
    if (!category) return ''
    return category.description?.trim() || category.name?.trim() || ''
}
