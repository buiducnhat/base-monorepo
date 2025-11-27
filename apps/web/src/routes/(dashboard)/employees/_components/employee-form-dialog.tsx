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
  departments: any[];
  positions: any[];
  employee?: any;
};

const schema = z.object({
  userId: z.string().min(1, "User ID is required"),
  departmentId: z.string().optional(),
  positionId: z.string().optional(),
  hireDate: z.string().optional(),
});

export const EmployeeFormDialog = NiceModal.create((props: Props) => {
  const { visible, hide } = NiceModal.useModal();

  const createMutation = useMutation(
    orpc.employees.create.mutationOptions({
      onSuccess: async () => {
        await props.refetch?.();
        hide();
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
        hide();
        toast.success("Employee updated");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm({
    defaultValues: {
      userId: props.employee?.userId || "",
      departmentId: props.employee?.departmentId || undefined,
      positionId: props.employee?.positionId || undefined,
      hireDate: props.employee?.hireDate
        ? new Date(props.employee.hireDate).toISOString().split("T")[0]
        : undefined,
    } as z.infer<typeof schema>,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      if (props.mode === "create") {
        await createMutation.mutateAsync({
          userId: value.userId,
          departmentId: value.departmentId || undefined,
          positionId: value.positionId || undefined,
          hireDate: value.hireDate || undefined,
        });
      } else {
        await updateMutation.mutateAsync({
          id: props.employee?.id,
          departmentId: value.departmentId || undefined,
          positionId: value.positionId || undefined,
          hireDate: value.hireDate || undefined,
        });
      }
    },
  });

  return (
    <Dialog onOpenChange={hide} open={visible}>
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
            <form.Field name="userId">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      User ID (Temporary)
                    </FieldLabel>
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
                      onValueChange={(value) => field.handleChange(value)}
                      value={field.state.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=" ">None</SelectItem>
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
                      onValueChange={(value) => field.handleChange(value)}
                      value={field.state.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=" ">None</SelectItem>
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
