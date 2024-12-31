import React from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { removeUser } from '../../provider/slice/user.slice';
import LogoutIcon from '@mui/icons-material/Logout';

interface LogoutButtonProps {
  fullWidth?: boolean;
  sx?: object;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ fullWidth = false, sx = {} }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(removeUser());
    toast.success("Logged out successfully", { duration: 2000 });
    navigate("/login");
  };

  return (
    <Button
      variant="text"
      onClick={handleLogout}
      fullWidth={fullWidth}
      startIcon={<LogoutIcon />}
      sx={{
        color: 'error.main',
        backgroundColor: 'rgba(211, 47, 47, 0.04)', // Lighter red background
        textTransform: 'none',
        fontWeight: 500,
        py: 1,
        px: 2,
        borderRadius: 1.5,
        '&:hover': {
          backgroundColor: 'rgba(211, 47, 47, 0.08)', // Slightly darker on hover but still light
          color: 'error.main', // Maintains the same text color
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 4px rgba(211, 47, 47, 0.1)' // Subtle shadow on hover
        },
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        transition: 'all 0.2s ease-in-out',
        ...sx
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 500,
          fontSize: '0.875rem'
        }}
      >
        Logout
      </Typography>
    </Button>
  );
};

export default LogoutButton;