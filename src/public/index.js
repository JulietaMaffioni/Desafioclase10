const socket = io();
const form = document.getElementById('form');
const productsTable = document.querySelector('#productsTable');
const tbody = productsTable.querySelector('#tbody');

function clearFormFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#price').value = '';
    document.querySelector('#code').value = '';
    document.querySelector('#category').value = '';
    document.querySelector('#stock').value = '';
}

function displayToast(message, backgroundColor) {
    Toastify({
        text: message,
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: 'top', 
        position: 'right',
        stopOnFocus: true, 
        style: {
            background: backgroundColor,
            borderRadius: '10px',
            fontWeight: '600',
        },
        onClick: function(){} 
    }).showToast();
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let product = {
        title: document.querySelector('#title').value,
        description: document.querySelector('#description').value,
        price: parseFloat(document.querySelector('#price').value),
        code: document.querySelector('#code').value,
        category: document.querySelector('#category').value,
        stock: parseInt(document.querySelector('#stock').value),
    };

    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await res.json();

        if (res.ok) {
            socket.emit('newProduct', result.product);
            displayToast('New product added successfully', '#32CD32');
            clearFormFields();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.log(error);
        displayToast('Failed to create a new product', '#DC143C');
    }
});

function deleteProduct(id) {
    try {
        fetch(`/api/products/${id}`, {
            method: 'DELETE',
        });

        socket.emit('deleteProduct', id);
        displayToast('Product removed successfully', '#DC143C');
    } catch (error) {
        console.log(error);
    }
}

socket.emit('updatedProducts', (products) => {
    tbody.innerHTML = '';

    products.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>${item.price}</td>
            <td>${item.code}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>
                <button class='btn btn-danger' onclick='deleteProduct(${item.id})'>Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
});
