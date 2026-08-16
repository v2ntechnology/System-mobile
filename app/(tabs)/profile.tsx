import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState, type ComponentProps, type ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import {
  Button,
  Card,
  Chip,
  HeroBar,
  SectionHeader,
  SheetScreen,
  StateView,
  Text,
  ThemePicker,
} from "@/components/ui";
import { useAuthStore, useSession } from "@/features/auth/store";
import { getHome } from "@/features/journey/api";
import { RewardCard } from "@/features/performance/components/reward-card";
import { ScoreBreakdown } from "@/features/performance/components/score-breakdown";
import { ScoreRing } from "@/features/performance/components/score-ring";
import { ScoreTrend } from "@/features/performance/components/score-trend";
import { getProfile } from "@/features/profile/api";
import { daysUntil, formatDate } from "@/lib/format";
import { theme, useColors, useThemedStyles, type Scheme } from "@/theme";
import type { RoadEventCount, RoadEventType } from "@/types";

type IconName = ComponentProps<typeof Ionicons>["name"];

const EVENT_ICON: Record<RoadEventType, IconName> = {
  EXCESSO_VELOCIDADE: "speedometer-outline",
  FRENAGEM_BRUSCA: "warning-outline",
  CURVA_AGRESSIVA: "git-compare-outline",
  JORNADA_EXCEDIDA: "time-outline",
  DISTRACAO: "phone-portrait-outline",
  SONOLENCIA: "moon-outline",
};

