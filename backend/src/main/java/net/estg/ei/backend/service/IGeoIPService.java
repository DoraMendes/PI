package net.estg.ei.backend.service;

import net.estg.ei.backend.dto.GeoLocationDTO;

import java.io.IOException;

public interface IGeoIPService
{

  GeoLocationDTO getGeoLocation(String ip) throws IOException;
}
