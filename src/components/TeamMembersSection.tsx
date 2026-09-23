"use client";

import { User, Hash } from "lucide-react";
import FormStepHeader from "./FormStepHeader";

interface TeamMembersSectionProps {
  formData: {
    member1Name: string;
    member1Roll: string;
    member2Name: string;
    member2Roll: string;
    member3Name: string;
    member3Roll: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export default function TeamMembersSection({ formData, errors, onChange }: TeamMembersSectionProps) {
  const members = [
    {
      num: "1",
      label: "MEMBER 1",
      nameField: "member1Name",
      rollField: "member1Roll",
      nameVal: formData.member1Name,
      rollVal: formData.member1Roll,
      nameErr: errors.member1Name,
      rollErr: errors.member1Roll,
    },
    {
      num: "2",
      label: "MEMBER 2",
      nameField: "member2Name",
      rollField: "member2Roll",
      nameVal: formData.member2Name,
      rollVal: formData.member2Roll,
      nameErr: errors.member2Name,
      rollErr: errors.member2Roll,
    },
    {
      num: "3",
      label: "MEMBER 3",
      nameField: "member3Name",
      rollField: "member3Roll",
      nameVal: formData.member3Name,
      rollVal: formData.member3Roll,
      nameErr: errors.member3Name,
      rollErr: errors.member3Roll,
    },
  ];

  return (
    <div>
      <FormStepHeader
        step="02"
        title="TEAM MEMBERS"
        subtitle="Specify details for the 3 additional team members (Total 4 members per team)"
      />

      <div className="space-y-4">
        {members.map((m) => (
          <div
            key={m.num}
            className="p-5 rounded-[4px] bg-[#191220] border border-[#362844] hover:border-[#3E2F4E] transition-colors"
          >
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#C8F04A] text-[#17121C]">
                0{m.num}
              </span>
              <h3 className="text-xs font-mono font-bold text-[#FFFDF7] uppercase tracking-wider">
                {m.label} <span className="text-[#FF6B5E]">*</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Member Name */}
              <div>
                <label className="block text-xs font-mono font-bold text-[#FFFDF7] uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-[#FF6B5E]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#96869E]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={m.nameVal}
                    onChange={(e) => onChange(m.nameField, e.target.value)}
                    placeholder={`Member ${m.num} Name`}
                    className={`dark-editorial-input w-full pl-9 pr-3 py-2.5 text-sm text-[#FFFDF7] placeholder-[#786882] ${
                      m.nameErr ? "!border-rose-500 ring-2 ring-rose-500/20" : ""
                    }`}
                  />
                </div>
                {m.nameErr && <p className="text-xs text-rose-400 mt-1 font-mono">{m.nameErr}</p>}
              </div>

              {/* Member Roll */}
              <div>
                <label className="block text-xs font-mono font-bold text-[#FFFDF7] uppercase tracking-wider mb-1.5">
                  Roll Number <span className="text-[#FF6B5E]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#96869E]">
                    <Hash className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={m.rollVal}
                    onChange={(e) => onChange(m.rollField, e.target.value.toUpperCase())}
                    placeholder={`Member ${m.num} Roll No.`}
                    className={`dark-editorial-input w-full pl-9 pr-3 py-2.5 text-sm text-[#FFFDF7] placeholder-[#786882] uppercase ${
                      m.rollErr ? "!border-rose-500 ring-2 ring-rose-500/20" : ""
                    }`}
                  />
                </div>
                {m.rollErr && <p className="text-xs text-rose-400 mt-1 font-mono">{m.rollErr}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
