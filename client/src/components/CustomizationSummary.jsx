// compact readable description of a cart line's personalization -
// e.g. 'מידה: M • צבע: לבן • רקמה: "אור" • חוט: זהב • גופן: כתב יד'
export default function CustomizationSummary({ customization }) {
  if (!customization) return null;
  const c = customization;
  const parts = [];
  if (c.size) parts.push(`מידה: ${c.size}`);
  if (c.color) parts.push(`צבע: ${c.color}`);
  if (c.embroidery?.enabled) {
    if (c.embroidery.text) parts.push(`רקמה: "${c.embroidery.text}"`);
    if (c.embroidery.threadColor) parts.push(`חוט: ${c.embroidery.threadColor}`);
    if (c.embroidery.font) parts.push(`גופן: ${c.embroidery.font}`);
    if (c.embroidery.location) parts.push(`מיקום: ${c.embroidery.location}`);
  }
  for (const s of c.selections || []) {
    if (s.value) parts.push(`${s.label}: ${s.value}`);
  }
  for (const t of c.textValues || []) {
    if (t.value?.trim()) parts.push(`${t.label}: "${t.value}"`);
  }
  for (const a of c.addons || []) {
    parts.push(a.label);
  }
  if (c.logoUrl) parts.push('כולל לוגו');
  if (c.giftPackaging) parts.push('אריזת מתנה');
  if (c.notes) parts.push(`הערות: ${c.notes}`);

  if (!parts.length) return null;
  return <div className="customization-summary">{parts.join(' • ')}</div>;
}
