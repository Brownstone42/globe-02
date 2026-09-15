import nodemailer from 'nodemailer'

const MAX_BODY_BYTES = 64 * 1024
const MAX_PRODUCTS = 50

function json(statusCode, payload) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
        },
        body: JSON.stringify(payload),
    }
}

function clean(value, maxLength = 500) {
    return String(value ?? '').trim().slice(0, maxLength)
}

function escapeHtml(value) {
    return clean(value, 5000)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizePayload(raw) {
    const customer = raw?.customer || {}
    const products = Array.isArray(raw?.products)
        ? raw.products.slice(0, MAX_PRODUCTS).map((item) => ({
            name: clean(item?.name, 250),
            sku: clean(item?.sku, 100),
            quantity: Math.max(1, Math.min(999999, Number(item?.quantity) || 1)),
            unit: clean(item?.unit, 50) || 'ชิ้น',
        }))
        : []

    return {
        referenceNumber: clean(raw?.referenceNumber, 80),
        website: clean(raw?.website, 200),
        customer: {
            name: clean(customer.name, 200),
            phone: clean(customer.phone, 100),
            company: clean(customer.company, 250),
            email: clean(customer.email, 320),
            lineId: clean(customer.lineId, 150),
            message: clean(customer.message, 5000),
        },
        products,
    }
}

function buildText(data) {
    const productLines = data.products.map((product, index) =>
        `${index + 1}. ${product.name || '-'} | SKU: ${product.sku || '-'} | จำนวน: ${product.quantity} ${product.unit}`,
    )

    return [
        `มีคำขอใบเสนอราคาใหม่ (${data.referenceNumber})`,
        '',
        `ชื่อผู้ติดต่อ: ${data.customer.name || '-'}`,
        `บริษัท: ${data.customer.company || '-'}`,
        `โทรศัพท์: ${data.customer.phone || '-'}`,
        `อีเมล: ${data.customer.email || '-'}`,
        `LINE ID: ${data.customer.lineId || '-'}`,
        '',
        'รายการสินค้า:',
        ...productLines,
        '',
        'รายละเอียดเพิ่มเติม:',
        data.customer.message || '-',
    ].join('\n')
}

function buildHtml(data) {
    const rows = data.products.map((product, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(product.name || '-')}</td>
            <td>${escapeHtml(product.sku || '-')}</td>
            <td>${product.quantity}</td>
            <td>${escapeHtml(product.unit)}</td>
        </tr>
    `).join('')

    return `
        <div style="font-family:Arial,'Noto Sans Thai',sans-serif;color:#23272d;line-height:1.6">
            <h2 style="color:#a38c67">คำขอใบเสนอราคาใหม่</h2>
            <p><strong>เลขอ้างอิง:</strong> ${escapeHtml(data.referenceNumber)}</p>
            <p>
                <strong>ชื่อผู้ติดต่อ:</strong> ${escapeHtml(data.customer.name || '-')}<br>
                <strong>บริษัท:</strong> ${escapeHtml(data.customer.company || '-')}<br>
                <strong>โทรศัพท์:</strong> ${escapeHtml(data.customer.phone || '-')}<br>
                <strong>อีเมล:</strong> ${escapeHtml(data.customer.email || '-')}<br>
                <strong>LINE ID:</strong> ${escapeHtml(data.customer.lineId || '-')}
            </p>
            <table style="border-collapse:collapse;width:100%;margin:20px 0">
                <thead>
                    <tr style="background:#a38c67;color:#fff">
                        <th style="padding:8px;border:1px solid #ddd">#</th>
                        <th style="padding:8px;border:1px solid #ddd">สินค้า</th>
                        <th style="padding:8px;border:1px solid #ddd">SKU</th>
                        <th style="padding:8px;border:1px solid #ddd">จำนวน</th>
                        <th style="padding:8px;border:1px solid #ddd">หน่วย</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
            <p><strong>รายละเอียดเพิ่มเติม:</strong><br>${escapeHtml(data.customer.message || '-').replaceAll('\n', '<br>')}</p>
        </div>
    `
}

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return json(405, { ok: false, error: 'Method not allowed' })
    }

    const contentLength = Number(event.headers?.['content-length'] || 0)
    if (contentLength > MAX_BODY_BYTES) {
        return json(413, { ok: false, error: 'Request is too large' })
    }

    let raw
    try {
        const body = event.isBase64Encoded
            ? Buffer.from(event.body || '', 'base64').toString('utf8')
            : event.body || '{}'
        if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
            return json(413, { ok: false, error: 'Request is too large' })
        }
        raw = JSON.parse(body)
    } catch {
        return json(400, { ok: false, error: 'Invalid request body' })
    }

    const data = normalizePayload(raw)

    // Honeypot: bots commonly fill hidden fields. Return success without sending.
    if (data.website) return json(200, { ok: true })

    if (
        !data.referenceNumber
        || !data.customer.name
        || !data.customer.phone
        || !isEmail(data.customer.email)
        || !data.products.length
    ) {
        return json(400, { ok: false, error: 'Required quotation data is missing' })
    }

    const smtpUser = clean(process.env.SMTP_USER, 320)
    const smtpPassword = String(process.env.SMTP_APP_PASSWORD || '').replaceAll(' ', '')
    const recipient = clean(process.env.QUOTATION_TO, 320)
    const cc = clean(process.env.QUOTATION_CC, 320)

    if (!smtpUser || !smtpPassword || !recipient) {
        console.error('Quotation email environment variables are incomplete')
        return json(500, { ok: false, error: 'Email service is not configured' })
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user: smtpUser, pass: smtpPassword },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 20000,
        })

        const result = await transporter.sendMail({
            from: `Ideal Globe Website <${smtpUser}>`,
            to: recipient,
            cc: cc || undefined,
            replyTo: data.customer.email,
            subject: `[${data.referenceNumber}] คำขอใบเสนอราคาใหม่จาก ${clean(data.customer.company || data.customer.name, 150)}`,
            text: buildText(data),
            html: buildHtml(data),
        })

        return json(200, { ok: true, messageId: result.messageId })
    } catch (error) {
        console.error('Quotation email failed', {
            name: error?.name,
            code: error?.code,
            message: error?.message,
        })
        return json(502, { ok: false, error: 'Unable to send quotation email' })
    }
}

