// admin-scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const positionForm = document.getElementById('add-position-form');
    const candidateForm = document.getElementById('add-candidate-form');
    const positionSelect = document.getElementById('candidate-position');
    const posMsg = document.getElementById('position-message');
    const candMsg = document.getElementById('candidate-message');
    
    // Note: Admin actions require authentication. We assume the admin is already logged in
    // and would have a valid token. This token would need to be sent in the headers.

    // 1. Fetch existing positions and populate the dropdown
    function populatePositions() {
        fetch('http://127.0.0.1:8000/api/positions/')
            .then(res => res.json())
            .then(positions => {
                positionSelect.innerHTML = '<option value="">-- Select a position --</option>';
                positions.forEach(pos => {
                    const option = document.createElement('option');
                    option.value = pos.id;
                    option.textContent = pos.title;
                    positionSelect.appendChild(option);
                });
            });
    }

    // 2. Handle "Add Position" form submission
    positionForm.addEventListener('submit', event => {
        event.preventDefault();
        const title = document.getElementById('position-title').value;
        
        fetch('http://127.0.0.1:8000/api/positions/add/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title }),
        })
        .then(res => res.ok ? res.json() : Promise.reject('Failed to add position'))
        .then(data => {
            posMsg.textContent = `Successfully added position: ${data.title}`;
            posMsg.className = 'message success';
            positionForm.reset();
            populatePositions(); // Refresh the dropdown in the other form
        })
        .catch(err => {
            posMsg.textContent = 'Error: Position may already exist.';
            posMsg.className = 'message error';
        });
    });

    // 3. Handle "Add Candidate" form submission
    candidateForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('candidate-name').value;
        const position = positionSelect.value;

        fetch('http://127.0.0.1:8000/api/candidates/add/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, position }),
        })
        .then(res => res.ok ? res.json() : Promise.reject('Failed to add candidate'))
        .then(data => {
            candMsg.textContent = `Successfully added candidate.`;
            candMsg.className = 'message success';
            candidateForm.reset();
        })
        .catch(err => {
            candMsg.textContent = 'Error adding candidate.';
            candMsg.className = 'message error';
        });
    });

    // Initial load
    populatePositions();
});