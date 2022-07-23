import { get, post } from '@/utils/request.js'

export const login = (data) => post('/v1/dr/login',data);

//export const getInfo = (token) => get('/vue-admin-template/user/info?',{token});

export const logout = () => post('/v1/dr/logout');

export const getMenu = () => get('/v1/dr/get-menu');


