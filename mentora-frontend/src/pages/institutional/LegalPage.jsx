import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import "./LegalPage.css";

export default function LegalPage() {
    return (
        <div className="legal">
            <h1>Termos e Privacidade</h1>
            <p className="legal_updated">Última atualização: agosto de 2026</p>
            <p className="legal_intro">
                Este documento reúne as regras de utilização do Mentora e explica
                como tratamos os teus dados pessoais. Lê com atenção antes de criar
                a tua conta.
            </p>

            <section>
                <h2>Termos de Uso</h2>

                <div className="legal_item">
                    <span className="legal_number">1</span>
                    <div>
                        <h3>Sobre o Mentora</h3>
                        <p>
                            O Mentora é uma plataforma que liga mentores a mentorados,
                            permitindo o agendamento de sessões de orientação profissional
                            pagas, bem como a partilha de conteúdo entre membros da
                            comunidade. Ao criar uma conta, aceitas os termos descritos
                            nesta página.
                        </p>
                    </div>
                </div>

                <div className="legal_item">
                    <span className="legal_number">2</span>
                    <div>
                        <h3>Contas e elegibilidade</h3>
                        <p>
                            Para usar o Mentora, deves ter pelo menos 18 anos e fornecer
                            informação verdadeira no registo. És responsável por manter a
                            confidencialidade da tua palavra-passe e por toda a atividade
                            realizada através da tua conta.
                        </p>
                    </div>
                </div>

                <div className="legal_item">
                    <span className="legal_number">3</span>
                    <div>
                        <h3>Mentores e sessões</h3>
                        <p>
                            Os mentores definem a sua própria área de atuação, preço por
                            sessão e disponibilidade. O Mentora atua como intermediário
                            entre mentor e mentorado, não sendo parte na relação de
                            aconselhamento prestada durante as sessões.
                        </p>
                    </div>
                </div>

                <div className="legal_item">
                    <span className="legal_number">4</span>
                    <div>
                        <h3>Pagamentos</h3>
                        <p>
                            Os pagamentos de sessões são processados através do Stripe. Ao
                            confirmar um agendamento, autorizas a cobrança do valor
                            apresentado no momento da reserva. Reembolsos e cancelamentos
                            seguem a política definida por cada mentor no seu perfil.
                        </p>
                    </div>
                </div>

                <div className="legal_item">
                    <span className="legal_number">5</span>
                    <div>
                        <h3>Conteúdo publicado</h3>
                        <p>
                            Ao publicar posts, comentários ou avaliações no Mentora,
                            garantes que o conteúdo é da tua autoria ou que tens
                            autorização para o partilhar. O Mentora reserva-se o direito
                            de remover conteúdo que viole estes termos ou que seja
                            reportado por outros utilizadores.
                        </p>
                    </div>
                </div>

                <div className="legal_item">
                    <span className="legal_number">6</span>
                    <div>
                        <h3>Conduta</h3>
                        <p>
                            Não é permitido usar a plataforma para assédio, discurso de
                            ódio, fraude ou qualquer atividade ilegal. Contas que violem
                            esta regra podem ser suspensas ou removidas pela
                            administração.
                        </p>
                    </div>
                </div>

                <div className="legal_item">
                    <span className="legal_number">7</span>
                    <div>
                        <h3>Alterações aos termos</h3>
                        <p>
                            Podemos atualizar estes termos periodicamente. Alterações
                            significativas serão comunicadas através da plataforma.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2>Política de Privacidade</h2>

                <div className="legal_item">
                    <span className="legal_number">1</span>
                    <div>
                        <h3>Dados que recolhemos</h3>
                        <p>
                            Recolhemos o nome, email, foto de perfil (opcional) e, no caso
                            de mentores, área de atuação e preço de sessão. Também
                            guardamos o histórico de sessões agendadas e mensagens
                            trocadas através do chat da plataforma.
                        </p>
                    </div>
                </div>

                <div className="legal_item">
                    <span className="legal_number">2</span>
                    <div>
                        <h3>Como usamos os dados</h3>
                        <p>
                            Os teus dados são usados para gerir a tua conta, processar
                            pagamentos, permitir o agendamento de sessões e melhorar a
                            experiência na plataforma. Não vendemos os teus dados a
                            terceiros.
                        </p>
                    </div>
                </div>

                <div className="legal_item">
                    <span className="legal_number">3</span>
                    <div>
                        <h3>Partilha com terceiros</h3>
                        <p>
                            Partilhamos dados de pagamento com o Stripe, exclusivamente
                            para processar as transações. Fotos de perfil e imagens de
                            posts são armazenadas através do Cloudinary.
                        </p>
                    </div>
                </div>

                <div className="legal_item">
                    <span className="legal_number">4</span>
                    <div>
                        <h3>Os teus direitos</h3>
                        <p>
                            Podes aceder, corrigir ou eliminar os teus dados pessoais a
                            qualquer momento através das definições da tua conta, ou
                            contactando a administração da plataforma.
                        </p>
                    </div>
                </div>

                <div className="legal_item">
                    <span className="legal_number">5</span>
                    <div>
                        <h3>Segurança</h3>
                        <p>
                            Usamos práticas padrão de segurança, incluindo palavras-passe
                            encriptadas, para proteger a tua informação. No entanto,
                            nenhum sistema é totalmente livre de risco.
                        </p>
                    </div>
                </div>

                <div className="legal_item">
                    <span className="legal_number">6</span>
                    <div>
                        <h3>Contacto</h3>
                        <p>
                            Para questões sobre privacidade ou os teus dados, contacta a
                            administração através dos canais disponibilizados na
                            plataforma.
                        </p>
                    </div>
                </div>
            </section>

            <Link to="/" className="legal_back">
                <FiHome /> Voltar à página inicial
            </Link>
        </div>
    );
}