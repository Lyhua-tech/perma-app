import { CodeXml } from "lucide-react";
import Link from "next/link";

const section = [
  {
    name: "About",
    path: "#",
  },
  {
    name: "Contact us",
    path: "#",
  },
  {
    name: "Sign in",
    path: "/login",
  },
  {
    name: "Billing",
    path: "#",
  },
];

const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between items-center max-w-[1600px] mx-auto p-5">
        <div className="flex items-center space-x-1 cursor-pointer">
          <CodeXml />
          <p className="font-manrope font-medium">Portfolio Website</p>
        </div>

        <ul className="flex space-x-1.5 font-work-sans ">
          {section.map((content, index) => {
            return (
              <li
                key={index}
                className="font-medium text-sm cursor-pointer hover:border-b-secondary transition-colors border-b-2
                border-transparent
                duration-300 px-3.5 py-1"
              >
                <Link href={content.path}>{content.name}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};
export default Navbar;
