"use client";
import React, { useRef, useState } from "react";
import {
    Button,
    Checkbox,
    Label,
    Modal,
    TextInput,
    Radio,
    Spinner,
} from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import { set } from "lodash";

export function ModalComponent() {
    const [openModal, setOpenModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [saving, setSaving] = useState(false);
    const emailInputRef = useRef();
    const firstNameInputRef = useRef();
    const surnameInputRef = useRef();
    const villageInputRef = useRef();
    const traditionalAuthorityInputRef = useRef();
    const districtInputRef = useRef();

    const PersistUser = () => {
        setSaving(true);
        const user = {
            email: emailInputRef.current.value,
            firstname: firstNameInputRef.current.value,
            surname: surnameInputRef.current.value,
            village: villageInputRef.current.value,
            traditional_authority: traditionalAuthorityInputRef.current.value,
            district: districtInputRef.current.value,
        };
        // try {
        //     setTimeout(() => {}, 2000);
        // } catch (error) {
        // } finally {
        //     setSaving(false);
        // }
        setTimeout(() => {
            setSaving(false);
            setOpenModal(false);
        }, 2000);
    };
    return (
        <>
            {/* {showAlert && (
                <Alert color="success" onDismiss={() => setShowAlert(false)}>
                    <p className="font-medium">
                        <span className="font-medium">Info alert!</span> User
                        Successfully saved
                    </p>
                </Alert>
            )} */}

            <Button onClick={() => setOpenModal(true)} className="w-[10rem]">
                <div className="flex items-center justify-center">
                    <HiPlus size={22} />
                    <span className="font-bold">Add Teacher</span>
                </div>
            </Button>
            <Modal
                show={openModal}
                size="4xl"
                popup
                onClose={() => setOpenModal(false)}
                initialFocus={emailInputRef}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white t">
                            Add user
                        </h3>
                        <div>
                            <fieldset className="flex max-w-md flex-col gap-4">
                                <span className="font-bold">Choose Gender</span>
                                <div className="flex items-center gap-1">
                                    <Radio
                                        id="germany"
                                        name="countries"
                                        value="Germany"
                                    />
                                    <Label htmlFor="germany">Male</Label>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Radio
                                        id="spain"
                                        name="countries"
                                        value="Spain"
                                    />
                                    <Label htmlFor="spain">Female</Label>
                                </div>
                            </fieldset>
                            <div className=" flex flex-row  gap-2">
                                <div className="mb-2 mt-4 block flex-1/2 w-full ">
                                    <Label
                                        htmlFor="firstName"
                                        value="Enter First Name"
                                    />

                                    <TextInput
                                        id="firstName"
                                        placeholder="John"
                                        ref={firstNameInputRef}
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
                                        placeholder="Doe"
                                        ref={surnameInputRef}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-2 mt-4 block">
                                <Label htmlFor="email" value="Enter Email" />
                            </div>
                            <TextInput
                                id="email"
                                ref={emailInputRef}
                                placeholder="name@company.com"
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
                                placeholder="Enter village"
                                ref={villageInputRef}
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
                                placeholder="Enter district"
                                ref={districtInputRef}
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
                                placeholder="Enter traditional authority"
                                ref={traditionalAuthorityInputRef}
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
                                <Button
                                    color="success"
                                    // onClick={() => {
                                    //     setOpenModal(false);
                                    //     setShowAlert(true);
                                    // }}

                                    onClick={PersistUser}
                                >
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
