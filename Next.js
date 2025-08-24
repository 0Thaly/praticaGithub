Projeto: Destack Store — Next.js 14 (App Router)

Instruções: copie os arquivos para um repositório e rode conforme o README abaixo.

=============================================

file: package.json

=============================================

{ "name": "destack-store", "private": true, "version": "1.0.0", "scripts": { "dev": "next dev", "build": "next build", "start": "next start", "lint": "next lint" }, "dependencies": { "next": "14.2.5", "react": "18.3.1", "react-dom": "18.3.1", "lucide-react": "^0.453.0", "framer-motion": "^11.3.28", "zod": "^3.23.8", "mercadopago": "^2.2.12" }, "devDependencies": { "autoprefixer": "^10.4.20", "postcss": "^8.4.41", "tailwindcss": "^3.4.10", "typescript": "^5.5.4", "eslint": "^9.9.0", "eslint-config-next": "14.2.5" } }

=============================================

file: next.config.mjs

=============================================

/** @type {import('next').NextConfig} */ const nextConfig = { experimental: { serverActions: { bodySizeLimit: '2mb' } }, }; export default nextConfig;

=============================================

file: postcss.config.js

=============================================

module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };

=============================================

file: tailwind.config.ts

=============================================

import type { Config } from 'tailwindcss'; const config: Config = { content: ["./app//*.{ts,tsx}", "./components//.{ts,tsx}", "./lib/**/.{ts,tsx}"], theme: { extend: {} }, plugins: [], }; export default config;

=============================================

file: app/globals.css

=============================================

@tailwind base; @tailwind components; @tailwind utilities;

:root { color-scheme: light; }

=============================================

file: .env.example

=============================================

Copie para .env.local e preencha

Token de acesso do Mercado Pago (Conta Produtor / Vendedor)

MP_ACCESS_TOKEN="APP_USR-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

URL pública do site (para webhooks), ex: https://destack.vercel.app

PUBLIC_URL="http://localhost:3000"

=============================================

file: app/layout.tsx

=============================================

import './globals.css'; import React from 'react'; import Link from 'next/link';

export const metadata = { title: 'Destack Gráfica — Loja', description: 'Catálogo, carrinho, checkout, Pix, Mercado Pago e status do pedido.' };

export default function RootLayout({ children }: { children: React.ReactNode }) { return ( <html lang="pt-br"> <body className="min-h-screen bg-white text-gray-900"> <header className="border-b"> <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between"> <Link href="/" className="flex items-center gap-3"> <div className="w-10 h-10 rounded-2xl bg-black text-white grid place-content-center font-bold">DG</div> <div> <div className="text-lg font-semibold">Destack Gráfica</div> <div className="text-xs text-gray-600">Uma boa impressão merece DESTACK</div> </div> </Link> <nav className="flex items-center gap-3 text-sm"> <Link href="/" className="px-3 py-2 rounded-xl hover:bg-gray-100">Catálogo</Link> <Link href="/cart" className="px-3 py-2 rounded-xl hover:bg-gray-100">Carrinho</Link> <Link href="/checkout" className="px-3 py-2 rounded-xl hover:bg-gray-100">Checkout</Link> <Link href="/status/demo" className="px-3 py-2 rounded-xl hover:bg-gray-100">Status</Link> </nav> </div> </header> <main className="mx-auto max-w-7xl px-4 py-8">{children}</main> <footer className="border-t"> <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-600 flex items-center justify-between"> <div>© {new Date().getFullYear()} Destack Gráfica</div> <div className="flex gap-4"> <a href="https://wa.me/5588XXXXXXXXX" target="_blank" className="underline">WhatsApp</a> <a href="https://www.instagram.com/destackgrafica1/" target="_blank" className="underline">Instagram</a> </div> </div> </footer> </body> </html> ); }

=============================================

file: lib/products.ts

=============================================

