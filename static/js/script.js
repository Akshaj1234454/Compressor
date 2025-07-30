document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const compressForm = document.querySelector('form');
    let dragCounter = 0;

    // Drag and drop functionality
    dropZone.addEventListener('dragenter', function(e) {
        e.preventDefault();
        dragCounter++;
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dragCounter--;
        if (dragCounter === 0) {
            dropZone.classList.remove('drag-over');
        }
    });

    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dragCounter = 0;
        dropZone.classList.remove('drag-over');
        handleFileSelection(e.dataTransfer.files);
    });

    // Click and keyboard handling
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });

    // File input change
    fileInput.addEventListener('change', e => handleFileSelection(e.target.files));

    // Form submission handler
    compressForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (fileInput.files.length === 0) {
            alert('Please select at least one image file to compress.');
            return;
        }

        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Compressing...';
            submitButton.disabled = true;
        }

        // Get selected quality option
        const selectedQuality = document.querySelector('input[name="qualitySelector"]:checked');
        if (!selectedQuality) {
            alert('Please select a quality option.');
            if (submitButton) {
                submitButton.textContent = 'Compress';
                submitButton.disabled = false;
            }
            return;
        }

        const formData = new FormData();
        formData.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);
        formData.append('qualitySelector', selectedQuality.value);
        
        // Add files to form data
        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('images', fileInput.files[i]);
        }
        
        console.log('Submitting form with:', {
            quality: selectedQuality.value,
            fileCount: fileInput.files.length
        });
        
        fetch(this.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Response received:', {
                ok: response.ok,
                status: response.status,
                contentType: response.headers.get('Content-Type'),
                contentDisposition: response.headers.get('Content-Disposition')
            });

            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Server error occurred');
                });
            }

            // Check if we got a file response
            const contentDisposition = response.headers.get('Content-Disposition');
            if (!contentDisposition || !contentDisposition.includes('attachment')) {
                throw new Error('Invalid server response - no file received');
            }
            
            const filenameMatch = contentDisposition && contentDisposition.match(/filename="?([^"]+)"?/);
            const filename = filenameMatch ? filenameMatch[1] : 'compressed_file';

            // Convert the response to a blob
            return response.blob().then(blob => {
                // Create a download link and trigger it
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                
                // Reset the button
                if (submitButton) {
                    submitButton.textContent = 'Compress';
                    submitButton.disabled = false;
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please make sure all files are valid images and try again.');
            if (submitButton) {
                submitButton.textContent = 'Compress';
                submitButton.disabled = false;
            }
            // Reset the form to allow new submissions
            dropZone.innerHTML = `
                <p class="drop-zone-text">
                    Drag and drop your pictures or <br>
                    click to browse
                </p>
            `;
            fileInput.value = '';
        });
    });

    // File selection handler
    function handleFileSelection(files) {
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (validFiles.length > 0) {
            const fileNames = validFiles.map(file => file.name).join(', ');
            dropZone.innerHTML = `
                <p class="drop-zone-text">Selected files:</p>
                <p class="selected-files">${fileNames}</p>
            `;
            
            // Update the file input
            const dataTransfer = new DataTransfer();
            validFiles.forEach(file => dataTransfer.items.add(file));
            fileInput.files = dataTransfer.files;
        } else {
            dropZone.innerHTML = `
                <p class="drop-zone-text">
                    Drag and drop your pictures or <br>
                    click to browse
                </p>
            `;
            alert('Please select valid image files.');
        }
    }

    // Make drop zone focusable
    dropZone.setAttribute('tabindex', '0');
});
