"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { MapPin, Weight, Ruler, ChevronRight, Loader2 } from "lucide-react";

const formSchema = z
  .object({
    originZip: z.string().min(5),
    destZip: z.string().min(5),
    weightLbs: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0),
    lengthIn: z.string().optional(),
    widthIn: z.string().optional(),
    heightIn: z.string().optional(),
    serviceCode: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    weightLbs: Number(data.weightLbs),
    lengthIn: data.lengthIn ? Number(data.lengthIn) : undefined,
    widthIn: data.widthIn ? Number(data.widthIn) : undefined,
    heightIn: data.heightIn ? Number(data.heightIn) : undefined,
  }));

type FormSchema = z.infer<typeof formSchema>;

export function RateForm({
  onRatesFetched,
}: {
  onRatesFetched: (rates: any[]) => void;
}) {
  const { toast } = useToast();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      originZip: "",
      destZip: "",
      weightLbs: 1,
      serviceCode: "",
    },
  });

  async function onSubmit(values: FormSchema) {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to fetch rates",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = { ...values };
      if (!payload.serviceCode) delete payload.serviceCode;

      const res = await fetch("/api/rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch rates");

      onRatesFetched(data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        {/* ZIP Codes */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Route</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="originZip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs font-medium">
                    Origin ZIP
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="90210"
                      {...field}
                      className="bg-white/5 border-white/5 focus:border-primary/50 focus:bg-white/10 transition-all duration-200 mono placeholder:text-white/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destZip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs font-medium">
                    Destination ZIP
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="10001"
                      {...field}
                      className="bg-white/5 border-white/5 focus:border-primary/50 focus:bg-white/10 transition-all duration-200 mono placeholder:text-white/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Weight & Dimensions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Weight className="w-4 h-4 text-accent" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Weight & Dimensions</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="weightLbs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs font-medium">
                    Weight <span className="text-muted-foreground/50">lbs</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      className="bg-white/5 border-white/5 focus:border-accent/50 focus:bg-white/10 transition-all duration-200 mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lengthIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs font-medium">
                    Length <span className="text-muted-foreground/50">in</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      className="bg-white/5 border-white/5 focus:border-accent/50 focus:bg-white/10 transition-all duration-200 mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="widthIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs font-medium">
                    Width <span className="text-muted-foreground/50">in</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      className="bg-white/5 border-white/5 focus:border-accent/50 focus:bg-white/10 transition-all duration-200 mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heightIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs font-medium">
                    Height <span className="text-muted-foreground/50">in</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      className="bg-white/5 border-white/5 focus:border-accent/50 focus:bg-white/10 transition-all duration-200 mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Service */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Ruler className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Service Level</span>
          </div>
          <FormField
            control={form.control}
            name="serviceCode"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/5 focus:border-emerald-500/50 focus:ring-0 transition-all duration-200">
                      <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card/90 backdrop-blur-xl border-white/10">
                    <SelectItem value="">All Services</SelectItem>
                    <SelectItem value="03">UPS Ground</SelectItem>
                    <SelectItem value="02">UPS 2nd Day Air</SelectItem>
                    <SelectItem value="01">UPS Next Day Air</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Computing Best Rates...
            </>
          ) : (
            <>
              <span className="text-lg">Get Instant Quotes</span>
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

      </form>
    </Form>
  );
}