export type Product = { id: string; name: string; description: string; price: number; // em centavos (BRL) image?: string; options?: { name: string; values: string[] }[]; // Ex.: Tamanho, Papel, Acabamento };

export const PRODUCTS: Product[] = [ { id: 'cartao-visita', name: 'Cartão de Visita 4x4 300g', description: 'Laminação fosca + opção de verniz localizado. Quantidades a partir de 500un.', price: 9900, options: [ { name: 'Quantidade', values: ['500un', '1000un', '2000un'] }, { name: 'Acabamento', values: ['Sem verniz', 'Verniz localizado', 'Canto arredondado'] }, ], }, { id: 'banner-80x120', name: 'Banner 80x120cm', description: 'Lona 440g com ilhós. Impressão de alta durabilidade para fachadas e eventos.', price: 7990, }, { id: 'panfleto-a5', name: 'Panfleto A5 90g', description: 'Couché 90g, cores vivas. Ideal para ações promocionais.', price: 12990, options: [ { name: 'Quantidade', values: ['1000un', '2000un', '5000un'] } ], }, ];

=============================================

file: lib/cart.tsx

=============================================

'use client'; import React, { createContext, useContext, useMemo, useState } from 'react'; import type { Product } from './products';

export type CartItem = { product: Product; qty: number; selected?: Record<string, string> };

type CartCtx = { items: CartItem[]; add: (p: Product, selected?: Record<string, string>) => void; remove: (id: string) => void; setQty: (id: string, qty: number) => void; clear: () => void; total: number; // em centavos };

const Ctx = createContext<CartCtx | null>(null); export function CartProvider({ children }: { children: React.ReactNode }) { const [items, setItems] = useState<CartItem[]>([]); const add: CartCtx['add'] = (p, selected) => { setItems((prev) => { const idx = prev.findIndex((it) => it.product.id === p.id && JSON.stringify(it.selected)===JSON.stringify(selected)); if (idx >= 0) { const copy = [...prev]; copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }; return copy; } return [...prev, { product: p, qty: 1, selected }]; }); }; const remove = (id: string) => setItems((prev) => prev.filter((it) => it.product.id !== id)); const setQty = (id: string, qty: number) => setItems((prev) => prev.map((it) => it.product.id === id ? { ...it, qty } : it)); const clear = () => setItems([]); const total = useMemo(() => items.reduce((acc, it) => acc + it.product.price * it.qty, 0), [items]);

return <Ctx.Provider value={{ items, add, remove, setQty, clear, total }}>{children}</Ctx.Provider>; } export const useCart = () => { const ctx = useContext(Ctx); if (!ctx) throw new Error('useCart must be used within CartProvider'); return ctx; };

=============================================

file: lib/shipping.ts

=============================================

export type ShippingQuote = { service: 'econômico' | 'expresso'; days: number; price: number };

export async function quoteShipping(cep: string, subtotal: number): Promise<ShippingQuote[]> { // Placeholder simples: regra por faixa de CEP e valor. const clean = cep.replace(/\D/g, ''); if (clean.length !== 8) return []; const base = subtotal > 20000 ? 0 : 1990; // frete grátis acima de R$200 return [ { service: 'econômico', days: 6, price: base }, { service: 'expresso', days: 3, price: base + 1500 }, ]; }

=============================================

file: lib/whats.ts

=============================================

export function buildWhatsMessage({ name, contact, items, total, cep, address }: { name: string; contact: string; items: { name: string; qty: number }[]; total: number; cep: string; address?: string; }) { const lines = [ Olá, sou ${name}. Quero um orçamento/pedido:, ...items.map((it) => • ${it.qty}x ${it.name}), Total estimado: R$ ${(total/100).toFixed(2)}, CEP: ${cep}, address ? Endereço: ${address} : undefined, Contato: ${contact}, ].filter(Boolean); return encodeURIComponent(lines.join('\n')); }

=============================================

file: app/page.tsx (Catálogo)

=============================================

'use client'; import React, { useState } from 'react'; import { PRODUCTS, type Product } from '@/lib/products'; import { useCart } from '@/lib/cart';

export default function CatalogPage() { const { add } = useCart(); const [sel, setSel] = useState<Record<string, string>>({});

return ( <div> <h1 className="text-2xl font-semibold">Catálogo</h1> <p className="text-gray-600">Escolha um produto e adicione ao carrinho.</p> <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6"> {PRODUCTS.map((p) => ( <div key={p.id} className="rounded-2xl border p-4"> <div className="aspect-video rounded-xl bg-gray-100 mb-3" /> <div className="font-semibold">{p.name}</div> <div className="text-sm text-gray-600">{p.description}</div> <div className="mt-2 text-lg font-bold">R$ {(p.price/100).toFixed(2)}</div> {p.options?.map((opt) => ( <div key={opt.name} className="mt-2 text-sm"> <div className="font-medium">{opt.name}</div> <div className="flex gap-2 mt-1 flex-wrap"> {opt.values.map((v) => ( <button key={v} onClick={() => setSel((prev) => ({ ...prev, [opt.name]: v }))} className={px-3 py-1 rounded-full border ${sel[opt.name]===v ? 'bg-black text-white' : ''}} >{v}</button> ))} </div> </div> ))} <button onClick={() => add(p, sel)} className="mt-4 w-full rounded-xl bg-black text-white py-2">Adicionar ao carrinho</button> </div> ))} </div> </div> ); }

=============================================

file: app/cart/page.tsx

=============================================

'use client'; import React from 'react'; import Link from 'next/link'; import { useCart } from '@/lib/cart';

export default function CartPage() { const { items, setQty, remove, total } = useCart(); return ( <div> <h1 className="text-2xl font-semibold">Seu carrinho</h1> {items.length === 0 ? ( <p className="mt-4">Seu carrinho está vazio. <Link className="underline" href="/">Ver produtos</Link></p> ) : ( <div className="mt-6 grid md:grid-cols-3 gap-6"> <div className="md:col-span-2 space-y-4"> {items.map((it) => ( <div key={it.product.id} className="rounded-xl border p-4 flex items-start gap-4"> <div className="w-24 h-24 rounded-lg bg-gray-100" /> <div className="flex-1"> <div className="font-medium">{it.product.name}</div> {it.selected && ( <div className="text-xs text-gray-600">{Object.entries(it.selected).map(([k,v]) => ${k}: ${v}).join(' • ')}</div> )} <div className="text-sm mt-1">R$ {(it.product.price/100).toFixed(2)}</div> <div className="mt-2 flex items-center gap-2"> <input type="number" min={1} value={it.qty} onChange={(e)=>setQty(it.product.id, Number(e.target.value))} className="w-20 border rounded-lg p-2" /> <button className="text-sm underline" onClick={()=>remove(it.product.id)}>Remover</button> </div> </div> </div> ))} </div> <div className="rounded-xl border p-4 h-fit"> <div className="font-semibold">Resumo</div> <div className="flex items-center justify-between mt-2 text-sm"> <span>Subtotal</span> <span>R$ {(total/100).toFixed(2)}</span> </div> <Link href="/checkout" className="mt-4 block text-center rounded-xl bg-black text-white py-2">Avançar para checkout</Link> </div> </div> )} </div> ); }

=============================================

file: app/checkout/page.tsx

=============================================

'use client'; import React, { useState } from 'react'; import { useCart } from '@/lib/cart'; import { quoteShipping } from '@/lib/shipping'; import { buildWhatsMessage } from '@/lib/whats';

export default function CheckoutPage() { const { items, total, clear } = useCart(); const [name, setName] = useState(''); const [contact, setContact] = useState(''); const [cep, setCep] = useState(''); const [address, setAddress] = useState(''); const [quotes, setQuotes] = useState<{label: string; price: number; days: number}[]>([]); const [selected, setSelected] = useState<number | null>(null); const [loading, setLoading] = useState(false); const [orderId, setOrderId] = useState<string | null>(null);

const subtotal = total;

async function handleQuote() { const q = await quoteShipping(cep, subtotal); setQuotes(q.map((x) => ({ label: ${x.service} (${x.days} dias), price: x.price, days: x.days }))); setSelected(0); }

async function startCheckoutMP() { setLoading(true); try { const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: items.map((it) => ({ id: it.product.id, title: it.product.name, quantity: it.qty, unit_price: it.product.price/100 })), shipping: selected!=null ? quotes[selected].price/100 : 0, buyer: { name, contact, cep, address }, }), }); const data = await res.json(); if (data.init_point) { setOrderId(data.orderId); window.location.href = data.init_point; // redireciona para o checkout do Mercado Pago } else { alert('Falha ao iniciar checkout'); } } finally { setLoading(false); } }

async function startPix() { setLoading(true); try { const res = await fetch('/api/pix', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: items.map((it) => ({ title: it.product.name, quantity: it.qty, unit_price: it.product.price/100 })), shipping: selected!=null ? quotes[selected].price/100 : 0, buyer: { name, contact, cep, address }, }), }); const data = await res.json(); if (data.qr_code_base64 && data.orderId) { setOrderId(data.orderId); const w = window.open('', '_blank'); if (w) w.document.write(<html><body><h3>Escaneie o QR Code Pix</h3><img src="data:image/png;base64,${data.qr_code_base64}"/><p>Copia e cola: ${data.qr_code}</p></body></html>); } else { alert('Falha ao gerar Pix'); } } finally { setLoading(false); } }

function sendToWhats() { const msg = buildWhatsMessage({ name, contact, cep, address, items: items.map((it) => ({ name: it.product.name, qty: it.qty })), total: subtotal + (selected!=null ? quotes[selected].price : 0), }); const phone = '5588XXXXXXXXX'; // <- coloque o número da Destack aqui window.open(https://wa.me/${phone}?text=${msg}, '_blank'); }

return ( <div> <h1 className="text-2xl font-semibold">Checkout</h1> <div className="grid md:grid-cols-3 gap-6 mt-6"> <div className="md:col-span-2 space-y-4"> <div className="rounded-xl border p-4"> <div className="font-semibold mb-2">Dados para entrega</div> <div className="grid sm:grid-cols-2 gap-3"> <input className="border rounded-lg p-2" placeholder="Nome" value={name} onChange={(e)=>setName(e.target.value)} /> <input className="border rounded-lg p-2" placeholder="WhatsApp ou e-mail" value={contact} onChange={(e)=>setContact(e.target.value)} /> <input className="border rounded-lg p-2" placeholder="CEP (somente números)" value={cep} onChange={(e)=>setCep(e.target.value)} /> <div className="flex gap-2"> <button onClick={handleQuote} className="border rounded-lg px-3">Calcular frete</button> </div> <input className="border rounded-lg p-2 sm:col-span-2" placeholder="Endereço completo" value={address} onChange={(e)=>setAddress(e.target.value)} /> </div> {quotes.length>0 && ( <div className="mt-3 space-y-2"> {quotes.map((q, i) => ( <label key={i} className="flex items-center gap-2"> <input type="radio" name="frete" checked={selected===i} onChange={()=>setSelected(i)} /> <span>{q.label} — R$ {(q.price/100).toFixed(2)}</span> </label> ))} </div> )} </div> </div> <div className="rounded-xl border p-4 h-fit"> <div className="font-semibold">Pagamento</div> <div className="text-sm text-gray-600">Subtotal: R$ {(subtotal/100).toFixed(2)}</div> <div className="text-sm text-gray-600">Frete: R$ {selected!=null ? (quotes[selected].price/100).toFixed(2) : '0.00'}</div> <div className="mt-2 text-lg font-bold">Total: R$ {((subtotal + (selected!=null ? quotes[selected].price : 0))/100).toFixed(2)}</div> <button disabled={loading} onClick={startCheckoutMP} className="mt-3 w-full rounded-xl bg-black text-white py-2">Pagar com Mercado Pago</button> <button disabled={loading} onClick={startPix} className="mt-2 w-full rounded-xl border py-2">Gerar Pix</button> <button onClick={sendToWhats} className="mt-2 w-full rounded-xl border py-2">Enviar pedido no WhatsApp</button> <a href={orderId ? /status/${orderId} : '#'} className="mt-2 block text-center underline">Ver status do pedido</a> <button onClick={clear} className="mt-3 text-xs underline">Limpar carrinho</button> </div> </div> </div> ); }

=============================================

file: app/status/[id]/page.tsx

=============================================

import React from 'react';

async function getStatus(id: string) { const res = await fetch(${process.env.PUBLIC_URL || 'http://localhost:3000'}/api/orders/${id}, { cache: 'no-store' }); if (!res.ok) return null; return res.json(); }

export default async function StatusPage({ params }: { params: { id: string } }) { const order = await getStatus(params.id); if (!order) return <div>Pedido não encontrado.</div>; return ( <div> <h1 className="text-2xl font-semibold">Status do Pedido</h1> <div className="mt-4 rounded-xl border p-4"> <div><b>ID:</b> {order.id}</div> <div><b>Status:</b> {order.status}</div> <div><b>Total:</b> R$ {order.total?.toFixed(2)}</div> <div className="text-sm text-gray-600 mt-2">Última atualização: {new Date(order.updatedAt).toLocaleString('pt-BR')}</div> </div> </div> ); }

=============================================

file: app/api/checkout/route.ts

=============================================

import { NextRequest, NextResponse } from 'next/server'; import mercadopago from 'mercadopago'; import { randomUUID } from 'crypto';

const ORDERS = new Map<string, any>(); // Substitua por um banco real (Supabase/Planetscale/Prisma)

export async function POST(req: NextRequest) { const body = await req.json(); const { items, shipping, buyer } = body;

mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN! });

