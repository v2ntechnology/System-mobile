import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { Spinner } from "@rookhub/ui";

import { AppLayout } from "@/components/layout/app-layout";
import { useSession } from "@/features/auth/store";

import { ProtectedRoute } from "./protected-route";
import { RoleRoute } from "./role-route";

// FE-04 — code-splitting por rota.
const LoginPage = lazy(() =>
  import("@/features/auth/pages/login-page").then((m) => ({ default: m.LoginPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/forgot-password-page").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const DashboardPage = lazy(() =>
  import("@/features/dashboard/pages/dashboard-page").then((m) => ({ default: m.DashboardPage })),
);
const TrucksPage = lazy(() =>
  import("@/features/trucks/pages/trucks-page").then((m) => ({ default: m.TrucksPage })),
);
const DriversPage = lazy(() =>
  import("@/features/drivers/pages/drivers-page").then((m) => ({ default: m.DriversPage })),
);
const ReportsPage = lazy(() =>
  import("@/features/reports/pages/reports-page").then((m) => ({ default: m.ReportsPage })),
);
const ChecklistsPage = lazy(() =>
  import("@/features/checklists/pages/checklists-page").then((m) => ({
    default: m.ChecklistsPage,
  })),
);
const MaintenancePage = lazy(() =>
  import("@/features/maintenance/pages/maintenance-page").then((m) => ({
    default: m.MaintenancePage,
  })),
);
const SettingsPage = lazy(() =>
  import("@/features/settings/pages/settings-page").then((m) => ({ default: m.SettingsPage })),
);
const SafetyPage = lazy(() =>
  import("@/features/safety/pages/safety-page").then((m) => ({ default: m.SafetyPage })),
);
const TripsPage = lazy(() =>
  import("@/features/trips/pages/trips-page").then((m) => ({ default: m.TripsPage })),
);
const CostsPage = lazy(() =>
  import("@/features/costs/pages/costs-page").then((m) => ({ default: m.CostsPage })),
);
const LiveMapPage = lazy(() =>
  import("@/features/live-map/pages/live-map-page").then((m) => ({ default: m.LiveMapPage })),
);
const NotificationsPage = lazy(() =>
  import("@/features/notifications/pages/notifications-page").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/not-found-page").then((m) => ({ default: m.NotFoundPage })),
);

/* Visão do dono — estratégica (RF-003). */
const OwnerHomePage = lazy(() =>
  import("@/features/owner/pages/owner-home-page").then((m) => ({ default: m.OwnerHomePage })),
);
const OwnerResultPage = lazy(() =>
  import("@/features/owner/pages/owner-result-page").then((m) => ({ default: m.OwnerResultPage })),
);
const OwnerPerformancePage = lazy(() =>
  import("@/features/owner/pages/owner-performance-page").then((m) => ({
    default: m.OwnerPerformancePage,
  })),
);
const OwnerApprovalsPage = lazy(() =>
  import("@/features/owner/pages/owner-approvals-page").then((m) => ({
    default: m.OwnerApprovalsPage,
  })),
);

/* Visão do gestor — operacional e liberações (RF-003). */
const ManagerHomePage = lazy(() =>
  import("@/features/manager/pages/manager-home-page").then((m) => ({
    default: m.ManagerHomePage,
  })),
);
const ReleasesPage = lazy(() =>
  import("@/features/manager/pages/releases-page").then((m) => ({ default: m.ReleasesPage })),
);
const DiagnosesPage = lazy(() =>
  import("@/features/manager/pages/diagnoses-page").then((m) => ({ default: m.DiagnosesPage })),
);

/* Visão do operador — lançamento e pátio (RF-003). */
const OperatorHomePage = lazy(() =>
  import("@/features/operator/pages/operator-home-page").then((m) => ({
    default: m.OperatorHomePage,
  })),
);
const EntriesPage = lazy(() =>
  import("@/features/operator/pages/entries-page").then((m) => ({ default: m.EntriesPage })),
);
const TriagePage = lazy(() =>
  import("@/features/operator/pages/triage-page").then((m) => ({ default: m.TriagePage })),
);

/* Portal de entrada e assistente em tela cheia — exclusivos do dono (RF-003). */
const PortalPage = lazy(() =>
  import("@/features/portal/pages/portal-page").then((m) => ({ default: m.PortalPage })),
);
const AssistantPage = lazy(() =>
  import("@/features/assistant/pages/assistant-page").then((m) => ({ default: m.AssistantPage })),
);
const BillingPage = lazy(() =>
  import("@/features/billing/pages/billing-page").then((m) => ({ default: m.BillingPage })),
);
const TeamPage = lazy(() =>
  import("@/features/team/pages/team-page").then((m) => ({ default: m.TeamPage })),
);
const ExtensionsPage = lazy(() =>
  import("@/features/extensions/pages/extensions-page").then((m) => ({
    default: m.ExtensionsPage,
  })),
);

function RouteFallback() {
  return (
    <div className="text-on-surface-muted flex min-h-dvh items-center justify-center">
      <Spinner className="size-6" />
    </div>
  );
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

/**
 * A home de `/app` depende do papel.
 *
 * O dono abre no resultado consolidado, o gestor na prontidão da operação e o
 * operador no pátio. É a mesma URL de propósito: link salvo, favorito e
 * redirecionamento de login continuam valendo para todo mundo.
 *
 * `MAINTENANCE` ainda cai no painel do hub, até a tela própria dele existir.
 */
function RoleHome() {
  const role = useSession()?.user.role;

  if (role === "OWNER") return <OwnerHomePage />;
  if (role === "MANAGER" || role === "SUPER_ADMIN") return <ManagerHomePage />;
  if (role === "OPERATOR") return <OperatorHomePage />;
  return <DashboardPage />;
}

/**
 * A raiz também respeita o portal do dono.
 *
 * Sem isto, abrir `rookhub.com` num favorito pularia a escolha entre IA e
 * gestão — o portal só apareceria no login, o que faria dele um acidente do
 * fluxo em vez de uma porta de entrada.
 */
function RootRedirect() {
  const role = useSession()?.user.role;
  return <Navigate to={role === "OWNER" ? "/portal" : "/app"} replace />;
}

export const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  { path: "/login", element: withSuspense(<LoginPage />) },
  { path: "/esqueci-minha-senha", element: withSuspense(<ForgotPasswordPage />) },

  /*
   * Portal fora de `/app`: é antessala, não painel. Entrar nele com a topbar e
   * a navegação do painel já seria "ter entrado na gestão".
   */
  {
    path: "/portal",
    element: (
      <ProtectedRoute>
        <RoleRoute allow={["OWNER"]}>{withSuspense(<PortalPage />)}</RoleRoute>
      </ProtectedRoute>
    ),
  },

  /*
   * A IA também fica fora de `/app`: quem escolheu conversar não escolheu
   * navegar, e a topbar do painel em volta seria um convite a fazer outra coisa.
   */
  {
    path: "/ia",
    element: (
      <ProtectedRoute>
        <RoleRoute allow={["OWNER"]}>{withSuspense(<AssistantPage />)}</RoleRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<RoleHome />) },

      /* Telas exclusivas do proprietário. */
      {
        path: "resultado",
        element: withSuspense(
          <RoleRoute allow={["OWNER"]}>
            <OwnerResultPage />
          </RoleRoute>,
        ),
      },
      {
        path: "desempenho",
        element: withSuspense(
          <RoleRoute allow={["OWNER"]}>
            <OwnerPerformancePage />
          </RoleRoute>,
        ),
      },
      {
        path: "aprovacoes",
        element: withSuspense(
          <RoleRoute allow={["OWNER"]}>
            <OwnerApprovalsPage />
          </RoleRoute>,
        ),
      },
      {
        /* Fora da navegação principal de propósito: mora no menu da conta, que é
           onde se procura contrato e fatura — não no meio da operação. */
        path: "cobranca",
        element: withSuspense(
          <RoleRoute allow={["OWNER"]}>
            <BillingPage />
          </RoleRoute>,
        ),
      },
      {
        /* Ativar extensão é contratar serviço e mexer na fatura — só o dono. */
        path: "extensoes",
        element: withSuspense(
          <RoleRoute allow={["OWNER"]}>
            <ExtensionsPage />
          </RoleRoute>,
        ),
      },

      {
        /* Compartilhada entre dono e gestor: o quadro é o mesmo, o que muda é a
           alçada — o gestor recebe os atalhos de tratativa. */
        path: "equipe",
        element: withSuspense(
          <RoleRoute allow={["OWNER", "MANAGER", "SUPER_ADMIN"]}>
            <TeamPage />
          </RoleRoute>,
        ),
      },

      /* Telas exclusivas do gestor. */
      {
        path: "liberacoes",
        element: withSuspense(
          <RoleRoute allow={["MANAGER", "SUPER_ADMIN"]}>
            <ReleasesPage />
          </RoleRoute>,
        ),
      },
      {
        path: "pareceres",
        element: withSuspense(
          <RoleRoute allow={["MANAGER", "SUPER_ADMIN"]}>
            <DiagnosesPage />
          </RoleRoute>,
        ),
      },

      /* Telas exclusivas do operador. */
      {
        path: "lancamentos",
        element: withSuspense(
          <RoleRoute allow={["OPERATOR"]}>
            <EntriesPage />
          </RoleRoute>,
        ),
      },
      {
        path: "triagem",
        element: withSuspense(
          <RoleRoute allow={["OPERATOR"]}>
            <TriagePage />
          </RoleRoute>,
        ),
      },

      { path: "mapa", element: withSuspense(<LiveMapPage />) },
      { path: "viagens", element: withSuspense(<TripsPage />) },
      { path: "checklists", element: withSuspense(<ChecklistsPage />) },
      { path: "caminhoes", element: withSuspense(<TrucksPage />) },
      { path: "manutencao", element: withSuspense(<MaintenancePage />) },
      { path: "motoristas", element: withSuspense(<DriversPage />) },
      { path: "seguranca", element: withSuspense(<SafetyPage />) },
      { path: "custos", element: withSuspense(<CostsPage />) },
      { path: "relatorios", element: withSuspense(<ReportsPage />) },
      { path: "notificacoes", element: withSuspense(<NotificationsPage />) },
      { path: "configuracoes", element: withSuspense(<SettingsPage />) },
    ],
  },
  { path: "*", element: withSuspense(<NotFoundPage />) },
]);
