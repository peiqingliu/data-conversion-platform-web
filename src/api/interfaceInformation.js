import {get,post} from './request';


//多条件查询
export const  getByCondition = (params)=>get('/system/interfaceInformation/getByCondition',params);

//增加
export const add = (params) => post('/system/interfaceInformation/save',params);
//更新
export const update = (params) => post('/system/interfaceInformation/update',params);
//删除
export const remove = (params) => get('/system/interfaceInformation/deleteById',params);

export const startTask = (params) => post('/system/interfaceInformation/startTask',params);
