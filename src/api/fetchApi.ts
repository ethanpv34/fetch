import axios from 'axios';
import { Dog, Location, SearchResult, Match, User, Coordinates } from '../types/types';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const login = async (user: User) => {
  try {
    const response = await api.post('/auth/login', user);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getBreeds = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/dogs/breeds');
  return response.data;
};

export const searchDogs = async (params: {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}): Promise<SearchResult> => {
  const response = await api.get<SearchResult>('/dogs/search', { params });
  return response.data;
};

export const getDogs = async (dogIds: string[]): Promise<Dog[]> => {
  const response = await api.post<Dog[]>('/dogs', dogIds);
  return response.data;
};

export const getMatch = async (dogIds: string[]): Promise<Match> => {
  const response = await api.post<Match>('/dogs/match', dogIds);
  return response.data;
};

export const getLocations = async (zipCodes: string[]): Promise<Location[]> => {
  const response = await api.post<Location[]>('/locations', zipCodes);
  return response.data;
};

export interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    bottom_left?: Coordinates;
    top_right?: Coordinates;
    bottom_right?: Coordinates;
    top_left?: Coordinates;
  };
  size?: number;
  from?: number;
}

export interface LocationSearchResult {
  results: Location[];
  total: number;
}

export const searchLocations = async (params: LocationSearchParams): Promise<LocationSearchResult> => {
  const response = await api.post<LocationSearchResult>('/locations/search', params);
  return response.data;
}; 