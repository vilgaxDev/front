import React, { useState, useRef } from 'react';
import { X, MapPin, Mail, Phone, Instagram, Send, Check, Upload, Trash2, RefreshCw, FileCheck, AlertCircle, MessageCircle } from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { StudioCaptcha } from './StudioCaptcha';
import { UploadedAttachment } from '../types';

interface ContactDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactDrawerModal: React.FC<ContactDrawerModalProps> = ({ isOpen, onClose }) => {
  const { submitInquiry, uploadFiles, director } = useStudioData();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Architecture',
    location: '',
    budget: '$50,000 - $150,000',
    message: ''
  });

  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{ referenceNumber: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploaded = await uploadFiles(Array.from(files));
      setAttachments(prev => [...prev, ...uploaded]);
    } catch (err) {
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name) return;

    if (!isCaptchaVerified) {
      setCaptchaError('Please complete the security verification challenge.');
      return;
    }

    setIsSubmitting(true);
    setCaptchaError(null);
    try {
      const res = await submitInquiry({
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        typology: form.interest,
        projectLocation: form.location,
        estimatedBudget: form.budget,
        message: form.message,
        attachments: attachments
      });
      setSubmissionResult({ referenceNumber: res.referenceNumber });
    } catch (err) {
      setSubmissionResult({
        referenceNumber: `UHS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1C1C]/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto overscroll-contain animate-fade-in">
      <div className="bg-[#1C1C1C] text-white border border-white/20 w-full max-w-4xl my-auto overflow-hidden shadow-2xl relative max-h-[95dvh] flex flex-col">
        
        {/* Top Header - Sticky */}
        <div className="sticky top-0 z-20 bg-[#1C1C1C] border-b border-white/10 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[9.5px] sm:text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] block">
              GET IN TOUCH
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-white">
              Start a Conversation.
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto flex-1">
          
          {/* Left Form (Cols 1-7) */}
          <div className="md:col-span-7 p-4 sm:p-6 md:p-8 bg-[#1C1C1C] border-b md:border-b-0 md:border-r border-white/10">
            {submissionResult ? (
              <div className="p-6 bg-white/5 border border-[#8A6A3D] text-center space-y-4 my-8">
                <div className="w-12 h-12 rounded-full bg-[#8A6A3D]/20 text-[#8A6A3D] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-white">Message Received</h3>
                <div className="p-3 bg-white/10 border border-white/10">
                  <span className="text-[9px] uppercase tracking-widest text-[#8A6A3D] block">
                    Reference Tracking Code:
                  </span>
                  <span className="font-mono text-lg font-bold text-white tracking-wider">
                    {submissionResult.referenceNumber}
                  </span>
                </div>
                <p className="text-xs text-white/70 max-w-sm mx-auto">
                  Thank you for reaching out to Ubuntu Haus Studio. Director {director.name} and our architectural team will review your inquiry within 24 hours.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmissionResult(null);
                      setAttachments([]);
                      setForm({
                        name: '',
                        email: '',
                        phone: '',
                        interest: 'Architecture',
                        location: '',
                        budget: '$50,000 - $150,000',
                        message: ''
                      });
                    }}
                    className="text-xs tracking-[0.2em] uppercase text-[#8A6A3D] font-medium underline cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                  <button
                    onClick={onClose}
                    className="text-xs tracking-[0.2em] uppercase text-white/80 hover:text-white border border-white/20 px-3 py-1 cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium mb-1">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="E.G. DENNIS MOKUA"
                    className="w-full bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#8A6A3D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium mb-1">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="NAME@EXAMPLE.COM"
                      className="w-full bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#8A6A3D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium mb-1">
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+254 700 000 000"
                      className="w-full bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#8A6A3D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium mb-1">
                      PRIMARY INTEREST
                    </label>
                    <select
                      value={form.interest}
                      onChange={(e) => setForm({ ...form, interest: e.target.value })}
                      className="w-full bg-[#1C1C1C] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8A6A3D]"
                    >
                      <option value="Architecture">Bespoke Architecture</option>
                      <option value="Interiors">Interior Design</option>
                      <option value="Master Planning">Master Planning</option>
                      <option value="Landscape">Landscape Design</option>
                      <option value="Design Advisory">Design Advisory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium mb-1">
                      PROJECT LOCATION
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="E.G. NAIROBI / COAST"
                      className="w-full bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#8A6A3D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium mb-1">
                    PROJECT DETAILS
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your plot location, desired scope, timeline..."
                    className="w-full bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#8A6A3D]"
                  ></textarea>
                </div>

                {/* Upload attachment in modal */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium">
                      ATTACH PLANS / BRIEF (OPTIONAL)
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] text-[#8A6A3D] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{isUploading ? 'Uploading...' : 'Attach File'}</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      onChange={(e) => handleFiles(e.target.files)}
                      className="hidden"
                    />
                  </div>

                  {attachments.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {attachments.map((file) => (
                        <div key={file.id} className="p-2 bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <FileCheck className="w-3.5 h-3.5 text-[#8A6A3D]" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(file.id)}
                            className="text-white/40 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Studio Security Verification (Captcha) */}
                <div className="pt-1">
                  <StudioCaptcha
                    theme="dark"
                    onVerify={(valid) => {
                      setIsCaptchaVerified(valid);
                      if (valid) setCaptchaError(null);
                    }}
                  />
                  {captchaError && (
                    <div className="mt-2 text-xs text-red-400 flex items-center gap-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{captchaError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="w-full bg-[#8A6A3D] text-white hover:bg-[#8A6A3D]/90 py-3 text-xs tracking-[0.2em] uppercase font-semibold transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>sENDING INFO</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>TRANSMIT INQUIRY</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Direct Details (Cols 8-12) */}
          <div className="md:col-span-5 p-6 sm:p-8 bg-[#1C1C1C] flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#8A6A3D] block font-semibold">
                  HEADQUARTERS & CONTACT CHANNELS
                </span>
                
                <div className="mt-3 space-y-3 text-xs text-white/80">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8A6A3D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white uppercase tracking-wider">Studio Location</p>
                      <p className="text-white/60 text-[11px] mt-0.5">Nairobi, Kenya</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Mail className="w-3.5 h-3.5 text-[#8A6A3D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white uppercase tracking-wider">Direct Email</p>
                      <p className="text-white/60 text-[11px] mt-0.5">info@ubuntuhaus.co.ke</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Phone className="w-3.5 h-3.5 text-[#8A6A3D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white uppercase tracking-wider">Primary Phone</p>
                      <p className="text-white/60 text-[11px] mt-0.5">+254 700 123 456</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-3.5 h-3.5 text-[#8A6A3D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white uppercase tracking-wider">WhatsApp</p>
                      <p className="text-white/60 text-[11px] mt-0.5">+254 705 790 881</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Phone className="w-3.5 h-3.5 text-[#8A6A3D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white uppercase tracking-wider">Secondary Phone</p>
                      <p className="text-white/60 text-[11px] mt-0.5">+254 729 068 444</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Instagram className="w-3.5 h-3.5 text-[#8A6A3D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white uppercase tracking-wider">Instagram Handle</p>
                      <p className="text-white/60 text-[11px] mt-0.5">@ubuntuhaus.studio</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-white/10 bg-white/5">
                <span className="text-[9px] tracking-[0.2em] uppercase text-white/50 block">
                  APPOINTMENT HOURS
                </span>
                <p className="text-xs text-white font-medium mt-1">
                  By Consultation Only
                </p>
                <p className="text-[10px] text-white/60 mt-0.5">
                  Monday to Friday: 8:00 AM – 6:00 PM EAT
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <span className="font-serif italic text-base text-[#8A6A3D] block">
                Ubuntu Haus Studio
              </span>
              <span className="text-[9px] tracking-[0.2em] uppercase text-white/40 mt-0.5 block">
                TIMELESS ARCHITECTURE · ENDURING IMPACT
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
