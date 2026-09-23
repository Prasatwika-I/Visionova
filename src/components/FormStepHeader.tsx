interface FormStepHeaderProps {
  step: string;
  title: string;
  subtitle?: string;
}

export default function FormStepHeader({ step, title, subtitle }: FormStepHeaderProps) {
  return (
    <div className="flex items-start space-x-3.5 mb-6 pb-4 border-b border-[#362844]">
      <div className="flex-shrink-0 w-8 h-8 rounded-[3px] bg-[#17121C] text-[#C8F04A] border border-[#362844] flex items-center justify-center font-mono font-bold text-xs">
        {step}
      </div>
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[#FFFDF7] tracking-wide uppercase font-mono">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-[#96869E] mt-0.5 font-sans">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