const orderId = randomUUID(); const preference = { items: items.map((it: any) => ({ title: it.title, quantity: it.quantity, unit_price: Number(it.unit_price) })), back_urls: { success: ${process.env.PUBLIC_URL}/status/${orderId}, failure: ${process.env.PUBLIC_URL}/status/${orderId}, pending: ${process.env.PUBLIC_URL}/status/${orderId}, }, auto_return: 'approved' as const, shipments: shipping ? { cost: Number(shipping) } : undefined, notification_url: ${process.env.PUBLIC_URL}/api/webhooks/mercadopago, metadata: { orderId, buyer }, } as any;

const pref = await mercadopago.preferences.create(preference);

ORDERS.set(orderId, { id: orderId, status: 'created', total: items.reduce((a: number, it: any) => a + it.unit_price*it.quantity, 0) + (shipping||0), updatedAt: new Date().toISOString() });

return NextResponse.json({ init_point: pref.body.init_point, sandbox_init_point: pref.body.sandbox_init_point, orderId }); }

export const dynamic = 'force-dynamic'; export { ORDERS };

=============================================

file: app/api/pix/route.ts

=============================================

import { NextRequest, NextResponse } from 'next/server'; import mercadopago from 'mercadopago'; import { randomUUID } from 'crypto'; import { ORDERS } from '../checkout/route';

