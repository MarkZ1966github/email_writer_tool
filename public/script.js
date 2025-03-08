document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const emailOutput = document.getElementById('emailOutput');
    const copyBtn = document.getElementById('copyBtn');
    const loader = document.getElementById('loader');

    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loader
        emailOutput.innerHTML = '';
        loader.style.display = 'block';
        copyBtn.disabled = true;
        
        // Get form values
        const topic = document.getElementById('topic').value;
        const style = document.getElementById('style').value;
        const cta = document.getElementById('cta').value;
        const ctaLink = document.getElementById('ctaLink').value;
        const emailType = document.querySelector('input[name="emailType"]:checked').value;
        
        // Prepare data for API request
        const requestData = {
            topic,
            style,
            cta,
            ctaLink,
            emailType
        };
        
        // Send request to backend
        fetch('/generate-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Hide loader
            loader.style.display = 'none';
            
            console.log('Received data from server:', data);
            
            // Display the generated email
            const emailContent = `
                <div class="mb-3">
                    <strong>Subject:</strong> ${data.subject || 'No subject provided'}
                </div>
                <div class="mb-3">
                    <strong>Preview:</strong> ${data.preview || 'No preview provided'}
                </div>
                <hr>
                <div class="email-body">
                    ${data.body || 'No email body provided'}
                </div>
            `;
            
            emailOutput.innerHTML = emailContent;
            copyBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            loader.style.display = 'none';
            
            // Try to parse the error response
            error.response?.json()
                .then(errorData => {
                    emailOutput.innerHTML = `
                        <div class="alert alert-danger">
                            <strong>${errorData.error || 'Error generating email'}</strong>
                            ${errorData.details ? '<p>' + errorData.details + '</p>' : ''}
                            <p>Please check the OpenAI API key in your .env file and ensure it has available credits.</p>
                        </div>`;
                })
                .catch(() => {
                    emailOutput.innerHTML = `
                        <div class="alert alert-danger">
                            <strong>Error generating email</strong>
                            <p>The OpenAI API may not be responding or your API key may have insufficient credits.</p>
                            <p>Please check your API key and try again.</p>
                        </div>`;
                });
        });
    });
    
    // Copy to clipboard functionality
    copyBtn.addEventListener('click', function() {
        const emailText = emailOutput.innerText;
        navigator.clipboard.writeText(emailText)
            .then(() => {
                const originalText = copyBtn.innerText;
                copyBtn.innerText = 'Copied!';
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    });
});