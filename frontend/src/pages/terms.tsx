import { Button, Card, List, ListItem, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function Terms() {
  const router = useRouter();
  return (
    <Stack alignItems={"center"} justifyContent={"center"} minHeight={"100vh"}>
      <Card className="Card Terms" variant="outlined">
        <Stack
          spacing={2}
          alignItems={"center"}
          p={2}
          textAlign={"center"}
          justifyContent={"center"}
        >
          <Typography variant="h4">Termos de Serviço</Typography>

          <Typography variant="body1">
            Estes Termos de Serviço (&ldquo;Termos&rdquo;) regulam o uso de
            nossa aplicação web para registro de alunos que precisam de vaga no
            ônibus escolar (&ldquo;Aplicação&rdquo;). A Aplicação é
            disponibilizada por [Seu Nome/Empresa] (&ldquo;Nós&rdquo;,
            &ldquo;Nosso&rdquo; ou &ldquo;Nossa&rdquo;). Ao utilizar a
            Aplicação, você concorda em cumprir estes Termos e nossa Política de
            Privacidade.
          </Typography>

          <Typography variant="h6">
            1. Consentimento para Coleta de Dados
          </Typography>
          <Typography variant="body1">
            Você compreende e concorda que ao usar a Aplicação, iremos coletar e
            processar informações pessoais, incluindo, mas não se limitando a,
            seu nome completo, endereço de e-mail e escola em que estuda. Essas
            informações são coletadas com a finalidade de organizar as
            informações e enviar notificações relacionadas ao transporte
            escolar.
          </Typography>

          <Typography variant="h6">2. Finalidade da Coleta de Dados</Typography>
          <Typography variant="body1">
            As informações pessoais coletadas serão usadas apenas para os
            seguintes fins:
          </Typography>
          <List disablePadding>
            <ListItem>
              Organizar a demanda de alunos que necessitam de vaga no ônibus
              escolar.
            </ListItem>
            <ListItem>
              Enviar notificações relacionadas ao transporte escolar.
            </ListItem>
            <ListItem>Melhorar e otimizar nossos serviços.</ListItem>
          </List>

          <Typography variant="h6">3. Proteção de Dados e Segurança</Typography>
          <Typography variant="body1">
            Comprometemo-nos a proteger suas informações pessoais e a
            implementar medidas de segurança para garantir sua confidencialidade
            e integridade. No entanto, não podemos garantir segurança absoluta,
            e você compreende e aceita os riscos associados à transmissão de
            informações pela internet.
          </Typography>

          <Typography variant="h6">4. Compartilhamento de Dados</Typography>
          <Typography variant="body1">
            Nós não compartilharemos suas informações pessoais com terceiros sem
            o seu consentimento, exceto quando necessário para cumprir
            obrigações legais ou regulamentares.
          </Typography>

          <Typography variant="h6">5. Direitos do Titular dos Dados</Typography>
          <Typography variant="body1">
            Você tem o direito de acessar, retificar, apagar ou contestar o
            processamento de seus dados pessoais. Para exercer esses direitos,
            entre em contato conosco por meio das informações fornecidas na
            seção de contato da Aplicação.
          </Typography>

          <Typography variant="h6">
            6. Alterações nos Termos de Serviço
          </Typography>
          <Typography variant="body1">
            Reservamo-nos o direito de atualizar ou modificar estes Termos a
            qualquer momento. As alterações entrarão em vigor imediatamente após
            a publicação na Aplicação. É sua responsabilidade revisar
            periodicamente os Termos para se manter informado sobre as mudanças.
          </Typography>

          <Typography variant="h6">7. Aceitação dos Termos</Typography>
          <Typography variant="body1">
            Ao criar uma conta na Aplicação, você concorda com estes Termos e
            com nossa Política de Privacidade. Se você não concorda com esses
            Termos, não deve usar a Aplicação.
          </Typography>

          <Typography variant="h6">8. Contato</Typography>
          <Typography variant="body1">
            Se você tiver alguma dúvida, comentário ou preocupação sobre estes
            Termos ou nossa Política de Privacidade, entre em contato conosco
            por meio das informações fornecidas na Aplicação.
          </Typography>

          <Typography variant="body1">
            Estes Termos de Serviço entram em vigor a partir da data da criação
            da sua conta na Aplicação. Se você não concordar com esses Termos,
            por favor, não utilize a Aplicação. O uso contínuo da Aplicação após
            quaisquer alterações nos Termos constituirá sua aceitação das
            mudanças.
          </Typography>
          <Button variant="contained" onClick={() => router.back()}>Voltar</Button>
        </Stack>
      </Card>
    </Stack>
  );
}
