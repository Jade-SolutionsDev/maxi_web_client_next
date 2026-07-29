import type {
  Municipality,
  MunicipalityResponse,
  Province,
  ProvinceResponse,
} from '../type/location.interface';

export const toProvince = (province: ProvinceResponse): Province => ({
  id: province.id,
  name: province.name.trim(),
  code: province.code,
});

export const toMunicipality = (
  municipality: MunicipalityResponse,
): Municipality => ({
  id: municipality.id,
  provinceId: municipality.provinceId,
  name: municipality.name.trim(),
  code: municipality.code,
});
