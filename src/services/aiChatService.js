import { supabase } from '../lib/supabase';

const MODEL_NAME = 'gemini-2.0-flash';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const normalizeProduct = (product) => {
  const price = Number(product?.price ?? 0);
  const discountPrice = Number(product?.discount_price ?? product?.price ?? 0);
  const slug = product?.slug || String(product?.id || product?.product_id || 'product');

  return {
    id: product?.id ?? product?.product_id ?? slug,
    slug,
    title: product?.title || product?.name || 'Electronics product',
    brand: product?.brand || 'Sai Baba Electronics',
    category_slug: product?.category_slug || product?.category || 'general',
    price,
    discount_price: discountPrice,
    image_url: product?.image_url || product?.image || '',
    specs: product?.specs || product?.specifications || {},
    stock: product?.stock ?? 'In stock',
  };
};

const fallbackProductCatalog = [
  {
    id: 'tv-1',
    slug: 'samsung-4k-smart-tv',
    title: 'Samsung 4K Smart TV',
    brand: 'Samsung',
    category_slug: 'televisions',
    price: 46999,
    discount_price: 42999,
    image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    specs: { size: '55 inch', display: '4K UHD' },
    stock: 12,
  },
  {
    id: 'phone-1',
    slug: 'oneplus-12r-5g',
    title: 'OnePlus 12R 5G',
    brand: 'OnePlus',
    category_slug: 'mobiles',
    price: 39999,
    discount_price: 36999,
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    specs: { display: '6.78 inch', battery: '5000mAh' },
    stock: 7,
  },
  {
    id: 'fridge-1',
    slug: 'lg-double-door-fridge',
    title: 'LG Double Door Fridge',
    brand: 'LG',
    category_slug: 'appliances',
    price: 32999,
    discount_price: 29999,
    image_url: 'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?auto=format&fit=crop&w=800&q=80',
    specs: { capacity: '345 L', type: 'Double Door' },
    stock: 4,
  },
];

const fetchProductCatalog = async () => {
  if (supabase) {
    const { data, error } = await supabase.from('products').select('*').limit(18);
    if (!error && data?.length) {
      return data.map(normalizeProduct);
    }
  }

  return fallbackProductCatalog;
};

const CATEGORY_KEYWORDS = {
  audio: ['headphones', 'earphones', 'earbuds', 'speaker', 'speakers', 'sound', 'audio', 'soundbar', 'headset'],
  mobiles: ['phone', 'mobile', 'smartphone', 'android', 'iphone'],
  televisions: ['tv', 'television', 'screen', 'smart tv', 'led tv'],
  laptops: ['laptop', 'pc', 'computer', 'notebook', 'ultrabook'],
  appliances: ['fridge', 'refrigerator', 'ac', 'air conditioner', 'cooler', 'washing machine', 'washer'],
};

const detectRequestedCategory = (userMessage = '') => {
  const query = String(userMessage || '').toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => query.includes(keyword))) {
      return category;
    }
  }

  return null;
};

const extractBudgetFromQuery = (userMessage = '') => {
  const query = String(userMessage || '').toLowerCase().replace(/,/g, '').replace(/rs\.?/g, '').replace(/₹/g, '');
  const matches = [...query.matchAll(/(?:under\s+)?(\d{1,8})(?:\s*(k))?/gi)];

  if (!matches.length) {
    return null;
  }

  const values = matches
    .map((match) => {
      const value = Number(match[1] || 0);
      const suffix = match[2] || '';
      return suffix.toLowerCase() === 'k' ? value * 1000 : value;
    })
    .filter((value) => Number.isFinite(value) && value > 0);

  return values.length ? Math.min(...values) : null;
};

const productMatchesCategory = (product, category) => {
  if (!category) return true;

  const text = `${product.title || ''} ${product.brand || ''} ${product.category_slug || ''} ${(product.specs && Object.values(product.specs).join(' ')) || ''}`.toLowerCase();
  const keywords = CATEGORY_KEYWORDS[category] || [];

  return keywords.some((keyword) => text.includes(keyword)) || String(product.category_slug || '').toLowerCase() === category;
};

