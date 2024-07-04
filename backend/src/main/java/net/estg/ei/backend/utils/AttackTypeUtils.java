package net.estg.ei.backend.utils;

import java.util.List;

import net.estg.ei.backend.enums.AttackType;

public class AttackTypeUtils {

    public static AttackType getAttackType(List<Double> predictions) {
        return switch (1) {
            case predictions.get(1).intValue() -> AttackType.APACHE_KILLER;
            case predictions.get(2).intValue() -> AttackType.RUDY;
            case predictions.get(3).intValue() -> AttackType.SLOW_READ;
            case predictions.get(4).intValue() -> AttackType.SLOW_LORIS;
            case predictions.get(5).intValue() -> AttackType.ARP_SPOOFING;
            case predictions.get(6).intValue() -> AttackType.CAM_OVERFLOW;
            case predictions.get(7).intValue() -> AttackType.MQTT_MALARIA;
            case predictions.get(8).intValue() -> AttackType.NETWORK_SCAN;
            default -> AttackType.UNKNOWN;
        }
    } 
}
