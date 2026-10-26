import Link from 'next/link';
import { FaUserShield } from 'react-icons/fa';
import { CONTACT } from '@/app/components/navigation/navItems';
import { pageMetadata } from '@/lib/seo';
import { HeroHighlight } from '../institucional/_components/ui';
import LegalDocument, { LegalTable, type LegalSection } from './_components/LegalDocument';
import CookiePreferencesButton from './_components/CookiePreferencesButton';

export const metadata = pageMetadata({
  title: 'Política de Privacidade',
  description:
    'Quais dados pessoais o site da CDL Ipirá coleta, para que servem, com quem são compartilhados, quais cookies usa e como exercer seus direitos pela LGPD.',
  path: '/politica-de-privacidade',
});

// Horário de atendimento da sede, da mesma fonte do rodapé
const hours = CONTACT.hours
  .filter(({ time }) => time !== 'Fechado')
  .map(({ day, time }) => `${day.toLowerCase()}, ${time}`)
  .join('; ');

const mail = (subject: string) => `${CONTACT.email.href}?subject=${encodeURIComponent(subject)}`;

/* Conteúdo baseado no que o código realmente faz (formulários, APIs, armazenamento local e serviços usados).
   Ao mudar um formulário, um fornecedor ou o que fica salvo no navegador, atualize esta página e a data. */
