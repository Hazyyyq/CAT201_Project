import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import styles from '../style/AdminPage.module.css';

const AdminPage = () => {

    // --- 1. STATE ---
    const [products, setProducts] = useState([]); // Start empty, fetch later
    const [currentCategory, setCurrentCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Sidebar toggle

    // Form States
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', category: '', stock: '', price: '', oldPrice: '', badge: '', desc: '', image: ''
    });
    const [fileName, setFileName] = useState("No file chosen");
    const [previewImage, setPreviewImage] = useState("");

    // --- 2. INITIAL LOAD ---
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Using 127.0.0.1 to avoid localhost issues
            const res = await fetch('http://127.0.0.1:8080/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // --- 3. HANDLERS ---
    const filteredProducts = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await fetch(`http://127.0.0.1:8080/api/products?id=${id}`, {
                    method: 'DELETE'
                });
                // Refresh list from server immediately
                fetchProducts();
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalImage = previewImage !== "" ? previewImage : formData.image;

        // Prepare data object
        const productData = {
            id: isEditing ? editId : 0, // 0 tells Java to generate a new ID
            name: formData.name,
            image: finalImage,
            category: formData.category,
            stock: parseInt(formData.stock),
            price: parseFloat(formData.price),
            oldPrice: formData.category === 'Games' && formData.oldPrice ? parseFloat(formData.oldPrice) : null,
            badge: formData.badge || null,
            desc: formData.desc
        };

        try {
            if (isEditing) {
                // EDIT Mode (PUT)
                await fetch('http://127.0.0.1:8080/api/products', {
                    method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(productData)
                });
            } else {
                // ADD Mode (POST)
                await fetch('http://127.0.0.1:8080/api/products', {
                    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(productData)
                });
            }

            // Refresh list and close modal
            fetchProducts();
            closeModal();

        } catch (error) {
            console.error("Save failed:", error);
            alert("Failed to save product. Check console.");
        }
    };

    // --- MODAL HELPERS ---
    const openModal = (mode, product = null) => {
        setIsModalOpen(true);
        if (mode === 'edit' && product) {
            setIsEditing(true);
            setEditId(product.id);
            setFormData({
                name: product.name,
                category: product.category,
                stock: product.stock,
                price: product.price,
                oldPrice: product.oldPrice || '',
                badge: product.badge || '',
                desc: product.desc,
                image: product.image
            });
            setPreviewImage(product.image || "");
            setFileName("Image kept (upload new to change)");
        } else {
            setIsEditing(false);
            setEditId(null);
            setFormData({
                name: '', category: 'Phone', stock: '', price: '', oldPrice: '', badge: '', desc: '', image: ''
            });
            setPreviewImage("");
            setFileName("No file chosen");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (evt) => {
                setPreviewImage(evt.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        const keyMap = {
            pName: 'name',
            pCategory: 'category',
            pStock: 'stock',
            pPrice: 'price',
            pOldPrice: 'oldPrice',
            pBadge: 'badge',
            pDesc: 'desc'
        };
        setFormData(prev => ({...prev, [keyMap[id]]: value}));
    };

    // --- RENDER ---
    return (<div className="dark-theme">
        {/* Global Nav */}
        <nav className="nav">
            <Link to="/" className="logo">
                KAKI GAMERZ-ADMIN<span className="dot"></span>
            </Link>

            <div className="nav-links desktop-menu">
                <Link to="/">Store Front</Link>
                <a href="#" className="active">Inventory</a>
                <a href="#">Orders</a>
            </div>

            <div className="nav-actions">
                <div className={styles['admin-badge']}>Admin Mode</div>
            </div>

            <div className="sidebar" onClick={() => setIsOpen(!isOpen)}>
                <i className={`fa ${isOpen ? "fa-times" : "fa-bars"}`}></i>
            </div>
        </nav>

        <div className={styles['admin-container']}>
            <div className={styles['header-section']}>
                <div className={styles['header-text']}>
                    <h1>Product Inventory</h1>
                    <p>Manage stock levels, prices, and product categories.</p>
                </div>
                <button className={styles['btn-add']} onClick={() => openModal('add')}>
                    <i className="fa fa-plus"></i> Add New Product
                </button>
            </div>

            <div className={styles['filter-tabs']}>
                {['all', 'Phone', 'Watch', 'Tablet', 'Games'].map(cat => (<button
                    key={cat}
                    className={`${styles['tab']} ${currentCategory === cat ? styles['active'] : ''}`}
                    onClick={() => setCurrentCategory(cat)}
                >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>))}
            </div>

            <div className={styles['product-grid']} id="productGrid">
                {filteredProducts.length === 0 ? (
                    <p style={{gridColumn: '1/-1', textAlign: 'center', color: '#666', padding: '20px'}}>
                        No products found in this category.
                    </p>) : (filteredProducts.map((item) => {
                    const stockClass = item.stock < 5 ? styles['text-danger'] : '';
                    return (<div className={styles['product-card']} key={item.id}>
                        <div className={styles['card-image-wrapper']}>
                            <img
                                src={item.image || 'https://via.placeholder.com/300?text=No+Image'}
                                className={styles['card-img']}
                                alt={item.name}
                            />


                            {/* Logic for dynamic color switching */}
                            {item.badge && (<span
                                className={`${styles['card-tag-badge']} ${!item.badge.includes('%') ? styles['card-tag-badge-blue'] : ''}`}>
        {item.badge}
    </span>)}
                        </div>
                        <div className={styles['card-body']}>
                            <span className={styles['card-tag']}>{item.category}</span>
                            <h3 className={styles['card-title']}>{item.name}</h3>
                            <p className={styles['card-desc']}>{item.desc}</p>
                            <div className={styles['stock-info']}>
                                <div className={styles['price-row']}>
                                    {/* 3. OLD PRICE (STRIKETHROUGH) AND NEW PRICE */}
                                    {item.category === 'Games' && item.oldPrice && (
                                        <span className={styles['price-old']}>
                                            RM{parseFloat(item.oldPrice).toFixed(2)}
                                        </span>)}
                                    <span
                                        className={styles['price-new']}>RM{parseFloat(item.price).toFixed(2)}</span>
                                </div>
                                <div>Stock: <span
                                    className={item.stock < 5 ? styles['text-danger'] : ''}>{item.stock}</span>
                                </div>
                            </div>
                            <div className={styles['card-actions']}>
                                <button className={styles['btn-edit']}
                                        onClick={() => openModal('edit', item)}>Edit
                                </button>
                                <button className={styles['btn-delete']}
                                        onClick={() => handleDelete(item.id)}>Delete
                                </button>
                            </div>
                        </div>
                    </div>);
                }))}
            </div>
        </div>

        {isModalOpen && (<div id="productModal" className={styles['modal']} style={{display: 'flex'}} onClick={(e) => {
            if (e.target.id === 'productModal') closeModal()
        }}>
            <div className={styles['modal-content']}>
                <div className={styles['modal-header']}>
                    <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                    <span className={styles['close-btn']} onClick={closeModal}>&times;</span>
                </div>

                <form id="productForm" onSubmit={handleSubmit}>
                    <div className={styles['form-group']}>
                        <label>Product Name</label>
                        <input
                            type="text"
                            id="pName"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Product Name"
                        />
                    </div>

                    <div className={styles['form-group']}>
                        <label>Product Image</label>
                        <label htmlFor="pFile" className={styles['custom-file-upload']}>
                            <i className="fa fa-cloud-upload"></i> Choose Image
                        </label>
                        <span className={styles['file-name-display']}>{fileName}</span>
                        <input
                            type="file"
                            id="pFile"
                            accept=".jpg, .jpeg, .png, .webp"
                            onChange={handleFileChange}
                            style={{display: 'none'}}
                        />
                        {previewImage && (<img
                            src={previewImage}
                            id="imagePreview"
                            alt="Preview"
                            style={{
                                display: 'block',
                                maxWidth: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                marginTop: '10px',
                                borderRadius: '8px',
                                border: '1px solid #424245'
                            }}
                        />)}
                    </div>

                    <div className={styles['form-row']}>
                        <div className={styles['form-group']}>
                            <label>Category</label>
                            <select id="pCategory" value={formData.category} onChange={handleInputChange}>
                                <option value="Phone">Phone</option>
                                <option value="Watch">Watch</option>
                                <option value="Tablet">Tablet</option>
                                <option value="Games">Games</option>
                            </select>

                            {formData.category === 'Games' && (<div className={styles['form-group']}>
                                    <label>Old Price (RM)</label>
                                    <input
                                        type="number"
                                        id="pOldPrice"
                                        value={formData.oldPrice}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        placeholder="e.g. 299.00"
                                    />
                                </div>)}
                            <div className={styles['form-group']}>
                                <label>Badge Text</label>
                                <input
                                    type="text"
                                    id="pBadge"
                                    value={formData.badge}
                                    onChange={handleInputChange}
                                    placeholder="e.g. -20% or NEW"
                                />
                            </div>
                        </div>
                        <div className={styles['form-group']}>
                            <label>Stock Left</label>
                            <input type="number" id="pStock" value={formData.stock} onChange={handleInputChange}
                                   required min="0"/>
                        </div>
                    </div>

                    <div className={styles['form-group']}>
                        <label>Price (RM)</label>
                        <input type="number" id="pPrice" value={formData.price} onChange={handleInputChange}
                               required step="0.01"/>
                    </div>

                    <div className={styles['form-group']}>
                        <label>Description</label>
                        <textarea id="pDesc" rows="3" value={formData.desc} onChange={handleInputChange}
                                  required></textarea>
                    </div>

                    <div className={styles['modal-actions']}>
                        <button type="button" className={styles['btn-cancel']} onClick={closeModal}>Cancel
                        </button>
                        <button type="submit" className={styles['btn-save']}>Save Product</button>
                    </div>
                </form>
            </div>
        </div>)}
    </div>);
};

export default AdminPage;