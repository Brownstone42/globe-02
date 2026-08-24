const thaiCategoryLabels = {
    'disposable-gloves': 'ถุงมือใช้แล้วทิ้ง',
    'specialty-gloves': 'ถุงมือเฉพาะทาง',
    'overall-protection': 'อุปกรณ์ป้องกันร่างกาย',
    'footwear-protection': 'อุปกรณ์ป้องกันเท้า',
    'esd-mats-fabric': 'แผ่นยางและผ้าป้องกันไฟฟ้าสถิต',
    equipment: 'อุปกรณ์',
}

export function categoryLabelThai(category) {
    if (!category) return ''
    return thaiCategoryLabels[category.slug] || category.name || ''
}