export async function POST(req: NextRequest) { const body = await req.json(); const { items, shipping, buyer } = body; mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN! });

const orderId = randomUUID(); const total = items.reduce((a: number, it: any) => a + it.unit_price*it.quantity, 0) + (shipping||0);

// Cria pagamento PIX direto const payment = await mercadopago.payment.create({ transaction_amount: Number(total), description: 'Pedido Destack', payment_method_id: 'pix', payer: { email: 'cliente@example.com' }, // opcionalmente passe email/identificador metadata: { orderId, buyer }, notification_url: ${process.env.PUBLIC_URL}/api/webhooks/mercadopago, } as any);

const { qr_code, qr_code_base64 } = payment.body.point_of_interaction.transaction_data;

ORDERS.set(orderId, { id: orderId, status: 'pending', total, updatedAt: new Date().toISOString() });

return NextResponse.json({ orderId, qr_code, qr_code_base64 }); }

export const dynamic = 'force-dynamic';

=============================================

file: app/api/webhooks/mercadopago/route.ts

=============================================

import { NextRequest, NextResponse } from 'next/server'; import mercadopago from 'mercadopago'; import { ORDERS } from '../../checkout/route';

export async function POST(req: NextRequest) { const data = await req.json(); const topic = data.type || data.topic; try { if (topic === 'payment' && data.data?.id) { mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN! }); const payment = await mercadopago.payment.findById(data.data.id); const orderId = payment.body.metadata?.orderId; if (orderId && ORDERS.has(orderId)) { const statusMap: Record<string, string> = { approved: 'pago', pending: 'pendente', in_process: 'em análise', rejected: 'recusado', refunded: 'reembolsado', cancelled: 'cancelado', }; const st = statusMap[payment.body.status] || payment.body.status; ORDERS.set(orderId, { ...ORDERS.get(orderId), status: st, updatedAt: new Date().toISOString() }); } } } catch (e) { /* ignore */ } return NextResponse.json({ ok: true }); }

