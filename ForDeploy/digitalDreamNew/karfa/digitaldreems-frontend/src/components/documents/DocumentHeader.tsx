import { Building2 } from "lucide-react";
import type { BusinessSettings } from "@/types/types";

interface DocumentHeaderProps {
  settings: BusinessSettings | null;
  title?: string;
}

export default function DocumentHeader({ settings, title }: DocumentHeaderProps) {
  return (
    <div className="border-b pb-6 mb-6">
      <div className="flex items-start justify-between">
        {/* Company Logo and Info */}
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-lg">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.company_name}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <Building2 className="h-10 w-10 text-primary" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">
              {settings?.company_name || "Digital Dreams"}
            </h1>
            {settings?.tagline && (
              <p className="text-sm text-muted-foreground">{settings.tagline}</p>
            )}
            {settings?.address_line1 && (
              <div className="mt-2 text-sm space-y-0.5">
                <p>{settings.address_line1}</p>
                {settings.address_line2 && <p>{settings.address_line2}</p>}
                <p>
                  {[settings.city, settings.state, settings.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {settings.country && <p>{settings.country}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Document Title */}
        {title && (
          <div className="text-right">
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
        )}
      </div>

      {/* Contact Information */}
      {(settings?.phone || settings?.email) && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {settings.phone && (
            <div>
              <span className="font-semibold">Phone:</span> {settings.phone}
            </div>
          )}
          {settings.alternate_phone && (
            <div>
              <span className="font-semibold">Alt Phone:</span> {settings.alternate_phone}
            </div>
          )}
          {settings.email && (
            <div>
              <span className="font-semibold">Email:</span> {settings.email}
            </div>
          )}
          {settings.website && (
            <div>
              <span className="font-semibold">Website:</span> {settings.website}
            </div>
          )}
        </div>
      )}

      {/* Tax Information */}
      {(settings?.gstin || settings?.pan) && (
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          {settings.gstin && (
            <div>
              <span className="font-semibold">GSTIN:</span> {settings.gstin}
            </div>
          )}
          {settings.pan && (
            <div>
              <span className="font-semibold">PAN:</span> {settings.pan}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

