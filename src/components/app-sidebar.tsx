'use client'

import { NavFooter } from '@/components/nav-footer'
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
  MapPinHouseIcon,
  PersonStandingIcon
} from 'lucide-react'
import Link from 'next/link'
import { ComponentProps } from 'react'

const data = {
  navMain: [
    {
      title: 'Settlement',
      url: '#',
      icon: MapPinHouseIcon,
      isActive: true,
      items: [
        {
          title: 'List',
          url: '/settlement/list'
        },
        {
          title: 'Create',
          url: '/settlement/create'
        }
      ]
    },
    {
      title: 'Survivors',
      url: '#',
      icon: PersonStandingIcon,
      items: [
        {
          title: 'List',
          url: '/survivor/list'
        },
        {
          title: 'Create',
          url: '/survivor/create'
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

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="sidebar-10">
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
