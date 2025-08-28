import { HomeIcon, File, UsersRound } from 'lucide-react';
import { NavButton } from '@/components/own/NavButton';
import { ModeToggle } from '@/components/layouts/ModeToggle';
import { Button } from '../ui/button';
import Link from 'next/link';

export function Header() {
    return (
        <header className="animate-slide bg-background h-12 p-2 border-b sticky top-0 z-20">
            <div className="flex h-8 items-center justify-between w-full">
                <div className="flex items-center gap-2">

                    <NavButton href="/" label="Home" icon={HomeIcon} />
                    
                    <Link href="/" className="flex justify-center items-center gap-2 ml-0" title="Home">
                        <h1 className="hidden sm:block text-xl font-bold m-0 mt-1">
                            LearnHub Academy
                        </h1>
                    </Link>

                </div>
                <div className="flex items-center">

                    <Button variant="ghost">
                        <Link href="/vlog" title="Vlog">DisCover</Link>
                    </Button>

                    <NavButton href="/notice" label="Notice" icon={File} />

                    <NavButton href="/profile" label="Profile" icon={UsersRound} />

                    <ModeToggle />

                </div>
            </div>
        </header>
    )
}