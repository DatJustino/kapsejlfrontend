"use strict";
console.log('boattable.js loaded');
const endpoint = "http://localhost:8080/sejlbaade";

document.addEventListener('DOMContentLoaded', function () {
    updateBoatTable();
});

const boatTable = document.querySelector('#boatTable');
const addBoatBtn = document.querySelector('#addBoatBtn');
const addBoatModal = document.querySelector('#addBoatModal');
const editBoatModal = document.querySelector('#editBoatModal');
const confirmDeleteButton = document.querySelector('#confirmDeleteButton');

addBoatBtn.addEventListener('click', function () {
    showAddBoatModal();
});
document.querySelector('#addBoatForm').addEventListener('submit', createBoat);
document.querySelector('#editBoatModal form').addEventListener('submit', updateBoat);
confirmDeleteButton.addEventListener('click', function () {
    const boatId = confirmDeleteButton.dataset.boatId;
    deleteButtonClicked(boatId);
});
boatTable.addEventListener('click', function (event) {
    if (event.target.classList.contains('editCourseButton')) {
        const boatId = event.target.dataset.boatId;
        showEditBoatModal(boatId);
    } else if (event.target.classList.contains('deleteCourseButton')) {
        const boatId = event.target.dataset.boatId;
        deleteButtonClicked(boatId);
    }
});
async function fetchBoats() {
    try {
        const response = await fetch(`${endpoint}`);
        const boats = await response.json();
        return boats;
    } catch (error) {
        console.error('Error fetching boats:', error);
        return null;
    }
}

async function fetchBoatById(boatId) {
    try {
        const response = await fetch(`${endpoint}/${boatId}`);
        const boat = await response.json();
        console.log(boat);
        return boat;
    } catch (error) {
        console.error(`Error fetching boat with ID ${boatId}:`, error);
        return null;
    }
}

async function createBoat(event) {
    event.preventDefault();

    const boatName = document.querySelector('#addBoatNavn').value;
    const boatType = document.querySelector('#addBoatType').value;

    if (!boatName || !boatType) {
        console.error('Both boat name and type must be provided.');
        return;
    }

    const boat = { baadNavn: boatName, baadType: boatType };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boat),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Boat created successfully.');
        addBoatModal.style.display = 'none';
        await updateBoatTable();
    } catch (error) {
        console.error('Error creating boat:', error);
    }
}

async function showEditBoatModal(boatId) {
    const boat = await fetchBoatById(boatId);

    if (boat) {
        document.querySelector('#updateBoatId').value = boat.id;
        document.querySelector('#updateBoatNavn').value = boat.baadNavn;
        document.querySelector('#updateBoatType').value = boat.baadType;
        editBoatModal.style.display = 'block';
    } else {
        console.error(`Boat with ID ${boatId} not found.`);
    }
}

async function updateBoat(event) {
    event.preventDefault();

    const boatId = document.querySelector('#updateBoatId').value;
    const boatName = document.querySelector('#updateBoatNavn').value;
    const boatType = document.querySelector('#updateBoatType').value;

    const boat = { id: boatId, baadNavn: boatName, baadType: boatType };

    try {
        const response = await fetch(`${endpoint}/${boatId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boat),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Boat updated successfully.');
        editBoatModal.style.display = 'none';
        await updateBoatTable();
    } catch (error) {
        console.error('Error updating boat:', error);
    }
}

async function deleteBoat(boatId) {
    try {
        const response = await fetch(`${endpoint}/${boatId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Boat with ID ${boatId} deleted successfully.`);
        return true;
    } catch (error) {
        console.error(`Error deleting boat with ID ${boatId}:`, error);
        return false;
    }
}

async function updateBoatTable() {
    try {
        const boats = await fetchBoats();
        const boatTableBody = document.querySelector('#boatTableBody');
        boatTableBody.innerHTML = '';

        boats.forEach((boat, index) => {
            const row = document.createElement('tr');
            row.className = index % 2 === 0 ? 'even' : 'odd';
            row.innerHTML = `
        <td>${boat.id}</td>
        <td>${boat.baadNavn}</td>
        <td>${boat.baadType}</td>
        <td>
          <button class="editCourseButton btn" data-boat-id="${boat.id}">Edit</button>
          <button class="deleteCourseButton btn" data-boat-id="${boat.id}">Delete</button>
        </td>
      `;

            boatTableBody.appendChild(row);
        });

        console.log('Boat table updated.');
    } catch (error) {
        console.error('Error updating boat table:', error);
    }
}

function showAddBoatModal() {
    addBoatModal.style.display = 'block';
}

function boatTableClicked(event) {
    if (event.target.classList.contains('editCourseButton')) {
        const boatId = event.target.dataset.boatId;
        showEditBoatModal(boatId);
    } else if (event.target.classList.contains('deleteCourseButton')) {
        const boatId = event.target.dataset.boatId;
        deleteButtonClicked(boatId);
    }
}

async function deleteButtonClicked(boatId) {
    const success = await deleteBoat(boatId);

    if (success) {
        await updateBoatTable();
    } else {
        console.error(`Error deleting boat with ID ${boatId}.`);
    }
}

window.onload = async function () {
    await updateBoatTable();
};
