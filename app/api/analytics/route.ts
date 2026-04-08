/**
 * Analytics API route — proxies Plausible Stats API v2.
 * Returns aggregated site stats + top pages for the dashboard.
 *
 * Env vars required (server-side):
 *   PLAUSIBLE_API_KEY   — Plausible API key (Settings → API Keys)
 *   PLAUSIBLE_SITE_ID   — site domain registered in Plausible (e.g. cacaorise.com)
 *
 * Returns a stub response when credentials are not configured so the
 * dashboard renders gracefully in dev / before Plausible is provisioned.
 */

const PLAUSIBLE_BASE = "https://plausible.io/api/v2";

interface PlausibleTimeSeries {
  date: string;
  visitors: number;
  pageviews: number;
}

interface PlausiblePage {
  page: string;
  visitors: number;
  pageviews: number;
}

export interface AnalyticsData {
  period: string;
  totals: {
    visitors: number;
    pageviews: number;
    bounceRate: number;
    visitDuration: number;
  };
  timeSeries: PlausibleTimeSeries[];
  topPages: PlausiblePage[];
  source: "plausible" | "stub";
}

function stubData(): AnalyticsData {
  return {
    period: "30d",
    totals: { visitors: 0, pageviews: 0, bounceRate: 0, visitDuration: 0 },
    timeSeries: [],
    topPages: [],
    source: "stub",
  };
}

async function plausibleFetch(path: string, apiKey: string) {
  const res = await fetch(`${PLAUSIBLE_BASE}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 300 }, // cache 5 min
  });
  if (!res.ok) throw new Error(`Plausible ${path} → ${res.status}`);
  return res.json();
}

export async function GET() {
  const apiKey = process.env.PLAUSIBLE_API_KEY;
  const siteId = process.env.PLAUSIBLE_SITE_ID;

  if (!apiKey || !siteId) {
    return Response.json(stubData());
  }

  try {
    const period = "30d";
    const encodedSite = encodeURIComponent(siteId);

    // Aggregate totals
    const aggregateUrl =
      `/stats/aggregate?site_id=${encodedSite}&period=${period}` +
      `&metrics=visitors,pageviews,bounce_rate,visit_duration`;

    // Top pages
    const pagesUrl =
      `/stats/breakdown?site_id=${encodedSite}&period=${period}` +
      `&property=event:page&metrics=visitors,pageviews&limit=10`;

    // Time series (daily)
    const timeSeriesUrl =
      `/stats/timeseries?site_id=${encodedSite}&period=${period}&metrics=visitors,pageviews`;

    const [aggregate, pages, timeSeries] = await Promise.all([
      plausibleFetch(aggregateUrl, apiKey),
      plausibleFetch(pagesUrl, apiKey),
      plausibleFetch(timeSeriesUrl, apiKey),
    ]);

    const data: AnalyticsData = {
      period,
      totals: {
        visitors: aggregate.results.visitors.value ?? 0,
        pageviews: aggregate.results.pageviews.value ?? 0,
        bounceRate: aggregate.results.bounce_rate.value ?? 0,
        visitDuration: aggregate.results.visit_duration.value ?? 0,
      },
      timeSeries: (timeSeries.results ?? []).map(
        (r: { date: string; visitors: number; pageviews: number }) => ({
          date: r.date,
          visitors: r.visitors,
          pageviews: r.pageviews,
        })
      ),
      topPages: (pages.results ?? []).map(
        (r: { page: string; visitors: number; pageviews: number }) => ({
          page: r.page,
          visitors: r.visitors,
          pageviews: r.pageviews,
        })
      ),
      source: "plausible",
    };

    return Response.json(data);
  } catch (err) {
    console.error("[analytics] Plausible fetch failed:", err);
    return Response.json(stubData());
  }
}
