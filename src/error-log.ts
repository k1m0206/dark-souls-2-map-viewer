export interface ErrorEntry {
  time: string;
  message: string;
  stack?: string;
  context?: string;
}

const errorLogs: ErrorEntry[] = [];
let currentContext = 'init';

export function setErrorLogContext(ctx: string) {
  currentContext = ctx;
}

export function recordAppError(error: unknown, context?: string) {
  const err = error instanceof Error ? error : new Error(String(error));
  const entry: ErrorEntry = {
    time: new Date().toLocaleTimeString(),
    message: err.message || '未知错误',
    stack: err.stack,
    context: context || currentContext
  };
  errorLogs.push(entry);
  if (errorLogs.length > 50) {
    errorLogs.shift();
  }
  console.error(`[DS2-Viewer Error][${entry.context}]`, err);
}

export function getAppErrorLogs(): readonly ErrorEntry[] {
  return errorLogs;
}

export function clearAppErrorLogs() {
  errorLogs.length = 0;
}

export function installErrorLogging() {
  window.addEventListener('error', (event) => {
    recordAppError(event.error || event.message, 'window.onerror');
  });
  window.addEventListener('unhandledrejection', (event) => {
    recordAppError(event.reason, 'unhandledrejection');
  });
}
