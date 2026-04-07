"use client";

import type { ComposerAttachment } from "@/lib/composer-transfer";

interface AttachmentPreviewStripProps {
  attachments: ComposerAttachment[];
  onRemove: (index: number) => void;
}

function isVisualAttachment(attachment: ComposerAttachment): boolean {
  return attachment.kind === "image" || attachment.kind === "video";
}

export function AttachmentPreviewStrip({
  attachments,
  onRemove
}: AttachmentPreviewStripProps): JSX.Element | null {
  if (!attachments.length) {
    return null;
  }

  return (
    <div className="mb-3 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {attachments.map((attachment, index) => (
          <article
            key={`${attachment.kind}-${attachment.name}-${attachment.url ?? index}`}
            className="overflow-hidden rounded-[18px] border border-[#e7ddd2] bg-white shadow-[0_10px_24px_rgba(46,32,18,0.06)]"
          >
            {isVisualAttachment(attachment) && attachment.url ? (
              <div className="relative">
                {attachment.kind === "image" ? (
                  <img
                    alt={attachment.name}
                    className="h-40 w-full bg-[#f5efe8] object-cover"
                    src={attachment.url}
                  />
                ) : (
                  <video
                    className="h-40 w-full bg-[#1c1a16] object-cover"
                    controls
                    src={attachment.url}
                  />
                )}
              </div>
            ) : attachment.kind === "voice" && attachment.url ? (
              <div className="p-4">
                <audio className="w-full" controls src={attachment.url} />
              </div>
            ) : (
              <div className="flex min-h-[112px] items-center justify-center bg-[#faf7f2] p-4 text-center text-sm text-[#6b6259]">
                {attachment.name}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-[#efe6dc] px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#1c1a16]">{attachment.name}</p>
                <p className="text-xs uppercase tracking-[0.08em] text-[#9a8f83]">{attachment.kind}</p>
              </div>
              <button
                className="rounded-full border border-[#efd8ca] bg-[#fff7f2] px-3 py-1.5 text-xs font-semibold text-[#b55a2b] transition hover:border-[#e4b89d] hover:bg-[#fff1e8]"
                onClick={() => onRemove(index)}
                type="button"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
