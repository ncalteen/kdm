'use client'

import { CoreMilestones } from '@/lib/campaigns/common'
import { CampaignData } from '@/lib/types'

/**
 * Custom Campaign Data
 */
export const CustomCampaignData: CampaignData = {
  ccRewards: [],
  innovations: [],
  locations: [],
  milestones: CoreMilestones,
  nemeses: [],
  principles: [],
  quarries: [],
  timeline: Array(40).fill({
    completed: false,
    entries: []
  })
}
