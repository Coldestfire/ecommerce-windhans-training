import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Container, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CurrentUser from '../components/HeaderComponents/CurrentUser';
import CategoryList from '../components/HeaderComponents/categoryList';
import { useAuth } from '../hooks/useAuth';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, user } = useAuth();
  console.log("user: ",user);
  console.log("isAdmin: ",isAdmin);
  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                component={Link}
                to="/home"
                startIcon={<HomeIcon />}
                sx={{
                  color: 'text.primary',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Home
              </Button>
              <Divider orientation="vertical" flexItem sx={{ height: 24, my: 'auto' }} />
              <CategoryList />
              {isAdmin && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ height: 24, my: 'auto' }} />
                  <Button
                    component={Link}
                    to="/admin"
                    startIcon={<AdminPanelSettingsIcon />}
                    sx={{
                      color: 'text.primary',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Admin
                  </Button>
                </>
              )}
            </Box>
            <CurrentUser />
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: '#f5f7fa' }}>
        {children}
      </Box>
    </>
  );
};

export default MainLayout;