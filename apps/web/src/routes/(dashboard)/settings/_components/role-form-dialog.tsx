import NiceModal from "@ebay/nice-modal-react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/lib/orpc";

type Props = {
  mode: "create" | "update";
  refetch?: () => Promise<any>;
  role?: any;
};

const schema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).optional(),
});

export const RoleFormDialog = NiceModal.create((props: Props) => {
  const { visible, hide } = NiceModal.useModal();

  const { data: permissions } = useQuery(
    orpc.rbac.listPermissions.queryOptions()
  );

  const createMutation = useMutation(
    orpc.rbac.createRole.mutationOptions({
      onSuccess: async () => {
        await props.refetch?.();
        hide();
        toast.success("Role created");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateMutation = useMutation(
    orpc.rbac.updateRole.mutationOptions({
      onSuccess: async () => {
        await props.refetch?.();
        hide();
        toast.success("Role updated");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm({
    defaultValues: {
      id: props.role?.id || "",
      name: props.role?.name || "",
      description: props.role?.description || "",
      permissionIds:
        props.role?.permissions?.map((p: any) => p.permissionId) || [],
    } as z.infer<typeof schema>,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      if (props.mode === "create") {
        await createMutation.mutateAsync({
          id: value.id,
          name: value.name,
          description: value.description || undefined,
          permissionIds: value.permissionIds,
        });
      } else {
        await updateMutation.mutateAsync({
          id: props.role?.id,
          name: value.name,
          description: value.description || undefined,
          permissionIds: value.permissionIds,
        });
      }
    },
  });

  return (
    <Dialog onOpenChange={hide} open={visible}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "create" ? "New Role" : "Edit Role"}
          </DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {props.mode === "create" && (
            <form.Field name="id">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>ID</FieldLabel>
                    <FieldContent>
                      <Input
                        aria-invalid={isInvalid}
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value}
                      />
                    </FieldContent>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            </form.Field>
          )}

          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <FieldContent>
                    <Input
                      aria-invalid={isInvalid}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value}
                    />
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="description">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <FieldContent>
                    <Textarea
                      aria-invalid={isInvalid}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value || ""}
                    />
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid max-h-[300px] grid-cols-2 gap-4 overflow-y-auto rounded-md border p-4">
              <form.Field mode="array" name="permissionIds">
                {(field) => (
                  <>
                    {permissions?.map((perm) => (
                      <div className="flex items-start space-x-2" key={perm.id}>
                        <Checkbox
                          checked={field.state.value?.includes(perm.id)}
                          id={perm.id}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.pushValue(perm.id);
                            } else {
                              const index = field.state.value?.indexOf(perm.id);
                              if (index !== undefined && index > -1) {
                                field.removeValue(index);
                              }
                            }
                          }}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor={perm.id}
                          >
                            {perm.id}
                          </label>
                          <p className="text-muted-foreground text-sm">
                            {perm.description ||
                              `${perm.resource} ${perm.action}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </form.Field>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={hide} type="button" variant="outline">
              Cancel
            </Button>
            <Button
              disabled={createMutation.isPending || updateMutation.isPending}
              type="submit"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
