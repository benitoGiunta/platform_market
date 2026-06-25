import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FormActions, inputClass } from "./fields";
import { STATUT_VIDEASTE } from "../../constants/enums";

const schema = z.object({
  nom: z.string().min(1, "Requis"),
  prenom: z.string().min(1, "Requis"),
  email: z.string().email("Email invalide").or(z.literal("")),
  telephone: z.string(),
  statut: z.enum(["actif", "inactif"]),
  taux_horaire: z.number().nonnegative("Invalide"),
});

export type VideasteFormValues = z.infer<typeof schema>;

export function VideasteForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<VideasteFormValues>;
  submitting?: boolean;
  onSubmit: (values: VideasteFormValues) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VideasteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      statut: "actif",
      taux_horaire: 0,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Field label="Nom" error={errors.nom?.message}>
        <input className={inputClass} {...register("nom")} />
      </Field>
      <Field label="Prénom" error={errors.prenom?.message}>
        <input className={inputClass} {...register("prenom")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input className={inputClass} {...register("email")} />
      </Field>
      <Field label="Téléphone" error={errors.telephone?.message}>
        <input className={inputClass} {...register("telephone")} />
      </Field>
      <Field label="Statut" error={errors.statut?.message}>
        <select className={inputClass} {...register("statut")}>
          {Object.entries(STATUT_VIDEASTE).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Taux horaire (€/h)" error={errors.taux_horaire?.message}>
        <input
          type="number"
          step="0.01"
          className={inputClass}
          {...register("taux_horaire", { valueAsNumber: true })}
        />
      </Field>
      <FormActions submitting={submitting} onCancel={onCancel} />
    </form>
  );
}
