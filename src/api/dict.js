import {get,post} from './request';


//多条件查询
export const  getByCondition = (params)=>get('/system/dict/getByCondition',params);

//增加
export const add = (params) => post('/system/dict/save',params);
//更新
export const update = (params) => post('/system/dict/update',params);
//删除
export const remove = (params) => get('/system/dict/deleteById',params);