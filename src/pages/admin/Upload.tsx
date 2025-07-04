import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listUploads, uploadFile, deleteFile, renameFile, API_BASE } from "@/services/api";
import { FileText, FileImage, File as FileIcon, FileType2, FileCheck2, FileX2 } from "lucide-react";

const DOWNLOAD_API = `${API_BASE}/api/upload/download.php`;

function getFileIcon(fileName: string) {
  if (/\.(pdf)$/i.test(fileName)) return <FileText className="text-red-500" />;
  if (/\.(docx?)$/i.test(fileName)) return <FileType2 className="text-blue-500" />;
  if (/\.(png|jpe?g|gif|svg|webp)$/i.test(fileName)) return <FileImage className="text-green-500" />;
  return <FileIcon className="text-gray-400" />;
}

function getFileType(fileName: string) {
  if (/\.(pdf)$/i.test(fileName)) return "PDF";
  if (/\.(docx?)$/i.test(fileName)) return "DOCX";
  if (/\.(png|jpe?g|gif|svg|webp)$/i.test(fileName)) return "Image";
  return "Other";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function Upload() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setError(null);
    try {
      const data = await listUploads();
      setFiles(data.files || []);
    } catch (e) {
      setError("Failed to load files.");
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const file = fileInput.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadFile(file);
      if (!data.success) throw new Error(data.message || "Upload failed");
      await fetchFiles();
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!window.confirm(`Delete ${filename}?`)) return;
    setError(null);
    try {
      const data = await deleteFile(filename);
      if (!data.success) throw new Error(data.message || "Delete failed");
      await fetchFiles();
    } catch (e) {
      setError("Failed to delete file.");
    }
  };

  const handleRename = async (oldName: string) => {
    if (!newName || newName === oldName) return;
    setError(null);
    try {
      const data = await renameFile(oldName, newName);
      if (!data.success) throw new Error(data.message || "Rename failed");
      setRenaming(null);
      setNewName("");
      await fetchFiles();
    } catch (e) {
      setError("Failed to rename file.");
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Uploads Manager</CardTitle>
        <CardDescription>Manage all files in the uploads directory. See file type, size, and actions at a glance.</CardDescription>
      </CardHeader>
      <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 p-4 items-center">
        <input type="file" ref={fileInput} className="flex-1" />
        <Button type="submit" disabled={uploading} className="w-40">{uploading ? "Uploading..." : "Upload File"}</Button>
      </form>
      {error && <div className="p-4 text-red-500">{error}</div>}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((file) => (
            <div key={file.name} className="flex items-center bg-muted rounded-lg p-4 shadow-sm">
              <div className="mr-4 text-3xl">{getFileIcon(file.name)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{renaming === file.name ? (
                  <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onBlur={() => setRenaming(null)}
                    className="border px-2 py-1 rounded w-40"
                    autoFocus
                  />
                ) : (
                  file.name
                )}</div>
                <div className="text-xs text-muted-foreground flex gap-2">
                  <span>{getFileType(file.name)}</span>
                  <span>• {formatSize(file.size)}</span>
                  <span>• {file.modified}</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <a href={`${DOWNLOAD_API}?filename=${encodeURIComponent(file.name)}`} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" title="Download"><FileCheck2 /></Button>
                </a>
                {renaming === file.name ? (
                  <Button size="sm" onClick={() => handleRename(file.name)} title="Save"><FileCheck2 /></Button>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => { setRenaming(file.name); setNewName(file.name); }} title="Rename"><FileType2 /></Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => handleDelete(file.name)} title="Delete"><FileX2 /></Button>
              </div>
            </div>
          ))}
          {files.length === 0 && (
            <div className="col-span-2 text-center text-muted-foreground">No files found.</div>
          )}
        </div>
      </div>
    </Card>
  );
} 