export const dynamic = 'force-dynamic';

=============================================

file: app/api/orders/[id]/route.ts

=============================================

import { NextRequest, NextResponse } from 'next/server'; import { ORDERS } from '../../checkout/route';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) { const order = ORDERS.get(params.id); if (!order) return new NextResponse('Not found', { status: 404 }); return NextResponse.json(order); }

export const dynamic = 'force-dynamic';

=============================================

file: app/providers.tsx

=============================================

'use client'; import React from 'react'; import { CartProvider } from '@/lib/cart'; export default function Providers({ children }: { children: React.ReactNode }) { return <CartProvider>{children}</CartProvider>; }

=============================================

file: app/template.tsx

(injeta o provider em todas as páginas do App Router)

=============================================

import React from 'react'; import Providers from './providers'; export default function Template({ children }: { children: React.ReactNode }) { return <Providers>{children}</Providers>; }

=============================================

file: README.md

=============================================

Destack Store — Checkout + Pix + Mercado Pago + Frete + WhatsApp + Status

1) Instalação

npm i
cp .env.example .env.local
# edite MP_ACCESS_TOKEN e PUBLIC_URL
npm run dev

2) Variáveis de ambiente

MP_ACCESS_TOKEN: token de produção (ou sandbox) da conta Mercado Pago (vendedor).

