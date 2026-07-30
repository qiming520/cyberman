/**
 * 角色工坊页（M1-005b 启用：左右分栏）
 *
 * 左栏 60%：灵魂编辑器（表单 5 sections）
 * 右栏 40%：Prompt 编译预览（实时同步）
 * 二者共享 FormProvider，由 useSoulEditor hook 协调
 */
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSoulEditor, SoulEditor } from '@/features/soul/editor/SoulEditor';
import { PromptPreview } from '@/features/soul/editor/PromptPreview';

export function WorkshopPage() {
  const navigate = useNavigate();

  const { methods, onSubmit } = useSoulEditor({
    onSaved: (soulId) => navigate(`/chat?soulId=${soulId}`),
  });

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">角色工坊</h1>
          <p className="text-sm text-slate-400 mt-1">配置灵魂的每一个维度 · 实时预览 Prompt</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <SoulEditor methods={methods} onSubmit={onSubmit} />
          </div>
          <div className="lg:col-span-2">
            <PromptPreview control={methods.control} soulId="preview" />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}