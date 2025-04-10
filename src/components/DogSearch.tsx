import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Typography,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Box,
  Button,
  Paper,
  CircularProgress,
  SelectChangeEvent,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getBreeds, searchDogs, getDogs, searchLocations } from '../api/fetchApi';
import { Dog } from '../types/types';
import DogCard from './DogCard';
import Favorites from './Favorites';
import MatchResult from './MatchResult';

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const FiltersContainer = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`;

const ResultsContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 80px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const FilterButton = styled(IconButton)`
  background-color: rgb(9 3 37);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  &:hover {
    background-color: rgb(40 34 67);
  }
`;

const FavoritesButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  min-width: 200px;
  
  @media (max-width: 600px) {
    min-width: 160px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const ClearButton = styled(Button)`
  margin-top: 32px;
`;

const LoadingOverlay = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
`;

const LocationButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 24px;
  padding: 8px 16px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
`;

const LocationCard = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  margin-bottom: 20px;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(250,250,255,1) 0%, rgba(240,245,255,1) 100%);
`;

interface DogSearchProps {
  onToggleFavoritesDrawer?: () => void;
  onFavoritesCountChange?: (count: number) => void;
  showFavoritesDrawer?: boolean;
}

const DogSearch = ({ 
  onToggleFavoritesDrawer,
  onFavoritesCountChange,
  showFavoritesDrawer
}: DogSearchProps) => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('breed:asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [userLocation, setUserLocation] = useState<{city: string, state: string} | null>(null);
  const [nearbyZipCodes, setNearbyZipCodes] = useState<string[]>([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const pageSize = 20;

  useEffect(() => {
    fetchDogs();
  }, [selectedBreeds, sortOrder, page, nearbyZipCodes]);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setLoading(true);
        const breedsData = await getBreeds();
        setBreeds(breedsData);
      } catch (error) {
        console.error('Error fetching breeds:', error);
        setError('Failed to load dog breeds. Please try refreshing the page.');
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);
  
  useEffect(() => {
    if (onFavoritesCountChange) {
      onFavoritesCountChange(favorites.length);
    }
  }, [favorites, onFavoritesCountChange]);

  useEffect(() => {
    if (showFavoritesDrawer !== undefined) {
      setShowFavorites(showFavoritesDrawer);
    }
  }, [showFavoritesDrawer]);
  
  const fetchDogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        size: pageSize,
        sort: sortOrder,
      };

      if (selectedBreeds.length > 0) {
        params.breeds = selectedBreeds;
      }

      if (page > 1) {
        params.from = (page - 1) * pageSize;
      }

      if (nearbyZipCodes.length > 0) {
        params.zipCodes = nearbyZipCodes;
      }

      const searchResult = await searchDogs(params);
      
      if (searchResult.resultIds.length === 0) {
        setDogs([]);
        setTotalPages(0);
        setLoading(false);
        return;
      }
      
      const dogsData = await getDogs(searchResult.resultIds);
      setDogs(dogsData);
      
      setTotalPages(Math.ceil(searchResult.total / pageSize));
    } catch (error) {
      console.error('Error fetching dogs:', error);
      setError('Failed to fetch dogs. Please try again.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBreedChange = (event: SelectChangeEvent<typeof selectedBreeds>) => {
    const {
      target: { value },
    } = event;
    setSelectedBreeds(
      typeof value === 'string' ? value.split(',') : value,
    );
    setPage(1);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (dog: Dog) => {
    if (favorites.some((fav) => fav.id === dog.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== dog.id));
    } else {
      setFavorites([...favorites, dog]);
    }
  };

  const toggleFavoritesDrawer = () => {
    if (onToggleFavoritesDrawer) {
      onToggleFavoritesDrawer();
    } else {
      setShowFavorites(!showFavorites);
    }
  };

  const toggleFiltersDrawer = () => {
    setShowFilters(!showFilters);
  };

  const handleClearFilters = () => {
    setSelectedBreeds([]);
    setSortOrder('breed:asc');
    setNearbyZipCodes([]);
    setUserLocation(null);
    setPage(1);
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleDeleteBreed = (breedToDelete: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    setTimeout(() => {
      setSelectedBreeds(prev => prev.filter(b => b !== breedToDelete));
      setPage(1);
    }, 10);
  };

  const findDogsNearMe = async () => {
    setLocationLoading(true);
    setError(null);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      const miles = 20;
      const degreesMile = 1/69;
      const degreesRange = miles * degreesMile;
      
      const boundingBox = {
        top: latitude + degreesRange,
        bottom: latitude - degreesRange,
        left: longitude - degreesRange,
        right: longitude + degreesRange
      };
      
      const locationResults = await searchLocations({
        geoBoundingBox: boundingBox,
        size: 100
      });
      
      if (locationResults.results.length > 0) {
        const zipCodes = locationResults.results.map(loc => loc.zip_code);
        setNearbyZipCodes(zipCodes);
        
        const firstLocation = locationResults.results[0];
        setUserLocation({
          city: firstLocation.city,
          state: firstLocation.state
        });
        
        setPage(1);
      } else {
        setError("No locations found near you. Try a different location or remove the filter.");
        setShowError(true);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setError('Failed to access your location. Please make sure location services are enabled and try again.');
      setShowError(true);
      setNearbyZipCodes([]);
      setUserLocation(null);
    } finally {
      setLocationLoading(false);
    }
  };

  const renderFilters = () => (
    <FiltersContainer>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="breed-select-label" sx={{ bgcolor: 'white', px: 0.5 }}>Breeds</InputLabel>
            <Select
              labelId="breed-select-label"
              multiple
              value={selectedBreeds}
              onChange={handleBreedChange}
              input={<OutlinedInput id="select-multiple-chip" label="Breeds" />}
              renderValue={(selected) => (
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 0.5,
                  maxHeight: '36px',  
                  overflow: 'hidden',
                  alignItems: 'center'
                }}>
                  {selected.length === 0 ? (
                    <em>Select breeds</em>
                  ) : (
                    <>
                      {selected.map((value, index) => (
                        index < 3 && (
                          <Chip 
                            key={value} 
                            label={value}
                            size="small"
                            onDelete={(event) => handleDeleteBreed(value, event)}
                            onMouseDown={(event) => event.stopPropagation()}
                            sx={{ 
                              m: 0.1,
                              height: '24px',
                              '& .MuiChip-label': { 
                                fontSize: '0.75rem',
                                px: 1
                              }
                            }}
                          />
                        )
                      ))}
                      {selected.length > 3 && (
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
                          +{selected.length - 3} more
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {breeds
                .filter(breed => !selectedBreeds.includes(breed))
                .map((breed) => (
                  <MenuItem key={breed} value={breed}>
                    {breed}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="sort-select-label" sx={{ bgcolor: 'white', px: 0.5 }}>Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortOrder}
              label="Sort By"
              onChange={handleSortChange}
              input={<OutlinedInput />}
            >
              <MenuItem value="breed:asc">Breed (A-Z)</MenuItem>
              <MenuItem value="breed:desc">Breed (Z-A)</MenuItem>
              <MenuItem value="name:asc">Name (A-Z)</MenuItem>
              <MenuItem value="name:desc">Name (Z-A)</MenuItem>
              <MenuItem value="age:asc">Age (Youngest First)</MenuItem>
              <MenuItem value="age:desc">Age (Oldest First)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <ClearButton
        variant="outlined"
        color="primary"
        onClick={handleClearFilters}
        fullWidth
        disabled={selectedBreeds.length === 0 && sortOrder === 'breed:asc' && nearbyZipCodes.length === 0}
        sx={{ mt: 4 }}
      >
        Clear All Filters
      </ClearButton>
    </FiltersContainer>
  );

  return (
    <SearchContainer>
      {/* header section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        mb: 2
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontSize: isMobile ? '1.75rem' : '2.25rem',
            textAlign: 'center'
          }}
        >
          Fetch Your Perfect Dog
        </Typography>
        {isMobile && (
          <FilterButton
            aria-label="filter"
            onClick={toggleFiltersDrawer}
            sx={{ 
              position: 'absolute',
              right: 0
            }}
          >
            <FilterListIcon />
          </FilterButton>
        )}
      </Box>

      {/* location section */}
      {userLocation ? (
        <LocationCard elevation={1}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Your Location
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {userLocation.city}, {userLocation.state}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              variant="outlined" 
              color="primary"
              onClick={handleClearFilters}
              disabled={locationLoading}
            >
              Clear
            </Button>
            <Button 
              size="small"
              variant="contained" 
              color="primary"
              onClick={findDogsNearMe}
              disabled={locationLoading}
              startIcon={locationLoading ? <CircularProgress size={16} /> : <LocationOnIcon />}
              sx={{ color: 'white' }}
            >
              Update
            </Button>
          </Box>
        </LocationCard>
      ) : (
        <LocationButton
          variant="contained"
          color="primary"
          onClick={findDogsNearMe}
          disabled={locationLoading}
          startIcon={locationLoading ? <CircularProgress size={20} /> : <LocationOnIcon />}
          fullWidth
          sx={{ 
            mb: 3,
            color: 'white',
            height: '48px'
          }}
        >
          Find Dogs Near Me
        </LocationButton>
      )}

      {/* filters section */}
      {isMobile ? (
        <Drawer anchor="top" open={showFilters} onClose={toggleFiltersDrawer}>
          <Box sx={{ padding: 2 }}>
            {renderFilters()}
            <Button variant="contained" onClick={toggleFiltersDrawer} fullWidth sx={{ color: 'white' }}>
              Apply Filters
            </Button>
          </Box>
        </Drawer>
      ) : (
        renderFilters()
      )}

      {/* results section */}
      <ResultsContainer>
        {loading ? (
          <LoadingOverlay>
            <CircularProgress size={40} />
            <Typography variant="body1">Fetching dogs...</Typography>
          </LoadingOverlay>
        ) : (
          <>
            <Grid container spacing={isMobile ? 2 : 3}>
              {dogs.map((dog) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={dog.id}>
                  <DogCard
                    dog={dog}
                    isFavorite={favorites.some((fav) => fav.id === dog.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </Grid>
              ))}
            </Grid>

            {/* empty state */}
            {dogs.length === 0 && (
              <Box my={4} textAlign="center">
                <Typography variant="h6" gutterBottom>
                  No dogs found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your filters or try again later
                </Typography>
              </Box>
            )}

            {/* pagination */}
            {totalPages > 1 && (
              <PaginationContainer>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                  siblingCount={isTablet ? 0 : 1}
                  sx={{
                    '& .Mui-selected': {
                      color: 'white !important'
                    }
                  }}
                />
              </PaginationContainer>
            )}
          </>
        )}
      </ResultsContainer>

      {/* favorites drawer */}
      <Drawer anchor={isMobile ? "bottom" : "right"} open={showFavorites} onClose={toggleFavoritesDrawer}>
        <Box sx={{ 
          width: isMobile ? '100vw' : 400,
          maxHeight: isMobile ? '80vh' : '100vh'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 1 }}>
            <Button 
              onClick={toggleFavoritesDrawer}
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 2 }}
            >
              Back
            </Button>
          </Box>
          <Favorites
            favorites={favorites}
            onRemoveFavorite={toggleFavorite}
            onClose={toggleFavoritesDrawer}
            onMatch={(dog) => {
              setMatchedDog(dog);
              setShowFavorites(false);
            }}
          />
        </Box>
      </Drawer>

      {/* match result modal */}
      {matchedDog && (
        <MatchResult
          dog={matchedDog}
          onClose={() => setMatchedDog(null)}
        />
      )}

      {/* favorites button */}
      <FavoritesButton
        variant="contained"
        color="secondary"
        startIcon={<FavoriteIcon />}
        onClick={toggleFavoritesDrawer}
        size={isMobile ? "medium" : "large"}
        sx={{ color: 'white' }}
      >
        Favorites ({favorites.length})
      </FavoritesButton>

      {/* error snackbar */}
      <Snackbar
        open={showError && !!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </SearchContainer>
  );
};

export { DogSearch };
export type { Dog };
export default DogSearch; 