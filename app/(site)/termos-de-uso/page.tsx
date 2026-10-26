import Link from 'next/link';
import { FaFileContract } from 'react-icons/fa';
import { CONTACT } from '@/app/components/navigation/navItems';
import { pageMetadata } from '@/lib/seo';
import { HeroHighlight } from '../institucional/_components/ui';
import LegalDocument, { type LegalSection } from '../politica-de-privacidade/_components/LegalDocument';

export const metadata = pageMetadata({
  title: 'Termos de Uso',
  description:
    'Regras para usar o site da CDL Ipirá: inscrições em eventos, campanhas e sorteios, Balcão de Empregos, orientação jurídica, direitos autorais e foro.',
  path: '/termos-de-uso',
});

const sections: LegalSection[] = [
  {
    id: 'objeto',
    title: 'Sobre o site e estes termos',
    content: (
      <>
        <p>
          Este site é mantido pela <strong>{CONTACT.razaoSocial}</strong> (CDL Ipirá), CNPJ <strong>{CONTACT.cnpj}</strong>,
          com sede na {CONTACT.address.join(', ')}. Ele reúne informações sobre a entidade, os benefícios e produtos para
          associados (como SPC Brasil, certificado digital e CDL Mídia), notícias, eventos, campanhas, o Balcão de Empregos
          e os nossos canais de atendimento.
        </p>
        {/* LGPD: a política só informa (art. 9º), não é aceita junto com os termos */}
        <p>
          Estes Termos de Uso trazem as regras para usar o site e os serviços oferecidos nele. O tratamento de dados
          pessoais é explicado em um documento próprio, a <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'uso',
    title: 'Uso do site',
    content: (
      <>
        <p>
          O acesso ao conteúdo é gratuito e não exige cadastro. Alguns serviços pedem dados para funcionar, como a inscrição
          em eventos e os pedidos de contato. A área administrativa é de uso exclusivo da equipe da CDL.
        </p>
        <p>
          Procuramos manter o site no ar e as informações atualizadas, mas ele pode passar por manutenção, ficar
          temporariamente indisponível ou ter conteúdo alterado sem aviso prévio.
        </p>
      </>
    ),
  },
  {
    id: 'inscricoes',
    title: 'Inscrições em eventos e cadastros',
    content: (
      <ul>
        <li>Informe dados verdadeiros e atualizados. Você responde pelas informações que enviar.</li>
        <li>A inscrição é pessoal: cada e-mail pode ser usado uma vez em cada evento.</li>
        {/* Sem limite de vagas nem e-mail de confirmação no código: o texto descreve o que o formulário faz */}
        <li>
          A inscrição é confirmada na tela assim que você envia o formulário. Quando o evento tiver número limitado de
          vagas, isso será informado na página dele. Datas, horários, locais e programação podem mudar, ou o evento pode
          ser cancelado; nesses casos, avisaremos pelos contatos informados.
        </li>
        {/* Regra do evento não afasta direito do consumidor (CDC art. 51, I) */}
        <li>
          Eventos podem ter regras próprias (como público-alvo, credenciamento ou cobrança), que prevalecem quando houver,
          sem afastar os direitos previstos em lei.
        </li>
      </ul>
    ),
  },
  {
    id: 'campanhas',
    title: 'Campanhas, promoções e sorteios',
    content: (
      <p>
        Campanhas promocionais e sorteios divulgados no site seguem <strong>regulamentos próprios</strong>, com período,
        forma de participação, prêmios e critérios de apuração. Eles são realizados conforme a legislação aplicável e, em
        caso de diferença entre o texto de divulgação e o regulamento, vale o regulamento. Consulte-o antes de participar
        ou peça uma cópia pelos nossos canais.
      </p>
    ),
  },
  {
    id: 'balcao-de-empregos',
    title: 'Balcão de Empregos',
    content: (
      <ul>
        <li>
          A CDL divulga vagas e aproxima empresas e candidatos, mas não participa da seleção nem garante contratação. A
          relação de trabalho é exclusivamente entre a empresa e o candidato.
        </li>
        <li>
          Cada empresa responde pelas informações da vaga que cadastrar. Não são aceitas vagas com requisitos
          discriminatórios, cobrança de taxas dos candidatos ou qualquer conteúdo ilegal; a CDL pode recusar ou remover
          anúncios assim.
        </li>
        <li>O cadastro de vaga é enviado pelo WhatsApp, e o uso do aplicativo segue as regras do próprio WhatsApp.</li>
      </ul>
    ),
  },
  {
    id: 'orientacao-juridica',
    title: 'Orientação jurídica',
    content: (
      <p>
        A orientação jurídica é um benefício para associados. Ela esclarece dúvidas de forma geral e não substitui a
        contratação de um advogado para acompanhar um caso específico. O envio do formulário não cria, por si só, uma
        relação de representação judicial.
      </p>
    ),
  },
  {
    // O site não vende nem cobra; o direito de arrependimento vale para serviços contratados fora da sede.
    // PENDENTE (CDL): condições reais de cancelamento de cada serviço e se os 7 dias valem também para empresas.
    id: 'cancelamentos',
    title: 'Cancelamentos e reembolsos',
    content: (
      <p>
        O site não vende produtos nem recebe pagamentos. Serviços pagos da CDL, como certificado digital, consultas ao SPC
        Brasil e anúncios na CDL Mídia, seguem as condições informadas na contratação. Quando a contratação acontece fora
        da nossa sede (por telefone, WhatsApp, e-mail ou videoconferência), você pode desistir em até 7 dias, contados da
        contratação ou do recebimento do serviço, e recebe de volta o valor pago, com correção (art. 49 do Código de
        Defesa do Consumidor, Lei nº 8.078/1990). Eventos com cobrança seguem as regras divulgadas para cada um, sem prejuízo do direito de desistência
        acima. Para
        pedir, use os canais da seção <a href="#contato">Fale conosco</a>.
      </p>
    ),
  },
  {
    id: 'conduta',
    title: 'Conduta esperada',
    content: (
      <>
        <p>Ao usar o site, você se compromete a não:</p>
        <ul>
          <li>enviar informações falsas, de outra pessoa sem autorização ou que violem direitos de terceiros;</li>
          <li>usar os formulários para propaganda não solicitada, ofensas ou conteúdo ilegal;</li>
          <li>tentar acessar áreas restritas, burlar medidas de segurança ou explorar falhas do site;</li>
          <li>sobrecarregar o site com acessos automatizados ou copiar seu conteúdo em massa;</li>
          <li>enviar vírus ou qualquer código malicioso.</li>
        </ul>
        <p>
          Em caso de uso indevido, a CDL pode bloquear o acesso, recusar envios e comunicar as autoridades competentes.
        </p>
      </>
    ),
  },
  {
    id: 'propriedade-intelectual',
    title: 'Propriedade intelectual',
    content: (
      <>
        <p>
          Textos, fotos, vídeos, logotipos, layout e demais conteúdos do site pertencem à CDL Ipirá, são usados com
          autorização dos titulares ou sob licença de uso (como bancos de imagens e vídeos incorporados do YouTube). Marcas
          de terceiros, como SPC Brasil, pertencem aos respectivos donos. Você pode compartilhar links e citar trechos com
          indicação da fonte; outras formas de reprodução, alteração ou uso comercial dependem de autorização prévia por
          escrito.
        </p>
        {/* A CC BY 4.0 pede crédito com link para a licença: o react-icons tira o comentário de autoria dos SVGs */}
        <p>
          Ícones:{' '}
          <a href="https://fontawesome.com" target="_blank" rel="noopener noreferrer">
            Font Awesome Free<span className="sr-only"> (abre em nova aba)</span>
          </a>
          , de Fonticons, Inc., sob a licença{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY 4.0<span className="sr-only"> (abre em nova aba)</span>
          </a>
          , sem alterações; e{' '}
          <a href="https://ionic.io/ionicons" target="_blank" rel="noopener noreferrer">
            Ionicons<span className="sr-only"> (abre em nova aba)</span>
          </a>
          , sob a licença MIT.
        </p>
      </>
    ),
  },
  {
    id: 'terceiros',
    title: 'Links e conteúdos de terceiros',
    content: (
      <p>
        O site tem links e conteúdos de outros serviços, como o Portal do Associado (Higestor), SPC Brasil, WhatsApp,
        YouTube, Google Maps, o tradutor VLibras e redes sociais. Esses serviços têm termos e políticas próprios, e a CDL não controla nem
        responde pelo conteúdo, pela disponibilidade ou pelas práticas de privacidade deles.
      </p>
    ),
  },
  {
    id: 'responsabilidade',
    title: 'Limitação de responsabilidade',
    content: (
      <>
        <p>
          As informações do site têm caráter informativo. Fazemos o possível para mantê-las corretas, mas elas podem
          conter imprecisões ou ficar desatualizadas; confirme dados importantes (como datas, valores e condições) pelos
          nossos canais antes de tomar decisões.
        </p>
        <p>
          Nos limites permitidos pela lei, a CDL não responde por danos causados por indisponibilidade do site, por uso
          indevido feito por terceiros ou por conteúdos e serviços de terceiros. Nada nestes termos afasta direitos
          garantidos pelo Código de Defesa do Consumidor (Lei nº 8.078/1990).
        </p>
      </>
    ),
  },
  {
    id: 'acessibilidade',
    title: 'Acessibilidade',
    content: (
      <p>
        Seguindo o art. 63 da Lei Brasileira de Inclusão (Lei nº 13.146/2015), buscamos manter o site acessível a pessoas
        com deficiência. O painel de acessibilidade permite ajustar o texto, o contraste e outras preferências e ligar o
        tradutor de Libras (VLibras). Se encontrar alguma barreira, avise pelos nossos canais.
      </p>
    ),
  },
  {
    id: 'privacidade',
    title: 'Privacidade e proteção de dados',
    content: (
      <p>
        O tratamento de dados pessoais segue a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e está descrito na{' '}
        <Link href="/politica-de-privacidade">Política de Privacidade</Link>. Lá você encontra quais dados coletamos, para
        quê, com quem são compartilhados, os cookies usados e como exercer seus direitos.
      </p>
    ),
  },
  {
    id: 'alteracoes',
    title: 'Alterações destes termos',
    content: (
      <p>
        Estes termos podem ser atualizados para refletir mudanças no site, nos serviços ou na lei. A data da versão em
        vigor fica sempre no topo da página. Se a mudança for relevante, avisaremos com destaque no site.
      </p>
    ),
  },
  {
    id: 'lei-e-foro',
    title: 'Lei aplicável e foro',
    content: (
      <p>
        Estes termos seguem as leis brasileiras, em especial o Marco Civil da Internet (Lei nº 12.965/2014), a Lei Geral
        de Proteção de Dados (Lei nº 13.709/2018), o Código de Defesa do Consumidor (Lei nº 8.078/1990), nas relações de
        consumo, e a Lei Brasileira de Inclusão (Lei nº 13.146/2015). Fica eleito o foro da comarca de{' '}
        <strong>Ipirá, Bahia</strong>, para resolver qualquer questão relacionada a eles, ressalvado o direito do
        consumidor de propor ação no foro do seu domicílio (art. 101, I, do CDC).
      </p>
    ),
  },
  {
    id: 'contato',
    title: 'Fale conosco',
    content: (
      <p>
        Dúvidas sobre estes termos podem ser enviadas para <a href={CONTACT.email.href}>{CONTACT.email.label}</a>, pelo
        telefone{' '}
        <a href={CONTACT.phone.href} className="whitespace-nowrap">
          {CONTACT.phone.label}
        </a>{' '}
        ou pela nossa <Link href="/imprensa/contato">página de contato</Link>.
      </p>
    ),
  },
];

export default function TermosDeUsoPage() {
  return (
    <LegalDocument
      current="Termos de Uso"
      icon={FaFileContract}
      eyebrow="Regras do site"
      title={
        <>
          Termos de <HeroHighlight>Uso</HeroHighlight>
        </>
      }
      description="As regras para usar o site da CDL Ipirá, os nossos serviços online e o que cada parte pode esperar."
      updated={{ label: '26 de outubro de 2026', iso: '2026-10-26' }}
      sections={sections}
    />
  );
}
