import { MagnifyingGlassIcon, WarningIcon } from "@phosphor-icons/react";
import type { YardVehicle } from "@rookhub/types";
import { LightCard, StatusChip, cn } from "@rookhub/ui";
import { useMemo, useState } from "react";

import { VehicleStatusChip } from "@/features/trucks/vehicle-status";
import { dateTime, km } from "@/lib/format";

export interface YardBoardCardProps {
  vehicles: YardVehicle[];
  className?: string;
}

/**
 * Quadro do pátio (visão de campo do operador).
 *
 * É consulta de apoio logístico, não análise: a pergunta é "esse caminhão pode
 * sair?", e a resposta precisa caber num olhar. Por isso o impedimento vem
 * escrito por extenso em vez de virar um ícone que exige interpretação.
 *
 * A busca filtra por placa **e** por vaga — no pátio se procura pelos dois.
 */
export function YardBoardCard({ vehicles, className }: YardBoardCardProps) {
  const [term, setTerm] = useState("");

  const visible = useMemo(() => {
    const needle = term.trim().toUpperCase().replace(/[\s-]/g, "");
    if (!needle) return vehicles;
    return vehicles.filter(
      (vehicle) =>
        vehicle.plate.includes(needle) ||
        (vehicle.bay ?? "").toUpperCase().includes(needle) ||
        (vehicle.driverName ?? "").toUpperCase().includes(needle),
    );
  }, [vehicles, term]);

  const blocked = vehicles.filter((vehicle) => vehicle.blockingReason).length;

  return (
    <LightCard
      title="Pátio"
      className={className}
      action={
        blocked > 0 ? (
          <StatusChip tone="critical" surface="light">
            {blocked === 1 ? "1 impedimento" : `${blocked} impedimentos`}
          </StatusChip>
        ) : (
          <StatusChip tone="positive" surface="light">
            Nenhum impedimento
          </StatusChip>
        )
      }
    >
      <div className="rounded-pill focus-within:border-primary-on-light bg-light-container border-light-outline mb-4 flex min-w-0 items-center gap-2 border px-4">
        <MagnifyingGlassIcon
          size={18}
          className="text-on-light-muted shrink-0"
          aria-hidden="true"
        />
        <label htmlFor="yard-search" className="sr-only">
          Buscar por placa, vaga ou motorista
        </label>
        <input
          id="yard-search"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Placa, vaga ou motorista"
          className="text-body-md text-on-light placeholder:text-on-light-muted h-11 w-full bg-transparent focus:outline-none"
        />
      </div>

      {visible.length === 0 ? (
        <p className="text-on-light-variant text-body-md py-10 text-center">
          Nenhum veículo encontrado com esse termo.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((vehicle) => {
            const overdue = vehicle.kmToMaintenance < 0;

            return (
              <li
                key={vehicle.vehicleId}
                className={cn(
                  "bg-light-container min-w-0 rounded-lg p-4",
                  vehicle.blockingReason && "ring-error-on-light/30 ring-1",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="tabular text-on-light font-semibold">{vehicle.plate}</p>
                  <VehicleStatusChip status={vehicle.status} surface="light" />
                </div>

                <p className="text-on-light-muted text-label-md mt-1 truncate normal-case">
                  {vehicle.model}
                  {vehicle.bay ? ` · vaga ${vehicle.bay}` : " · fora do pátio"}
                </p>

                {vehicle.driverName ? (
                  <p className="text-on-light-variant text-label-md mt-1 truncate normal-case">
                    {vehicle.driverName}
                  </p>
                ) : null}

                <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  <div className="flex gap-1.5">
                    <dt className="text-on-light-muted text-label-md normal-case">Odômetro</dt>
                    <dd className="tabular text-on-light-variant text-label-md normal-case">
                      {km.format(vehicle.odometerKm)} km
                    </dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-on-light-muted text-label-md normal-case">Preventiva</dt>
                    <dd
                      className={cn(
                        "tabular text-label-md normal-case",
                        overdue ? "text-error-on-light font-semibold" : "text-on-light-variant",
                      )}
                    >
                      {overdue
                        ? `vencida há ${km.format(Math.abs(vehicle.kmToMaintenance))} km`
                        : `em ${km.format(vehicle.kmToMaintenance)} km`}
                    </dd>
                  </div>
                </dl>

                {vehicle.blockingReason ? (
                  <p className="text-error-on-light text-label-md mt-3 flex items-start gap-1.5 normal-case">
                    <WarningIcon
                      size={14}
                      weight="fill"
                      className="mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    {vehicle.blockingReason}
                  </p>
                ) : (
                  <p className="text-success-on-light text-label-md mt-3 normal-case">
                    Sem impedimento para a saída.
                  </p>
                )}

                {/* RN-140 — rastreador que parou de sincronizar não é "tudo certo". */}
                <p className="text-on-light-muted text-label-sm mt-2 normal-case">
                  Sincronizado {dateTime.format(new Date(vehicle.lastSyncAt))}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </LightCard>
  );
}
