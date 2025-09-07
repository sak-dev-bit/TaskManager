'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { generateShareableLink } from '@/app/actions';
import { Check, Copy, Loader2, TriangleAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Input } from './ui/input';

interface ShareDialogProps {
  children: React.ReactNode;
}

export function ShareDialog({ children }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { getIdToken } = useAuth();

  const handleGenerateLink = () => {
    startTransition(async () => {
      setLink('');
      setIsCopied(false);
      const idToken = await getIdToken();
      if (!idToken) {
        toast({
          variant: 'destructive',
          title: 'Authentication error',
          description: 'Please sign in again.',
        });
        return;
      }
      const result = await generateShareableLink(idToken);
      setLink(result.shareableLink);
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast({ title: 'Link copied to clipboard!' });
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const isFraud = link === 'FRAUDULENT';
  const isError = link === 'ERROR';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Task List</DialogTitle>
          <DialogDescription>
            Generate a link to invite others to collaborate on this task list.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {!link && !isPending && (
             <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">Click the button below to generate a unique shareable link.</p>
                <Button onClick={handleGenerateLink}>
                    Generate Link
                </Button>
            </div>
          )}

          {isPending && (
            <div className="flex items-center justify-center space-x-2 rounded-md border p-4">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating secure link...</span>
            </div>
          )}

          {link && !isPending && (
            <>
              {isFraud || isError ? (
                <div className="flex flex-col items-center justify-center space-y-2 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
                  <TriangleAlert className="h-8 w-8" />
                  <p className="font-semibold">
                    {isFraud ? "Potential Fraud Detected" : "An Error Occurred"}
                  </p>
                  <p className="text-sm">
                    {isFraud ? "This request could not be completed due to suspicious activity." : "We couldn't generate a link. Please try again later."}
                  </p>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                    <Input value={link} readOnly className="flex-1" />
                    <Button size="icon" onClick={handleCopy} disabled={isCopied}>
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
              )}
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
