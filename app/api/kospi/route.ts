import { NextRequest, NextResponse } from "next/server";
import { getKospiData } from "@/lib/yahooFinance";
import type { RangeKey } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_RANGES: RangeKey[] = ["1D", "1M", "6M", "1Y", "5Y"];

export async function GET(request: NextRequest) {
  const rangeParam = request.nextUrl.searchParams.get("range") ?? "1M";
  const range = VALID_RANGES.includes(rangeParam as RangeKey)
    ? (rangeParam as RangeKey)
    : "1M";

  try {
    const data = await getKospiData(range);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to fetch KOSPI data: ${message}` },
      { status: 502 }
    );
  }
}
