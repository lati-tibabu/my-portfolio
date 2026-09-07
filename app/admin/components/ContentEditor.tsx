"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FiBold, FiItalic, FiList, FiCode, FiEdit3 } from "react-icons/fi";
import { inputClass } from "../lib/constants";

// The visual editor accepts a small formatting vocabulary; source mode preserves custom layouts.
function cleanEditorHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc
    .querySelectorAll("script,style,iframe,object,embed,svg,math")
    .forEach((node) => node.remove());
  doc.body.querySelectorAll("*").forEach((node) => {
    for (const attr of [...node.attributes]) node.removeAttribute(attr.name);
    if (
      ![
        "P",
        "DIV",
        "BR",
        "H2",
        "H3",
        "STRONG",
        "B",
        "EM",
        "I",
        "UL",
        "OL",
        "LI",
        "BLOCKQUOTE",
      ].includes(node.tagName)
    )
      node.replaceWith(...node.childNodes);
  });
  return doc.body.innerHTML;
}

export default function ContentEditor({
  value,
  onChange,
  label = "Content",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const [source, setSource] = useState(() =>
    /<[^>]+>/.test(value.replace(/<\/?(?:p|div|br|h2|h3|strong|b|em|i|ul|ol|li|blockquote)\s*\/?>/gi, "")),
  );
  const editor = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (!source && editor.current && document.activeElement !== editor.current)
      editor.current.innerHTML = cleanEditorHtml(value);
  }, [source, value]);
  const format = (command: string, argument?: string) => {
    editor.current?.focus();
    document.execCommand(command, false, argument);
    if (editor.current) onChange(editor.current.innerHTML);
  };
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-surface-border)]">
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--color-surface-border)] bg-[var(--studio-muted)] p-2">
        {!source && (
          <>
            {[
              ["Bold", "bold", FiBold],
              ["Italic", "italic", FiItalic],
              ["Bullet list", "insertUnorderedList", FiList],
            ].map(([title, command, Glyph]) => {
              const ToolIcon = Glyph as typeof FiBold;
              return (
                <button
                  key={title as string}
                  type="button"
                  aria-label={title as string}
                  title={title as string}
                  className="rounded-md p-2 hover:bg-[var(--studio-accent-soft)]"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => format(command as string)}
                >
                  <ToolIcon aria-hidden />
                </button>
              );
            })}
            <button
              type="button"
              className="rounded-md p-2 text-xs"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => format("formatBlock", "h2")}
            >
              Heading
            </button>
            <button
              type="button"
              className="rounded-md p-2 text-xs"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => format("formatBlock", "p")}
            >
              Text
            </button>
          </>
        )}
        <button
          type="button"
          className="ml-auto flex items-center gap-2 rounded-md p-2 text-xs"
          aria-pressed={source}
          onClick={() => setSource(!source)}
        >
          {source ? <FiEdit3 aria-hidden /> : <FiCode aria-hidden />}
          {source ? "Visual editor" : "HTML source"}
        </button>
      </div>
      {source ? (
        <textarea
          aria-label={`${label} HTML source`}
          className={`${inputClass} min-h-64 rounded-none border-0 font-mono`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <div
          id={id}
          ref={editor}
          role="textbox"
          aria-label={label}
          aria-multiline
          contentEditable
          suppressContentEditableWarning
          className="studio-editor"
          onInput={() => onChange(editor.current?.innerHTML || "")}
          onPaste={(event) => {
            event.preventDefault();
            document.execCommand(
              "insertText",
              false,
              event.clipboardData.getData("text/plain"),
            );
            if (editor.current) onChange(editor.current.innerHTML);
          }}
        />
      )}
      <p className="border-t border-[var(--color-surface-border)] px-4 py-2 text-xs font-normal text-[var(--color-on-surface-variant)]">
        {source
          ? "Custom HTML is preserved here. Visual editing supports basic text formatting."
          : "Write and format directly. Paste inserts plain text."}
      </p>
    </div>
  );
}
