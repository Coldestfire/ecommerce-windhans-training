import React, { useState } from 'react';
import { useGetProfileQuery } from "../../provider/queries/Auth.query";
import { useGetCartQuery } from "../../provider/queries/Cart.query";
import { useGetWishlistQuery } from "../../provider/queries/Wishlist.query";
import { useAuth } from '../../hooks/useAuth';
import { 
  CircularProgress, 
  Paper, 
  Typography, 
  Box, 
  Popover, 
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Badge,
  Button
} from "@mui/material";
import LogoutButton from "./LogoutButton";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';

const CurrentUser = () => {
    const { isAuthenticated } = useAuth();
    const { data, isLoading } = useGetProfileQuery({}, { skip: !isAuthenticated });
    const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated });
    const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    // Calculate total items in cart (including quantities)
    const cartItemsCount = cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    const wishlistItemsCount = wishlistData?.items?.length || 0;

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'user-popover' : undefined;

    if (!isAuthenticated) {
        return (
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<LoginIcon />}
                    onClick={() => navigate('/login')}
                    sx={{
                        textTransform: 'none',
                        borderRadius: '8px',
                        fontWeight: 500
                    }}
                >
                    Login
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    onClick={() => navigate('/register')}
                    sx={{
                        textTransform: 'none',
                        borderRadius: '8px',
                        fontWeight: 500
                    }}
                >
                    Sign Up
                </Button>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                <CircularProgress size={20} thickness={4} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Action Icons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => navigate('/cart')}
                >
                    <Badge badgeContent={cartItemsCount} color="error">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
                <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => navigate('/wishlist')}
                >
                    <Badge badgeContent={wishlistItemsCount} color="error">
                        <FavoriteIcon />
                    </Badge>
                </IconButton>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* User Profile Button */}
            <Paper 
                elevation={0} 
                sx={{
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    borderRadius: '40px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: 'transparent',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        transform: 'translateY(-1px)',
                    }
                }}
                onClick={handlePopoverOpen}
            >
                <Avatar
                    alt={data?.user?.name}
                    src={data?.user?.avatar}
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        border: '2px solid',
                        borderColor: 'primary.main'
                    }}
                >
                    {data?.user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Typography 
                        variant="subtitle2" 
                        sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                            lineHeight: 1.2
                        }}
                    >
                        {data?.user?.name}
                    </Typography>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.7rem'
                        }}
                    >
                        {data?.user?.email}
                    </Typography>
                </Box>
            </Paper>

            {/* Dropdown Menu */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    elevation: 4,
                    sx: {
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 220,
                        overflow: 'hidden'
                    }
                }}
            >
                {/* User Info Header */}
                <Box sx={{ 
                    p: 2, 
                    bgcolor: 'primary.main', 
                    color: 'white'
                }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {data?.user?.name}
                    </Typography>
                    <Typography variant="caption">
                        {data?.user?.email}
                    </Typography>
                </Box>

                <List sx={{ p: 1 }}>
                    {/* <ListItem 
                        button 
                        onClick={() => navigate('/profile')}
                        sx={{ 
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'action.hover' }
                        }}
                    >
                        <ListItemIcon>
                            <AccountCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Profile" 
                            primaryTypographyProps={{ 
                                variant: 'body2',
                                fontWeight: 500
                            }} 
                        />
                    </ListItem>
                    <ListItem 
                        button 
                        onClick={() => navigate('/settings')}
                        sx={{ 
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'action.hover' }
                        }}
                    >
                        <ListItemIcon>
                            <SettingsIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Settings" 
                            primaryTypographyProps={{ 
                                variant: 'body2',
                                fontWeight: 500
                            }} 
                        />
                    </ListItem> */}
                    <Divider sx={{ my: 1 }} />
                    <ListItem sx={{ p: 1 }}>
                        <LogoutButton 
                            fullWidth 
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                py: 1
                            }}
                        />
                    </ListItem>
                </List>
            </Popover>
        </Box>
    );
};

export default CurrentUser;