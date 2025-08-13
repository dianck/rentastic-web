"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight, Home, MapPin, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";

// ------------------------------------------------------------
// TYPES & VALIDATION (Zod)
// ------------------------------------------------------------
const AddressSchema = z.object({
  address: z.string().min(3, "Address is required"),
  apartment: z.string().optional().or(z.literal("")),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().optional().or(z.literal("")),
  updateByPin: z.boolean().default(true),
});

const WizardSchema = z.object({
  channelManager: z.enum(["yes", "no"]),
  howManyHotels: z.enum(["one", "multiple"]),
  category: z.string().min(1, "Pick a category"),
}).and(AddressSchema);

type ChannelManagerChoice = "yes" | "no" | null;
type HotelCountChoice = "one" | "multiple" | null;

type FormData = {
  channelManager: ChannelManagerChoice;
  address: string;
  apartment: string;
  country: string;
  city: string;
  zip: string;
  updateByPin: boolean;
  howManyHotels: HotelCountChoice;
  category: string | null;
};

const initialData: FormData = {
  channelManager: null,
  address: "",
  apartment: "",
  country: "Indonesia",
  city: "",
  zip: "",
  updateByPin: true,
  howManyHotels: "one",
  category: null,
};

// ------------------------------------------------------------
// SHARED UI
// ------------------------------------------------------------
function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="space-y-5">{children}</div>
      </CardContent>
    </Card>
  );
}

function OptionCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  selected?: boolean;
  onClick?: () => void;
  icon?: any;
  title: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border p-4 sm:p-5 transition shadow-sm",
        selected ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "hover:border-primary/50"
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className={cn("rounded-xl p-2", selected ? "bg-primary/10" : "bg-muted")}> 
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <div className="font-medium">{title}</div>
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
        </div>
        {selected && <Check className="ml-auto h-5 w-5" />}
      </div>
    </button>
  );
}

