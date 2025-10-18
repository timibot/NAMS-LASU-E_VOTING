// vote-scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const candidatesGrid = document.getElementById('candidates-grid');
    const messageDiv = document.getElementById('vote-message');

    // --- Part 1: Fetch and Display Candidates ---
    function loadCandidates() {
        // NOTE: This endpoint requires the user to be authenticated.
        // We'll add the token logic later.
        fetch('http://127.0.0.1:8000/api/candidates/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Could not fetch candidates. You may not be logged in.');
                }
                return response.json();
            })
            .then(candidates => {
                // Clear any loading text
                candidatesGrid.innerHTML = ''; 

                if (candidates.length === 0) {
                    candidatesGrid.innerHTML = '<p>No candidates have been registered yet.</p>';
                    return;
                }

                // Create a card for each candidate
                candidates.forEach(candidate => {
                    const card = document.createElement('article');
                    card.className = 'card candidate-card';
                    card.innerHTML = `
                        <div class="card-media candidate-photo" style="background-image:url('images/placeholder.png')"></div>
                        <div class="card-body">
                            <h3 class="card-heading">${candidate.name}</h3>
                            <p class="card-text small">Total Votes: ${candidate.total_votes}</p>
                            <button class="vote-btn" data-id="${candidate.id}">Vote for ${candidate.name}</button>
                        </div>
                    `;
                    candidatesGrid.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error loading candidates:', error);
                messageDiv.textContent = error.message;
                messageDiv.className = 'error';
            });
    }

    // --- Part 2: Handle Voting ---
    candidatesGrid.addEventListener('click', (event) => {
        // Check if a vote button was clicked
        if (event.target.classList.contains('vote-btn')) {
            const button = event.target;
            const candidateId = button.dataset.id;
            
            // Confirm the vote
            if (!confirm(`Are you sure you want to vote for ${button.textContent.replace('Vote for ', '')}?`)) {
                return;
            }

            // NOTE: This endpoint also requires authentication
            fetch('http://127.0.0.1:8000/api/vote/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${yourAuthToken}` // We will add this later
                },
                body: JSON.stringify({
                    candidate_id: candidateId,
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    messageDiv.textContent = data.message + ". Thank you for voting!";
                    messageDiv.className = 'success';

                    // Disable all vote buttons after a successful vote
                    document.querySelectorAll('.vote-btn').forEach(btn => {
                        btn.disabled = true;
                        btn.textContent = 'Voted';
                    });
                } else {
                    throw new Error(data.error || 'An unknown error occurred.');
                }
            })
            .catch(error => {
                console.error('Error casting vote:', error);
                messageDiv.textContent = 'Failed to cast vote. ' + error.message;
                messageDiv.className = 'error';
            });
        }
    });

    // --- Initial Load ---
    loadCandidates();
});