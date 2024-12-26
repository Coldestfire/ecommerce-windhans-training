// /* eslint-disable @typescript-eslint/no-explicit-any */

import CategoryList from "./categoryList";
import LogoutButton from "./LogoutButton";

const Header = () => {


  return (
    <div className="bg-slate-300">
    
     <CategoryList />
     <LogoutButton />
    </div>
  );
};

export default Header;