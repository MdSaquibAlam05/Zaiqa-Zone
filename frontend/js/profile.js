const API = '/api';
const user = JSON.parse(localStorage.getItem('zaiqa_user'));

if (!user) window.location.href = '/login';

let userData = null;

init();

async function init() {
  await loadProfile();
}

async function loadProfile() {
  try {
    const res = await fetch(`${API}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    userData = await res.json();
    renderProfile();
  } catch (err) {
    showToast('Failed to load profile');
  }
}

function renderProfile() {
  document.getElementById('displayName').textContent = userData.name || '-';
  document.getElementById('displayEmail').textContent = userData.email || '-';
  document.getElementById('displayPhone').textContent = userData.phone || '-';
  
  document.getElementById('editName').value = userData.name || '';
  document.getElementById('editPhone').value = userData.phone || '';
  
  renderAddresses();
}

function renderAddresses() {
  const container = document.getElementById('addressesList');
  const addresses = userData.addresses || [];
  
  if (addresses.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); text-align:center;">No addresses saved yet</p>';
    return;
  }
  
  container.innerHTML = addresses.map(addr => `
    <div class="address-card ${addr.isDefault ? 'default' : ''}">
      <div style="display:flex; justify-content:space-between; align-items:start;">
        <div>
          <span class="badge badge-label">${addr.label || 'Home'}</span>
          ${addr.isDefault ? '<span class="badge badge-default">⭐ Default</span>' : ''}
          <p style="font-weight:600; margin-top:0.5rem;">📍 ${addr.street}</p>
          <p style="color:var(--text-muted); font-size:0.85rem;">${addr.city}${addr.state ? ', ' + addr.state : ''} - ${addr.pincode}</p>
          <p style="color:var(--text-muted); font-size:0.85rem;">📱 ${addr.phone}</p>
        </div>
        <div style="display:flex; gap:0.5rem;">
          ${!addr.isDefault ? `<button class="btn btn-outline btn-sm" onclick="setDefault('${addr._id}')">⭐ Set Default</button>` : ''}
          <button class="btn btn-danger btn-sm" onclick="deleteAddress('${addr._id}')">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleEditProfile() {
  document.getElementById('profileView').style.display = 
    document.getElementById('profileView').style.display === 'none' ? 'block' : 'none';
  document.getElementById('profileEdit').style.display = 
    document.getElementById('profileEdit').style.display === 'none' ? 'block' : 'none';
}

async function saveProfile() {
  const name = document.getElementById('editName').value;
  const phone = document.getElementById('editPhone').value;
  
  try {
    const res = await fetch(`${API}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ name, phone })
    });
    
    if (res.ok) {
      await loadProfile();
      toggleEditProfile();
      showToast('✅ Profile updated!');
    }
  } catch (err) {
    showToast('❌ Failed to update');
  }
}

function toggleAddAddress() {
  document.getElementById('addAddressForm').style.display = 
    document.getElementById('addAddressForm').style.display === 'none' ? 'block' : 'none';
}

async function addAddress() {
  const address = {
    street: document.getElementById('newStreet').value,
    city: document.getElementById('newCity').value,
    state: document.getElementById('newState').value,
    pincode: document.getElementById('newPincode').value,
    phone: document.getElementById('newPhone').value,
    label: document.getElementById('newLabel').value
  };
  
  if (!address.street || !address.city || !address.pincode || !address.phone) {
    return showToast('❌ Fill all required fields!');
  }
  
  try {
    const res = await fetch(`${API}/auth/address`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ address })
    });
    
    if (res.ok) {
      await loadProfile();
      toggleAddAddress();
      showToast('✅ Address added!');
    }
  } catch (err) {
    showToast('❌ Failed to add address');
  }
}

async function deleteAddress(id) {
  if (!confirm('Delete this address?')) return;
  
  try {
    await fetch(`${API}/auth/address/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    await loadProfile();
    showToast('🗑️ Address deleted!');
  } catch (err) {
    showToast('❌ Failed to delete');
  }
}

async function setDefault(id) {
  try {
    await fetch(`${API}/auth/address/default/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    await loadProfile();
    showToast('⭐ Default address updated!');
  } catch (err) {
    showToast('❌ Failed');
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 2500);
}

function logout() {
  localStorage.removeItem('zaiqa_user');
  window.location.href = '/';
}