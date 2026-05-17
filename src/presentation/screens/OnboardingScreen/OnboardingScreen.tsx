import React, { useMemo, useRef } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Check,
  ListChecks,
  Lock,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react-native';
import {
  Button,
  Card,
  Icon,
  Typography,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import { useOnboardingScreen } from './useOnboardingScreen';
import { createStyles } from './OnboardingScreen.styles';

const STEPS = 5;

export function OnboardingScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const vm = useOnboardingScreen(STEPS);
  const scrollRef = useRef<ScrollView>(null);
  const widthRef = useRef(Dimensions.get('window').width);

  const scrollTo = (index: number) => {
    scrollRef.current?.scrollTo({
      x: index * widthRef.current,
      animated: !theme.preferences.reduceMotion,
    });
  };

  const handleNext = () => {
    if (vm.isLastStep) {
      void vm.finish();
      return;
    }
    const next = vm.currentStep + 1;
    vm.setCurrentStep(next);
    scrollTo(next);
  };

  const handleBack = () => {
    if (vm.isFirstStep) return;
    const prev = vm.currentStep - 1;
    vm.setCurrentStep(prev);
    scrollTo(prev);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const page = Math.round(x / widthRef.current);
    if (page !== vm.currentStep && page >= 0 && page < STEPS) {
      vm.setCurrentStep(page);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topBar}>
        {!vm.isLastStep ? (
          <Pressable
            onPress={vm.skip}
            accessibilityRole="button"
            accessibilityLabel="Pular introdução"
            hitSlop={12}
          >
            <Typography variant="bodyEmphasis" color="secondary">
              Pular
            </Typography>
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <WelcomePage styles={styles} width={widthRef.current} />
        <TasksPage styles={styles} width={widthRef.current} />
        <FocusPage styles={styles} width={widthRef.current} />
        <GamificationPage styles={styles} width={widthRef.current} />
        <PermissionsPage
          styles={styles}
          width={widthRef.current}
          supported={vm.blockerSupported}
          hasUsageAccess={vm.hasUsageAccess}
          hasOverlay={vm.hasOverlay}
          onRequestUsageAccess={vm.requestUsageAccess}
          onRequestOverlay={vm.requestOverlay}
          onRefresh={vm.refreshPermissions}
          successColor={theme.colors.success}
        />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {Array.from({ length: STEPS }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === vm.currentStep && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.actionsRow}>
          {!vm.isFirstStep ? (
            <Button
              label="Voltar"
              variant="ghost"
              onPress={handleBack}
              fullWidth
            />
          ) : null}
          <View style={styles.actionGrow}>
            <Button
              label={vm.isLastStep ? 'Começar a usar' : 'Avançar'}
              onPress={handleNext}
              loading={vm.finishing}
              fullWidth
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

type Styles = ReturnType<typeof createStyles>;

interface PageProps {
  styles: Styles;
  width: number;
}

function PageContainer({
  width,
  children,
  styles,
}: PageProps & { children: React.ReactNode }) {
  return <View style={[styles.page, { width }]}>{children}</View>;
}

function WelcomePage({ styles, width }: PageProps) {
  const theme = useTheme();
  return (
    <PageContainer styles={styles} width={width}>
      <View style={styles.iconWrapper}>
        <Icon name={Sparkles} size={56} color={theme.colors.accent} />
      </View>
      <Typography variant="h1" style={styles.title}>
        Bem-vindo ao FocusQuest
      </Typography>
      <Typography variant="body" color="secondary" style={styles.description}>
        Um app pensado para quem tem TDAH: organize sua rotina, entre em
        modo foco e seja recompensado por cada conquista.
      </Typography>
      <Typography variant="caption" color="secondary" style={styles.description}>
        Você pode pular esta introdução a qualquer momento e revisitar tudo dentro do app.
      </Typography>
    </PageContainer>
  );
}

function TasksPage({ styles, width }: PageProps) {
  const theme = useTheme();
  return (
    <PageContainer styles={styles} width={width}>
      <View style={styles.iconWrapper}>
        <Icon name={ListChecks} size={56} color={theme.colors.accent} />
      </View>
      <Typography variant="h2" style={styles.title}>
        Tarefas que respeitam a sua rotina
      </Typography>
      <Typography variant="body" color="secondary" style={styles.description}>
        Crie tarefas com prioridade, prazo e duração estimada. Organize por
        categoria, divida em subtarefas e configure rotinas que se repetem.
      </Typography>
      <View style={styles.bullets}>
        <Bullet text="Tarefas únicas ou recorrentes (diária, semanal, a cada N dias)" />
        <Bullet text="Subtarefas para quebrar trabalhos grandes em passos menores" />
        <Bullet text="Lembretes locais no horário que você agendar" />
      </View>
    </PageContainer>
  );
}

function FocusPage({ styles, width }: PageProps) {
  const theme = useTheme();
  return (
    <PageContainer styles={styles} width={width}>
      <View style={styles.iconWrapper}>
        <Icon name={Target} size={56} color={theme.colors.accent} />
      </View>
      <Typography variant="h2" style={styles.title}>
        Modo foco com bloqueio real
      </Typography>
      <Typography variant="body" color="secondary" style={styles.description}>
        Escolha a duração da sessão (15, 25, 45 ou 60 min), selecione os
        apps distratores e o FocusQuest impede o acesso enquanto o foco
        estiver ativo.
      </Typography>
      <View style={styles.bullets}>
        <Bullet text="Cronômetro visível e notificação persistente" />
        <Bullet text="Sobreposição em tela cheia quando um app bloqueado abre" />
        <Bullet text="Funciona em segundo plano enquanto você usa outros apps" />
      </View>
    </PageContainer>
  );
}

function GamificationPage({ styles, width }: PageProps) {
  const theme = useTheme();
  return (
    <PageContainer styles={styles} width={width}>
      <View style={styles.iconWrapper}>
        <Icon name={Trophy} size={56} color={theme.colors.accent} />
      </View>
      <Typography variant="h2" style={styles.title}>
        Recompensa imediata para o seu cérebro
      </Typography>
      <Typography variant="body" color="secondary" style={styles.description}>
        Cada tarefa concluída e cada sessão de foco rendem XP, moedas e podem
        desbloquear conquistas.
      </Typography>
      <View style={styles.bullets}>
        <Bullet text="XP por prioridade, duração, pontualidade e sequência de dias" />
        <Bullet text="Suba de nível conforme acumula experiência" />
        <Bullet text="Cadastre as suas próprias recompensas na Lojinha e troque por moedas" />
        <Bullet text="Conquistas automáticas conforme você usa o app" />
      </View>
    </PageContainer>
  );
}

interface PermissionsPageProps extends PageProps {
  supported: boolean;
  hasUsageAccess: boolean;
  hasOverlay: boolean;
  onRequestUsageAccess: () => Promise<void> | void;
  onRequestOverlay: () => Promise<void> | void;
  onRefresh: () => Promise<void> | void;
  successColor: string;
}

function PermissionsPage({
  styles,
  width,
  supported,
  hasUsageAccess,
  hasOverlay,
  onRequestUsageAccess,
  onRequestOverlay,
  onRefresh,
  successColor,
}: PermissionsPageProps) {
  const theme = useTheme();
  return (
    <PageContainer styles={styles} width={width}>
      <View style={styles.iconWrapper}>
        <Icon name={Lock} size={56} color={theme.colors.accent} />
      </View>
      <Typography variant="h2" style={styles.title}>
        Permissões do modo foco
      </Typography>
      <Typography variant="body" color="secondary" style={styles.description}>
        Para bloquear apps durante uma sessão, o Android exige duas
        permissões especiais. Você pode conceder agora ou depois — o app
        funciona normalmente sem elas.
      </Typography>

      {!supported ? (
        <Card style={styles.permissionsCard}>
          <Typography variant="bodyEmphasis">Indisponível neste build</Typography>
          <Typography variant="caption" color="secondary">
            O bloqueio só funciona em builds nativos do Android (dev build ou EAS).
          </Typography>
        </Card>
      ) : (
        <Card style={styles.permissionsCard}>
          <PermissionRow
            styles={styles}
            label="Acesso ao uso"
            description="Permite detectar qual app está aberto"
            granted={hasUsageAccess}
            onRequest={onRequestUsageAccess}
            successColor={successColor}
          />
          <PermissionRow
            styles={styles}
            label="Sobreposição"
            description="Permite mostrar a tela de bloqueio sobre outros apps"
            granted={hasOverlay}
            onRequest={onRequestOverlay}
            successColor={successColor}
          />
          <Button
            label="Verificar novamente"
            variant="ghost"
            size="sm"
            onPress={() => {
              void onRefresh();
            }}
          />
        </Card>
      )}
    </PageContainer>
  );
}

interface PermissionRowProps {
  styles: Styles;
  label: string;
  description: string;
  granted: boolean;
  onRequest: () => Promise<void> | void;
  successColor: string;
}

function PermissionRow({
  styles,
  label,
  description,
  granted,
  onRequest,
  successColor,
}: PermissionRowProps) {
  return (
    <View style={styles.permissionRow}>
      <View style={styles.permissionInfo}>
        <Typography variant="bodyEmphasis">{label}</Typography>
        <Typography variant="caption" color="secondary">
          {description}
        </Typography>
      </View>
      {granted ? (
        <Icon name={Check} size={20} color={successColor} />
      ) : (
        <Button
          label="Conceder"
          size="sm"
          onPress={() => {
            void onRequest();
          }}
        />
      )}
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.bulletRow}>
      <Icon name={Check} size={18} color={theme.colors.accent} />
      <Typography variant="body" color="secondary" style={styles.bulletText}>
        {text}
      </Typography>
    </View>
  );
}
