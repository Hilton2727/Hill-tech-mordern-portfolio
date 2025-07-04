import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Stepper, { Step } from "@/components/Stepper";
import { getInstallScan, installDatabase, createAdmin, updateSiteUrl, fetchDatabaseStatus } from "@/services/api";
import { CheckCircle, Database, HardDrive, Info } from "lucide-react";

const REQUIRED_ITEMS = [
  { label: "uploads", key: "uploads" },
  { label: "assets", key: "assets" },
  { label: "api", key: "api" },
  { label: "database.sql", key: "database.sql" },
  { label: ".htaccess", key: ".htaccess" },
  { label: "index.html", key: "index.html" },
  { label: ".env", key: ".env" },
];

const Install = () => {
  const [scanResults, setScanResults] = useState(
    REQUIRED_ITEMS.map(item => ({ ...item, status: "loading" }))
  );
  const [scanning, setScanning] = useState(true);
  const [canContinue, setCanContinue] = useState(false);
  const navigate = useNavigate();

  // Stepper state for future steps
  const [formData, setFormData] = useState({
    siteUrl: "",
    host: "localhost",
    database: "portfolio",
    username: "root",
    password: "",
    adminEmail: "",
    adminPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [dbError, setDbError] = useState("");
  const [adminError, setAdminError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");
  const [siteUrlError, setSiteUrlError] = useState("");
  const siteUrlRef = useRef<HTMLInputElement>(null);
  const [dbStatus, setDbStatus] = useState<{active: boolean, type: string, used: string, remain: string} | null>(null);

  useEffect(() => {
    // Fetch scan results from backend
    const scan = async () => {
      try {
        const data = await getInstallScan();
        if (data.success) {
          const results = REQUIRED_ITEMS.map(item => ({
            ...item,
            status: data[item.key] ? "passed" : "missing"
          }));
          setScanResults(results);
          setCanContinue(results.every(r => r.status === "passed"));
        } else {
          setScanResults(REQUIRED_ITEMS.map(item => ({ ...item, status: "missing" })));
          setCanContinue(false);
        }
      } catch {
        setScanResults(REQUIRED_ITEMS.map(item => ({ ...item, status: "missing" })));
        setCanContinue(false);
      } finally {
        setScanning(false);
      }
    };
    scan();
  }, []);

  useEffect(() => {
    if (step === 3) {
      setDbLoading(true);
      fetchDatabaseStatus()
        .then(data => {
          if (data && data.success && data.data && data.data.database && typeof data.data.database.tables === 'number' && data.data.database.tables > 0) {
            setDbStatus({ active: true, type: data.data.database.sqlVersion || 'MySQL', used: '-', remain: '-' });
          } else {
            setDbStatus({ active: false, type: '', used: '-', remain: '-' });
          }
        })
        .finally(() => setDbLoading(false));
    }
  }, [step]);

  useEffect(() => {
    if (step === 6) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  // Stepper steps
  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Stepper
        initialStep={1}
        onStepChange={async (nextStep) => {
          // If moving from Site URL step to next, save the site URL
          if (step === 4 && nextStep === 5 && siteUrl) {
            await updateSiteUrl(siteUrl);
          }
          setStep(nextStep);
        }}
        nextButtonProps={step === 6 ? { style: { display: 'none' } } : {
          className: `bg-[#8b5cf6] text-white rounded-md px-6 py-3 font-semibold ${
            (step === 4 && !siteUrl) || (step === 3 && !(dbStatus && dbStatus.active)) || (step === 5 && (!formData.adminEmail || !formData.adminPassword)) ? 'opacity-50' : ''
          }`,
          disabled: (step === 4 && !siteUrl) || (step === 3 && !(dbStatus && dbStatus.active)) || (step === 5 && (!formData.adminEmail || !formData.adminPassword)),
          ...(step === 3
            ? {
                onClick: () => {
                  if (dbStatus && dbStatus.active) {
                    setStep(4);
                  }
                }
              }
            : step === 4
            ? {
                onClick: async () => {
                  if (siteUrl) {
                    await updateSiteUrl(siteUrl);
                    setStep(5);
                  }
                }
              }
            : step === 5
            ? {
                onClick: async () => {
                  setAdminLoading(true);
                  setAdminError("");
                  try {
                    const data = await createAdmin({
                      email: formData.adminEmail,
                      password: formData.adminPassword
                    });
                    if (data.success) {
                      setSuccess(true);
                      setStep(6);
                    } else {
                      setAdminError(data.message || "Admin creation failed");
                    }
                  } catch (err) {
                    setAdminError("Could not connect to the server.");
                  } finally {
                    setAdminLoading(false);
                  }
                }
              }
            : {})
        }}
        backButtonProps={step === 6 ? { style: { display: 'none' } } : {}}
      >
        {/* Step 1: Welcome/Intro */}
        <Step>
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Welcome to Crafted UI Gallery Install</CardTitle>
              <CardDescription>
                This wizard will guide you through the initial installation and configuration of your site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Click Continue to begin the installation process.
              </div>
            </CardContent>
          </Card>
        </Step>
        {/* Step 2: File/Folder Scan */}
        <Step>
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Installation Check</CardTitle>
              <CardDescription>
                Scanning for required files and folders...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2">Required</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scanResults.map((item, idx) => (
                    <tr key={item.key} className="border-b last:border-b-0">
                      <td className="py-2">{item.label}</td>
                      <td className="py-2">
                        {item.status === "loading" && (
                          <span className="flex items-center gap-2 text-yellow-500">
                            <span className="animate-spin h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full"></span>
                            Loading
                          </span>
                        )}
                        {item.status === "passed" && (
                          <span className="flex items-center gap-2 text-green-600">
                            <span className="h-3 w-3 rounded-full bg-green-500 inline-block"></span>
                            Passed
                          </span>
                        )}
                        {item.status === "missing" && (
                          <span className="flex items-center gap-2 text-red-600">
                            <span className="h-3 w-3 rounded-full bg-red-500 inline-block"></span>
                            Missing
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!scanning && !canContinue && (
                <div className="mt-4 text-red-500 font-medium">
                  Some required files or folders are missing. Please upload them and refresh this page.
                </div>
              )}
            </CardContent>
          </Card>
        </Step>
        {/* Step 3: Database Details */}
        <Step>
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Database Setup</CardTitle>
              <CardDescription>
                Check your database connection using the server configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="text-primary" size={24} />
                  <span className="font-semibold text-lg">Database Status</span>
                </div>
                {dbLoading ? (
                  <div className="text-muted-foreground">Checking database status...</div>
                ) : dbStatus && dbStatus.active ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle size={18} /> Database Connected
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Info size={16} /> Type: <span className="font-medium">{dbStatus.type}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-500">Database not connected. Please check your settings.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </Step>
        {/* Step 4: Site URL */}
        <Step>
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Site URL</CardTitle>
              <CardDescription>
                Enter the public URL where this site will be accessed (e.g. https://yourdomain.com)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={e => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    name="siteUrl"
                    value={siteUrl}
                    onChange={e => setSiteUrl(e.target.value)}
                    ref={siteUrlRef}
                    required
                  />
                  {siteUrlError && <div className="text-red-500 text-xs mt-1">{siteUrlError}</div>}
                </div>
              </form>
            </CardContent>
          </Card>
        </Step>
        {/* Step 5: Admin Creation */}
        <Step>
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Create Admin Account</CardTitle>
              <CardDescription>
                Set up the first admin user for your site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input id="adminEmail" name="adminEmail" type="email" value={formData.adminEmail} onChange={e => setFormData(f => ({ ...f, adminEmail: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Admin Password</Label>
                <Input id="adminPassword" name="adminPassword" type="password" value={formData.adminPassword} onChange={e => setFormData(f => ({ ...f, adminPassword: e.target.value }))} required />
              </div>
              {adminError && <div className="text-red-500 text-xs mt-2">{adminError}</div>}
            </CardContent>
          </Card>
        </Step>
        {/* Step 6: Success */}
        <Step>
          <Card className="w-full max-w-xl text-center">
            <CardHeader>
              <CardTitle>Installation Complete!</CardTitle>
              <CardDescription>
                Your Crafted UI Gallery is now installed and ready to use.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="mt-6" onClick={() => navigate("/")}>Go to Site</Button>
            </CardContent>
          </Card>
        </Step>
      </Stepper>
    </div>
  );
};

export default Install;
 