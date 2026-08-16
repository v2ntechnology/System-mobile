import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState, type ComponentProps, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type TextInputProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RookhubMark } from "@/components/brand/rookhub-mark";
import { Button, Field, Text } from "@/components/ui";
import { login } from "@/features/auth/api";
import { loginSchema, type LoginValues } from "@/features/auth/schema";
import { useAuthStore } from "@/features/auth/store";
import { ForceScheme, theme, useColors, useThemedStyles, type Scheme } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface AuthFieldProps extends TextInputProps {
  label: string;
  error?: string;
  icon: IconName;
  trailing?: ReactNode;
}

function AuthField({ label, error, icon, trailing, style, ...props }: AuthFieldProps) {
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.authField}>
      <Text variant="overline" tone="muted" style={styles.fieldLabel}>
        {label}
      </Text>

      <View style={styles.inputWrap}>
        <View style={styles.leadingIcon}>
          <Ionicons color={colors.onSurfaceMuted} name={icon} size={19} />
        </View>

        <Field
          {...props}
          error={error}
          hideLabel
          label={label}
          /* Dica mais leve que o texto digitado: no claro o cinza médio do resto
             do app competia com o valor que o motorista acabou de escrever. */
          placeholderTextColor={colors.onSurfaceFaint}
          shape="pill"
          style={[styles.authInput, trailing ? styles.authInputWithTrailing : null, style]}
        />

        {trailing ? <View style={styles.trailingIcon}>{trailing}</View> : null}
      </View>
    </View>
  );
}

/**
 * Entrada sempre no claro.
 *
 * É a única tela que alguém de fora da operação vê — gestor avaliando o produto,
 * motorista no primeiro dia. Clara ela lê como documento assinado, e não muda de
 * cara conforme o aparelho de quem abriu.
 */
export default function LoginScreen() {
  return (
    <ForceScheme scheme="light">
      <StatusBar style="dark" />
      <LoginForm />
    </ForceScheme>
  );
}

