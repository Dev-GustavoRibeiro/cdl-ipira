'use client';

import { useLayoutEffect } from 'react';
import Image from 'next/image';

/** Disparado na window quando a tela sai e o site abre. Quem chegar depois confere window.__cdlLd.pronto. */
export const SITE_PRONTO = 'cdl:site-pronto';

declare global {
  interface Window {
    /** Estado da tela de carregamento, criado pelo script inline (BOOT) antes da hidratação */
    __cdlLd?: { pronto: boolean; hidratou?: () => void };
  }
}

/** Roda `callback` quando o site abrir (logo em seguida, se já abriu ou se a tela não apareceu). Devolve o cancelamento. */
export function onSiteReady(callback: () => void) {
  if (!window.__cdlLd || window.__cdlLd.pronto) {
    const timer = setTimeout(callback, 0);
    return () => clearTimeout(timer);
  }
  window.addEventListener(SITE_PRONTO, callback, { once: true });
  return () => window.removeEventListener(SITE_PRONTO, callback);
}

/*
 * Script inline, logo depois do <body>: roda antes da hidratação e antes de qualquer seção pedir dados.
 * Liga html.ld-on (a tela só existe com essa classe: sem JavaScript ela nunca aparece) e mede o carregamento de verdade:
 * documento, fontes (fonts.ready), JavaScript da página (Resource Timing), hidratação (avisada pelo componente),
 * evento load, dados (fetch para /api/* do próprio site, com a rede quieta por 400 ms) e as imagens da primeira tela
 * carregadas e decodificadas (img.decode). Lazy fora da tela não conta, nem (depois da hidratação, porque antes o site
 * todo está com visibility: hidden) imagem escondida, como os slides do hero fora da vez, empilhados no mesmo lugar.
 * A barra anda até o alvo real, nunca volta, e só chega a 100% com tudo pronto; aos 12 s pula para 100% e abre na hora.
 * Qualquer erro aqui abre o site na hora.
 * Antes da hidratação o site fica invisível (visibility: nada de foco nem de leitor de tela por trás); depois ele é
 * pintado por baixo da tela, inert, para a saída revelar a página já desenhada. A rolagem fica travada (roda e teclas).
 * window.__cdlLd.marcos guarda os tempos de cada etapa (ms desde o início da navegação) e .p o percentual exibido,
 * para conferência.
 */
