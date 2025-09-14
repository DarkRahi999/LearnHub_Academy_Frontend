import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
    icon: LucideIcon,
    label: string,
    href?: string,
    badge?: ReactNode,
    showTextOnMd?: boolean, // New prop to show text on medium screens
}

export function NavButton({
    icon: Icon,
    label,
    href,
    badge,
    showTextOnMd = false,
}: Props) {
    return (
        <Button
            variant="ghost"
            size={showTextOnMd ? "default" : "icon"}
            aria-label={label}
            title={label}
            className={`transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/10 group relative animate-fade-in-up ${
                showTextOnMd ? "" : "rounded-full"
            }`}
            asChild
        >
            {href ? (
                <Link href={href}>
                    <Icon className="transition-transform duration-300 group-hover:scale-110" />
                    {showTextOnMd && (
                        <span className="hidden md:inline ml-2">{label}</span>
                    )}
                    {badge}
                </Link>
            ) : (
                <>
                    <Icon className="transition-transform duration-300 group-hover:scale-110" />
                    {showTextOnMd && (
                        <span className="hidden md:inline ml-2">{label}</span>
                    )}
                    {badge}
                </>
            )}
        </Button>
    )
}
