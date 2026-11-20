// Dominios de clientes en el proyecto de Vercel de Ceiba (API REST).
// VERCEL_TOKEN vive solo en Vercel. El proyecto y el equipo tienen valores por defecto
// porque no son secretos.
const API = 'https://api.vercel.com';
const PROJECT = () => process.env.VERCEL_PROJECT_ID || 'prj_qlWGqN4FI4uVCQ1W6jK1dDMJXcwH';
const TEAM = () => process.env.VERCEL_TEAM_ID || 'team_5vFTx5Pe06rTMFZNtuuq0lCH';
export const vercelReady = () => !!process.env.VERCEL_TOKEN;

async function call(method, path, body) {
  if (!vercelReady()) throw Object.assign(new Error('Falta VERCEL_TOKEN en Vercel.'), { user: true });
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${API}${path}${sep}teamId=${TEAM()}`, {
    method, headers: { authorization: `Bearer ${process.env.VERCEL_TOKEN}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(10000),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// Dominios de segundo nivel comunes (tunegocio.com.mx no es un subdominio).
const SLD = /\.(com|org|net|gob|edu|co|ac|nom)\.[a-z]{2}$/;
export function splitDomain(host) {
  const labels = host.split('.');
  const apexLen = SLD.test(host) ? 3 : 2;
  return { apex: labels.slice(-apexLen).join('.'), sub: labels.slice(0, -apexLen).join('.') };
}

async function addOne(name, redirect) {
  const r = await call('POST', `/v10/projects/${PROJECT()}/domains`, redirect ? { name, redirect } : { name });
  if (r.ok) return r.data;
  const code = r.data?.error?.code || '';
  if (/already_exists|domain_already_in_project/.test(code) || r.status === 409 && /this project/i.test(r.data?.error?.message || '')) {
    return (await call('GET', `/v9/projects/${PROJECT()}/domains/${name}`)).data;
  }
  throw Object.assign(new Error(`Vercel no aceptó ${name}: ${r.data?.error?.message || r.status}`), { user: true });
}

// Agrega el dominio (y www con redirección) y devuelve los registros DNS que debe poner el cliente.
export async function connectDomain(host) {
  const { sub } = splitDomain(host);
  const main = await addOne(host);
  if (!sub) await addOne(`www.${host}`, host).catch(() => null);
  return dnsRecords(host, main);
}

export async function dnsRecords(host, info) {
  const { sub } = splitDomain(host);
  const cfg = (await call('GET', `/v6/domains/${host}/config`)).data || {};
  const ip = cfg.recommendedIPv4?.find(x => x.rank === 1)?.value?.[0] || '76.76.21.21';
  const cname = String(cfg.recommendedCNAME?.find(x => x.rank === 1)?.value || 'cname.vercel-dns.com').replace(/\.$/, '');
  const records = sub
    ? [{ tipo: 'CNAME', nombre: sub, valor: cname }]
    : [{ tipo: 'A', nombre: '@', valor: ip }, { tipo: 'CNAME', nombre: 'www', valor: cname }];
  const project = info || (await call('GET', `/v9/projects/${PROJECT()}/domains/${host}`)).data || {};
  for (const v of project.verification || []) records.push({ tipo: v.type, nombre: v.domain, valor: v.value });
  return { records, verified: project.verified !== false, misconfigured: cfg.misconfigured !== false };
}

// ¿Ya apunta a Vercel y está verificado?
export async function domainReady(host) {
  const project = (await call('GET', `/v9/projects/${PROJECT()}/domains/${host}`)).data || {};
  if (project.verified === false) await call('POST', `/v9/projects/${PROJECT()}/domains/${host}/verify`).catch(() => null);
  const cfg = (await call('GET', `/v6/domains/${host}/config`)).data || {};
  return { ready: project.verified !== false && cfg.misconfigured === false, verified: project.verified !== false, misconfigured: cfg.misconfigured !== false };
}
