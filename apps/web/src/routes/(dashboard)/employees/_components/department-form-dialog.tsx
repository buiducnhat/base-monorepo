import NiceModal from "@ebay/nice-modal-react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import React from "react";
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
  SelectNoneItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Outputs, orpc } from "@/lib/orpc";

type Props = {
  mode: "create" | "update";
  refetch?: () => Promise<any>;
  employees: Outputs["employees"]["list"];
  department?: Outputs["departments"]["list"][number];
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  managerId: z.number().optional().nullable(),
});

export const DepartmentFormDialog = NiceModal.create((props: Props) => {
  const modal = NiceModal.useModal();

  const createMutation = useMutation(
    orpc.departments.create.mutationOptions({
      onSuccess: async () => {
        await props.refetch?.();
        modal.hide();
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
        modal.hide();
        toast.success("Department updated");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm({
    defaultValues: {
      name: props.department?.name,
      description: props.department?.description,
      managerId: props.department?.managerId,
    } as z.infer<typeof schema>,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      if (props.mode === "create") {
        await createMutation.mutateAsync({
          ...value,
        });
      } else {
        await updateMutation.mutateAsync({
          id: props.department?.id ?? "",
          ...value,
        });
      }
    },
  });

  React.useEffect(() => {
    form.reset({
      name: props.department?.name ?? "",
      description: props.department?.description,
      managerId: props.department?.managerId,
    });
  }, [props.department, form.reset]);

  return (
    <Dialog onOpenChange={modal.remove} open={modal.visible}>
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
                      value={field.state.value ?? undefined}
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
                      onValueChange={(v) =>
                        v
                          ? field.handleChange(Number(v))
                          : field.handleChange(null)
                      }
                      value={
                        field.state.value
                          ? field.state.value.toString()
                          : undefined
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectNoneItem value={null}>None</SelectNoneItem>
                        {props.employees?.map((emp) => (
                          <SelectItem
                            key={emp.id.toString()}
                            value={emp.id.toString()}
                          >
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
            <Button onClick={modal.hide} type="button" variant="outline">
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
