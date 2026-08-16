import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Text } from "@/components/ui";
import { useColors } from "@/theme";

interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  textColor?: string;
  caption?: string;
}

/** Score numérico acompanhado de uma forma; o desempenho nunca depende só da cor. */
export function ScoreRing({
  score,
  size = 88,
  strokeWidth = 8,
  color,
  trackColor,
  textColor,
  caption,
}: Props) {
  const colors = useColors();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(score, 100));

  return (
    <View
      accessibilityLabel={`Score ${score} de 100`}
      style={[styles.root, { width: size, height: size }]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={trackColor ?? colors.surfaceSunken}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={color ?? colors.accentSolid}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - progress / 100)}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View style={[styles.copy, styles.pointerNone]}>
        {/* `{ color: undefined }` não é ignorado: o `flattenStyle` do React Native
            copia a chave por cima da cor do tema e o texto cai no preto padrão da
            plataforma — invisível no escuro. Sem cor explícita, quem manda é o
            tom do próprio `Text`. */}
        <Text
          variant={size >= 86 ? "metricLg" : "metricMd"}
          style={textColor ? { color: textColor } : undefined}
        >
          {score}
        </Text>
        {caption ? (
          <Text tone="muted" variant="labelSm" style={textColor ? { color: textColor } : undefined}>
            {caption}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", justifyContent: "center" },
  copy: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  pointerNone: { pointerEvents: "none" },
});
