'use server'

import IPinfoWrapper, { IPinfo, AsnResponse } from "node-ipinfo";
import Redis from "ioredis"

const ipinfoWrapper = new IPinfoWrapper(process.env.IP_INFO_TOKEN);
const client = new Redis(`rediss://default:${process.env.UPSTASH_PASSWORD}@${process.env.UPSTASH_DOMAIN}:6379`);
// cache it somewhere

export async function getLocationIpInfo(ip: string | null): Promise<IPinfo | null> {
    if (!ip) return null;

    if (ip.startsWith("10")) return null;
    if (ip.startsWith("172.16")) return null;
    if (ip.startsWith("192.168")) return null;
    
    const cachedValue = await client.get(ip);
    
    if (cachedValue) return JSON.parse(cachedValue);

    const newIpInfo = await ipinfoWrapper.lookupIp(ip);
    client.set(ip, JSON.stringify(newIpInfo));
    return newIpInfo;
}
