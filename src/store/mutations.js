import {setStore} from '../util/store'

const mutations = {
    //保存token
    COMMIT_TOKEN(state, object) {
        state.token = object.result.username;
    },
    SET_USER_INFO: (state, object) => {
        state.userInfo = object.result;
        setStore({name: 'userInfo', content: state.userInfo})
    },
    //保存标签
    TAGES_LIST(state, arr) {
        state.tagsList = arr;
    },
    IS_COLLAPSE(state, bool) {
        state.isCollapse = bool;
    }
};
export default mutations