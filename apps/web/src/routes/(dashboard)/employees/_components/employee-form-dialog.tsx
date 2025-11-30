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
  departments: Outputs["departments"]["list"];
  positions: Outputs["positions"]["list"];
  employee?: Outputs["employees"]["list"][number];
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  departmentId: z.string().optional().nullable(),
  positionId: z.string().optional().nullable(),
  hireDate: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const EmployeeFormDialog = NiceModal.create((props: Props) => {
  const modal = NiceModal.useModal();

  const createMutation = useMutation(
    orpc.employees.create.mutationOptions({
      onSuccess: async () => {
        await props.refetch?.();
        modal.hide();
        toast.success("Employee created");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateMutation = useMutation(
    orpc.employees.update.mutationOptions({
      onSuccess: async () => {
        await props.refetch?.();
        modal.hide();
        toast.success("Employee updated");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm({
    defaultValues: {
      name: props.employee?.user.name || "",
      email: props.employee?.user.email || "",
      departmentId: props.employee?.departmentId,
      positionId: props.employee?.positionId,
      hireDate: props.employee?.hireDate
        ? new Date(props.employee.hireDate).toISOString().split("T")[0]
        : undefined,
      metadata: props.employee?.metadata,
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
          id: props.employee?.id ?? 0,
          ...value,
        });
      }
    },
  });

  React.useEffect(() => {
    form.reset({
      name: props.employee?.user.name || "",
      email: props.employee?.user.email || "",
      departmentId: props.employee?.departmentId,
      positionId: props.employee?.positionId,
      hireDate: props.employee?.hireDate
        ? new Date(props.employee.hireDate).toISOString().split("T")[0]
        : undefined,
      metadata: props.employee?.metadata as any,
    });
  }, [props.employee, form.reset]);

  return (
    <Dialog onOpenChange={modal.remove} open={modal.visible}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {props.mode === "create" ? "New Employee" : "Edit Employee"}
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
            <>
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
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
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
            </>
          )}

          <form.Field name="departmentId">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Department</FieldLabel>
                  <FieldContent>
                    <Select
                      aria-invalid={isInvalid}
                      name={field.name}
                      onValueChange={(value) =>
                        value
                          ? field.handleChange(value)
                          : field.handleChange(null)
                      }
                      value={field.state.value || undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectNoneItem value={null}>None</SelectNoneItem>
                        {props.departments?.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
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

          <form.Field name="positionId">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Position</FieldLabel>
                  <FieldContent>
                    <Select
                      aria-invalid={isInvalid}
                      name={field.name}
                      onValueChange={(value) =>
                        value
                          ? field.handleChange(value)
                          : field.handleChange(null)
                      }
                      value={field.state.value || undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectNoneItem value={null}>None</SelectNoneItem>
                        {props.positions?.map((pos) => (
                          <SelectItem key={pos.id} value={pos.id}>
                            {pos.name}
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

          <form.Field name="hireDate">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Hire Date</FieldLabel>
                  <FieldContent>
                    <Input
                      aria-invalid={isInvalid}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="date"
                      value={field.state.value || ""}
                    />
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
