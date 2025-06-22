'use client'

import { Collapsible } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useSelectedTab } from '@/contexts/selected-tab-context'
import { LucideIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Main Navigation Component
 *
 * @param props Main Navigation Properties
 * @returns Main Navigation Component
 */
export function NavMain({
  items
}: {
  items: {
    title: string
    tab: string
    icon?: LucideIcon
  }[]
}): ReactElement {
  const { selectedTab, setSelectedTab } = useSelectedTab()

  return (
    <SidebarGroup>
      <SidebarMenu className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center">
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={selectedTab === item.tab}
            className="group/collapsible">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={item.title}
                aria-current={selectedTab === item.tab ? 'page' : undefined}
                onClick={() => setSelectedTab(item.tab)}
                className={
                  selectedTab === item.tab
                    ? 'bg-accent text-accent-foreground'
                    : ''
                }>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
