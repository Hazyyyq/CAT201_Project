// --- 1. INITIAL SETUP ---
const defaultProducts = [
    {
        id: 1,
        name: "KakiPhone 15 Pro",
        category: "Phone",
        price: 4999,
        stock: 12,
        desc: "Titanium. So Strong. So light. So pro.",
        image: "https://images.unsplash.com/photo-1732020883989-b22d66f8f1b9?w=600&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "KakiWatch Ultra",
        category: "Watch",
        price: 3299,
        stock: 3,
        desc: "Adventure awaits. The ultimate sports watch.",
        image: "https://images.unsplash.com/photo-1594619272803-932ee1b5a0d9?w=600&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "KakiPad Air",
        category: "Tablet",
        price: 2500,
        stock: 20,
        desc: "Two sizes. Faster chip. Does it all.",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2015&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Elden Ring",
        category: "Games",
        price: 199,
        stock: 50,
        desc: "Game of the Year edition. PS5/PC.",
        image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop"
    }
];

let products = JSON.parse(localStorage.getItem('kakiProducts')) || defaultProducts;
let currentCategory = 'all';
let isEditing = false;
let editId = null;
let tempImageBase64 = "";

document.addEventListener('DOMContentLoaded', () => {
    renderGrid();

    window.onclick = function(event) {
        if (event.target == document.getElementById('productModal')) {
            closeModal();
        }
    }

    document.getElementById('productForm').addEventListener('submit', handleFormSubmit);

    // File Reader Logic
    document.getElementById('pFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Update Filename Text
            document.getElementById('fileName').textContent = file.name;

            // Convert to Base64
            const reader = new FileReader();
            reader.onload = function(evt) {
                tempImageBase64 = evt.target.result;
                const preview = document.getElementById('imagePreview');
                preview.src = tempImageBase64;
                preview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            document.getElementById('fileName').textContent = "No file chosen";
        }
    });
});

// --- 2. RENDER FUNCTIONS ---
function renderGrid() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    const filtered = currentCategory === 'all'
        ? products
        : products.filter(p => p.category === currentCategory);

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 20px;">No products found in this category.</p>';
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const imgSrc = item.image ? item.image : 'https://via.placeholder.com/300?text=No+Image';
        const stockClass = item.stock < 5 ? 'text-danger' : '';

        card.innerHTML = `
            <img src="${imgSrc}" class="card-img" alt="${item.name}">
            <div class="card-body">
                <span class="card-tag">${item.category}</span>
                <h3 class="card-title">${item.name}</h3>
                <p class="card-desc">${item.desc}</p>
                <div class="stock-info">
                    <div>Price: <span>RM${parseFloat(item.price).toFixed(2)}</span></div>
                    <div>Stock: <span class="${stockClass}">${item.stock}</span></div>
                </div>
                <div class="card-actions">
                    <button class="btn-edit" onclick="openModal('edit', ${item.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteProduct(${item.id})">Delete</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterProducts(category, btnElement) {
    currentCategory = category;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btnElement.classList.add('active');
    renderGrid();
}

// --- 3. CRUD LOGIC ---
function deleteProduct(id) {
    if(confirm("Are you sure you want to delete this product?")) {
        products = products.filter(p => p.id !== id);
        saveAndRender();
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('pName').value;
    const category = document.getElementById('pCategory').value;
    const stock = document.getElementById('pStock').value;
    const price = document.getElementById('pPrice').value;
    const desc = document.getElementById('pDesc').value;

    if (isEditing) {
        const index = products.findIndex(p => p.id === editId);
        if (index !== -1) {
            const finalImage = tempImageBase64 !== "" ? tempImageBase64 : products[index].image;
            products[index] = {
                id: editId,
                name, image: finalImage, category, stock, price, desc
            };
        }
    } else {
        const newId = Date.now();
        products.push({
            id: newId,
            name, image: tempImageBase64, category, stock, price, desc
        });
    }

    saveAndRender();
    closeModal();
}

function saveAndRender() {
    localStorage.setItem('kakiProducts', JSON.stringify(products));
    renderGrid();
}

// --- 4. MODAL ---
function openModal(mode, id = null) {
    const modal = document.getElementById('productModal');
    modal.style.display = 'flex';

    tempImageBase64 = "";
    document.getElementById('pFile').value = "";
    document.getElementById('fileName').textContent = "No file chosen";

    if (mode === 'edit') {
        isEditing = true;
        editId = id;
        document.getElementById('modalTitle').innerText = 'Edit Product';

        const p = products.find(item => item.id === id);
        document.getElementById('pName').value = p.name;
        document.getElementById('pCategory').value = p.category;
        document.getElementById('pStock').value = p.stock;
        document.getElementById('pPrice').value = p.price;
        document.getElementById('pDesc').value = p.desc;

        const preview = document.getElementById('imagePreview');
        if(p.image) {
            preview.src = p.image;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }

    } else {
        isEditing = false;
        editId = null;
        document.getElementById('modalTitle').innerText = 'Add New Product';
        document.getElementById('productForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
    }
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}