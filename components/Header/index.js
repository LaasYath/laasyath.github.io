import { Popover } from "@headlessui/react";
import { useRouter } from "next/router";
import data from "../../data/portfolio.json";

const NavLink = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="text-xs text-white border border-white/20 hover:border-white hover:bg-white/10 transition-colors tracking-widest px-4 py-2"
  >
    {children}
  </button>
);

const Header = ({ isBlog }) => {
  const router = useRouter();
  const { name, showBlog, showResume } = data;

  return (
    <>
      {/* Mobile header */}
      <Popover className="block tablet:hidden">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <button
                onClick={() => router.push("/")}
                className="text-sm text-white tracking-widest"
              >
                {name.split(" ")[0].toUpperCase()}.
              </button>
              <Popover.Button className="text-xs text-white border border-white/20 hover:border-white hover:bg-white/10 transition-colors tracking-widest px-4 py-2">
                {open ? "CLOSE" : "MENU"}
              </Popover.Button>
            </div>
            <Popover.Panel className="absolute left-0 right-0 z-50 bg-black border-b border-white/10 px-6 py-4 space-y-3">
              <NavLink onClick={() => router.push("/")}>Home</NavLink>
              <NavLink onClick={() => router.push("/projects")}>Projects</NavLink>
              {showBlog && <NavLink onClick={() => router.push("/blog")}>Blog</NavLink>}
              {showResume && <NavLink onClick={() => router.push("/resume")}>Resume</NavLink>}
              <NavLink onClick={() => window.open("mailto:laasya.yatham@utexas.edu")}>
                Contact
              </NavLink>
            </Popover.Panel>
          </>
        )}
      </Popover>

      {/* Desktop header */}
      <div className="hidden tablet:flex items-center justify-between sticky top-0 z-50 bg-black border-b border-white/10 px-8 laptop:px-16 py-4">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-white hover:text-gray-300 transition-colors tracking-widest"
        >
          {name.split(" ")[0].toUpperCase()}.
        </button>

        <div className="flex items-center gap-2">
          {!isBlog && (
            <>
              <NavLink onClick={() => router.push("/#summary")}>About</NavLink>
            </>
          )}
          {isBlog && <NavLink onClick={() => router.push("/")}>Home</NavLink>}
          <NavLink onClick={() => router.push("/projects")}>Projects</NavLink>
          {showBlog && <NavLink onClick={() => router.push("/blog")}>Blog</NavLink>}
          {showResume && <NavLink onClick={() => router.push("/resume")}>Resume</NavLink>}
          <a
            href="mailto:laasya.yatham@utexas.edu"
            className="ml-4 border border-white/30 text-xs text-white hover:border-white hover:bg-white/10 transition-colors tracking-widest px-4 py-2"
          >
            CONTACT
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
