/// <reference types="vite/client" />

interface ElectronAPI {
  invoke: (channel: string, data?: unknown) => Promise<unknown>
  on: (channel: string, callback: (...args: unknown[]) => void) => void
}

interface Window {
  electronAPI: ElectronAPI
}