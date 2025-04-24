import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SchoolInformationService from "../../../services/SchoolInformationService";

export default function CardComponent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone_number: "",
        logo_path: null, // Initially null as logo path is optional
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        if (e.target.type === "file") {
            setFormData({
                ...formData,
                logo_path: e.target.files[0], // Update logo_path with file object
            });
        } else {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
        setErrors({
            ...errors,
            [e.target.id]: "",
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "School Name is required";
            isValid = false;
        }
        if (!formData.address.trim()) {
            newErrors.address = "School Address is required";
            isValid = false;
        }
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = "School Phone Number is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("address", formData.address);
            formDataToSend.append("phone_number", formData.phone_number);
            if (formData.logo_path) {
                formDataToSend.append("logo_path", formData.logo_path);
            }

            const response = await SchoolInformationService.addSchoolDetails({
                schoolDetails: formDataToSend,
            });
            if (response.status === 200) {
                alert("School details saved successfully!");
                setLoading(false);
                navigate("/dashboard");
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-2xl">
                <h3 className="text-3xl font-bold mb-4 text-center text-gray-800">
                    School Details
                </h3>
                <p className="text-gray-600 text-center mb-6">
                    Enter your school information.
                </p>
                <div className="space-y-6">
                    <div>
                        <label
                            htmlFor="school-name"
                            className="block text-sm font-bold mb-2 text-gray-700"
                        >
                            School Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter school name"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.name ? "border-red-500" : ""
                            }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="school-address"
                            className="block text-sm font-bold mb-2 text-gray-700"
                        >
                            School Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter school address"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.address ? "border-red-500" : ""
                            }`}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.address}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="school-phone"
                            className="block text-sm font-bold mb-2 text-gray-700"
                        >
                            School Phone Number
                        </label>
                        <input
                            type="text"
                            id="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="Enter school phone number"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.phone_number ? "border-red-500" : ""
                            }`}
                        />
                        {errors.phone_number && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.phone_number}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="school-logo"
                            className="block text-sm font-bold mb-2 text-gray-700"
                        >
                            School Logo
                        </label>
                        <input
                            type="file"
                            id="logo_path"
                            onChange={handleChange}
                            accept=".jpg,.jpeg,.png"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="mt-8 flex justify-center items-center">
                    <button
                        onClick={handleSave}
                        className={`relative px-6 py-2 text-white font-semibold rounded-md transition duration-300 ${
                            loading
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        disabled={loading}
                    >
                        {loading && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-6 h-6 border-4 border-t-4 border-blue-800 rounded-full animate-spin"></div>
                            </div>
                        )}
                        {loading ? "Please wait..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
