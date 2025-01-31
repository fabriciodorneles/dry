import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import { DataPoint } from '@/types'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const weights = (await request.json()) as DataPoint[]

    const user = await prisma.user.findUnique({
      where: { userName: session.user.email },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Create all weights in a single transaction
    await prisma.weight.createMany({
      data: weights.map((w) => ({
        date: new Date(w.date),
        weight: w.weight,
        userId: user.id,
      })),
    })

    return new NextResponse('Weights added successfully', { status: 200 })
  } catch (error) {
    console.error('Error adding weights:', error)
    return new NextResponse('Error adding weights', { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { userName: session.user.email },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const weights = await prisma.weight.findMany({
      where: { userId: user.id },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(weights)
  } catch (error) {
    console.error('Error fetching weights:', error)
    return new NextResponse('Error fetching weights', { status: 500 })
  }
}
