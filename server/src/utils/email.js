import nodemailer from 'nodemailer';

// Email is optional: if no SMTP credentials are configured the app still works
// and simply logs that emails were skipped (like the demo payment mode).
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const MAIL_FROM = process.env.MAIL_FROM || `אילנית רקמה <${SMTP_USER}>`;
const ADMIN_ORDER_EMAIL = process.env.ADMIN_ORDER_EMAIL || 'shiraz.balmas@gmail.com';

let transporter = null;
if (SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

const SHIPPING_LABELS = { pickup: 'איסוף עצמי מכרמיאל', delivery: 'משלוח עד הבית' };
const PAYMENT_LABELS = { card: 'כרטיס אשראי', bit: 'ביט / פייבוקס', pickup: 'תשלום באיסוף' };
const money = (n) => `₪${Number(n).toLocaleString('he-IL')}`;

// human-readable list of an item's personalization choices
function customizationLines(c = {}) {
  const parts = [];
  if (c.size) parts.push(`מידה: ${c.size}`);
  if (c.color) parts.push(`צבע: ${c.color}`);
  if (c.embroidery?.enabled) {
    if (c.embroidery.text) parts.push(`רקמה: "${c.embroidery.text}"`);
    if (c.embroidery.threadColor) parts.push(`צבע חוט: ${c.embroidery.threadColor}`);
    if (c.embroidery.font) parts.push(`גופן: ${c.embroidery.font}`);
    if (c.embroidery.location) parts.push(`מיקום: ${c.embroidery.location}`);
  }
  for (const s of c.selections || []) if (s.value) parts.push(`${s.label}: ${s.value}`);
  for (const t of c.textValues || []) if (t.value?.trim()) parts.push(`${t.label}: "${t.value}"`);
  for (const a of c.addons || []) parts.push(a.label);
  if (c.logoUrl) parts.push('כולל לוגו/תמונה');
  if (c.giftPackaging) parts.push('אריזת מתנה');
  if (c.notes) parts.push(`הערות: ${c.notes}`);
  return parts;
}

function itemsTable(order) {
  const rows = order.items
    .map((item) => {
      const lines = customizationLines(item.customization);
      const details = lines.length
        ? `<div style="color:#6b5a43;font-size:13px;margin-top:4px">${lines.join(' • ')}</div>`
        : '';
      return `<tr>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">
          <strong>${item.name}</strong> × ${item.quantity}${details}
        </td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:left;white-space:nowrap">
          ${money(item.unitPrice * item.quantity)}
        </td>
      </tr>`;
    })
    .join('');
  return `<table style="width:100%;border-collapse:collapse">${rows}</table>`;
}

function orderHtml(order, { forAdmin }) {
  const c = order.customer;
  const heading = forAdmin
    ? `התקבלה הזמנה חדשה 🎉`
    : `תודה על ההזמנה! 💛`;
  const intro = forAdmin
    ? `הזמנה חדשה נכנסה למערכת. פרטים מלאים למטה.`
    : `${c.fullName}, קיבלנו את ההזמנה האישית שלך ואנחנו כבר מתחילים לעבוד עליה. להלן סיכום ההזמנה:`;

  return `<div dir="rtl" style="font-family:Arial,sans-serif;background:#faf6f0;padding:24px">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #eadfce">
      <div style="background:#c9a24b;color:#fff;padding:20px 24px">
        <h1 style="margin:0;font-size:20px">אילנית רקמה</h1>
        <div style="font-size:13px;opacity:.9">מתנות בעיצוב אישי</div>
      </div>
      <div style="padding:24px">
        <h2 style="margin:0 0 6px;color:#3e3428">${heading}</h2>
        <p style="color:#6b5a43;margin:0 0 16px">${intro}</p>

        <div style="background:#faf6f0;border-radius:10px;padding:12px 16px;margin-bottom:16px">
          <strong>מספר הזמנה:</strong> ${order.orderNumber}<br/>
          <strong>תאריך:</strong> ${new Date(order.createdAt).toLocaleString('he-IL')}
        </div>

        <h3 style="color:#3e3428;margin:0 0 8px">פריטים</h3>
        ${itemsTable(order)}

        <table style="width:100%;margin-top:14px;border-collapse:collapse">
          <tr><td style="padding:4px 0;color:#6b5a43">סכום ביניים</td>
              <td style="padding:4px 0;text-align:left">${money(order.subtotal)}</td></tr>
          <tr><td style="padding:4px 0;color:#6b5a43">משלוח (${SHIPPING_LABELS[order.shippingMethod]})</td>
              <td style="padding:4px 0;text-align:left">${order.shippingCost === 0 ? 'חינם' : money(order.shippingCost)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;font-size:17px;color:#a98432;border-top:2px solid #eadfce">סה"כ</td>
              <td style="padding:8px 0;text-align:left;font-weight:bold;font-size:17px;color:#a98432;border-top:2px solid #eadfce">${money(order.total)}</td></tr>
        </table>

        <h3 style="color:#3e3428;margin:18px 0 8px">פרטי ${forAdmin ? 'הלקוח' : 'המשלוח'}</h3>
        <div style="color:#3e3428;line-height:1.7">
          ${c.fullName}<br/>
          טלפון: ${c.phone}<br/>
          אימייל: ${c.email}<br/>
          ${c.city}${c.address ? `, ${c.address}` : ''}<br/>
          אמצעי תשלום: ${PAYMENT_LABELS[order.paymentMethod]} (${order.paymentStatus === 'paid' ? 'שולם' : 'ממתין לתשלום'})
          ${c.notes ? `<br/>הערות: ${c.notes}` : ''}
        </div>

        ${
          forAdmin
            ? ''
            : `<p style="color:#6b5a43;margin-top:20px">נחזור אליך בהקדם עם עדכון. לכל שאלה אפשר להשיב למייל זה או לפנות אלינו בוואטסאפ.<br/><br/>באהבה,<br/>אילנית רקמה</p>`
        }
      </div>
    </div>
  </div>`;
}

// Sends the admin notification and the customer confirmation. Never throws -
// email problems must not break order creation.
export async function sendOrderEmails(order) {
  if (!transporter) {
    console.log(`[email] SMTP not configured - skipping emails for ${order.orderNumber}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: ADMIN_ORDER_EMAIL,
      replyTo: order.customer.email,
      subject: `הזמנה חדשה ${order.orderNumber} - ${order.customer.fullName} (${money(order.total)})`,
      html: orderHtml(order, { forAdmin: true }),
    });
    if (order.customer.email) {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: order.customer.email,
        subject: `אישור הזמנה ${order.orderNumber} - אילנית רקמה`,
        html: orderHtml(order, { forAdmin: false }),
      });
    }
    console.log(`[email] order emails sent for ${order.orderNumber}`);
  } catch (err) {
    console.error(`[email] failed to send emails for ${order.orderNumber}:`, err.message);
  }
}
