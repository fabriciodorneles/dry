import Papa from 'papaparse'
import { parse, format } from 'date-fns'
import { CsvData, DataPoint } from '@/types'

export function parseCSV(file: File): Promise<DataPoint[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const parsedData = results.data
          .map((item: unknown) => {
            const csvItem = item as CsvData
            if (!csvItem.dateTime && !csvItem.weight) {
              return null
            }
            if (
              csvItem.dateTime &&
              csvItem.dateTime.match(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}$/)
            ) {
              const parsedDate = parse(
                csvItem.dateTime,
                'yyyy-MM-dd H:mm',
                new Date(),
              )
              const formattedDate = format(
                parsedDate,
                // eslint-disable-next-line prettier/prettier
                'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
              )
              return {
                date: formattedDate,
                weight: parseFloat(csvItem.weight),
              }
            } else {
              console.error('Invalid date format:', csvItem.dateTime)
              return null
            }
          })
          .filter(
            (csvItem: DataPoint | null): csvItem is DataPoint =>
              csvItem !== null,
          ) as DataPoint[]

        parsedData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )
        resolve(parsedData)
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}
