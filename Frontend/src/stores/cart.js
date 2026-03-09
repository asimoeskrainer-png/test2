import {defineStore} from 'pinia';
import {ref, computed} from 'vue';

export const useCartStore = defineStore('cart', () => {

    const items = ref([]);


    function createDefaultCartItem(product = {}) {
        return {
            product_id: product.product_id ?? 0,
            product_name: product.product_name ?? '',
            list_price: product.list_price ?? 0,
            quantity: product.quantity ?? 0
        };
    }

    // Speichert den Warenkorb im sessionStorage
    function saveCart() {
        sessionStorage.setItem('cart', JSON.stringify(items.value));
    }


    // Lädt den Warenkorb aus dem sessionStorage
    function loadCart() {
        const stored = sessionStorage.getItem('cart');
        if (stored) {
            try {
                // Pinia Store lädt gespeicherte Daten
                const parsed = JSON.parse(stored);
                items.value = parsed.map(p => createDefaultCartItem(p));
            } catch (e) {
                console.error('Failed to load cart:',e);
                // Bei fehlerhaften Daten löschen
                sessionStorage.removeItem('cart');
            }
        }
    }

    // --- Getters (Computed) ---
    const cartProductCount = computed(() => items.value.length);

    const totalCount = computed(() =>
        items.value.reduce((total, item) => total + item.quantity, 0)
    );

    // Berechnung des Gesamtpreises des Warenkorbs
    const totalPrice = computed(() =>
        items.value.reduce((total, item) => total + (item.list_price * item.quantity), 0)
    );

    //Hinzufügen oder Erhöhung der Menge
    function addItem(product) {
        const existingItem = items.value.find(i => i.product_id === product.product_id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const newItem = createDefaultCartItem({
                product_id: product.product_id,
                product_name: product.product_name,
                list_price: product.list_price,
                quantity: 1
            });
            items.value.push(newItem);
        }
        saveCart();
    }

    function increaseQuantity(productId) {

        const existingItem = items.value.find(i => i.product_id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
            saveCart();
        }

    }

    function decreaseQuantity(productId) {
        const item = items.value.find(i => i.product_id === productId);
        if (!item) return;

        if (item.quantity > 1) {
            item.quantity -= 1;
            saveCart();
        }
    }

    // Entfernt ein Produkt komplett
    function removeItem(productId) {
        items.value = items.value.filter(item => item.product_id !== productId);
        saveCart();
    }

    // Setzt den Warenkorb komplett zurück
    function clearCart() {
        items.value = [];
        saveCart();
    }

    //Beim Store-Start laden
    if (typeof window !== 'undefined') {

    loadCart();
}
    return {
        items,
        totalCount,
        cartProductCount,
        totalPrice,
        addItem,
        loadCart,
        saveCart,
        removeItem,
        clearCart,
        increaseQuantity,
        decreaseQuantity
    };
});