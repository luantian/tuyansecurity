import { get, post } from '@/utils/request.js'

//获取时间
export const getTime = () => get('https://quan.suning.com/getSysTime.do');

export const getWeather = (data) => get('https://restapi.amap.com/v3/weather/weatherInfo',data);

