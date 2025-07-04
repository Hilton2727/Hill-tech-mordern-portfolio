import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { listUploadedFiles, saveSiteSettings, saveSmtpSettings, fetchSiteSettings, fetchSmtpSettings } from "@/services/api";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z
    .string()
    .min(0)
    .refine((val) => val === "" || val.length >= 6, {
      message: "New password must be at least 6 characters.",
    }),
  confirmPassword: z.string().min(0),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    if (data.newPassword !== "") {
      return data.confirmPassword !== "";
    }
    return true;
  },
  {
    message: "Please confirm your new password",
    path: ["confirmPassword"],
  }
);

type FormValues = z.infer<typeof formSchema>;

const tabList = [
  { key: "admin", label: "Admin Settings" },
  { key: "site", label: "Site Settings" },
  { key: "smtp", label: "SMTP Settings" },
];

const siteSchema = z.object({
  site_name: z.string().min(1),
  site_logo: z.string().min(1),
  favicon: z.string().min(1),
  site_title: z.string().min(1),
  site_description: z.string().min(1),
  site_url: z.string().url({ message: "Please enter a valid URL." }).min(1),
});

const smtpSchema = z.object({
  host: z.string().min(1),
  port: z.number().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  encryption: z.string().min(1),
  from_email: z.string().email(),
  from_name: z.string().min(1),
});

