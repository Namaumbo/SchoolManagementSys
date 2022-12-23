import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import pic1 from "../../assets/Cool-profile-picture-Discord.jpg"
import pic2 from "../../assets/photo-1628563694622-5a76957fd09c.jpg"
export default function TotalAvatars() {
    return (
        <AvatarGroup total={24}>
            <Avatar alt="Remy Sharp" src={pic1}  style={{background:"#a742f5"}}/>
            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" style={{background:"#546b5c"}}/>
            <Avatar alt="Travis Howard" src={pic2} style={{background:"#262425"}}/>
            <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
        </AvatarGroup>
    );
}
