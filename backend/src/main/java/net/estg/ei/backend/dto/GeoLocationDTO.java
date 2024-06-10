package net.estg.ei.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GeoLocationDTO
{
  private String country;
  private String city;
  private double latitude;
  private double longitude;
}
