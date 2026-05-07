import { NextResponse } from "next/server";

const EXCHANGE_RATES_URL = "https://open.er-api.com/v6/latest/USD";

export async function GET() {
  try {
    const response = await fetch(EXCHANGE_RATES_URL, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(`Exchange API returned ${response.status}`);
    }
    const payload = (await response.json()) as {
      result?: string;
      rates?: Record<string, number>;
      time_last_update_utc?: string;
    };
    if (!payload.rates || payload.result === "error") {
      throw new Error("Exchange API response missing rates");
    }

    return NextResponse.json({
      base: "USD",
      lastUpdatedAt: payload.time_last_update_utc ?? new Date().toISOString(),
      rates: payload.rates,
    });
  } catch {
    return NextResponse.json(
      {
        base: "USD",
        lastUpdatedAt: new Date().toISOString(),
        rates: { USD: 1 },
      },
      { status: 200 }
    );
  }
}
