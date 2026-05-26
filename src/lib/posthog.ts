import posthog from 'posthog-js';

// Determine if we should enable analytics based on environment
const isAnalyticsEnabled = import.meta.env.PROD || window.location.hostname === 'localhost';

let isInitialized = false;

export const initPostHog = () => {
  if (!isAnalyticsEnabled || isInitialized) return;

  const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

  if (!posthogKey || !posthogHost) {
    console.warn("PostHog environment variables are missing. Analytics disabled.");
    return;
  }

  try {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      // PRIVACY SAFEGUARDS
      autocapture: false, // Disable automatic capture of clicks/forms
      disable_session_recording: true, // EXPLICITLY disable session replay and DOM recording
      capture_pageview: false, // We'll handle page views manually to avoid messy URLs
      loaded: (ph) => {
        if (import.meta.env.DEV) {
          ph.debug(false);
        }
      }
    });
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize PostHog:", error);
  }
};

export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!isInitialized) return;
  
  try {
    posthog.capture(eventName, properties);
  } catch (error) {
    // Fail silently to avoid blocking user flow
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (!isInitialized) return;
  
  try {
    posthog.identify(userId, properties);
  } catch (error) {
    // Fail silently
  }
};

export const resetAnalytics = () => {
  if (!isInitialized) return;
  
  try {
    posthog.reset();
  } catch (error) {
    // Fail silently
  }
};
