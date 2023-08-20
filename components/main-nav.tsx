"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {

    const pathname = usePathname();
    const params = useParams()
    const routes = [
        {
            href: `/${params.storeID}`,
            label: 'Overview',
            active: pathname === `/${params.storeId}`,
        },
        {
            href: `/${params.storeID}/billboard`,
            label: 'Billboards',
            active: pathname === `/${params.storeId}/billboard`,
        },
        {
            href: `/${params.storeID}/categories`,
            label: 'Categorias',
            active: pathname === `/${params.storeId}/categories`,
        },
        {
            href: `/${params.storeID}/subcategory`,
            label: 'Subcategorias',
            active: pathname === `/${params.storeId}/subcategory`,
        },
        {
            href: `/${params.storeID}/product`,
            label: 'Productos',
            active: pathname === `/${params.storeId}/product`,
        },
        {
            href: `/${params.storeID}/orders`,
            label: 'Órdenes',
            active: pathname === `/${params.storeId}/product`,
        },
        {
            href: `/${params.storeID}/settings`,
            label: 'Settings',
            active: pathname === `/${params.storeId}/settings`,
        },
    ];

  return (
    <nav
        className={cn("flex items-center space-x-5 lg:space-x-6", className)}
        >
        {routes.map((route) =>(
            <Link 
                key={route.href}
                href={route.href}
                className={cn(' text-sm font-medium transition-colors hover:text-primary ml-3',
                route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
                )}
            >
                {route.label}
            </Link>
        ))}
    </nav>
  )
}
