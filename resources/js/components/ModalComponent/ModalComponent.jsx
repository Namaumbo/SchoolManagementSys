"use client";
import React, { useState } from "react";
import {
    Button,
    Label,
    Modal,
    TextInput,
    Radio,
    Spinner,
} from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import axios from "axios";

export function ModalComponent() {
    const [openModal, setOpenModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        firstname: "",
        surname: "",
        village: "",
        traditional_authority: "",
        district: "",
        gender: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleGenderChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            gender: e.target.value,
        }));
    };

    const PersistUser = async () => {
        setSaving(true);
        const user = {
            ...formData,
        };
        const apiUrl = import.meta.env.VITE_BASE_ENDPOINT;
        // console.log(apiUrl);
        await axios
            .post(`${apiUrl}register-user`, user, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Credentials": true,
                },
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        setTimeout(() => {
            setSaving(false);
            setOpenModal(false);
        }, 2000);
    };
    return (
        <>
            <Button onClick={() => setOpenModal(true)} className="w-[10rem]">
                <div className="flex items-center justify-center">
                    <HiPlus size={18} className="mr-1" />
                    <span className="font-bold">Add Teacher</span>
                </div>
            </Button>
            <Modal
                show={openModal}
                size="4xl"
                popup
                onClose={() => setOpenModal(false)}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white ">
                            Add user
                        </h3>
                        <div>
                            <fieldset className="flex max-w-md flex-col gap-4">
                                <span className="font-bold">Choose Gender</span>
                                <div className="flex items-center gap-1">
                                    <Radio
                                        id="maleGender"
                                        name="gender"
                                        value="male"
                                        onChange={handleGenderChange}
                                        checked={formData.gender === "male"}
                                    />
                                    <Label htmlFor="maleGender">Male</Label>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Radio
                                        id="femaleGender"
                                        name="gender"
                                        value="female"
                                        onChange={handleGenderChange}
                                        checked={formData.gender === "female"}
                                    />
                                    <Label htmlFor="femaleGender">Female</Label>
                                </div>
                            </fieldset>
                            <div className=" flex flex-row  gap-2">
                                <div className="mb-2 mt-4 block flex-1/2 w-full ">
                                    <Label
                                        htmlFor="firstname"
                                        value="Enter First Name"
                                    />
                                    <TextInput
                                        id="firstname"
                                        name="firstname"
                                        placeholder="John"
                                        value={formData.firstname}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-2 mt-4 block flex-1/2 w-full">
                                    <Label
                                        htmlFor="surname"
                                        value="Enter Surname"
                                    />
                                    <TextInput
                                        id="surname"
                                        name="surname"
                                        placeholder="Doe"
                                        value={formData.surname}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-2 mt-4 block">
                                <Label htmlFor="email" value="Enter Email" />
                            </div>
                            <TextInput
                                id="email"
                                name="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="mb-2 mt-4 block">
                                <Label
                                    htmlFor="village"
                                    value="Enter Village"
                                />
                            </div>
                            <TextInput
                                id="village"
                                name="village"
                                placeholder="Enter village"
                                value={formData.village}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="mb-2 mt-4 block">
                                <Label
                                    htmlFor="district"
                                    value="Enter District"
                                />
                            </div>
                            <TextInput
                                id="district"
                                name="district"
                                placeholder="Enter district"
                                value={formData.district}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="mb-2 mt-4 block">
                                <Label
                                    htmlFor="traditional_authority"
                                    value="Enter Traditional Authority"
                                />
                            </div>
                            <TextInput
                                id="traditional_authority"
                                name="traditional_authority"
                                placeholder="Enter traditional authority"
                                value={formData.traditional_authority}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="w-full">
                            <div className="flex justify-end gap-2">
                                <Button
                                    color="failure"
                                    onClick={() => setOpenModal(false)}
                                >
                                    <span className="font-bold">
                                        No, cancel
                                    </span>
                                </Button>
                                <Button color="success" onClick={PersistUser}>
                                    <span className="font-bold">
                                        {saving ? (
                                            <h1>
                                                {" "}
                                                <Spinner
                                                    color="success"
                                                    aria-label="Success spinner example"
                                                />
                                            </h1>
                                        ) : (
                                            <h1>save</h1>
                                        )}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
