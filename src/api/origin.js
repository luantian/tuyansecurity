
import { get, post } from '@/utils/request.js'

export const getOrigin = () => get('/v1/dr/unit-list');

export const getOriginDetail = (id) => get('/v1/dr/unit-detail/'+id+'/2');

export const addOrigin = (data) => post('/v1/dr/unit-add',data);

export const updateOrigin = (data) => post('/v1/dr/unit-update',data);

export const delOrigin = (data) => post('/v1/dr/unit-update',data);
