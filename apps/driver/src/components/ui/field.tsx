import { useId, useState } from "react";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";

import { HIT_TARGET, theme } from "@/theme";

import { Text } from "./text";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  /** Mantém o label para leitor de tela, sem desenhá-lo (equivale ao `sr-only`). */
  hideLabel?: boolean;
  shape?: "pill" | "rounded";
}

export function Field({ label, error, hideLabel, shape = "rounded", style, ...rest }: Props) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const errorId = `${id}-error`;

  return (
    <View style={styles.wrapper}>
      {!hideLabel && (
        <Text variant="labelMd" tone="variant" nativeID={id}>
          {label}
        </Text>
      )}
      <TextInput
        accessibilityLabel={label}
        aria-labelledby={hideLabel ? undefined : id}
        // Regra 9 do painel: erro anunciado, não apenas colorido.
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        placeholderTextColor={theme.colors.onSurfaceMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          { borderRadius: shape === "pill" ? theme.radius.pill : theme.radius.md },
          focused && styles.focused,
          Boolean(error) && styles.invalid,
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text variant="labelSm" tone="error" nativeID={errorId} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: theme.space.sm },
  input: {
    // Poço: campo é área recuada, uma camada abaixo do fundo (regra 1).
    backgroundColor: theme.colors.surfaceLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.outlineVariant,
    color: theme.colors.onSurface,
    fontSize: 16,
    minHeight: HIT_TARGET,
    paddingHorizontal: theme.space.lg,
  },
  focused: { borderColor: theme.colors.secondary, borderWidth: 2 },
  invalid: { borderColor: theme.colors.error, borderWidth: 2 },
});
