"use client";

import {
  LogOut,
  UsersRound,
  User,
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
import { NavButton } from "../own/NavButton";
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
    <header className="animate-slide-in-down border-b sticky top-0 z-20 h-12 sm:h-14 p-2 transition-all duration-300 ease-in-out hover:shadow-lg animate-pulse-glow header-bg header-border">
      <div className="flex h-7 sm:h-9 items-center justify-between container mx-auto px-5 pt-1">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="group transition-all duration-300 ease-in-out hover:scale-105"
            title="Home"
          >
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-blue-200 text-foreground">
              <span className="sm:hidden">{instituteDetails.name}</span>
              <span className="hidden sm:inline">{instituteDetails.name}</span>
            </h1>
          </Link>
        </div>

        {/*-------------={ Desktop Menu }=-------------*/}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="ghost"
            asChild
            className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 hover:font-bold tracking-normal hover:[letter-spacing:1px] group relative animate-fade-in-up"
          >
            <Link href="/course" title="Courses">
              <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:[stroke-width:3]" />
              <span className="hidden md:inline">Courses</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            asChild
            className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 hover:font-bold tracking-normal hover:[letter-spacing:1px] group relative animate-fade-in-up"
          >
            <Link href="/books" title="Books">
              <NotebookText className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:[stroke-width:3]" />
              <span className="hidden md:inline">Books</span>
            </Link>
          </Button>

          {loading ? (
            <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
          ) : !user ? (
            <>
              <Button
                variant="ghost"
                asChild
                size="sm"
                className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 hover:font-bold tracking-normal hover:[letter-spacing:1px] group relative animate-fade-in-up"
              >
                <Link href="/signup" title="Sign Up">
                  <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:[stroke-width:3]" />
                  Sign Up
                </Link>
              </Button>
              <Button
                variant="ghost"
                asChild
                size="sm"
                className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 hover:font-bold tracking-normal hover:[letter-spacing:1px] group relative animate-fade-in-up"
              >
                <Link href="/login" title="Login">
                  <LogIn className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:[stroke-width:3]" />
                  Login
                </Link>
              </Button>
              <ThemeToggle />
            </>
          ) : (
            <>
              {/*______________ For md Screen ______________ */}
              <Button
                variant="ghost"
                asChild
                className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 hover:font-bold group relative animate-fade-in-up"
              >
                <Link href="/notices" title="Notices">
                  <BellRing className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:[stroke-width:3]" />
                  <NotificationBadge count={unreadCount} />
                </Link>
              </Button>

              <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                <Button
                  variant="ghost"
                  asChild
                  className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 hover:font-bold group relative animate-fade-in-up"
                >
                  <Link href="/admin" title="Admin">
                    <Shield className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:[stroke-width:3]" />
                  </Link>
                </Button>
              </RoleGuard>
              <ThemeToggle className="group-hover:scale-110 " />
              <button
                onClick={() => setIsDesktopProfileOpen((prev) => !prev)}
                className="group flex items-center gap-1 sm:gap-2 focus:outline-none rounded-full px-2 py-1 transition-all duration-300 ease-in-out dark:hover:bg-blue-100/5 hover:bg-primary/10 hover:scale-110"
                title="Account"
              >
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
              </button>
            </>
          )}
        </div>

        {/*-------------={ Mobile Menu Button }=-------------*/}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
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
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Account
                </h3>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                >
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UsersRound className="w-5 h-5 mr-3" />
                    Sign Up
                  </Link>
                </Button>
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
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5 mr-3" />
                  Back
                </Button>
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
                {/* <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-10"
                >
                  <Link
                    href="/profile/update"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UsersRound className="w-5 h-5 mr-2" />
                    Update Profile
                  </Link>
                </Button> */}
                {/* <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-10"
                >
                  <Link
                    href="/forgot-password"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UsersRound className="w-5 h-5 mr-2" />
                    Forgot Password
                  </Link>
                </Button> */}

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
                <RoleGuard
                  allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
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
                </RoleGuard>

                <div className="fixed bottom-2 w-full border-t-2 border-blue-200 pt-[2px]">
                  <div className="border-t-2 border-blue-200">
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
                  </div>
                  {/* <Button
                    variant="ghost"
                    className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5 mr-3" />
                    Back
                  </Button> */}
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
              <button
                className="p-2 rounded-md hover:bg-accent/50 transition-colors"
                aria-label="Close"
                onClick={() => setIsDesktopProfileOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Settings
              </h3>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-blue-100/60 hover:translate-x-2"
              >
                <Link
                  href="/profile"
                  onClick={() => setIsDesktopProfileOpen(false)}
                >
                  <UsersRound className="w-5 h-5 mr-3" />
                  Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-blue-100/60 hover:translate-x-2"
              >
                <Link
                  href="/profile/update"
                  onClick={() => setIsDesktopProfileOpen(false)}
                >
                  <UsersRound className="w-5 h-5 mr-3" />
                  Update Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-blue-100/60 hover:translate-x-2"
              >
                <Link
                  href="/forgot-password"
                  onClick={() => setIsDesktopProfileOpen(false)}
                >
                  <KeyRound className="w-5 h-5 mr-3" />
                  Forgot Password
                </Link>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-blue-100/60 hover:translate-x-2"
              >
                <Link
                  href="/exams"
                  onClick={() => setIsDesktopProfileOpen(false)}
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Exams
                </Link>
              </Button>
              <RoleGuard
                allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-blue-100/60 hover:translate-x-2"
                >
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="w-5 h-5 mr-3" />
                    Admin Panel
                  </Link>
                </Button>
              </RoleGuard>
              <div className="fixed bottom-4 w-full border-t-2 border-blue-200 pt-[2px]">
                <div className="border-t-2 border-blue-200">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsDesktopProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full justify-start mt-2 px-2 h-12 text-left transition-all duration-300 ease-in-out hover:bg-destructive/10 hover:text-destructive hover:translate-x-2 bg-blue-200/30 dark:bg-blue-200/5"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </header>
  );
}
