import CategoryList from "./HeaderComponents/categoryList";
import CurrentUser from "./HeaderComponents/CurrentUser";
import LogoutButton from "./HeaderComponents/LogoutButton";

const Header = () => {
  return (
    <div className="bg-slate-300 flex items-center justify-between p-4">
      <CategoryList />
      <CurrentUser />
      <LogoutButton />
    </div>
  );
};

export default Header;
