//多条件查询
import {get, post} from "./request";

export const  findAllData = (params)=>get('/system/data/synchronization/findAllData',params);
export const  startSync = (params)=>post('/system/data/synchronization/startSync',params);
