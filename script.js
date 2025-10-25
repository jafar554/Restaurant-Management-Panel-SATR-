// Restaurant Management Dashboard JavaScript
class RestaurantDashboard {
    constructor() {
        this.restaurants = [];
        this.currentSection = 'restaurants';
        this.isAdmin = false;
        this.adminPassword = CONFIG.ADMIN.PASSWORD;
        this.isOnline = navigator.onLine;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupOfflineSupport();
        this.applyTheme();
        this.loadRestaurantsFromStorage();
        this.checkAdminMode();
        this.updateUIForUserMode();
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

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
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
            statusElement.innerHTML = `
                <i class="fas fa-circle"></i>
                <span>${this.isOnline ? 'متصل' : 'غير متصل'}</span>
            `;
            statusElement.className = this.isOnline ? 'online-status status-online' : 'online-status status-offline';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
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
    }

    updateUIForUserMode() {
        const addButton = document.getElementById('addRestaurantBtn');
        const adminButton = document.getElementById('adminLoginBtn');
        
        if (this.isAdmin) {
            addButton.style.display = 'inline-flex';
            adminButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> <span>تسجيل الخروج</span>';
            adminButton.className = 'btn btn-secondary';
        } else {
            addButton.style.display = 'none';
            adminButton.innerHTML = '<i class="fas fa-user-shield"></i> <span>تسجيل دخول المدير</span>';
            adminButton.className = 'btn btn-primary';
        }
    }

