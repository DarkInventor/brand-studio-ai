import { Select } from "@/components/ui/select";

export function PlatformFilter({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange} className="w-48">
      <option value="all">All Platforms</option>
      <option value="instagram">Instagram</option>
      <option value="twitter">Twitter/X</option>
      <option value="linkedin">LinkedIn</option>
    </Select>
  );
} 