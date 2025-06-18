'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { type LucideIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Navigation Footer Component
 *
 * @param props Navigation Footer Properties
 * @returns Navigation Footer Component
 */
export function NavFooter({
  projects
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}): ReactElement {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>GitHub</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
