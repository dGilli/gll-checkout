import { Product } from "../types";

const PRODUCTS_ENDPOINT = import.meta.env.PRODUCTS_ENDPOINT;
const LOCALSTORAGE_KEY = "cached_products";
const LAST_UPDATED_KEY = "products_last_updated";
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

export function getCachedProducts(): Product[] | null {
  const cached = localStorage.getItem(LOCALSTORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached) as Product[];
    } catch (e) {
      console.error("Failed to parse cached products:", e);
      return null;
    }
  }
  return null;
}

export function saveProductsToCache(products: Product[]): void {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(products));
    localStorage.setItem(LAST_UPDATED_KEY, Date.now().toString());
  } catch (e) {
    console.error("Failed to save products to cache:", e);
  }
}

export function getLastUpdated(): number | null {
  const lastUpdated = localStorage.getItem(LAST_UPDATED_KEY);
  if (lastUpdated) {
    return parseInt(lastUpdated, 10);
  }
  return null;
}

function parseProduct(raw: unknown): Product {
  const { id, name, price, categories } = raw as Record<string, unknown>;

  const parsedId = typeof id === "number" ? id : Number((id as string).trim());

  if (typeof name !== "string") throw new Error("Invalid product name");

  let parsedPrice: number;
  if (typeof price === "number") {
    parsedPrice = price;
  } else if (typeof price === "string") {
    const p = price.trim();
    if (p === "") throw new Error("Empty price");
    parsedPrice = Number(p);
    if (Number.isNaN(parsedPrice)) throw new Error("Invalid price format");
  } else {
    throw new Error("Missing price");
  }

  if (typeof categories !== "object")
    throw new Error("Invalid product category");

  return {
    id: parsedId,
    name,
    price: parsedPrice,
    categories,
  };
}

export async function fetchProductsFromServer(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const data = await response.json();
  return data.map(parseProduct) as Product[];
}

export async function loadProducts(): Promise<Product[]> {
  try {
    const products = await fetchProductsFromServer();
    // Save to cache for offline use
    saveProductsToCache(products);
    console.log("Products loaded from server");
    return products;
  } catch (error) {
    console.warn("Failed to fetch from server:", error);

    // If server fails, try to get from cache
    const cached = getCachedProducts();
    if (cached) {
      console.log("Using cached products");
      return cached;
    }

    // No cache available - return empty array (app will show error state)
    console.error("No cached products available");
    return [];
  }
}

export function setupAutoRefresh(
  callback: (products: Product[]) => void,
): () => void {
  // In dev mode, no auto-refresh needed
  if (import.meta.env.DEV) {
    return () => {};
  }

  // Set up interval for auto-refresh
  const intervalId = setInterval(async () => {
    try {
      console.log("Auto-refreshing products from server...");
      const products = await fetchProductsFromServer();
      saveProductsToCache(products);
      callback(products);
      console.log("Products auto-refreshed successfully");
    } catch (error) {
      console.warn("Auto-refresh failed:", error);
      // Don't update UI on error - keep current products
    }
  }, REFRESH_INTERVAL);

  // Also refresh when window regains focus (user returns to app)
  const handleVisibilityChange = async () => {
    if (document.visibilityState === "visible") {
      try {
        const products = await fetchProductsFromServer();
        saveProductsToCache(products);
        callback(products);
        console.log("Products refreshed on focus");
      } catch (error) {
        console.warn("Focus refresh failed:", error);
      }
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}

// For backwards compatibility - will return cached products or empty array
export const sampleProducts: Product[] = getCachedProducts() || [];
