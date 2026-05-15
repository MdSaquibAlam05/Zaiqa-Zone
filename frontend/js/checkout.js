// const API = '/api';
// const user = JSON.parse(localStorage.getItem('zaiqa_user'));
// let cart = JSON.parse(localStorage.getItem('zaiqa_cart')) || [];
// let selectedAddressIndex = -1;
// let userAddresses = [];

// // Redirect if not logged in
// if (!user) {
//   window.location.href = '/login';
// }

// // Agar cart empty hai toh home bhejo
// if (cart.length === 0) {
//   // Premium Empty Cart Modal
//   const modalHTML = `
//     <div style="background:linear-gradient(135deg,#1a1a2e,#16213e); padding:2rem; border-radius:20px; border:2px solid #7C3AED; color:white; font-family:'Segoe UI',sans-serif; text-align:center; max-width:400px;">
//       <div style="font-size:4rem; margin-bottom:1rem;">🛒</div>
//       <h2 style="color:#E23744; margin-bottom:0.5rem;">Empty Cart</h2>
//       <p style="color:#a0a0b0; margin-bottom:1.5rem;">Your cart is empty! Add delicious dishes first.</p>
//       <button onclick="window.location.href='/'" style="background:#E23744; color:white; border:none; padding:0.8rem 2.5rem; border-radius:50px; font-weight:700; cursor:pointer; font-size:1rem; width:100%;">🍕 Browse Menu</button>
//       <p style="color:#a0a0b0; font-size:0.75rem; margin-top:1rem;">Add items to cart & come back!</p>
//     </div>
//   `;
  
//   const modal = document.createElement('div');
//   modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;justify-content:center;align-items:center;padding:20px;';
//   modal.innerHTML = modalHTML;
//   modal.addEventListener('click', function(e) {
//     if (e.target === modal) window.location.href = '/';
//   });
//   document.body.appendChild(modal);
  
//   // Auto-redirect after 3 seconds
//   setTimeout(() => window.location.href = '/', 3000);
  
//   return; // Stop further execution
// }

// init();




const API = '/api';
const user = JSON.parse(localStorage.getItem('zaiqa_user'));
let cart = JSON.parse(localStorage.getItem('zaiqa_cart')) || [];
let selectedAddressIndex = -1;
let userAddresses = [];

// Redirect if not logged in
if (!user) {
  window.location.href = '/login';
}

// Agar cart empty hai — PREMIUM MODAL DIKHAO aur HOME BHEJO
if (cart.length === 0) {
  // Premium Empty Cart Modal
  const emptyHTML = `
    <div style="background:linear-gradient(135deg,#1a1a2e,#16213e); padding:2rem; border-radius:20px; border:2px solid #7C3AED; color:white; font-family:'Segoe UI',sans-serif; text-align:center; max-width:400px;">
      <div style="font-size:4rem; margin-bottom:1rem;">🛒</div>
      <h2 style="color:#E23744; margin-bottom:0.5rem; font-size:1.5rem;">Empty Cart</h2>
      <p style="color:#a0a0b0; margin-bottom:1.5rem; font-size:1rem;">Your cart is empty! Add delicious dishes first.</p>
      <button onclick="window.location.href='/'" style="background:#E23744; color:white; border:none; padding:0.8rem 2.5rem; border-radius:50px; font-weight:700; cursor:pointer; font-size:1rem; width:100%;">🍕 Browse Menu</button>
      <p style="color:#a0a0b0; font-size:0.75rem; margin-top:1rem;">Add items to cart & come back!</p>
    </div>
  `;
  
  // Remove existing page content
  document.body.innerHTML = '';
  
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:99999;display:flex;justify-content:center;align-items:center;padding:20px;';
  modalContainer.innerHTML = emptyHTML;
  modalContainer.addEventListener('click', function(e) {
    if (e.target === modalContainer) window.location.href = '/';
  });
  document.body.appendChild(modalContainer);
  
  // Auto-redirect after 4 seconds
//   setTimeout(function() {
//     window.location.href = '/';
//   }, 4000);
  
  // Stop all further execution
  throw new Error('Cart is empty - redirecting to home');
}

// Cart has items — continue loading checkout
init();




async function init() {
  console.log('Checkout page loaded');
  console.log('Cart items:', cart.length);
  await loadUserAddresses();
  renderOrderSummary();
}

