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

  // flexible option system: add the extraPrice of each selected choice, and
  // the price of each selected add-on
  for (const sel of customization.selections || []) {
    const group = (opts.optionGroups || []).find((g) => g.label === sel.label);
    const choice = group?.choices.find((c) => c.label === sel.value);
    if (choice?.extraPrice) price += choice.extraPrice;
  }
  for (const addon of customization.addons || []) {
    // trust the product's price, never the client-supplied one
    const real = (opts.addons || []).find((a) => a.label === addon.label);
    if (real?.price) price += real.price;
  }

  return price;
}

export const SHIPPING_COSTS = { pickup: 0, delivery: 35 };
export const FREE_SHIPPING_ABOVE = 350;

export function calcShipping(method, subtotal) {
  if (method === 'pickup') return 0;
  return subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_COSTS.delivery;
}
