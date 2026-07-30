/**
 * 可折叠 Section 容器（M1-005a）
 */
import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SectionProps {
  title: string;
  defaultOpen?: boolean;
  badge?: ReactNode;
  children: ReactNode;
}

export function Section({ title, defaultOpen = true, badge, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border border-slate-800 rounded-lg bg-slate-900/40 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-200">{title}</span>
          {badge}
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="p-4 space-y-3 border-t border-slate-800">{children}</div>
      )}
    </section>
  );
}