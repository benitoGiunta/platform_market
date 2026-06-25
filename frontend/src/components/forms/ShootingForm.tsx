import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FormActions, inputClass } from "./fields";
import { STATUT_SHOOTING } from "../../constants/enums";
import { useClients } from "../../hooks/useClients";

const schema = z.object({
  nom: z.string().min(1, "Requis"),
  client_id: z.string(),
  lieu: z.string(),
  date: z.string().min(1, "Date requise"),
  duree: z.number().int().nonnegative("Invalide"),
  statut: z.enum(["planifie", "en_cours", "termine", "annule"]),
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
  const clients = list.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShootingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: "",
      client_id: "",
      lieu: "",
      date: "",
      duree: 0,
      statut: "planifie",
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
        <select className={inputClass} {...register("client_id")}>
          <option value="">—</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
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
        <select className={inputClass} {...register("statut")}>
          {Object.entries(STATUT_SHOOTING).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
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
