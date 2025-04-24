import React from "react";
import { Typography, Switch } from "@mui/material";
import { MdOutlineWbSunny, MdOutlineDarkMode } from "react-icons/md";
import { Dropdown } from "flowbite-react";
import { HiCog, HiLogout, HiUser, HiViewGrid } from "react-icons/hi";
import { Avatar } from "flowbite-react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { FiSearch } from "react-icons/fi";

const NavbarComponent = ({ activePage }) => {
    const [darkMode, setDarkMode] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(
        new Date().toLocaleTimeString()
    );
    const page = activePage;

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <nav>
            <div className="flex justify-between items-center p-4">
                <div>
                    <div className="  items-center gap-2 content-center">
                        <div className="mb-[5px]">
                            <Typography variant="body1" component="p">
                                {currentTime}
                            </Typography>
                        </div>
                        <h2 className="text-[2rem] font-bold"> {page}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <TextInput
                        id="email1"
                        type="email"
                        placeholder="search here"
                        required
                        className="w-64"
                    />
                    <Button className="bg-blue-600">
                        <FiSearch />
                    </Button>
                    <MdOutlineWbSunny />
                    <Switch
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                    />
                    <MdOutlineDarkMode />

                    <Dropdown
                        label={<Avatar placeholderInitials="RR" rounded />}
                        inline
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">Bonnie Green</span>
                            <span className="block truncate text-sm font-medium">
                                bonnie@flowbite.com
                            </span>
                        </Dropdown.Header>
                        <Dropdown.Item icon={HiViewGrid}>
                            Dashboard
                        </Dropdown.Item>
                        <Dropdown.Item icon={HiCog}>Settings</Dropdown.Item>
                        <Dropdown.Item icon={HiUser}>Profile</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item icon={HiLogout}>Sign out</Dropdown.Item>
                    </Dropdown>
                </div>
            </div>
        </nav>
    );
};

export default NavbarComponent;
