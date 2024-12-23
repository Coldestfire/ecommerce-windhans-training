import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

import { Link } from 'react-router-dom';

const MainLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <div className="flex bg-primary">
        {/* Sidebar with full height and background color */}
        <Sidebar
          collapsed={false}
          className="h-full text-black bg-slate-300" // Changed from "h-screen" to "h-full"
          style={{ height: '168vh', overflowY: 'auto' }} // Added inline styles
        >
          
          <Menu>
                  {/* Menu items */}
            <MenuItem
              component={<Link to="/landing" />}
            >
              Landing page
            </MenuItem>

        
            <MenuItem
              component={<Link to="/" />}
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