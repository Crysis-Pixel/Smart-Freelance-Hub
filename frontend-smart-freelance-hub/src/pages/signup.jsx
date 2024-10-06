import { useEffect, useState } from 'react';
import { fetchEx } from '../utils/common';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Signup() {
    const [countries, setCountries] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        country: '',
        phoneNumber: '',
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formError, setFormError] = useState(''); 
    const [isChecked, setIsChecked] = useState(false); // Track checkbox state

    // Fetch country data from the REST Countries API
    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then((response) => response.json())
            .then((data) => {
                const countryList = data.map((country) => ({
                    name: country.name.common,
                    code: country.cca2,
                }));
                countryList.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(countryList);
            })
            .catch((error) => console.error('Error fetching country data:', error));
    }, []);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setIsChecked(checked); // Update checkbox state
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Validate the form before submission
    const validateForm = () => {
        // Check if all required fields are filled and checkbox is checked
        return (
            formData.firstName &&
            formData.lastName &&
            formData.email &&
            formData.password &&
            formData.country &&
            formData.phoneNumber &&
            isChecked 
        );
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setFormError('Please fill in all fields and accept the terms.');
            return;
        }

        setFormError(''); // Clear any previous error messages

        //Added by Mostakim
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setFormError('Invalid email format.');
            return;
        }

        const checkEmailResponse = await fetch('http://localhost:3000/user/checkUserEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email }),
        });

        const emailCheckData = await checkEmailResponse.json();

        if (emailCheckData.exists) {
            setFormError('Email already exists. Please use a different email.');
            return;
        }
        //

        console.log('Form Data Submitted:', JSON.stringify(formData, null, 2));
        // Here, you can send this data to an API or handle it as needed
        console.log(formData.firstName)
        const response = await fetch('http://localhost:3000/user/register',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                accountType: "Freelancer",
                firstName : formData.firstName,
                lastName : formData.lastName,
                email : formData.email,
                password : formData.password,
                country : formData.country,
                phoneNumber : formData.phoneNumber

            })
        }).then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    };

    return (
        <>
       
            <div>
                <h1 className="p-5 text-bold">LOGO</h1>
            </div>
            <h1 className="text-center text-6xl pb-10">Sign-Up to get started!</h1>

            <div className="max-w-screen-sm grid md:grid-cols-2 grid-cols-1 mx-auto gap-8">
                <button className="btn">Continue with Apple Account</button>

                {/* Added by Mostakim */}
                <GoogleLoginButton/>

            </div>
            <hr className="max-w-screen-sm mx-auto my-10" />

            <form
                action=""
                className="max-w-screen-sm grid md:grid-cols-2 grid-cols-1 mx-auto md:gap-4 gap-2"
                onSubmit={handleSubmit}
                
            >
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">First Name</span>
                    </div>
                    <input
                        type="text"
                        placeholder="'John'"
                        className="input input-bordered"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Last Name</span>
                    </div>
                    <input
                        type="text"
                        placeholder="'Smith'"
                        className="input input-bordered"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2 col-span-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path
                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input
                        type="text"
                        className="grow"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2 col-span-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd" />
                    </svg>

                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        className="grow"
                        placeholder="Enter your password here"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />

                    <button
                        type="button"
                        className="focus:outline-none"
                        onClick={togglePasswordVisibility}
                    >
                        {passwordVisible ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-6 w-6 opacity-70"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.458 12C3.732 7.943 7.455 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-4.997 7-9.542 7S3.732 16.057 2.458 12z"
                                />
                            </svg>
                        ) :  (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-6 w-6 opacity-70"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3l18 18"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.583 10.583A3 3 0 0 0 13.417 13.417M9.858 9.858A3.993 3.993 0 0 1 12 9a4 4 0 0 1 4 4m1.458 2.958C19.268 16.057 15.545 19 12 19c-4.545 0-8.268-2.943-9.542-7a12.683 12.683 0 0 1 1.86-3.162m7.06-3.06A12.683 12.683 0 0 1 12 5c4.545 0 8.268 2.943 9.542 7"
                                />
                            </svg>
                        )}
                    </button>
                </label>

                <label className="form-control w-full col-span-2">
                    <select
                        className="select select-bordered w-full"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                    >
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="form-control w-full col-span-2">
                    <input
                        type="text"
                        placeholder="Phone Number"
                        className="input input-bordered"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label className="form-control w-full flex flex-row items-center">
                    <input
                        type="checkbox"
                        className="checkbox"
                        checked = {isChecked}
                        onChange={handleInputChange}
                    />
                    <span className="ml-2">I agree to the <a href="#" className="text-blue-600">Terms and Conditions</a></span>
                </label>

                {/*JORA TALI DEWA CODE cuz checkbox not working */}
                {!isChecked && (
                    <div className="col-span-2 text-red-500 mt-2">
                        Please accept the terms and conditions.
                    </div>
                )}

                <button
                    type="submit"
                    className={`btn btn-primary col-span-2 ${!validateForm() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!validateForm()}
                >
                    Sign Up
                </button>

                {/* Error message */}
                {formError && (
                    <div className="text-red-500 col-span-2">
                        {formError}
                    </div>
                )}
            </form>
        </>
    );
}
