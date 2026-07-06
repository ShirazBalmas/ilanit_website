// Authoritative price calculation - the client mirrors this logic for live
// preview, but orders are always priced here on the server.
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
