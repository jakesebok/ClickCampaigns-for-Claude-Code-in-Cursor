"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, PhoneOff, ArrowLeft, Volume2 } from "lucide-react";

type SessionState = "idle" | "connecting" | "active" | "ended" | "error";

export default function VoiceSessionPage() {
  const router = useRouter();
  const [state, setState] = useState<SessionState>("idle");
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [showTranscript, setShowTranscript] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startSession = useCallback(async () => {
    setState("connecting");
    setError("");
    setTranscript([]);
    setElapsed(0);

    try {
      const res = await fetch("/api/voice/session", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to start voice session");
      }

      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("No client secret returned");

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioElRef.current = audioEl;

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];

        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(e.streams[0]);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        const checkAudio = () => {
          if (!pcRef.current) return;
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          setAiSpeaking(avg > 10);
          requestAnimationFrame(checkAudio);
        };
        checkAudio();
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);

          if (
            event.type === "conversation.item.input_audio_transcription.completed" &&
            event.transcript
          ) {
            setTranscript((prev) => [
              ...prev,
              { role: "user", text: event.transcript },
            ]);
          }

          if (event.type === "response.audio_transcript.done" && event.transcript) {
            setTranscript((prev) => [
              ...prev,
              { role: "assistant", text: event.transcript },
            ]);
          }
        } catch {
          // non-JSON event
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(
        `https://api.openai.com/v1/realtime?model=${encodeURIComponent(
          "gpt-4o-mini-realtime-preview"
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clientSecret}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      if (!sdpRes.ok) throw new Error("WebRTC negotiation failed");

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setState("active");
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (err) {
      console.error("Voice session error:", err);
      setError(err instanceof Error ? err.message : "Connection failed");
      setState("error");
      cleanup();
    }
  }, [cleanup]);

  const endSession = useCallback(() => {
    cleanup();
    setState("ended");
  }, [cleanup]);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
      }
    }
  }, []);

  function formatTime(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Idle / start screen
  if (state === "idle") {
    return (
      <div className="flex flex-col h-full bg-[#0c0a09]">
        <header className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
          <button
            onClick={() => router.push("/chat")}
            className="text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-white">Voice Session</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="space-y-6 max-w-md">
            <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <Mic className="h-12 w-12 text-accent" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-white">
                Speak With Your Coach
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">
                A live voice conversation with APOS. Ideal for inner work, belief
                shifts, and NLP exercises — close your eyes, speak freely, and let
                the process unfold.
              </p>
            </div>

            <div className="space-y-3 text-left rounded-xl border border-white/10 p-4">
              <h3 className="text-sm font-medium text-white/70">Best for:</h3>
              <ul className="space-y-1.5 text-sm text-white/50">
                <li>• Submodality shifts and belief change work</li>
                <li>• Parts negotiation and Six-Step Reframing</li>
                <li>• Anchoring and state management</li>
                <li>• Timeline and re-imprint processes</li>
                <li>• Any time you need to think out loud</li>
              </ul>
            </div>

            <button
              onClick={startSession}
              className="w-full py-4 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors text-lg"
            >
              Start Voice Session
            </button>

            <p className="text-xs text-white/30">
              Uses your microphone. Voice sessions use OpenAI Realtime for
              natural conversation. Your APOS context, VAPI scores, and 6Cs data
              are loaded automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Connecting
  if (state === "connecting") {
    return (
      <div className="flex flex-col h-full bg-[#0c0a09] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto" />
          <p className="text-white/70">Connecting to your coach...</p>
        </div>
      </div>
    );
  }

  // Error
  if (state === "error") {
    return (
      <div className="flex flex-col h-full bg-[#0c0a09]">
        <header className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
          <button
            onClick={() => router.push("/chat")}
            className="text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-white">Voice Session</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => setState("idle")}
            className="px-6 py-3 rounded-xl bg-accent text-accent-foreground font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Session ended
  if (state === "ended") {
    return (
      <div className="flex flex-col h-full bg-[#0c0a09]">
        <header className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
          <button
            onClick={() => router.push("/chat")}
            className="text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-white">Session Complete</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <Volume2 className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white">
                Session Complete
              </h2>
              <p className="text-white/50 text-sm">
                {formatTime(elapsed)} — Take a moment to integrate. Journal,
                breathe, or go for a short walk.
              </p>
            </div>

            {transcript.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider">
                  Transcript
                </h3>
                <div className="space-y-2">
                  {transcript.map((t, i) => (
                    <div
                      key={i}
                      className={`rounded-lg p-3 text-sm ${
                        t.role === "user"
                          ? "bg-white/5 text-white/70 ml-8"
                          : "bg-accent/10 text-white/90 mr-8"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider text-white/30 block mb-1">
                        {t.role === "user" ? "You" : "Coach"}
                      </span>
                      {t.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setState("idle")}
                className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground font-medium"
              >
                New Session
              </button>
              <button
                onClick={() => router.push("/chat")}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition-colors"
              >
                Back to Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active session — immersive view
  return (
    <div className="flex flex-col h-full bg-[#0c0a09] select-none">
      {/* Minimal header */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-white/40 font-mono">
            {formatTime(elapsed)}
          </span>
        </div>
        <button
          onClick={() => setShowTranscript((s) => !s)}
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          {showTranscript ? "Hide transcript" : "Show transcript"}
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Pulsing orb — visual feedback */}
        <div className="relative">
          {/* Outer glow when AI speaks */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              aiSpeaking
                ? "bg-accent/20 scale-150 blur-xl"
                : "bg-transparent scale-100"
            }`}
            style={{ width: 160, height: 160, top: -20, left: -20 }}
          />

          {/* Main orb */}
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              aiSpeaking
                ? "bg-accent/30 scale-110"
                : isMuted
                  ? "bg-white/5"
                  : "bg-white/10"
            }`}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                aiSpeaking
                  ? "bg-accent/50 scale-105"
                  : isMuted
                    ? "bg-white/10"
                    : "bg-white/15"
              }`}
            >
              {aiSpeaking ? (
                <Volume2 className="h-8 w-8 text-accent" />
              ) : isMuted ? (
                <MicOff className="h-8 w-8 text-white/30" />
              ) : (
                <Mic className="h-8 w-8 text-white/60" />
              )}
            </div>
          </div>
        </div>

        {/* Status text */}
        <p className="mt-8 text-sm text-white/30">
          {aiSpeaking
            ? "Coach is speaking..."
            : isMuted
              ? "Microphone muted"
              : "Listening..."}
        </p>

        {/* Live transcript overlay */}
        {showTranscript && transcript.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 max-h-48 overflow-y-auto rounded-xl bg-black/60 backdrop-blur-sm p-4 space-y-2">
            {transcript.slice(-6).map((t, i) => (
              <p
                key={i}
                className={`text-xs ${
                  t.role === "user" ? "text-white/50" : "text-accent/80"
                }`}
              >
                <span className="font-medium">
                  {t.role === "user" ? "You: " : "Coach: "}
                </span>
                {t.text}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 pb-8 pt-4 safe-area-bottom">
        <button
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            isMuted
              ? "bg-white/10 text-white/50"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          {isMuted ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </button>

        <button
          onClick={endSession}
          className="w-16 h-16 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
        >
          <PhoneOff className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}
