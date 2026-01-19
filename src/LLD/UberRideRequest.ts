type LatLng = {
  lat: number;
  lng: number;
};

type GeoCellId = string;

interface GeoHashService {
  encode(location: LatLng): GeoCellId;
  getNearbyCells(cellId: GeoCellId, radius: number): GeoCellId[];
}

interface AvailabilityRepository {
  increment(cellId: GeoCellId): void;
  decrement(cellId: GeoCellId): void;
  getCount(cellId: GeoCellId): number;
}

class GeoHashServiceImpl implements GeoHashService {
  encode(location: LatLng): GeoCellId {
    // simplified
    return `${Math.floor(location.lat)}:${Math.floor(location.lng)}`;
  }

  getNearbyCells(cellId: GeoCellId, radius: number): GeoCellId[] {
    // return neighboring cell ids
    return [cellId]; // simplified
  }
}

class RedisAvailabilityRepository implements AvailabilityRepository {
  increment(cellId: GeoCellId): void {
    // redis.incr(cellId)
  }

  decrement(cellId: GeoCellId): void {
    // redis.decr(cellId)
  }

  getCount(cellId: GeoCellId): number {
    return 10; // mock
  }
}

class DriverLocationService {
  constructor(
    private geoHashService: GeoHashService,
    private availabilityRepo: AvailabilityRepository
  ) {}

  updateDriverLocation(
    driverId: string,
    location: LatLng,
    isAvailable: boolean
  ) {
    const cellId = this.geoHashService.encode(location);

    if (isAvailable) {
      this.availabilityRepo.increment(cellId);
    } else {
      this.availabilityRepo.decrement(cellId);
    }
  }
}

class NearbyCabsService {
  constructor(
    private geoHashService: GeoHashService,
    private availabilityRepo: AvailabilityRepository
  ) {}

  getNearbyCabCount(
    location: LatLng,
    radius: number
  ): number {
    const cellId = this.geoHashService.encode(location);
    const nearbyCells = this.geoHashService.getNearbyCells(cellId, radius);

    let total = 0;
    for (const cell of nearbyCells) {
      total += this.availabilityRepo.getCount(cell);
    }

    return total;
  }
}

class PassengerController {
  constructor(private nearbyCabsService: NearbyCabsService) {}

  getNearbyCabs(location: LatLng) {
    return {
      approxCabs: this.nearbyCabsService.getNearbyCabCount(location, 2)
    };
  }
}
