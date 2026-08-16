import { useId, useState } from "react";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";

import { HIT_TARGET, theme, useColors, useThemedStyles, type Scheme } from "@/theme";

import { Text } from "./text";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  /** Mantém o label para leitor de tela, sem desenhá-lo (equivale ao `sr-only`). */
  hideLabel?: boolean;
  shape?: "pill" | "rounded";
}

export function Field({
  label,
  error,
  hideLabel,
  shape = "rounded",
  style,
  onFocus,
  onBlur,
  placeholderTextColor,
  ...rest
}: Props) {
  const id = useId();
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const [focused, setFocused] = useState(false);
  const errorId = `${id}-error`;

  return (
    <View style={styles.wrapper}>
      {!hideLabel && (
        <Text variant="overline" tone="muted" nativeID={id}>
          {label}
        </Text>
      )}
      <TextInput
        {...rest}
        accessibilityLabel={label}
        aria-labelledby={hideLabel ? undefined : id}
        // Regra 9 do painel: erro anunciado, não apenas colorido.
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        placeholderTextColor={placeholderTextColor ?? colors.onSurfaceMuted}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          { borderRadius: shape === "pill" ? theme.radius.pill : theme.radius.md },
          focused && styles.focused,
          Boolean(error) && styles.invalid,
          style,
        ]}
      />
      {error ? (
        <Text variant="labelSm" tone="error" nativeID={errorId} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    wrapper: { gap: theme.space.sm },
    /* Poço: o campo é a superfície recuada, um degrau abaixo do card que o cerca. */
    input: {
      backgroundColor: colors.surfaceSunken,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outlineStrong,
      color: colors.onSurface,
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      minHeight: HIT_TARGET,
      paddingHorizontal: theme.space.lg,
    },
    focused: { borderColor: colors.accent, borderWidth: 2 },
    invalid: { borderColor: colors.error, borderWidth: 2 },
  });
