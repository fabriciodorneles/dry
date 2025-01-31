'use client'

import { ZoomableChart } from '@/components/mainChart/Chart'
import { Button } from '@/components/ui/button'
import { UserNav } from '@/components/user-nav'
import { DataPoint } from '@/types'
import { parseCSV } from '@/utils/importCSV'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      loadWeights()
    }
  }, [status, router])

  const loadWeights = async () => {
    try {
      const response = await fetch('/api/weights')
      if (response.ok) {
        const weights = await response.json()
        setData(
          weights.map((w: DataPoint) => ({
            date: w.date,
            weight: w.weight,
          })),
        )
      }
    } catch (error) {
      console.error('Error loading weights:', error)
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        setIsLoading(true)
        const parsedData = await parseCSV(file)

        const response = await fetch('/api/weights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(parsedData),
        })

        if (response.ok) {
          await loadWeights()
        } else {
          console.error('Error saving weights:', await response.text())
        }
      } catch (error) {
        console.error('Error processing file:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <main className="flex flex-col items-center justify-start sm:justify-start md:justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="flex justify-center w-full">
        <div className="flex flex-col items-start gap-6 w-60 shrink-0 pr-4 pt-2">
          <UserNav />
          <div className="w-full flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImport(!showImport)}
              className="w-full"
            >
              {showImport ? 'Hide Import' : 'Import Data'}
            </Button>
            {showImport && (
              <label className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
                <span className="flex items-center">Choose File</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center max-w-[1500px] w-full">
          <div className="flex flex-col lg:flex-row items-center w-full">
            <div className="w-full lg:w-full h-[500px] sm:h-[400px] md:h-[700px] hidden lg:block">
              <ZoomableChart data={data} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
