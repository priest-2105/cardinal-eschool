"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { Label } from "@/components/ui/label"

interface Resource {
  id: number;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resource Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Resource Name</Label>
            <p className="text-sm text-gray-700">{resource.name}</p>
          </div>

          <div className="space-y-2">
            <Label>File</Label>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText size={20} className="text-gray-500" />
                <span className="text-sm text-gray-700">View Document</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Open</span>
              </Button>
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

