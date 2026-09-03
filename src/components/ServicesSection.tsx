import React from 'react';
import { Building2, Armchair, Compass, Trees, Sliders, PhoneCall } from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';

interface ServicesSectionProps {
  onOpenContact: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenContact }) => {
  const { services, siteContent } = useStudioData();

  const servicesPageTitle = siteContent?.servicesPageTitle || 'Comprehensive Architectural Solutions';
  const servicesPageSubtitle = siteContent?.servicesPageSubtitle || 'OUR SERVICES';

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-6 h-6" />;
      case 'Armchair': return <Armchair className="w-6 h-6" />;
      case 'Compass': return <Compass className="w-6 h-6" />;
      case 'Trees': return <Trees className="w-6 h-6" />;
      case 'Sliders': return <Sliders className="w-6 h-6" />;
      default: return <Building2 className="w-6 h-6" />;
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F4F1EC] border-b border-[#D8D2C7]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#8A6A3D] font-semibold block mb-2">
              {servicesPageSubtitle}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1C1C] font-normal">
              {servicesPageTitle}
            </h2>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={onOpenContact}
              className="bg-[#8A6A3D] hover:bg-[#6e532d] text-white px-6 py-3 text-xs tracking-[0.2em] uppercase font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Start Your Project</span>
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-[#D8D2C7] overflow-hidden hover:border-[#8A6A3D] transition-colors group"
            >
              {service.image && (
                <div className="aspect-[16/10] overflow-hidden bg-[#E6E1DB]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#E6E1DB] text-[#8A6A3D] group-hover:bg-[#8A6A3D] group-hover:text-white transition-colors">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <h3 className="font-serif text-xl text-[#1C1C1C] font-normal">
                    {service.title}
                  </h3>
                </div>
                <p className="text-sm text-[#1C1C1C]/70 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