const BOOT = `(function(){
var w=window,d=document,h=d.documentElement;if(w.__cdlLd)return;
var S=w.__cdlLd={pronto:false,marcos:{}},M=S.marcos,LIMITE=12000,QUIETO=400;
var agora=function(){return performance.now()},marca=function(k){if(!M[k])M[k]=Math.round(agora())};
var fetchOriginal=w.fetch,abertas=0,iniciadas=0,concluidas=0,ultimaRede=0,hidratadoEm=0,marcados=[],fontes=!d.fonts;
var teclas={' ':1,PageUp:1,PageDown:1,Home:1,End:1,ArrowUp:1,ArrowDown:1,ArrowLeft:1,ArrowRight:1};
function semRolar(e){if(e.type==='wheel'||teclas[e.key])e.preventDefault()}
function rolagem(acao){w[acao+'EventListener']('wheel',semRolar,{passive:false});w[acao+'EventListener']('keydown',semRolar)}
function texto(id,t){var el=d.getElementById(id);if(el)el.textContent=t}
function liberar(){
  rolagem('remove');
  for(var el;el=marcados.pop();){el.inert=false;el.removeAttribute('aria-hidden')}
}
function fim(){
  if(S.pronto)return;marca('fim');S.pronto=true;liberar();
  h.classList.remove('ld-on','ld-saindo','ld-hidratado','ld-logo');
  if(w.fetch===rastreado)w.fetch=fetchOriginal;
  texto('ld-status','Site carregado');setTimeout(function(){texto('ld-status','')},3000);
  w.dispatchEvent(new Event('cdl:site-pronto'));
}
function sair(){
  marca('saida');liberar();h.classList.add('ld-saindo');
  setTimeout(fim,reduzido?0:560);
}
function rastreado(entrada){
  var p=fetchOriginal.apply(w,arguments);
  try{
    var u=new URL(typeof entrada==='string'?entrada:(entrada&&entrada.url)||String(entrada),location.href);
    if(!S.pronto&&u.origin===location.origin&&u.pathname.indexOf('/api/')===0){
      abertas++;iniciadas++;ultimaRede=agora();
      var feito=function(){abertas--;concluidas++;ultimaRede=agora()};p.then(feito,feito);
    }
  }catch(e){}
  return p;
}
try{
  h.classList.add('ld-on');rolagem('add');
  var reduzido=h.classList.contains('a11y-motion')||!!(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if(fetchOriginal)w.fetch=rastreado;
  d.addEventListener('DOMContentLoaded',function(){
    marca('dom');
    void d.body.offsetWidth;
    if(d.fonts)d.fonts.ready.then(function(){fontes=true;marca('fontes')});
  });
  // Também o que chega ao body depois (portais como o botão de acessibilidade): repassado a cada varredura
  var marcar=function(){
    for(var el=d.body.firstElementChild;el;el=el.nextElementSibling){
      if(el.tagName==='SCRIPT'||el.classList.contains('ld-raiz')||el.inert||el.hasAttribute('aria-hidden'))continue;
      el.inert=true;el.setAttribute('aria-hidden','true');marcados.push(el);
    }
  };
  S.hidratou=function(){
    if(hidratadoEm||M.saida)return;
    hidratadoEm=agora();marca('hidratacao');marcar();
    h.classList.add('ld-hidratado');
  };
  setTimeout(function(){if(!S.pronto)texto('ld-status','Carregando o site')},500);
  var decodando=new WeakMap(),decodada=new WeakMap(),imgFrac=0,imgTodas=false,varredura=0;
  var varrer=function(){
    var lista=d.images,vh=innerHeight,vw=innerWidth,total=0,ok=0,css={visibilityProperty:true,checkVisibilityCSS:true};
    for(var i=0;i<lista.length;i++){
      var img=lista[i],r=img.getBoundingClientRect();
      if(!r.width||!r.height||r.bottom<=0||r.right<=0||r.top>=vh||r.left>=vw)continue;
      if(hidratadoEm&&(img.checkVisibility?!img.checkVisibility(css):getComputedStyle(img).visibility!=='visible'))continue;
      total++;if(!img.complete)continue;
      var src=img.currentSrc||img.src;
      if(!img.naturalWidth||decodada.get(img)===src){ok++;continue}
      if(decodando.get(img)!==src){
        decodando.set(img,src);
        (function(im,s){var pronta=function(){decodada.set(im,s)};im.decode?im.decode().then(pronta,pronta):pronta()})(img,src);
      }
    }
    imgFrac=total?ok/total:1;imgTodas=ok===total;
  };
  var fracJs=function(){
    var ss=d.querySelectorAll('script[src]'),ok=0;
    for(var i=0;i<ss.length;i++)if(performance.getEntriesByName(ss[i].src).length)ok++;
    return ss.length?ok/ss.length:1;
  };
  var mostrado=0,alvo=0,anterior=agora(),n=-1,jsFrac=0,barra,logo;
  var quadro=function(){
    try{
      var t=agora(),dt=Math.min(64,t-anterior);anterior=t;
      logo=logo||d.querySelector('.ld-cartao img');
      if(logo&&logo.complete||t>1500)h.classList.add('ld-logo');
      var docOk=d.readyState!=='loading',loadOk=d.readyState==='complete',hid=!!hidratadoEm;
      if(loadOk)marca('load');
      if(t-varredura>120){varredura=t;varrer();jsFrac=hid||loadOk?1:fracJs();if(hid){marcar();if(imgTodas)marca('imagens')}}
      var fontesOk=fontes&&(!d.fonts||d.fonts.status==='loaded');
      var quieto=hid&&abertas===0&&t-Math.max(ultimaRede,hidratadoEm)>=QUIETO;
      if(quieto)marca('dados');
      var real=5*docOk+10*fontesOk+25*jsFrac+15*hid+5*loadOk+20*(hid?(iniciadas?concluidas/iniciadas:+quieto):0)+20*imgFrac;
      var pronto=docOk&&loadOk&&fontesOk&&quieto&&imgTodas,estouro=!pronto&&t>=LIMITE;
      if(estouro)marca('limite');
      alvo=Math.max(alvo,pronto||estouro?100:Math.min(99,real));
      mostrado=estouro?100:Math.min(alvo,mostrado+Math.max((alvo-mostrado)*(1-Math.pow(pronto?0.75:0.9,dt/16.7)),dt*0.02));
      S.p=mostrado;
      if(barra||(barra=d.getElementById('ld-barra'))){
        barra.style.setProperty('--ld-p',(mostrado/100).toFixed(4));
        var v=Math.floor(mostrado);
        if(v!==n){n=v;barra.setAttribute('aria-valuenow',v);texto('ld-num',v+'%')}
      }
      if(mostrado>=100)return setTimeout(sair,reduzido||estouro?0:120);
      requestAnimationFrame(quadro);
    }catch(e){fim()}
  };
  requestAnimationFrame(quadro);
}catch(e){fim()}
})()`;

