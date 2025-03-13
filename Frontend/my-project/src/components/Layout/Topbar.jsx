
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
const Topbar = () => {
  return (
    <div className="bg-rabbit-red text-white">
      <div className="container mx-auto flex items-center justify-between py-1 px-4">
        <div className="hidden md:flex items-center gap-4 py-2">
          <a href="#" className="hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <RiTwitterXLine className="h-5 w-5" />
          </a>
        </div>
        <div className="text-sm text-center flex-grow py-1">
          <span>We ship Worldwide - Fast and relible shipping</span>
        </div>
        <div className="text-sm hidden md:block">
          <a href="tel:+123456789" className="hover:text-gray-300"> +123456789</a>
        </div>
      </div>
    </div>
  );
};

export default Topbar
