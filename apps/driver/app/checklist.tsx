import type { DriverChecklistAnswer, DriverChecklistItem } from "@rookhub/types";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";

import { Button, Field, GlassCard, Screen, StateView, Text } from "@/components/ui";
import { getTemplate, submitChecklist } from "@/features/checklist/api";
import { getHome } from "@/features/journey/api";
import { HIT_TARGET, theme } from "@/theme";

type Answers = Record<string, DriverChecklistAnswer>;

export default function ChecklistScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Answers>({});

  const template = useQuery({ queryKey: ["checklist-template"], queryFn: getTemplate });
  const home = useQuery({ queryKey: ["driver-home"], queryFn: getHome });

  const items = useMemo(
    () => template.data?.sections.flatMap((section) => section.items) ?? [],
    [template.data],
  );

  const missingPhoto = items.filter(
    (item) =>
      item.requiresPhotoOnFail &&
      answers[item.id]?.result === "REPROVADO" &&
      !answers[item.id]?.photoUri,
  );
  const answeredAll = items.length > 0 && items.every((item) => answers[item.id]);

  const submit = useMutation({
    mutationFn: () =>
      submitChecklist({
        templateId: template.data!.id,
        templateVersion: template.data!.version,
        plate: home.data?.driver.currentVehiclePlate ?? "",
        tripId: home.data?.currentTrip?.id,
        // RN-054 — relógio do aparelho; o servidor carimba o dele na chegada.
        filledAt: new Date().toISOString(),
        answers: Object.values(answers),
      }),
    onSuccess: (receipt) => {
      void queryClient.invalidateQueries({ queryKey: ["driver-home"] });
      Alert.alert(
        receipt.result === "APROVADO" ? "Checklist aprovado" : "Checklist enviado",
        receipt.message,
        [{ text: "Entendi", onPress: () => router.back() }],
      );
    },
    onError: (error: Error) => Alert.alert("Não deu para enviar", error.message),
  });

  function setAnswer(itemId: string, patch: Partial<DriverChecklistAnswer>) {
    setAnswers((current) => ({
      ...current,
      [itemId]: { itemId, result: "APROVADO", ...current[itemId], ...patch },
    }));
  }

  async function attachPhoto(itemId: string) {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Câmera bloqueada",
        "Libere a câmera nas configurações do aparelho para anexar a foto do item reprovado.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    const asset = result.assets?.[0];
    if (!result.canceled && asset) setAnswer(itemId, { photoUri: asset.uri });
  }

  if (template.isPending || template.isError) {
    return (
      <Screen scroll={false}>
        <StateView
          loading={template.isPending}
          error={template.error}
          onRetry={() => void template.refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text tone="variant">
        {template.data.name} · {template.data.version} ·{" "}
        {home.data?.driver.currentVehiclePlate ?? "—"}
      </Text>

      {template.data.sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text variant="labelMd" tone="muted">
            {section.title.toUpperCase()}
          </Text>
          {section.items.map((item) => (
            <ChecklistRow
              key={item.id}
              item={item}
              answer={answers[item.id]}
              onResult={(result) => setAnswer(item.id, { result })}
              onNote={(note) => setAnswer(item.id, { note })}
              onPhoto={() => void attachPhoto(item.id)}
            />
          ))}
        </View>
      ))}

      {missingPhoto.length > 0 ? (
        <Text tone="warning" accessibilityRole="alert">
          {/* RN-040 — reprovação sem foto não serve para a manutenção decidir nada. */}
          Anexe a foto dos itens reprovados: {missingPhoto.map((item) => item.label).join(", ")}.
        </Text>
      ) : null}

      <Button
        label="Enviar checklist"
        loading={submit.isPending}
        disabled={!answeredAll || missingPhoto.length > 0}
        onPress={() => submit.mutate()}
      />
      {!answeredAll ? (
        <Text variant="labelSm" tone="muted" style={styles.hint}>
          Responda todos os {items.length} itens para enviar.
        </Text>
      ) : null}
    </Screen>
  );
}

interface RowProps {
  item: DriverChecklistItem;
  answer?: DriverChecklistAnswer;
  onResult: (result: "APROVADO" | "REPROVADO") => void;
  onNote: (note: string) => void;
  onPhoto: () => void;
}

function ChecklistRow({ item, answer, onResult, onNote, onPhoto }: RowProps) {
  const failed = answer?.result === "REPROVADO";

  return (
    <GlassCard style={styles.item}>
      <View style={styles.itemHead}>
        <View style={styles.itemLabel}>
          <Text variant="bodyMd">{item.label}</Text>
          {item.hint ? (
            <Text variant="labelSm" tone="muted">
              {item.hint}
            </Text>
          ) : null}
          {item.blocking ? (
            <Text variant="labelSm" tone="variant">
              Reprovar bloqueia a saída
            </Text>
          ) : null}
        </View>

        {/* Dois alvos grandes, lado a lado: decisão de uma mão só, de luva. */}
        <View style={styles.choices}>
          <Choice
            icon="checkmark"
            label={`Aprovar ${item.label}`}
            active={answer?.result === "APROVADO"}
            activeColor={theme.colors.success}
            onPress={() => onResult("APROVADO")}
          />
          <Choice
            icon="close"
            label={`Reprovar ${item.label}`}
            active={failed}
            activeColor={theme.colors.error}
            onPress={() => onResult("REPROVADO")}
          />
        </View>
      </View>

      {failed ? (
        <View style={styles.failure}>
          <Field
            label="Observação"
            placeholder="O que está errado?"
            multiline
            value={answer?.note ?? ""}
            onChangeText={onNote}
          />
          {item.requiresPhotoOnFail ? (
            answer?.photoUri ? (
              <View style={styles.photoRow}>
                <Image source={{ uri: answer.photoUri }} style={styles.photo} />
                <Button label="Trocar foto" variant="ghost" onPress={onPhoto} />
              </View>
            ) : (
              <Button label="Anexar foto" variant="ghost" onPress={onPhoto} />
            )
          ) : null}
        </View>
      ) : null}
    </GlassCard>
  );
}

function Choice({
  icon,
  label,
  active,
  activeColor,
  onPress,
}: {
  icon: "checkmark" | "close";
  label: string;
  active: boolean;
  activeColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[
        styles.choice,
        active && { backgroundColor: `${activeColor}26`, borderColor: activeColor },
      ]}
    >
      <Ionicons name={icon} size={22} color={active ? activeColor : theme.colors.onSurfaceMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { gap: theme.space.md },
  item: { gap: theme.space.md },
  itemHead: { flexDirection: "row", alignItems: "center", gap: theme.space.md },
  itemLabel: { flex: 1, gap: theme.space.xs },
  choices: { flexDirection: "row", gap: theme.space.sm },
  choice: {
    width: HIT_TARGET,
    height: HIT_TARGET,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.outlineVariant,
    backgroundColor: theme.colors.surfaceLowest,
  },
  failure: { gap: theme.space.md },
  photoRow: { flexDirection: "row", alignItems: "center", gap: theme.space.md },
  photo: { width: 64, height: 64, borderRadius: theme.radius.md },
  hint: { textAlign: "center" },
});
