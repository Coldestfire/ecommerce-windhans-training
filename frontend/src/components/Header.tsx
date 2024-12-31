import CategoryList from "./HeaderComponents/categoryList";
import CurrentUser from "./HeaderComponents/CurrentUser";

const Header = () => {
  return (
    <div className="bg-slate-300 flex items-center justify-between p-4">
      <CategoryList />
      <CurrentUser />
    </div>
  );
};

export default Header;
