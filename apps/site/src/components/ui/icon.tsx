// O tipo vive só na entrada padrão; sendo `import type`, ele é apagado na
// compilação e não arrasta o pacote cliente para dentro do server component.
import type { IconProps } from "@phosphor-icons/react";
import {
  ChartLineUp,
  ClipboardText,
  Lock,
  MagnifyingGlass,
  Path,
  ShieldCheck,
  Sparkle,
  SteeringWheel,
  Truck,
  Wrench,
} from "@phosphor-icons/react/ssr";

/**
 * Registro de ícones usados por dado — módulo, valor da empresa.
 *
 * Existe porque o mock entrega o ícone como string (é o que a API vai devolver)
 * e um `Record` explícito é o que impede isso de virar acesso dinâmico a um
 * namespace inteiro: só entra aqui o ícone que alguma tela realmente usa, e o
 * bundle não carrega as outras mil.
 *
 * `/ssr` e não a entrada padrão: os componentes desta pasta são server components
 * e a entrada padrão do Phosphor depende de contexto do React no cliente.
 */
const registry = {
  ChartLineUp,
  ClipboardText,
  Lock,
  MagnifyingGlass,
  Path,
  ShieldCheck,
  Sparkle,
  SteeringWheel,
  Truck,
  Wrench,
} as const;

export interface IconProps_ extends Omit<IconProps, "ref"> {
  /** Nome vindo do dado. Nome desconhecido não renderiza nada — nunca quebra a página. */
  name: string;
}

export function Icon({ name, weight = "duotone", ...props }: IconProps_) {
  const Component = registry[name as keyof typeof registry];
  if (!Component) return null;
  return <Component weight={weight} {...props} />;
}
