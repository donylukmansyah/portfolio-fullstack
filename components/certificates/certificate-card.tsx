"use client";

import { useState } from "react";
import { Award, Building2, ExternalLink, FileText, X } from "lucide-react";

interface CertificateData {
  id: string;
  name: string;
  description: string;
  issuer: string;
  imageUrl: string | null;
}

interface CertificateCardProps {
  certificates: CertificateData[];
}

function isPdf(url: string | null) {
  if (!url) return false;
  return url.toLowerCase().endsWith(".pdf") || url.includes("/raw/");
}

export default function CertificateCard({ certificates }: CertificateCardProps) {
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  return (
    <>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {certificates.map((cert) => (
          <button
            key={cert.id}
            onClick={() => setSelectedCert(cert)}
            className="w-full min-w-0 h-full text-left group focus:outline-none"
          >
            <div className="relative rounded-lg border bg-background p-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300 w-full h-full flex flex-col hover:shadow-lg hover:scale-[1.02] hover:border-primary/30">
              {/* Certificate thumbnail */}
              {cert.imageUrl && (
                <div className="relative w-full h-32 sm:h-36 rounded-md overflow-hidden mb-2">
                  {isPdf(cert.imageUrl) ? (
                    <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-2">
                      <FileText className="h-10 w-10 text-red-500/80" />
                      <span className="text-xs font-medium text-muted-foreground">PDF Certificate</span>
                    </div>
                  ) : (
                    <img
                      src={cert.imageUrl}
                      alt={cert.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </div>
              )}

              <div className="flex flex-col justify-between rounded-md p-4 sm:p-5 flex-grow">
                <div className="space-y-3">
                  {/* Issuer badge */}
                  <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                    <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{cert.issuer}</span>
                  </div>

                  {/* Certificate name */}
                  <h3 className="font-bold text-sm sm:text-base leading-tight line-clamp-2">
                    {cert.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 break-words">
                    {cert.description}
                  </p>
                </div>

                {/* View detail hint */}
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <Award className="h-3.5 w-3.5" />
                  <span>Klik untuk melihat sertifikat</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal popup for viewing certificate detail */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedCert(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

          {/* Modal content */}
          <div
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border bg-background shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/90 border hover:bg-accent transition-colors shadow-sm"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Certificate file */}
            {selectedCert.imageUrl && (
              <div className="w-full bg-muted rounded-t-2xl overflow-hidden">
                {isPdf(selectedCert.imageUrl) ? (
                  <div className="flex flex-col items-center gap-4 p-8">
                    <FileText className="h-16 w-16 text-red-500" />
                    <p className="text-sm text-muted-foreground">PDF Certificate</p>
                    <a
                      href={selectedCert.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Buka PDF di tab baru
                    </a>
                  </div>
                ) : (
                  <img
                    src={selectedCert.imageUrl}
                    alt={selectedCert.name}
                    className="w-full h-auto max-h-[60vh] object-contain"
                  />
                )}
              </div>
            )}

            {/* Certificate info */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Building2 className="h-4 w-4" />
                {selectedCert.issuer}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {selectedCert.name}
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {selectedCert.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
