"use strict";
console.log('racetable.js loaded');
const endpoint = "http://localhost:8080/kapsejladser";

document.addEventListener('DOMContentLoaded', function () {
    updateRaceTable();
});

const raceTable = document.querySelector('#raceTable');
const raceTableBody = document.querySelector('#raceTableBody');

async function fetchRaces() {
    try {
        const response = await fetch(endpoint);
        const races = await response.json();
        return races;
    } catch (error) {
        console.error('Error fetching races:', error);
        return null;
    }
}

async function updateRaceTable() {
    try {
        const races = await fetchRaces();
        raceTableBody.innerHTML = '';

        races.forEach((race) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${race.dato}</td>
                <td>
                    <button class="viewRaceButton btn" data-race-id="${race.id}">View</button>
                </td>
            `;

            raceTableBody.appendChild(row);
        });

        console.log('Race table updated.');
    } catch (error) {
        console.error('Error updating race table:', error);
    }
}

raceTable.addEventListener('click', async (event) => {
    if (event.target.classList.contains('viewRaceButton')) {
        const raceId = event.target.dataset.raceId;
        // Fetch the participants' standings for the selected race
        const response = await fetch(`${endpoint}/${raceId}/sejlbaade`);
        const participants = await response.json();
        displayParticipantsStandings(participants);
    }
});

function displayParticipantsStandings(participants) {
    const participantsTable = document.getElementById('participantsTable');

    // Clear the table
    participantsTable.innerHTML = '';

    // Create table headers
    const tableHeaders = ['Position', 'Participant Name', 'Boat Name'];
    const headerRow = document.createElement('tr');

    tableHeaders.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    participantsTable.appendChild(headerRow);

    // Create table rows for each participant
    participants.forEach((participant, index) => {
        const row = document.createElement('tr');

        const positionCell = document.createElement('td');
        positionCell.textContent = index + 1;
        row.appendChild(positionCell);

        const participantNameCell = document.createElement('td');
        participantNameCell.textContent = participant.participantName;
        row.appendChild(participantNameCell);

        const boatNameCell = document.createElement('td');
        boatNameCell.textContent = participant.boatName;
        row.appendChild(boatNameCell);

        participantsTable.appendChild(row);
    });

    // Display the modal
    const raceModal = document.getElementById('raceModal');
    raceModal.style.display = 'block';

    // Close the modal when the user clicks on the close button or outside the modal
    const closeBtn = document.getElementsByClassName('close')[0];
    window.onclick = function(event) {
        if (event.target === raceModal || event.target === closeBtn) {
            raceModal.style.display = 'none';
        }
    };
}

window.onload = async function () {
    await updateRaceTable();
};
