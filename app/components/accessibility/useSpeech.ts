'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

export type SpeechState = 'idle' | 'playing' | 'paused';

const subscribeNoop = () => () => {};

// Trechos curtos: o Chrome corta falas longas (~15 s) em algumas vozes, e frases separadas soam mais naturais
function chunks(text: string, max = 220) {
  const out: string[] = [];
  for (const sentence of text.replace(/\s+/g, ' ').match(/[^.!?;:]+[.!?;:]*\s*/g) ?? []) {
    const last = out.length - 1;
    if (last >= 0 && out[last].length + sentence.length <= max) out[last] += sentence;
    else for (let i = 0; i < sentence.length; i += max) out.push(sentence.slice(i, i + max));
  }
  return out.map((part) => part.trim()).filter(Boolean);
}

/** Leitura em voz alta (speechSynthesis, pt-BR): falar, pausar, continuar e parar. resetKey: mudou, a fala para. */
export function useSpeech(resetKey?: string) {
  const supported = useSyncExternalStore(subscribeNoop, () => 'speechSynthesis' in window, () => false);
  const [state, setState] = useState<SpeechState>('idle');
  // Cada leitura tem um número: o 'end' atrasado de uma leitura cancelada não marca a nova como encerrada
  const session = useRef(0);

  // Trocar de página (navegação do Next não recarrega: a fala seguiria lendo a anterior) ou desmontar para a fala
  useEffect(
    () => () => {
      session.current++;
      window.speechSynthesis?.cancel();
      setState('idle');
    },
    [resetKey]
  );

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const parts = chunks(text);
    synth.cancel();
    if (!parts.length) return setState('idle');
    const id = ++session.current;
    const voices = synth.getVoices();
    const voice = voices.find((v) => /^pt[-_]BR/i.test(v.lang)) ?? voices.find((v) => /^pt/i.test(v.lang));
    parts.forEach((part, index) => {
      const utterance = new SpeechSynthesisUtterance(part);
      utterance.lang = 'pt-BR';
      if (voice) utterance.voice = voice;
      if (index === parts.length - 1) utterance.onend = () => id === session.current && setState('idle');
      utterance.onerror = (e) => id === session.current && e.error !== 'interrupted' && e.error !== 'canceled' && setState('idle');
      synth.speak(utterance);
    });
    setState('playing');
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setState('paused');
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setState('playing');
  };

  const stop = () => {
    session.current++;
    window.speechSynthesis.cancel();
    setState('idle');
  };

  return { supported, state, speak, pause, resume, stop };
}
