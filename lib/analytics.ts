/**
 * Google Analytics Event Tracking
 * Comprehensive user behavior monitoring
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, any>
    ) => void;
  }
}

export const GA_EVENTS = {
  // Page Events
  PAGE_VIEW: "page_view",

  // Decoder Events
  DECODER_START: "decoder_start",
  DECODER_COMPLETE: "decoder_complete",
  DECODER_ERROR: "decoder_error",
  DECODER_RATE_LIMIT: "decoder_rate_limit",

  // Persona Events
  PERSONA_SELECT: "persona_select",

  // Document Events
  DOCUMENT_UPLOAD: "document_upload",
  DOCUMENT_REMOVE: "document_remove",

  // Share Events
  SHARE_IMAGE_GENERATE: "share_image_generate",
  SHARE_IMAGE_DOWNLOAD: "share_image_download",

  // Navigation Events
  NAV_HOME_CLICK: "nav_home_click",
  NAV_DECODER_CLICK: "nav_decoder_click",

  // Engagement Events
  TEXT_INPUT_START: "text_input_start",
  TEXT_INPUT_CLEAR: "text_input_clear",
  DISCLAIMER_CLICK: "disclaimer_click",
  EXTERNAL_LINK_CLICK: "external_link_click",
} as const;

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      ...eventParams,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string) {
  trackEvent(GA_EVENTS.PAGE_VIEW, {
    page_path: url,
    page_title: title || document.title,
  });
}

/**
 * Track decoder usage
 */
export function trackDecoderStart(persona: string, hasImage: boolean) {
  trackEvent(GA_EVENTS.DECODER_START, {
    persona,
    has_image: hasImage,
    input_type: hasImage ? "multimodal" : "text_only",
  });
}

export function trackDecoderComplete(
  persona: string,
  hasImage: boolean,
  riskLevel: string,
  durationMs: number
) {
  trackEvent(GA_EVENTS.DECODER_COMPLETE, {
    persona,
    has_image: hasImage,
    risk_level: riskLevel,
    duration_ms: durationMs,
    success: true,
  });
}

export function trackDecoderError(error: string, persona: string) {
  trackEvent(GA_EVENTS.DECODER_ERROR, {
    error_message: error,
    persona,
    success: false,
  });
}

export function trackRateLimit(persona: string, minutesRemaining: number) {
  trackEvent(GA_EVENTS.DECODER_RATE_LIMIT, {
    persona,
    minutes_remaining: minutesRemaining,
  });
}

/**
 * Track persona selection
 */
export function trackPersonaSelect(persona: string, fromPersona?: string) {
  trackEvent(GA_EVENTS.PERSONA_SELECT, {
    persona,
    from_persona: fromPersona,
  });
}

/**
 * Track document upload
 */
export function trackDocumentUpload(fileName: string, fileSize: number) {
  trackEvent(GA_EVENTS.DOCUMENT_UPLOAD, {
    file_name: fileName,
    file_size_kb: Math.round(fileSize / 1024),
  });
}

export function trackDocumentRemove() {
  trackEvent(GA_EVENTS.DOCUMENT_REMOVE);
}

/**
 * Track share image generation
 */
export function trackShareImageGenerate(persona: string, riskLevel: string) {
  trackEvent(GA_EVENTS.SHARE_IMAGE_GENERATE, {
    persona,
    risk_level: riskLevel,
  });
}

export function trackShareImageDownload(persona: string) {
  trackEvent(GA_EVENTS.SHARE_IMAGE_DOWNLOAD, {
    persona,
  });
}

/**
 * Track navigation
 */
export function trackNavClick(destination: "home" | "decoder") {
  trackEvent(
    destination === "home"
      ? GA_EVENTS.NAV_HOME_CLICK
      : GA_EVENTS.NAV_DECODER_CLICK,
    { destination }
  );
}

/**
 * Track text input interactions
 */
export function trackTextInputStart() {
  trackEvent(GA_EVENTS.TEXT_INPUT_START);
}

export function trackTextInputClear() {
  trackEvent(GA_EVENTS.TEXT_INPUT_CLEAR);
}

/**
 * Track external link clicks
 */
export function trackExternalLink(url: string, linkText: string) {
  trackEvent(GA_EVENTS.EXTERNAL_LINK_CLICK, {
    url,
    link_text: linkText,
  });
}

/**
 * Track disclaimer interaction
 */
export function trackDisclaimerClick() {
  trackEvent(GA_EVENTS.DISCLAIMER_CLICK);
}