    loadRestaurantsFromStorage() {
        const savedRestaurants = localStorage.getItem(CONFIG.STORAGE.RESTAURANTS_KEY);
        if (savedRestaurants) {
            this.restaurants = JSON.parse(savedRestaurants);
        } else {
            // Load comprehensive restaurant data directly in code
            this.restaurants = [
                // Juicy & Crunchy - خلدا
                {
                    id: 1,
                    name: "جوساوي و كرنشي - خلدا",
                    deliveryZones: [
                        // Tier A (1.00-1.50 JOD / 20-30 mins)
                        { zone: "خلدا", price: 1.00, deliveryTime: 20 },
                        { zone: "دابوق", price: 1.00, deliveryTime: 22 },
                        { zone: "تلاع العلي", price: 1.00, deliveryTime: 25 },
                        { zone: "أم السماق", price: 1.00, deliveryTime: 25 },
                        { zone: "الصويفية", price: 1.00, deliveryTime: 25 },
                        { zone: "عبدون", price: 1.50, deliveryTime: 30 },
                        
                        // Tier B (1.50-2.00 JOD / 30-45 mins)
                        { zone: "دير غبار", price: 1.50, deliveryTime: 35 },
                        { zone: "الجامعة الأردنية", price: 1.50, deliveryTime: 35 },
                        { zone: "حدائق الحسين", price: 1.50, deliveryTime: 40 },
                        { zone: "الرابية", price: 1.50, deliveryTime: 40 },
                        { zone: "العبدلي", price: 1.50, deliveryTime: 40 },
                        
                        // Tier C (2.00-3.00 JOD / 45-60 mins)
                        { zone: "الشميساني", price: 2.00, deliveryTime: 50 },
                        { zone: "وادي السير", price: 2.00, deliveryTime: 55 },
                        { zone: "ماركا", price: 2.50, deliveryTime: 55 },
                        { zone: "طبربور", price: 3.00, deliveryTime: 60 }
                    ]
                },
                
                // Juicy & Crunchy - أبو نصير
                {
                    id: 2,
                    name: "جوساوي و كرنشي - أبو نصير",
                    deliveryZones: [
                        // Tier A (1.00-1.50 JOD / 20-30 mins)
                        { zone: "أبو نصير", price: 1.00, deliveryTime: 20 },
                        { zone: "شفا بدران", price: 1.00, deliveryTime: 22 },
                        { zone: "الجبية", price: 1.00, deliveryTime: 25 },
                        { zone: "ضاحية الرشيد", price: 1.00, deliveryTime: 25 },
                        { zone: "تلاع العلي الشمالي", price: 1.00, deliveryTime: 25 },
                        { zone: "النزهة", price: 1.00, deliveryTime: 30 },
                        
                        // Tier B (1.50-2.00 JOD / 30-45 mins)
                        { zone: "ماركا الشمالية", price: 1.50, deliveryTime: 35 },
                        { zone: "طبربور", price: 1.50, deliveryTime: 35 },
                        { zone: "خلدا", price: 1.50, deliveryTime: 40 },
                        { zone: "صويلح", price: 1.50, deliveryTime: 40 },
                        { zone: "ناعور", price: 1.50, deliveryTime: 40 },
                        
                        // Tier C (2.00-3.00 JOD / 45-60 mins)
                        { zone: "الرمثا", price: 2.00, deliveryTime: 50 },
                        { zone: "المفرق", price: 2.50, deliveryTime: 55 },
                        { zone: "عجلون", price: 3.00, deliveryTime: 60 }
                    ]
                },
                
                // TAKE A BITE - جبل الحسين
                {
                    id: 3,
                    name: "تايك ا بيت - جبل الحسين",
                    deliveryZones: [
                        // Tier A (1.00-1.50 JOD / 20-30 mins)
                        { zone: "جبل الحسين", price: 1.00, deliveryTime: 20 },
                        { zone: "العبدلي", price: 1.00, deliveryTime: 22 },
                        { zone: "الشميساني", price: 1.00, deliveryTime: 25 },
                        { zone: "وسط البلد", price: 1.00, deliveryTime: 25 },
                        { zone: "اللويبدة", price: 1.00, deliveryTime: 25 },
                        { zone: "جبل عمّان (الدوار 1)", price: 1.00, deliveryTime: 30 },
                        { zone: "جبل عمّان (الدوار 2)", price: 1.00, deliveryTime: 30 },
                        { zone: "جبل عمّان (الدوار 3)", price: 1.00, deliveryTime: 30 },
                        
                        // Tier B (1.50-2.00 JOD / 30-45 mins)
                        { zone: "عبدون", price: 1.50, deliveryTime: 35 },
                        { zone: "الصويفية", price: 1.50, deliveryTime: 35 },
                        { zone: "أم أذينة", price: 1.50, deliveryTime: 40 },
                        { zone: "القويسمة", price: 1.50, deliveryTime: 40 },
                        
                        // Tier C (2.00-3.00 JOD / 45-60 mins)
                        { zone: "اليرموك", price: 2.00, deliveryTime: 50 },
                        { zone: "جبل الهوس", price: 2.00, deliveryTime: 50 },
                        { zone: "الدوار الرابع", price: 2.50, deliveryTime: 55 },
                        { zone: "الدوار الخامس", price: 2.50, deliveryTime: 55 }
                    ]
                },
                
                // TAKE A BITE - جبل عمّان
                {
                    id: 4,
                    name: "تايك ا بيت - جبل عمّان",
                    deliveryZones: [
                        // Tier A (1.00-1.50 JOD / 20-30 mins)
                        { zone: "شارع الرينبو", price: 1.00, deliveryTime: 20 },
                        { zone: "الدوار الأول", price: 1.00, deliveryTime: 22 },
                        { zone: "الدوار الثاني", price: 1.00, deliveryTime: 22 },
                        { zone: "الدوار الثالث", price: 1.00, deliveryTime: 25 },
                        { zone: "عبدون", price: 1.00, deliveryTime: 25 },
                        { zone: "رغدان", price: 1.00, deliveryTime: 25 },
                        { zone: "العبدلي", price: 1.00, deliveryTime: 30 },
                        
                        // Tier B (1.50-2.00 JOD / 30-45 mins)
                        { zone: "رأس العين", price: 1.50, deliveryTime: 35 },
                        { zone: "الصويفية", price: 1.50, deliveryTime: 35 },
                        { zone: "دير غبار", price: 1.50, deliveryTime: 40 },
                        { zone: "أم أذينة", price: 1.50, deliveryTime: 40 },
                        { zone: "القويسمة", price: 1.50, deliveryTime: 40 },
                        
                        // Tier C (2.00-3.00 JOD / 45-60 mins)
                        { zone: "اليرموك", price: 2.00, deliveryTime: 50 },
                        { zone: "جبل الهوس", price: 2.00, deliveryTime: 50 },
                        { zone: "الدوار الرابع", price: 2.50, deliveryTime: 55 },
                        { zone: "الدوار الخامس", price: 2.50, deliveryTime: 55 }
                    ]
                },
                
                // UN PIZZA - مكسيم مول / جبل الحسين
                {
                    id: 5,
                    name: "أون بيتزا - مكسيم مول / جبل الحسين",
                    deliveryZones: [
                        // Tier A (1.00-1.50 JOD / 20-30 mins)
                        { zone: "جبل الحسين", price: 1.00, deliveryTime: 20 },
                        { zone: "الشميساني", price: 1.00, deliveryTime: 22 },
                        { zone: "العبدلي", price: 1.00, deliveryTime: 25 },
                        { zone: "اللويبدة", price: 1.00, deliveryTime: 25 },
                        { zone: "جبل عمّان", price: 1.00, deliveryTime: 25 },
                        { zone: "عبدون", price: 1.00, deliveryTime: 30 },
                        { zone: "الصويفية", price: 1.00, deliveryTime: 30 },
                        
                        // Tier B (1.50-2.00 JOD / 30-45 mins)
                        { zone: "أم أذينة", price: 1.50, deliveryTime: 35 },
                        { zone: "تلاع العلي", price: 1.50, deliveryTime: 35 },
                        { zone: "القويسمة", price: 1.50, deliveryTime: 40 },
                        { zone: "اليرموك", price: 1.50, deliveryTime: 40 },
                        { zone: "جبل الهوس", price: 1.50, deliveryTime: 40 },
                        
                        // Tier C (2.00-3.00 JOD / 45-60 mins)
                        { zone: "الدوار الرابع", price: 2.00, deliveryTime: 50 },
                        { zone: "الدوار الخامس", price: 2.00, deliveryTime: 50 },
                        { zone: "الدوار السادس", price: 2.50, deliveryTime: 55 },
                        { zone: "الدوار السابع", price: 2.50, deliveryTime: 55 }
                    ]
                },
                
                // Additional Restaurant - Pizza Station - عبدون
                {
                    id: 6,
                    name: "بيتزا ستاشن - عبدون",
                    deliveryZones: [
                        // Tier A (1.00-1.50 JOD / 20-30 mins)
                        { zone: "عبدون", price: 1.00, deliveryTime: 20 },
                        { zone: "الراشدية", price: 1.00, deliveryTime: 22 },
                        { zone: "جبل عمان", price: 1.00, deliveryTime: 25 },
                        { zone: "الدوار الأول", price: 1.00, deliveryTime: 25 },
                        { zone: "الدوار الثاني", price: 1.00, deliveryTime: 25 },
                        { zone: "الدوار الثالث", price: 1.00, deliveryTime: 30 },
                        
                        // Tier B (1.50-2.00 JOD / 30-45 mins)
                        { zone: "العبدلي", price: 1.50, deliveryTime: 35 },
                        { zone: "الشميساني", price: 1.50, deliveryTime: 35 },
                        { zone: "جبل الحسين", price: 1.50, deliveryTime: 40 },
                        { zone: "الصويفية", price: 1.50, deliveryTime: 40 },
                        { zone: "القويسمة", price: 1.50, deliveryTime: 40 },
                        
                        // Tier C (2.00-3.00 JOD / 45-60 mins)
                        { zone: "اليرموك", price: 2.00, deliveryTime: 50 },
                        { zone: "جبل الهوس", price: 2.00, deliveryTime: 50 },
                        { zone: "الدوار الرابع", price: 2.50, deliveryTime: 55 },
                        { zone: "الدوار الخامس", price: 2.50, deliveryTime: 55 }
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
                <h3 class="restaurant-name">${restaurant.name}</h3>
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
                    <h2 class="restaurant-name-modal">${restaurant.name}</h2>
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
        if (!restaurant) {
            this.showToast('المطعم غير موجود', 'error');
            return;
        }

        const modal = document.getElementById('restaurantModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = `تعديل ${restaurant.name}`;
        
        modalBody.innerHTML = `
            <form id="editRestaurantForm">
                <input type="hidden" id="editRestaurantId" value="${restaurant.id}">
                <div class="form-group">
                    <label for="editRestaurantName">اسم المطعم *</label>
                    <input type="text" id="editRestaurantName" value="${restaurant.name}" required>
                </div>

                <div class="form-group">
                    <label>مناطق التوصيل</label>
                    <div id="editDeliveryZonesContainer">
                        ${restaurant.deliveryZones.map((zone, index) => `
                            <div class="zone-input-group" data-index="${index}">
                                <input type="text" placeholder="اسم المنطقة" class="zone-name-input" value="${zone.zone}">
                                <input type="number" placeholder="السعر (بالدنانير)" class="zone-price-input" value="${zone.price}" min="1">
                                <input type="number" placeholder="وقت التوصيل (بالدقائق)" class="zone-time-input" value="${zone.deliveryTime}" min="10">
                                ${restaurant.deliveryZones.length > 1 ? `
                                    <button type="button" class="remove-zone-btn" onclick="this.parentElement.remove()">
                                        <i class="fas fa-times"></i>
                                    </button>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" id="addEditZoneBtn" class="btn btn-secondary">
                        <i class="fas fa-plus"></i> إضافة منطقة أخرى
                    </button>
                </div>
            </form>
        `;

        // Add footer with save/cancel buttons
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        modalFooter.innerHTML = `
            <button class="btn btn-secondary" id="cancelEditBtn">
                <i class="fas fa-times"></i> إلغاء
            </button>
            <button class="btn btn-primary" id="saveEditBtn">
                <i class="fas fa-save"></i> حفظ التغييرات
            </button>
        `;
        modalBody.appendChild(modalFooter);

        // Add event listeners
        setTimeout(() => {
            document.getElementById('addEditZoneBtn').addEventListener('click', () => {
                this.addEditDeliveryZoneInput();
            });
            
            document.getElementById('saveEditBtn').addEventListener('click', () => {
                this.saveEditedRestaurant();
            });
            
            document.getElementById('cancelEditBtn').addEventListener('click', () => {
                this.closeModal();
            });
        }, 100);

        modal.classList.add('active');
    }

    addEditDeliveryZoneInput() {
        const container = document.getElementById('editDeliveryZonesContainer');
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

    saveEditedRestaurant() {
        const form = document.getElementById('editRestaurantForm');
        if (!form) {
            this.showToast('النموذج غير موجود', 'error');
            return;
        }

        const restaurantId = parseInt(document.getElementById('editRestaurantId').value);
        const restaurantName = document.getElementById('editRestaurantName').value.trim();

        // Validate required fields
        if (!restaurantName) {
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

        // If no zones provided, show error
        if (deliveryZones.length === 0) {
            this.showToast('يجب إضافة منطقة توصيل واحدة على الأقل', 'error');
            return;
        }

        // Find and update the restaurant
        const restaurantIndex = this.restaurants.findIndex(r => r.id === restaurantId);
        if (restaurantIndex !== -1) {
            this.restaurants[restaurantIndex] = {
                id: restaurantId,
                name: restaurantName,
                deliveryZones: deliveryZones
            };
            
            // Save to local storage
            this.saveRestaurantsToStorage();
            
            // Refresh the display
            this.renderRestaurants();
            
            // Close modal
            this.closeModal();
            
            // Show success message
            this.showToast('تم تعديل معلومات المطعم بنجاح.', 'success');
        } else {
            this.showToast('حدث خطأ أثناء الحفظ، حاول مرة أخرى.', 'error');
        }
    }

    deleteRestaurant(restaurantId) {
        if (!confirm('هل أنت متأكد من حذف هذا المطعم؟ هذا الإجراء لا يمكن التراجع عنه.')) {
            return;
        }

        const restaurant = this.restaurants.find(r => r.id === restaurantId);
        if (!restaurant) {
            this.showToast('المطعم غير موجود', 'error');
            return;
        }

        this.restaurants = this.restaurants.filter(r => r.id !== restaurantId);
        this.saveRestaurantsToStorage();
        this.renderRestaurants();
        this.showToast('تم حذف المطعم بنجاح.', 'success');
    }

    openRestaurantModal() {
        const modal = document.getElementById('restaurantModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = 'إضافة مطعم جديد';
        modalBody.innerHTML = `
            <form id="addRestaurantForm">
                <div class="form-group">
                    <label for="newRestaurantName">اسم المطعم *</label>
                    <input type="text" id="newRestaurantName" placeholder="أدخل اسم المطعم" required>
                </div>

                <div class="form-group">
                    <label>مناطق التوصيل</label>
                    <div id="newDeliveryZonesContainer">
                        <div class="zone-input-group">
                            <input type="text" placeholder="اسم المنطقة" class="zone-name-input" required>
                            <input type="number" placeholder="أدخل سعر التوصيل" class="zone-price-input" value="1" min="1" required>
                            <input type="number" placeholder="أدخل وقت التوصيل" class="zone-time-input" value="30" min="10" required>
                        </div>
                    </div>
                    <button type="button" id="addNewZoneBtn" class="btn btn-secondary">
                        <i class="fas fa-plus"></i> إضافة منطقة توصيل أخرى
                    </button>
                </div>
            </form>
        `;

        // Add footer with save/cancel buttons
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        modalFooter.innerHTML = `
            <button class="btn btn-secondary" id="cancelAddBtn">
                <i class="fas fa-times"></i> إلغاء
            </button>
            <button class="btn btn-primary" id="saveAddBtn">
                <i class="fas fa-plus"></i> إضافة المطعم
            </button>
        `;
        modalBody.appendChild(modalFooter);

        // Add event listeners
        setTimeout(() => {
            document.getElementById('addNewZoneBtn').addEventListener('click', () => {
                this.addNewDeliveryZoneInput();
            });
            
            document.getElementById('saveAddBtn').addEventListener('click', () => {
                this.saveNewRestaurant();
            });
            
            document.getElementById('cancelAddBtn').addEventListener('click', () => {
                this.closeModal();
            });
        }, 100);

        modal.classList.add('active');
    }

    addNewDeliveryZoneInput() {
        const container = document.getElementById('newDeliveryZonesContainer');
        const newZoneGroup = document.createElement('div');
        newZoneGroup.className = 'zone-input-group';
        newZoneGroup.innerHTML = `
            <input type="text" placeholder="اسم المنطقة" class="zone-name-input" required>
            <input type="number" placeholder="أدخل سعر التوصيل" class="zone-price-input" value="1" min="1" required>
            <input type="number" placeholder="أدخل وقت التوصيل" class="zone-time-input" value="30" min="10" required>
            <button type="button" class="remove-zone-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(newZoneGroup);
    }

    saveNewRestaurant() {
        const form = document.getElementById('addRestaurantForm');
        if (!form) {
            this.showToast('النموذج غير موجود', 'error');
            return;
        }

        const restaurantName = document.getElementById('newRestaurantName').value.trim();

        // Validate required fields
        if (!restaurantName) {
            this.showToast('يرجى إدخال اسم المطعم', 'error');
            return;
        }

        // Collect delivery zones data
        const deliveryZones = [];
        const zoneGroups = document.querySelectorAll('.zone-input-group');
        
        let hasEmptyFields = false;
        zoneGroups.forEach(group => {
            const zoneName = group.querySelector('.zone-name-input').value.trim();
            const zonePrice = parseInt(group.querySelector('.zone-price-input').value);
            const zoneTime = parseInt(group.querySelector('.zone-time-input').value);
            
            if (!zoneName || isNaN(zonePrice) || isNaN(zoneTime)) {
                hasEmptyFields = true;
                return;
            }
            
            deliveryZones.push({
                zone: zoneName,
                price: zonePrice,
                deliveryTime: zoneTime
            });
        });

        // If any fields are empty, show error
        if (hasEmptyFields) {
            this.showToast('يرجى ملء جميع حقول مناطق التوصيل', 'error');
            return;
        }

        // If no zones provided, show error
        if (deliveryZones.length === 0) {
            this.showToast('يجب إضافة منطقة توصيل واحدة على الأقل', 'error');
            return;
        }

        // Create new restaurant object
        const newRestaurant = {
            id: this.restaurants.length > 0 ? Math.max(...this.restaurants.map(r => r.id)) + 1 : 1,
            name: restaurantName,
            deliveryZones: deliveryZones
        };

        // Add to restaurants array
        this.restaurants.push(newRestaurant);

        // Save to local storage
        this.saveRestaurantsToStorage();

        // Refresh the display
        this.renderRestaurants();

        // Close modal
        this.closeModal();

        // Show success message
        this.showToast('تمت إضافة المطعم بنجاح.', 'success');
    }

    closeModal() {
        const modal = document.getElementById('restaurantModal');
        modal.classList.remove('active');
    }

    setupModalEventListeners() {
        // Use event delegation for dynamically created buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'saveRestaurantBtn') {
                this.saveRestaurant();
            }
        });
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
                <h3 class="restaurant-name-result">${result.restaurant}</h3>
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
    
    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});