import React, { useState } from 'react';
import { useGetProfileQuery } from "../../provider/queries/Auth.query";
import { CircularProgress, Paper, Typography, Box, Popover, Button, Avatar } from "@mui/material";
import LogoutButton from "./LogoutButton"; // Assuming you have this component

const CurrentUser = () => {
    const { data, isLoading } = useGetProfileQuery({});
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress size={24} />
            </Box>
        );
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" >
            <Paper 
                elevation={3} 
                sx={{
                    padding: '8px 16px',  // Adjust padding to remove unnecessary right padding
                    paddingRight: 0,  // Remove right padding
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '30px',
                    width: '250px',
                    boxShadow: 4,
                    cursor: 'pointer',
                    '&:hover': {
                        boxShadow: 6,
                    }
                }}
                onClick={handlePopoverOpen}  // Open popover when clicking anywhere in the Paper
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" color="textSecondary" fontWeight={500}>
                        Logged in as
                    </Typography>

                    <Typography variant="subtitle2" color="primary" fontWeight={600}>
                        {data?.user?.name}
                    </Typography>

                    <Avatar
                        alt="User Avatar"
                        src={data?.user?.avatar || '/broken-image.jpg'}  // Use actual avatar if available
                        sx={{
                            width: 32, 
                            height: 32,  // Size of the avatar
                            fontSize: 14,  // Adjust the letter size inside the avatar
                            display: 'flex',  // Ensure the content is centered
                            alignItems: 'center',  // Vertically center the letter
                            justifyContent: 'center',  // Horizontally center the letter
                            padding: 0,  // Remove any default padding
                        }}
                    >
                        R
                    </Avatar>
                </Box>
            </Paper>



            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }
            }
            >
                <Box sx={{
                    padding: 1,
                    minWidth: '180px',
                    backgroundColor: '#f4f6f8',
                    borderRadius: '10px',
                }}>
                    <LogoutButton />
                </Box>
                
            </Popover>
        </Box>
    );
};

export default CurrentUser;
