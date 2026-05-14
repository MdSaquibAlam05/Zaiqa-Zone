// const API = 'http://localhost:5000/api';
const API = '/api';
let dishes = [];
let cart = JSON.parse(localStorage.getItem('zaiqa_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('zaiqa_user')) || null;
let currentFilter = 'All';

// ============ INIT ============
updateUI();
fetchDishes();

async function fetchDishes() {
  try {
    const res = await fetch(`${API}/dishes`);
    dishes = await res.json();
    renderDishes();
  } catch (err) {
    const grid = document.getElementById('dishGrid');
    if (grid) grid.innerHTML = '<div style="text-align:center;padding:3rem;grid-column:1/-1;color:white;">❌ Cannot connect to server. Run: npm run dev</div>';
  }
}

// ============ RENDER DISHES ============
function renderDishes(filtered = null) {
  const data = filtered || dishes;
  const finalData = currentFilter === 'All' ? data : data.filter(d => d.category === currentFilter);
  
  const grid = document.getElementById('dishGrid');
  if (!grid) return;
  
  if (finalData.length === 0) {
    grid.innerHTML = '<div style="text-align:center;padding:3rem;grid-column:1/-1;color:var(--text-muted);">No dishes found</div>';
    return;
  }

  const isAdmin = currentUser && currentUser.role === 'admin';

  grid.innerHTML = finalData.map(d => `
    <div class="dish-card" onclick="showDishDetail('${d._id}')" style="cursor:pointer;">
      <img src="${d.image}" alt="${d.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'">
      <div class="dish-info">
        <span class="dish-type ${d.type === 'veg' ? 'veg' : 'non-veg'}">${d.type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}</span>
        <div class="dish-name">${d.name}</div>
        <div class="dish-meta">🏪 ${d.restaurant} | ⭐ ${d.rating} | ⏱️ ${d.prepTime}</div>
        <div class="dish-footer">
          <span class="dish-price">₹${d.price}</span>
          ${!isAdmin ? `<button class="btn btn-primary" onclick="addToCart('${d._id}')">🛒 Add</button>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// ============ FILTERS ============
function filterCategory(cat) {
  currentFilter = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderDishes();
}

function searchDishes(query) {
  if (!query) { renderDishes(); return; }
  const filtered = dishes.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.restaurant.toLowerCase().includes(query.toLowerCase())
  );
  renderDishes(filtered);
}

// ============ CART ============
function addToCart(dishId) {
  if (currentUser && currentUser.role === 'admin') {
    showToast('❌ Admins cannot place orders! Use admin panel.');
    return;
  }

  const dish = dishes.find(d => d._id === dishId);
  if (!dish) return;
  
  const existing = cart.find(i => i._id === dishId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...dish, qty: 1 });
  }
  
  localStorage.setItem('zaiqa_cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${dish.name} added to cart! 🛒`);
}

function updateCartCount() {
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

// ============ CART MODAL ============
function openCart() {
  if (currentUser && currentUser.role === 'admin') {
    showToast('❌ Admins cannot place orders!');
    return;
  }

  const modal = document.getElementById('cartModal');
  if (!modal) return;
  modal.classList.add('show');
  renderCartItems();
}

function closeCartModal() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.remove('show');
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:2rem;">🛒 Cart is empty</p>';
    if (totalEl) totalEl.textContent = '₹0';
    return;
  }
  
  let total = 0;
  container.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    return `
      <div style="display:flex; gap:1rem; align-items:center; padding:1rem; border-bottom:1px solid rgba(255,255,255,0.1);">
        <img src="${item.image}" style="width:60px; height:60px; border-radius:10px; object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'">
        <div style="flex:1;">
          <strong style="color:white;">${item.name}</strong>
          <p style="color:var(--text-muted); font-size:0.85rem;">₹${item.price} × ${item.qty}</p>
        </div>
        <div style="display:flex; gap:0.3rem; align-items:center;">
          <button class="btn btn-outline" style="padding:0.3rem 0.7rem; font-size:0.8rem;" onclick="updateQty('${item._id}', -1)">−</button>
          <span style="color:white;">${item.qty}</span>
          <button class="btn btn-outline" style="padding:0.3rem 0.7rem; font-size:0.8rem;" onclick="updateQty('${item._id}', 1)">+</button>
          <button class="btn btn-danger" style="padding:0.3rem 0.7rem; font-size:0.8rem;" onclick="removeFromCart('${item._id}')">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
  
  if (totalEl) totalEl.textContent = '₹' + total;
}

function updateQty(dishId, delta) {
  const item = cart.find(i => i._id === dishId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i._id !== dishId);
  localStorage.setItem('zaiqa_cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

function removeFromCart(dishId) {
  cart = cart.filter(i => i._id !== dishId);
  localStorage.setItem('zaiqa_cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// ============ PLACE ORDER ============
async function placeOrder() {
  if (currentUser && currentUser.role === 'admin') {
    closeCartModal();
    showToast('❌ Admins cannot place orders!');
    return;
  }

  if (!currentUser) {
    closeCartModal();
    showToast('Please login first! 🔐');
    setTimeout(() => window.location.href = '/login', 1000);
    return;
  }
  
  if (cart.length === 0) {
    showToast('Cart is empty!');
    return;
  }
  
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  
  try {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`
      },
      body: JSON.stringify({
        items: cart.map(i => ({ 
          name: i.name, 
          price: i.price, 
          quantity: i.qty, 
          image: i.image 
        })),
        totalAmount: total,
        paymentMethod: 'cod'
      })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      const orderData = data;
      cart = [];
      localStorage.setItem('zaiqa_cart', JSON.stringify(cart));
      updateCartCount();
      closeCartModal();
      
      const savedOrders = JSON.parse(localStorage.getItem('zaiqa_orders') || '[]');
      savedOrders.unshift({
        id: orderData._id,
        items: orderData.items,
        total: orderData.totalAmount,
        status: orderData.status,
        date: new Date().toLocaleString()
      });
      localStorage.setItem('zaiqa_orders', JSON.stringify(savedOrders));
      
      showReceipt(orderData);
      showToast('🎉 Order placed successfully!');
      
      setTimeout(() => {
        if (confirm('View your orders?')) {
          window.location.href = '/orders';
        }
      }, 1500);
    } else {
      showToast('❌ ' + (data.message || 'Order failed'));
    }
  } catch (err) {
    console.error('Order Error:', err);
    showToast('❌ Server error! Check terminal.');
  }
}

