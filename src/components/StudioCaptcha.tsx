import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, RefreshCw, Check, AlertCircle, Lock } from 'lucide-react';

interface StudioCaptchaProps {
  onVerify: (isVerified: boolean) => void;
  theme?: 'light' | 'dark';
}

export const StudioCaptcha: React.FC<StudioCaptchaProps> = ({ onVerify, theme = 'light' }) => {
  const [captchaType, setCaptchaType] = useState<'text' | 'math'>('text');
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [mathProblem, setMathProblem] = useState<{ q: string; answer: number }>({ q: '', answer: 0 });
  const [userInput, setUserInput] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random alphanumeric characters (omitting confusing chars like 0/O, 1/I/l)
  const generateRandomCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateRandomMath = () => {
    const num1 = Math.floor(Math.random() * 12) + 3;
    const num2 = Math.floor(Math.random() * 9) + 2;
    const isAddition = Math.random() > 0.3;
    if (isAddition) {
      return { q: `${num1} + ${num2} = ?`, answer: num1 + num2 };
    } else {
      const bigger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      return { q: `${bigger} − ${smaller} = ?`, answer: bigger - smaller };
    }
  };

  // Draw stylized architectural captcha canvas
  const drawCaptchaCanvas = useCallback((text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = theme === 'dark' ? '#141414' : '#EAE6DF';
    ctx.fillRect(0, 0, width, height);

    // Architectural grid background lines
    ctx.strokeStyle = theme === 'dark' ? '#2A2A2A' : '#D5CFC5';
    ctx.lineWidth = 0.8;
    for (let x = 0; x < width; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 15) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Random security distortion curves
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = theme === 'dark' ? 'rgba(138, 106, 61, 0.45)' : 'rgba(138, 106, 61, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * height);
      ctx.bezierCurveTo(
        width * 0.25, Math.random() * height,
        width * 0.75, Math.random() * height,
        width, Math.random() * height
      );
      ctx.stroke();
    }

    // Draw characters with distinct rotations
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.textBaseline = 'middle';

    const charSpacing = width / (text.length + 1);
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      ctx.save();
      const x = (i + 1) * charSpacing;
      const y = height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() * 24 - 12) * (Math.PI / 180);

      ctx.translate(x, y);
      ctx.rotate(angle);

      // Color variation in bronze/charcoal
      ctx.fillStyle = theme === 'dark' ? (i % 2 === 0 ? '#8A6A3D' : '#F4F1EC') : (i % 2 === 0 ? '#8A6A3D' : '#1C1C1C');
      ctx.fillText(char, -7, 0);
      ctx.restore();
    }

    // Noise dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [theme]);

  const refreshCaptcha = useCallback(() => {
    setUserInput('');
    setIsVerified(false);
    setErrorMsg(null);
    onVerify(false);

    if (captchaType === 'text') {
      const newCode = generateRandomCode();
      setCaptchaCode(newCode);
      setTimeout(() => drawCaptchaCanvas(newCode), 20);
    } else {
      const newMath = generateRandomMath();
      setMathProblem(newMath);
    }
  }, [captchaType, drawCaptchaCanvas, onVerify]);

  useEffect(() => {
    refreshCaptcha();
  }, [captchaType]);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanInput = userInput.trim().toUpperCase();

    if (!cleanInput) {
      setErrorMsg('Please enter the verification code');
      setIsVerified(false);
      onVerify(false);
      return;
    }

    let valid = false;
    if (captchaType === 'text') {
      valid = cleanInput === captchaCode.toUpperCase();
    } else {
      valid = parseInt(cleanInput, 10) === mathProblem.answer;
    }

    if (valid) {
      setIsVerified(true);
      setErrorMsg(null);
      onVerify(true);
    } else {
      setIsVerified(false);
      setErrorMsg('Incorrect code. Please try again or refresh.');
      onVerify(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`p-4 border ${
        isVerified
          ? isDark
            ? 'border-[#8A6A3D] bg-[#8A6A3D]/10'
            : 'border-[#8A6A3D] bg-[#8A6A3D]/5'
          : isDark
          ? 'border-white/15 bg-white/5'
          : 'border-[#D8D2C7] bg-[#F4F1EC]'
      } transition-colors`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className={`w-4 h-4 ${isVerified ? 'text-[#8A6A3D]' : isDark ? 'text-white/60' : 'text-[#8A6A3D]'}`} />
          <span className={`text-[10px] tracking-[0.2em] uppercase font-bold ${isDark ? 'text-white/90' : 'text-[#1C1C1C]'}`}>
            Security Verification
          </span>
        </div>

        {/* Challenge switch */}
        {!isVerified && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCaptchaType('text')}
              className={`text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
                captchaType === 'text'
                  ? isDark
                    ? 'border-[#8A6A3D] text-[#8A6A3D] bg-[#8A6A3D]/20'
                    : 'border-[#8A6A3D] text-[#8A6A3D] bg-[#8A6A3D]/10'
                  : isDark
                  ? 'border-white/10 text-white/40 hover:text-white'
                  : 'border-[#D8D2C7] text-[#1C1C1C]/50 hover:text-[#1C1C1C]'
              } transition-colors`}
            >
              Visual Code
            </button>
            <button
              type="button"
              onClick={() => setCaptchaType('math')}
              className={`text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
                captchaType === 'math'
                  ? isDark
                    ? 'border-[#8A6A3D] text-[#8A6A3D] bg-[#8A6A3D]/20'
                    : 'border-[#8A6A3D] text-[#8A6A3D] bg-[#8A6A3D]/10'
                  : isDark
                  ? 'border-white/10 text-white/40 hover:text-white'
                  : 'border-[#D8D2C7] text-[#1C1C1C]/50 hover:text-[#1C1C1C]'
              } transition-colors`}
            >
              Math Challenge
            </button>
          </div>
        )}
      </div>

      {isVerified ? (
        <div className="flex items-center justify-between py-2 px-3 bg-[#8A6A3D]/15 border border-[#8A6A3D]/40">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#8A6A3D] text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-[#1C1C1C]'}`}>
                Human Verification Confirmed
              </span>
              <p className={`text-[9.5px] ${isDark ? 'text-white/60' : 'text-[#1C1C1C]/60'} font-mono`}>
                Session authenticated · Secure brief transmission active
              </p>
            </div>
          </div>
          <Lock className="w-3.5 h-3.5 text-[#8A6A3D]" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Display Captcha Box */}
            <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
              {captchaType === 'text' ? (
                <div className="relative border border-[#8A6A3D]/40 shadow-xs overflow-hidden bg-black/10 flex-1 sm:flex-initial">
                  <canvas
                    ref={canvasRef}
                    width={150}
                    height={42}
                    className="block cursor-pointer select-none max-w-full h-[42px]"
                    onClick={refreshCaptcha}
                    title="Click to generate a new verification code"
                  />
                </div>
              ) : (
                <div
                  className={`flex-1 sm:w-[150px] h-[42px] px-3 flex items-center justify-center font-mono font-bold text-base tracking-widest border border-[#8A6A3D]/50 ${
                    isDark ? 'bg-[#141414] text-[#8A6A3D]' : 'bg-[#EAE6DF] text-[#1C1C1C]'
                  }`}
                >
                  {mathProblem.q}
                </div>
              )}

              <button
                type="button"
                onClick={refreshCaptcha}
                className={`p-2.5 sm:p-2 border min-h-[42px] min-w-[42px] flex items-center justify-center ${
                  isDark
                    ? 'border-white/10 hover:border-[#8A6A3D] text-white/60 hover:text-[#8A6A3D]'
                    : 'border-[#D8D2C7] hover:border-[#8A6A3D] text-[#1C1C1C]/60 hover:text-[#8A6A3D]'
                } transition-colors cursor-pointer shrink-0`}
                title="Refresh verification challenge"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Input & Verification Button */}
            <div className="flex-1 flex items-center gap-2 w-full">
              <input
                type="text"
                placeholder={captchaType === 'text' ? 'Enter 5 characters' : 'Enter answer'}
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleVerify();
                  }
                }}
                maxLength={captchaType === 'text' ? 6 : 4}
                className={`w-full min-h-[42px] px-3 py-2 text-xs font-mono tracking-wider uppercase border focus:outline-none ${
                  isDark
                    ? 'bg-[#141414] border-white/20 text-white focus:border-[#8A6A3D]'
                    : 'bg-white border-[#D8D2C7] text-[#1C1C1C] focus:border-[#8A6A3D]'
                }`}
              />

              <button
                type="button"
                onClick={() => handleVerify()}
                className="min-h-[42px] px-4 py-2 bg-[#8A6A3D] text-white text-[10px] tracking-[0.18em] uppercase font-semibold hover:bg-[#735730] transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                VERIFY
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-[11px] text-red-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <p className={`text-[9.5px] ${isDark ? 'text-white/40' : 'text-[#1C1C1C]/50'} font-mono leading-tight`}>
            * Security protocol required to prevent automated spam before transmission.
          </p>
        </div>
      )}
    </div>
  );
};
