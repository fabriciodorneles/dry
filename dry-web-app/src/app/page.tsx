import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/focus-tracker')
  return null
}
