import { get, post } from '@/utils/request.js'

export const getRoles = (data) => post('/v1/dr/get-role-list',data);

export const getRoleType = () => get('/v1/dr/get-role-type');

export const addRole = (data) => post('/v1/dr/add-role',data);

export const updateRole = (data) => post('/v1/dr/update-role',data);

export const detailRole = (key) => get('/v1/dr/get-role-detail/'+key);

export const getTree = (key) => get('/v1/dr/get-any-power');

export const getAllRoles = () => get('/v1/dr/get-role-all');

export const getMenu = (data) => post('/v1/dr/get-power',data);

export const addMenu = (data) => post('/v1/dr/add-power',data);

export const updateMenu = (data) => post('/v1/dr/update-power',data);

export const detailMenu = (data) => get('/v1/dr/get-power-detail/'+data);

export const getupMenu = (data) => get('/v1/dr/get-power-up/'+data);
