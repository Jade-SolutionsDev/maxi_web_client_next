/**
 * Raw province as returned by `GET /provinces`.
 *
 * Unlike products or categories, this endpoint returns the collection directly
 * inside `data` — there is no pagination envelope.
 */
export interface ProvinceResponse {
  id: string;
  name: string;
  /** ISO 3166-2 subdivision code, e.g. "CU-03" for La Habana. */
  code: string;
}

/** Raw municipality as returned by `GET /provinces/{provinceId}/municipalities`. */
export interface MunicipalityResponse {
  id: string;
  /** Owning province; the API repeats it on every row so lists stay self-contained. */
  provinceId: string;
  name: string;
  /** Province code extended with the municipality index, e.g. "CU-03-09". */
  code: string;
}

export interface Province {
  id: string;
  name: string;
  code: string;
}

export interface Municipality {
  id: string;
  provinceId: string;
  name: string;
  code: string;
}

export interface LocationOption {
  value: string;
  label: string;
}

export interface LocationCatalog {
  provinces: Province[];
  municipalitiesByProvince: Record<string, Municipality[]>;
}

export interface SelectedLocation {
  provinceId: string;
  provinceName: string;
  municipalityId: string;
  municipalityName: string;
}
