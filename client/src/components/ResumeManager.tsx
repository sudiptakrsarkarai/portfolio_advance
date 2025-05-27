import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye, Upload, Trash2, Download, FileText } from "lucide-react";
import { toast } from "sonner";

interface ResumeManagerProps {
  userId: string;
}

const ResumeManager = ({ userId }: ResumeManagerProps) => {
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      
      // In a real app with backend, you would upload this to storage
      // For now we just create an object URL to display it
      setResume(file);
      const objectUrl = URL.createObjectURL(file);
      setResumeUrl(objectUrl);
      toast.success("Resume uploaded successfully");
    }
  };
  
  const handleDelete = () => {
    if (resumeUrl) {
      URL.revokeObjectURL(resumeUrl);
    }
    setResume(null);
    setResumeUrl(null);
    setDeleteDialogOpen(false);
    toast.success("Resume deleted successfully");
  };

  const handleDownload = () => {
    if (resumeUrl && resume) {
      const a = document.createElement('a');
      a.href = resumeUrl;
      a.download = resume.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Resume downloaded successfully");
    }
  };
  
  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <input 
            type="file" 
            id="resume-upload" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleUpload}
            accept="application/pdf"
          />
          <Button variant="outline" className="flex items-center gap-2">
            <Upload size={16} />
            {resume ? "Replace Resume" : "Upload Resume"}
          </Button>
        </div>
        
        {resumeUrl && (
          <>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setViewOpen(true)}
            >
              <Eye size={16} />
              View Resume
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download size={16} />
              Download
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 size={16} />
              Delete Resume
            </Button>
          </>
        )}
      </div>
      
      {/* PDF Viewer Dialog - Full screen with improved layout */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-[98vw] w-[98vw] h-[98vh] max-h-[98vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {resume?.name || "Resume"}
            </DialogTitle>
            <DialogDescription>
              {resume && new Date(resume.lastModified).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 w-full h-full overflow-hidden">
            {resumeUrl && (
              <iframe 
                src={resumeUrl + "#toolbar=1&navpanes=1&view=FitH"} 
                className="w-full h-full border-0"
                title="Resume Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your resume. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResumeManager;
