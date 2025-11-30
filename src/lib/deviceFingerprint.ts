// Generate a unique device fingerprint based on browser and device characteristics
export interface DeviceInfo {
  fingerprint: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: string;
  screenResolution: string;
  timezone: string;
}

function getBrowserInfo(): { browser: string; browserVersion: string } {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  let browserVersion = "Unknown";

  if (ua.indexOf("Firefox") > -1) {
    browser = "Firefox";
    const match = ua.match(/Firefox\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf("SamsungBrowser") > -1) {
    browser = "Samsung Internet";
    const match = ua.match(/SamsungBrowser\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
    browser = "Opera";
    const match = ua.match(/(?:Opera|OPR)\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf("Trident") > -1) {
    browser = "Internet Explorer";
    const match = ua.match(/rv:([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf("Edge") > -1) {
    browser = "Edge (Legacy)";
    const match = ua.match(/Edge\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf("Edg") > -1) {
    browser = "Edge";
    const match = ua.match(/Edg\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf("Chrome") > -1) {
    browser = "Chrome";
    const match = ua.match(/Chrome\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf("Safari") > -1) {
    browser = "Safari";
    const match = ua.match(/Version\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  }

  return { browser, browserVersion };
}

function getOSInfo(): { os: string; osVersion: string } {
  const ua = navigator.userAgent;
  let os = "Unknown";
  let osVersion = "Unknown";

  if (ua.indexOf("Win") > -1) {
    os = "Windows";
    if (ua.indexOf("Windows NT 10.0") > -1) osVersion = "10";
    else if (ua.indexOf("Windows NT 6.3") > -1) osVersion = "8.1";
    else if (ua.indexOf("Windows NT 6.2") > -1) osVersion = "8";
    else if (ua.indexOf("Windows NT 6.1") > -1) osVersion = "7";
  } else if (ua.indexOf("Mac") > -1) {
    os = "macOS";
    const match = ua.match(/Mac OS X ([0-9_]+)/);
    if (match) osVersion = match[1].replace(/_/g, ".");
  } else if (ua.indexOf("X11") > -1 || ua.indexOf("Linux") > -1) {
    os = "Linux";
  } else if (ua.indexOf("Android") > -1) {
    os = "Android";
    const match = ua.match(/Android ([0-9.]+)/);
    if (match) osVersion = match[1];
  } else if (ua.indexOf("iOS") > -1 || ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) {
    os = "iOS";
    const match = ua.match(/OS ([0-9_]+)/);
    if (match) osVersion = match[1].replace(/_/g, ".");
  }

  return { os, osVersion };
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

async function generateHash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function getDeviceFingerprint(): Promise<DeviceInfo> {
  const { browser, browserVersion } = getBrowserInfo();
  const { os, osVersion } = getOSInfo();
  const deviceType = getDeviceType();
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Create a unique fingerprint from various device characteristics
  const fingerprintData = [
    navigator.userAgent,
    navigator.language,
    screenResolution,
    window.screen.colorDepth,
    timezone,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    navigator.hardwareConcurrency || 0,
    (navigator as any).deviceMemory || 0,
  ].join('|');

  const fingerprint = await generateHash(fingerprintData);

  return {
    fingerprint,
    browser,
    browserVersion,
    os,
    osVersion,
    deviceType,
    screenResolution,
    timezone,
  };
}