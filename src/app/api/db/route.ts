import { NextResponse } from 'next/server';

const DB_ID = 'ff808181a09d98f701a0fbe737e15fce';
const DB_URL = `https://api.restful-api.dev/objects/${DB_ID}`;

// To bypass aggressive Vercel/Next.js caching on this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch(DB_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch database");
    const json = await res.json();
    return NextResponse.json(json.data || { bookings: [], availability: {} });
  } catch (error) {
    return NextResponse.json({ bookings: [], availability: {} });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate data structure loosely
    if (!data.bookings || !data.availability) {
      return NextResponse.json({ error: "Invalid data structure" }, { status: 400 });
    }

    const res = await fetch(DB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'purrfect_db_production', 
        data: {
          bookings: data.bookings,
          availability: data.availability
        }
      })
    });
    
    if (!res.ok) throw new Error("Failed to update database");
    const json = await res.json();
    return NextResponse.json({ success: true, data: json.data });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
