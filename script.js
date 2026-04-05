(function () {
    'use strict';

    let unit = 'metric'; // 'metric' or 'imperial'

    const form = document.getElementById('bmi-form');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const heightUnit = document.getElementById('height-unit');
    const weightUnit = document.getElementById('weight-unit');
    const heightError = document.getElementById('height-error');
    const weightError = document.getElementById('weight-error');
    const heightInputs = document.getElementById('height-inputs');
    const resultDiv = document.getElementById('result');
    const bmiNumber = document.getElementById('bmi-number');
    const bmiCategory = document.getElementById('bmi-category');
    const bmiRange = document.getElementById('bmi-range');
    const btnMetric = document.getElementById('btn-metric');
    const btnImperial = document.getElementById('btn-imperial');
    const btnReset = document.getElementById('btn-reset');

    // --- Unit toggle ---
    btnMetric.addEventListener('click', function () {
        if (unit === 'metric') return;
        unit = 'metric';
        btnMetric.classList.add('active');
        btnImperial.classList.remove('active');
        switchToMetric();
    });

    btnImperial.addEventListener('click', function () {
        if (unit === 'imperial') return;
        unit = 'imperial';
        btnImperial.classList.add('active');
        btnMetric.classList.remove('active');
        switchToImperial();
    });

    function switchToMetric() {
        heightInputs.innerHTML =
            '<div class="input-wrapper">' +
            '<input type="number" id="height" placeholder="175" min="0" step="any">' +
            '<span class="unit-label" id="height-unit">cm</span>' +
            '</div>';
        weightUnit.textContent = 'kg';
        weightInput.placeholder = '70';
        clearErrors();
        hideResult();
    }

    function switchToImperial() {
        heightInputs.innerHTML =
            '<div class="input-wrapper">' +
            '<input type="number" id="height-ft" placeholder="5" min="0" step="1">' +
            '<span class="unit-label">ft</span>' +
            '</div>' +
            '<div class="input-wrapper">' +
            '<input type="number" id="height-in" placeholder="9" min="0" step="any">' +
            '<span class="unit-label">in</span>' +
            '</div>';
        weightUnit.textContent = 'lbs';
        weightInput.placeholder = '154';
        clearErrors();
        hideResult();
    }

    // --- Validation ---
    function validate() {
        let valid = true;
        clearErrors();

        if (unit === 'metric') {
            const h = getVal('height');
            if (h === null || h <= 0) {
                showError('height-error', 'Please enter a valid height in cm.');
                markInvalid('height');
                valid = false;
            } else if (h < 30 || h > 300) {
                showError('height-error', 'Height should be between 30 and 300 cm.');
                markInvalid('height');
                valid = false;
            }
        } else {
            const ft = getVal('height-ft');
            const inches = getVal('height-in');
            if ((ft === null || ft < 0) && (inches === null || inches < 0)) {
                showError('height-error', 'Please enter a valid height.');
                markInvalid('height-ft');
                valid = false;
            } else {
                var totalIn = (ft || 0) * 12 + (inches || 0);
                if (totalIn <= 0) {
                    showError('height-error', 'Height must be greater than zero.');
                    markInvalid('height-ft');
                    valid = false;
                } else if (totalIn < 12 || totalIn > 108) {
                    showError('height-error', 'Height should be between 1 ft and 9 ft.');
                    markInvalid('height-ft');
                    valid = false;
                }
            }
        }

        var w = getVal('weight');
        if (w === null || w <= 0) {
            showError('weight-error', 'Please enter a valid weight.');
            markInvalid('weight');
            valid = false;
        } else if (unit === 'metric' && (w < 10 || w > 500)) {
            showError('weight-error', 'Weight should be between 10 and 500 kg.');
            markInvalid('weight');
            valid = false;
        } else if (unit === 'imperial' && (w < 22 || w > 1100)) {
            showError('weight-error', 'Weight should be between 22 and 1100 lbs.');
            markInvalid('weight');
            valid = false;
        }

        return valid;
    }

    function getVal(id) {
        var el = document.getElementById(id);
        if (!el) return null;
        var v = parseFloat(el.value);
        return isNaN(v) ? null : v;
    }

    function showError(id, msg) {
        document.getElementById(id).textContent = msg;
    }

    function markInvalid(id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('invalid');
    }

    function clearErrors() {
        heightError.textContent = '';
        weightError.textContent = '';
        document.querySelectorAll('.invalid').forEach(function (el) {
            el.classList.remove('invalid');
        });
    }

    // --- Calculation ---
    function calculateBMI() {
        var heightM, weightKg;

        if (unit === 'metric') {
            heightM = getVal('height') / 100;
            weightKg = getVal('weight');
        } else {
            var ft = getVal('height-ft') || 0;
            var inches = getVal('height-in') || 0;
            var totalInches = ft * 12 + inches;
            heightM = totalInches * 0.0254;
            weightKg = getVal('weight') * 0.453592;
        }

        return weightKg / (heightM * heightM);
    }

    function getCategory(bmi) {
        if (bmi < 18.5) return { label: 'Underweight', css: 'underweight' };
        if (bmi < 25) return { label: 'Normal weight', css: 'normal' };
        if (bmi < 30) return { label: 'Overweight', css: 'overweight' };
        return { label: 'Obese', css: 'obese' };
    }

    function showResult(bmi) {
        var cat = getCategory(bmi);
        bmiNumber.textContent = bmi.toFixed(1);
        bmiCategory.textContent = cat.label;
        bmiCategory.className = 'bmi-category ' + cat.css;
        bmiRange.textContent = 'Underweight < 18.5 | Normal 18.5\u201324.9 | Overweight 25\u201329.9 | Obese \u2265 30';
        resultDiv.classList.remove('hidden');
    }

    function hideResult() {
        resultDiv.classList.add('hidden');
    }

    // --- Events ---
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validate()) return;
        var bmi = calculateBMI();
        showResult(bmi);
    });

    btnReset.addEventListener('click', function () {
        form.reset();
        clearErrors();
        hideResult();
        // Reset imperial inputs if present
        if (unit === 'imperial') {
            var ftEl = document.getElementById('height-ft');
            var inEl = document.getElementById('height-in');
            if (ftEl) ftEl.value = '';
            if (inEl) inEl.value = '';
        }
    });
})();
