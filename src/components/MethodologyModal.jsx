import { X } from "lucide-react";

export default function MethodologyModal({ open, onClose, content }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4">Calculation Methodology</h2>
        <div className="text-sm text-gray-700 space-y-3">
          {content}
        </div>
      </div>
    </div>
  );
}