const sections: LegalSection[] = [
  {
    id: 'quem-somos',
    title: 'Quem somos e a quem se aplica',
    content: (
      <>
        <p>
          Esta política explica como a <strong>{CONTACT.razaoSocial}</strong> (CDL Ipirá), inscrita no CNPJ{' '}
          <strong>{CONTACT.cnpj}</strong>, com sede na {CONTACT.address.join(', ')}, trata os dados pessoais de quem usa este
          site. Para fins da Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD), a CDL Ipirá é a{' '}
          <strong>controladora</strong> desses dados: é ela quem decide para que e como eles são usados.
        </p>
        <p>
          Ela vale para as páginas do site, os formulários, as inscrições em eventos e o Balcão de Empregos. Serviços de
          outras empresas que aparecem aqui (como o Portal do Associado, o WhatsApp e o YouTube) também têm regras
          próprias, que indicamos ao longo do texto.
        </p>
      </>
    ),
  },
  {
    id: 'dados',
    title: 'Quais dados coletamos e para quê',
    content: (
      <>
        <p>Coletamos apenas o que você mesmo informa em cada canal e alguns dados técnicos da navegação:</p>
        <LegalTable
          caption="Dados coletados em cada canal do site e finalidade"
          head={['Onde', 'Dados', 'Para quê']}
          rows={[
            [
              'Formulário de contato',
              'Nome, e-mail, telefone (opcional), assunto e mensagem. No envio, também o endereço IP e o tipo de navegador.',
              'Responder à sua mensagem e atender pedidos sobre os seus dados. O IP e o navegador servem para segurança e para barrar envios abusivos.',
            ],
            [
              'Pedido de orientação jurídica',
              'Nome, empresa, assunto, telefone, e-mail e a descrição da sua dúvida.',
              'Analisar o pedido e retornar com a orientação, como benefício ao associado.',
            ],
            [
              'Inscrição em eventos',
              'Nome completo, telefone/WhatsApp, e-mail e, se quiser, a empresa.',
              'Confirmar a inscrição, organizar o evento e avisar sobre mudanças. O e-mail garante uma inscrição por pessoa.',
            ],
            [
              'Cadastro de vaga (Balcão de Empregos)',
              'Empresa, cargo, descrição, quantidade, localização, nome e telefone do responsável e e-mail.',
              'Divulgar a vaga. O formulário não grava nada: ele monta uma mensagem que você mesmo envia pelo WhatsApp da CDL. Se a vaga for publicada, a equipe cadastra no painel o nome, o telefone e o e-mail do responsável, que não aparecem no site.',
            ],
            [
              'Currículos (Balcão de Empregos)',
              'Nome, e-mail, telefone, o arquivo do currículo que você entrega à CDL e anotações da equipe sobre o encaminhamento.',
              'Encaminhar o currículo às empresas com vagas compatíveis, a seu pedido.',
            ],
            // Imagem de pessoa identificável é dado pessoal (galeria, notícias, diretoria e colaboradores)
            [
              'Fotos de eventos e equipe',
              'Imagem de quem aparece em fotos e vídeos de eventos e sorteios; nome, cargo, foto e apresentação de diretores e colaboradores.',
              <>
                Divulgar as atividades da CDL e apresentar quem a dirige. Se você aparece em uma foto ou vídeo e quer que
                seja retirado, peça pelos canais de <a href="#direitos">Seus direitos</a>.
              </>,
            ],
            [
              'Navegação',
              'Endereço IP, data e hora, páginas acessadas e dados do navegador e do aparelho. Os termos digitados na busca vão ao servidor só para gerar os resultados.',
              'Fazer o site funcionar, manter a segurança e investigar falhas ou abusos.',
            ],
            [
              'Área administrativa (só equipe da CDL)',
              'E-mail de acesso, sessão de login e registro das ações feitas no painel, com IP.',
              'Controlar o acesso e manter um histórico de auditoria do que foi alterado.',
            ],
          ]}
        />
        <p>
          A ficha de associação e o <strong>Portal do Associado</strong> funcionam na plataforma Higestor
          (app.higestor.com.br), usada pela CDL na gestão dos associados. Os dados informados lá servem para administrar a
          sua associação.
        </p>
        <p>
          Não pedimos dados sensíveis (como saúde, religião ou opinião política). Nos campos de mensagem e de descrição,
          escreva só o necessário para o atendimento.
        </p>
      </>
    ),
  },
  {
    id: 'bases-legais',
    title: 'Bases legais',
    content: (
      <>
        <p>Cada uso de dados se apoia em uma das hipóteses do art. 7º da LGPD:</p>
        <ul>
          <li>
            <strong>Procedimentos preliminares ou execução de contrato, a seu pedido (art. 7º, V):</strong> inscrições em
            eventos, pedidos de orientação jurídica, associação e envio de currículo para vagas.
          </li>
          <li>
            <strong>Legítimo interesse (art. 7º, IX):</strong> responder mensagens de contato, divulgar as atividades da
            CDL com fotos e vídeos dos eventos, manter a segurança do site e os registros técnicos de acesso, sempre
            respeitando suas expectativas e seus direitos (inclusive o de se opor, pedindo a retirada de uma imagem).
          </li>
          <li>
            <strong>Cumprimento de obrigação legal ou regulatória (art. 7º, II):</strong> quando a lei exigir que algum
            registro seja guardado ou informado a autoridades.
          </li>
          <li>
            <strong>Exercício regular de direitos (art. 7º, VI):</strong> guardar o necessário para defesa em processos
            judiciais, administrativos ou arbitrais.
          </li>
          <li>
            <strong>Consentimento (art. 7º, I):</strong> carregar conteúdo de terceiros (vídeos do YouTube e mapa do
            Google) e, quando você liga a opção no painel de acessibilidade, o tradutor de Libras (VLibras). Você pode
            retirar o consentimento a qualquer momento, sem custo.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'compartilhamento',
    title: 'Com quem compartilhamos',
    content: (
      <>
        <p>
          <strong>Não vendemos nem alugamos dados pessoais.</strong> Eles são acessados pela equipe da CDL que precisa
          deles para o atendimento e pelos fornecedores listados abaixo.
        </p>
        {/* LGPD art. 5º, VI e VII: quem trata em nome da CDL (operador) fica separado de quem decide por conta própria */}
        <h3>Operadores: fornecedores contratados pela CDL</h3>
        <p>Tratam dados em nosso nome, seguindo as nossas instruções e só para as finalidades desta política:</p>
        <LegalTable
          caption="Operadores contratados pela CDL"
          head={['Quem', 'O que faz', 'Quais dados']}
          rows={[
            [
              'Supabase',
              'Banco de dados, arquivos e login da equipe',
              'Dados dos formulários, inscrições, currículos e imagens do site; também recebe o IP e dados do navegador quando uma página carrega conteúdo direto dele (notícias, eventos)',
            ],
            ['Vercel', 'Hospedagem e entrega do site', 'Registros técnicos de acesso (IP, navegador, páginas)'],
            ['Cloudflare (Turnstile)', 'Verificação contra robôs no login da equipe', 'Dados técnicos do navegador de quem faz login'],
          ]}
        />
        <h3>Serviços de terceiros, com políticas próprias</h3>
        <p>
          Estes serviços são de outras empresas ou órgãos, que tratam os dados que recebem conforme as próprias políticas
          de privacidade. Eles só entram em ação quando você usa o recurso correspondente:
        </p>
        <LegalTable
          caption="Serviços de terceiros que recebem dados quando você os usa"
          head={['Quem', 'Quando', 'Quais dados']}
          rows={[
            ['Google / YouTube', 'Vídeos da TV Lojista e mapa da página de contato, só depois que você permitir o conteúdo de terceiros', 'IP, dados do navegador e cookies próprios'],
            ['Meta (WhatsApp)', 'Quando você usa os botões de WhatsApp ou envia o cadastro de vaga', 'O que você escrever na mensagem e o seu número'],
            [
              'Governo Federal (VLibras)',
              'Tradutor de Libras, só se você ligar a opção no painel de acessibilidade. Os arquivos do tradutor vêm da rede jsDelivr.',
              'IP, dados do navegador e o texto enviado para tradução',
            ],
            ['Higestor', 'Ficha de associação e Portal do Associado, quando você acessa a plataforma', 'Os dados que você informar lá'],
          ]}
        />
        <p>
          Algumas imagens publicadas no site (em notícias, por exemplo) podem vir de servidores de outras empresas. Ao
          exibi-las, o seu navegador se conecta a esses servidores, que recebem o seu endereço IP e dados do navegador.
        </p>
        <p>
          Currículos são enviados às empresas que anunciaram vagas compatíveis, a seu pedido. Também podemos compartilhar
          dados com autoridades públicas quando houver obrigação legal ou ordem judicial.
        </p>
      </>
    ),
  },
  {
    id: 'transferencia-internacional',
    title: 'Transferência internacional',
    content: (
      <>
        <p>
          Os operadores (Supabase, Vercel e Cloudflare) podem armazenar ou processar dados em servidores fora do Brasil.
          Nesses casos, a transferência segue o art. 33 da LGPD, e escolhemos fornecedores que assumem, nos seus termos de
          serviço, compromissos de proteção de dados e de segurança.
        </p>
        <p>
          Os serviços de terceiros (como Google, Meta e a rede jsDelivr, que entrega os arquivos do VLibras) também podem
          tratar dados fora do país, sob a responsabilidade de cada um e conforme as políticas deles.
        </p>
      </>
    ),
  },
  {
    id: 'retencao',
    title: 'Por quanto tempo guardamos',
    content: (
      <>
        <p>Guardamos os dados só pelo tempo necessário para cada finalidade:</p>
        <ul>
          <li>
            <strong>Mensagens de contato e pedidos de orientação:</strong> durante o atendimento e pelo período em que o
            histórico for útil para dar continuidade a ele.
          </li>
          <li>
            <strong>Inscrições em eventos:</strong> até a realização do evento e a conclusão das atividades ligadas a ele.
          </li>
          <li>
            <strong>Currículos:</strong> enquanto estiverem disponíveis para vagas ou até você pedir a exclusão.
          </li>
          <li>
            <strong>Fotos e vídeos de eventos:</strong> enquanto fizerem parte do histórico de atividades publicado no
            site, ou até você pedir a retirada.
          </li>
          <li>
            <strong>Registros técnicos e de auditoria:</strong> pelo tempo necessário à segurança do site e à apuração de
            incidentes.
          </li>
        </ul>
        {/* PENDENTE (CDL): prazos em números. Não há rotina automática de exclusão; o texto descreve o que a equipe faz.
            O painel apaga mensagens (Fale Conosco), pedidos de orientação, inscrições e currículos; o audit_log não */}
        <p>
          A exclusão não é automática: a equipe revisa as mensagens, os pedidos de orientação, as inscrições e os
          currículos e apaga pelo painel o que não for mais necessário, exceto quando a lei exigir a guarda ou quando
          forem necessários para o exercício de direitos (art. 16 da LGPD).
        </p>
      </>
    ),
  },
  {
    id: 'seguranca',
    title: 'Como protegemos os dados',
    content: (
      <>
        <p>Adotamos medidas técnicas e administrativas para proteger os dados contra acesso indevido, perda ou vazamento:</p>
        <ul>
          <li>conexão criptografada (HTTPS) em todo o site;</li>
          <li>painel administrativo restrito à equipe, com login individual, verificação contra robôs e sessão com tempo limite;</li>
          <li>registro de auditoria das alterações feitas no painel;</li>
          <li>limite de envios por endereço IP nos formulários;</li>
          <li>acesso aos dados limitado a quem precisa deles para trabalhar.</li>
        </ul>
        <p>
          Nenhum sistema é totalmente imune a falhas. Se ocorrer um incidente de segurança que possa trazer risco ou dano
          relevante, comunicaremos os titulares afetados e a Autoridade Nacional de Proteção de Dados (ANPD), como manda o
          art. 48 da LGPD.
        </p>
      </>
    ),
  },
  {
    id: 'direitos',
    title: 'Seus direitos',
    content: (
      <>
        <p>Pelo art. 18 da LGPD, você pode pedir a qualquer momento, sem custo:</p>
        <ul>
          <li>confirmação de que tratamos dados seus e acesso a eles;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desacordo com a lei;</li>
          <li>portabilidade dos dados a outro fornecedor;</li>
          <li>eliminação dos dados tratados com o seu consentimento;</li>
          <li>informação sobre com quem compartilhamos seus dados;</li>
          <li>informação sobre a possibilidade de não dar consentimento e sobre as consequências disso;</li>
          <li>revogação do consentimento;</li>
          <li>oposição a um tratamento feito sem consentimento, se ele descumprir a lei.</li>
        </ul>
        <h3>Como pedir</h3>
        {/* O link abre o formulário de contato com o assunto "Privacidade e meus dados" já escolhido */}
        <p>
          O jeito mais simples é o formulário de contato:{' '}
          <Link href="/imprensa/contato?assunto=privacidade#formulario">Exercer meus direitos</Link>. Diga o que quer
          (acesso, correção, exclusão, revogação do consentimento etc.) e onde deixou seus dados (por exemplo, a inscrição
          em um evento).
        </p>
        {/* Tela "Fale Conosco" do painel: destaca os pedidos de privacidade com o prazo do art. 19 até serem respondidos */}
        <p>
          O pedido feito pelo formulário chega à equipe da CDL no painel do site, marcado como pedido de privacidade e com
          o prazo de resposta, e fica em aberto até ser atendido. Respondemos pelo e-mail ou telefone que você informar.
        </p>
        <p>
          Também atendemos pelo e-mail <a href={mail('Privacidade - pedido do titular')}>{CONTACT.email.label}</a>, com o
          assunto &quot;Privacidade&quot;, pelo telefone{' '}
          <a href={CONTACT.phone.href} className="whitespace-nowrap">
            {CONTACT.phone.label}
          </a>{' '}
          ou na nossa sede. Para proteger você, podemos pedir informações que confirmem a sua identidade antes de
          atender. Respondemos em até 15 dias (art. 19 da LGPD).
        </p>
        <p>
          Se não ficar satisfeito com a resposta, você também pode apresentar reclamação à ANPD, em{' '}
          <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">
            gov.br/anpd<span className="sr-only"> (abre em nova aba)</span>
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'encarregado',
    title: 'Encarregado e canal de comunicação',
    content: (
      <>
        {/* PENDENTE (CDL): confirmar o enquadramento como agente de pequeno porte. Se a CDL nomear um encarregado,
            trocar este parágrafo pelo nome (pessoa ou empresa) e pelo contato dele (art. 41, §1º) */}
        <p>
          Como agente de tratamento de pequeno porte, a CDL Ipirá não é obrigada a indicar um encarregado pelo tratamento
          de dados pessoais (art. 11 da Resolução CD/ANPD nº 2/2022). Em seu lugar, ela indica um canal de comunicação com
          os titulares e com a ANPD: o e-mail <a href={mail('Privacidade - encarregado')}>{CONTACT.email.label}</a>, com o
          assunto &quot;Privacidade&quot;. Por ele você tira dúvidas sobre esta política, exerce seus direitos e relata
          qualquer problema com seus dados.
        </p>
        <p>
          Também atendemos pelo WhatsApp{' '}
          <a href={CONTACT.whatsapp.href} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap">
            {CONTACT.whatsapp.label}
            <span className="sr-only"> (abre em nova aba)</span>
          </a>{' '}
          e na sede ({hours}).
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies e armazenamento no navegador',
    content: (
      <>
        <p>
          <strong>O site não usa cookies de publicidade nem de estatística.</strong> Para funcionar, ele guarda algumas
          informações no próprio navegador (armazenamento local), que não identificam você e não saem do seu aparelho:
        </p>
        <LegalTable
          caption="Cookies e itens guardados no navegador"
          head={['Nome', 'Para que serve', 'Duração']}
          rows={[
            ['cookie-consent', 'Guarda a sua escolha neste aviso de cookies e a data dela', 'Até você mudar a escolha ou limpar os dados do navegador'],
            ['a11y-preferences', 'Guarda suas preferências de acessibilidade (tamanho do texto, contraste etc.)', 'Até você restaurar o padrão ou limpar os dados do navegador'],
            ['cdl-recent-searches', 'Mostra suas últimas buscas no site como atalho', 'Até você limpar os dados do navegador'],
            ['install-prompt-shown', 'Evita repetir o convite para instalar o site como aplicativo', 'Até você limpar os dados do navegador'],
            // Gravados pelo próprio script do VLibras (só existem com a opção ligada)
            ['@vlibras-widget e @vlibras/player', 'Guardam as preferências do tradutor VLibras, só se você ligar o tradutor de Libras', 'Até você limpar os dados do navegador'],
          ]}
        />
        <h3>Só na área administrativa</h3>
        <p>
          Quem faz login no painel da CDL recebe cookies de sessão estritamente necessários: o de autenticação (iniciado
          por &quot;sb-&quot;, protegido contra leitura por scripts e encerrado ao sair ou 4 horas após o login) e o{' '}
          <strong>csrf_token</strong>, que impede ações forjadas por outros sites e dura até o navegador ser fechado.
          Visitantes do site não recebem esses cookies.
        </p>
        <h3>Conteúdo de terceiros (opcional)</h3>
        <p>
          Os vídeos da TV Lojista (YouTube) e o mapa da página de contato (Google Maps) são carregados dos servidores do
          Google. Ao exibi-los, o Google pode gravar cookies próprios (como YSC, VISITOR_INFO1_LIVE e NID) e receber dados
          de navegação, conforme a{' '}
          <a href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noopener noreferrer">
            política de privacidade do Google<span className="sr-only"> (abre em nova aba)</span>
          </a>
          . Por isso, eles só carregam com a sua permissão: no aviso de cookies ou no aviso que aparece no lugar do vídeo
          e do mapa, onde você pode carregar só daquela vez (nada é salvo) ou permitir sempre.
        </p>
        <p>
          O tradutor VLibras tem um controle próprio: ele só é carregado quando você liga a opção Libras no painel de
          acessibilidade, e pode ser desligado ali mesmo.
        </p>
        <p>
          Você pode mudar a sua escolha quando quiser, pelo botão abaixo ou pelo link &quot;Preferências de cookies&quot;
          no rodapé. Também é possível apagar esses dados nas configurações do navegador.
        </p>
        <CookiePreferencesButton />
      </>
    ),
  },
  {
    id: 'menores',
    title: 'Crianças e adolescentes',
    content: (
      <p>
        O site é voltado a empresários, associados e ao público adulto. Não coletamos intencionalmente dados de menores de
        18 anos. A inscrição de crianças e adolescentes em eventos deve ser feita por um dos pais ou pelo responsável legal,
        no melhor interesse do menor (art. 14 da LGPD). Se perceber que recebemos dados de uma criança sem essa
        autorização, fale conosco para que sejam apagados.
      </p>
    ),
  },
  {
    id: 'atualizacoes',
    title: 'Mudanças nesta política',
    content: (
      <>
        <p>
          Podemos atualizar esta política para refletir mudanças no site, nos serviços ou na lei. A data da última
          atualização fica sempre no topo da página. Se a mudança for relevante, avisaremos com destaque no site.
        </p>
        <p>
          Para as regras gerais de uso do site, consulte também os <Link href="/termos-de-uso">Termos de Uso</Link>.
        </p>
      </>
    ),
  },
];

export default function PoliticaDePrivacidadePage() {
  return (
    <LegalDocument
      current="Política de Privacidade"
      icon={FaUserShield}
      eyebrow="Privacidade e LGPD"
      title={
        <>
          Política de <HeroHighlight>Privacidade</HeroHighlight>
        </>
      }
      description="Quais dados pessoais o site da CDL Ipirá coleta, para que servem, com quem são compartilhados e como você exerce os seus direitos."
      updated={{ label: '26 de outubro de 2026', iso: '2026-10-26' }}
      sections={sections}
    />
  );
}
