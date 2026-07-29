import z from 'zod';

export const SelectedMunicipalitySchema = z.object({
  municipalityId: z.string().trim().min(1, { message: 'Elegí un municipio' }),
});

export type SelectedMunicipalitySchemaType = z.infer<
  typeof SelectedMunicipalitySchema
>;

export const LocationFormSchema = z.object({
  provinceId: z.string().trim().min(1, { message: 'Elegí una provincia' }),
  municipalityId: z.string().trim().min(1, { message: 'Elegí un municipio' }),
});

export type LocationFormSchemaType = z.infer<typeof LocationFormSchema>;
