
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

    const inputFilters = {
        text: /[a-zA-Z0-9 \-]/,
        gps: /[\d\-.,\s]/,
        positiveNumber: /[\d.]/,
        anyNumber: /[\d.\-]/,
        numbersOnly: /[\d.]/,
        notes: /[a-zA-Z0-9 .,\-]/
    };

    const fields = [
        { id: 'trail_name', validators: ['required', 'text'], inputFilter: 'text', errorMessage: 'Trail name is required and may only contain letters, numbers, spaces, and hyphens.' },
        { id: 'location', validators: ['required', 'text'], inputFilter: 'text', errorMessage: 'Location is required and may only contain letters, numbers, spaces, and hyphens.' },
        { id: 'gps', validators: ['gps'], inputFilter: 'gps', errorMessage: 'Please enter valid coordinates in format: Latitude, Longitude (e.g., 37.7749, -122.4194)' },
        { id: 'notes', validators: ['notes'], inputFilter: 'notes', errorMessage: 'May only contain letters, numbers, spaces, full stops, commas, and hyphens.' }
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
            switch (validatorName) {
                case 'required': validatorResult = validators.requiredValidator(value); break;
                case 'text': validatorResult = validators.textValidator(value); break;
                case 'gps': validatorResult = validators.gpsValidator(value); break;
                case 'positiveNumber': validatorResult = validators.positiveNumberValidator(value); break;
                case 'anyNumber': validatorResult = validators.anyNumberValidator(value); break;
                case 'numbersOnly': validatorResult = validators.numbersOnlyValidator(value); break;
                case 'notes': validatorResult = validators.notesValidator(value); break;
                case 'file': validatorResult = validators.fileValidator(value); break;
            }
            if (!validatorResult) isValid = false;
        });

        if (!isValid) {
            element.classList.add('error-border');
            element.classList.remove('valid-border');
            if (errorElement) errorElement.style.display = 'block';
        } else {
            element.classList.remove('error-border');
            element.classList.add('valid-border');
            if (errorElement) errorElement.style.display = 'none';
        }

        return isValid;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let isFormValid = true;
        fields.forEach(field => {
            if (!validateField(field)) isFormValid = false;
        });
        if (isFormValid) {
            form.submit();  // ✅ Final fix
        } else {
            const firstErrorField = document.querySelector('.error-border');
            if (firstErrorField) {
                firstErrorField.focus();
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});
