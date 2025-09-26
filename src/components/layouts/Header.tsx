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
  PhoneForwarded,
  BookOpen,
  NotebookText,
} from "lucide-react";
import { Button } from "../ui/button";
import { NavButton } from "../own/NavButton";
import { ModeToggle } from "./ModeToggle";
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
    <header className="animate-slide-in-down bg-background border-b sticky top-0 z-20 h-12 p-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg animate-pulse-glow dark:bg-slate-900/90 dark:border-slate-800">
      <div className="flex h-8 items-center justify-between container mx-auto px-5">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex justify-center items-center gap-2 ml-0 group transition-all duration-300 ease-in-out hover:scale-105"
            title="Home"
          >
            <h1 className="text-lg xs:text-xl font-bold m-0 mt-1 transition-colors duration-300 group-hover:text-primary text-foreground dark:text-white">
              <span className="xs:hidden">ADMiSSION CHALLENGE</span>
              <span className="hidden xs:inline">ADMiSSION CHALLENGE</span>
            </h1>
          </Link>
        </div>

        {/*________________ Desktop Menu _______________*/}
        <div className="hidden sm:flex items-center gap-2">
          {/* Courses link - visible to everyone */}
          <Button
            variant="ghost"
            asChild
            className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 group relative animate-fade-in-up"
          >
            <Link href="/course" title="Courses">
              <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden md:inline">Courses</span>
            </Link>
          </Button>

          {/* Books link - visible to everyone */}
          <Button
            variant="ghost"
            asChild
            className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 group relative animate-fade-in-up"
          >
            <Link href="/books" title="Books">
              <NotebookText className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
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
                className="text-xs sm:text-sm transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10"
              >
                <Link href="/signup" title="Sign Up">
                  <User className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
                  Sign Up
                </Link>
              </Button>
              <Button
                variant="ghost"
                asChild
                size="sm"
                className="text-xs sm:text-sm sm:mr-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10"
              >
                <Link href="/login" title="Login">
                  <LogIn className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
                  Login
                </Link>
              </Button>
              {/* WhatsApp icon for non-logged-in users - Desktop */}
              <a
                href="https://wa.me/01729249260"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent flex items-center justify-center"
                title="Contact via WhatsApp"
              >
                <PhoneForwarded className="w-5 h-5 text-foreground dark:text-white transition-transform duration-300 group-hover:scale-110" />
              </a>
              <ModeToggle />
            </>
          ) : (
            <>
              {/*______________ For md Screen ______________ */}
              {/* <Button
                                variant="ghost"
                                asChild
                                className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 group relative animate-fade-in-up"
                            >
                                <Link href="/feed" title="Blog">
                                    <Newspaper className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                    <span className="hidden md:inline">Feed</span>
                                </Link>
                            </Button> */}
              <Button
                variant="ghost"
                asChild
                className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 group relative animate-fade-in-up"
              >
                <Link href="/notices" title="Notices">
                  <BellRing className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <NotificationBadge count={unreadCount} />
                </Link>
              </Button>

              <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                <NavButton href="/admin" label="Admin" icon={Shield} />
              </RoleGuard>
              {/* WhatsApp icon for regular users (not Admin or Super Admin) - Desktop */}
              {user.role !== UserRole.ADMIN &&
                user.role !== UserRole.SUPER_ADMIN && (
                  <a
                    href="https://wa.me/01729249260"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent flex items-center justify-center"
                    title="Contact via WhatsApp"
                  >
                    <PhoneForwarded className="w-5 h-5 text-foreground dark:text-white transition-transform duration-300 group-hover:scale-110" />
                  </a>
                )}
              <ModeToggle />
              <button
                onClick={() => setIsDesktopProfileOpen((prev) => !prev)}
                className="group flex items-center gap-1 xs:gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full px-2 py-1 transition-all duration-300 ease-in-out hover:bg-primary/10 hover:scale-110"
                title="Account"
              >
                <Image
                  src={avatarSrc(user.avatarUrl)}
                  alt={`${user.firstName} ${user.lastName || ""}`}
                  width={32}
                  height={32}
                  className="w-6 h-6 xs:w-8 xs:h-8 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
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

        {/*________________ Mobile Menu Button ________________*/}
        <div className="flex sm:hidden items-center gap-2">
          <ModeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10"
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

      {/*________________ Mobile Menu Dropdown ________________*/}
      {/*________________ Backdrop ________________*/}
      <div
        className={`inset-0 sm:hidden transition-all duration-300 ${isMobileMenuOpen ? "bg-black/50 backdrop-blur-sm z-40 fixed" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
        style={{ top: "3rem" }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white text-4xl font-bold opacity-30">
            WhatsApp
          </span>
        </div>
      </div>

      {/*________________ Menu Panel ________________*/}
      <div
        className={`fixed top-12 right-0 h-screen bg-background/95 border-l border-border shadow-2xl z-50 sm:hidden dark:bg-slate-900/95 dark:border-slate-800 transition-all duration-300 ${isMobileMenuOpen ? "w-[80%] md:w-1/2 max-w-xs" : "w-[0%] md:w-0 max-w-0"}`}
      >
        <div className="px-4 py-6 space-y-3">
          {loading ? (
            <div className="w-full h-8 animate-pulse bg-muted rounded-lg"></div>
          ) : !user ? (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Navigation
                </h3>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                >
                  <Link
                    href="/course"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                    Courses
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                >
                  <Link
                    href="/books"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <NotebookText className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                    Books
                  </Link>
                </Button>
                {/* WhatsApp option in mobile menu for non-logged-in users */}
                <a
                  href="https://wa.me/01729249260"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full h-12 px-4 py-2 text-sm rounded-md transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <PhoneForwarded className="w-5 h-5 mr-3 text-foreground dark:text-white transition-transform duration-300 group-hover:scale-110" />
                  WhatsApp
                </a>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
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
                    <User className="w-5 h-5 mr-3" />
                    Sign Up
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                >
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    Login
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
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
                <div className="flex items-center gap-3 py-3 px-3 bg-muted/30 rounded-lg mb-4">
                  <Image
                    src={avatarSrc(user.avatarUrl)}
                    alt={`${user.firstName} ${user.lastName || ""}`}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
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
                      <p className="text-sm font-medium">
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

                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Navigation
                </h3>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                >
                  <Link
                    href="/course"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                    Courses
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                >
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UsersRound className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                    Profile
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                >
                  <Link
                    href="/profile/update"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UsersRound className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                    Update Profile
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                >
                  <Link
                    href="/forgot-password"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UsersRound className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                    Forgot Password
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                >
                  <Link
                    href="/notices"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative"
                  >
                    <BellRing className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                    Notices
                    <NotificationBadge
                      count={unreadCount}
                      className="absolute top-1 right-1"
                    />
                  </Link>
                </Button>
                {/*<Button variant="ghost" asChild className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2">
                                            <Link href="/feed" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Newspaper className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                                                Feed
                                            </Link>
                                        </Button> */}
                <RoleGuard
                  allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                  >
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                      Admin Panel
                    </Link>
                  </Button>
                </RoleGuard>
                {/* WhatsApp option in mobile menu for regular users (not Admin or Super Admin) */}
                {user.role !== UserRole.ADMIN &&
                  user.role !== UserRole.SUPER_ADMIN && (
                    <a
                      href="https://wa.me/01729249260"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full h-12 px-4 py-2 text-sm rounded-md transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PhoneForwarded className="w-5 h-5 mr-3 text-foreground dark:text-white transition-transform duration-300 group-hover:scale-110" />
                      WhatsApp
                    </a>
                  )}

                <div className="pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-destructive/10 hover:text-destructive hover:scale-105 hover:translate-x-2"
                  >
                    <LogOut className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                    Logout
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5 mr-3" />
                    Back
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/*________________ Desktop Profile Backdrop (like mobile) ________________*/}

      <>
        {/* Backdrop isDesktopProfileOpen - desktop only */}
        <div
          className={`top-12 left-0 right-0 bottom-0 z-40 hidden sm:block transition-all duration-300 ${isDesktopProfileOpen?"bg-black/30 backdrop-blur-md fixed":""}`}
          onClick={() => setIsDesktopProfileOpen(false)}
        />
        {/* Right Panel */}
        <div className={`fixed top-12 right-0 h-screen bg-background/95 border-l border-border shadow-2xl z-50 hidden sm:block dark:bg-slate-900/95 dark:border-slate-800 transition-all duration-300 ${isDesktopProfileOpen?"w-1/4":"w-0"}`}>
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {user && (
                  <>
                    <Image
                      src={avatarSrc(user.avatarUrl)}
                      alt={`${user.firstName} ${user.lastName || ""}`}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
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
                        <p className="text-sm font-medium">
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
                className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:translate-x-2"
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
                className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:translate-x-2"
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
                className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:translate-x-2"
              >
                <Link
                  href="/forgot-password"
                  onClick={() => setIsDesktopProfileOpen(false)}
                >
                  <UsersRound className="w-5 h-5 mr-3" />
                  Forgot Password
                </Link>
              </Button>
              <div className="pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsDesktopProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-destructive/10 hover:text-destructive hover:translate-x-2"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    </header>
  );
}
