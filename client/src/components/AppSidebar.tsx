"use client"

import { usePathname } from 'next/navigation';
import React from 'react'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar';
import { Building, FileText, Heart, Home, Menu, Settings, X } from 'lucide-react';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const AppSidebar = ({userType}: AppSidebarProps) => {
  const pathname = usePathname();
  const {toggleSidebar, open, isMobile} = useSidebar();

  const navLinks =
    userType === "manager"
        ? [
            {
                icon: Building,
                label: "Properties",
                href: "/managers/properties"
            },
            {
                icon: FileText,
                label: "Applications",
                href: "/managers/applications"
            },
            {
                icon: Settings,
                label: "Settings",
                href: "/managers/settings"
            },
        ] : [
            {
                icon: Heart,
                label: "Favorites",
                href: "/tenants/favorites"
            },
            {
                icon: FileText,
                label: "Applications",
                href: "/tenants/applications"
            },
            {
                icon: Home,
                label: "Residences",
                href: "/tenants/residences"
            },
            {
                icon: Settings,
                label: "Settings",
                href: "/tenants/settings"
            },
        ]

    return (
        <Sidebar
            collapsible='icon'
            className='fixed left-0 bg-white shadow-lg'
            style={{
                top: `${NAVBAR_HEIGHT}px`,
                height: `calc(100vh - ${NAVBAR_HEIGHT}px)`
            }}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div
                            className={cn(
                                "flex w-full items-center pt-3 mb-2 sm:mb-3",
                                isMobile ? "min-h-[48px] justify-between px-4" : "min-h-[56px]",
                                !isMobile && open ? "justify-between px-6" : !isMobile ? "justify-center" : ""
                            )}
                        >
                            {(open || isMobile) ? (
                                <>
                                    <h1 className='text-base sm:text-lg md:text-xl font-bold text-gray-800'>
                                        {userType === "manager" ? "Manager View" : "Renter View"}
                                    </h1>
                                    {!isMobile && (
                                        <button
                                            className='hover:bg-gray-100 p-2 rounded-md'
                                            onClick={()=>toggleSidebar()}
                                        >
                                            <X className='h-5 w-5 sm:h-6 sm:w-6 text-gray-600'/>
                                        </button>
                                    )}
                                </>
                                ) : (
                                    <button
                                        className='hover:bg-gray-100 p-2 rounded-md'
                                        onClick={()=>toggleSidebar()}
                                    >
                                        <Menu className='h-6 w-6 text-gray-600'/>
                                    </button>
                                )
                            }
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {navLinks.map((link, idx)=>{
                        const isActive = pathname === link.href;
                        return(
                            <SidebarMenuItem key={idx}>
                                <SidebarMenuButton
                                    asChild
                                    className={cn(
                                        "flex items-center",
                                        isMobile ? "px-5 py-5" : "px-7 py-7",
                                        isActive ? "bg-gray-100" : "text-gray-600 hover:bg-gray-100",
                                        open || isMobile ? "text-blue-600" : "ml-[5px]"
                                    )}
                                >
                                    <Link
                                        href={link.href}
                                        className='w-full'
                                        scroll={false}
                                        onClick={() => { if (isMobile) toggleSidebar(); }}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <link.icon className={cn(
                                                isMobile ? "h-5 w-5" : "h-5 w-5",
                                                isActive ? "text-blue-600" : "text-gray-600"
                                            )}/>
                                            <span className={cn(
                                                "font-medium",
                                                isMobile ? "text-sm" : "text-base",
                                                isActive ? "text-blue-600" : "text-gray-600"
                                            )}>
                                                {link.label}
                                            </span>
                                        </div>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>

        </Sidebar>
  )
}

export default AppSidebar;