"use client";

import { File, LogOut, UsersRound } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from "@/auth/auth";
import { NavButton } from '../own/NavButton';
import { ModeToggle } from './ModeToggle';
import Link from 'next/link';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="animate-slide bg-background h-12 p-2 border-b sticky top-0 z-20 px-12">
            <div className="flex h-8 items-center justify-between w-full">
                <div className="flex items-center gap-2">

                    {/* <NavButton href="/" label="Home" icon={HomeIcon} /> */}
                    <Link href="/" className="flex justify-center items-center gap-2 ml-0" title="Home">
                        <h1 className="hidden sm:block text-xl font-bold m-0 mt-1">
                            LearnHub Academy
                        </h1>
                    </Link>

                </div>
                <div className="flex items-center">
                    {!user ? (
                        <>
                            <ModeToggle />
                            <Button variant="ghost">
                                <Link href="/login" title="Vlog">Login</Link>
                            </Button>
                        </>
                    ) : user.role === "viewer" ? (
                        <>
                            <Button variant="ghost">
                                <Link href="/vlog" title="Vlog">DisCover</Link>
                            </Button>
                            <NavButton href="/notice" label="Notice" icon={File} />
                            <ModeToggle />
                            <Button variant="ghost" onClick={logout} className="rounded-3xl">
                                <LogOut />
                            </Button>

                        </>
                    ) : user.role === "editor" ? (
                        <>
                            <Button variant="ghost">
                                <Link href="/vlog-post" title="Vlog">Create Post</Link>
                            </Button>
                            <Button variant="ghost">
                                <Link href="/notice-post" title="notice">Create Notice</Link>
                            </Button>
                            <ModeToggle />
                            <NavButton href="/profile" label="Profile" icon={UsersRound} />
                            <Button variant="ghost" onClick={logout} className="rounded-3xl">
                                <LogOut />
                            </Button>
                        </>
                    ) : null}
                </div>
            </div>
        </header>
    )
}