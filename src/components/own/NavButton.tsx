import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
    icon: LucideIcon,
    label: string,
    href?: string,
}

export function NavButton({
    icon: Icon,
    label,
    href,
}: Props) {
    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            title={label}
            className="rounded-full transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/10 group"
            asChild
        >
            {href ? (
                <Link href={href}>
                    <Icon className="transition-transform duration-300 group-hover:scale-110" />
                </Link>
            ) : (
                <Icon className="transition-transform duration-300 group-hover:scale-110" />
            )}
        </Button>
    )
}
