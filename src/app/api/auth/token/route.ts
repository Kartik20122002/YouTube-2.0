import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'

 
export async function GET(req : any) {
  
  const token = await getToken({req , secret });

  const accessToken = token?.accessToken;
 
  return NextResponse.json({ token })
}