// ============ RECEIPT ============
function showReceipt(order) {
  const receiptHTML = `
    <div style="background:white; color:black; padding:2rem; max-width:400px; margin:0 auto; border-radius:10px; font-family:'Courier New', monospace;">
      <h2 style="text-align:center; color:#E23744; margin-bottom:1rem;">🧾 Zaiqa Zone</h2>
      <p style="text-align:center; font-size:0.9rem; margin-bottom:1rem;">Order Receipt</p>
      <hr>
      <p><strong>Order ID:</strong> #${order._id.slice(-8).toUpperCase()}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <hr>
      <table style="width:100%; margin:1rem 0;">
        <thead><tr style="border-bottom:1px solid #ccc;"><th style="text-align:left;">Item</th><th>Qty</th><th style="text-align:right;">Price</th></tr></thead>
        <tbody>${order.items.map(i => `<tr><td>${i.name}</td><td style="text-align:center;">${i.quantity}</td><td style="text-align:right;">₹${i.price * i.quantity}</td></tr>`).join('')}</tbody>
      </table>
      <hr>
      <div style="text-align:right; font-size:1.2rem; font-weight:bold; margin:1rem 0;">Total: ₹${order.totalAmount}</div>
      <p style="text-align:center; font-size:0.8rem; margin-top:1rem;">Payment: ${order.paymentMethod?.toUpperCase() || 'COD'}</p>
      <p style="text-align:center; color:#10b981; font-weight:bold;">Status: ${order.status?.toUpperCase()}</p>
      <p style="text-align:center; margin-top:2rem; font-size:0.9rem;">Thank you for ordering! 🍽️</p>
    </div>
  `;

  const receiptModal = document.createElement('div');
  receiptModal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;justify-content:center;align-items:center;padding:1rem;';
  receiptModal.innerHTML = `
    <div style="max-width:450px; width:100%; position:relative;">
      ${receiptHTML}
      <div style="display:flex; gap:1rem; margin-top:1rem; justify-content:center;">
        <button class="btn btn-primary" onclick="printReceipt()">🖨️ Print</button>
        <button class="btn btn-outline" onclick="closeReceipt()">Close</button>
      </div>
    </div>
  `;
  receiptModal.id = 'receiptModal';
  document.body.appendChild(receiptModal);
  window._receiptContent = receiptHTML;
}

function printReceipt() {
  const printWindow = window.open('', '_blank', 'width=450,height=600');
  printWindow.document.write(`<!DOCTYPE html><html><head><title>Zaiqa Zone - Receipt</title><style>body{font-family:'Courier New',monospace;padding:20px;}@media print{body{margin:0;}}</style></head><body>${window._receiptContent || ''}<script>window.onload=function(){window.print();}</script></body></html>`);
  printWindow.document.close();
}

