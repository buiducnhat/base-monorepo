import NiceModal from "@ebay/nice-modal-react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orpc } from "@/lib/orpc";

type Props = {
  mode: "create" | "update";
  refetch?: () => Promise<any>;
  employees: any[];
  department?: any;
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  managerId: z.string().optional(),
});

export const DepartmentFormDialog = NiceModal.create((props: Props) => {
  const { visible, hide } = NiceModal.useModal();

  const createMutation = useMutation(
    orpc.departments.create.mutationOptions({
      onSuccess: async () => {
        await props.refetch?.();
        hide();
        toast.success("Department created");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateMutation = useMutation(
    orpc.departments.update.mutationOptions({
      onSuccess: async () => {
        await props.refetch?.();
        hide();
        toast.success("Department updated");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm({
    defaultValues: {
      name: props.department?.name || "",
      description: props.department?.description || undefined,
      managerId: props.department?.managerId || undefined,
    } as z.infer<typeof schema>,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      if (props.mode === "create") {
        await createMutation.mutateAsync({
          name: value.name,
          description: value.description || undefined,
          managerId: value.managerId || undefined,
        });
      } else {
        await updateMutation.mutateAsync({
          id: props.department?.id,
          name: value.name,
          description: value.description || undefined,
          managerId: value.managerId || undefined,
        });
      }
    },
  });

  return (
    <Dialog onOpenChange={hide} open={visible}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {props.mode === "create" ? "New Department" : "Edit Department"}
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

          <form.Field name="managerId">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Manager</FieldLabel>
                  <FieldContent>
                    <Select
                      aria-invalid={isInvalid}
                      name={field.name}
                      onValueChange={(value) => field.handleChange(value)}
                      value={field.state.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=" ">None</SelectItem>
                        {props.employees?.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>

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
