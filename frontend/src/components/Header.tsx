import CategoryList from "./categoryList";
import LogoutButton from "./LogoutButton";

const Header = () => {
  return (
    <div className="bg-slate-300 flex items-center justify-between p-4">
      <CategoryList />
      <LogoutButton />
    </div>
  );
};

export default Header;