PUBLIC_URL: URL pública (ex.: https://destack.vercel.app). Necessária para webhooks e páginas de status.


3) Fluxos disponíveis

Catálogo (/): produtos configurados em lib/products.ts.

Carrinho (/cart): editar quantidades, remover itens.

Checkout (/checkout):

Calcula frete (placeholder com regra de frete grátis > R$200). Substitua em lib/shipping.ts por integração Correios/Transportadora.

Mercado Pago Checkout: cria preference e redireciona para o checkout MP.

Pix: gera QR Code e copia e cola via API de payments.

WhatsApp: monta mensagem do pedido para contato direto com a loja.


Status do pedido (/status/:id): consulta status atualizado via webhook.


4) Webhook

A URL POST /api/webhooks/mercadopago recebe eventos e atualiza o status em memória. Cadastre o webhook na sua conta Mercado Pago apontando para PUBLIC_URL/api/webhooks/mercadopago.

> ⚠️ Em produção, troque o Map em memória por um banco (Supabase/PlanetScale/Prisma). O Map zera a cada deploy.



5) Correios/Transportadora (frete)

Troque a função quoteShipping em lib/shipping.ts por chamada real à sua transportadora. Como fallback, mantenha regra de frete grátis por valor.

6) WhatsApp

Edite o número em CheckoutPage (variável phone) para o WhatsApp da Destack.

7) Publicação

Vercel: importe o repositório. Adicione MP_ACCESS_TOKEN e PUBLIC_URL nas variáveis do projeto.


8) Testes em Sandbox

No painel do Mercado Pago, ative modo Sandbox e use credenciais de teste para simular pagamentos e webhooks.

9) Personalizações

Cores, tipografia e imagens no catálogo conforme identidade da Destack.

Campos extras no checkout (CNPJ/CPF, notas, arte anexa) podem ser adicionados no formulário.


