"use client";

import { LogOut, UsersRound, User, LogIn, Menu, X, MessageCircleMore, MonitorCog } from 'lucide-react';
import { Button } from '../ui/button';
import { NavButton } from '../own/NavButton';
import { ModeToggle } from './ModeToggle';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

//W---------={ Temporary auth state - replace with your auth context }=----------
interface User {
    id: number;
    email: string;
    userName: string;
    firstName: string;
    lastName?: string;
    avatarUrl: string;
}

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false);

    const avatarSrc = (url?: string) => {
        const v = (url || '').trim();
        if (!v || v === 'null' || v === 'undefined') return '/default-user.svg';
        return v;
    };

    useEffect(() => {
        //W---------={ Check for stored token and user data }=----------
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user_data');

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_data');
            }
        }
        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <header className="animate-slide bg-background border-b sticky top-0 z-20 px-4 xs:px-6 sm:px-8 lg:px-12 h-12 p-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md">
            <div className="flex h-8 items-center justify-between w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <Link href="/"
                        className="flex justify-center items-center gap-2 ml-0 group transition-all duration-300 ease-in-out hover:scale-105"
                        title="Home"
                    >
                        <h1 className="text-lg xs:text-xl font-bold m-0 mt-1 transition-colors duration-300 group-hover:text-primary">
                            <span className="xs:hidden">LearnHub Academy</span>
                            <span className="hidden xs:inline">LearnHub Academy</span>
                        </h1>
                    </Link>
                </div>

                {/*________________ Desktop Menu _______________*/}
                <div className="hidden sm:flex items-center gap-2">
                    {loading ? (
                        <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
                    ) : !user ? (
                        <>
                            <Button variant="ghost" asChild size="sm" className="text-xs sm:text-sm transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10">
                                <Link href="/signup" title="Sign Up">
                                    <User className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
                                    Sign Up
                                </Link>
                            </Button>
                            <Button variant="ghost" asChild size="sm" className="text-xs sm:text-sm sm:mr-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10">
                                <Link href="/login" title="Login">
                                    <LogIn className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
                                    Login
                                </Link>
                            </Button>
                            <ModeToggle />
                        </>
                    ) : (
                        <>
                            <NavButton href="/post" label="posts" icon={MonitorCog} />
                            <NavButton href="/notice" label="Notices" icon={MessageCircleMore} />
                            <ModeToggle />
                            <button
                                onClick={() => setIsDesktopProfileOpen((prev) => !prev)}
                                className="group flex items-center gap-1 xs:gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full px-2 py-1 transition-all duration-300 ease-in-out hover:bg-primary/10 hover:scale-110"
                                title="Account"
                            >
                                <Image
                                    src={avatarSrc(user.avatarUrl)}
                                    alt={`${user.firstName} ${user.lastName || ''}`}
                                    width={32}
                                    height={32}
                                    className="w-6 h-6 xs:w-8 xs:h-8 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    onError={(e) => {
                                        const img = e.currentTarget as HTMLImageElement;
                                        if (!img.src.includes('/default-user.svg')) {
                                            img.src = '/default-user.svg';
                                        }
                                    }}
                                    unoptimized
                                />
                                {/* Name hidden per request */}
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
                            {isMobileMenuOpen ? <X className="w-5 h-5 rotate-180" /> : <Menu className="w-5 h-5" />}
                        </div>
                    </Button>
                </div>
            </div>

            {/*________________ Mobile Menu Dropdown ________________*/}
            {isMobileMenuOpen && (
                <>
                    {/*________________ Backdrop ________________*/}
                    <div
                        className="fixed top-12 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-md z-40 sm:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />


                    {/*________________ Menu Panel ________________*/}
                    <div className="fixed top-12 right-0 w-1/2 max-w-xs h-screen bg-background/95 border-l border-border shadow-2xl z-50 sm:hidden">
                        <div className="px-4 py-6 space-y-3">
                            {loading ? (
                                <div className="w-full h-8 animate-pulse bg-muted rounded-lg"></div>
                            ) : !user ? (
                                <>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Account</h3>
                                        <Button variant="ghost" asChild className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2">
                                            <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                                <User className="w-5 h-5 mr-3" />
                                                Sign Up
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" asChild className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2">
                                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                                <LogIn className="w-5 h-5 mr-3" />
                                                Login
                                            </Link>
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 py-3 px-3 bg-muted/30 rounded-lg mb-4">
                                            <Image
                                                src={avatarSrc(user.avatarUrl)}
                                                alt={`${user.firstName} ${user.lastName || ''}`}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                                                onError={(e) => {
                                                    const img = e.currentTarget as HTMLImageElement;
                                                    if (!img.src.includes('/default-user.svg')) {
                                                        img.src = '/default-user.svg';
                                                    }
                                                }}
                                                unoptimized
                                            />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {user.firstName}{user.lastName ? ` ${user.lastName}` : ''}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Navigation</h3>
                                        <Button variant="ghost" asChild className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2">
                                            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                                <UsersRound className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                                                Profile
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" asChild className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2">
                                            <Link href="/profile/update" onClick={() => setIsMobileMenuOpen(false)}>
                                                <UsersRound className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                                                Update Profile
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" asChild className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2">
                                            <Link href="/notices" onClick={() => setIsMobileMenuOpen(false)}>
                                                <MessageCircleMore className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                                                Notices
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" asChild className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:scale-105 hover:translate-x-2">
                                            <Link href="/notices" onClick={() => setIsMobileMenuOpen(false)}>
                                                <MonitorCog className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                                                Recent Posts
                                            </Link>
                                        </Button>

                                        <div className="pt-4 border-t border-border">
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    logout();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-destructive/10 hover:text-destructive hover:scale-105 hover:translate-x-2"
                                            >
                                                <LogOut className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )
            }

            {/*________________ Desktop Profile Backdrop (like mobile) ________________*/}
            {isDesktopProfileOpen && (
                <>
                    {/* Backdrop - desktop only */}
                    <div
                        className="fixed top-12 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-md z-40 hidden sm:block"
                        onClick={() => setIsDesktopProfileOpen(false)}
                    />
                    {/* Right Panel */}
                    <div className="fixed top-12 right-0 h-screen w-1/4 bg-background/95 border-l border-border shadow-2xl z-50 hidden sm:block">
                        <div className="px-4 py-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {user && (
                                        <>
                                            <Image
                                                src={avatarSrc(user.avatarUrl)}
                                                alt={`${user.firstName} ${user.lastName || ''}`}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                                                onError={(e) => {
                                                    const img = e.currentTarget as HTMLImageElement;
                                                    if (!img.src.includes('/default-user.svg')) {
                                                        img.src = '/default-user.svg';
                                                    }
                                                }}
                                                unoptimized
                                            />
                                            <div>
                                                <p className="text-sm font-medium">{user.firstName}{user.lastName ? ` ${user.lastName}` : ''}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
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
                                <h3 className="text-sm font-semibold text-muted-foreground">Settings</h3>
                                <Button variant="ghost" asChild className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:translate-x-2">
                                    <Link href="/profile" onClick={() => setIsDesktopProfileOpen(false)}>
                                        <UsersRound className="w-5 h-5 mr-3" />
                                        Profile
                                    </Link>
                                </Button>
                                <Button variant="ghost" asChild className="w-full justify-start h-12 text-left transition-all duration-300 ease-in-out hover:bg-accent/50 hover:translate-x-2">
                                    <Link href="/profile/update" onClick={() => setIsDesktopProfileOpen(false)}>
                                        <UsersRound className="w-5 h-5 mr-3" />
                                        Update Profile
                                    </Link>
                                </Button>
                                <div className="pt-2 border-t border-border">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setIsDesktopProfileOpen(false);
                                            logout();
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
            )}
        </header >
    )
}