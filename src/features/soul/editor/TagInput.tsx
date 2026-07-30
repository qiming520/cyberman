/**
 * Tag 输入控件（M1-005a）
 *
 * 用于 traits / hobbies / preferences / boundaries / manualFacts 等数组字段。
 * 输入框按 Enter 或「添加」按钮提交；已存在的 tag 不会重复添加。
 */
import { useState, type KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';

export interface TagInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  max?: number;
}

export function TagInput({ value, onChange, placeholder = '回车添加', max = 20 }: TagInputProps) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (!v || value.includes(v)) {
      setInput('');
      return;
    }
    if (value.length >= max) {
      setInput('');
      return;
    }
    onChange([...value, v]);
    setInput('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-1 bg-slate-800 text-slate-200 rounded text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                className="text-slate-500 hover:text-rose-400"
                aria-label={`删除 ${tag}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-500"
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-slate-200 rounded text-sm transition-colors"
        >
          <Plus size={14} />
          添加
        </button>
      </div>
      {value.length >= max && (
        <p className="text-xs text-amber-500">已达上限 {max} 个</p>
      )}
    </div>
  );
}