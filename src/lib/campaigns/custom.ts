'use client'

import { CoreMilestones } from '@/lib/campaigns/common'
import { CampaignTemplate } from '@/lib/types'

/**
 * Custom Campaign Template
 */
export const CustomCampaign: CampaignTemplate = {
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
  }),
  wanderers: []
}
