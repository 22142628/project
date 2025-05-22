document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('trailForm');
    
    const validators = {
        textValidator: function(value) {
            return /^[a-zA-Z0-9 \-]*$/.test(value);
        },
        
        gpsValidator: function(value) {
            if (!value.trim()) return true; 
            
            const gpsRegex = /^-?\d{1,2}(\.\d+)?,\s*-?\d{1,3}(\.\d+)?$/;
            if (!gpsRegex.test(value)) return false;
            
            const [lat, lng] = value.split(',').map(coord => parseFloat(coord.trim()));
            return (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180);
        },
        
        positiveNumberValidator: function(value) {
            const num = parseFloat(value);
            return !isNaN(num) && num > 0;
        },
        
        anyNumberValidator: function(value) {
            const num = parseFloat(value);
            return !isNaN(num);
        },
        
        numbersOnlyValidator: function(value) {
            return /^[0-9.]+$/.test(value) && !isNaN(parseFloat(value)) && parseFloat(value) > 0;
        },
        
        requiredValidator: function(value) {
            return value.trim() !== '';
        },
        
        notesValidator: function(value) {
            if (!value.trim()) return true; 
            return /^[a-zA-Z0-9 .,\-]*$/.test(value);
        },
        
        fileValidator: function(fileList) {
            if (fileList.length === 0) return true; 
            
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            for (let i = 0; i < fileList.length; i++) {
                if (!validTypes.includes(fileList[i].type)) {
                    return false;
                }
            }
            return true;
        }
    };
    
    // Input filter patterns for each field type
    const inputFilters = {
        text: /[a-zA-Z0-9 \-]/,
        gps: /[\d\-.,\s]/,
        positiveNumber: /[\d.]/,
        anyNumber: /[\d.\-]/,
        numbersOnly: /[\d.]/,
        notes: /[a-zA-Z0-9 .,\-]/
    };
    
    const fields = [
        { 
            id: 'trail_name', 
            validators: ['required', 'text'],
            inputFilter: 'text',
            errorMessage: 'Trail name is required and may only contain letters, numbers, spaces, and hyphens.' 
        },
        { 
            id: 'location', 
            validators: ['required', 'text'],
            inputFilter: 'text',
            errorMessage: 'Location is required and may only contain letters, numbers, spaces, and hyphens.' 
        },
        { 
            id: 'gps', 
            validators: ['gps'],
            inputFilter: 'gps',
            errorMessage: 'Please enter valid coordinates in format: Latitude, Longitude (e.g., 37.7749, -122.4194)' 
        },
        { 
            id: 'start_end', 
            validators: ['text'],
            inputFilter: 'text',
            errorMessage: 'May only contain letters, numbers, spaces, and hyphens.' 
        },
        { 
            id: 'distance', 
            validators: ['required', 'positiveNumber'],
            inputFilter: 'positiveNumber',
            errorMessage: 'Distance is required and must be a positive number.' 
        },
        { 
            id: 'elevation', 
            validators: ['required', 'anyNumber'],
            inputFilter: 'anyNumber',
            errorMessage: 'Elevation gain is required and must be a number.' 
        },
        { 
            id: 'difficulty', 
            validators: ['required'],
            errorMessage: 'Please select a difficulty level.' 
        },
        { 
            id: 'trail_type', 
            validators: ['required'],
            errorMessage: 'Please select a trail type.' 
        },
        { 
            id: 'estimated_time', 
            validators: ['required', 'numbersOnly'],
            inputFilter: 'numbersOnly',
            errorMessage: 'Estimated time is required and must be a positive number (numbers only).' 
        },
        { 
            id: 'hiker_biker', 
            validators: ['required'],
            errorMessage: 'Please select an option.' 
        },
        { 
            id: 'completed_as', 
            validators: ['required'],
            errorMessage: 'Please select an option.' 
        },
        { 
            id: 'photos', 
            validators: ['file'],
            errorMessage: 'Only image files are allowed (JPEG, PNG, GIF).' 
        },
        { 
            id: 'notes', 
            validators: ['notes'],
            inputFilter: 'notes',
            errorMessage: 'May only contain letters, numbers, spaces, full stops, commas, and hyphens.' 
        }
    ];
    
    function validateField(field) {
        const element = document.getElementById(field.id);
        const errorElement = document.getElementById(`${field.id}-error`);
        let isValid = true;
        
        field.validators.forEach(validatorName => {
            let value = element.value;
            
            if (field.id === 'photos') {
                value = element.files;
            }
            
            let validatorResult = true;
            switch(validatorName) {
                case 'required':
                    validatorResult = validators.requiredValidator(value);
                    break;
                case 'text':
                    validatorResult = validators.textValidator(value);
                    break;
                case 'gps':
                    validatorResult = validators.gpsValidator(value);
                    break;
                case 'positiveNumber': 
                    validatorResult = validators.positiveNumberValidator(value);
                    break;
                case 'anyNumber':
                    validatorResult = validators.anyNumberValidator(value);
                    break;
                case 'numbersOnly':
                    validatorResult = validators.numbersOnlyValidator(value);
                    break;
                case 'notes':
                    validatorResult = validators.notesValidator(value);
                    break;
                case 'file':
                    validatorResult = validators.fileValidator(value);
                    break;
            }
            
            if (!validatorResult) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            element.classList.add('error-border');
            element.classList.remove('valid-border');
            errorElement.style.display = 'block';
        } else {
            element.classList.remove('error-border');
            if (element.value.trim() !== '' || (field.id === 'photos' && element.files.length > 0)) {
                element.classList.add('valid-border');
            } else {
                element.classList.remove('valid-border');
            }
            errorElement.style.display = 'none';
        }
        
        return isValid;
    }
    
    // Apply input filtering to text fields
    fields.forEach(field => {
        const element = document.getElementById(field.id);
        
        // Skip non-input elements or file inputs
        if (!element || element.tagName !== 'INPUT' || element.type === 'file' || element.tagName === 'SELECT') {
            return;
        }
        
        // Apply input filtering if a filter is defined for this field
        if (field.inputFilter) {
            element.addEventListener('keypress', function(e) {
                const char = String.fromCharCode(e.charCode);
                const pattern = inputFilters[field.inputFilter];
                
                // Prevent the character if it doesn't match the pattern
                if (!pattern.test(char)) {
                    e.preventDefault();
                    return false;
                }
                
                // For GPS coordinates, add special validation for comma position
                if (field.inputFilter === 'gps') {
                    // Only allow one comma in the input
                    if (char === ',' && this.value.includes(',')) {
                        e.preventDefault();
                        return false;
                    }
                }
                
                // For number fields, prevent multiple decimal points
                if ((field.inputFilter === 'positiveNumber' || field.inputFilter === 'anyNumber' || field.inputFilter === 'numbersOnly') 
                    && char === '.' && this.value.includes('.')) {
                    e.preventDefault();
                    return false;
                }
                
                // For anyNumber fields, only allow minus sign at the beginning
                if (field.inputFilter === 'anyNumber' && char === '-' && this.value.length > 0) {
                    e.preventDefault();
                    return false;
                }
            });
            
            // Handle paste events to filter content being pasted
            element.addEventListener('paste', function(e) {
                // Get pasted data
                let pastedText;
                if (window.clipboardData && window.clipboardData.getData) {
                    pastedText = window.clipboardData.getData('Text');
                } else if (e.clipboardData && e.clipboardData.getData) {
                    pastedText = e.clipboardData.getData('text/plain');
                }
                
                // Check if all characters in the pasted text match the pattern
                if (pastedText) {
                    const pattern = new RegExp(`^[${inputFilters[field.inputFilter].source.slice(1, -1)}]*$`);
                    
                    if (!pattern.test(pastedText)) {
                        e.preventDefault();
                        return false;
                    }
                    
                    // Additional checks for specific field types
                    if (field.inputFilter === 'gps') {
                        // Verify the pasted text has at most one comma
                        if ((this.value.includes(',') && pastedText.includes(',')) || 
                            (pastedText.match(/,/g) || []).length > 1) {
                            e.preventDefault();
                            return false;
                        }
                    }
                    
                    if (field.inputFilter === 'positiveNumber' || field.inputFilter === 'anyNumber' || field.inputFilter === 'numbersOnly') {
                        // Verify the pasted text has at most one decimal point
                        if ((this.value.includes('.') && pastedText.includes('.')) || 
                            (pastedText.match(/\./g) || []).length > 1) {
                            e.preventDefault();
                            return false;
                        }
                    }
                    
                    if (field.inputFilter === 'anyNumber') {
                        // Verify the minus sign is only at the beginning
                        if ((this.value.length > 0 && pastedText.includes('-')) || 
                            (pastedText.indexOf('-') > 0)) {
                            e.preventDefault();
                            return false;
                        }
                    }
                }
            });
        }
        
        // Set up existing validation events
        element.addEventListener('blur', function() {
            validateField(field);
        });
        
        if (element.tagName === 'INPUT' && element.type !== 'file' || element.tagName === 'TEXTAREA') {
            element.addEventListener('input', function() {
                const errorElement = document.getElementById(`${field.id}-error`);
                element.classList.remove('error-border');
                errorElement.style.display = 'none';
            });
        }
        
        if (element.tagName === 'SELECT') {
            element.addEventListener('change', function() {
                validateField(field);
            });
        }
        
        if (element.type === 'file') {
            element.addEventListener('change', function() {
                validateField(field);
            });
        }
    });
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            alert('Form is valid! In a real application, this would submit the data.');
        } else {
            const firstErrorField = document.querySelector('.error-border');
            if (firstErrorField) {
                firstErrorField.focus();
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});