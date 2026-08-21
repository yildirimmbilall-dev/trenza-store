const OWNER_EMAIL = 'hello@trenza.com.tr';
const FROM_EMAIL = 'TRƎNZA Web <hello@trenza.com.tr>';

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function itemLines(items) {
  return (Array.isArray(items) ? items : []).map(item => `${item.product} × ${item.quantity}`).join(', ');
}

function htmlRows(rows) {
  return rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 14px 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#77695e;vertical-align:top;">${esc(label)}</td>
      <td style="padding:10px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:19px;color:#241b16;vertical-align:top;">${esc(value)}</td>
    </tr>`).join('');
}

export async function sendOwnerNotification(env, { kind, email, language, name = '', items = [], note = '' }) {
  if (!env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return false;
  }

  const isPreorder = kind === 'preorder';
  const subject = isPreorder
    ? `TRƎNZA · Yeni ön sipariş talebi${name ? ` · ${name}` : ''}`
    : 'TRƎNZA · Yeni erken erişim kaydı';
  const itemText = itemLines(items);
  const text = isPreorder
    ? ['TRƎNZA yeni ön sipariş talebi', '', `Ad Soyad: ${name}`, `E-posta: ${email}`, `Dil: ${language === 'en' ? 'EN' : 'TR'}`, `Seçimler: ${itemText}`, `Not: ${note || '—'}`].join('\n')
    : ['TRƎNZA yeni erken erişim kaydı', '', `E-posta: ${email}`, `Dil: ${language === 'en' ? 'EN' : 'TR'}`].join('\n');
  const rows = isPreorder
    ? [['Ad Soyad', name], ['E-posta', email], ['Dil', language === 'en' ? 'EN' : 'TR'], ['Seçimler', itemText || '—'], ['Not', note || '—']]
    : [['E-posta', email], ['Dil', language === 'en' ? 'EN' : 'TR']];

  const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#eee7df"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#eee7df"><tr><td align="center" style="padding:32px 18px"><table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#f6efe8"><tr><td style="padding:30px;background-color:#211812;color:#f7eee4;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:28px;letter-spacing:4px">TRƎNZA</td></tr><tr><td style="padding:28px 30px 8px;font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:34px;color:#241b16">${esc(subject.replace('TRƎNZA · ',''))}</td></tr><tr><td style="padding:8px 30px 28px"><table width="100%" cellpadding="0" cellspacing="0" border="0">${htmlRows(rows)}</table></td></tr><tr><td style="padding:16px 30px 24px;border-top:1px solid #d9cec2;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:#77695e">TRƎNZA web form notification · ${esc(new Date().toISOString())}</td></tr></table></td></tr></table></body></html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [OWNER_EMAIL],
        reply_to: [email],
        subject,
        text,
        html,
        tags: [{ name: 'source', value: 'trenza-website' }, { name: 'type', value: kind }]
      })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('Resend notification failed', response.status, detail.slice(0, 500));
      return false;
    }
    return true;
  } catch (error) {
    console.error('Resend notification request failed', error);
    return false;
  }
}
