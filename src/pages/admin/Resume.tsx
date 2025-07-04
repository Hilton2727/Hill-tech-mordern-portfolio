import { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listUploads, uploadFile, deleteFile, API_BASE } from "@/services/api";
import { FileText, FileType2 } from "lucide-react";

const RESUME_API = `${API_BASE}/api/resume/index.php`;

function getFileIcon(fileName: string) {
  if (/\.(pdf)$/i.test(fileName)) return <FileText className="text-red-500" />;
  if (/\.(docx?)$/i.test(fileName)) return <FileType2 className="text-blue-500" />;
  return <FileType2 className="text-gray-400" />;
}

function getFileType(fileName: string) {
  if (/\.(pdf)$/i.test(fileName)) return "PDF";
  if (/\.(docx?)$/i.test(fileName)) return "DOCX";
  return "Other";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function Resume() {
  const [resume, setResume] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    setError(null);
    try {
      const data = await listUploads();
      const found = data.files?.find((f: any) => /\.(pdf|docx)$/i.test(f.name));
      setResume(found || null);
    } catch (e) {
      setError("Failed to load resume list.");
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const file = fileInput.current?.files?.[0];
    if (!file) return;
    if (!/\.(pdf|docx)$/i.test(file.name)) {
      setError("Only PDF or DOCX files allowed.");
      return;
    }
    setUploading(true);
    try {
      const data = await uploadFile(file);
      if (!data.success) throw new Error(data.message || "Upload failed");
      await fetchResume();
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!resume) return;
    if (!window.confirm("Are you sure you want to delete the current resume?")) return;
    setDeleting(true);
    setError(null);
    try {
      const data = await deleteFile(resume.name);
      if (!data.success) throw new Error(data.message || "Delete failed");
      await fetchResume();
    } catch (e: any) {
      setError(e.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>Resume Upload</CardTitle>
        <CardDescription>Upload, view, or download your resume (PDF/DOCX). See file type, size, and actions at a glance.</CardDescription>
      </CardHeader>
      <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 p-4 items-center">
        <input type="file" accept=".pdf,.docx" ref={fileInput} className="flex-1" />
        <Button type="submit" disabled={uploading} className="w-40">{uploading ? "Uploading..." : "Upload Resume"}</Button>
      </form>
      {error && <div className="p-4 text-red-500">{error}</div>}
      {resume ? (
        <div className="p-4 flex items-center bg-muted rounded-lg shadow-sm gap-4">
          <div className="text-3xl">{getFileIcon(resume.name)}</div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{resume.name}</div>
            <div className="text-xs text-muted-foreground flex gap-2">
              <span>{getFileType(resume.name)}</span>
              <span>• {formatSize(resume.size)}</span>
              <span>• {resume.modified}</span>
            </div>
          </div>
          <a href={RESUME_API} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">Download</Button>
          </a>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting || uploading} className="ml-2">
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      ) : (
        <div className="p-4 text-muted-foreground">No resume uploaded yet.</div>
      )}
    </Card>
  );
} 