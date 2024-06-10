package net.estg.ei.backend.utils;

import java.util.HashMap;
import java.util.Map;

public class ProtocolUtils
{
  private static final Map<Integer, String> protocolMap = new HashMap<>();
  static {
    protocolMap.put(1, "ICMP");
    protocolMap.put(6, "TCP");
    protocolMap.put(17, "UDP");
    // Add other protocols as needed
  }

  public static String getProtocolName(int protocolNumber) {
    return protocolMap.getOrDefault(protocolNumber, "Unknown");
  }
}
