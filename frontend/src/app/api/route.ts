import { NextResponse } from "next/server";

export async function GET(request: Request, res: Response) {

  // TODO: fetch data from an external API
  return NextResponse.json({ message: 'hi mom' });
}