function LoginForm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const setSession = useAuthStore((state) => state.setSession);

  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, formState, setValue, clearErrors } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setSubmitting(true);
    setFormError(null);
    try {
      const session = await login(values.email, values.password);
      setSession(session);
      router.replace("/");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Não foi possível entrar. Tente de novo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemoCredentials() {
    setFormError(null);
    clearErrors();
    setValue("email", "motorista@rookhub.com", { shouldDirty: true, shouldValidate: true });
    setValue("password", "rookhub123", { shouldDirty: true, shouldValidate: true });
  }

  // O gradiente cobre o topo da tela inteira e se dissolve no fundo, sem bloco:
  // a altura acompanha o aparelho para a marca ficar centrada na área colorida.
  const spectrumHeight = Math.max(300, height * 0.4);

  return (
    <View style={styles.root}>
      <View style={[styles.backdrop, { height: spectrumHeight }]}>
        {/* Trecho azul do Spectrum: o violeta das primeiras paradas é da marca,
            não deste produto — o app do motorista é azul. */}
        <LinearGradient
          colors={[theme.spectrumStops[3], theme.spectrumStops[4], theme.spectrumStops[5]]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["transparent", colors.background]}
          locations={[0.42, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + theme.space.lg,
              paddingBottom: insets.bottom + theme.space.xl,
            },
          ]}
          contentInsetAdjustmentBehavior="never"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.shell}>
            <View style={[styles.brand, { height: spectrumHeight * 0.72 }]}>
              <RookhubMark height={54} />
              <View style={styles.brandCopy}>
                <Text tone="onAccent" variant="labelMd" style={styles.brandName}>
                  ROOKHUB
                </Text>
                <Text tone="onAccent" variant="labelSm" style={styles.brandProduct}>
                  APP DO MOTORISTA
                </Text>
              </View>
            </View>

            <View style={styles.body}>
              <View style={styles.form}>
                {formError ? (
                  <View accessibilityRole="alert" style={styles.errorAlert}>
                    <Ionicons color={colors.error} name="alert-circle-outline" size={20} />
                    <Text tone="error" variant="labelMd" style={styles.errorText}>
                      {formError}
                    </Text>
                  </View>
                ) : null}

                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <AuthField
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect={false}
                      editable={!submitting}
                      error={formState.errors.email?.message}
                      icon="mail-outline"
                      inputMode="email"
                      keyboardType="email-address"
                      label="E-mail"
                      onBlur={field.onBlur}
                      onChangeText={field.onChange}
                      placeholder="nome@empresa.com.br"
                      value={field.value}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <AuthField
                      autoCapitalize="none"
                      autoComplete="current-password"
                      autoCorrect={false}
                      editable={!submitting}
                      error={formState.errors.password?.message}
                      icon="lock-closed-outline"
                      label="Senha"
                      onBlur={field.onBlur}
                      onChangeText={field.onChange}
                      onSubmitEditing={handleSubmit(onSubmit)}
                      placeholder="Digite sua senha"
                      returnKeyType="go"
                      secureTextEntry={!showPassword}
                      textContentType="password"
                      trailing={
                        <Pressable
                          accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
                          accessibilityRole="button"
                          hitSlop={8}
                          onPress={() => setShowPassword((current) => !current)}
                          style={({ pressed }) => [
                            styles.iconButton,
                            pressed && styles.iconButtonPressed,
                          ]}
                        >
                          <Ionicons
                            color={colors.onSurfaceMuted}
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                          />
                        </Pressable>
                      }
                      value={field.value}
                    />
                  )}
                />

                <Button
                  label="Entrar"
                  loading={submitting}
                  onPress={handleSubmit(onSubmit)}
                  shape="pill"
                  style={styles.submit}
                />
              </View>

              {__DEV__ ? (
                <Pressable
                  accessibilityHint="Preenche o e-mail e a senha de demonstração"
                  accessibilityRole="button"
                  disabled={submitting}
                  onPress={fillDemoCredentials}
                  style={({ pressed }) => [
                    styles.demo,
                    pressed && styles.demoPressed,
                    submitting && styles.demoDisabled,
                  ]}
                >
                  <Ionicons color={colors.accent} name="sparkles-outline" size={20} />
                  <View style={styles.demoCopy}>
                    <Text variant="labelMd">Usar conta de demonstração</Text>
                    <Text tone="muted" variant="labelSm">
                      Preenche as credenciais automaticamente
                    </Text>
                  </View>
                  <Ionicons color={colors.onSurfaceMuted} name="chevron-forward" size={18} />
                </Pressable>
              ) : null}
            </View>

            <Text tone="muted" variant="labelSm" style={styles.footer}>
              © 2026 RookHub · Gestão inteligente de frotas
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    keyboard: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingHorizontal: theme.space.xl },
    backdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      overflow: "hidden",
      pointerEvents: "none",
    },
    shell: { flexGrow: 1, width: "100%", maxWidth: 520, alignSelf: "center" },
    brand: { alignItems: "center", justifyContent: "center", gap: theme.space.md },
    brandCopy: { alignItems: "center" },
    brandName: { fontFamily: theme.fonts.bold, letterSpacing: 2.4 },
    brandProduct: { marginTop: 2, opacity: 0.82, letterSpacing: 1.2 },
    // Cresce até o rodapé sem comprimir os campos com o teclado aberto; o formulário
    // fica logo abaixo da marca e a folga sobrante cai antes do rodapé.
    body: { flexGrow: 1, paddingTop: theme.space.md, paddingBottom: theme.space.xl },
    form: { gap: 18 },
    authField: { gap: theme.space.sm },
    fieldLabel: { paddingHorizontal: theme.space.xs },
    inputWrap: { position: "relative" },
    authInput: {
      width: "100%",
      minHeight: 54,
      paddingLeft: 48,
      backgroundColor: colors.surface,
    },
    authInputWithTrailing: { paddingRight: 52 },
    leadingIcon: { position: "absolute", zIndex: 2, left: 18, top: 18, pointerEvents: "none" },
    trailingIcon: { position: "absolute", zIndex: 2, top: 7, right: 8 },
    iconButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radius.pill,
    },
    iconButtonPressed: { backgroundColor: colors.surfaceSunken },
    errorAlert: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.space.sm,
      padding: theme.space.md,
      borderRadius: theme.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.error,
      backgroundColor: colors.errorSoft,
    },
    errorText: { flex: 1 },
    submit: { minHeight: 56, marginTop: theme.space.xs },
    demo: {
      minHeight: 58,
      marginTop: theme.space.xl,
      paddingHorizontal: theme.space.md,
      paddingVertical: theme.space.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.space.md,
      borderRadius: theme.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outline,
      backgroundColor: colors.surface,
    },
    demoPressed: { borderColor: colors.outlineStrong, backgroundColor: colors.surfaceSunken },
    demoDisabled: { opacity: 0.5 },
    demoCopy: { flex: 1, gap: 2 },
    footer: { textAlign: "center" },
  });
