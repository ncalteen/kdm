'use client'

import { NavMain } from '@/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { MarkGithubIcon } from '@primer/octicons-react'
import {
  DropdownMenu,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu'
import {
  DockIcon,
  type LucideIcon,
  MapPinHouse,
  PersonStanding
} from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { NavFooter } from './nav-footer'

const data = {
  navMain: [
    {
      title: 'Settlement',
      url: '#',
      icon: MapPinHouse,
      isActive: true,
      items: [
        {
          title: 'Create',
          url: '/kdm/settlement/create'
        }
      ]
    },
    {
      title: 'Survivors',
      url: '#',
      icon: PersonStanding,
      items: [
        {
          title: 'Create',
          url: '/kdm/survivors/create'
        }
      ]
    }
    // {
    //   title: 'Hunt',
    //   url: '#',
    //   icon: Search,
    //   items: [
    //     {
    //       title: 'TODO',
    //       url: '/kdm/hunt'
    //     }
    //   ]
    // },
    // {
    //   title: 'Showdown',
    //   url: '#',
    //   icon: Swords,
    //   items: [
    //     {
    //       title: 'TODO',
    //       url: '/kdm/showdown'
    //     }
    //   ]
    // }
  ]
}

const footer = [
  {
    name: 'ncalteen/kdm',
    url: 'https://github.com/ncalteen/kdm',
    icon: MarkGithubIcon as LucideIcon
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  asChild>
                  <Link href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <DockIcon className="h-4 w-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        KDM Tracker
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter projects={footer} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
