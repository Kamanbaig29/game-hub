import { useState } from "react";
import type { ReactNode } from "react";
import {
  FiChevronDown,
  FiHome,
  FiZap,
  FiInfo,
  FiShield,
  FiMail,
  FiExternalLink,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  children: ReactNode;
}

interface OptionProps {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  path: string;
  selected: string;
  open: boolean;
  external?: boolean;
}

interface TitleSectionProps {
  open: boolean;
}

interface LogoProps {
  open: boolean;
}
const Sidebar = ({ children }: SidebarProps) => {
  const [open, setOpen] = useState(false); // Default closed
  const location = useLocation();

  // Handle hover to open/close sidebar
  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const menuItems = [
    { Icon: FiHome, title: "\u2002Library", path: "/" },
    { Icon: FiZap, title: "\u2002Arena", path: "/arena" },
    { Icon: FiInfo, title: "\u2002About", path: "/about" },
    { Icon: FiShield, title: "\u2002Privacy", path: "/privacy" },
    { Icon: FiMail, title: "\u2002Contact \u2009", path: "https://contact.cryptoverse.games", external: true },
  ];

  return (
    <div className="flex min-h-screen">
      <motion.nav
        layout
        className="fixed top-0 left-0 h-screen shrink-0 border-r border-purple-500/30 bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#16213e] p-2 flex flex-col z-50"
        style={{
          width: open ? "225px" : "fit-content",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex-shrink-0">
          <TitleSection open={open} />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-1 scrollbar-hide">
          <div className="pb-2">
            {menuItems.map((item) => (
              <Option
                key={item.path}
                Icon={item.Icon}
                title={item.title}
                path={item.path}
                selected={location.pathname}
                open={open}
                external={item.external}
              />
            ))}
          </div>
        </div>


      </motion.nav>
      <div
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: open ? "225px" : "64px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Option = ({ Icon, title, path, selected, open, external }: OptionProps) => {
  const navigate = useNavigate();
  const isSelected = selected === path || (path === "/" && selected === "/");

  const handleClick = () => {
    if (external) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else {
      navigate(path);
    }
  };

  return (
    <motion.button
      layout
      onClick={handleClick}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors outline-none focus:outline-none focus:ring-0 ${isSelected
        ? "bg-purple-600/30 text-purple-300 border border-purple-500/50"
        : "text-slate-400 hover:bg-purple-900/20 hover:text-purple-200"
        }`}
    >
      <motion.div
        layout
        className="grid h-full w-10 shrink-0 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          className="text-xs font-medium flex items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
        >
          {title}
          {external && <FiExternalLink className="text-[10px]" />}
        </motion.span>
      )}
    </motion.button>
  );
};

const TitleSection = ({ open }: TitleSectionProps) => {
  return (
    <div className="mb-5 border-b border-purple-500/30 pb-5">
      <div className="flex items-center justify-between rounded-xl p-3 transition-all hover:bg-purple-900/20">
        <div className="flex items-center justify-center w-full">
          <Logo open={open} />   {/* only the logo, no extra text */}
        </div>

        {open && (
          <FiChevronDown className="text-purple-400/60 transition-transform hover:rotate-180" />
        )}
      </div>
    </div>
  );
};

const Logo = ({ open }: LogoProps) => {
  const size = open ? 80 : 56;   // bigger when open

  return (
    <motion.div layout className="grid place-items-center shrink-0">
      <div
        className="rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 p-2 shadow-2xl"
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.png"
          alt="Cryptoverse"
          className="h-full w-full rounded-xl object-contain"
          draggable={false}
        />
      </div>
    </motion.div>
  );
};



export default Sidebar;