package net.estg.ei.backend.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import net.estg.ei.backend.enums.AttackType;

public class AttackTypeUtils {
    private static ArrayList<AttackType> attackTypeDoubleListMapping = new ArrayList<>(
        Arrays.asList(AttackType.APACHE_KILLER, AttackType.RUDY, AttackType.SLOW_READ,
        AttackType.SLOW_LORIS, AttackType.ARP_SPOOFING, AttackType.CAM_OVERFLOW,
        AttackType.MQTT_MALARIA, AttackType.NETWORK_SCAN)
    );

    public static AttackType getAttackType(List<Double> predictions) {
        for (int i = 1; i < predictions.size(); i++) {
            if (predictions.get(i) == 1.0) return attackTypeDoubleListMapping.get(i); 
        }
        
        return AttackType.UNKNOWN;
    } 
}
