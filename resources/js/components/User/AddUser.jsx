import * as React from 'react';
import {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {Add} from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import "../User/adduser.css"
import AlertSnack from "../Alerts/AlertSnack"
import axios from "axios";
import {Backdrop, CircularProgress} from "@mui/material";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{m: 0, p: 2}} {...other}>
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
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function AddUser(initialValues = {}) {
    const [open, setOpen] = React.useState(false);
    const [inputs, setInputs] = useState(initialValues);
    const [sent,setSent] = useState(false);
    const onChangeHandler = useCallback(
        ({target: {name, value}}) => setInputs(state => ({...state, [name]: value}), [])
    );
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleBackdrop = ()=>{
        setSent(false);
    }
    const handleClose = () => {
        setSent(!sent)
        setTimeout(()=>{
        axios.post('http://127.0.0.1:8000/api/register-user', inputs)
            .then( r => {
                if(r.data.status === 200) {
                    setSent(sent)
                }
                }
            ).catch(error => console.log(error))
        },2000)

        setOpen(false);
    };
    const onChange = (event) => {
        (event.target.value);
    };
    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                <Add/>Add User
            </Button>
            {sent? <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={sent}
                onClick={handleBackdrop}
            >
                <CircularProgress color="secondary" />
            </Backdrop>:
                <div>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Modal title
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        <TextField fullWidth label="Title" name="title" onChange={onChangeHandler} value={inputs.title}
                                   key="title"/>
                        <br/>
                        <span>First Name</span>
                        <TextField fullWidth label="firstname" name="firstname" onChange={onChangeHandler}
                                   value={inputs.firstName} key="firstname"/>
                        <br/>
                        <span>Last Name</span>
                        <TextField fullWidth label="surname" name="surname" onChange={onChangeHandler}
                                   value={inputs.lastName} key="surname"/>
                        <br/>
                        <span>Password</span>
                        <TextField type="password" fullWidth label="password" name="password" onChange={onChangeHandler}
                                   value={inputs.password}
                                   key="password"/>
                        <br/>
                        <span>Email</span>
                        <TextField fullWidth label="email" name="email" onChange={onChangeHandler} value={inputs.email}
                                   key="email"/>
                        <br/>
                        <span>District</span>
                        <TextField fullWidth label="district" name="district" onChange={onChangeHandler}
                                   value={inputs.district} key="district"/>
                        <br/>
                        <span>Village</span>
                        <TextField fullWidth label="village" name="village" onChange={onChangeHandler}
                                   value={inputs.village} key="village"/>
                        <br/>
                        <span>Traditional Authority</span>
                        <TextField fullWidth label="traditional_authority" name="traditional_authority"
                                   onChange={onChangeHandler} value={inputs.TA}
                                   key="traditional_authority"/>
                        <br/>
                        <span>Sex</span>
                        <TextField fullWidth label="sex" name="sex" onChange={onChangeHandler} value={inputs.sex}
                                   key="sex"/>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                            Save User
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </div>
            }
            <AlertSnack/>
        </>
    );
}
