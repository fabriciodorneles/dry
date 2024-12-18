'use client'

import { ZoomableChart } from '@/components/mainChart/Chart'
import { DataPoint } from '@/types'
import { parseCSV } from '@/utils/importCSV'
import { useState } from 'react'

export default function Home() {
  // const data = simulateData()
  // const data = simulateDataResult
  const [data, setData] = useState<DataPoint[]>([])

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const parsedData = await parseCSV(file)
        setData(parsedData)
      } catch (error) {
        console.error('Error parsing CSV:', error)
      }
    }
  }

  return (
    <main className="flex flex-col items-center justify-start sm:justify-start md:justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="flex justify-center w-full">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <div className="flex flex-col items-center max-w-[1500px] w-full">
          <div className="flex flex-col lg:flex-row items-center w-full">
            <div className="w-full lg:w-full h-[500px] sm:h-[400px] md:h-[700px] hidden lg:block">
              <ZoomableChart data={data} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
