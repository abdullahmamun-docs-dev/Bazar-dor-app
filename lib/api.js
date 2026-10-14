export const API_BASE_URL =
"https://openapi.programming-hero.com/api/bazardor";

export const API_ENDPOINTS = {
categories: `${API_BASE_URL}/categories`,
products: `${API_BASE_URL}/products`,
category: (id) =>
`${API_BASE_URL}/categories/${encodeURIComponent(id)}`,
filteredProducts: (category) =>
`${API_BASE_URL}/products?category=${encodeURIComponent(category)}`,
product: (id) =>
`${API_BASE_URL}/products/${encodeURIComponent(id)}`,
};