'use strict';

fetch('http://localhost:8080/sejlbaade')
    .then(response => response.json())
    .then(data => {
        const boatTable = document.getElementById('boatTable');
        const tbody = boatTable.querySelector('tbody');
        console.log(data);
        data.forEach(boat => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${boat.id}</td>
                        <td>${boat.baadNavn}</td>
                        <td>${boat.baadTypeDisplayName}</td>
                    `;
            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching boat data:', error);
    });