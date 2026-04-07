"use client";

export type ComposerAttachmentKind = "image" | "file" | "video" | "voice";

export interface ComposerAttachment {
  kind: ComposerAttachmentKind;
  name: string;
  url?: string;
  mimeType?: string;
  dataUrl?: string;
}

interface ComposerHandoffPayload {
  prompt: string;
  transcript?: string;
  attachments: ComposerAttachment[];
  createdAt: number;
}

const COMPOSER_HANDOFF_KEY = "nexus-composer-handoff";
const AGENT_BUTTON_KEY = "nexus-agent-button-enabled";

function isDataUrl(value: string): boolean {
  return value.startsWith("data:");
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to serialize media"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });
}

async function normalizeAttachmentForStorage(attachment: ComposerAttachment): Promise<ComposerAttachment> {
  let dataUrl = attachment.dataUrl;

  if (!dataUrl && attachment.url) {
    if (isDataUrl(attachment.url)) {
      dataUrl = attachment.url;
    } else if (attachment.url.startsWith("blob:")) {
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      dataUrl = await blobToDataUrl(blob);
    }
  }

  return {
    ...attachment,
    dataUrl,
    url: dataUrl ?? attachment.url
  };
}

export async function fileListToComposerAttachments(
  kind: ComposerAttachmentKind,
  fileList: FileList
): Promise<ComposerAttachment[]> {
  return Promise.all(
    Array.from(fileList).map(async (file) => ({
      kind,
      name: file.name,
      mimeType: file.type || undefined,
      url: URL.createObjectURL(file),
      dataUrl: await blobToDataUrl(file)
    }))
  );
}

export async function persistComposerHandoff(input: {
  prompt: string;
  transcript?: string;
  attachments: ComposerAttachment[];
}): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  const attachments = await Promise.all(input.attachments.map((attachment) => normalizeAttachmentForStorage(attachment)));
  const payload: ComposerHandoffPayload = {
    prompt: input.prompt,
    transcript: input.transcript,
    attachments,
    createdAt: Date.now()
  };

  window.sessionStorage.setItem(COMPOSER_HANDOFF_KEY, JSON.stringify(payload));
}

export function consumeComposerHandoff(): ComposerHandoffPayload | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(COMPOSER_HANDOFF_KEY);
  if (!raw) {
    return null;
  }

  window.sessionStorage.removeItem(COMPOSER_HANDOFF_KEY);

  try {
    const parsed = JSON.parse(raw) as ComposerHandoffPayload;
    return {
      ...parsed,
      attachments: parsed.attachments.map((attachment) => ({
        ...attachment,
        url: attachment.url ?? attachment.dataUrl
      }))
    };
  } catch {
    return null;
  }
}

export function revokeComposerAttachmentUrl(attachment: ComposerAttachment): void {
  if (typeof window === "undefined") {
    return;
  }

  if (attachment.url?.startsWith("blob:")) {
    URL.revokeObjectURL(attachment.url);
  }
}

export function readAgentButtonPreference(defaultValue = true): boolean {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  const stored = window.localStorage.getItem(AGENT_BUTTON_KEY);
  if (stored === null) {
    return defaultValue;
  }

  return stored === "true";
}

export function writeAgentButtonPreference(enabled: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AGENT_BUTTON_KEY, String(enabled));
}
