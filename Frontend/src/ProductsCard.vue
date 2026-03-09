<script setup>
import { ref, onMounted, computed, watch } from "vue";
import BaseButton from "@/BaseButton.vue";
import ProductsList from "@/ProductsList.vue";

const products = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const limit = ref(10);
const selectedCategory = ref("");
const loading = ref(false);
const error = ref(null);

const categories = [
  "Beverages", "Condiments", "Oil", "Jams, Preserves",
  "Dried Fruit & Nuts", "Sauces", "Canned Fruit & Vegetables",
  "Baked Goods & Mixes", "Canned Meat", "Soups", "Candy",
  "Grains", "Pasta", "Dairy products", "Cereal", "Chips, Snacks"
];

// Computed Properties
const totalPages = computed(() => {
  if (totalCount.value === 0 || limit.value === 0) return 0;
  return Math.ceil(totalCount.value / limit.value);
});

// Automatisches Neuladen bei Kategorie-Änderung
watch(selectedCategory, () => {
  currentPage.value = 1;
  fetchProducts(1);
});

// Funktion zum Abrufen der Produkte
async function fetchProducts(page) {
  const pageToFetch = Math.max(1, page);

// Wenn wir schon auf der richtigen Seite sind, nichts tun
  if (pageToFetch === currentPage.value && !loading.value && products.value.length > 0) {
    return;
  }

  currentPage.value = pageToFetch;
  loading.value = true;
  error.value = null;

  let url = `http://localhost:3000/api/products?page=${currentPage.value}&limit=${limit.value}`;

  if (selectedCategory.value) {
    url += `&category=${encodeURIComponent(selectedCategory.value)}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    products.value = data.results || [];
    totalCount.value = data.count || 0;

  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = 'Failed to load products. Please check the API server.';
    products.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProducts(1);
});
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1>Products</h1>
      <p class="subtitle">Browse our selection of quality products</p>
    </header>

    <div class="filters-container">
      <div class="filter-group">
        <label for="category-select" class="filter-label">Filter by Category:</label>
        <select
            id="category-select"
            v-model="selectedCategory"
            class="category-select"
        >
          <option value="">All Categories</option>
          <option v-for="c in categories" :key="c" :value="c">
            {{ c }}
          </option>
        </select>
      </div>

      <div class="results-info">
        Showing {{ products.length }} of {{ totalCount }} products
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="error-message">
      <p>{{ error }}</p>
      <BaseButton @click="fetchProducts(1)" class="retry-btn">
        Retry
      </BaseButton>
    </div>

    <!-- Products Grid -->
    <div v-if="!loading && !error && products.length > 0" class="products-section">
      <div class="product-grid">
        <ProductsList
            v-for="p in products"
            :key="p.product_id || p.id"
            :product="p"
            class="product-card"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <div class="pagination-info">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="pagination-controls">
          <BaseButton
              @click="fetchProducts(currentPage - 1)"
              :disabled="currentPage === 1"
              class="pagination-btn"
          >
            &larr; Previous
          </BaseButton>

          <div class="page-numbers">
            <template v-for="pageNum in Math.min(5, totalPages)" :key="pageNum">
              <BaseButton
                  v-if="pageNum === currentPage"
                  class="pagination-btn active"
                  disabled
              >
                {{ pageNum }}
              </BaseButton>
              <BaseButton
                  v-else
                  @click="fetchProducts(pageNum)"
                  class="pagination-btn"
              >
                {{ pageNum }}
              </BaseButton>
            </template>
            <span v-if="totalPages > 5">...</span>
          </div>

          <BaseButton
              @click="fetchProducts(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
          >
            Next &rarr;
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && !error && products.length === 0" class="empty-state">
      <div class="empty-icon">📦</div>
      <h3>No products found</h3>
      <p>No products match your current filters.</p>
      <BaseButton
          @click="selectedCategory = ''; fetchProducts(1)"
          class="clear-filters-btn"
      >
        Clear Filters
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eaeaea;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.filters-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-weight: 600;
  color: #495057;
  white-space: nowrap;
}

.category-select {
  padding: 10px 16px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  background-color: white;
  font-size: 1rem;
  min-width: 200px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.category-select:focus {
  outline: none;
  border-color: #4dabf7;
  box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.2);
}

.results-info {
  color: #6c757d;
  font-size: 0.95rem;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 40px 20px;
  background: #fee;
  border-radius: 12px;
  border: 1px solid #f5c6cb;
}

.error-message p {
  color: #721c24;
  margin-bottom: 20px;
}

.retry-btn {
  background: #dc3545;
  color: white;
}

.retry-btn:hover {
  background: #c82333;
}

.products-section {
  margin-top: 30px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px 0;
  border-top: 1px solid #eaeaea;
}

.pagination-info {
  color: #6c757d;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-btn {
  padding: 10px 16px;
  border: 2px solid #dee2e6;
  background: white;
  color: #495057;
  font-weight: 500;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #4dabf7;
  background: #4dabf7;
  color: white;
}

.pagination-btn.active {
  background: #4dabf7;
  color: white;
  border-color: #4dabf7;
  cursor: default;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #6c757d;
  margin-bottom: 10px;
}

.empty-state p {
  color: #adb5bd;
  margin-bottom: 25px;
}

.clear-filters-btn {
  background: #6c757d;
  color: white;
}

.clear-filters-btn:hover {
  background: #5a6268;
}

/* Responsive */
@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .category-select {
    width: 100%;
  }

  .pagination-controls {
    flex-direction: column;
  }

  .page-numbers {
    order: -1;
    margin-bottom: 15px;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}
</style>