function closeReceipt() {
  const modal = document.getElementById('receiptModal');
  if (modal) modal.remove();
}

// ============ BOOKING ============
function openBooking() {
  if (currentUser && currentUser.role === 'admin') {
    showToast('❌ Admins cannot book tables!');
    return;
  }

  if (!currentUser) {
    showToast('Please login first! 🔐');
    setTimeout(() => window.location.href = '/login', 1000);
    return;
  }
  
  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) dateInput.min = today;
  
  // Reset guests
  currentGuests = 2;
  updateGuestDisplay();
  
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.add('show');
}

let currentGuests = 2;

function changeGuests(delta) {
  currentGuests += delta;
  if (currentGuests < 1) currentGuests = 1;
  if (currentGuests > 20) currentGuests = 20;
  updateGuestDisplay();
}

function updateGuestDisplay() {
  const display = document.getElementById('guestCount');
  if (display) display.textContent = currentGuests;
}

function updateRestaurantPreview() {
  const select = document.getElementById('bookingRestaurant');
  const preview = document.getElementById('restaurantPreview');
  const img = document.getElementById('restaurantPreviewImg');
  
  if (select.value && select.selectedOptions[0].dataset.image) {
    img.src = select.selectedOptions[0].dataset.image;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
}

//--------CONFIRM BOOKING-----------

async function confirmBooking() {
  // Get all values from form
  const restaurant = document.getElementById('bookingRestaurant')?.value;
  const date = document.getElementById('bookingDate')?.value;
  const time = document.getElementById('bookingTime')?.value;
  const guests = currentGuests || 2;
  const occasion = document.getElementById('bookingOccasion')?.value || 'none';
  const seating = document.getElementById('bookingSeating')?.value || 'indoor';
  const specialRequest = document.getElementById('bookingRequest')?.value || '';
  
  // Validate required fields
  if (!restaurant) {
    return showToast('❌ Please select a restaurant!');
  }
  if (!date) {
    return showToast('❌ Please select a date!');
  }
  if (!time) {
    return showToast('❌ Please select a time!');
  }
  
  // Show loading toast
  showToast('📅 Booking your table...');
  
  try {
    // Send booking to backend
    const res = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`
      },
      body: JSON.stringify({ 
        restaurant: restaurant, 
        date: date, 
        time: time, 
        guests: guests, 
        occasion: occasion,
        seating: seating,
        specialRequest: specialRequest
      })
    });
    
    // Parse response
    const data = await res.json();
    
    // Check if successful
    if (res.ok && data) {
      // Close booking modal
      closeModal('bookingModal');
      
      // Show premium receipt
      showBookingReceipt({
        restaurant: restaurant,
        date: date,
        time: time,
        guests: guests,
        occasion: occasion,
        seating: seating,
        specialRequest: specialRequest
      });
      
      showToast('✅ Table booked successfully! 🎉');
    } else {
      // Show error from server
      const errorMsg = data?.message || 'Booking failed. Please try again.';
      showToast('❌ ' + errorMsg);
      console.error('Booking failed:', data);
    }
  } catch (err) {
    // Show network error
    console.error('Network error:', err);
    showToast('❌ Server not responding! Is backend running?');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('show');
}



// ============ QUICK ORDER ============
function quickOrder() {
  if (currentUser && currentUser.role === 'admin') {
    showToast('❌ Admins cannot order! Go to Admin Panel.');
    setTimeout(() => window.location.href = '/admin', 1000);
    return;
  }

  if (!currentUser) {
    showToast('Please login first! 🔐');
    setTimeout(() => window.location.href = '/login', 1000);
    return;
  }
  
  const dishesSection = document.getElementById('dishGrid');
  if (dishesSection) dishesSection.scrollIntoView({ behavior: 'smooth' });
  showToast('👇 Click "Add" on any dish to start ordering!');
}

// ============ UI ============
// ============ UI ============
function updateUI() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminBtn = document.getElementById('adminBtn');
  const adminMsg = document.getElementById('adminMessage');
  const cartNavBtn = document.getElementById('cartNavBtn');
  const bookingNavBtn = document.getElementById('bookingNavBtn');
  const ordersNavLink = document.getElementById('ordersNavLink');
  const loginLink = document.getElementById('loginLink');
  const adminLink = document.getElementById('adminLink');
  const heroOrderBtn = document.getElementById('heroOrderBtn');
  const heroBookBtn = document.getElementById('heroBookBtn');
  
  if (currentUser) {
    // ===== USER LOGGED IN =====
    if (loginBtn) loginBtn.style.display = 'none';
    if (loginLink) loginLink.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (ordersNavLink) ordersNavLink.style.display = 'inline-block';
    
    if (currentUser.role === 'admin') {
      // ===== ADMIN USER =====
      if (cartNavBtn) cartNavBtn.style.display = 'none';
      if (bookingNavBtn) bookingNavBtn.style.display = 'none';
      if (ordersNavLink) ordersNavLink.style.display = 'none';
      if (heroOrderBtn) heroOrderBtn.style.display = 'none';
      if (heroBookBtn) heroBookBtn.style.display = 'none';
      if (adminBtn) adminBtn.style.display = 'inline-block';
      if (adminLink) adminLink.style.display = 'inline-block';
      if (adminMsg) adminMsg.style.display = 'block';
    } else {
      // ===== NORMAL USER =====
      if (cartNavBtn) cartNavBtn.style.display = 'inline-block';
      if (bookingNavBtn) bookingNavBtn.style.display = 'inline-block';
      if (heroOrderBtn) heroOrderBtn.style.display = 'inline-block';
      if (heroBookBtn) heroBookBtn.style.display = 'inline-block';
      if (adminBtn) adminBtn.style.display = 'none';
      if (adminLink) adminLink.style.display = 'none';
      if (adminMsg) adminMsg.style.display = 'none';
    }
  } else {
    // ===== NO USER LOGGED IN =====
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (loginLink) loginLink.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (cartNavBtn) cartNavBtn.style.display = 'none';
    if (bookingNavBtn) bookingNavBtn.style.display = 'none';
    if (ordersNavLink) ordersNavLink.style.display = 'none';
    if (heroOrderBtn) heroOrderBtn.style.display = 'none';
    if (heroBookBtn) heroBookBtn.style.display = 'none';
    if (adminBtn) adminBtn.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';
    if (adminMsg) adminMsg.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('zaiqa_user');
  window.location.href = '/';
}

// ============ TOAST ============
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}


// ============ BOOKING RECEIPT MODAL ============
function showBookingReceipt(booking) {
  const seatingMap = {
    indoor: '🏠 Indoor', outdoor: '🌿 Outdoor',
    rooftop: '🌇 Rooftop', private: '🔒 Private Room'
  };
  
  const occasionMap = {
    birthday: '🎂 Birthday', anniversary: '💑 Anniversary',
    date_night: '🌹 Date Night', business: '💼 Business',
    party: '🎊 Party', none: ''
  };

  const html = `
    <div style="background:#1a1a2e; padding:2rem; border-radius:20px; max-width:450px; border:2px solid #7C3AED; color:white; font-family:'Segoe UI',sans-serif;">
      <div style="text-align:center; margin-bottom:1.5rem;">
        <div style="font-size:3rem;">🍽️</div>
        <h2 style="color:#E23744;">Zaiqa Zone</h2>
        <p style="color:#a0a0b0;">Table Booking Confirmation</p>
      </div>
      <div style="background:rgba(255,255,255,0.05); border-radius:15px; padding:1.5rem;">
        <p style="font-size:1.2rem; font-weight:700;">🏪 ${booking.restaurant}</p>
        <hr style="border-color:rgba(255,255,255,0.1); margin:1rem 0;">
        <p>📅 <strong>${new Date(booking.date).toDateString()}</strong></p>
        <p>🕐 <strong>${booking.time}</strong></p>
        <p>👥 <strong>${booking.guests} Guests</strong></p>
        <p>💺 <strong>${seatingMap[booking.seating] || booking.seating}</strong></p>
        ${booking.occasion !== 'none' ? `<p>🎉 <strong>${occasionMap[booking.occasion]}</strong></p>` : ''}
        ${booking.specialRequest ? `<p style="font-style:italic;">📝 "${booking.specialRequest}"</p>` : ''}
      </div>
      <div style="text-align:center; margin-top:1rem; background:rgba(16,185,129,0.2); padding:0.8rem; border-radius:50px;">
        <span style="color:#10b981; font-weight:700;">✅ CONFIRMED</span>
      </div>
    </div>
  `;

  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;justify-content:center;align-items:center;padding:1rem;';
  modal.innerHTML = `
    <div style="max-width:480px; width:100%;">
      ${html}
      <div style="display:flex; gap:1rem; margin-top:1rem; justify-content:center;">
        <button style="background:#E23744; color:white; border:none; padding:0.8rem 2rem; border-radius:50px; font-weight:700; cursor:pointer; font-size:1rem;" onclick="printReceiptModal()">🖨️ Print</button>
      <button style="background:rgba(255,255,255,0.1); color:white; border:2px solid rgba(255,255,255,0.3); padding:0.8rem 2rem; border-radius:50px; font-weight:700; cursor:pointer; font-size:1rem;" onclick="closeReceiptModal()">Close</button>
        </div>
    </div>
  `;
  modal.id = 'receiptModal';
  document.body.appendChild(modal);
}

// ============ CLOSE RECEIPT MODAL ============
function closeReceiptModal() {
  const modal = document.getElementById('receiptModal');
  if (modal) {
    modal.remove();
  }
}

// ============ PRINT RECEIPT ============
function printReceiptModal() {
  const modal = document.getElementById('receiptModal');
  if (!modal) return;
  
  const receiptContent = modal.querySelector('div > div').innerHTML;
  
  const printWindow = window.open('', '_blank', 'width=500,height=600');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Zaiqa Zone - Booking Receipt</title>
      <style>
        body { 
          font-family: 'Segoe UI', sans-serif; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 100vh; 
          background: #1a1a2e; 
          margin: 0; 
          padding: 20px;
        }
        @media print {
          body { background: white; }
        }
      </style>
    </head>
    <body>${receiptContent}</body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
}


// ============ DISH DETAIL MODAL ============
let currentDetailDishId = null;
let detailQty = 1;

function showDishDetail(dishId) {
  currentDetailDishId = dishId;
  const dish = dishes.find(d => d._id === dishId);
  
  if (!dish) {
    showToast('❌ Dish not found!');
    return;
  }
  
  detailQty = 1;
  
  const related = dishes.filter(d => d.category === dish.category && d._id !== dishId).slice(0, 4);
  
  const existingModal = document.getElementById('dishDetailModal');
  if (existingModal) existingModal.remove();
  
  const modal = document.createElement('div');
  modal.id = 'dishDetailModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:5000;display:flex;justify-content:center;align-items:center;padding:1rem;';
  
  modal.innerHTML = '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e); border-radius:24px; max-width:550px; width:100%; max-height:90vh; overflow-y:auto; border:2px solid rgba(255,255,255,0.2); position:relative;">' +
    '<button style="position:absolute; top:1rem; right:1rem; background:rgba(0,0,0,0.6); color:white; border:none; width:35px; height:35px; border-radius:50%; font-size:1.2rem; cursor:pointer; z-index:10;" onclick="closeDishDetail()">✕</button>' +
    '<img src="' + dish.image + '" alt="' + dish.name + '" style="width:100%; height:250px; object-fit:cover; border-radius:24px 24px 0 0;" onerror="this.src=\'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600\'">' +
    '<div style="padding:1.5rem;">' +
      '<h2 style="font-size:1.5rem; margin-bottom:0.3rem; color:white;">' + dish.name + '</h2>' +
      '<p style="color:#a0a0b0; margin-bottom:1rem;">🏪 ' + dish.restaurant + '</p>' +
      '<div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">' +
        '<span style="padding:0.3rem 0.8rem; border-radius:50px; font-size:0.75rem; font-weight:700; background:' + (dish.type === 'veg' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)') + '; color:' + (dish.type === 'veg' ? '#6EE7B7' : '#FCA5A5') + ';">' + (dish.type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg') + '</span>' +
        '<span style="padding:0.3rem 0.8rem; border-radius:50px; font-size:0.75rem; font-weight:700; background:rgba(250,204,21,0.2); color:#FFD700;">⭐ ' + dish.rating + '</span>' +
        '<span style="padding:0.3rem 0.8rem; border-radius:50px; font-size:0.75rem; font-weight:700; background:rgba(59,130,246,0.2); color:#93C5FD;">⏱️ ' + dish.prepTime + '</span>' +
      '</div>' +
      (dish.description ? '<p style="margin:1rem 0; line-height:1.6; color:#a0a0b0;">📝 ' + dish.description + '</p>' : '') +
      '<div style="display:flex; justify-content:space-between; align-items:center; margin:1.5rem 0;">' +
        '<span style="font-size:2rem; font-weight:800; color:#FFD700;">₹' + dish.price + '</span>' +
      '</div>' +
      (!currentUser || currentUser.role !== 'admin' ? 
        '<div style="display:flex; align-items:center; gap:1rem; background:rgba(255,255,255,0.05); padding:0.8rem; border-radius:12px; margin:1rem 0;">' +
          '<span style="color:#a0a0b0;">Qty:</span>' +
          '<button onclick="changeDetailQty(-1)" style="width:35px; height:35px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); background:transparent; color:white; font-size:1.2rem; cursor:pointer;">−</button>' +
          '<span id="detailQtyDisplay" style="font-size:1.3rem; font-weight:700; color:#FFD700; min-width:40px; text-align:center;">1</span>' +
          '<button onclick="changeDetailQty(1)" style="width:35px; height:35px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); background:transparent; color:white; font-size:1.2rem; cursor:pointer;">+</button>' +
          '<span style="margin-left:auto; color:#FFD700; font-weight:700;" id="detailTotal">₹' + dish.price + '</span>' +
        '</div>' +
        '<button onclick="addToCartFromDetail(\'' + dish._id + '\')" style="width:100%; padding:1rem; background:#E23744; color:white; border:none; border-radius:50px; font-weight:700; font-size:1.1rem; cursor:pointer;">🛒 Add to Cart — ₹<span id="detailBtnPrice">' + dish.price + '</span></button>'
      : '<p style="text-align:center; color:#7C3AED; margin:1rem 0;">⚙️ Admin cannot order</p>') +
    '</div>' +
    (related.length > 0 ? 
      '<div style="padding:1.5rem; border-top:1px solid rgba(255,255,255,0.1);">' +
        '<h3 style="margin-bottom:1rem; color:white;">🍽️ More in ' + dish.category + '</h3>' +
        '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:0.5rem;">' +
          related.map(function(r) {
            return '<div style="cursor:pointer; text-align:center;" onclick="closeDishDetail(); setTimeout(function(){showDishDetail(\'' + r._id + '\')},300)">' +
              '<img src="' + r.image + '" style="width:100%; height:60px; object-fit:cover; border-radius:10px;" onerror="this.src=\'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100\'">' +
              '<p style="font-size:0.65rem; margin-top:0.2rem; color:#a0a0b0;">' + r.name + '</p>' +
              '<p style="font-size:0.7rem; font-weight:700; color:#FFD700;">₹' + r.price + '</p>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' 
    : '') +
  '</div>';
  
  document.body.appendChild(modal);
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeDishDetail();
  });
}

function changeDetailQty(delta) {
  detailQty += delta;
  if (detailQty < 1) detailQty = 1;
  if (detailQty > 10) detailQty = 10;
  
  const dish = dishes.find(function(d) { return d._id === currentDetailDishId; });
  if (!dish) return;
  
  var qtyDisplay = document.getElementById('detailQtyDisplay');
  var totalDisplay = document.getElementById('detailTotal');
  var btnPrice = document.getElementById('detailBtnPrice');
  
  if (qtyDisplay) qtyDisplay.textContent = detailQty;
  if (totalDisplay) totalDisplay.textContent = '₹' + (dish.price * detailQty);
  if (btnPrice) btnPrice.textContent = '₹' + (dish.price * detailQty);
}

function addToCartFromDetail(dishId) {
  var dish = dishes.find(function(d) { return d._id === dishId; });
  if (!dish) return;
  
  if (currentUser && currentUser.role === 'admin') {
    showToast('❌ Admins cannot order!');
    return;
  }
  
  var existing = cart.find(function(i) { return i._id === dishId; });
  if (existing) {
    existing.qty += detailQty;
  } else {
    cart.push({ 
      _id: dish._id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      qty: detailQty 
    });
  }
  
  localStorage.setItem('zaiqa_cart', JSON.stringify(cart));
  updateCartCount();
  closeDishDetail();
  showToast('✅ ' + dish.name + ' ×' + detailQty + ' added to cart! 🛒');
}

function closeDishDetail() {
  var modal = document.getElementById('dishDetailModal');
  if (modal) modal.remove();
  detailQty = 1;
}

// ============ REVIEW SYSTEM ============
let selectedRating = 0;

function loadReviews(dishId) {
  var container = document.getElementById('reviewsContainer');
  if (!container) return;

  fetch(API + '/reviews/dish/' + dishId)
    .then(function(res) { return res.json(); })
    .then(function(reviews) {
      if (reviews.length === 0) {
        container.innerHTML = '<p style="color:#a0a0b0; text-align:center; padding:1rem;">No reviews yet. Be the first! ⭐</p>';
        return;
      }

      container.innerHTML = reviews.map(function(r) {
        var stars = '';
        for (var i = 1; i <= 5; i++) {
          stars += i <= r.rating ? '⭐' : '☆';
        }
        var date = new Date(r.createdAt).toLocaleDateString();
        
        return '<div class="review-card">' +
          '<div class="review-header">' +
            '<span class="review-user">👤 ' + (r.userName || r.user?.name || 'Anonymous') + '</span>' +
            '<span class="review-date">' + date + '</span>' +
          '</div>' +
          '<div class="review-stars">' + stars + '</div>' +
          '<p class="review-comment">' + r.comment + '</p>' +
        '</div>';
      }).join('');
    })
    .catch(function(err) {
      container.innerHTML = '<p style="color:#a0a0b0; text-align:center;">Failed to load reviews</p>';
    });
}

function submitReview() {
  if (!currentUser) {
    showToast('❌ Please login to review!');
    return;
  }

  if (currentUser.role === 'admin') {
    showToast('❌ Admins cannot review!');
    return;
  }

  var comment = document.getElementById('reviewComment').value.trim();
  
  if (!selectedRating) {
    showToast('❌ Please select a rating!');
    return;
  }
  
  if (!comment) {
    showToast('❌ Please write a comment!');
    return;
  }

  fetch(API + '/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + currentUser.token
    },
    body: JSON.stringify({
      dishId: currentDetailDishId,
      rating: selectedRating,
      comment: comment
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data._id) {
      showToast('✅ Review added!');
      document.getElementById('reviewComment').value = '';
      selectedRating = 0;
      updateStarDisplay();
      loadReviews(currentDetailDishId);
    } else {
      showToast('❌ ' + (data.message || 'Failed to add review'));
    }
  })
  .catch(function(err) {
    showToast('❌ Server error!');
  });
}

function setRating(rating) {
  selectedRating = rating;
  updateStarDisplay();
}

function updateStarDisplay() {
  var stars = document.querySelectorAll('.star');
  stars.forEach(function(star, index) {
    if (index < selectedRating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

function showDishDetail(dishId) {
  currentDetailDishId = dishId;
  const dish = dishes.find(d => d._id === dishId);
  
  if (!dish) {
    showToast('❌ Dish not found!');
    return;
  }
  
  detailQty = 1;
  
  const related = dishes.filter(d => d.category === dish.category && d._id !== dishId).slice(0, 4);
  
  const existingModal = document.getElementById('dishDetailModal');
  if (existingModal) existingModal.remove();
  
  const modal = document.createElement('div');
  modal.id = 'dishDetailModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:5000;display:flex;justify-content:center;align-items:center;padding:1rem;';
  
  modal.innerHTML = 
    '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e); border-radius:24px; max-width:550px; width:100%; max-height:90vh; overflow-y:auto; border:2px solid rgba(255,255,255,0.2); position:relative;">' +
    
    // Close button
    '<button style="position:absolute; top:1rem; right:1rem; background:rgba(0,0,0,0.6); color:white; border:none; width:35px; height:35px; border-radius:50%; font-size:1.2rem; cursor:pointer; z-index:10;" onclick="closeDishDetail()">✕</button>' +
    
    // Image
    '<img src="' + dish.image + '" alt="' + dish.name + '" style="width:100%; height:250px; object-fit:cover; border-radius:24px 24px 0 0;" onerror="this.src=\'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600\'">' +
    
    // Body
    '<div style="padding:1.5rem;">' +
      '<h2 style="font-size:1.5rem; margin-bottom:0.3rem; color:white;">' + dish.name + '</h2>' +
      '<p style="color:#a0a0b0; margin-bottom:1rem;">🏪 ' + dish.restaurant + '</p>' +
      
      // Tags
      '<div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">' +
        '<span style="padding:0.3rem 0.8rem; border-radius:50px; font-size:0.75rem; font-weight:700; background:' + (dish.type === 'veg' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)') + '; color:' + (dish.type === 'veg' ? '#6EE7B7' : '#FCA5A5') + ';">' + (dish.type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg') + '</span>' +
        '<span style="padding:0.3rem 0.8rem; border-radius:50px; font-size:0.75rem; font-weight:700; background:rgba(250,204,21,0.2); color:#FFD700;">⭐ ' + dish.rating + '</span>' +
        '<span style="padding:0.3rem 0.8rem; border-radius:50px; font-size:0.75rem; font-weight:700; background:rgba(59,130,246,0.2); color:#93C5FD;">⏱️ ' + dish.prepTime + '</span>' +
      '</div>' +
      
      // Description
      (dish.description ? '<p style="margin:1rem 0; line-height:1.6; color:#a0a0b0;">📝 ' + dish.description + '</p>' : '') +
      
      // Price
      '<div style="display:flex; justify-content:space-between; align-items:center; margin:1.5rem 0;">' +
        '<span style="font-size:2rem; font-weight:800; color:#FFD700;">₹' + dish.price + '</span>' +
      '</div>' +
      
      // Quantity + Add to Cart (only for non-admin)
      (!currentUser || currentUser.role !== 'admin' ? 
        '<div style="display:flex; align-items:center; gap:1rem; background:rgba(255,255,255,0.05); padding:0.8rem; border-radius:12px; margin:1rem 0;">' +
          '<span style="color:#a0a0b0;">Qty:</span>' +
          '<button onclick="changeDetailQty(-1)" style="width:35px; height:35px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); background:transparent; color:white; font-size:1.2rem; cursor:pointer;">−</button>' +
          '<span id="detailQtyDisplay" style="font-size:1.3rem; font-weight:700; color:#FFD700; min-width:40px; text-align:center;">1</span>' +
          '<button onclick="changeDetailQty(1)" style="width:35px; height:35px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); background:transparent; color:white; font-size:1.2rem; cursor:pointer;">+</button>' +
          '<span style="margin-left:auto; color:#FFD700; font-weight:700;" id="detailTotal">₹' + dish.price + '</span>' +
        '</div>' +
        '<button onclick="addToCartFromDetail(\'' + dish._id + '\')" style="width:100%; padding:1rem; background:#E23744; color:white; border:none; border-radius:50px; font-weight:700; font-size:1.1rem; cursor:pointer;">🛒 Add to Cart — ₹<span id="detailBtnPrice">' + dish.price + '</span></button>'
      : '<p style="text-align:center; color:#7C3AED; margin:1rem 0;">⚙️ Admin cannot order</p>') +
      
    '</div>' + // End body
    
    // Reviews Section
    '<div style="padding:1.5rem; border-top:1px solid rgba(255,255,255,0.1);">' +
      '<h3 style="margin-bottom:1rem; color:white;">⭐ Reviews</h3>' +
      '<div id="reviewsContainer" style="max-height:200px; overflow-y:auto; margin-bottom:1rem;">' +
        '<p style="color:#a0a0b0; text-align:center;">Loading reviews...</p>' +
      '</div>' +
      (!currentUser || currentUser.role !== 'admin' ? 
        '<div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:12px;">' +
          '<p style="margin-bottom:0.5rem; color:white; font-weight:600;">Rate this dish:</p>' +
          '<div class="stars" style="margin-bottom:0.8rem; display:flex; gap:0.3rem;">' +
            '<span class="star" onclick="setRating(1)" style="font-size:1.5rem; color:rgba(255,255,255,0.2); cursor:pointer;">★</span>' +
            '<span class="star" onclick="setRating(2)" style="font-size:1.5rem; color:rgba(255,255,255,0.2); cursor:pointer;">★</span>' +
            '<span class="star" onclick="setRating(3)" style="font-size:1.5rem; color:rgba(255,255,255,0.2); cursor:pointer;">★</span>' +
            '<span class="star" onclick="setRating(4)" style="font-size:1.5rem; color:rgba(255,255,255,0.2); cursor:pointer;">★</span>' +
            '<span class="star" onclick="setRating(5)" style="font-size:1.5rem; color:rgba(255,255,255,0.2); cursor:pointer;">★</span>' +
          '</div>' +
          '<textarea id="reviewComment" placeholder="Write your review..." style="width:100%; padding:0.8rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.2); border-radius:10px; color:white; resize:vertical; min-height:60px; font-family:inherit;"></textarea>' +
          '<button onclick="submitReview()" style="width:100%; margin-top:0.5rem; padding:0.7rem; background:#7C3AED; color:white; border:none; border-radius:10px; font-weight:700; cursor:pointer;">📝 Submit Review</button>' +
        '</div>'
      : '<p style="text-align:center; color:#a0a0b0;">Admin cannot review</p>') +
    '</div>' +
    
    // Related Dishes
    (related.length > 0 ? 
      '<div style="padding:1.5rem; border-top:1px solid rgba(255,255,255,0.1);">' +
        '<h3 style="margin-bottom:1rem; color:white;">🍽️ More in ' + dish.category + '</h3>' +
        '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:0.5rem;">' +
          related.map(function(r) {
            return '<div style="cursor:pointer; text-align:center;" onclick="closeDishDetail(); setTimeout(function(){showDishDetail(\'' + r._id + '\')},300)">' +
              '<img src="' + r.image + '" style="width:100%; height:60px; object-fit:cover; border-radius:10px;" onerror="this.src=\'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100\'">' +
              '<p style="font-size:0.65rem; margin-top:0.2rem; color:#a0a0b0;">' + r.name + '</p>' +
              '<p style="font-size:0.7rem; font-weight:700; color:#FFD700;">₹' + r.price + '</p>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' 
    : '') +
  '</div>';
  
  document.body.appendChild(modal);
  
  // Close on outside click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeDishDetail();
  });
  
  // Load reviews
  setTimeout(function() {
    loadReviews(dishId);
  }, 300);
}

updateCartCount();