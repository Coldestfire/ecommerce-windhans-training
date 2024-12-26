import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';  // For showing success/error notifications

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Optionally, show a success message
    toast.success("Logged out successfully", { duration: 1000 });

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
