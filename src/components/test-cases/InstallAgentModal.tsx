import React, { useState } from 'react';
import { X, Globe, Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstallAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type InstallMethod = 'manual' | 'gtm' | 'lovable' | 'webflow' | 'shopify' | 'wordpress';
type WidgetType = 'spotlight' | 'widget';

const installMethods = [
  { id: 'manual' as InstallMethod, name: 'Manual Install', icon: Globe },
  { id: 'gtm' as InstallMethod, name: 'Google Tag Manager', logo: 'gtm' },
  { id: 'lovable' as InstallMethod, name: 'Lovable', logo: 'lovable' },
  { id: 'webflow' as InstallMethod, name: 'Webflow', logo: 'webflow' },
  { id: 'shopify' as InstallMethod, name: 'Shopify', logo: 'shopify' },
  { id: 'wordpress' as InstallMethod, name: 'WordPress', logo: 'wordpress' },
];

// Logo components matching Astra Design System
const LogoGTM = () => (
  <div className="w-6 h-6 rounded-md overflow-hidden flex items-center justify-center">
    <svg viewBox="0 0 32 32" className="w-6 h-6">
      <path fill="#8AB4F8" d="M16 2L8 10l3 3 8-8z"/>
      <path fill="#4285F4" d="M24 10l-8 8 3 3 8-8z"/>
      <path fill="#8AB4F8" d="M16 21l-8 8 3 3 8-8z"/>
      <path fill="#246FDB" d="M8 10L2 16l6 6 8-8z"/>
      <circle cx="24" cy="24" r="6" fill="#246FDB"/>
    </svg>
  </div>
);

const LogoLovable = () => (
  <div className="w-6 h-6 rounded-md overflow-hidden bg-[#FF6B6B] flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  </div>
);

const LogoWebflow = () => (
  <div className="w-6 h-6 rounded-md overflow-hidden bg-[#4353FF] flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
      <path d="M17.8 8.6s-1.9 5.6-2.1 6.3c0-.7-.8-6.3-.8-6.3-1.7 0-2.7 1.2-3.2 2.5 0 0-1.2 3.2-1.4 3.6 0-.5-.3-3.6-.3-3.6-.3-1.5-1.7-2.5-3.2-2.5l1.4 8.8c1.8 0 2.8-1.2 3.3-2.5 0 0 1-2.7 1.1-2.8 0 .5.8 5.3.8 5.3 1.8 0 2.8-1.2 3.3-2.4l2.8-8.4c-1.8 0-2.8 1.2-3.3 2.5z"/>
    </svg>
  </div>
);

const LogoShopify = () => (
  <div className="w-6 h-6 rounded-md overflow-hidden bg-[#96BF48] flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
      <path d="M15.3 5.6c0-.1-.1-.2-.2-.2h-2.2s-1.4-1.4-1.6-1.5c-.1-.1-.4-.1-.5-.1l-.9 18.4 6.5-1.6s-3.2-15-3.3-15.1zM11 5l-1.6.5v-.1c0-1.1-.2-2-.4-2.7 1 .1 1.7 1.3 2 2.2zm-2.9-2c.3.7.5 1.6.5 2.9v.2l-2.9.9c.6-2.2 1.6-3.2 2.5-3.9zm-1-.8c.2 0 .3 0 .5.1-1 .5-2 1.6-2.5 4l-2.3.7C3.4 5 4.6 2 7.2 2z"/>
      <path d="M9.4 8.7L8.4 12s-.9-.5-1.9-.5c-1.6 0-1.6 1-1.6 1.2 0 1.3 3.5 1.9 3.5 5 0 2.5-1.6 4.1-3.7 4.1-2.6 0-3.9-1.6-3.9-1.6l.7-2.3s1.3 1.2 2.5 1.2c.7 0 1-.6 1-1 0-1.8-2.9-1.8-2.9-4.7 0-2.4 1.7-4.8 5.3-4.8 1.4 0 2 .4 2 .4z"/>
    </svg>
  </div>
);

const LogoWordPress = () => (
  <div className="w-6 h-6 rounded-md overflow-hidden bg-[#464646] flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM4 12c0-1.4.4-2.7 1-3.9l5.5 15.1C6.5 21.6 4 17.2 4 12zm8 8c-.8 0-1.6-.1-2.3-.3l2.5-7.2 2.5 6.9c0 .1.1.1.1.2-.9.3-1.8.4-2.8.4zm1.2-11.7c.5 0 .9 0 .9 0 .4 0 .4-.6 0-.6 0 0-1.3.1-2.1.1-.8 0-2.1-.1-2.1-.1-.4 0-.5.6 0 .6 0 0 .4 0 .9 0l1.3 3.6-1.8 5.5-3.1-9.1c.5 0 .9 0 .9 0 .4 0 .4-.6 0-.6 0 0-1.3.1-2.1.1h-.5C7.2 5.5 9.4 4 12 4c1.9 0 3.7.7 5 1.9h-.1c-.7 0-1.3.6-1.3 1.4 0 .6.4 1.2.8 1.8.3.5.6 1.2.6 2.1 0 .7-.2 1.4-.6 2.5l-.8 2.6-2.8-8.5z"/>
    </svg>
  </div>
);

const getLogo = (logo: string) => {
  switch (logo) {
    case 'gtm': return <LogoGTM />;
    case 'lovable': return <LogoLovable />;
    case 'webflow': return <LogoWebflow />;
    case 'shopify': return <LogoShopify />;
    case 'wordpress': return <LogoWordPress />;
    default: return null;
  }
};

export const InstallAgentModal: React.FC<InstallAgentModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<InstallMethod>('manual');
  const [selectedWidget, setSelectedWidget] = useState<WidgetType>('spotlight');
  const [copied, setCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const codeSnippet = `<script src="//code.astra.ai/widget/rv1vnd63rutgis4csqgfpc8gpirbwg5dj.js" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onOpenChange(false);
    }, 300); // Match animation duration
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop - dark overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/80 z-50",
          isClosing ? "animate-fade-out" : "animate-fade-in"
        )}
        onClick={handleClose}
      />
      
      {/* Modal - Full screen with 60px top padding (Dribbble style) */}
      <div className={cn(
        "fixed inset-0 z-50 pt-[60px]",
        isClosing ? "animate-slide-down" : "animate-slide-up-bounce"
      )}>
        <div 
          className="bg-white w-full h-full rounded-t-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-6 pb-3">
            <h2 className="text-xl font-semibold text-gray-900">Install agent</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex h-[calc(100%-64px)] overflow-hidden">
            {/* Sidebar */}
            <div className="w-fit pl-8 pr-2 py-3 flex-shrink-0 overflow-y-auto bg-white">
              <div className="space-y-1">
                {installMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left",
                      selectedMethod === method.id
                        ? "bg-blue-50 text-blue-700 border-0 shadow-sm"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                    )}
                  >
                    {method.icon ? (
                      <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <method.icon className="w-4 h-4" />
                      </div>
                    ) : method.logo ? (
                      <span className="flex-shrink-0">{getLogo(method.logo)}</span>
                    ) : null}
                    <span>{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 pt-5 pb-8 pl-6 pr-8 overflow-y-auto">
              {/* Widget selection */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Install Astra with {installMethods.find(m => m.id === selectedMethod)?.name}
                </h3>
                <div className="flex gap-4">
                  {/* Spotlight option */}
                  <button
                    onClick={() => setSelectedWidget('spotlight')}
                    className={cn(
                      "w-96 p-5 rounded-xl border-2 text-left transition-all",
                      selectedWidget === 'spotlight'
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                        selectedWidget === 'spotlight' ? "border-blue-500 bg-blue-500" : "border-gray-300"
                      )}>
                        {selectedWidget === 'spotlight' && (
                          <svg className="w-4 h-4 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="font-semibold text-base text-gray-900">Spotlight</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Spotlight widget will appear at the bottom centre of your webpage.
                    </p>
                    <a href="#" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1.5 font-medium">
                      Preview in browser <ExternalLink className="w-4 h-4" />
                    </a>
                  </button>

                  {/* Widget option */}
                  <button
                    onClick={() => setSelectedWidget('widget')}
                    className={cn(
                      "w-96 p-5 rounded-xl border-2 text-left transition-all",
                      selectedWidget === 'widget'
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                        selectedWidget === 'widget' ? "border-blue-500 bg-blue-500" : "border-gray-300"
                      )}>
                        {selectedWidget === 'widget' && (
                          <svg className="w-4 h-4 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="font-semibold text-base text-gray-900">Widget</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Regular widget will appear in the bottom right corner of your webpage.
                    </p>
                    <a href="#" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1.5 font-medium">
                      Preview in browser <ExternalLink className="w-4 h-4" />
                    </a>
                  </button>
                </div>
              </div>

              {/* Code snippet section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    Install Astra in your website
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Paste this code snippet just before the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">&lt;/body&gt;</code> tag on your website.{' '}
                  <a href="#" className="text-blue-600 hover:underline font-medium">View tutorial</a>
                </p>
                
                <div className="flex flex-col gap-3 max-w-[784px]">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 font-mono text-sm text-gray-700">
                    <code className="break-all leading-relaxed">{codeSnippet}</code>
                  </div>

                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Installation tip:</span> Don't host the script on CDNs to ensure your AI agent never goes offline when you need it the most.
                  </p>

                  <button
                    onClick={handleCopy}
                    className={cn(
                      "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm w-fit",
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy code
                      </>
                    )}
                  </button>

                  {/* Help section */}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Need more help?{' '}
                      <a href="#" className="text-blue-600 hover:underline font-medium">Chat with us</a>
                      {' '}or{' '}
                      <a href="#" className="text-blue-600 hover:underline font-medium">Book a demo</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
