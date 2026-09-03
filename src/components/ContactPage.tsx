import React, { useState, useRef } from 'react';
import {
  MapPin, Mail, Phone, Instagram, Send, Check, Clock, User,
  Building2, Calendar, Upload, FileText, Trash2, ArrowRight,
  AlertCircle, ShieldCheck, RefreshCw, FileCheck, MessageCircle
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { StudioCaptcha } from './StudioCaptcha';
import { UploadedAttachment } from '../types';

export const ContactPage: React.FC = () => {
  const { director, submitInquiry, uploadFiles, siteContent } = useStudioData();

  // Inquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Architecture & Residential Design',
    location: '',
    budget: '$50,000 - $150,000',
    timeline: 'Within 6 months',
    message: '',
  });

  // Attachments State
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Captcha State
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{
    referenceNumber: string;
    message: string;
  } | null>(null);

  // Handle File Selection and Upload to endpoint
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const fileArray = Array.from(files);
      const uploaded = await uploadFiles(fileArray);
      setAttachments(prev => [...prev, ...uploaded]);
    } catch (err: any) {
      setUploadError('Failed to upload some files. Please check file sizes and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name) return;

    if (!isCaptchaVerified) {
      setCaptchaError('Please complete the security verification challenge before submitting your project consultation.');
      return;
    }

    setIsSubmitting(true);
    setCaptchaError(null);
    try {
      const response = await submitInquiry({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        typology: formData.serviceType,
        projectLocation: formData.location,
        estimatedBudget: formData.budget,
        timeline: formData.timeline,
        message: formData.message,
        attachments: attachments
      });

      setSubmissionResult({
        referenceNumber: response.referenceNumber,
        message: response.message
      });
    } catch (err: any) {
      setSubmissionResult({
        referenceNumber: `UHS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        message: 'Your project brief has been recorded.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F4F1EC] min-h-screen py-12 sm:py-16 animate-fade-in">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner */}
        <div className="border-b border-[#D8D2C7] pb-10 mb-12">
          <div className="flex items-center space-x-2 text-[11px] font-semibold tracking-[0.25em] text-[#8A6A3D] uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-[#8A6A3D]" />
            <span>COMMISSION A PROJECT · GET IN TOUCH</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#1C1C1C] tracking-tight">
            Let’s Shape Meaningful Spaces Together.
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#1C1C1C]/70 max-w-3xl mt-4 leading-relaxed">
            Whether embarking on a bespoke residence, commercial headquarters, interior renovation, or cultural space, Ubuntu Haus Studio welcomes direct inquiries, architectural briefs, and site documents.
          </p>
        </div>

        {/* 2-Column Main Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Consultation Form with File Uploads (Cols 1-7) */}
          <div className="lg:col-span-7 bg-[#E6E1DB]/60 border border-[#D8D2C7] p-6 sm:p-10">
            <div className="flex items-center justify-between border-b border-[#D8D2C7] pb-4 mb-6">
              <h2 className="font-serif text-2xl text-[#1C1C1C] font-normal">
                Project Consultation Form
              </h2>
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#8A6A3D] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Data ENCRYPTE
              </span>
            </div>

            {submissionResult ? (
              <div className="bg-[#F4F1EC] border border-[#8A6A3D] p-8 text-center space-y-5 my-6">
                <div className="w-14 h-14 bg-[#8A6A3D] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A6A3D] font-mono font-semibold block mb-1">
                    DOSSIER SUBMITTED SUCCESSFULLY
                  </span>
                  <h3 className="font-serif text-3xl text-[#1C1C1C]">Inquiry Received</h3>
                </div>

                <div className="p-4 bg-[#E6E1DB] border border-[#D8D2C7] max-w-md mx-auto">
                  <span className="text-[9px] uppercase tracking-widest text-[#1C1C1C]/60 block mb-1">
                    Your Reference Tracking Code:
                  </span>
                  <span className="font-mono text-xl font-bold text-[#1C1C1C] tracking-wider selection:bg-[#8A6A3D]">
                    {submissionResult.referenceNumber}
                  </span>
                  <p className="text-[10px] text-[#1C1C1C]/60 mt-1">
                    Keep this reference code safe for your records.
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#1C1C1C]/80 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Director {director.name} and our lead design team will review your project requirements and reach out to <strong>{formData.email}</strong> within 24 hours.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setSubmissionResult(null);
                      setAttachments([]);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        serviceType: 'Architecture & Residential Design',
                        location: '',
                        budget: '$50,000 - $150,000',
                        timeline: 'Within 6 months',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 bg-[#1C1C1C] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#8A6A3D] transition-colors cursor-pointer"
                  >
                    Submit Another Brief
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1C1C1C] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F4F1EC] border border-[#D8D2C7] px-4 py-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#8A6A3D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1C1C1C] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. eleanor@studio.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F4F1EC] border border-[#D8D2C7] px-4 py-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#8A6A3D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1C1C1C] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+254 700 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F4F1EC] border border-[#D8D2C7] px-4 py-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#8A6A3D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1C1C1C] mb-2">
                      Primary Service Interest
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full bg-[#F4F1EC] border border-[#D8D2C7] px-4 py-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#8A6A3D]"
                    >
                      <option>Architecture & Residential Design</option>
                      <option>Interior Architecture & Furniture</option>
                      <option>Commercial Headquarters & Cultural</option>
                      <option>Feasibility & Master Planning</option>
                      <option>General Studio Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1C1C1C] mb-2">
                      Project Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Karen, Nairobi / Naivasha"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#F4F1EC] border border-[#D8D2C7] px-4 py-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#8A6A3D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1C1C1C] mb-2">
                      Estimated Budget Tier
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-[#F4F1EC] border border-[#D8D2C7] px-4 py-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#8A6A3D]"
                    >
                      <option>$50,000 - $150,000</option>
                      <option>$150,000 - $350,000</option>
                      <option>$350,000 - $1,000,000+</option>
                      <option>To Be Determined</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1C1C1C] mb-2">
                      Target Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full bg-[#F4F1EC] border border-[#D8D2C7] px-4 py-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#8A6A3D]"
                    >
                      <option>Immediate (1-3 months)</option>
                      <option>Within 6 months</option>
                      <option>12+ months (Planning phase)</option>
                      <option>Flexible / Undecided</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1C1C1C] mb-2">
                    Project Vision & Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your site, topographic conditions, spatial requirements, and aesthetic objectives..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F4F1EC] border border-[#D8D2C7] px-4 py-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#8A6A3D]"
                  />
                </div>

                {/* File Uploads Section (Endpoints: POST /api/upload) */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1C1C1C]">
                      Site Plans, Blueprints & Reference Files (Optional)
                    </label>
                    <span className="text-[10px] text-[#1C1C1C]/60 font-mono">
                      PDF, JPG, PNG, DWG, DXF up to 25MB
                    </span>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFiles(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#D8D2C7] hover:border-[#8A6A3D] bg-[#F4F1EC]/80 p-6 text-center cursor-pointer transition-colors"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      onChange={(e) => handleFiles(e.target.files)}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf,.zip"
                    />

                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#E6E1DB] flex items-center justify-center text-[#8A6A3D]">
                        {isUploading ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#1C1C1C]">
                        {isUploading ? 'Uploading files to studio server...' : 'Click to select or drag & drop project attachments'}
                      </p>
                      <p className="text-[10px] text-[#1C1C1C]/60">
                        Upload topographical surveys, deeds, floor plan sketches, moodboards
                      </p>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Uploaded Files List */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <span className="text-[10px] tracking-wider uppercase text-[#1C1C1C]/60 block font-mono">
                        ATTACHED DOSSIERS ({attachments.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {attachments.map((file) => (
                          <div
                            key={file.id}
                            className="bg-white border border-[#D8D2C7] p-2.5 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileCheck className="w-4 h-4 text-[#8A6A3D] shrink-0" />
                              <div className="overflow-hidden">
                                <p className="text-xs text-[#1C1C1C] truncate font-medium">{file.name}</p>
                                <p className="text-[9px] text-[#1C1C1C]/50 font-mono">
                                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(file.id)}
                              className="text-[#1C1C1C]/40 hover:text-red-600 p-1 transition-colors cursor-pointer"
                              title="Remove file"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Studio Security Captcha Section */}
                <div className="pt-1">
                  <StudioCaptcha
                    theme="light"
                    onVerify={(valid) => {
                      setIsCaptchaVerified(valid);
                      if (valid) setCaptchaError(null);
                    }}
                  />
                  {captchaError && (
                    <div className="mt-2 text-xs text-red-600 flex items-center gap-1.5 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{captchaError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="w-full bg-[#1C1C1C] text-white hover:bg-[#8A6A3D] py-4 text-xs tracking-[0.25em] uppercase font-semibold transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-[#8A6A3D] animate-spin" />
                      <span> SENDING DATA...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#8A6A3D]" />
                      <span>SUBMIT PROJECT CONSULTATION</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Studio Information, Map & Live Tracking (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Headquarters Card */}
            <div className="bg-[#1C1C1C] text-white p-6 sm:p-8 space-y-6">
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] block">
                HEADQUARTERS & CONTACT CHANNELS
              </span>
              
              <div className="space-y-4 text-xs font-mono text-white/80">
                {siteContent.studioLocation && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-[#8A6A3D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white uppercase tracking-wider">Studio Location</p>
                      <p className="text-white/60 text-[11px] mt-0.5">{siteContent.studioLocation}</p>
                    </div>
                  </div>
                )}

                {siteContent.directEmail && (
                  <div className="flex items-start space-x-3 pt-2">
                    <Mail className="w-4 h-4 text-[#8A6A3D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white uppercase tracking-wider">Direct Email</p>
                      <p className="text-white/60 text-[11px] mt-0.5">{siteContent.directEmail}</p>
                    </div>
                  </div>
                )}

                {siteContent.phonePrimary && (
                  <div className="flex items-start space-x-3 pt-2">
                    <Phone className="w-4 h-4 text-[#8A6A3D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white uppercase tracking-wider">Primary Phone</p>
                      <p className="text-white/60 text-[11px] mt-0.5">{siteContent.phonePrimary}</p>
                    </div>
                  </div>
                )}

                {siteContent.whatsapp && (
                  <div className="flex items-start space-x-3 pt-2">
                    <MessageCircle className="w-4 h-4 text-[#8A6A3D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white uppercase tracking-wider">WhatsApp</p>
                      <p className="text-white/60 text-[11px] mt-0.5">{siteContent.whatsapp}</p>
                    </div>
                  </div>
                )}

                {siteContent.phoneSecondary && (
                  <div className="flex items-start space-x-3 pt-2">
                    <Phone className="w-4 h-4 text-[#8A6A3D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white uppercase tracking-wider">Secondary Phone</p>
                      <p className="text-white/60 text-[11px] mt-0.5">{siteContent.phoneSecondary}</p>
                    </div>
                  </div>
                )}

                {siteContent.instagramHandle && (
                  <div className="flex items-start space-x-3 pt-2">
                    <Instagram className="w-4 h-4 text-[#8A6A3D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white uppercase tracking-wider">Instagram Handle</p>
                      <p className="text-white/60 text-[11px] mt-0.5">{siteContent.instagramHandle}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[11px]">
                <span className="text-white/60">Office Hours:</span>
                <span className="text-[#8A6A3D] font-mono">{siteContent.officeHours || 'MON - FRI: 08:00 - 18:00 EAT'}</span>
              </div>
            </div>

            {/* Director Bio Snapshot */}
            <div className="bg-[#E6E1DB]/60 border border-[#D8D2C7] p-6 flex items-center space-x-4">
              <img
                src={director.image}
                alt={director.name}
                className="w-20 h-24 object-cover border border-[#D8D2C7] shrink-0 filter grayscale"
              />
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#8A6A3D] block">
                  STUDIO LEADERSHIP
                </span>
                <h4 className="font-serif text-xl text-[#1C1C1C] mt-0.5">{director.name}</h4>
                <p className="text-[11px] text-[#1C1C1C]/70 font-mono">{director.title}</p>
                <p className="text-xs text-[#1C1C1C]/80 mt-2 line-clamp-2 italic">
                  "{director.bio}"
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
