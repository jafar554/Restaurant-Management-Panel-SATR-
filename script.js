// Restaurant Management Dashboard JavaScript
class RestaurantDashboard {
    constructor() {
        this.restaurants = [];
        this.currentSection = 'restaurants';
        this.isAdmin = false;
        this.adminPassword = CONFIG.ADMIN.PASSWORD;
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupOfflineSupport();
        this.loadRestaurantsFromStorage();
        this.checkAdminMode();
        this.updateUIForUserMode();
    }

    setupOfflineSupport() {
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateOnlineStatus();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateOnlineStatus();
        });
    }

    updateOnlineStatus() {
        const statusElement = document.getElementById('onlineStatus');
        if (statusElement) {
            statusElement.textContent = this.isOnline ? 'متصل' : 'غير متصل';
            statusElement.className = this.isOnline ? 'status-online' : 'status-offline';
        }
        
        // Show toast notification for status change
        if (!this.isOnline) {
            this.showToast('أنت الآن غير متصل بالإنترنت. يمكن الوصول إلى البيانات المخزنة مؤقتًا فقط.', 'info');
        }
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadRestaurantsFromStorage();
            this.showToast('تم تحديث البيانات', 'success');
        });

        // Add restaurant button
        document.getElementById('addRestaurantBtn').addEventListener('click', () => {
            this.editingRestaurantId = null;
            this.openRestaurantModal();
        });

        // Modal close button
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        // Admin login button
        document.getElementById('adminLoginBtn').addEventListener('click', () => {
            this.toggleAdminMode();
        });

        // Search input
        document.getElementById('zoneSearchInput').addEventListener('input', (e) => {
            this.searchDeliveryZones(e.target.value);
        });

        // Close modal on outside click
        document.getElementById('restaurantModal').addEventListener('click', (e) => {
            if (e.target.id === 'restaurantModal') {
                this.closeModal();
            }
        });

        // Modal buttons (these will be added dynamically)
        this.setupModalEventListeners();
    }

    switchSection(section) {
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');

        this.currentSection = section;

        // Load section-specific data
        if (section === 'restaurants') {
            this.renderRestaurants();
        } else if (section === 'search') {
            this.clearSearchResults();
        }
    }

    checkAdminMode() {
        const savedAdminMode = localStorage.getItem(CONFIG.STORAGE.ADMIN_KEY);
        if (savedAdminMode === 'true') {
            this.isAdmin = true;
        }
    }

    toggleAdminMode() {
        if (this.isAdmin) {
            this.isAdmin = false;
            localStorage.removeItem(CONFIG.STORAGE.ADMIN_KEY);
            this.showToast('تم تسجيل الخروج من وضع المدير', 'info');
        } else {
            const password = prompt('أدخل كلمة مرور المدير:');
            if (password === this.adminPassword) {
                this.isAdmin = true;
                localStorage.setItem(CONFIG.STORAGE.ADMIN_KEY, 'true');
                this.showToast('تم تسجيل الدخول كمدير', 'success');
            } else if (password !== null) {
                this.showToast('كلمة المرور غير صحيحة', 'error');
            }
        }
        this.updateUIForUserMode();
        this.renderRestaurants();
    }

    updateUIForUserMode() {
        const addButton = document.getElementById('addRestaurantBtn');
        const adminButton = document.getElementById('adminLoginBtn');
        
        if (this.isAdmin) {
            addButton.style.display = 'inline-flex';
            adminButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> تسجيل الخروج';
            adminButton.className = 'btn btn-secondary';
        } else {
            addButton.style.display = 'none';
            adminButton.innerHTML = '<i class="fas fa-user-shield"></i> تسجيل دخول المدير';
            adminButton.className = 'btn btn-primary';
        }
        this.renderRestaurants();
    }

    loadRestaurantsFromStorage() {
        const savedRestaurants = localStorage.getItem(CONFIG.STORAGE.RESTAURANTS_KEY);
        if (savedRestaurants) {
            this.restaurants = JSON.parse(savedRestaurants);
        } else {
            // Load default sample data if no saved data exists
            this.restaurants = [
                {
                    id: 1,
                    name: "UN PIZZA",
                    deliveryZones: [
                        { zone: "جبل الحسين", price: 1, deliveryTime: 25 },
                        { zone: "العبدلي", price: 2, deliveryTime: 30 },
                        { zone: "خلدا", price: 3, deliveryTime: 35 }
                    ]
                },
                {
                    id: 2,
                    name:  "جوسي وكرنشي - أبو نصير",
                    deliveryZones: [
                        { zone: "جبل الحسين", price: 1, deliveryTime: 25 },
                        { zone: "العبدلي", price: 2, deliveryTime: 30 },
                        { zone: "خلدا", price: 3, deliveryTime: 35 },
                        { zone: "الوحدات", price: 4, deliveryTime: 45 }
                    ]
                },
                {
                    id: 3,
                    name:    "جوسي وكرنشي - خلدا",
                    deliveryZones: [
                        { zone: "جبل الحسين", price: 1, deliveryTime: 25 },
                        { zone: "العبدلي", price: 2, deliveryTime: 30 },
                        { zone: "خلدا", price: 3, deliveryTime: 35 }
                    ]
                }                
            ];
            this.saveRestaurantsToStorage();
        }
        this.renderRestaurants();
    }

    saveRestaurantsToStorage() {
        localStorage.setItem(CONFIG.STORAGE.RESTAURANTS_KEY, JSON.stringify(this.restaurants));
    }

    renderRestaurants() {
        const grid = document.getElementById('restaurantsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        this.restaurants.forEach(restaurant => {
            const card = this.createRestaurantCard(restaurant);
            grid.appendChild(card);
        });
    }

    createRestaurantCard(restaurant) {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.dataset.id = restaurant.id;

        // Format delivery zones for display (only show first 3)
        const displayedZones = restaurant.deliveryZones.slice(0, 3);
        const formattedZones = displayedZones.map(zone => ({
            ...zone,
            price: `${zone.price} دينار`,
            deliveryTime: `${zone.deliveryTime} دقيقة`
        }));

        card.innerHTML = `
            <div class="restaurant-card-header">
                <div class="restaurant-title-section">
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                </div>
            </div>
            
            <div class="delivery-zones-enhanced">
                <div class="zones-header">
                    <i class="fas fa-truck"></i>
                    <h4>مناطق التوصيل والأسعار</h4>
                </div>
                <div class="zones-list">
                    ${formattedZones.map(zone => 
                        `<div class="zone-item">
                            <div class="zone-content">
                                <div class="zone-name">${zone.zone}</div>
                                <div class="zone-details">
                                    <span class="zone-price">${zone.price}</span>
                                    <span class="zone-time"><i class="fas fa-stopwatch"></i> ${zone.deliveryTime}</span>
                                </div>
                            </div>
                        </div>`
                    ).join('')}
                    ${restaurant.deliveryZones.length > 3 ? 
                        `<div class="zone-item">
                            <div class="zone-content">
                                <div class="zone-name">و${restaurant.deliveryZones.length - 3} مناطق أخرى</div>
                            </div>
                        </div>` : ''
                    }
                </div>
            </div>
            
            ${this.isAdmin ? `
            <div class="admin-actions">
                <button class="btn edit-btn" data-action="edit" data-id="${restaurant.id}">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn add-zone-btn" data-action="add-zone" data-id="${restaurant.id}">
                    <i class="fas fa-plus-circle"></i> إضافة منطقة
                </button>
                <button class="btn delete-btn" data-action="delete" data-id="${restaurant.id}">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
            ` : ''}
            
            <div class="card-footer">
                <button class="view-details-btn">
                    <i class="fas fa-eye"></i>
                    <span>عرض التفاصيل</span>
                </button>
            </div>
        `;

        // Add event listeners for the card
        card.querySelector('.view-details-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.openRestaurantDetails(restaurant);
        });

        if (this.isAdmin) {
            card.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.editRestaurant(restaurant.id);
            });
            
            card.querySelector('.add-zone-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.addDeliveryZone(restaurant.id);
            });
            
            card.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteRestaurant(restaurant.id);
            });
        }

        return card;
    }

    openRestaurantDetails(restaurant) {
        const modal = document.getElementById('restaurantModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = restaurant.name;
        
        // Format delivery zones for display
        const formattedZones = restaurant.deliveryZones.map(zone => ({
            ...zone,
            price: `${zone.price} دينار`,
            deliveryTime: `${zone.deliveryTime} دقيقة`
        }));
        
        modalBody.innerHTML = `
            <div class="restaurant-details-enhanced">
                <!-- Restaurant Header -->
                <div class="restaurant-header-modal">
                    <div class="restaurant-title-section">
                        <h2 class="restaurant-name-modal">${restaurant.name}</h2>
                    </div>
                </div>

                <!-- Delivery Zones Card -->
                <div class="delivery-zones-card">
                    <div class="card-header">
                        <i class="fas fa-truck"></i>
                        <h3>مناطق التوصيل والأسعار</h3>
                    </div>
                    <div class="card-content">
                        <div class="delivery-zones-grid">
                            ${formattedZones.map((zone, index) => `
                                <div class="delivery-zone-card">
                                    <div class="zone-header">
                                        <div class="zone-number">${index + 1}</div>
                                        <h4 class="zone-name">${zone.zone}</h4>
                                    </div>
                                    <div class="zone-details">
                                        <div class="zone-price-section">
                                            <i class="fas fa-tag"></i>
                                            <span class="price-label">السعر:</span>
                                            <span class="price-value">${zone.price}</span>
                                        </div>
                                        <div class="zone-time-section">
                                            <i class="fas fa-stopwatch"></i>
                                            <span class="time-label">وقت التوصيل:</span>
                                            <span class="time-value">${zone.deliveryTime}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    editRestaurant(restaurantId) {
        const restaurant = this.restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return;

        this.editingRestaurantId = restaurantId;
        this.openRestaurantModal(restaurant);
    }

    addDeliveryZone(restaurantId) {
        const restaurant = this.restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return;

        // Add a new empty zone
        restaurant.deliveryZones.push({
            zone: "",
            price: 1,
            deliveryTime: 30
        });

        this.saveRestaurantsToStorage();
        this.renderRestaurants();
        this.showToast('تمت إضافة منطقة توصيل جديدة', 'success');
    }

    deleteRestaurant(restaurantId) {
        if (!confirm('هل أنت متأكد من حذف هذا المطعم؟ هذا الإجراء لا يمكن التراجع عنه.')) {
            return;
        }

        this.restaurants = this.restaurants.filter(r => r.id !== restaurantId);
        this.saveRestaurantsToStorage();
        this.renderRestaurants();
        this.showToast('تم حذف المطعم بنجاح', 'success');
    }

    openRestaurantModal(restaurant = null) {
        const modal = document.getElementById('restaurantModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (restaurant) {
            modalTitle.textContent = `تعديل ${restaurant.name}`;
        } else {
            modalTitle.textContent = 'إضافة مطعم جديد';
        }

        const deliveryZones = restaurant ? restaurant.deliveryZones : [{ zone: "", price: 1, deliveryTime: 30 }];

        modalBody.innerHTML = `
            <form id="restaurantForm">
                <div class="form-group">
                    <label for="restaurantName">اسم المطعم *</label>
                    <input type="text" id="restaurantName" value="${restaurant ? restaurant.name : ''}" required>
                </div>

                <div class="form-group">
                    <label>مناطق التوصيل</label>
                    <div id="deliveryZonesContainer">
                        ${deliveryZones.map((zone, index) => `
                            <div class="zone-input-group" data-index="${index}">
                                <input type="text" placeholder="اسم المنطقة" class="zone-name-input" value="${zone.zone}">
                                <input type="number" placeholder="السعر (بالدنانير)" class="zone-price-input" value="${zone.price}" min="1">
                                <input type="number" placeholder="وقت التوصيل (بالدقائق)" class="zone-time-input" value="${zone.deliveryTime}" min="10">
                                ${deliveryZones.length > 1 ? `
                                    <button type="button" class="remove-zone-btn" onclick="this.parentElement.remove()">
                                        <i class="fas fa-times"></i>
                                    </button>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" id="addZoneBtn">
                        <i class="fas fa-plus"></i> إضافة منطقة أخرى
                    </button>
                </div>
            </form>
        `;

        // Add event listener for adding zones
        setTimeout(() => {
            document.getElementById('addZoneBtn').addEventListener('click', () => {
                this.addDeliveryZoneInput();
            });
        }, 100);

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('restaurantModal');
        modal.classList.remove('active');
        this.editingRestaurantId = null;
    }

    setupModalEventListeners() {
        // Use event delegation for dynamically created buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'saveRestaurantBtn') {
                this.saveRestaurant();
            } else if (e.target.id === 'editRestaurantBtn') {
                // This button is not used in the new UI
            }
        });
    }

    addDeliveryZoneInput() {
        const container = document.getElementById('deliveryZonesContainer');
        const index = container.querySelectorAll('.zone-input-group').length;
        const newZoneGroup = document.createElement('div');
        newZoneGroup.className = 'zone-input-group';
        newZoneGroup.dataset.index = index;
        newZoneGroup.innerHTML = `
            <input type="text" placeholder="اسم المنطقة" class="zone-name-input">
            <input type="number" placeholder="السعر (بالدنانير)" class="zone-price-input" value="1" min="1">
            <input type="number" placeholder="وقت التوصيل (بالدقائق)" class="zone-time-input" value="30" min="10">
            <button type="button" class="remove-zone-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(newZoneGroup);
    }

    saveRestaurant() {
        const form = document.getElementById('restaurantForm');
        if (!form) {
            this.showToast('النموذج غير موجود', 'error');
            return;
        }

        // Get form data
        const formData = {
            name: document.getElementById('restaurantName').value.trim()
        };

        // Validate required fields
        if (!formData.name) {
            this.showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        // Collect delivery zones data
        const deliveryZones = [];
        const zoneGroups = document.querySelectorAll('.zone-input-group');
        
        zoneGroups.forEach(group => {
            const zoneName = group.querySelector('.zone-name-input').value.trim();
            const zonePrice = parseInt(group.querySelector('.zone-price-input').value) || 1;
            const zoneTime = parseInt(group.querySelector('.zone-time-input').value) || 30;
            
            if (zoneName) {
                deliveryZones.push({
                    zone: zoneName,
                    price: zonePrice,
                    deliveryTime: zoneTime
                });
            }
        });

        // If no zones provided, add a default one
        if (deliveryZones.length === 0) {
            deliveryZones.push({
                zone: "منطقة افتراضية",
                price: 1,
                deliveryTime: 30
            });
        }

        if (this.editingRestaurantId) {
            // Update existing restaurant
            const restaurantIndex = this.restaurants.findIndex(r => r.id === this.editingRestaurantId);
            if (restaurantIndex !== -1) {
                this.restaurants[restaurantIndex] = {
                    id: this.editingRestaurantId,
                    name: formData.name,
                    deliveryZones: deliveryZones
                };
            }
        } else {
            // Create new restaurant
            const newRestaurant = {
                id: this.restaurants.length > 0 ? Math.max(...this.restaurants.map(r => r.id)) + 1 : 1,
                name: formData.name,
                deliveryZones: deliveryZones
            };
            this.restaurants.push(newRestaurant);
        }

        // Save to local storage
        this.saveRestaurantsToStorage();

        // Refresh the display
        this.renderRestaurants();

        // Close modal
        this.closeModal();

        // Show success message
        this.showToast(this.editingRestaurantId ? 'تم تحديث المطعم بنجاح!' : `تم إضافة مطعم "${formData.name}" بنجاح!`, 'success');
    }

    searchDeliveryZones(query) {
        const resultsContainer = document.getElementById('searchResults');
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }

        const results = [];
        this.restaurants.forEach(restaurant => {
            restaurant.deliveryZones.forEach(zone => {
                if (zone.zone.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        restaurant: restaurant.name,
                        zone: zone.zone,
                        price: `${zone.price} دينار`,
                        deliveryTime: `${zone.deliveryTime} دقيقة`
                    });
                }
            });
        });

        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>لم يتم العثور على مناطق توصيل لـ "${document.getElementById('zoneSearchInput').value}"</p>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = results.map(result => `
            <div class="search-result-item">
                <div class="result-header">
                    <h4 class="restaurant-name-result">${result.restaurant}</h4>
                </div>
                <div class="zone-info-result">
                    <span class="zone-name-result">${result.zone}</span>
                    <span class="zone-price-result">${result.price}</span>
                </div>
                <div class="delivery-time-result">
                    <i class="fas fa-stopwatch"></i>
                    <span>${result.deliveryTime}</span>
                </div>
            </div>
        `).join('');
    }

    clearSearchResults() {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = `
            <div class="search-placeholder">
                <i class="fas fa-search"></i>
                <p>أدخل اسم المنطقة أو الرمز البريدي للبحث عن مناطق التوصيل</p>
            </div>
        `;
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RestaurantDashboard();
});