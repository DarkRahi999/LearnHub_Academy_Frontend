"use client";

import {
  LogOut,
  UsersRound,
  LogIn,
  Menu,
  X,
  BellRing,
  Shield,
  BookOpen,
  NotebookText,
  Calendar,
  KeyRound,
} from "lucide-react";
import { Button } from "../ui/button";
import RoleGuard from "../auth/RoleGuard";
import RoleBadge from "../auth/RoleBadge";
import { UserRole } from "@/interface/user";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationBadge } from "@/hooks/useNotificationBadge";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../ui/theme-toggle";
import instituteDetails from "@/app/db/institute";
import { motion } from "framer-motion";

export default function Header() {
  const { user, isLoading: loading, logout } = useAuth();
  const router = useRouter();

  // Initialize notification badge hook always (not conditionally)
  const notificationData = useNotificationBadge();
  const unreadCount = user ? notificationData?.unreadCount || 0 : 0;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false);

  const avatarSrc = (url?: string) => {
    const v = (url || "").trim();
    if (!v || v === "null" || v === "undefined") return "/default-user.svg";
    return v;
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="animate-pulse-glow border-b sticky top-0 z-20 h-12 sm:h-14 p-2 transition-all duration-300 ease-in-out header-bg header-border">
      <div className="flex h-7 sm:h-9 items-center justify-between container mx-auto px-5 pt-1">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/"
              className="group transition-all duration-300 ease-in-out"
              title="Home"
            >
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-blue-200 text-foreground">
                <span className="sm:hidden">{instituteDetails.name}</span>
                <span className="hidden sm:inline">{instituteDetails.name}</span>
              </h1>
            </Link>
          </motion.div>
        </div>

        {/*-------------={ Desktop Menu }=-------------*/}
        <div className="hidden sm:flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              asChild
              className="transition-all duration-300 ease-in-out hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 hover:font-bold tracking-normal hover:[letter-spacing:1px] group relative"
            >
              <Link href="/course" title="Courses">
                <div className="relative">
                  <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:[stroke-width:3]" />
                </div>
                <span className="hidden md:inline">Courses</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              asChild
              className="transition-all duration-300 ease-in-out hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 hover:font-bold tracking-normal hover:[letter-spacing:1px] group relative"
            >
              <Link href="/books" title="Books">
                <div className="relative">
                  <NotebookText className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:[stroke-width:3]" />
                </div>
                <span className="hidden md:inline">Books</span>
              </Link>
            </Button>
          </motion.div>

          {loading ? (
            <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
          ) : !user ? (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  asChild
                  size="sm"
                  className="transition-all duration-300 ease-in-out hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 hover:font-bold tracking-normal hover:[letter-spacing:1px] group relative"
                >
                  <Link href="/signup" title="Sign Up">
                    <div className="relative">
                      <UsersRound className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:[stroke-width:3]" />
                    </div>
                    Sign Up
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  asChild
                  size="sm"
                  className="transition-all duration-300 ease-in-out hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 hover:font-bold tracking-normal hover:[letter-spacing:1px] group relative"
                >
                  <Link href="/login" title="Login">
                    <div className="relative">
                      <LogIn className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:[stroke-width:3]" />
                    </div>
                    Login
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThemeToggle />
              </motion.div>
            </>
          ) : (
            <>
              {/*______________ For md Screen ______________ */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="transition-all duration-300 ease-in-out hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 group relative"
                >
                  <Link href="/notices" title="Notices">
                    <div className="relative">
                      <BellRing className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:[stroke-width:3]" />
                    </div>
                    <NotificationBadge count={unreadCount} />
                  </Link>
                </Button>
              </motion.div>

              <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="transition-all duration-300 ease-in-out hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 group relative"
                  >
                    <Link href="/admin" title="Admin">
                      <div className="relative">
                        <Shield className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:[stroke-width:3]" />
                      </div>
                    </Link>
                  </Button>
                </motion.div>
              </RoleGuard>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <ThemeToggle className="group-hover:scale-110" />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDesktopProfileOpen((prev) => !prev)}
                className="group flex items-center gap-1 sm:gap-2 focus:outline-none rounded-full px-2 py-1 transition-all duration-300 ease-in-out dark:hover:bg-blue-100/5 hover:bg-primary/10"
                title="Account"
              >
                <div className="relative">
                  <Image
                    src={avatarSrc(user.avatarUrl)}
                    alt={`${user.firstName} ${user.lastName || ""}`}
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (!img.src.includes("/default-user.svg")) {
                        img.src = "/default-user.svg";
                      }
                    }}
                    unoptimized
                  />
                </div>
              </motion.button>
            </>
          )}
        </div>

        {/*-------------={ Mobile Menu Button }=-------------*/}
        <div className="flex sm:hidden items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThemeToggle />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 transition-all duration-300 ease-in-out"
            >
              <div className="transition-transform duration-300 ease-in-out">
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 rotate-180" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </div>
            </Button>
          </motion.div>
        </div>
      </div>

      {/*-------------={ Mobile Menu Backdrop }=-------------*/}
      <div
        className={`inset-0 sm:hidden transition-all duration-300 ${isMobileMenuOpen ? "bg-blue-300/20 backdrop-blur-xs z-40 fixed" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
        style={{ top: "3rem" }}
      />

      {/*-------------={ Mobile Menu Panel }=-------------*/}
      <div
        className={`fixed top-12 right-0 h-screen bg-blue-50/90 border-l border-border shadow-2xl z-50 sm:hidden dark:bg-slate-900/95 dark:border-slate-800 transition-all duration-300 ${isMobileMenuOpen ? "w-[80%] md:w-1/2 max-w-xs" : "w-[0%] md:w-0 max-w-0"}`}
      >
        <div className="px-2 pt-2 space-y-3">
          {loading ? (
            <div className="w-full h-8 animate-pulse bg-muted rounded-lg"></div>
          ) : !user ? (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Navigation
                </h3>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start h-10"
                  >
                    <Link
                      href="/course"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Courses
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start h-10"
                  >
                    <Link
                      href="/books"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <NotebookText className="w-5 h-5 mr-2" />
                      Books
                    </Link>
                  </Button>
                </motion.div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Account
                </h3>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50"
                  >
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UsersRound className="w-5 h-5 mr-3" />
                      Sign Up
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start h-10"
                  >
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Login
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5 mr-3" />
                    Back
                  </Button>
                </motion.div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2 py-2 px-2 bg-blue-200/30 dark:bg-blue-200/5 rounded-lg">
                  <Image
                    src={avatarSrc(user.avatarUrl)}
                    alt={`${user.firstName} ${user.lastName || ""}`}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-300/50"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (!img.src.includes("/default-user.svg")) {
                        img.src = "/default-user.svg";
                      }
                    }}
                    unoptimized
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-primary">
                        {user.firstName}
                        {user.lastName ? ` ${user.lastName}` : ""}
                      </p>
                      <RoleBadge role={user.role} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-muted-foreground">
                  Navigation
                </h3>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start h-10"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UsersRound className="w-5 h-5 mr-2" />
                      Profile
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start h-10"
                  >
                    <Link
                      href="/exams"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Exams
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start h-10"
                  >
                    <Link
                      href="/course"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Courses
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start h-10"
                  >
                    <Link
                      href="/books"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Books
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start h-10"
                  >
                    <Link
                      href="/notices"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative"
                    >
                      <BellRing className="w-5 h-5 mr-2" />
                      Notices
                      <NotificationBadge
                        count={unreadCount}
                        className="absolute top-1 right-1"
                      />
                    </Link>
                  </Button>
                </motion.div>
                <RoleGuard
                  allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
                >
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start h-10"
                    >
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5 mr-2" />
                        Admin Panel
                      </Link>
                    </Button>
                  </motion.div>
                </RoleGuard>

                <div className="fixed bottom-2 w-full border-t-2 border-blue-200 pt-[2px]">
                  <div className="border-t-2 border-blue-200">
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full justify-start h-10 mt-1 px-2 bg-blue-200/30 dark:bg-blue-200/5 rounded-lg"
                      >
                        <LogOut className="w-5 h-5 mr-2" />
                        Logout
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/*---------------={ Desktop Profile Backdrop }=-------------*/}
      <>
        <div
          className={`top-14 left-0 right-0 bottom-0 z-40 hidden sm:block transition-all duration-300 ${isDesktopProfileOpen ? "bg-blue-300/20 backdrop-blur-sm fixed" : ""}`}
          onClick={() => setIsDesktopProfileOpen(false)}
        />
        <div className={`fixed top-14 right-0 h-screen bg-blue-50/90 border-l border-border shadow-2xl z-50 hidden sm:block dark:bg-slate-900/95 dark:border-slate-800 transition-all duration-300 ${isDesktopProfileOpen ? "w-1/4" : "w-0"}`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2 p-[10px] bg-blue-200/30 dark:bg-blue-200/5 rounded-lg">
              <div className="flex items-center gap-2">
                {user && (
                  <>
                    <Image
                      src={avatarSrc(user.avatarUrl)}
                      alt={`${user.firstName} ${user.lastName || ""}`}
                      width={50}
                      height={50}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-300/50 dark:ring-blue-200/50"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (!img.src.includes("/default-user.svg")) {
                          img.src = "/default-user.svg";
                        }
                      }}
                      unoptimized
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-md font-semibold text-primary">
                          {user.firstName}
                          {user.lastName ? ` ${user.lastName}` : ""}
                        </p>
                        <RoleBadge role={user.role} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-md hover:bg-accent/50 transition-colors"
                aria-label="Close"
                onClick={() => setIsDesktopProfileOpen(false)}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Settings
              </h3>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-blue-100/60"
                >
                  <Link
                    href="/profile"
                    onClick={() => setIsDesktopProfileOpen(false)}
                  >
                    <UsersRound className="w-5 h-5 mr-3" />
                    Profile
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-blue-100/60"
                >
                  <Link
                    href="/profile/update"
                    onClick={() => setIsDesktopProfileOpen(false)}
                  >
                    <UsersRound className="w-5 h-5 mr-3" />
                    Update Profile
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-blue-100/60"
                >
                  <Link
                    href="/forgot-password"
                    onClick={() => setIsDesktopProfileOpen(false)}
                  >
                    <KeyRound className="w-5 h-5 mr-3" />
                    Forgot Password
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-blue-100/60"
                >
                  <Link
                    href="/exams"
                    onClick={() => setIsDesktopProfileOpen(false)}
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    Exams
                  </Link>
                </Button>
              </motion.div>
              <RoleGuard
                allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-blue-100/60"
                  >
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield className="w-5 h-5 mr-3" />
                      Admin Panel
                    </Link>
                  </Button>
                </motion.div>
              </RoleGuard>
              <div className="fixed bottom-4 w-full border-t-2 border-blue-200 pt-[2px]">
                <div className="border-t-2 border-blue-200">
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsDesktopProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full justify-start mt-2 px-2 h-12 text-left transition-all duration-300 ease-in-out hover:bg-destructive/10 hover:text-destructive bg-blue-200/30 dark:bg-blue-200/5"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </header>
  );
}