async function loadUserAddresses() {
  try {
    const res = await fetch(`${API}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    const userData = await res.json();
    userAddresses = userData.addresses || [];

    if (userAddresses.length > 0) {
      renderSavedAddresses();
      const defaultAddr = userAddresses.find(a => a.isDefault);
      if (defaultAddr) {
        selectedAddressIndex = userAddresses.indexOf(defaultAddr);
        updateAddressSelection();
      }
      document.getElementById('newAddressForm').style.display = 'none';
      document.getElementById('toggleBtn').textContent = '➕ Add New Address';
    } else {
      document.getElementById('savedAddresses').innerHTML = 
        '<p style="color:var(--text-muted); margin-bottom:1rem;">No saved addresses. Please add one below.</p>';
      document.getElementById('newAddressForm').style.display = 'block';
      document.getElementById('toggleBtn').style.display = 'none';
    }
  } catch (err) {
    console.error('Address load error:', err);
    document.getElementById('savedAddresses').innerHTML = 
      '<p style="color:red;">Failed to load addresses. Please try again.</p>';
  }
}

function renderSavedAddresses() {
  const container = document.getElementById('savedAddresses');
  
  container.innerHTML = userAddresses.map((addr, index) => `
    <div class="address-option ${selectedAddressIndex === index ? 'selected' : ''}" 
         onclick="selectSavedAddress(${index})"
         style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:10px; margin-bottom:0.5rem; cursor:pointer; border:2px solid ${selectedAddressIndex === index ? '#E23744' : 'transparent'}; transition:all 0.3s;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="badge badge-purple" style="padding:0.2rem 0.7rem; border-radius:50px; font-size:0.7rem; font-weight:700; background:rgba(124,58,237,0.2); color:#C4B5FD;">${addr.label || 'Home'}</span>
        ${addr.isDefault ? '<span class="badge badge-primary" style="padding:0.2rem 0.7rem; border-radius:50px; font-size:0.7rem; font-weight:700; background:rgba(226,55,68,0.2); color:#FCA5A5;">⭐ Default</span>' : ''}
      </div>
      <p style="font-weight:600; margin-top:0.5rem; color:white;">📍 ${addr.street}</p>
      <p style="font-size:0.85rem; color:var(--text-muted);">${addr.city}${addr.state ? ', ' + addr.state : ''} - ${addr.pincode}</p>
      <p style="font-size:0.85rem; color:var(--text-muted);">📱 ${addr.phone}</p>
    </div>
  `).join('');
}

function selectSavedAddress(index) {
  selectedAddressIndex = index;
  updateAddressSelection();
}

function updateAddressSelection() {
  document.querySelectorAll('.address-option').forEach((div, i) => {
    div.style.borderColor = i === selectedAddressIndex ? '#E23744' : 'transparent';
  });
}

function toggleNewAddress() {
  const form = document.getElementById('newAddressForm');
  const btn = document.getElementById('toggleBtn');
  
  if (form.style.display === 'none' || form.style.display === '') {
    form.style.display = 'block';
    btn.textContent = '❌ Cancel';
    selectedAddressIndex = -1;
    updateAddressSelection();
  } else {
    form.style.display = 'none';
    btn.textContent = '➕ Add New Address';
  }
}

function renderOrderSummary() {
  const container = document.getElementById('checkoutItems');
  if (!container) return;
  
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  
  container.innerHTML = cart.map(item => `
    <div style="display:flex; gap:0.8rem; align-items:center; margin-bottom:0.8rem; padding-bottom:0.8rem; border-bottom:1px solid rgba(255,255,255,0.05);">
      <img src="${item.image}" style="width:50px; height:50px; border-radius:8px; object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'">
      <div style="flex:1;">
        <p style="font-weight:600; color:white;">${item.name}</p>
        <p style="font-size:0.8rem; color:var(--text-muted);">₹${item.price} × ${item.qty}</p>
      </div>
      <strong style="color:#FFD700;">₹${item.price * item.qty}</strong>
    </div>
  `).join('');
  
  document.getElementById('subtotal').textContent = '₹' + subtotal;
  document.getElementById('grandTotal').textContent = '₹' + (subtotal + 40);
}

function getAddress() {
  if (selectedAddressIndex >= 0 && selectedAddressIndex < userAddresses.length) {
    return {
      ...userAddresses[selectedAddressIndex],
      isSaved: true
    };
  }
  
  const street = document.getElementById('street')?.value?.trim() || '';
  const city = document.getElementById('city')?.value?.trim() || '';
  const state = document.getElementById('state')?.value?.trim() || '';
  const pincode = document.getElementById('pincode')?.value?.trim() || '';
  const phone = document.getElementById('phone')?.value?.trim() || '';
  const label = document.getElementById('label')?.value || 'Home';
  const saveAddress = document.getElementById('saveAddress')?.checked || false;
  
  if (!street || !city || !pincode || !phone) {
    showToast('❌ Please fill all required address fields!');
    return null;
  }
  
  return { street, city, state, pincode, phone, label, isSaved: false, saveAddress };
}

async function placeOrderWithAddress() {
  const address = getAddress();
  if (!address) return;
  
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + 40;
  
  const btn = document.querySelector('button[onclick="placeOrderWithAddress()"]');
  if (btn) {
    btn.textContent = '⏳ Placing Order...';
    btn.disabled = true;
  }
  
  try {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: cart.map(i => ({ 
          name: i.name, 
          price: i.price, 
          quantity: i.qty, 
          image: i.image 
        })),
        totalAmount: total,
        paymentMethod: 'cod',
        deliveryAddress: {
          street: address.street,
          city: address.city,
          state: address.state || '',
          pincode: address.pincode,
          phone: address.phone
        },
        saveAddress: address.saveAddress || false
      })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      // Clear cart
      localStorage.setItem('zaiqa_cart', JSON.stringify([]));
      cart = [];
      
      // Premium Receipt HTML
      const receiptHTML = `
        <div style="position:relative; background:linear-gradient(135deg,#1a1a2e,#16213e); padding:1.5rem; border-radius:16px; border:2px solid #7C3AED; color:white; font-family:'Segoe UI',sans-serif; max-height:75vh; overflow-y:auto;">
          
          <button onclick="closeReceiptModal()" style="position:absolute; top:10px; right:10px; background:#dc2626; color:white; border:none; width:30px; height:30px; border-radius:50%; font-size:14px; font-weight:bold; cursor:pointer; z-index:10; line-height:30px; text-align:center; padding:0; box-shadow:0 2px 8px rgba(0,0,0,0.3);">✕</button>
          
          <div style="text-align:center; margin-bottom:1rem; margin-top:0.3rem;">
            <div style="font-size:2.5rem;">🎉</div>
            <h2 style="color:#E23744; margin:0.3rem 0; font-size:1.3rem;">Zaiqa Zone</h2>
            <p style="color:#a0a0b0; font-size:0.8rem;">✦ Order Confirmed ✦</p>
          </div>
          
          <div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:1rem;">
            <p style="font-size:0.65rem; color:#a0a0b0; text-transform:uppercase; letter-spacing:1px;">Order ID</p>
            <p style="font-weight:700; font-size:1rem; margin-bottom:0.8rem;">#${data._id?.slice(-8).toUpperCase()}</p>
            
            <hr style="border-color:rgba(255,255,255,0.1); margin:0.8rem 0;">
            
            <p style="font-size:0.65rem; color:#a0a0b0; text-transform:uppercase; letter-spacing:1px;">Delivery To</p>
            <p style="font-weight:600; font-size:0.9rem;">📍 ${address.street}</p>
            <p style="color:#a0a0b0; font-size:0.8rem;">${address.city}${address.state ? ', ' + address.state : ''} - ${address.pincode}</p>
            <p style="color:#a0a0b0; font-size:0.8rem;">📱 ${address.phone}</p>
            
            <hr style="border-color:rgba(255,255,255,0.1); margin:0.8rem 0;">
            
            <p style="font-size:0.65rem; color:#a0a0b0; text-transform:uppercase; letter-spacing:1px;">Items</p>
            ${cart.map(i => `
              <div style="display:flex; justify-content:space-between; margin:0.2rem 0; font-size:0.85rem;">
                <span>${i.name} × ${i.qty}</span>
                <span>₹${i.price * i.qty}</span>
              </div>
            `).join('')}
            
            <hr style="border-color:rgba(255,255,255,0.1); margin:0.8rem 0;">
            
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:#a0a0b0;">
              <span>Subtotal</span><span>₹${subtotal}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:#a0a0b0;">
              <span>Delivery Fee</span><span>₹40</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:700; margin-top:0.3rem;">
              <span>Total</span><span style="color:#FFD700;">₹${total}</span>
            </div>
          </div>
          
          <div style="text-align:center; margin-top:0.8rem; background:rgba(16,185,129,0.15); padding:0.6rem; border-radius:50px; border:1px solid rgba(16,185,129,0.3);">
            <span style="color:#10b981; font-weight:700; font-size:0.85rem;">✅ ORDER PLACED SUCCESSFULLY</span>
          </div>
          
          <p style="text-align:center; font-size:0.65rem; color:#a0a0b0; margin-top:0.4rem;">Payment: Cash on Delivery</p>
        </div>
      `;
      
      // Remove existing modal
      const existingModal = document.getElementById('receiptModal');
      if (existingModal) existingModal.remove();
      
      // Create modal
      const modal = document.createElement('div');
      modal.id = 'receiptModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;justify-content:center;align-items:center;padding:15px;';
      
      const modalContent = document.createElement('div');
      modalContent.style.cssText = 'max-width:420px;width:100%;animation:slideUp 0.4s ease;';
      modalContent.innerHTML = receiptHTML;
      
      // Buttons container
      const btnContainer = document.createElement('div');
      btnContainer.style.cssText = 'display:flex;gap:0.6rem;margin-top:0.8rem;justify-content:center;background:rgba(0,0,0,0.7);padding:0.8rem;border-radius:12px;';
      btnContainer.innerHTML = `
        <button onclick="window.location.href='/orders'" style="background:#E23744;color:white;border:none;padding:0.7rem 1.5rem;border-radius:50px;font-weight:700;cursor:pointer;font-size:0.85rem;">📋 Orders</button>
        <button onclick="closeReceiptModal()" style="background:rgba(255,255,255,0.15);color:white;border:2px solid rgba(255,255,255,0.3);padding:0.7rem 1.5rem;border-radius:50px;font-weight:700;cursor:pointer;font-size:0.85rem;">🏠 Home</button>
      `;
      modalContent.appendChild(btnContainer);
      
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      
      // Click outside to close
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeReceiptModal();
      });
      
      // Animations
      if (!document.getElementById('receiptStyles')) {
        const style = document.createElement('style');
        style.id = 'receiptStyles';
        style.textContent = '@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}';
        document.head.appendChild(style);
      }
      
      showToast('🎉 Order placed successfully!');
      
    } else {
      showToast('❌ ' + (data.message || 'Order failed'));
      if (btn) {
        btn.textContent = '🚀 Place Order';
        btn.disabled = false;
      }
    }
  } catch (err) {
    console.error('Order error:', err);
    showToast('❌ Server error! Please try again.');
    if (btn) {
      btn.textContent = '🚀 Place Order';
      btn.disabled = false;
    }
  }
}

// ============ CLOSE RECEIPT MODAL ============
function closeReceiptModal() {
  const modal = document.getElementById('receiptModal');
  if (modal) {
    modal.remove();
  }
  window.location.href = '/';
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}

function logout() {
  localStorage.removeItem('zaiqa_user');
  localStorage.removeItem('zaiqa_cart');
  window.location.href = '/';
}

function addNewAddress() {
  const street = document.getElementById('street').value.trim();
  const city = document.getElementById('city').value.trim();
  const state = document.getElementById('state').value.trim();
  const pincode = document.getElementById('pincode').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const label = document.getElementById('label').value;
  
  if (!street || !city || !pincode || !phone) {
    showToast('❌ Fill all required fields!');
    return;
  }
  
  // Add to local array
  const newAddr = { street, city, state, pincode, phone, label, isDefault: userAddresses.length === 0 };
  userAddresses.push(newAddr);
  selectedAddressIndex = userAddresses.length - 1;
  
  // Save to backend
  fetch(`${API}/auth/address`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify({ address: newAddr })
  }).catch(() => {});
  
  // Update UI
  renderSavedAddresses();
  updateAddressSelection();
  document.getElementById('newAddressForm').style.display = 'none';
  document.getElementById('toggleBtn').textContent = '➕ Add New Address';
  showToast('✅ Address saved!');
}