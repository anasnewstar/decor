document.addEventListener('DOMContentLoaded', () => {
    // --- General Admin Panel Logic ---
    const adminBody = document.body; // Assuming this script is only for admin pages
    const adminNightModeToggle = document.getElementById('admin-night-mode-toggle');

    if (adminNightModeToggle) {
        adminNightModeToggle.addEventListener('click', () => {
            adminBody.classList.toggle('admin-night-mode');
            if (adminBody.classList.contains('admin-night-mode')) {
                localStorage.setItem('adminTheme', 'admin-night-mode');
                adminNightModeToggle.textContent = '☀️'; 
            } else {
                localStorage.setItem('adminTheme', 'admin-day-mode');
                adminNightModeToggle.textContent = '🌙';
            }
        });
    }
    // Apply saved admin theme on page load
    const savedAdminTheme = localStorage.getItem('adminTheme');
    if (savedAdminTheme === 'admin-night-mode') {
        adminBody.classList.add('admin-night-mode');
        if (adminNightModeToggle) adminNightModeToggle.textContent = '☀️';
    } else {
        if (adminNightModeToggle) adminNightModeToggle.textContent = '🌙';
    }


    const adminSidebar = document.querySelector('.admin-sidebar');
    const adminSidebarToggle = document.querySelector('.admin-sidebar-toggle');
    // const adminContent = document.querySelector('.admin-content'); // For content push

    if (adminSidebarToggle && adminSidebar) {
        adminSidebarToggle.addEventListener('click', () => {
            const isVisible = adminSidebar.classList.toggle('sidebar-visible');
            adminSidebarToggle.setAttribute('aria-expanded', isVisible);
            // Optional: add class to admin-content to push it when sidebar is visible
            // if (adminContent) {
            //    adminContent.classList.toggle('sidebar-visible-content-push', isVisible);
            // }
             if(isVisible){
                adminSidebarToggle.innerHTML = '&times;'; // Change to 'X' icon
            } else {
                adminSidebarToggle.innerHTML = '&#9776;'; // Change back to hamburger icon
            }
        });
    }

    const currentPath = window.location.pathname.split('/').pop();

    // Sidebar active link
    const sidebarLinks = document.querySelectorAll('.sidebar-nav ul li a');
    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || 
            (currentPath === 'admin.html' && link.getAttribute('href').includes('admin.html'))) { // Handle admin.html as dashboard overview
            link.classList.add('active');
        }
        // Special handling for Sales Analytics link if it's a hash link on admin.html
        if (currentPath === 'admin.html' && window.location.hash && link.getAttribute('href').endsWith(window.location.hash)) {
            sidebarLinks.forEach(l => l.classList.remove('active')); // Remove active from dashboard overview
            link.classList.add('active');
            const targetSection = document.querySelector(window.location.hash);
            if(targetSection){
                document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
                targetSection.style.display = 'block';
            }
        }
    });
    
    // Handle clicks on hash links for sections within admin.html (e.g., Sales Analytics)
    document.querySelectorAll('.sidebar-nav a[href^="admin.html#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').split('#')[1];
            const targetSection = document.getElementById(targetId);
            if (targetSection && currentPath === 'admin.html') {
                 e.preventDefault();
                document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
                document.getElementById('dashboard-overview').style.display = (targetId === 'dashboard-overview' || !targetId) ? 'block' : 'none'; // Show overview if no specific target or it is the target
                targetSection.style.display = 'block';
                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });


    // --- Product Management (manage-products.html) ---
    if (currentPath === 'manage-products.html') {
        const addProductFormSection = document.getElementById('add-edit-product-form-section');
        const showAddProductFormBtn = document.getElementById('show-add-product-form-btn');
        const cancelProductFormBtn = document.getElementById('cancel-product-form-btn');
        const productForm = document.getElementById('product-form');
        const productsTableBody = document.querySelector('#products-table tbody');
        const formTitle = document.getElementById('form-title');
        const imagePreview = document.getElementById('image-preview');
        const productImageInput = document.getElementById('product-image');

        if (showAddProductFormBtn) {
            showAddProductFormBtn.addEventListener('click', () => {
                formTitle.textContent = 'Add New Product';
                productForm.reset();
                document.getElementById('product-id').value = ''; // Clear hidden ID
                imagePreview.style.display = 'none';
                addProductFormSection.style.display = 'block';
                document.getElementById('product-management').style.display = 'none';
            });
        }

        if (cancelProductFormBtn) {
            cancelProductFormBtn.addEventListener('click', () => {
                addProductFormSection.style.display = 'none';
                document.getElementById('product-management').style.display = 'block';
            });
        }
        
        if (productImageInput) {
            productImageInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagePreview.src = e.target.result;
                        imagePreview.style.display = 'block';
                    }
                    reader.readAsDataURL(file);
                } else {
                    imagePreview.style.display = 'none';
                }
            });
        }

        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const productId = document.getElementById('product-id').value;
                const name = document.getElementById('product-name').value;
                const price = parseFloat(document.getElementById('product-price').value).toFixed(2);
                const stock = parseInt(document.getElementById('product-stock').value);
                // const category = document.getElementById('product-category').value;
                // const description = document.getElementById('product-description').value;

                if (productId) { // Editing existing product
                    const row = document.querySelector(`tr[data-id='${productId}']`);
                    if (row) {
                        row.cells[1].textContent = name;
                        row.cells[2].textContent = `$${price}`;
                        row.cells[3].textContent = stock;
                        alert(`Product ${name} (ID: ${productId}) updated successfully! (Mock)`);
                    }
                } else { // Adding new product
                    const newProductId = `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
                    const newRow = productsTableBody.insertRow();
                    newRow.dataset.id = newProductId;
                    newRow.innerHTML = `
                        <td>${newProductId}</td>
                        <td>${name}</td>
                        <td>$${price}</td>
                        <td>${stock}</td>
                        <td>
                            <button class="btn btn-sm btn-edit">Edit</button>
                            <button class="btn btn-sm btn-danger btn-delete">Delete</button>
                        </td>
                    `;
                    alert(`Product ${name} added successfully! (Mock)`);
                }
                productForm.reset();
                imagePreview.style.display = 'none';
                addProductFormSection.style.display = 'none';
                document.getElementById('product-management').style.display = 'block';
            });
        }

        if (productsTableBody) {
            productsTableBody.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-edit')) {
                    const row = e.target.closest('tr');
                    const productId = row.dataset.id;
                    const name = row.cells[1].textContent;
                    const price = parseFloat(row.cells[2].textContent.replace('$', ''));
                    const stock = parseInt(row.cells[3].textContent);
                    // In a real app, you'd fetch full product details including description, category, image

                    formTitle.textContent = 'Edit Product';
                    document.getElementById('product-id').value = productId;
                    document.getElementById('product-name').value = name;
                    document.getElementById('product-price').value = price;
                    document.getElementById('product-stock').value = stock;
                    // Mock setting other fields if they were available
                    // document.getElementById('product-category').value = 'electronics'; 
                    // document.getElementById('product-description').value = 'Some description';
                    imagePreview.style.display = 'none'; // Hide or load actual image if available

                    addProductFormSection.style.display = 'block';
                    document.getElementById('product-management').style.display = 'none';

                } else if (e.target.classList.contains('btn-delete')) {
                    const row = e.target.closest('tr');
                    const productName = row.cells[1].textContent;
                    if (confirm(`Are you sure you want to delete ${productName}?`)) {
                        row.remove();
                        alert(`${productName} deleted successfully! (Mock)`);
                    }
                }
            });
        }
    }

    // --- Order Management (manage-orders.html) ---
    if (currentPath === 'manage-orders.html') {
        const ordersTableBody = document.querySelector('#orders-table tbody');
        if (ordersTableBody) {
            ordersTableBody.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-update-status')) {
                    const row = e.target.closest('tr');
                    const orderId = row.dataset.id;
                    const statusSelect = row.querySelector('.order-status-select');
                    const newStatus = statusSelect.value;
                    alert(`Order ${orderId} status updated to ${newStatus}! (Mock)`);
                    // In a real app, you'd send this to the server.
                    // For visual feedback, you might change the row color or text.
                }
                // Add logic for "View Details" if a modal or separate page is planned
            });
        }
        // Add filtering logic if needed
    }
    
    // --- User Management (manage-users.html) ---
    if (currentPath === 'manage-users.html') {
        const usersTableBody = document.querySelector('#users-table tbody');
        if(usersTableBody){
            usersTableBody.addEventListener('click', (e) => {
                if(e.target.classList.contains('btn-warning')){ // Disable/Enable button
                    const button = e.target;
                    const userName = e.target.closest('tr').cells[1].textContent;
                    if(button.disabled){ // If button is "Enable Account" (currently disabled)
                        if(confirm(`Are you sure you want to enable account for ${userName}?`)){
                            button.textContent = 'Disable Account';
                            button.disabled = false;
                            alert(`${userName}'s account enabled. (Mock)`);
                        }
                    } else { // If button is "Disable Account"
                         if(confirm(`Are you sure you want to disable account for ${userName}?`)){
                            button.textContent = 'Enable Account';
                            // To make it visually look disabled, we could add a class or set disabled
                            // For this mock, we'll just change text and assume state changed.
                            // In a real scenario, the backend would confirm this.
                            // button.disabled = true; // Or toggle a class
                            alert(`${userName}'s account disabled. (Mock)`);
                        }
                    }
                }
            });
        }
    }

});
