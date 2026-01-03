import { useCallback, useEffect, useRef, useState } from "react";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function useGyroTilt(cardRef, enabled, { maxTilt = 14 } = {}) {
  const rafRef = useRef(null);
  const baseRef = useRef({ beta: null, gamma: null });
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(false);

  const apply = useCallback(
    (beta, gamma) => {
      const el = cardRef.current;
      if (!el) return;

      // Calibration (on considère l’orientation au moment de l’activation comme “0”)
      if (baseRef.current.beta === null || baseRef.current.gamma === null) {
        baseRef.current.beta = beta ?? 0;
        baseRef.current.gamma = gamma ?? 0;
      }

      const dBeta = (beta ?? 0) - baseRef.current.beta;   // inclinaison avant/arrière
      const dGamma = (gamma ?? 0) - baseRef.current.gamma; // gauche/droite

      // Mapping degrés -> tilt (adouci + clamp)
      const tiltX = clamp((-dBeta / 45) * maxTilt, -maxTilt, maxTilt);
      const tiltY = clamp((dGamma / 45) * maxTilt, -maxTilt, maxTilt);

      // Shine (0..100%)
      const shineX = clamp(((dGamma + 45) / 90) * 100, 0, 100);
      const shineY = clamp(((dBeta + 45) / 90) * 100, 0, 100);

      el.style.setProperty("--tilt-x", `${tiltX}deg`);
      el.style.setProperty("--tilt-y", `${tiltY}deg`);
      el.style.setProperty("--shine-x", `${shineX}%`);
      el.style.setProperty("--shine-y", `${shineY}%`);
      el.dataset.gyro = "1";
    },
    [cardRef, maxTilt]
  );

  const stop = useCallback(() => {
    setActive(false);
    baseRef.current = { beta: null, gamma: null };
    const el = cardRef.current;
    if (el) {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
      el.style.setProperty("--shine-x", "50%");
      el.style.setProperty("--shine-y", "0%");
      delete el.dataset.gyro;
    }
  }, [cardRef]);

  const requestPermission = useCallback(async () => {
    // Respect “reduced motion”
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    if (!enabled) return;

    // Secure context (important sur iOS)
    if (!window.isSecureContext) return;

    const hasEvent = typeof window.DeviceOrientationEvent !== "undefined";
    if (!hasEvent) return;

    setSupported(true);

    // iOS: permission explicite
    const needsPermission =
      typeof window.DeviceOrientationEvent.requestPermission === "function";

    if (needsPermission) {
      const res = await window.DeviceOrientationEvent.requestPermission();
      if (res !== "granted") return;
    }

    setActive(true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      stop();
      return;
    }

    const hasEvent = typeof window.DeviceOrientationEvent !== "undefined";
    setSupported(hasEvent);

    if (!active) return;

    const handler = (e) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        apply(e.beta, e.gamma);
      });
    };

    window.addEventListener("deviceorientation", handler, true);

    return () => {
      window.removeEventListener("deviceorientation", handler, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [enabled, active, apply, stop]);

  return { supported, active, requestPermission, stop };
}
