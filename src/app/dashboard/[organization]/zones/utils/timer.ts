export function debounce(this: unknown, fn: () => void, ms: number) {
  let timer: number | undefined;
  return () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = undefined;
      fn.apply(this);
    }, ms);
  };
}
