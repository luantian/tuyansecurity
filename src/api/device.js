
import { get, post } from '@/utils/request.js'

export const getDevice = (data) => post('/v1/dr/device-list',data);

export const getDeviceDetail = (key) => get('/v1/dr/get-device-detail/'+key);

export const addDevice = (data) => post('/v1/dr/device-add',data);

export const updateDevice = (data) => post('/v1/dr/device-update',data);

export const changeDevice = (data) => post('/v1/dr/device-event',data);

export const noticeList = (data) => post('/v1/dr/notice-list',data);

export const defence = (dr_device_serial,defence) => get(`/v1/dr/device-defence/${dr_device_serial}/${defence}`);

export const lock = (dr_device_serial,defence) => get(`/v1/dr/device-encrypt/${dr_device_serial}/${defence}`);

export const switch_ = (data) => post(`/v1/dr/switch-socket`,data);

export const delDevice = (data) => post('/v1/dr/device-del',data);

