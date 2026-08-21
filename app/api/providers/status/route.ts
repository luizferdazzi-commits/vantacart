import {NextResponse} from 'next/server';
import {getProviderStatuses} from '../../../../lib/providers';
export const dynamic='force-dynamic';
export async function GET(){return NextResponse.json({providers:await getProviderStatuses()});}
