import type { Catalog, Country } from './catalogs.types';

export interface UserProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Catalog; // Objeto {id, name}
  role: Catalog; // Objeto {id, name}
  country: Country; // Objeto {id, name, isoCode...}
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
  countryId: number;
  genderId: number;
}
