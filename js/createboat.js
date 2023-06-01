const form = document.getElementById('addBoatForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const baadNavn = document.getElementById('baadNavn').value;
    const baadType = document.getElementById('baadType').value;

    const boatData = {
        baadNavn: baadNavn,
        baadType: baadType
    };

    fetch('http://localhost:8080/sejlbaade', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(boatData)
    })
        .then(response => response.json())
        .then(data => {
            // Handle successful response from the backend
            console.log('Boat added successfully:', data);
            // You can redirect to another page or perform any other actions here
        })
        .catch(error => {
            // Handle error
            console.error('Error adding boat:', error);
        });
});