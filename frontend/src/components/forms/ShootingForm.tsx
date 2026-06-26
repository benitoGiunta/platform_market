import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FormActions, inputClass } from "./fields";
import { SelectInput } from "../ui/SelectInput";
import { STATUT_SHOOTING } from "../../constants/enums";
import { useClients } from "../../hooks/useClients";

const schema = z.object({
  nom: z.string().min(1, "Requis"),
  client_id: z.string(),
  lieu: z.string(),
  date: z.string().min(1, "Date requise"),
  duree: z.number().int().nonnegative("Invalide"),
  statut: z.enum(["script", "planifie", "tournage", "montage", "revision", "termine"]),
  taux_horaire_client: z.number().nonnegative("Invalide"),
});

type ShootingFormValues = z.infer<typeof schema>;

export interface ShootingInput {
  nom: string;
  client_id: number | null;
  lieu: string;
  date: string;
  duree: number;
  statut: ShootingFormValues["statut"];
  taux_horaire_client: number;
}

const statutOptions = Object.entries(STATUT_SHOOTING).map(([value, label]) => ({ value, label }));

export function ShootingForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<ShootingFormValues>;
  submitting?: boolean;
  onSubmit: (values: ShootingInput) => void;
  onCancel: () => void;
}) {
  const { list } = useClients();
  const clientOptions = (list.data ?? []).map((c) => ({ value: String(c.id), label: c.nom }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ShootingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: "",
      client_id: "",
      lieu: "",
      date: "",
      duree: 0,
      statut: "script",
      taux_horaire_client: 0,
      ...defaultValues,
    },
  });

  const submit = (v: ShootingFormValues) =>
    onSubmit({ ...v, client_id: v.client_id === "" ? null : Number(v.client_id) });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      <Field label="Nom" error={errors.nom?.message}>
        <input className={inputClass} {...register("nom")} />
      </Field>
      <Field label="Client" error={errors.client_id?.message}>
        <Controller
          name="client_id"
          control={control}
          render={({ field }) => (
            <SelectInput
              inputId="client_id"
              value={field.value}
              onChange={field.onChange}
              options={clientOptions}
              placeholder="— Aucun —"
              isClearable
            />
          )}
        />
      </Field>
      <Field label="Lieu" error={errors.lieu?.message}>
        <input className={inputClass} {...register("lieu")} />
      </Field>
      <Field label="Date" error={errors.date?.message}>
        <input type="date" className={inputClass} {...register("date")} />
      </Field>
      <Field label="Durée (minutes)" error={errors.duree?.message}>
        <input
          type="number"
          className={inputClass}
          {...register("duree", { valueAsNumber: true })}
        />
      </Field>
      <Field label="Statut" error={errors.statut?.message}>
        <Controller
          name="statut"
          control={control}
          render={({ field }) => (
            <SelectInput
              inputId="statut"
              value={field.value}
              onChange={field.onChange}
              options={statutOptions}
            />
          )}
        />
      </Field>
      <Field label="Taux horaire client (€/h)" error={errors.taux_horaire_client?.message}>
        <input
          type="number"
          step="0.01"
          className={inputClass}
          {...register("taux_horaire_client", { valueAsNumber: true })}
        />
      </Field>
      <FormActions submitting={submitting} onCancel={onCancel} />
    </form>
  );
}
