
import LogoutButton from "./HeaderComponents/LogoutButton";

const AdminHeader = () => {
  return (
    <div className="bg-slate-300 flex items-center justify-end p-4">
      <LogoutButton />
    </div>
  );
};

export default AdminHeader;
