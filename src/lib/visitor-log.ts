// In-memory visitor log store (capped at 1000 entries)
// Logs are also written to console for Vercel's log dashboard.
const MAX_LOG_SIZE = 1000;
const visitorLogs: VisitorLog[] = [];

export interface VisitorLog {
  id: string;
  time: string;
  ip: string;
  region: string;
  city: string;
  country: string;
  device: "mobile" | "tablet" | "desktop" | "unknown";
  os: string;
  browser: string;
  ua: string;
}

// --- Device / UA parsing (no external deps) ---

function parseDevice(ua: string): VisitorLog["device"] {
  if (/Mobi|Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return "mobile";
  }
  if (/iPad|Android(?!.*Mobile)|Silk|Kindle|PlayBook/i.test(ua)) {
    return "tablet";
  }
  if (/Windows|Macintosh|Linux|X11|CrOS/i.test(ua)) {
    return "desktop";
  }
  return "unknown";
}

function parseOS(ua: string): string {
  if (/Windows NT 10/.test(ua)) return "Windows 10/11";
  if (/Windows NT/.test(ua)) return "Windows";
  if (/Mac OS X/.test(ua)) {
    const m = ua.match(/Mac OS X (\d+[._]\d+)/);
    return m ? `macOS ${m[1].replace("_", ".")}` : "macOS";
  }
  if (/iPhone OS|iPad.*OS/.test(ua)) {
    const m = ua.match(/(?:iPhone OS|CPU OS) (\d+[._]\d+)/);
    return m ? `iOS ${m[1].replace("_", ".")}` : "iOS";
  }
  if (/Android/.test(ua)) {
    const m = ua.match(/Android (\d+\.?\d*)/);
    return m ? `Android ${m[1]}` : "Android";
  }
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
}

function parseBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR|Opera/.test(ua)) return "Opera";
  if (/Firefox/.test(ua)) return "Firefox";
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) return "Chrome";
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return "Safari";
  return "Unknown";
}

// --- IP geolocation (free ip-api.com, 45 req/min) ---

interface GeoInfo {
  country: string;
  region: string;
  city: string;
}

async function lookupIP(ip: string): Promise<GeoInfo> {
  // Skip private / local IPs
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return { country: "Local", region: "Local", city: "Local" };
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`, {
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    if (data.status === "success") {
      return { country: data.country || "", region: data.regionName || "", city: data.city || "" };
    }
  } catch {
    // geo lookup failed – best effort
  }
  return { country: "Unknown", region: "Unknown", city: "Unknown" };
}

// --- Public API ---

export function getVisitorLogs(): VisitorLog[] {
  return visitorLogs;
}

export async function recordVisit(ip: string, ua: string): Promise<VisitorLog> {
  const geo = await lookupIP(ip);

  const entry: VisitorLog = {
    id: crypto.randomUUID().slice(0, 8),
    time: new Date().toISOString(),
    ip,
    region: geo.region,
    city: geo.city,
    country: geo.country,
    device: parseDevice(ua),
    os: parseOS(ua),
    browser: parseBrowser(ua),
    ua,
  };

  visitorLogs.push(entry);
  if (visitorLogs.length > MAX_LOG_SIZE) {
    visitorLogs.shift();
  }

  // Also log to console for Vercel dashboard
  console.log(
    `[visit] ${entry.time} | ${entry.ip} | ${entry.city}, ${entry.region}, ${entry.country} | ${entry.device} | ${entry.os} | ${entry.browser}`
  );

  return entry;
}
