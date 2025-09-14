import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
    icon: LucideIcon,
    label: string,
    href?: string,
    badge?: ReactNode,
}

export function NavButton({
    icon: Icon,
    label,
    href,
    badge,
}: Props) {
    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            title={label}
            className="rounded-full transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/10 group relative"
            asChild
        >
            {href ? (
                <Link href={href}>
                    <Icon className="transition-transform duration-300 group-hover:scale-110" />
                    {badge}
                </Link>
            ) : (
                <>
                    <Icon className="transition-transform duration-300 group-hover:scale-110" />
                    {badge}
                </>
            )}
        </Button>
    )
}
