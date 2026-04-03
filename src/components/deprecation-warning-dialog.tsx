'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ExternalLink, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { ReactElement } from 'react'

/**
 * Deprecation Warning Dialog Properties
 */
interface DeprecationWarningDialogProps {
  /** Whether the Dialog is Open */
  open: boolean
  /** Callback when the User Acknowledges the Warning */
  onAcknowledge: () => void
}

/**
 * Deprecation Warning Dialog Component
 *
 * Warns users that this application will be deprecated on April 30, 2026,
 * and directs them to Archivist as the migration destination.
 *
 * @param props Component Properties
 * @returns Deprecation Warning Dialog Component
 */
export function DeprecationWarningDialog({
  open,
  onAcknowledge
}: DeprecationWarningDialogProps): ReactElement {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <TriangleAlert className="h-5 w-5 text-amber-500" />
            Application Deprecation Notice
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                This companion is slated for deprecation on{' '}
                <strong>April 30, 2026</strong>.
              </p>
              <p>
                After that date, this application will no longer be available.
              </p>
              <p>
                Please plan your migration to{' '}
                <Link
                  href="https://archivist.monster"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2">
                  archivist.monster
                </Link>
                .
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button asChild variant="outline">
            <Link
              href="https://archivist.monster"
              target="_blank"
              rel="noopener noreferrer">
              Visit Archivist
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <AlertDialogAction onClick={onAcknowledge}>
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
