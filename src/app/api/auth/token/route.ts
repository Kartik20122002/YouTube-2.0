import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { cookies } from "next/headers";

 
export async function GET(req : any) {
  
      const cookieHand = cookies();
      const access_token =  cookieHand.get('access');
      const refresh_token = cookieHand.get('refresh');
 
  return NextResponse.json({ access_token , refresh_token })
}