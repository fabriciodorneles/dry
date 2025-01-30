export async function POST(request: Request) {
  const body = await request.json()
  return Response.json(body, { status: 200 })
}

export async function GET() {
  return Response.json({ message: 'GET request handled successfully' })
}
