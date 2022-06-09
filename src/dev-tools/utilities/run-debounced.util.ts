let timeout: NodeJS.Timeout;

export function runDebounced(callback: () => void): void {
  if (timeout !== undefined) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    callback();
  }, 500);
}
