import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FormActions, inputClass } from "./fields";
import { SelectInput } from "../ui/SelectInput";
import { DOMAINE_METIER } from "../../constants/enums";

const schema = z.object({
  nom: z.string().min(1, "Requis"),
  nom_legal: z.string(),
  adresse: z.string(),
  numero_tva: z.string(),
  domaine_metier: z.string(),
  date_creation: z.string(),
  email: z.string().email("Email invalide").or(z.literal("")),
  telephone: z.string(),
  site_web: z.string(),
});

type ClientFormValues = z.infer<typeof schema>;

export interface ClientInput {
  nom: string;
  nom_legal: string;
  adresse: string;
  numero_tva: string;
  domaine_metier: string | null;
  date_creation: string | null;
  email: string;
  telephone: string;
  site_web: string;
}

const domaineOptions = Object.entries(DOMAINE_METIER).map(([value, label]) => ({ value, label }));

export function ClientForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<ClientFormValues>;
  submitting?: boolean;
  onSubmit: (values: ClientInput) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: "",
      nom_legal: "",
      adresse: "",
      numero_tva: "",
      domaine_metier: "",
      date_creation: "",
      email: "",
      telephone: "",
      site_web: "",
      ...defaultValues,
    },
  });

  const submit = (v: ClientFormValues) =>
    onSubmit({
      ...v,
      domaine_metier: v.domaine_metier || null,
      date_creation: v.date_creation || null,
    });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      <Field label="Nom" error={errors.nom?.message}>
        <input className={inputClass} {...register("nom")} />
      </Field>
      <Field label="Nom légal" error={errors.nom_legal?.message}>
        <input className={inputClass} {...register("nom_legal")} />
      </Field>
      <Field label="Adresse" error={errors.adresse?.message}>
        <input className={inputClass} {...register("adresse")} />
      </Field>
      <Field label="Numéro TVA" error={errors.numero_tva?.message}>
        <input className={inputClass} {...register("numero_tva")} />
      </Field>
      <Field label="Domaine métier" error={errors.domaine_metier?.message}>
        <Controller
          name="domaine_metier"
          control={control}
          render={({ field }) => (
            <SelectInput
              inputId="domaine_metier"
              value={field.value}
              onChange={field.onChange}
              options={domaineOptions}
              placeholder="—"
              isClearable
            />
          )}
        />
      </Field>
      <Field label="Date de création" error={errors.date_creation?.message}>
        <input type="date" className={inputClass} {...register("date_creation")} />
      </Field>
      <Field label="Site web" error={errors.site_web?.message}>
        <input className={inputClass} placeholder="https://…" {...register("site_web")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input className={inputClass} {...register("email")} />
      </Field>
      <Field label="Téléphone" error={errors.telephone?.message}>
        <input className={inputClass} {...register("telephone")} />
      </Field>
      <FormActions submitting={submitting} onCancel={onCancel} />
    </form>
  );
}