export default function ProfileScreen() {
  const router = useRouter();
  const session = useSession();
  const clearSession = useAuthStore((state) => state.clearSession);
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const profile = useQuery({ queryKey: ["driver-profile"], queryFn: getProfile });
  const home = useQuery({ queryKey: ["driver-home"], queryFn: getHome });

  function logout() {
    setLogoutDialogOpen(false);
    clearSession();
    router.replace("/login");
  }

  if (profile.isPending || profile.isError) {
    return (
      <SheetScreen scroll={false} insetBottom={false} hero={<HeroBar title="Perfil" />}>
        <StateView
          loading={profile.isPending}
          error={profile.error}
          onRetry={() => void profile.refetch()}
          skeleton
        />
      </SheetScreen>
    );
  }

  const data = profile.data;
  const driver = home.data?.driver;
  const score = driver?.score ?? data.scoreHistory.at(-1)?.score ?? 0;
  const previousScore = data.scoreHistory.at(-2)?.score ?? score;
  const scoreDelta = driver?.scoreDelta ?? score - previousScore;
  const cnhDays = daysUntil(data.cnhExpiresAt);
  const name = session?.user.name ?? driver?.name ?? "Motorista";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <View style={styles.root}>
      <SheetScreen
        insetBottom={false}
        refreshing={profile.isFetching}
        onRefresh={() => void profile.refetch()}
        hero={
          <HeroBar
            title={name}
            subtitle={`${data.role} · ${session?.tenant.name ?? ""}`.trim()}
            trailing={
              <View style={styles.avatar}>
                <Text variant="titleMd" tone="secondary">
                  {initials}
                </Text>
              </View>
            }
          />
        }
      >
        <Card style={styles.performance}>
          <View style={styles.performanceMain}>
            <ScoreRing caption="score" score={score} size={100} />
            <View style={styles.performanceCopy}>
              <Text variant="overline" tone="muted">
                Seu desempenho
              </Text>
              <Text variant="headlineMd">
                {score >= 95
                  ? "Excelente direção"
                  : score >= 90
                    ? "Ótimo desempenho"
                    : "Em evolução"}
              </Text>
              <View style={styles.performanceMeta}>
                <Chip
                  label={`${scoreDelta >= 0 ? "+" : ""}${scoreDelta} no mês`}
                  tone={scoreDelta >= 0 ? "positive" : "critical"}
                />
                <View style={styles.rankLine}>
                  <Ionicons name="podium-outline" size={16} color={colors.onSurfaceMuted} />
                  <Text variant="labelSm" tone="muted" tabular>
                    {data.reward.position}º de {data.reward.participantCount}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.performanceFacts}>
            <Fact label="No prazo" value={`${data.onTimeDeliveryRate}%`} />
            <Fact
              label="Consumo"
              value={`${data.avgFuelEfficiency.toLocaleString("pt-BR")} km/l`}
            />
            <Fact label="Dirigidas" value={`${data.hoursDriven} h`} />
          </View>
        </Card>

        <View style={styles.section}>
          <SectionHeader
            title="Sua premiação"
            description="Estimativa conforme as faixas definidas pela empresa."
          />
          <RewardCard detailed reward={data.reward} score={score} />
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Como sua nota é calculada"
            description="Cada indicador tem um peso diferente no score final."
          />
          <ScoreBreakdown factors={data.scoreFactors} />
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Evolução do score"
            description="Acompanhe a consistência, não apenas o número de hoje."
          />
          <ScoreTrend history={data.scoreHistory} />
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="O que ajustar na direção"
            description="Eventos que reduziram pontos e como melhorar."
          />
          {data.roadEvents.length > 0 ? (
            <Card style={styles.eventList}>
              {data.roadEvents.map((event, index) => (
                <RoadEventRow
                  event={event}
                  key={event.type}
                  last={index === data.roadEvents.length - 1}
                />
              ))}
            </Card>
          ) : (
            <Card style={styles.successCard}>
              <View style={styles.successIcon}>
                <Ionicons name="shield-checkmark" size={24} color={colors.success} />
              </View>
              <View style={styles.performanceCopy}>
                <Text variant="titleMd">Nenhum evento no período</Text>
                <Text variant="labelMd" tone="variant">
                  Continue mantendo distância, velocidade e pausas regulares.
                </Text>
              </View>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Documentos e cadastro"
            description="Dados vinculados ao seu perfil."
          />

          <InfoGroup icon="card-outline" title="Habilitação">
            <DataRow
              label="Categoria"
              value={`${data.cnhCategory}${data.cnhEar ? " · EAR" : ""}`}
            />
            <DataRow label="Número" value={data.cnhNumber} />
            <DataRow
              alert={cnhDays <= 60}
              label="Validade"
              value={`${formatDate(data.cnhExpiresAt)} · ${cnhDays} dias`}
            />
            <DataRow
              alert={data.cnhPoints >= 20}
              label="Pontos"
              value={`${data.cnhPoints} de 40`}
              last
            />
          </InfoGroup>

          <InfoGroup icon="briefcase-outline" title="Dados profissionais">
            <DataRow label="Admissão" value={formatDate(data.hiredAt)} />
            <DataRow label="Vínculo" value={data.contractType} />
            <DataRow label="Telefone" value={data.phone} />
            <DataRow label="Base" value={`${data.city}/${data.state}`} last />
          </InfoGroup>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Aparência"
            description="Escuro para dirigir à noite, claro para o pátio ao sol."
          />
          <ThemePicker />
        </View>

        <Button label="Sair da conta" variant="ghost" onPress={() => setLogoutDialogOpen(true)} />
      </SheetScreen>

      {logoutDialogOpen ? (
        <View accessibilityViewIsModal accessibilityRole="alert" style={styles.dialogBackdrop}>
          <View style={styles.dialog}>
            <View style={styles.dialogCopy}>
              <View style={styles.dialogIcon}>
                <Ionicons name="log-out-outline" size={24} color={colors.error} />
              </View>
              <Text variant="titleMd" style={styles.dialogTitle}>
                Sair da conta
              </Text>
              <Text variant="labelMd" tone="variant" style={styles.dialogMessage}>
                Você vai precisar entrar de novo para registrar a jornada.
              </Text>
            </View>

            <View style={styles.dialogActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setLogoutDialogOpen(false)}
                style={({ pressed }) => [styles.dialogAction, pressed && styles.dialogPressed]}
              >
                <Text variant="labelMd" tone="accent" style={styles.dialogActionLabel}>
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={logout}
                style={({ pressed }) => [
                  styles.dialogAction,
                  styles.dialogActionDivider,
                  pressed && styles.dialogPressed,
                ]}
              >
                <Text variant="labelMd" tone="error" style={styles.dialogActionLabel}>
                  Sair
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={stylesStatic.fact}>
      <Text variant="overline" tone="muted">
        {label}
      </Text>
      <Text variant="metricMd">{value}</Text>
    </View>
  );
}

function RoadEventRow({ event, last }: { event: RoadEventCount; last: boolean }) {
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const trend =
    event.delta < 0
      ? `${Math.abs(event.delta)} a menos que no mês passado`
      : event.delta > 0
        ? `${event.delta} a mais que no mês passado`
        : "Mesmo total do mês passado";

  return (
    <View style={[styles.eventRow, !last && styles.rowDivider]}>
      <View style={styles.eventHead}>
        <View style={styles.eventIcon}>
          <Ionicons color={colors.warning} name={EVENT_ICON[event.type]} size={21} />
        </View>
        <View style={styles.eventCopy}>
          <Text variant="labelMd">{event.label}</Text>
          <Text variant="labelSm" tone="muted" tabular>
            {event.count} {event.count === 1 ? "ocorrência" : "ocorrências"} · {trend}
          </Text>
        </View>
        <Chip
          label={`${event.scoreImpact > 0 ? "+" : ""}${event.scoreImpact} ${Math.abs(event.scoreImpact) === 1 ? "pt" : "pts"}`}
          tone={event.scoreImpact < 0 ? "critical" : "positive"}
        />
      </View>
      <View style={styles.guidance}>
        <Ionicons color={colors.info} name="bulb-outline" size={17} />
        <Text variant="labelMd" tone="variant" style={styles.eventCopy}>
          {event.guidance}
        </Text>
      </View>
    </View>
  );
}

function InfoGroup({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
}) {
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);

  return (
    <Card style={styles.infoGroup}>
      <View style={styles.infoHead}>
        <View style={styles.infoIcon}>
          <Ionicons color={colors.accent} name={icon} size={20} />
        </View>
        <Text variant="titleMd">{title}</Text>
      </View>
      <View>{children}</View>
    </Card>
  );
}

function DataRow({
  label,
  value,
  alert = false,
  last = false,
}: {
  label: string;
  value: string;
  alert?: boolean;
  last?: boolean;
}) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <Text variant="labelMd" tone="muted">
        {label}
      </Text>
      <Text variant="labelMd" tone={alert ? "error" : "default"} tabular style={styles.rowValue}>
        {value}
      </Text>
    </View>
  );
}

