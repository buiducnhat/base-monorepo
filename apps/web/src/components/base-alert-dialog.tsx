import NiceModal from "@ebay/nice-modal-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export const BaseAlertDialog = NiceModal.create(
  ({
    title,
    description,
    onConfirm,
    onCancel,
    cancelText,
    confirmText,
    cancelButtonProps,
    confirmButtonProps,
  }: {
    title: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
    cancelText?: string;
    confirmText?: string;
    cancelButtonProps?: React.ComponentProps<typeof AlertDialogCancel>;
    confirmButtonProps?: React.ComponentProps<typeof AlertDialogAction>;
  }) => {
    const modal = NiceModal.useModal();

    return (
      <AlertDialog onOpenChange={modal.hide} open={modal.visible}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description && (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel} {...cancelButtonProps}>
              {cancelText ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "border border-destructive/10 bg-destructive/10 text-destructive hover:bg-destructive/20",
                confirmButtonProps?.className
              )}
              onClick={onConfirm}
              {...confirmButtonProps}
            >
              {confirmText ?? "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);
