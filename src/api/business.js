import { get, post } from '@/utils/request.js'

export const getList = (data) => post('/v1/dr/get-user-list',data);

export const getDetail = (key) => get('/v1/dr/get-user-detail/'+key);

export const addUser = (data) => post('/v1/dr/add-user',data);

export const changeUser = (data) => post('/v1/dr/business-user-event',data);

export const updataUser = (data) => post('/v1/dr/update-user',data);

