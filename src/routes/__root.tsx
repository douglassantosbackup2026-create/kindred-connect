import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { PlayerProvider } from "@/lib/player-store";
import { META_PIXEL_ID, captureFbclid, hydrateMetaIdentity, trackMetaDedup } from "@/lib/meta-pixel";
import { supabase } from "@/integrations/supabase/client";
import { captureUtmFromLocation } from "@/lib/utm";
import { OG_IMAGE } from "@/lib/site";
import { Toaster } from "@/components/ui/sonner";
import { OfflineBanner } from "@/components/OfflineBanner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou mudou de endereço.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado do nosso lado. Tente atualizar ou volte para o início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar de novo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: "Jogador PRO System" },
      { name: "description", content: "Plano guiado de treinos para evoluir no futebol." },
      { name: "author", content: "Jogador PRO System" },
      { property: "og:title", content: "Jogador PRO System" },
      { property: "og:description", content: "Plano guiado de treinos para evoluir no futebol." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function MetaPixelPageView() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({
    select: (s) => {
      const loc = s.location as { searchStr?: string };
      return loc.searchStr ?? "";
    },
  });
  const ultimoPath = useRef<string | null>(null);

  useLayoutEffect(() => {
    captureUtmFromLocation();
    captureFbclid();
  }, [pathname, searchStr]);

  useEffect(() => {
    void hydrateMetaIdentity();
    const { data } = supabase.auth.onAuthStateChange(() => {
      void hydrateMetaIdentity();
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // fbclid precisa estar no cookie/localStorage ANTES do PageView (mesmo tick).
    captureFbclid();
    // O script inline não dispara PageView — este é o único disparo (sem duplicar).
    if (ultimoPath.current === pathname) return;
    ultimoPath.current = pathname;
    trackMetaDedup("PageView", { content_name: pathname });
  }, [pathname]);

  return null;
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
(function(){
try{
var q=new URLSearchParams(location.search).get('fbclid');
if(q){var v='fb.1.'+Date.now()+'.'+q;localStorage.setItem('jps:fbc',v);
document.cookie='_fbc='+v+'; path=/; max-age=7776000; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');}
var id=localStorage.getItem('jps:meta-eid');
if(!id){id=(crypto&&crypto.randomUUID)?crypto.randomUUID():'anon-'+Date.now().toString(36)+Math.random().toString(36).slice(2);
localStorage.setItem('jps:meta-eid',id);}
var em=localStorage.getItem('jps:meta-em')||'';
var nm=(localStorage.getItem('jps:meta-nm')||'').trim();
var norm=function(s){return s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z]/g,'');};
var parts=nm?nm.split(/\\s+/):[];
var fn=parts.length?norm(parts[0]):'';
var ln=parts.length>1?norm(parts.slice(1).join(' ')):'';
var am={external_id:id,country:'br'};
if(em)am.em=em;
if(fn)am.fn=fn;
if(ln)am.ln=ln;
window.__jpsMetaMatch=em+'||'+fn+'|'+ln+'|'+id;
fbq('init','${META_PIXEL_ID}',am);
}catch(e){fbq('init','${META_PIXEL_ID}');}
})();
            `.trim(),
          }}
        />
      </head>
      <body>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        <MetaPixelPageView />
        <OfflineBanner />
        <Toaster />
        <Outlet />
      </PlayerProvider>
    </QueryClientProvider>
  );
}
