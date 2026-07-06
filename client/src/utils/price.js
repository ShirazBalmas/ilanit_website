// mirrors server/src/utils/price.js - server pricing is authoritative,
// this powers the live price preview in the UI
export function calcUnitPrice(product, customization = {}) {
  const opts = product.customizationOptions || {};
  let price = product.basePrice;

  if (customization.embroidery?.enabled) {
    price += opts.extraPriceForEmbroidery || 0;
    const text = customization.embroidery.text || '';
    if (text.length > (opts.longTextThreshold || 15)) {
      price += opts.extraPriceForLongText || 0;
    }
  }
  if (customization.logoUrl) price += opts.extraPriceForLogo || 0;
  if (customization.giftPackaging) price += opts.extraPriceForGiftPackaging || 0;

  return price;
}

export const SHIPPING_COSTS = { pickup: 0, delivery: 35 };
export const FREE_SHIPPING_ABOVE = 350;

export function calcShipping(method, subtotal) {
  if (method === 'pickup') return 0;
  return subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_COSTS.delivery;
}

export const formatPrice = (n) => `₪${Number(n).toLocaleString('he-IL')}`;

// font-family previews for embroidery font options
export const FONT_PREVIEWS = {
  'אלגנטי': "'Frank Ruhl Libre', serif",
  'קלאסי': "'David Libre', 'Times New Roman', serif",
  'כתב יד': "'Amatic SC', cursive",
  'מודגש': "'Assistant', sans-serif",
  'ילדותי': "'Varela Round', sans-serif",
  'מודרני': "'Heebo', sans-serif",
};
