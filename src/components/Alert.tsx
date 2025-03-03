import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface AlertProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Alert({ message, onClose, duration = 3000 }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${isLeaving ? 'opacity-0 translate-y-[-1rem]' : 'opacity-100 translate-y-0'}`}
    >
      <div className="bg-pink-50 border border-pink-200 rounded-lg shadow-lg px-6 py-4 flex items-center gap-3 min-w-[320px]">
        <div className="flex-1">
          <p className="text-pink-800 font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsLeaving(true);
            setTimeout(onClose, 300);
          }}
          className="text-pink-600 hover:text-pink-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}