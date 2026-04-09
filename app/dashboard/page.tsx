/**
 * Content Performance Dashboard — server component.
 * Fetches analytics from /api/analytics (Plausible-backed or stub).
 * Accessible at /dashboard — intended for internal use.
 */

export const dynamic = "force-dynamic";

import type { AnalyticsData } from "@/app/api/analytics/route";

async function getAnalytics(): Promise<AnalyticsData> {
  // Call Plausible directly from the server — avoids self-fetch issues on Vercel
  const apiKey = process.env.PLAUSIBLE_API_KEY;
  const siteId = process.env.PLAUSIBLE_SITE_ID;

  if (!apiKey || !siteId) {
    return {
      period: "30d",
      totals: { visitors: 0, pageviews: 0, bounceRate: 0, visitDuration: 0 },
      timeSeries: [],
      topPages: [],
      source: "stub",
    };
  }

  try {
    const encoded = encodeURIComponent(siteId);
    const headers = { Authorization: `Bearer ${apiKey}` };
    const opts = { headers, next: { revalidate: 300 } } as const;

    const [aggregate, pages, timeSeries] = await Promise.all([
      fetch(`https://plausible.io/api/v2/stats/aggregate?site_id=${encoded}&period=30d&metrics=visitors,pageviews,bounce_rate,visit_duration`, opts).then(r => r.json()),
      fetch(`https://plausible.io/api/v2/stats/breakdown?site_id=${encoded}&period=30d&property=event:page&metrics=visitors,pageviews&limit=10`, opts).then(r => r.json()),
      fetch(`https://plausible.io/api/v2/stats/timeseries?site_id=${encoded}&period=30d&metrics=visitors,pageviews`, opts).then(r => r.json()),
    ]);

    return {
      period: "30d",
      totals: {
        visitors: aggregate.results?.visitors?.value ?? 0,
        pageviews: aggregate.results?.pageviews?.value ?? 0,
        bounceRate: aggregate.results?.bounce_rate?.value ?? 0,
        visitDuration: aggregate.results?.visit_duration?.value ?? 0,
      },
      timeSeries: (timeSeries.results ?? []).map((r: { date: string; visitors: number; pageviews: number }) => ({
        date: r.date, visitors: r.visitors, pageviews: r.pageviews,
      })),
      topPages: (pages.results ?? []).map((r: { page: string; visitors: number; pageviews: number }) => ({
        page: r.page, visitors: r.visitors, pageviews: r.pageviews,
      })),
      source: "plausible",
    };
  } catch {
    return {
      period: "30d",
      totals: { visitors: 0, pageviews: 0, bounceRate: 0, visitDuration: 0 },
      timeSeries: [],
      topPages: [],
      source: "stub",
    };
  }
}

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | string;
  unit?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-cacao-100">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-cacao-900">
        {typeof value === "number" ? value.toLocaleString() : value}
        {unit && <span className="text-lg font-normal text-gray-500 ml-1">{unit}</span>}
      </p>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default async function DashboardPage() {
  const data = await getAnalytics();

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cacao-900">Content Performance</h1>
          <p className="text-gray-500 mt-1">Last 30 days · {data.source === "stub" ? "⚠ Plausible not configured" : "Powered by Plausible"}</p>
        </div>
        {data.source === "stub" && (
          <div className="text-xs bg-cacao-100 text-cacao-800 px-4 py-2 rounded-full">
            Add <code>PLAUSIBLE_API_KEY</code> + <code>PLAUSIBLE_SITE_ID</code> to enable live data
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Unique Visitors" value={data.totals.visitors} />
        <StatCard label="Pageviews" value={data.totals.pageviews} />
        <StatCard label="Bounce Rate" value={data.totals.bounceRate} unit="%" />
        <StatCard label="Avg. Visit Duration" value={formatDuration(data.totals.visitDuration)} />
      </div>

      {/* Top pages */}
      <div className="bg-white rounded-2xl shadow-sm border border-cacao-100 overflow-hidden mb-10">
        <div className="px-6 py-4 border-b border-cacao-50">
          <h2 className="font-semibold text-cacao-900">Top Pages</h2>
        </div>
        {data.topPages.length === 0 ? (
          <p className="px-6 py-8 text-gray-400 text-sm text-center">
            No page data yet — connect Plausible to see which content resonates.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-cacao-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Page</th>
                <th className="px-6 py-3 text-right">Visitors</th>
                <th className="px-6 py-3 text-right">Pageviews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cacao-50">
              {data.topPages.map((p) => (
                <tr key={p.page} className="hover:bg-cacao-50/40 transition-colors">
                  <td className="px-6 py-3 font-mono text-gray-700">{p.page}</td>
                  <td className="px-6 py-3 text-right text-gray-900">{p.visitors.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right text-gray-500">{p.pageviews.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Setup instructions (shown when stub) */}
      {data.source === "stub" && (
        <div className="bg-cacao-50 border border-cacao-200 rounded-2xl p-6 text-sm text-gray-700">
          <h3 className="font-semibold text-cacao-900 mb-3">Setup Checklist</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Create a free account at{" "}
              <span className="font-mono text-cacao-800">plausible.io</span> and add your site domain.
            </li>
            <li>
              In Plausible, go to <strong>Settings → API Keys</strong> and generate a key with <em>Stats API</em> access.
            </li>
            <li>
              Add to your <code>.env.local</code> (or Vercel env vars):
              <pre className="mt-2 bg-white rounded p-3 text-xs overflow-x-auto border border-cacao-100">
{`NEXT_PUBLIC_PLAUSIBLE_DOMAIN=autourducacao.com
PLAUSIBLE_API_KEY=your-api-key-here
PLAUSIBLE_SITE_ID=autourducacao.com
NEXT_PUBLIC_SITE_URL=https://autourducacao.com`}
              </pre>
            </li>
            <li>Redeploy — this dashboard will show live data automatically.</li>
          </ol>
        </div>
      )}

      {/* Social media metrics stub */}
      <div className="mt-10">
        <h2 className="font-semibold text-cacao-900 mb-4">Social Media Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { platform: "Spotify", handle: "Autour du Cacao", status: "Connect via Spotify for Podcasters API" },
            { platform: "YouTube", handle: "@AutourduCacao", status: "Connect via YouTube Data API v3" },
            { platform: "LinkedIn", handle: "Willy Gabriel Mboukem II", status: "Connect via LinkedIn Marketing API" },
          ].map((s) => (
            <div
              key={s.platform}
              className="bg-white rounded-2xl p-5 shadow-sm border border-cacao-100 flex flex-col gap-2"
            >
              <p className="font-semibold text-cacao-900">{s.platform}</p>
              <p className="text-xs text-gray-500">{s.handle}</p>
              <div className="mt-auto text-xs bg-gray-100 text-gray-500 rounded-full px-3 py-1 text-center">
                {s.status}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Social integrations will be wired up once accounts are active. Aggregated metrics (followers, impressions, engagement rate) will appear here.
        </p>
      </div>
    </div>
  );
}
