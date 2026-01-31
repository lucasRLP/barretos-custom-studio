import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";

export default function Politicas() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero-gradient text-primary-foreground py-12 md:py-16">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            Políticas de Privacidade
          </h1>
          <p className="text-primary-foreground/80">
            Última atualização: Janeiro de 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-slate">
            <div className="card-elevated p-8 md:p-10">
              <h2 className="text-xl font-bold text-foreground mb-4">
                1. Introdução
              </h2>
              <p className="text-muted-foreground mb-6">
                A Barreto's Confecção ("nós", "nosso" ou "Empresa") está comprometida 
                em proteger a privacidade dos visitantes do nosso site e clientes. 
                Esta Política de Privacidade explica como coletamos, usamos, divulgamos 
                e protegemos suas informações pessoais.
              </p>

              <h2 className="text-xl font-bold text-foreground mb-4">
                2. Informações que Coletamos
              </h2>
              <p className="text-muted-foreground mb-4">
                Podemos coletar as seguintes informações:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li>Nome completo e razão social</li>
                <li>Endereço de e-mail e telefone</li>
                <li>Endereço de entrega</li>
                <li>CNPJ ou CPF para emissão de nota fiscal</li>
                <li>Informações sobre pedidos e preferências</li>
                <li>Dados de navegação e cookies</li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mb-4">
                3. Como Usamos suas Informações
              </h2>
              <p className="text-muted-foreground mb-4">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li>Processar e entregar seus pedidos</li>
                <li>Enviar orçamentos e propostas comerciais</li>
                <li>Comunicar sobre status de pedidos</li>
                <li>Melhorar nossos produtos e serviços</li>
                <li>Cumprir obrigações legais e fiscais</li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mb-4">
                4. Compartilhamento de Dados
              </h2>
              <p className="text-muted-foreground mb-6">
                Não vendemos ou alugamos suas informações pessoais. Podemos compartilhar 
                dados apenas com parceiros de logística para entrega, processadores de 
                pagamento, e quando exigido por lei.
              </p>

              <h2 className="text-xl font-bold text-foreground mb-4">
                5. Segurança dos Dados
              </h2>
              <p className="text-muted-foreground mb-6">
                Implementamos medidas de segurança técnicas e organizacionais para 
                proteger suas informações contra acesso não autorizado, alteração, 
                divulgação ou destruição.
              </p>

              <h2 className="text-xl font-bold text-foreground mb-4">
                6. Seus Direitos (LGPD)
              </h2>
              <p className="text-muted-foreground mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar a exclusão de dados desnecessários</li>
                <li>Revogar seu consentimento a qualquer momento</li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mb-4">
                7. Cookies
              </h2>
              <p className="text-muted-foreground mb-6">
                Utilizamos cookies para melhorar sua experiência de navegação, 
                analisar o tráfego do site e personalizar conteúdo. Você pode 
                configurar seu navegador para recusar cookies, mas isso pode 
                afetar algumas funcionalidades do site.
              </p>

              <h2 className="text-xl font-bold text-foreground mb-4">
                8. Contato
              </h2>
              <p className="text-muted-foreground mb-6">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, 
                entre em contato conosco através do e-mail{" "}
                <a 
                  href="mailto:privacidade@barretosconfeccao.com.br" 
                  className="text-secondary hover:underline"
                >
                  privacidade@barretosconfeccao.com.br
                </a>{" "}
                ou pela nossa{" "}
                <Link to="/contato" className="text-secondary hover:underline">
                  página de contato
                </Link>.
              </p>

              <h2 className="text-xl font-bold text-foreground mb-4">
                9. Alterações nesta Política
              </h2>
              <p className="text-muted-foreground">
                Podemos atualizar esta Política de Privacidade periodicamente. 
                Recomendamos que você revise esta página regularmente para se 
                manter informado sobre como protegemos suas informações.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
