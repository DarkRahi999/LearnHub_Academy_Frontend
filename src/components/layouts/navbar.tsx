"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowDownNarrowWide, SquareChevronLeft, X } from "lucide-react";

//W---------{ User Endpoints }----------
const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false); // mobile dropdown

    const servicesSubmenu = [
        { label: "Graphics Design", href: "/services/graphics-design" },
        { label: "Web Development", href: "/services/web-development" },
        { label: "Digital Marketing", href: "/services/digital-marketing" },
        { label: "Business Consulting", href: "/services/business-consulting" },
        { label: "Ecommerce Store Management", href: "/services/ecommerce" },
        { label: "Content Marketing", href: "/services/content-marketing" },
        { label: "SEO", href: "/services/seo" },
    ];

    return (
        <header className="h-[57px] lg:h-[65px] w-full z-50 text-white shadow fixed bg-[#211c66]">
            <nav className="flex justify-between items-center py-2 container m-auto px-5">
                <Link href={"/"} className="flex items-center gap-3">
                   <h1>Elevixor</h1>
                </Link>

                {/* Desktop Menu */}
                <ul className="flex items-center gap-10 max-md:hidden">
                    <li>
                        <Link href="/" className="nav-item">Home</Link>
                    </li>
                    <li>
                        <Link href="/about" className="nav-item">About</Link>
                    </li>

                    {/* Services with Dropdown */}
                    <li className="relative group">
                        <div className="flex items-center gap-1 cursor-pointer">
                            Services <ArrowDownNarrowWide className="mt-[2px]"/>
                        </div>
                        <ul className="absolute left-0 top-full mt-2 bg-[#211c66] shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[220px]">
                            {servicesSubmenu.map((item) => (
                                <li key={item.href} className="nav-item">
                                    <Link
                                        href={item.href}
                                        className="block px-5 py-2 hover:bg-[#2b2680]"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li>
                        <Link href="/courses" className="nav-item">Courses</Link>
                    </li>
                    <button>
                        <Link
                            href="/contact"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-md text-white font-semibold hover:scale-105 transition-transform duration-300"
                        >
                            Contact Us
                        </Link>
                    </button>
                </ul>

                {/* Mobile Menu Toggle */}
                {!openMenu ? (
                    <button
                        className="text-3xl md:hidden"
                        onClick={() => setOpenMenu(true)}
                    ><SquareChevronLeft />
                    </button>
                ) : (
                    <button
                        className="text-3xl md:hidden"
                        onClick={() => setOpenMenu(false)}
                    >
                        <X />
                    </button>
                )}
            </nav>

            {/* Mobile Menu */}
            <div
                className={`${openMenu ? "w-full bg-[#211c66]" : "w-0"
                    } overflow-hidden transition-all duration-300 mobile-menu`}
            >
                <ul className="flex flex-col pl-5 py-4 lg:hidden space-y-4">
                    <li>
                        <Link href="/" onClick={() => setOpenMenu(false)}>Home</Link>
                    </li>
                    <li>
                        <Link href="/about" onClick={() => setOpenMenu(false)}>About</Link>
                    </li>

                    {/* Mobile Services Dropdown */}
                    <li>
                        <button
                            onClick={() => setOpenDropdown(!openDropdown)}
                            className="flex items-center gap-1"
                        >
                            Services <ArrowDownNarrowWide className={`transition-transform ${openDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {openDropdown && (
                            <ul className="ml-4 mt-2 space-y-2">
                                {servicesSubmenu.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => {
                                                setOpenMenu(false);
                                                setOpenDropdown(false);
                                            }}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    <li>
                        <Link href="/courses" onClick={() => setOpenMenu(false)}>Courses</Link>
                    </li>
                    <li>
                        <Link href="/contact" onClick={() => setOpenMenu(false)}>Contact</Link>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Navbar;
