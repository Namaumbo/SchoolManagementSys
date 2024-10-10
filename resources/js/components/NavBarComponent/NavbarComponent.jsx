import React from "react";
import { Typography, Switch } from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineWbSunny, MdOutlineDarkMode } from "react-icons/md";
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
                        <Typography
                            variant="h5"
                            component="h5"
                            gutterBottom
                            fontWeight="bold"
                        >
                            {page}
                        </Typography>
                    </div>
                </div>
                <div className="flex items-center gap-0">
                    <MdOutlineWbSunny />
                    <Switch
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                    />
                    <MdOutlineDarkMode />
                    <div className="flex items-center pl-6">
                        <FaUserCircle className="text-3xl mr-2" />
                        <span>Lorem Ipsum</span>
                    </div>
                </div>
            </div>{" "}
        </nav>
    );
};

export default NavbarComponent;
