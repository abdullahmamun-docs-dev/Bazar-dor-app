import { API_ENDPOINTS } from "./api";

async function testAPI() {
  try {
    const [categoriesResponse, productsResponse] = await Promise.all([
      fetch(API_ENDPOINTS.categories),
      fetch(API_ENDPOINTS.products),
    ]);

    if (!categoriesResponse.ok || !productsResponse.ok) {
      throw new Error("API থেকে ডেটা আনা যায়নি");
    }

    const categoriesData = await categoriesResponse.json();
    const productsData = await productsResponse.json();

    console.log("Categories:", categoriesData);
    console.log("Products:", productsData);
  } catch (error) {
    console.error("API Error:", error);
  }
}

testAPI();