const stylesStatic = StyleSheet.create({ fact: { flex: 1, gap: 2 } });

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    root: { flex: 1 },
    avatar: {
      width: 50,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outlineStrong,
      backgroundColor: colors.heroSurface,
    },
    section: { gap: theme.space.md },
    performance: { gap: theme.space.lg },
    performanceMain: { flexDirection: "row", alignItems: "center", gap: theme.space.lg },
    performanceCopy: { flex: 1, gap: theme.space.xs },
    performanceMeta: { alignItems: "flex-start", gap: theme.space.sm },
    rankLine: { flexDirection: "row", alignItems: "center", gap: theme.space.xs },
    performanceFacts: {
      flexDirection: "row",
      gap: theme.space.md,
      paddingTop: theme.space.lg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.outline,
    },
    eventList: { paddingVertical: 0 },
    eventRow: { gap: theme.space.md, paddingVertical: theme.space.lg },
    eventHead: { flexDirection: "row", alignItems: "center", gap: theme.space.md },
    eventIcon: {
      width: 42,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radius.md,
      backgroundColor: colors.warningSoft,
    },
    eventCopy: { flex: 1, gap: 2 },
    guidance: {
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.space.sm,
      padding: theme.space.md,
      borderRadius: theme.radius.md,
      backgroundColor: colors.infoSoft,
    },
    successCard: { flexDirection: "row", alignItems: "center", gap: theme.space.md },
    successIcon: {
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radius.pill,
      backgroundColor: colors.successSoft,
    },
    infoGroup: { paddingVertical: 0 },
    infoHead: {
      minHeight: 64,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.space.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.outlineStrong,
    },
    infoIcon: {
      width: 38,
      height: 38,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radius.md,
      backgroundColor: colors.accentSoft,
    },
    row: {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.space.lg,
    },
    rowValue: { flexShrink: 1, textAlign: "right" },
    rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.outline },
    dialogBackdrop: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 100,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.space["2xl"],
      backgroundColor: "rgba(0, 0, 0, 0.58)",
    },
    dialog: {
      width: "100%",
      maxWidth: 300,
      overflow: "hidden",
      borderRadius: theme.radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outlineStrong,
      backgroundColor: colors.surface,
    },
    dialogCopy: {
      alignItems: "center",
      gap: theme.space.sm,
      paddingHorizontal: theme.space.lg,
      paddingTop: theme.space.xl,
      paddingBottom: theme.space.lg,
    },
    dialogIcon: {
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.space.xs,
      borderRadius: theme.radius.pill,
      backgroundColor: colors.errorSoft,
    },
    dialogTitle: { textAlign: "center" },
    dialogMessage: { textAlign: "center" },
    dialogActions: {
      minHeight: 50,
      flexDirection: "row",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.outlineStrong,
    },
    dialogAction: {
      minHeight: 50,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.space.md,
    },
    dialogActionDivider: {
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderLeftColor: colors.outlineStrong,
    },
    dialogActionLabel: { fontFamily: theme.fonts.semibold },
    dialogPressed: { backgroundColor: colors.surfaceSunken },
  });
