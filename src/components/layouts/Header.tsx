"use client";

import { File, LogOut, UsersRound, User, LogIn, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { NavButton } from '../own/NavButton';
import { ModeToggle } from './ModeToggle';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Temporary auth state - replace with your auth context
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

    useEffect(() => {
        // Check for stored token and user data
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
        <header className="animate-slide bg-background border-b sticky top-0 z-20 px-4 xs:px-6 sm:px-8 lg:px-12 h-12 p-2">
            <div className="flex h-8 items-center justify-between w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex justify-center items-center gap-2 ml-0" title="Home">
                        <h1 className="text-lg xs:text-xl font-bold m-0 mt-1">
                            <span className="xs:hidden">LearnHub Academy</span>
                            <span className="hidden xs:inline">LearnHub Academy</span>
                        </h1>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-1 xs:gap-2">
                    {loading ? (
                        <div className="w-8 h-8 animate-pulse bg-gray-200 rounded"></div>
                    ) : !user ? (
                        <>
                            <Button variant="ghost" asChild size="sm" className="text-xs sm:text-sm">
                                <Link href="/signup" title="Sign Up">
                                    <User className="w-4 h-4 mr-1" />
                                    Sign Up
                                </Link>
                            </Button>
                            <Button variant="ghost" asChild size="sm" className="text-xs sm:text-sm sm:mr-2">
                                <Link href="/login" title="Login">
                                    <LogIn className="w-4 h-4 mr-1" />
                                    Login
                                </Link>
                            </Button>
                            <ModeToggle />
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-1 xs:gap-2">
                                <img
                                    src={user.avatarUrl}
                                    alt={`${user.firstName} ${user.lastName || ''}`}
                                    className="w-6 h-6 xs:w-8 xs:h-8 rounded-full object-cover"
                                />
                                <span className="text-xs xs:text-sm font-medium hidden sm:inline">
                                    {user.firstName}{user.lastName ? ` ${user.lastName}` : ''}
                                </span>
                            </div>
                            <NavButton href="/profile" label="Profile" icon={UsersRound} />
                            <NavButton href="/notices" label="Notices" icon={File} />
                            <ModeToggle />
                            <Button variant="ghost" onClick={logout} className="rounded-3xl" title="Logout">
                                <LogOut />
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex sm:hidden items-center gap-2">
                    <ModeToggle />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed top-12 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-md z-40 sm:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="fixed top-12 right-0 w-1/2 max-w-xs h-screen bg-background/95 backdrop-blur-md border-l border-border shadow-2xl z-50 sm:hidden">
                        <div className="px-4 py-6 space-y-3">
                            {loading ? (
                                <div className="w-full h-8 animate-pulse bg-muted rounded-lg"></div>
                            ) : !user ? (
                                <>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Account</h3>
                                        <Button variant="ghost" asChild className="w-full justify-start h-12 text-left hover:bg-accent/50">
                                            <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                                <User className="w-5 h-5 mr-3" />
                                                Sign Up
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" asChild className="w-full justify-start h-12 text-left hover:bg-accent/50">
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
                                            <img
                                                src={user.avatarUrl}
                                                alt={`${user.firstName} ${user.lastName || ''}`}
                                                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                                            />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {user.firstName}{user.lastName ? ` ${user.lastName}` : ''}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Navigation</h3>
                                        <Button variant="ghost" asChild className="w-full justify-start h-12 text-left hover:bg-accent/50">
                                            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                                <UsersRound className="w-5 h-5 mr-3" />
                                                Profile
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" asChild className="w-full justify-start h-12 text-left hover:bg-accent/50">
                                            <Link href="/notices" onClick={() => setIsMobileMenuOpen(false)}>
                                                <File className="w-5 h-5 mr-3" />
                                                Notices
                                            </Link>
                                        </Button>

                                        <div className="pt-4 border-t border-border">
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    logout();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="w-full justify-start h-12 text-left hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <LogOut className="w-5 h-5 mr-3" />
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </header>
    )
}