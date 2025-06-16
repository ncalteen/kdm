'use client'

import { Collapsible } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useTab } from '@/contexts/tab-context'
import { LucideIcon } from 'lucide-react'

export function NavMain({
  items
}: {
  items: {
    title: string
    tab: string
    icon?: LucideIcon
  }[]
}) {
  const { selectedTab, setSelectedTab } = useTab()

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
