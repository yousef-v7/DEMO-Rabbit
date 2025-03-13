import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";

const Headre = () => {
  return (
    <header className="border-b bordergray-200 ">
      {/* Topbar */}
      <Topbar/>
      {/* navbar */}
      <Navbar/>
      {/* Cart Drawer */}
    </header>
  );
};

export default Headre;