// ------------------------------------------------------------
// MAIN PAGE COMPONENT (App Router): app/onboarding/page.tsx
// ------------------------------------------------------------
export default function PropertyOnboardingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  const total = 5;
  const canBack = step > 0;

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return data.channelManager !== null;
      case 1:
        return !!data.address && !!data.country && !!data.city;
      case 2:
        return true; // confirmation only
      case 3:
        return data.howManyHotels !== null;
      case 4:
        return !!data.category;
      default:
        return false;
    }
  }, [step, data]);

  const progress = ((step + 1) / total) * 100;

  const next = () => setStep((s) => Math.min(total - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  async function finish() {
    setResultMsg(null);
    setErrors({});

    // Validate with Zod
    const parsed = WizardSchema.safeParse({
      channelManager: data.channelManager ?? undefined,
      howManyHotels: data.howManyHotels ?? undefined,
      category: data.category ?? undefined,
      address: data.address,
      apartment: data.apartment,
      country: data.country,
      city: data.city,
      zip: data.zip,
      updateByPin: data.updateByPin,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const path = i.path.join(".") || "form";
        fieldErrors[path] = i.message;
      });
      setErrors(fieldErrors);
      setResultMsg("Please review the highlighted fields.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.message || "Failed");
      setResultMsg("Saved! Your listing has been submitted.");
    } catch (e: any) {
      setResultMsg(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[90vh] w-full bg-gradient-to-b from-background to-muted/40 py-8 sm:py-12">
      {/* Progress */}
      <div className="max-w-4xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">Step {step + 1} of {total}</div>
          <div className="text-sm font-medium">Onboarding</div>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-2 bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="px-4">
        {step === 0 && (
          <StepShell
            title="Connect to a channel manager"
            subtitle="Do you want to connect this listing to your channel manager?"
          >
            <RadioGroup
              value={data.channelManager ?? undefined}
              onValueChange={(v) => setData((d) => ({ ...d, channelManager: v as ChannelManagerChoice }))}
              className="space-y-3"
            >
              <div className={cn("flex items-start gap-3 rounded-xl border p-4", errors.channelManager && "border-destructive")}> 
                <RadioGroupItem value="yes" id="cm-yes" />
                <Label htmlFor="cm-yes" className="cursor-pointer">
                  <div className="font-medium">Yes, I’ll connect this listing to my channel manager</div>
                </Label>
              </div>
              <div className={cn("flex items-start gap-3 rounded-xl border p-4", errors.channelManager && "border-destructive")}>
                <RadioGroupItem value="no" id="cm-no" />
                <Label htmlFor="cm-no" className="cursor-pointer">
                  <div className="font-medium">No, I won’t be using a channel manager at this time</div>
                </Label>
              </div>
              {errors.channelManager && <p className="text-xs text-destructive">{errors.channelManager}</p>}
            </RadioGroup>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell title="Where is your property?">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Find Your Address</Label>
                <Input
                  placeholder="e.g. Bekasi"
                  value={data.address}
                  onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))}
                  className={cn(errors.address && "border-destructive")}
                />
                {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
              </div>
              <div className="space-y-2">
                <Label>Apartment or floor number (optional)</Label>
                <Input
                  placeholder="e.g. A-12 or Lt. 3"
                  value={data.apartment}
                  onChange={(e) => setData((d) => ({ ...d, apartment: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Country/region</Label>
                <Select
                  value={data.country}
                  onValueChange={(v) => setData((d) => ({ ...d, country: v }))}
                >
                  <SelectTrigger className={cn(errors.country && "border-destructive")}> 
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indonesia">Indonesia</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                    <SelectItem value="Thailand">Thailand</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  placeholder="e.g. Bekasi"
                  value={data.city}
                  onChange={(e) => setData((d) => ({ ...d, city: e.target.value }))}
                  className={cn(errors.city && "border-destructive")}
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Zip code</Label>
                <Input
                  placeholder="e.g. 17113"
                  value={data.zip}
                  onChange={(e) => setData((d) => ({ ...d, zip: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="update-pin"
                checked={data.updateByPin}
                onCheckedChange={(v) => setData((d) => ({ ...d, updateByPin: Boolean(v) }))}
              />
              <Label htmlFor="update-pin" className="text-sm">Update the address by moving the pin on the map.</Label>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl border overflow-hidden">
              <div className="aspect-[21/9] w-full grid place-items-center bg-muted">
                <div className="flex flex-col items-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mb-2" />
                  <p className="text-sm">Map placeholder — integrate your preferred map SDK here.</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Is the red pin location incorrect? If so, uncheck the option above, then click or press on the map to move the pin to the right location.
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell title="You’re listing:" subtitle="Does this sound like your property?">
            <div className="max-w-md">
              <OptionCard
                selected
                icon={Home}
                title="One hotel where guests can book a room"
                description="A single property that offers one or multiple rooms."
              />
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell title="How many hotels are you listing?">
            <div className="grid sm:grid-cols-2 gap-4">
              <OptionCard
                selected={data.howManyHotels === "one"}
                onClick={() => setData((d) => ({ ...d, howManyHotels: "one" }))}
                icon={Building2}
                title="One hotel with one or multiple rooms that guests can book"
              />
              <OptionCard
                selected={data.howManyHotels === "multiple"}
                onClick={() => setData((d) => ({ ...d, howManyHotels: "multiple" }))}
                icon={Building2}
                title="Multiple hotels with one or multiple rooms that guests can book"
              />
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell title="Which property category is the best fit for your place?">
            <CategoryGrid
              value={data.category}
              onChange={(v) => setData((d) => ({ ...d, category: v }))}
            />
            {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
          </StepShell>
        )}
      </div>

      {/* Footer nav */}
      <div className="max-w-4xl mx-auto px-4 mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={back} disabled={!canBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {step < total - 1 ? (
          <Button onClick={next} disabled={!canContinue}>
            Continue <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={finish} disabled={saving}>
            {saving ? "Saving..." : "Finish"}
          </Button>
        )}
      </div>

      {/* Result / Debug */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        {resultMsg && (
          <div className="text-sm p-3 rounded-lg border bg-background">
            {resultMsg}
          </div>
        )}
        <details className="text-xs text-muted-foreground mt-2">
          <summary className="cursor-pointer">Debug form data</summary>
          <pre className="text-[10px] p-3 bg-muted rounded-lg overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// CATEGORY GRID
// ------------------------------------------------------------
const categories = [
  { key: "hotel", title: "Hotel", desc: "Accommodations for travelers often with restaurants, meeting rooms and other guest services." },
  { key: "guesthouse", title: "Guesthouse", desc: "Private home with separate living facilities for host and guest." },
  { key: "bnb", title: "Bed and breakfast", desc: "Private home offering overnight stays and breakfast." },
  { key: "homestay", title: "Homestay", desc: "Private home with shared living facilities for host and guest." },
  { key: "hostel", title: "Hostel", desc: "Budget accommodations with mostly dorm-style beds and social atmosphere." },
  { key: "condo-hotel", title: "Condo hotel", desc: "Independent apartments with some hotel facilities like a front desk." },
  { key: "capsule", title: "Capsule Hotel", desc: "Extremely small units or capsules offering cheap and basic overnight accommodations." },
  { key: "country-house", title: "Country House", desc: "Private home in the countryside with simple accommodations." },
  { key: "farm-stay", title: "Farm stay", desc: "Private farm with simple accommodations." },
];

function CategoryGrid({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onChange(c.key)}
          className={cn(
            "text-left rounded-2xl border p-4 sm:p-5 shadow-sm transition h-full",
            value === c.key ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "hover:border-primary/50"
          )}
        >
          <div className="font-medium mb-1">{c.title}</div>
          <div className="text-sm text-muted-foreground">{c.desc}</div>
        </button>
      ))}
    </div>
  );
}

// ------------------------------------------------------------
// API ROUTE EXAMPLE (create file: app/api/onboarding/route.ts)
// ------------------------------------------------------------
// import { NextResponse } from "next/server";
// import { z } from "zod";
// const Schema = WizardSchema; // you can move WizardSchema into a shared module (e.g. src/lib/schemas.ts)
// 
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const parsed = Schema.parse(body);
//     // TODO: Persist to DB here (Prisma/Drizzle/etc.)
//     return NextResponse.json({ ok: true, data: parsed });
//   } catch (e: any) {
//     return NextResponse.json({ ok: false, message: e?.message || "Invalid payload" }, { status: 400 });
//   }
// }
