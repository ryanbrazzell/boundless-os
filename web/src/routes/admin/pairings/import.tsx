import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle2, XCircle, Download } from "lucide-react";

interface CSVRow {
  eaEmail: string;
  eaName: string;
  clientName: string;
  startDate: string;
  acceleratorEnabled?: boolean;
  week1Goal?: string;
  week2Goal?: string;
  week3Goal?: string;
  week4Goal?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface ImportResult {
  success: boolean;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  createdPairings: number;
  createdEAs: number;
  createdClients: number;
  errors: ValidationError[];
}

export const Route = createFileRoute("/admin/pairings/import")({
  component: CSVImportPage,
});

function CSVImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<{
    totalRows: number;
    validRows: number;
    invalidRows: number;
    errors: ValidationError[];
    preview: CSVRow[];
  } | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8788"}/api/pairings/import?validateOnly=true`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Validation failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setPreviewData(data);
    },
  });

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8788"}/api/pairings/import`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Import failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setImportResult(data.result);
      setSelectedFile(null);
      setPreviewData(null);
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Please select a CSV file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewData(null);
    setImportResult(null);
    setIsValidating(true);

    try {
      await validateMutation.mutateAsync(file);
    } catch (error: any) {
      alert(error.message || "Failed to validate file");
      setSelectedFile(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    await importMutation.mutateAsync(selectedFile);
  };

  const handleDownloadErrorReport = () => {
    if (!previewData?.errors || previewData.errors.length === 0) return;

    const csvContent = [
      ["Row", "Field", "Error Message"],
      ...previewData.errors.map((e) => [e.row.toString(), e.field, e.message]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import-errors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">CSV Bulk Import</h1>

        {/* File Upload */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
            <CardDescription>
              Import EA-Client pairings from a CSV file. Maximum file size: 5MB, Maximum rows: 1000
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="csv-file">CSV File</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <div className="font-semibold">{selectedFile.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <div className="text-lg font-semibold">Click to upload CSV file</div>
                        <div className="text-sm text-muted-foreground mt-2">
                          or drag and drop your file here
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isValidating && (
                <div className="text-sm text-muted-foreground">Validating file...</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {previewData && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Validation Preview</CardTitle>
              <CardDescription>
                {previewData.validRows} valid rows, {previewData.invalidRows} invalid rows out of{" "}
                {previewData.totalRows} total
              </CardDescription>
            </CardHeader>
            <CardContent>
              {previewData.errors.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-yellow-800">
                      {previewData.errors.length} validation errors found
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDownloadErrorReport}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Error Report
                    </Button>
                  </div>
                  <div className="text-sm text-yellow-700 space-y-1 max-h-40 overflow-y-auto">
                    {previewData.errors.slice(0, 10).map((error, idx) => (
                      <div key={idx}>
                        Row {error.row}, {error.field}: {error.message}
                      </div>
                    ))}
                    {previewData.errors.length > 10 && (
                      <div className="text-muted-foreground">
                        ... and {previewData.errors.length - 10} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}

              {previewData.preview.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">EA Email</th>
                        <th className="text-left p-2">EA Name</th>
                        <th className="text-left p-2">Client Name</th>
                        <th className="text-left p-2">Start Date</th>
                        <th className="text-left p-2">Accelerator</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.preview.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2">{row.eaEmail}</td>
                          <td className="p-2">{row.eaName}</td>
                          <td className="p-2">{row.clientName}</td>
                          <td className="p-2">{row.startDate}</td>
                          <td className="p-2">{row.acceleratorEnabled ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 flex gap-4">
                <Button
                  onClick={handleImport}
                  disabled={previewData.validRows === 0 || importMutation.isPending}
                >
                  {importMutation.isPending ? "Importing..." : `Import ${previewData.validRows} Valid Rows`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewData(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import Results */}
        {importResult && (
          <Card>
            <CardHeader>
              <CardTitle>Import Results</CardTitle>
            </CardHeader>
            <CardContent>
              {importResult.success ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                    <span className="font-semibold">Import completed successfully!</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Rows</div>
                      <div className="text-2xl font-bold">{importResult.totalRows}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Valid Rows</div>
                      <div className="text-2xl font-bold text-green-600">{importResult.validRows}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Pairings Created</div>
                      <div className="text-2xl font-bold">{importResult.createdPairings}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Errors</div>
                      <div className="text-2xl font-bold text-red-600">{importResult.invalidRows}</div>
                    </div>
                  </div>
                  {importResult.errors.length > 0 && (
                    <div className="mt-4">
                      <Button variant="outline" onClick={handleDownloadErrorReport}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Error Report
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-6 w-6" />
                  <span>Import failed. Please check the errors and try again.</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

