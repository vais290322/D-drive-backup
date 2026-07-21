import React, { useState, useRef, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import headerbg from "../assets/headerbg.png";

const Header = () => {
  // State for all dropdowns
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isWhatWeDoOpen, setIsWhatWeDoOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isResearchColumnOpen, setIsResearchColumnOpen] = useState(false);
  const [isDataArchiveOpen, setIsDataArchiveOpen] = useState(false);

  // State for desktop submenus
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeWhatWeDoMenu, setActiveWhatWeDoMenu] = useState(null);

  // State for mobile menus
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState({
    team: false,
    whatWeDo: false,
    contact: false,
    researchColumn: false,
    dataArchive: false,
  });
  const [mobileSubSubMenu, setMobileSubSubMenu] = useState({
    governance: false,
    research: false,
    researchInitiatives: false,
    capacityBuilding: false,
  });

  const [activePage, setActivePage] = useState("GALLERY");

  // Refs for all dropdowns
  const dropdownRef = useRef(null);
  const whatWeDoRef = useRef(null);
  const contactRef = useRef(null);
  const researchColumnRef = useRef(null);
  const dataArchiveRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsTeamOpen(false);
        setActiveMenu(null);
      }
      if (whatWeDoRef.current && !whatWeDoRef.current.contains(e.target)) {
        setIsWhatWeDoOpen(false);
        setActiveWhatWeDoMenu(null);
      }
      if (contactRef.current && !contactRef.current.contains(e.target)) {
        setIsContactOpen(false);
      }
      if (
        researchColumnRef.current &&
        !researchColumnRef.current.contains(e.target)
      ) {
        setIsResearchColumnOpen(false);
      }
      if (
        dataArchiveRef.current &&
        !dataArchiveRef.current.contains(e.target)
      ) {
        setIsDataArchiveOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handlePageClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  // Mobile menu toggle functions
  const toggleMobileSubMenu = (menu) => {
    setMobileSubMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const toggleMobileSubSubMenu = (menu) => {
    setMobileSubSubMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <nav
      className=" shadow-sm relative "
      style={{
        backgroundImage: `url(${headerbg})`,
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to={"/v1/home"}>
          <img src={logo} alt="DRASTA Logo" className="h-20" />
        </NavLink>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex gap-6 text-[13px] font-semibold text-black">
          <li>
            <NavLink
              to={"/v1/home"}
              className={({ isActive }) =>
                `hover:text-[#96C346] cursor-pointer  header    ${
                  isActive ? "text-[#96C346]" : ""
                }`
              }
              onClick={() => handlePageClick("ABOUT")}
            >
              ABOUT US
            </NavLink>
          </li>

          {/* TEAM DROPDOWN */}
          <li
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setIsTeamOpen(true)}
            onMouseLeave={() => setIsTeamOpen(false)}
          >
            <button
              className={`hover:text-[#96C346] transition duration-300 cursor-pointer  header ${
                isTeamOpen ? "text-[#96C346]" : ""
              }`}
            >
              Team C-DRASTA ▾
            </button>
            {isTeamOpen && (
              <div className="absolute left-0 top-[17px] flex bg-gradient-to-b from-white to-[#F5F5F5] shadow-2xl h-[138px]  z-50 animate-fade-in">
                <div className="flex divide-x ">
                  <div className="min-w-[206px]  mt-8 border-[#96C346] border-t-4 space-y-2">
                    <div
                      onMouseEnter={() => setActiveMenu("governance")}
                      onMouseLeave={() => setActiveMenu(null)}
                      className="relative"
                    >
                      <NavLink
                        to={"#"}
                        className="block text-xs text-gray-700 hover:text-[#96C346] hover:bg-white transition p-1.5"
                      >
                        Governance and Advisory
                      </NavLink>
                      {activeMenu === "governance" && (
                        <div className="absolute left-[205px] top-[-4px] bg-[#F5F5F5] shadow-xl min-w-[220px] border-[#96C346]  border-t-4 z-50">
                          <NavLink
                            to={"/v1/governanceandadvisorytrustees"}
                            className={({ isActive }) =>
                              `block py-1 pl-2 pt-2 pb-2text-xs ${
                                isActive
                                  ? "text-[#96C346] font-medium"
                                  : "text-gray-600 hover:text-[#96C346]  hover:bg-white"
                              }`
                            }
                          >
                            Trustees
                          </NavLink>
                          <NavLink
                            to={"/v1/advisors"}
                            className={({ isActive }) =>
                              `block py-1 pl-2 pt-2 pb-2text-xs ${
                                isActive
                                  ? "text-[#96C346] font-medium"
                                  : "text-gray-600 hover:bg-white hover:text-[#96C346]"
                              }`
                            }
                          >
                            Advisors
                          </NavLink>
                        </div>
                      )}
                    </div>

                    <div
                      onMouseEnter={() => setActiveMenu("research")}
                      onMouseLeave={() => setActiveMenu(null)}
                      className="relative"
                    >
                      <NavLink
                        to={"#"}
                        className="block text-xs text-gray-700  hover:bg-white hover:text-[#96C346] transition p-1.5"
                      >
                        Research Team
                      </NavLink>
                      {activeMenu === "research" && (
                        <div className="absolute left-[206px] top-[0px] bg-[#F5F5F5]  min-w-[220px] border-[#96C346] border-t-4 z-50">
                          <NavLink
                            to={"/v1/researchers"}
                            className={({ isActive }) =>
                              `block py-1 pl-2 pt-2 pb-2  text-xs  ${
                                isActive
                                  ? "text-[#96C346] font-medium"
                                  : "text-gray-600 hover:text-[#96C346] hover:bg-white"
                              }`
                            }
                          >
                            Researchers
                          </NavLink>
                          <NavLink
                            to={"/v1/collaborators"}
                            className={({ isActive }) =>
                              `block py-1 pl-2 pt-2 pb-2  text-xs ${
                                isActive
                                  ? "text-[#96C346] font-medium"
                                  : "text-gray-600 hover:bg-white  hover:text-[#96C346]"
                              }`
                            }
                          >
                            Experts and Collaborators
                          </NavLink>
                        </div>
                      )}
                    </div>

                    <NavLink
                      to={"/v1/administrationandoperations"}
                      className={({ isActive }) =>
                        `block text-xs  ${
                          isActive
                            ? "text-[#96C346] "
                            : "text-gray-700 hover:bg-white hover:text-[#96C346]"
                        } transition p-2`
                      }
                    >
                      Administration and Operations
                    </NavLink>
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* WHAT WE DO DROPDOWN */}
          <li
            className="relative"
            ref={whatWeDoRef}
            onMouseEnter={() => setIsWhatWeDoOpen(true)}
            onMouseLeave={() => setIsWhatWeDoOpen(false)}
          >
            <button
              className={`hover:text-[#96C346] transition duration-300 cursor-pointer  header ${
                isWhatWeDoOpen ? "text-[#96C346]" : ""
              }`}
            >
              WHAT WE DO ▾
            </button>
            {isWhatWeDoOpen && (
              <div className="absolute left-0 top-[17px] flex bg-gradient-to-b from-white to-[#F5F5F5] shadow-2xl h-[100px]  z-50 animate-fade-in">
                <div className="flex divide-x">
                  <div className="min-w-[206px] mt-8 border-[#96C346] border-t-4  space-y-2 ">
                    <div
                      onMouseEnter={() => setActiveWhatWeDoMenu("research")}
                      onMouseLeave={() => setActiveWhatWeDoMenu(null)}
                      className="relative"
                    >
                      <NavLink
                        to={"#"}
                        className="block text-xs text-gray-700 hover:text-[#96C346] hover:bg-white transition p-1.5"
                      >
                        Research
                      </NavLink>
                      {activeWhatWeDoMenu === "research" && (
                        <div className="absolute left-[205px] top-[-4px] bg-[#F5F5F5] shadow-xl min-w-[220px] border-[#96C346]  border-t-4 z-50">
                          <NavLink
                            to={"/v1/research-themes"}
                            className={({ isActive }) =>
                              `block py-1 pl-2 pt-2 pb-2 text-xs ${
                                isActive
                                  ? "text-[#96C346] font-medium"
                                  : "text-gray-600 hover:text-[#96C346] hover:bg-white "
                              }`
                            }
                          >
                            Themes
                          </NavLink>
                          <NavLink
                            to={"/v1/research-projects"}
                            className={({ isActive }) =>
                              `block py-1 pl-2 pt-2 pb-2 text-xs ${
                                isActive
                                  ? "text-[#96C346] font-medium"
                                  : "text-gray-600 hover:text-[#96C346] hover:bg-white "
                              }`
                            }
                          >
                            Projects
                          </NavLink>
                        </div>
                      )}
                    </div>

                    <div
                      onMouseEnter={() => setActiveWhatWeDoMenu("capacity")}
                      onMouseLeave={() => setActiveWhatWeDoMenu(null)}
                      className="relative"
                    >
                      <NavLink
                        to={""}
                        className="block text-xs text-gray-700 hover:text-[#96C346] hover:bg-white transition p-1.5"
                      >
                        Training
                      </NavLink>
                      {activeWhatWeDoMenu === "capacity" && (
                        <div className="absolute left-[206px] top-[0px] bg-[#F5F5F5]  min-w-[220px] border-[#96C346] border-t-4 z-50">
                          <NavLink
                            to={"/v1/training-themes"}
                            className={({ isActive }) =>
                              `block py-1 pl-2 pt-2 pb-2 text-xs ${
                                isActive
                                  ? "text-[#96C346] "
                                  : "text-gray-600 hover:text-[#96C346] hover:bg-white "
                              }`
                            }
                          >
                            Themes
                          </NavLink>
                          <NavLink
                            to={"/v1/training-workshops"}
                            className={({ isActive }) =>
                              `block py-1 pl-2 pt-2 pb-2 text-xs ${
                                isActive
                                  ? "text-[#96C346] "
                                  : "text-gray-600 hover:text-[#96C346] hover:bg-white "
                              }`
                            }
                          >
                            Workshops
                          </NavLink>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* RESEARCH COLUMN DROPDOWN */}
          <li
            className="relative"
            ref={researchColumnRef}
            onMouseEnter={() => setIsResearchColumnOpen(true)}
            onMouseLeave={() => setIsResearchColumnOpen(false)}
          >
            <button
              className={`hover:text-[#96C346] transition duration-300 cursor-pointer header  ${
                isResearchColumnOpen ? "text-[#96C346]" : ""
              }`}
            >
              RESEARCH COLUMN ▾
            </button>
            {isResearchColumnOpen && (
              <div className="absolute left-0 top-[17px] flex bg-gradient-to-b from-white to-[#F5F5F5] shadow-2xl h-[190px]  z-50 animate-fade-in">
                <div className="min-w-[206px] mt-8 border-[#96C346] border-t-4 space-y-2 ">
                  <NavLink
                    to={"/v1/csr"}
                    className={({ isActive }) =>
                      `block text-xs pt-2 pb-2 pl-2 ${
                        isActive
                          ? "text-[#96C346]"
                          : "text-gray-700 hover:bg-white  hover:text-[#96C346]"
                      } transition`
                    }
                  >
                    Focus on CSR
                  </NavLink>
                  <NavLink
                    to={"/v1/abstractsandongoing"}
                    className={({ isActive }) =>
                      `block text-xs pt-2 pb-2 pl-2 ${
                        isActive
                          ? "text-[#96C346]"
                          : "text-gray-700 hover:bg-white  hover:text-[#96C346]"
                      } transition`
                    }
                  >
                    Abstracts and Ongoing Research
                  </NavLink>
                  <NavLink
                    to={"/v1/drastaavalokan"}
                    className={({ isActive }) =>
                      `block text-xs pt-2 pb-2 pl-2 ${
                        isActive
                          ? "text-[#96C346]"
                          : "text-gray-700 hover:bg-white  hover:text-[#96C346]"
                      } transition`
                    }
                  >
                    Drasta-Avalokan
                  </NavLink>
                  <NavLink
                    to={"/v1/youngresearcher"}
                    className={({ isActive }) =>
                      `block text-xs pt-2 pb-2 pl-2 ${
                        isActive
                          ? "text-[#96C346]"
                          : "text-gray-700 hover:bg-white  hover:text-[#96C346]"
                      } transition`
                    }
                  >
                    Young Researcher's Column
                  </NavLink>
                </div>
              </div>
            )}
          </li>

          {/* DATA ARCHIVE DROPDOWN */}
          <li
            className="relative"
            ref={dataArchiveRef}
            onMouseEnter={() => setIsDataArchiveOpen(true)}
            onMouseLeave={() => setIsDataArchiveOpen(false)}
          >
            <button
              className={`hover:text-[#96C346] transition duration-300 cursor-pointer header  ${
                isDataArchiveOpen ? "text-[#96C346]" : ""
              }`}
            >
              DATA ARCHIVE ▾
            </button>
            {isDataArchiveOpen && (
              <div className="absolute left-0 top-[17px] flex bg-gradient-to-b from-white to-[#F5F5F5] shadow-2xl h-[150px]  z-50 animate-fade-in">
                <div className="min-w-[206px] mt-8 border-[#96C346] border-t-4 space-y-2 ">
                  <NavLink
                    to={"/v1/reports"}
                    className={({ isActive }) =>
                      `block text-xs pt-2 pb-2 pl-2 ${
                        isActive
                          ? "text-[#96C346]"
                          : "text-gray-700 hover:text-[#96C346] hover:bg-white "
                      } transition`
                    }
                  >
                    Reports
                  </NavLink>
                  <NavLink
                    to={"/v1/database"}
                    className={({ isActive }) =>
                      `block text-xs pt-2 pb-2 pl-2 ${
                        isActive
                          ? "text-[#96C346]"
                          : "text-gray-700 hover:text-[#96C346] hover:bg-white "
                      } transition`
                    }
                  >
                    Database
                  </NavLink>
                  <NavLink
                    to={"/v1/news"}
                    className={({ isActive }) =>
                      `block text-xs pt-2 pb-2 pl-2 ${
                        isActive
                          ? "text-[#96C346]"
                          : "text-gray-700 hover:text-[#96C346] hover:bg-white "
                      } transition`
                    }
                  >
                    News
                  </NavLink>
                </div>
              </div>
            )}
          </li>

          {/* DIRECTOR'S DESK */}
          <li>
            <NavLink
              to={"/v1/directors-desks"}
              className={({ isActive }) =>
                `hover:text-[#96C346] cursor-pointer header  ${
                  isActive ? "text-[#96C346]" : ""
                }`
              }
              onClick={() => handlePageClick("DIRECTOR'S")}
            >
              DIRECTOR'S DESK
            </NavLink>
          </li>

          {/* GALLERY */}
          <li>
            <NavLink
              to={"/v1/gallery"}
              className={({ isActive }) =>
                `hover:text-[#96C346] cursor-pointer  header ${
                  isActive ? "text-[#96C346]" : ""
                }`
              }
              onClick={() => handlePageClick("GALLERY")}
            >
              GALLERY
            </NavLink>
          </li>

          {/* CONTACT US DROPDOWN */}
          <li
            className="relative"
            ref={contactRef}
            onMouseEnter={() => setIsContactOpen(true)}
            onMouseLeave={() => setIsContactOpen(false)}
          >
            <button
              className={`hover:text-[#96C346] cursor-pointer header  transition duration-300 ${
                isContactOpen ? "text-[#96C346]" : ""
              }`}
            >
              CONTACT US ▾
            </button>
            {isContactOpen && (
              <div className="absolute right-0 top-[17px] flex bg-gradient-to-b from-white to-[#F5F5F5] shadow-2xl h-[110px]  z-50 animate-fade-in">
                <div className="min-w-[206px] mt-8 border-[#96C346] border-t-4 space-y-2 ">
                  <NavLink
                    to={"/v1/our-coordinates"}
                    className={({ isActive }) =>
                      `block text-xs pt-2 pb-2 pl-2 ${
                        isActive
                          ? "text-[#96C346]"
                          : "text-gray-700 hover:bg-white  hover:text-[#96C346]"
                      } transition`
                    }
                  >
                    Our Coordinates
                  </NavLink>
                  <NavLink
                    to={"/v1/legal-compliance"}
                    className={({ isActive }) =>
                      `block text-xs  pt-2 pb-2 pl-2 ${
                        isActive
                          ? "text-[#96C346]"
                          : "text-gray-700 hover:bg-white  hover:text-[#96C346]"
                      } transition`
                    }
                  >
                    Legal Compliance
                  </NavLink>
                </div>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-[#F5F5F5] shadow-lg absolute w-full z-50 max-h-[80vh] overflow-y-auto"
        >
          <div className="px-4 py-3 space-y-3">
            {/* ABOUT US */}
            <NavLink
              to="/v1/home"
              className={({ isActive }) =>
                `block py-2 ${
                  isActive
                    ? "text-[#96C346] font-medium"
                    : "hover:text-[#96C346]"
                }`
              }
              onClick={() => {
                handlePageClick("ABOUT");
                setMobileMenuOpen(false);
              }}
            >
              ABOUT US
            </NavLink>

            {/* Team C-DRASTA Dropdown */}
            <div className="space-y-1">
              <button
                className="flex justify-between items-center w-full py-2 hover:text-[#96C346]"
                onClick={() => toggleMobileSubMenu("team")}
              >
                <span>Team C-DRASTA</span>
                <span>{mobileSubMenu.team ? "▴" : "▾"}</span>
              </button>
              {mobileSubMenu.team && (
                <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                  {/* Governance and Advisory with submenu */}
                  <div className="space-y-1">
                    <button
                      className="flex justify-between items-center w-full py-1.5 hover:text-[#96C346]"
                      onClick={() => toggleMobileSubSubMenu("governance")}
                    >
                      <span>Governance and Advisory</span>
                      <span>{mobileSubSubMenu.governance ? "▴" : "▾"}</span>
                    </button>
                    {mobileSubSubMenu.governance && (
                      <div className="pl-4 space-y-1 border-l-2 border-gray-300">
                        <NavLink
                          to="/v1/governanceandadvisorytrustees"
                          className={({ isActive }) =>
                            `block py-1 ${
                              isActive
                                ? "text-[#96C346] font-medium"
                                : "hover:text-[#96C346]"
                            }`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Trustees
                        </NavLink>
                        <NavLink
                          to="/v1/advisors"
                          className={({ isActive }) =>
                            `block py-1 ${
                              isActive
                                ? "text-[#96C346] font-medium"
                                : "hover:text-[#96C346]"
                            }`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Advisors
                        </NavLink>
                      </div>
                    )}
                  </div>

                  {/* Research Team with submenu */}
                  <div className="space-y-1">
                    <button
                      className="flex justify-between items-center w-full py-1.5 hover:text-[#96C346]"
                      onClick={() => toggleMobileSubSubMenu("research")}
                    >
                      <span>Research Team</span>
                      <span>{mobileSubSubMenu.research ? "▴" : "▾"}</span>
                    </button>
                    {mobileSubSubMenu.research && (
                      <div className="pl-4 space-y-1 border-l-2 border-gray-300">
                        <NavLink
                          to="/v1/researchers"
                          className={({ isActive }) =>
                            `block py-1 ${
                              isActive
                                ? "text-[#96C346] font-medium"
                                : "hover:text-[#96C346]"
                            }`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Researchers
                        </NavLink>
                        <NavLink
                          to="/v1/collaborators"
                          className={({ isActive }) =>
                            `block py-1 ${
                              isActive
                                ? "text-[#96C346] font-medium"
                                : "hover:text-[#96C346]"
                            }`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Experts and Collaborators
                        </NavLink>
                      </div>
                    )}
                  </div>

                  {/* Administration and Operations */}
                  <NavLink
                    to="/v1/administrationandoperations"
                    className={({ isActive }) =>
                      `block py-1.5 ${
                        isActive
                          ? "text-[#96C346] font-medium"
                          : "hover:text-[#96C346]"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Administration and Operations
                  </NavLink>
                </div>
              )}
            </div>

            {/* WHAT WE DO Dropdown */}
            <div className="space-y-1">
              <button
                className="flex justify-between items-center w-full py-2 hover:text-[#96C346]"
                onClick={() => toggleMobileSubMenu("whatWeDo")}
              >
                <span>WHAT WE DO</span>
                <span>{mobileSubMenu.whatWeDo ? "▴" : "▾"}</span>
              </button>
              {mobileSubMenu.whatWeDo && (
                <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                  {/* Research with submenu */}
                  <div className="space-y-1">
                    <button
                      className="flex justify-between items-center w-full py-1.5 hover:text-[#96C346]"
                      onClick={() =>
                        toggleMobileSubSubMenu("researchInitiatives")
                      }
                    >
                      <span>Research</span>
                      <span>
                        {mobileSubSubMenu.researchInitiatives ? "▴" : "▾"}
                      </span>
                    </button>
                    {mobileSubSubMenu.researchInitiatives && (
                      <div className="pl-4 space-y-1 border-l-2 border-gray-300">
                        <NavLink
                          to="/v1/research-themes"
                          className={({ isActive }) =>
                            `block py-1 ${
                              isActive
                                ? "text-[#96C346] font-medium"
                                : "hover:text-[#96C346]"
                            }`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Themes
                        </NavLink>
                        <NavLink
                          to="/v1/research-projects"
                          className={({ isActive }) =>
                            `block py-1 ${
                              isActive
                                ? "text-[#96C346] font-medium"
                                : "hover:text-[#96C346]"
                            }`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Projects
                        </NavLink>
                      </div>
                    )}
                  </div>

                  {/* Training with submenu */}
                  <div className="space-y-1">
                    <button
                      className="flex justify-between items-center w-full py-1.5 hover:text-[#96C346]"
                      onClick={() => toggleMobileSubSubMenu("capacityBuilding")}
                    >
                      <span>Training</span>
                      <span>
                        {mobileSubSubMenu.capacityBuilding ? "▴" : "▾"}
                      </span>
                    </button>
                    {mobileSubSubMenu.capacityBuilding && (
                      <div className="pl-4 space-y-1 border-l-2 border-gray-300">
                        <NavLink
                          to="/v1/training-themes"
                          className={({ isActive }) =>
                            `block py-1 ${
                              isActive
                                ? "text-[#96C346] font-medium"
                                : "hover:text-[#96C346]"
                            }`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Themes
                        </NavLink>
                        <NavLink
                          to="/v1/training-workshops"
                          className={({ isActive }) =>
                            `block py-1 ${
                              isActive
                                ? "text-[#96C346] font-medium"
                                : "hover:text-[#96C346]"
                            }`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Workshops
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RESEARCH COLUMN Dropdown */}
            <div className="space-y-1">
              <button
                className="flex justify-between items-center w-full py-2 hover:text-[#96C346]"
                onClick={() => toggleMobileSubMenu("researchColumn")}
              >
                <span>RESEARCH COLUMN</span>
                <span>{mobileSubMenu.researchColumn ? "▴" : "▾"}</span>
              </button>
              {mobileSubMenu.researchColumn && (
                <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                  <NavLink
                    to="/v1/csr"
                    className={({ isActive }) =>
                      `block py-1.5 ${
                        isActive
                          ? "text-[#96C346] font-medium"
                          : "hover:text-[#96C346]"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Focus on CSR
                  </NavLink>
                  <NavLink
                    to="/v1/abstractsandongoing"
                    className={({ isActive }) =>
                      `block py-1.5 ${
                        isActive
                          ? "text-[#96C346] font-medium"
                          : "hover:text-[#96C346]"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Abstracts and Research
                  </NavLink>
                  <NavLink
                    to="/v1/drastaavalokan"
                    className={({ isActive }) =>
                      `block py-1.5 ${
                        isActive
                          ? "text-[#96C346] font-medium"
                          : "hover:text-[#96C346]"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Drasta-Avalokan
                  </NavLink>
                  <NavLink
                    to="/v1/youngresearcher"
                    className={({ isActive }) =>
                      `block py-1.5 ${
                        isActive
                          ? "text-[#96C346] font-medium"
                          : "hover:text-[#96C346]"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Young Researcher's Column
                  </NavLink>
                </div>
              )}
            </div>

            {/* DATA ARCHIVE Dropdown */}
            <div className="space-y-1">
              <button
                className="flex justify-between items-center w-full py-2 hover:text-[#96C346]"
                onClick={() => toggleMobileSubMenu("dataArchive")}
              >
                <span>DATA ARCHIVE</span>
                <span>{mobileSubMenu.dataArchive ? "▴" : "▾"}</span>
              </button>
              {mobileSubMenu.dataArchive && (
                <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                  <NavLink
                    to="/v1/reports"
                    className={({ isActive }) =>
                      `block py-1.5 ${
                        isActive
                          ? "text-[#96C346] font-medium"
                          : "hover:text-[#96C346]"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reports
                  </NavLink>
                  <NavLink
                    to="/v1/database"
                    className={({ isActive }) =>
                      `block py-1.5 ${
                        isActive
                          ? "text-[#96C346] font-medium"
                          : "hover:text-[#96C346]"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Database
                  </NavLink>
                  <NavLink
                    to="/v1/news"
                    className={({ isActive }) =>
                      `block py-1.5 ${
                        isActive
                          ? "text-[#96C346] font-medium"
                          : "hover:text-[#96C346]"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    News
                  </NavLink>
                </div>
              )}
            </div>

            {/* DIRECTOR'S DESK */}
            <NavLink
              to="/v1/directors-desk"
              className={({ isActive }) =>
                `block py-2 ${
                  isActive
                    ? "text-[#96C346] font-medium"
                    : "hover:text-[#96C346]"
                }`
              }
              onClick={() => {
                handlePageClick("DIRECTOR'S");
                setMobileMenuOpen(false);
              }}
            >
              DIRECTOR'S DESK
            </NavLink>

            {/* GALLERY */}
            <NavLink
              to="/v1/gallery"
              className={({ isActive }) =>
                `block py-2 ${
                  isActive
                    ? "text-[#96C346] font-medium"
                    : "hover:text-[#96C346]"
                }`
              }
              onClick={() => {
                handlePageClick("GALLERY");
                setMobileMenuOpen(false);
              }}
            >
              GALLERY
            </NavLink>

            {/* CONTACT US Dropdown */}
            <div className="space-y-1">
              <button
                className="flex justify-between items-center w-full py-2 hover:text-[#96C346]"
                onClick={() => toggleMobileSubMenu("contact")}
              >
                <span>CONTACT US</span>
                <span>{mobileSubMenu.contact ? "▴" : "▾"}</span>
              </button>
              {mobileSubMenu.contact && (
                <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                  <NavLink
                    to="/v1/our-coordinates"
                    className={({ isActive }) =>
                      `block py-1.5 ${
                        isActive
                          ? "text-[#96C346] font-medium"
                          : "hover:text-[#96C346]"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Our Coordinates
                  </NavLink>
                  <NavLink
                    to="/v1/legal-compliance"
                    className={({ isActive }) =>
                      `block py-1.5 ${
                        isActive
                          ? "text-[#96C346] font-medium"
                          : "hover:text-[#96C346]"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Legal Compliance
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
