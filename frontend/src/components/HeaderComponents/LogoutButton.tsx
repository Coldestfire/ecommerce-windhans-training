import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';  // For showing success/error notifications
import { useDispatch, useSelector } from 'react-redux'
import { removeUser } from '../../provider/slice/user.slice'

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Optionally, show a success message
    toast.success("Logged out successfully", { duration: 1000 });
    
    dispatch(removeUser());
    console.log("removed user")
    console.log
    // Redirect to the login page or home
    navigate("/login");
  };

  return (
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{
          padding: '10px 20px',
          fontWeight: 'bold',
          marginTop: 2,
          textTransform: 'none',
        }}
      >
        Logout
      </Button>
  );
};

export default LogoutButton;