const filterProductsByUserIntent = (catalog, userMessage) => {
  const requestedCategory = detectRequestedCategory(userMessage);
  const maxBudget = extractBudgetFromQuery(userMessage);

  return catalog.filter((product) => {
    const matchedCategory = requestedCategory ? productMatchesCategory(product, requestedCategory) : true;
    const budgetValue = Number(product.discount_price || product.price || 0);
    const withinBudget = maxBudget ? budgetValue <= maxBudget : true;

    return matchedCategory && withinBudget;
  });
};

const fetchCatalogContext = async (catalog = []) => {
  return catalog
    .map((product) => `- ${product.title} | Brand: ${product.brand} | Category: ${product.category_slug} | Price: ₹${Number(product.discount_price || product.price || 0)} | Specs: ${JSON.stringify(product.specs || {})} | Slug: ${product.slug}`)
    .join('\n');
};

const parseProductSlugs = (text = '') => {
  const matches = [...text.matchAll(/\[\[PRODUCT:([^\]]+)\]\]/g)].map((match) => match[1].trim());
  return [...new Set(matches.filter(Boolean))];
};

const parseStructuredResponse = (rawText, catalog) => {
  const text = (rawText || '').trim();
  const productSlugs = parseProductSlugs(text);
  const products = (productSlugs.length ? productSlugs : [])
    .map((slug) => catalog.find((product) => product.slug === slug))
    .filter(Boolean)
    .slice(0, 3)
    .map(normalizeProduct);

  return {
    text,
    products,
  };
};

const buildSystemInstruction = (catalogContext) => `You are Sai Baba Electronics AI assistant.
Rules:
- You MUST match the user's requested category (e.g., if user asks for headphones/audio, NEVER recommend phones or TVs).
- You MUST respect the user's budget.
- ONLY recommend from the PROVIDED PRODUCTS list below.
- If no provided product fits the request, reply: "Maaf kijiye, hamare paas is budget/category me abhi koi product available nahi hai."
- Keep answers under 2 sentences in natural Hinglish.
- Output format: Include [[PRODUCT:slug]] for the single best match.

PROVIDED PRODUCTS:
${catalogContext || 'No catalog available.'}`;

const buildHeuristicFallback = (userMessage, catalog) => {
  const filteredCatalog = filterProductsByUserIntent(catalog, userMessage);

  if (!filteredCatalog.length) {
    return {
      text: 'Maaf kijiye, hamare paas is budget/category me abhi koi product available nahi hai.',
      products: [],
    };
  }

  const product = filteredCatalog[0];
  const message = `Aapke liye ${product.title} best match hai [[PRODUCT:${product.slug}]]. Price ₹${Number(product.discount_price || product.price || 0).toLocaleString('en-IN')} hai.`;

  return {
    text: message,
    products: [normalizeProduct(product)],
  };
};

export async function fetchAiAssistantReply(userMessage, history = []) {
  const catalog = await fetchProductCatalog();
  const filteredCatalog = filterProductsByUserIntent(catalog, userMessage);
  const catalogContext = await fetchCatalogContext(filteredCatalog.length ? filteredCatalog : catalog);
  const promptHistory = history
    .slice(-6)
    .map((entry) => `${entry.role === 'user' ? 'User' : 'Assistant'}: ${entry.text}`)
    .join('\n');

  const systemInstruction = buildSystemInstruction(catalogContext);
  const messageBody = `Conversation history:\n${promptHistory}\n\nUser query: ${userMessage}`;

  if (!filteredCatalog.length) {
    return {
      text: 'Maaf kijiye, hamare paas is budget/category me abhi koi product available nahi hai.',
      products: [],
    };
  }

  if (!API_KEY) {
    return buildHeuristicFallback(userMessage, filteredCatalog);
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser query:\n${messageBody}` }],
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Gemini request failed');
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') || '';

    if (!rawText) {
      return buildHeuristicFallback(userMessage, filteredCatalog);
    }

    const structured = parseStructuredResponse(rawText, filteredCatalog);
    if (structured.text) {
      return structured;
    }

    return buildHeuristicFallback(userMessage, filteredCatalog);
  } catch {
    return buildHeuristicFallback(userMessage, filteredCatalog);
  }
}