const SettingsEditor = () => {
  const { admin, updateSettings } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState("admin");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: admin?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const success = await updateSettings(
        values.email,
        values.currentPassword,
        values.newPassword || undefined
      );
      
      if (success) {
        toast.success("Settings updated successfully");
        form.reset({
          email: values.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error("Failed to update settings. Please check your current password.");
      }
    } catch (error) {
      toast.error("An error occurred while updating settings.");
    } finally {
      setIsLoading(false);
    }
  };

  // Site settings state
  const siteForm = useForm({ resolver: zodResolver(siteSchema), defaultValues: { site_name: "", site_logo: "", favicon: "", site_title: "", site_description: "", site_url: "" } });
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteFiles, setSiteFiles] = useState<string[]>([]);
  const [siteLogoModal, setSiteLogoModal] = useState(false);
  const [faviconModal, setFaviconModal] = useState(false);

  // SMTP settings state
  const smtpForm = useForm({ resolver: zodResolver(smtpSchema), defaultValues: { host: "", port: 587, username: "", password: "", encryption: "tls", from_email: "", from_name: "" } });
  const [smtpLoading, setSmtpLoading] = useState(false);

  // Fetch site settings
  useEffect(() => {
    if (tab === "site") {
      setSiteLoading(true);
      fetchSiteSettings().then(data => {
        if (data.success && data.data) siteForm.reset(data.data);
      }).finally(() => setSiteLoading(false));
    }
    if (tab === "smtp") {
      setSmtpLoading(true);
      fetchSmtpSettings().then(data => {
        if (data.success && data.data) smtpForm.reset(data.data);
      }).finally(() => setSmtpLoading(false));
    }
  }, [tab]);

  // List files for logo/favicon selection
  const openFileModal = async (type: "logo" | "favicon") => {
    const data = await listUploadedFiles();
    const images = (data.files || []).filter((f: any) => [".png", ".jpg", ".jpeg", ".ico", ".svg", ".webp"].some(ext => f.name.toLowerCase().endsWith(ext)));
    setSiteFiles(images.map((f: any) => f.url || f.path || f.name));
    if (type === "logo") setSiteLogoModal(true);
    else setFaviconModal(true);
  };

  // Save site settings
  const saveSiteSettingsHandler = async (values: any) => {
    setSiteLoading(true);
    const data = await saveSiteSettings(values);
    setSiteLoading(false);
    if (data.success) toast.success("Site settings updated");
    else toast.error(data.message || "Failed to update site settings");
  };

  // Save SMTP settings
  const saveSmtpSettingsHandler = async (values: any) => {
    setSmtpLoading(true);
    const data = await saveSmtpSettings(values);
    setSmtpLoading(false);
    if (data.success) toast.success("SMTP settings updated");
    else toast.error(data.message || "Failed to update SMTP settings");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-4 items-center border-b pb-2 mb-4">
          {tabList.map(t => (
            <button key={t.key} className={`px-4 py-2 rounded-t-lg font-semibold ${tab === t.key ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {tab === "admin" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="admin@example.com" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the email you'll use to log in to the admin panel.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your current password to make changes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave blank to keep current password.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Confirm your new password.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        )}
        {tab === "site" && (
          <Form {...siteForm}>
            <form onSubmit={siteForm.handleSubmit(saveSiteSettingsHandler)} className="space-y-6">
              <FormField control={siteForm.control} name="site_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={siteForm.control} name="site_logo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Logo</FormLabel>
                  <div className="flex gap-2 items-center">
                    <Input {...field} readOnly />
                    <Button type="button" onClick={() => openFileModal("logo")}>Select Logo</Button>
                  </div>
                  {field.value && <img src={field.value} alt="Logo" className="h-16 mt-2" />}
                </FormItem>
              )} />
              <FormField control={siteForm.control} name="favicon" render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon</FormLabel>
                  <div className="flex gap-2 items-center">
                    <Input {...field} readOnly />
                    <Button type="button" onClick={() => openFileModal("favicon")}>Select Favicon</Button>
                  </div>
                  {field.value && <img src={field.value} alt="Favicon" className="h-8 mt-2" />}
                </FormItem>
              )} />
              <FormField control={siteForm.control} name="site_title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Title</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={siteForm.control} name="site_description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Description</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={siteForm.control} name="site_url" render={({ field }) => (
                <FormItem>
                  <FormLabel>Site URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://yourdomain.com" />
                  </FormControl>
                  <FormDescription>This is the public URL where your site is accessible.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={siteLoading} className="w-full">{siteLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Site Settings"}</Button>
            </form>
            {/* Logo/Favicon file modal */}
            {(siteLogoModal || faviconModal) && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                <div className="bg-[#18181b] p-6 rounded-2xl shadow-2xl max-w-md w-full border border-[#222] text-white">
                  <h2 className="text-lg font-bold mb-4">Select {siteLogoModal ? "Logo" : "Favicon"}</h2>
                  <div className="flex flex-wrap gap-4 justify-center max-h-60 overflow-y-auto">
                    {siteFiles.map((url, i) => (
                      <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded-lg border-2 border-[#333] cursor-pointer hover:border-primary transition" onClick={() => {
                        if (siteLogoModal) siteForm.setValue("site_logo", url);
                        if (faviconModal) siteForm.setValue("favicon", url);
                        setSiteLogoModal(false); setFaviconModal(false);
                      }} />
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={() => { setSiteLogoModal(false); setFaviconModal(false); }} className="mt-4 w-full">Cancel</Button>
                </div>
              </div>
            )}
          </Form>
        )}
        {tab === "smtp" && (
          <Form {...smtpForm}>
            <form onSubmit={smtpForm.handleSubmit(saveSmtpSettingsHandler)} className="space-y-6">
              <FormField control={smtpForm.control} name="host" render={({ field }) => (
                <FormItem><FormLabel>SMTP Host</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={smtpForm.control} name="port" render={({ field }) => (
                <FormItem><FormLabel>SMTP Port</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={smtpForm.control} name="username" render={({ field }) => (
                <FormItem><FormLabel>SMTP Username</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={smtpForm.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>SMTP Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={smtpForm.control} name="encryption" render={({ field }) => (
                <FormItem><FormLabel>Encryption</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={smtpForm.control} name="from_email" render={({ field }) => (
                <FormItem><FormLabel>From Email</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={smtpForm.control} name="from_name" render={({ field }) => (
                <FormItem><FormLabel>From Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <Button type="submit" disabled={smtpLoading} className="w-full">{smtpLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save SMTP Settings"}</Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsEditor;