/**
 * Tela de carregamento: aparece em todo carregamento completo de página do site (abrir, recarregar, nova aba) e só
 * sai com a página 100% pronta (ver BOOT). Navegações internas do Next não passam por ela.
 * Fica antes do link "Pular para o conteúdo": nada aqui recebe foco, e quem clicou na tela continua tendo o link como
 * 1º Tab. Visual e estados em globals.css (.ld-*): só transform e opacity animam.
 */
export default function LoadingScreen() {
  useLayoutEffect(() => {
    // Commit da hidratação: o script conta a etapa e põe o site (já pintado) por baixo da tela. O relógio do GSAP é
    // parado em lib/motion.ts enquanto a tela estiver aberta (só nas páginas que usam GSAP).
    window.__cdlLd?.hidratou?.();
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      <div className="ld-raiz">
        {/* Fora da tela: continua no ar depois que ela some, para anunciar "Site carregado" (e se esvazia 3 s depois) */}
        <p id="ld-status" role="status" className="sr-only" suppressHydrationWarning>
          {''}
        </p>
        {/* Região própria (tudo dentro de um landmark). data-a11y-aid: o alto contraste do site não repinta a tela, que
            já tem contraste alto e perderia a barra (os degradês somem e div vazia fica transparente) */}
        <section aria-label="Tela de carregamento" data-a11y-aid className="ld">
          <div aria-hidden="true" className="ld-fundo">
            <div className="ld-halo" />
            <div className="ld-grade" />
          </div>

          <div className="ld-centro">
            {/* Mesmo arquivo e tamanhos do logo do Header: um download só */}
            <div className="ld-cartao">
              <Image src="/logo-cdl.png" alt="" width={350} height={140} priority />
            </div>
            <p className="ld-frase">
              Comércio forte, <span>cidade viva.</span>
            </p>

            <div className="ld-progresso">
              <div aria-hidden="true" className="ld-rotulo">
                <span>Carregando</span>
                <span id="ld-num" className="ld-num" suppressHydrationWarning>
                  0%
                </span>
              </div>
              <div
                id="ld-barra"
                role="progressbar"
                aria-label="Carregando o site"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
                className="ld-trilho"
                suppressHydrationWarning
              >
                <div className="ld-preenche" />
                <div className="ld-ponta" />
              </div>
            </div>
          </div>

          <p className="ld-rodape">Câmara de Dirigentes Lojistas de Ipirá</p>
          <div aria-hidden="true" className="ld-faixa" />
        </section>
      </div>
    </>
  );
}
