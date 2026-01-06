import prisma, { withDbTracking } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type MetricLabels = Record<string, string>;

interface CounterMetric {
  inc: (labels?: MetricLabels) => void;
}

interface HistogramMetric {
  observe: (labels: MetricLabels, value: number) => void;
}

type MetricsBundle = {
  httpRequestsTotal: CounterMetric;
  httpRequestDuration: HistogramMetric;
  wishlistAdditionsTotal: CounterMetric;
  wishlistRemovalsTotal: CounterMetric;
  databaseQueryDuration: HistogramMetric;
};

const noopCounter: CounterMetric = { inc: () => undefined };
const noopHistogram: HistogramMetric = { observe: () => undefined };

const {
  httpRequestsTotal,
  httpRequestDuration,
  wishlistAdditionsTotal,
  wishlistRemovalsTotal,
  databaseQueryDuration,
} = resolveMetrics();

function resolveMetrics(): MetricsBundle {
  const globalObject = globalThis as typeof globalThis & {
    __appMetrics?: Partial<MetricsBundle>;
  };

  if (globalObject.__appMetrics) {
    return {
      httpRequestsTotal: globalObject.__appMetrics.httpRequestsTotal ?? noopCounter,
      httpRequestDuration: globalObject.__appMetrics.httpRequestDuration ?? noopHistogram,
      wishlistAdditionsTotal: globalObject.__appMetrics.wishlistAdditionsTotal ?? noopCounter,
      wishlistRemovalsTotal: globalObject.__appMetrics.wishlistRemovalsTotal ?? noopCounter,
      databaseQueryDuration: globalObject.__appMetrics.databaseQueryDuration ?? noopHistogram,
    };
  }

  const fallback: MetricsBundle = {
    httpRequestsTotal: noopCounter,
    httpRequestDuration: noopHistogram,
    wishlistAdditionsTotal: noopCounter,
    wishlistRemovalsTotal: noopCounter,
    databaseQueryDuration: noopHistogram,
  };

  globalObject.__appMetrics = fallback;

  return fallback;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const route = "/api/game";
  
  try {
    const { action, game, user } = await req.json();

    if (action == "add") {
      const dbStart = Date.now();
      await withDbTracking("create", "wishlist", () =>
        prisma.wishlist.create({
          data: {
            user_id: user.user.id,
            game_id: game.game_id,
          },
        })
      );
      databaseQueryDuration.observe(
        { operation: "create", table: "wishlist" },
        (Date.now() - dbStart) / 1000
      );
      wishlistAdditionsTotal.inc({ game_id: String(game.game_id) });
    } else if (action == "remove") {
      const dbStart = Date.now();
      await withDbTracking("delete", "wishlist", () =>
        prisma.wishlist.deleteMany({
          where: {
            user_id: user.user.id,
            game_id: game.game_id,
          },
        })
      );
      databaseQueryDuration.observe(
        { operation: "delete", table: "wishlist" },
        (Date.now() - dbStart) / 1000
      );
      wishlistRemovalsTotal.inc({ game_id: String(game.game_id) });
    }

    httpRequestsTotal.inc({ method: "POST", route, status_code: "200" });
    httpRequestDuration.observe(
      { method: "POST", route, status_code: "200" },
      (Date.now() - startTime) / 1000
    );
    return NextResponse.json({ data: { game_id: game.game_id, user_id: user.user.id } });
  } catch (error) {
    httpRequestsTotal.inc({ method: "POST", route, status_code: "500" });
    httpRequestDuration.observe(
      { method: "POST", route, status_code: "500" },
      (Date.now() - startTime) / 1000
    );
    return NextResponse.json({ message: error });
  }
}
