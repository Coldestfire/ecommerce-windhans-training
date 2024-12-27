import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

import { Link } from 'react-router-dom';

const MainLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <div className="flex bg-primary">
        {/* Sidebar with full height and background color */}
        <Sidebar
          className="h-full text-black bg-slate-300 w-[20%]" // Changed from "h-screen" to "h-full"
          style={{ height: '90vh', overflowY: 'auto' }} // Added inline styles
        >
          
          <Menu>
                  {/* Menu items */}
            <MenuItem
              component={<Link to="/home" />}
            >
              Home page
            </MenuItem>

        
            <MenuItem
              component={<Link to="/admin" />}
            >

              Products List
            </MenuItem>
    
          </Menu>
        </Sidebar>

        {/* Main content area */}
        <div className="w-full">{children}</div>
      </div>
    </>
  );
};

export default MainLayout;