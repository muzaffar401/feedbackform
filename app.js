document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("feedbackForm");
    var btn = document.getElementById("submitBtn");

    var nameInput = document.getElementById("name");
    var phoneInput = document.getElementById("phone");
    var messageInput = document.getElementById("message");
    var ratingInputs = document.querySelectorAll("input[name='rating']");

    var nameError = document.getElementById("nameError");
    var phoneError = document.getElementById("phoneError");
    var messageError = document.getElementById("messageError");
    var ratingError = document.getElementById("ratingError"); // Add a span to show rating error

    var namePattern = /^[a-zA-Z\s]{3,12}$/;
    var phonePattern = /^[0-9]{11}$/;

    function validateName() {
        var nameValue = nameInput.value.trim();
        if (nameValue === "") {
            nameError.textContent = "Please fill out this field.";
            nameInput.classList.add("light-form__control--error");
        } else if (!namePattern.test(nameValue)) {
            nameError.textContent = "Name should be 3-12 characters and contain only letters.";
            nameInput.classList.add("light-form__control--error");
        } else {
            nameError.textContent = "";
            nameInput.classList.remove("light-form__control--error");
            nameInput.classList.add("light-form__control--active");
        }
    }

    function validatePhone() {
        var phoneValue = phoneInput.value.trim();
        if (phoneValue === "") {
            phoneError.textContent = "Please fill out this field.";
            phoneInput.classList.add("light-form__control--error");
        } else if (phoneValue.length < 11) {
            phoneError.textContent = "Phone number should contain exactly 11 digits.";
            phoneInput.classList.add("light-form__control--error");
        } else if (!phonePattern.test(phoneValue)) {
            phoneError.textContent = "Phone number should contain only digits and be 11 digits long.";
            phoneInput.classList.add("light-form__control--error");
        } else {
            phoneError.textContent = "";
            phoneInput.classList.remove("light-form__control--error");
            phoneInput.classList.add("light-form__control--active");
        }
    }

    function validateMessage() {
        var messageValue = messageInput.value.trim();
        if (messageValue === "") {
            messageError.textContent = "Please fill out this field.";
            messageInput.classList.add("light-form__control--error");
        } else {
            messageError.textContent = "";
            messageInput.classList.remove("light-form__control--error");
            messageInput.classList.add("light-form__control--active");
        }
    }

    function validateRating() {
        var ratingChecked = false;
        var selectedRating = '';

        ratingInputs.forEach(function (ratingInput) {
            if (ratingInput.checked) {
                ratingChecked = true;
                switch (ratingInput.id) {
                    case "rating-1":
                        selectedRating = "bad";
                        break;
                    case "rating-2":
                        selectedRating = "good";
                        break;
                    case "rating-3":
                        selectedRating = "average";
                        break;
                    case "rating-4":
                        selectedRating = "excellent";
                        break;
                    case "rating-5":
                        selectedRating = "very excellent";
                        break;
                }
            }
        });

        if (!ratingChecked) {
            ratingError.textContent = "Please select a rating.";
        } else {
            ratingError.textContent = "";
        }

        return { isValid: ratingChecked, rating: selectedRating };
    }

    function validateAll() {
        validateName();
        validatePhone();
        validateMessage();
        return validateRating(); // Now this returns an object with rating and validity
    }

    nameInput.addEventListener("keyup", validateAll);
    phoneInput.addEventListener("keyup", validateAll);
    messageInput.addEventListener("keyup", validateAll);

    btn.addEventListener("click", function (e) {
        var ratingValidation = validateAll(); // Validate all fields including rating

        if (
            nameInput.value.trim() === "" ||
            !namePattern.test(nameInput.value) ||
            phoneInput.value.trim() === "" ||
            phoneInput.value.length < 11 ||
            !phonePattern.test(phoneInput.value) ||
            messageInput.value.trim() === "" ||
            !ratingValidation.isValid // Prevent submission if no rating is selected
        ) {
            e.preventDefault(); // Prevent form submission if validation fails
        } else {
            // Retrieve existing form data from localStorage, if available
            var existingData = JSON.parse(localStorage.getItem("formData")) || [];

            // Create the new form data entry
            var newEntry = {
                name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                message: messageInput.value.trim(),
                rating: ratingValidation.rating // Save the rating based on the selected star
            };

            // Add the new entry to the array of existing data
            existingData.push(newEntry);

            // Save the updated data back to localStorage
            localStorage.setItem("formData", JSON.stringify(existingData));

            alert("Form submitted successfully and data saved to local storage.");
        }
    });

    form.addEventListener('input', function (e) {
        var thisInput = e.target;
        var parent = thisInput.nextElementSibling;

        if (thisInput.value.trim() !== '') {
            thisInput.classList.add('light-form__control--active');
            parent.classList.add('light-form__label--active');
        } else {
            thisInput.classList.remove('light-form__control--active');
            parent.classList.remove('light-form__label--active');
        }
    });

    // Prevent submission if required fields are blank
    var requiredInputs = Array.prototype.slice.call(form.querySelectorAll('.light-form__control[required]'));
    btn.addEventListener('click', function (e) {
        requiredInputs.forEach(function (ear) {
            if (ear.value.trim() === '') {
                e.preventDefault();
                ear.classList.add('light-form__control--error');
            } else {
                ear.classList.remove('light-form__control--error');
            }
        });
    });

});
