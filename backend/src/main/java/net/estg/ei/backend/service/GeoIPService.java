package net.estg.ei.backend.service;

import net.estg.ei.backend.dto.GeoLocationDTO;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class GeoIPService implements IGeoIPService
{

  private static final String API_KEY = "908b5eecf334434b9ec240524e22ed6b";
  private static final String BASE_URL = "https://ipgeolocation.abstractapi.com/v1/";

  public GeoLocationDTO getGeoLocation(String ip) throws IOException
  {
    String url = BASE_URL + "?api_key=" + API_KEY + "&ip_address=" + ip;
    try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
      HttpGet request = new HttpGet(url);
      try (CloseableHttpResponse response = httpClient.execute(request)) {
        HttpEntity entity = response.getEntity();
        if (entity != null) {
          String result = EntityUtils.toString(entity);
          JSONObject json = new JSONObject(result);
          return new GeoLocationDTO(
                  String.valueOf(json.get("country")).equals("null") ? "Unknown" : json.getString("country"),
                  String.valueOf(json.get("city")).equals("null") ? "Unknown" : json.getString("city"),
                  json.getDouble("latitude"),
                  json.getDouble("longitude")
          );
        }
      }
    }
    return null;
  }
}
