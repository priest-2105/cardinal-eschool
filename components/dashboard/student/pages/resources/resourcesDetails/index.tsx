"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, FileImage, FileVideo, FileAudio, File, Download, ExternalLink } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface Resource {
  id: string;
  name: string;
  file_path: string;
}

interface ViewResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
}

export function ViewResourceModal({ isOpen, onClose, resource }: ViewResourceModalProps) {
  if (!resource) return null;

  const handleDownload = () => {
    window.open(resource.file_path, '_blank');
  };

  // Function to determine file type based on URL
  const getFileType = (filePath: string): {
    type: 'pdf' | 'image' | 'video' | 'audio' | 'doc' | 'other', 
    extension: string,
    icon: JSX.Element,
    color: string,
    name: string
  } => {
    const extension = filePath.split('.').pop()?.toLowerCase() || '';
    const fileName = filePath.split('/').pop() || 'Unknown file';
    
    if (extension === 'pdf') {
      return {
        type: 'pdf',
        extension,
        icon: <FileText size={24} className="text-red-500" />,
        color: 'bg-red-100 text-red-700',
        name: fileName
      };
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return {
        type: 'image',
        extension,
        icon: <FileImage size={24} className="text-green-500" />,
        color: 'bg-green-100 text-green-700',
        name: fileName
      };
    } else if (['mp4', 'webm', 'avi', 'mov'].includes(extension)) {
      return {
        type: 'video',
        extension,
        icon: <FileVideo size={24} className="text-blue-500" />,
        color: 'bg-blue-100 text-blue-700',
        name: fileName
      };
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return {
        type: 'audio',
        extension,
        icon: <FileAudio size={24} className="text-purple-500" />,
        color: 'bg-purple-100 text-purple-700',
        name: fileName
      };
    } else if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension)) {
      return {
        type: 'doc',
        extension,
        icon: <FileText size={24} className="text-blue-500" />,
        color: 'bg-blue-100 text-blue-700',
        name: fileName
      };
    } else {
      return {
        type: 'other',
        extension: extension || 'unknown',
        icon: <File size={24} className="text-gray-500" />,
        color: 'bg-gray-100 text-gray-700',
        name: fileName
      };
    }
  };

  const fileInfo = getFileType(resource.file_path);

  // Function to check if we should display preview (for PDFs and images)
  const canShowPreview = (fileType: string, extension: string): boolean => {
    return fileType === 'pdf' || fileType === 'image';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Resource Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Resource Name</Label>
            <p className="text-sm text-gray-700">{resource.name}</p>
          </div>

          <div className="space-y-2">
            <Label>File Type</Label>
            <div className="flex items-center gap-2">
              <Badge className={fileInfo.color}>
                {fileInfo.icon}
                <span className="ml-1">{fileInfo.extension.toUpperCase()}</span>
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label>File</Label>
            <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {fileInfo.icon}
                  <span className="text-sm text-gray-700 truncate max-w-[300px]">{fileInfo.name}</span>
                </div>
              </div>
              
              {canShowPreview(fileInfo.type, fileInfo.extension) && (
                <div className="border rounded-md overflow-hidden mb-3">
                  {fileInfo.type === 'pdf' && (
                    <iframe
                      src={`${resource.file_path}#toolbar=0&navpanes=0`}
                      className="w-full h-[200px]"
                      title={resource.name}
                    />
                  )}
                  {fileInfo.type === 'image' && (
                    <img
                      src={resource.file_path}
                      alt={resource.name}
                      className="w-full max-h-[200px] object-contain"
                    />
                  )}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
                <Button 
                  variant="default" 
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

