import { useMemo, useState } from "react";
import { Image, StyleSheet, View, type LayoutChangeEvent } from "react-native";
import Svg, { Circle, Polyline } from "react-native-svg";

import { Text } from "@/components/ui";
import { theme, useTheme, type SchemeName } from "@/theme";
import type { DriverRouteSnapshot, RoutePoint } from "@/types";

export interface RouteMapCanvasProps {
  route: DriverRouteSnapshot;
  height?: number;
}

/** Lado do tile raster no zoom em que ele é servido. */
const TILE_SIZE = 256;
const MIN_ZOOM = 3;
const MAX_ZOOM = 15;
/** Folga entre o traçado e a borda do quadro, para o percurso não encostar. */
const EDGE_PADDING = 26;

/**
 * Basemap raster escolhido pelo esquema em uso: o mapa acompanha o tema do app
 * em vez de brilhar branco na cabine à noite.
 */
const BASEMAP: Record<SchemeName, string> = { dark: "dark_all", light: "light_all" };

interface WorldPoint {
  x: number;
  y: number;
}

function tileUrl(style: string, zoom: number, x: number, y: number): string {
  return `https://basemaps.cartocdn.com/${style}/${zoom}/${x}/${y}@2x.png`;
}

/** Web Mercator: a mesma conta que os tiles usam, então traçado e mapa casam. */
function project(point: RoutePoint, zoom: number): WorldPoint {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLatitude = Math.sin((point.latitude * Math.PI) / 180);

  return {
    x: ((point.longitude + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale,
  };
}

function span(values: number[]): { min: number; max: number } {
  return { min: Math.min(...values), max: Math.max(...values) };
}

/** Maior zoom inteiro em que a viagem inteira ainda cabe no quadro. */
function zoomToFit(path: RoutePoint[], width: number, height: number): number {
  const usableWidth = Math.max(1, width - EDGE_PADDING * 2);
  const usableHeight = Math.max(1, height - EDGE_PADDING * 2);

  for (let zoom = MAX_ZOOM; zoom > MIN_ZOOM; zoom -= 1) {
    const points = path.map((point) => project(point, zoom));
    const horizontal = span(points.map((point) => point.x));
    const vertical = span(points.map((point) => point.y));

    if (
      horizontal.max - horizontal.min <= usableWidth &&
      vertical.max - vertical.min <= usableHeight
    ) {
      return zoom;
    }
  }

  return MIN_ZOOM;
}

interface Viewport {
  zoom: number;
  originX: number;
  originY: number;
  tiles: { key: string; uri: string; left: number; top: number }[];
}

function viewportFor(
  route: DriverRouteSnapshot,
  style: string,
  width: number,
  height: number,
): Viewport {
  const zoom = zoomToFit(route.path, width, height);
  const points = route.path.map((point) => project(point, zoom));
  const horizontal = span(points.map((point) => point.x));
  const vertical = span(points.map((point) => point.y));

  // Origem inteira: com deslocamento fracionário os tiles vizinhos caem em meio
  // pixel e aparece uma costura clara na emenda. O traçado usa a mesma origem,
  // então arredondar aqui não desalinha rota e mapa.
  const originX = Math.round((horizontal.min + horizontal.max) / 2 - width / 2);
  const originY = Math.round((vertical.min + vertical.max) / 2 - height / 2);

  const tileCount = 2 ** zoom;
  const tiles: Viewport["tiles"] = [];

  for (
    let x = Math.floor(originX / TILE_SIZE);
    x <= Math.floor((originX + width) / TILE_SIZE);
    x += 1
  ) {
    for (
      let y = Math.floor(originY / TILE_SIZE);
      y <= Math.floor((originY + height) / TILE_SIZE);
      y += 1
    ) {
      if (y < 0 || y >= tileCount) continue;
      const wrappedX = ((x % tileCount) + tileCount) % tileCount;

      tiles.push({
        key: `${zoom}/${x}/${y}`,
        uri: tileUrl(style, zoom, wrappedX, y),
        left: x * TILE_SIZE - originX,
        top: y * TILE_SIZE - originY,
      });
    }
  }

  return { zoom, originX, originY, tiles };
}

/**
 * Mapa da rota, idêntico no Android, no iOS e no preview web.
 *
 * O quadro é estático por decisão de produto — o motorista confere o percurso de
 * relance e navega no aplicativo dele pelo botão "Abrir rota". Por isso o mapa é
 * uma malha de tiles raster com o traçado desenhado por cima em SVG: as duas
 * camadas usam a mesma projeção e as mesmas bibliotecas nas três plataformas,
 * então o preview no computador mostra exatamente o que sai no aparelho.
 */
export function RouteMapCanvas({ route, height = 190 }: RouteMapCanvasProps) {
  const { colors, scheme } = useTheme();
  const [width, setWidth] = useState(0);

  const viewport = useMemo(
    () => (width > 0 ? viewportFor(route, BASEMAP[scheme], width, height) : null),
    [route, scheme, width, height],
  );

  function measure(event: LayoutChangeEvent) {
    setWidth(Math.round(event.nativeEvent.layout.width));
  }

  const points = viewport
    ? route.path.map((point) => {
        const world = project(point, viewport.zoom);
        return `${world.x - viewport.originX},${world.y - viewport.originY}`;
      })
    : [];

  function place(point: RoutePoint): WorldPoint {
    const world = project(point, viewport?.zoom ?? MIN_ZOOM);
    return { x: world.x - (viewport?.originX ?? 0), y: world.y - (viewport?.originY ?? 0) };
  }

  const origin = place(route.origin);
  const destination = place(route.destination);
  const current = place(route.currentPosition);

  return (
    <View
      accessibilityLabel={`Mapa da rota atual, velocidade ${route.speedKph} quilômetros por hora`}
      onLayout={measure}
      style={[styles.root, { height, backgroundColor: colors.surfaceSunken }]}
    >
      {viewport?.tiles.map((tile) => (
        <Image
          key={tile.key}
          source={{ uri: tile.uri }}
          style={[styles.tile, { left: tile.left, top: tile.top }]}
        />
      ))}

      {viewport ? (
        <Svg height={height} style={StyleSheet.absoluteFill} width={width}>
          <Polyline
            fill="none"
            points={points.join(" ")}
            stroke={`${colors.secondary}40`}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="11"
          />
          <Polyline
            fill="none"
            points={points.join(" ")}
            stroke={colors.secondary}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />

          <Circle
            cx={origin.x}
            cy={origin.y}
            fill={colors.surface}
            r="6"
            stroke={colors.onSurfaceMuted}
            strokeWidth="3"
          />
          <Circle
            cx={destination.x}
            cy={destination.y}
            fill={colors.accentSolid}
            r="7"
            stroke={colors.surface}
            strokeWidth="2"
          />
          <Circle cx={current.x} cy={current.y} fill={`${colors.accentSolid}30`} r="15" />
          <Circle
            cx={current.x}
            cy={current.y}
            fill={colors.accentSolid}
            r="7"
            stroke={colors.surface}
            strokeWidth="3"
          />
        </Svg>
      ) : null}

      <View style={[styles.credit, { backgroundColor: colors.surface }]}>
        <Text variant="overline" tone="muted">
          © OpenStreetMap · CARTO
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: "100%", overflow: "hidden" },
  tile: { position: "absolute", width: TILE_SIZE, height: TILE_SIZE },
  credit: {
    position: "absolute",
    left: theme.space.sm,
    bottom: theme.space.sm,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    opacity: 0.86,
  },
});
