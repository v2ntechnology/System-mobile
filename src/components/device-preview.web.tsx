import type { ReactNode } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { useScreenScheme } from "@/theme";
import { darkScheme, lightScheme } from "@/theme/tokens";

interface Props {
  children: ReactNode;
}

const SCREEN_WIDTH = 393;
const SCREEN_HEIGHT = 852;
const FRAME_SIZE = 12;
const DESKTOP_GUTTER = 32;
const FULL_SCREEN_BREAKPOINT = 520;
const HOME_INDICATOR_WIDTH = 124;

/**
 * Moldura funcional do preview web.
 *
 * O conteúdo continua sendo o app React Native real, sem iframe nem captura de
 * tela. A moldura apenas limita o viewport visual no computador; em uma janela
 * estreita o preview volta a ocupar a tela inteira.
 *
 * A área do notch e a do indicador seguem o esquema que a tela está mostrando,
 * como aconteceria no aparelho — no aparelho quem pinta essas faixas é o app,
 * não o hardware. Já chassi, ilha, câmera e botões são peça física: continuam
 * escuros em qualquer tema, e a mesa em volta idem.
 */
export function DevicePreview({ children }: Props) {
  const window = useWindowDimensions();
  const scheme = useScreenScheme();
  const screen = scheme === "light" ? lightScheme : darkScheme;

  if (window.width <= FULL_SCREEN_BREAKPOINT) return <>{children}</>;

  const availableWidth = window.width - DESKTOP_GUTTER * 2 - FRAME_SIZE * 2;
  const availableHeight = window.height - DESKTOP_GUTTER * 2 - FRAME_SIZE * 2;
  const screenWidth = Math.min(
    SCREEN_WIDTH,
    availableWidth,
    availableHeight * (SCREEN_WIDTH / SCREEN_HEIGHT),
  );
  const screenHeight = screenWidth * (SCREEN_HEIGHT / SCREEN_WIDTH);
  const frameWidth = screenWidth + FRAME_SIZE * 2;
  const frameHeight = screenHeight + FRAME_SIZE * 2;

  return (
    <View style={styles.canvas}>
      <View style={[styles.device, { width: frameWidth, height: frameHeight }]}>
        <View
          style={[
            styles.screen,
            { width: screenWidth, height: screenHeight, backgroundColor: screen.background },
          ]}
        >
          {children}
        </View>

        <View
          style={[styles.dynamicIsland, { left: (frameWidth - styles.dynamicIsland.width) / 2 }]}
        >
          <View style={styles.camera} />
        </View>
        <View
          style={[
            styles.homeIndicator,
            { left: (frameWidth - HOME_INDICATOR_WIDTH) / 2, backgroundColor: screen.onSurface },
          ]}
        />

        <View style={[styles.sideButton, styles.silentButton]} />
        <View style={[styles.sideButton, styles.volumeUpButton]} />
        <View style={[styles.sideButton, styles.volumeDownButton]} />
        <View style={[styles.sideButton, styles.powerButton]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: DESKTOP_GUTTER,
    /* Mesa mais clara que o aparelho: contra o preto do app, o chassi sumia. */
    backgroundColor: darkScheme.outline,
  },
  device: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    padding: FRAME_SIZE,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: darkScheme.outlineStrong,
    borderRadius: 58,
    backgroundColor: darkScheme.surfaceSunken,
    boxShadow: `0 28px 84px ${darkScheme.surfaceSunken}8c`,
  },
  screen: {
    overflow: "hidden",
    paddingTop: 36,
    paddingBottom: 22,
    borderRadius: 46,
  },
  dynamicIsland: {
    position: "absolute",
    top: FRAME_SIZE + 11,
    zIndex: 10,
    width: 118,
    height: 32,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 20,
    borderRadius: 999,
    backgroundColor: darkScheme.surfaceSunken,
    pointerEvents: "none",
  },
  camera: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: darkScheme.outlineStrong,
    backgroundColor: darkScheme.background,
  },
  homeIndicator: {
    position: "absolute",
    bottom: FRAME_SIZE + 7,
    zIndex: 10,
    width: HOME_INDICATOR_WIDTH,
    height: 5,
    borderRadius: 999,
    pointerEvents: "none",
  },
  sideButton: {
    position: "absolute",
    width: 4,
    borderRadius: 4,
    backgroundColor: darkScheme.outlineStrong,
    pointerEvents: "none",
  },
  silentButton: { left: -4, top: 126, height: 30 },
  volumeUpButton: { left: -4, top: 174, height: 58 },
  volumeDownButton: { left: -4, top: 244, height: 58 },
  powerButton: { right: -4, top: 190, height: 88 },
});
