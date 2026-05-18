// ==========================================
// TELEMETRY MODULE
// Lightweight structured logger for dev-mode
// debugging of the API client pipeline.
// ==========================================

export const DEBUG_USER_ID = "11111111-1111-1111-1111-111111111111";

type TelemetryPayload = Record<string, unknown>;

class Telemetry {
  private isDev = import.meta.env.DEV;

  debug(payload: TelemetryPayload): void {
    if (this.isDev) {
      console.debug("[saathi:telemetry]", payload);
    }
  }

  warn(payload: TelemetryPayload): void {
    if (this.isDev) {
      console.warn("[saathi:telemetry]", payload);
    }
  }

  error(payload: TelemetryPayload): void {
    console.error("[saathi:telemetry]", payload);
  }

  info(payload: TelemetryPayload): void {
    if (this.isDev) {
      console.info("[saathi:telemetry]", payload);
    }
  }
}

export const telemetry = new Telemetry();
