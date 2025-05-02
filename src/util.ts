import { Signal } from "@char/aftercare";

export const bindValue =
  (signal: Signal<string>) =>
  (elem: HTMLTextAreaElement | HTMLInputElement) => {
    signal.subscribeImmediate((v) => (elem.value = v));
    elem.addEventListener("input", (_) => {
      signal.set(elem.value);
    });
  };

export const bindText = (signal: Signal<any>) => (elem: HTMLElement) => {
  signal.subscribeImmediate((v) => (elem.textContent = String(v)));
};
