import {
  ArrowLeftIcon,
  ArrowUpIcon,
  MicrophoneIcon,
  MicrophoneSlashIcon,
  StopCircleIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { SpectrumButton, cn } from "@rookhub/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { RookhubLogo } from "@/components/brand/rookhub-logo";

import { ASSISTANT_SUGGESTIONS, ask } from "../api";
import { AssistantOrb, type OrbState } from "../components/assistant-orb";
import { AssistantTurn } from "../components/assistant-turn";
import { VoiceWaveform } from "../components/voice-waveform";
import { useAssistantStore } from "../store";
import { useSpeechRecognition } from "../use-speech-recognition";

/** O que o orbe e o cabeçalho dizem em cada estado. */
const COPY: Record<OrbState, { title: string; hint: string }> = {
  idle: {
    title: "Pronto para conversar",
    hint: "Ative o microfone e fale naturalmente sobre sua operação.",
  },
  listening: {
    title: "Ouvindo…",
    hint: "Pergunte sobre custo, consumo, viagens, manutenção ou segurança.",
  },
  thinking: {
    title: "Consultando sua frota…",
    hint: "Calculando sobre os dados da operação.",
  },
  answering: {
    title: "Pode perguntar outra coisa",
    hint: "Por voz ou digitando — a resposta vem com a origem do dado.",
  },
};

/**
 * Tela dedicada do assistente por voz (RF-033 a RF-037).
 *
 * É a porta que o proprietário escolhe no portal. Tela inteira e fora de `/app`
 * de propósito: quem veio conversar não veio navegar, e a topbar do painel ao
 * redor seria um convite a fazer outra coisa.
 *
 * ⚠️ Voz é **um** caminho, nunca o único. A Web Speech API não existe em boa
 * parte dos navegadores; o campo de texto está sempre presente e assume sozinho
 * quando o microfone não é possível.
 */
export function AssistantPage() {
  const { turns, addTurn, updateTurn } = useAssistantStore();
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /*
   * O orbe é um canvas de lado fixo — não encolhe sozinho como uma imagem.
   * A 320px ele encosta nas bordas de um celular de 390px, então o lado sai da
   * largura disponível em vez de uma constante.
   */
  const [heroSize, setHeroSize] = useState(() =>
    typeof window === "undefined" ? 320 : Math.min(320, window.innerWidth - 120),
  );

  useEffect(() => {
    const update = () => setHeroSize(Math.min(320, window.innerWidth - 120));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  /* Evita duas chamadas simultâneas quando a voz entrega no meio de uma resposta. */
  const busyRef = useRef(false);

  const submit = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busyRef.current) return;

      const turnId = crypto.randomUUID();
      addTurn({ id: turnId, question: trimmed, status: "pending" });
      setQuestion("");
      busyRef.current = true;
      setBusy(true);

      try {
        const answer = await ask(trimmed);
        updateTurn(turnId, { answer, status: "done" });
      } catch {
        updateTurn(turnId, { status: "error" });
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [addTurn, updateTurn],
  );

  const speech = useSpeechRecognition({
    onResult: (transcript) => {
      void submit(transcript);
    },
  });

  /* Rola para o turno mais recente sempre que a conversa cresce. */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  const state: OrbState = speech.listening
    ? "listening"
    : busy
      ? "thinking"
      : turns.length > 0
        ? "answering"
        : "idle";

  const copy = COPY[state];
  const started = turns.length > 0;

  function toggleMic() {
    if (speech.listening) speech.stop();
    else speech.start();
  }

  return (
    <main className="bg-background flex h-dvh flex-col overflow-hidden">
      <header className="border-outline-variant flex shrink-0 items-center gap-3 border-b px-4 py-4 sm:px-6">
        <Link
          to="/portal"
          aria-label="Voltar ao portal"
          className="text-on-surface-variant hover:text-on-surface hover:bg-white/8 focus-visible:ring-secondary rounded-pill flex size-9 shrink-0 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2"
        >
          <ArrowLeftIcon size={20} weight="bold" />
        </Link>

        <RookhubLogo variant="lockup" className="h-7" />

        {started ? (
          <Link
            to="/app"
            className="text-on-surface-variant hover:text-on-surface text-label-md ml-auto normal-case underline-offset-4 hover:underline"
          >
            Ir para a gestão
          </Link>
        ) : null}
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-3xl flex-col items-center px-4 sm:px-6",
            started ? "py-8" : "min-h-full justify-center py-10",
          )}
        >
          {/* O orbe encolhe quando a conversa começa: o assunto passa a ser a
              resposta, e ele vira indicador de estado em vez de protagonista. */}
          <AssistantOrb state={state} size={started ? 132 : heroSize} />

          <h1
            className={cn(
              "font-display text-on-surface mt-6 text-center font-bold",
              started ? "text-[22px]" : "text-[28px] sm:text-[34px]",
            )}
            aria-live="polite"
          >
            {copy.title}
          </h1>

          <p className="text-on-surface-variant text-body-md mt-2 max-w-lg text-center">
            {speech.listening && speech.interim ? speech.interim : copy.hint}
          </p>

          <VoiceWaveform active={speech.listening} className="mt-6 w-full max-w-sm" />

          {!started ? (
            <>
              <div className="mt-8">
                {/*
                 * Indigo sólido, não o Spectrum fixo: o gradiente termina no
                 * ciano, e texto branco ali dá 2,2:1 — reprova AA (regra 7). O
                 * `primary` já traz o Spectrum no hover, onde o contraste é
                 * momentâneo e o rótulo continua legível pela cor de origem.
                 */}
                {speech.supported ? (
                  <SpectrumButton
                    size="lg"
                    shape="pill"
                    className="px-8"
                    onClick={toggleMic}
                    disabled={busy}
                  >
                    {speech.listening ? (
                      <StopCircleIcon size={20} weight="fill" aria-hidden="true" />
                    ) : (
                      <MicrophoneIcon size={20} weight="fill" aria-hidden="true" />
                    )}
                    {speech.listening ? "Parar de ouvir" : "Iniciar conversa"}
                  </SpectrumButton>
                ) : (
                  <SpectrumButton
                    size="lg"
                    shape="pill"
                    className="px-8"
                    onClick={() => inputRef.current?.focus()}
                  >
                    <ArrowUpIcon size={20} weight="bold" aria-hidden="true" />
                    Escrever pergunta
                  </SpectrumButton>
                )}
              </div>

              {/*
               * Microfone indisponível é informação, não silêncio: sem isto o
               * usuário fica procurando um botão de voz que nunca vai existir
               * neste navegador.
               */}
              {!speech.supported ? (
                <p className="text-on-surface-muted text-label-md mt-4 flex items-center gap-2 normal-case">
                  <MicrophoneSlashIcon size={16} weight="duotone" aria-hidden="true" />
                  Este navegador não reconhece voz. Digite abaixo — a resposta é a mesma.
                </p>
              ) : null}

              <ul className="mt-10 flex w-full max-w-xl flex-wrap justify-center gap-2">
                {ASSISTANT_SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => void submit(suggestion)}
                      disabled={busy}
                      className="border-outline-variant hover:border-outline text-on-surface-variant hover:text-on-surface text-label-md focus-visible:ring-secondary rounded-pill border bg-white/[0.03] px-4 py-2 normal-case transition-colors hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="mt-10 flex w-full flex-col gap-8">
              {turns.map((turn) => (
                <AssistantTurn key={turn.id} turn={turn} onNavigate={() => undefined} />
              ))}
            </div>
          )}

          {speech.error ? (
            <p
              role="alert"
              className="text-warning bg-warning/10 border-warning/30 text-body-md mt-6 flex items-start gap-2 rounded-lg border px-4 py-3"
            >
              <WarningIcon size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
              {speech.error}
            </p>
          ) : null}
        </div>
      </div>

      {/* ---------------------------------------------------------------
       * Composição por texto — sempre presente, mesmo com voz disponível.
       * ------------------------------------------------------------- */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit(question);
        }}
        className="border-outline-variant shrink-0 border-t px-4 py-4 sm:px-6"
      >
        <div className="mx-auto w-full max-w-3xl">
          <div className="glass-well rounded-pill focus-within:border-secondary focus-within:ring-secondary/60 flex items-center gap-2 pl-4 pr-2 focus-within:ring-1">
            <label htmlFor="assistant-page-question" className="sr-only">
              Sua pergunta
            </label>
            <input
              id="assistant-page-question"
              ref={inputRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              disabled={busy}
              autoComplete="off"
              placeholder="Pergunte alguma coisa sobre a sua frota…"
              className="text-body-md text-on-surface placeholder:text-on-surface-muted h-12 w-full bg-transparent focus:outline-none"
            />

            {speech.supported ? (
              <button
                type="button"
                onClick={toggleMic}
                disabled={busy}
                aria-label={speech.listening ? "Parar de ouvir" : "Perguntar por voz"}
                aria-pressed={speech.listening}
                className={cn(
                  "rounded-pill focus-visible:ring-secondary flex size-9 shrink-0 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-40",
                  speech.listening
                    ? "bg-secondary text-on-secondary"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-white/10",
                )}
              >
                <MicrophoneIcon size={20} weight={speech.listening ? "fill" : "duotone"} />
              </button>
            ) : null}

            <button
              type="submit"
              aria-label="Enviar pergunta"
              disabled={busy || question.trim().length === 0}
              className="bg-primary-strong text-on-primary rounded-pill focus-visible:ring-secondary flex size-9 shrink-0 items-center justify-center transition-opacity hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-40"
            >
              <ArrowUpIcon size={18} weight="bold" />
            </button>
          </div>

          {/* RN-121 — o número nunca aparece sem a procedência. */}
          <p className="text-on-surface-muted text-label-sm mt-2.5 px-1 text-center normal-case">
            Respostas geradas a partir dos dados da sua operação. Confira a fonte antes de decidir.
          </p>
        </div>
      </form>
    </main>
  );
}
