import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {Add} from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import "../User/adduser.css"

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 10,
                        top: 12,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function AddUser() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button variant="outlined"  onClick={handleClickOpen}>
                <Add/>Add User
            </Button>
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}

            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} >
                    Modal title
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth label="Title" id="fullWidth7" />
                    <br />
                    <span>First Name</span>
                    <TextField fullWidth label="First Name" id="fullWidth1" style={{width:"34em"}}/>
                    <br />
                    <span>Last Name</span>
                    <TextField fullWidth label="Last Name" id="fullWidth2" style={{width:"34em"}} />
                    <br />
                    <span>Email</span>
                    <TextField fullWidth label="Email" id="fullWidth3" style={{width:"34em"}}/>
                    <br />
                    <span>District</span>
                    <TextField fullWidth label="District" id="fullWidth4" style={{width:"34em"}}/>
                    <br />
                    <span>Village</span>
                    <TextField fullWidth label="Village" id="fullWidth5" style={{width:"34em"}}/>
                    <br />
                    <span>Traditional Authority</span>
                    <TextField fullWidth label="Traditional Authority" id="fullWidth6" style={{width:"34em"}}/>
                    <br />
                    <span>Sex</span>
                    <TextField fullWidth label="Sex" id="fullWidth" style={{width:"34em"}}/>

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Save changes
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
        </>
    );
}
