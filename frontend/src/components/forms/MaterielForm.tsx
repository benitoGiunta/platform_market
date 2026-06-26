import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FormActions, inputClass } from "./fields";
import { SelectInput } from "../ui/SelectInput";
import { CATEGORIE_MATERIEL } from "../../constants/enums";

const schema = z.object({
  categorie: z.enum([
    "camera",
    "drone",
    "trepied",
    "stabilisateur",
    "eclairage",
    "audio",
    "autre",
    "entreprise",
  ]),
  nom: z.string().min(1, "Requis"),
});

export type MaterielFormValues = z.infer<typeof schema>;

const categorieOptions = Object.entries(CATEGORIE_MATERIEL).map(([value, label]) => ({
  value,
  label,
}));

export function MaterielForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<MaterielFormValues>;
  submitting?: boolean;
  onSubmit: (values: MaterielFormValues) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MaterielFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { categorie: "camera", nom: "", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Field label="Catégorie" error={errors.categorie?.message}>
        <Controller
          name="categorie"
          control={control}
          render={({ field }) => (
            <SelectInput
              inputId="categorie"
              value={field.value}
              onChange={field.onChange}
              options={categorieOptions}
            />
          )}
        />
      </Field>
      <Field label="Nom" error={errors.nom?.message}>
        <input className={inputClass} {...register("nom")} />
      </Field>
      <FormActions submitting={submitting} onCancel={onCancel} />
    </form>
  );
}
