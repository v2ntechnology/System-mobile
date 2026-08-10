import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuroraBackdrop } from "@/components/aurora-backdrop";
import { Button, Field, Text } from "@/components/ui";
import { login } from "@/features/auth/api";
import { loginSchema, type LoginValues } from "@/features/auth/schema";
import { useAuthStore } from "@/features/auth/store";
import { theme } from "@/theme";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setSession = useAuthStore((state) => state.setSession);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setSubmitting(true);
    setFormError(null);
    try {
      const session = await login(values.email, values.password);
      setSession(session);
      router.replace("/(tabs)");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Não foi possível entrar. Tente de novo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.root}>
      <AuroraBackdrop />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.content, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 }]}
      >
        <View style={styles.header}>
          <Text variant="displayLg">RookHub</Text>
          <Text variant="bodyLg" tone="variant">
            App do motorista
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Field
                label="E-mail"
                shape="pill"
                placeholder="seu@email.com"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                inputMode="email"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={formState.errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Field
                label="Senha"
                shape="pill"
                placeholder="••••••••"
                secureTextEntry
                autoComplete="current-password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={formState.errors.password?.message}
              />
            )}
          />

          {formError ? (
            <Text tone="error" accessibilityRole="alert" variant="labelMd">
              {formError}
            </Text>
          ) : null}

          {/* Regra 5: autenticação usa o botão claro em pill. */}
          <Button
            label="Entrar"
            variant="bright"
            shape="pill"
            loading={submitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        {__DEV__ ? (
          <View style={styles.dev}>
            {/* Some no build de produção, como o `DevCredentials` do painel. */}
            <Text variant="labelSm" tone="variant">
              Demonstração: motorista@rookhub.com · senha rookhub123
            </Text>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1, paddingHorizontal: theme.space.xl, justifyContent: "space-between" },
  header: { gap: theme.space.sm },
  form: { gap: theme.space.lg },
  dev: { alignItems: "center", paddingTop: theme.space.xl },
});
