<template>
    <basic-container>
        <avue-crud
                :data="data"
                :table-loading="loading"
                :option="option"
                v-model="form"
                @row-del="rowDel"
                @row-update="rowUpdate"
                @row-save="rowSave"
                :before-open="beforeOpen"
                :page="page"
                @search-change="searchChange"
                @search-reset="searchReset"
                @selection-change="selectionChange"
                @current-change="currentChange"
                @size-change="sizeChange"
                @on-load="onLoad">
        </avue-crud>
    </basic-container>
</template>

<script>
    import {getByCondition,add,update,remove} from "../../../api/dict"
    export default {
        name:'index',
        data(){
            return {
                form:{},
                selectionList: [],
                loading: true,
                query:{},
                page: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                option:{
                    index:true,
                    indexLabel:'序号',
                    selection: true,
                    border:true,
                    align:'center',
                    menuAlign:'center',
                    defaultSort:{
                        prop: 'sortOrder',
                        order: 'ascending'
                    },
                    column:[
                        {
                            label:"字典KEY",
                            prop:'dictKey',
                            width:80,
                            searchLabelWidth:100,
                            searchPlaceholder:'请输入字典KEY',
                        },
                        {
                            label:'字典值',
                            prop:'dictValue',
                            width:150,
                            //search:true,
                            searchRules: [{
                                required: true,
                                message: "请输入字典值",
                                trigger: "blur"
                            }],
                        },
                        {
                            label:'排序',
                            prop:'sortOrder',
                            sortable:true,
                        },
                        {
                            label:"类别",
                            prop:'type',
                        },
                        {
                            label:'描述',
                            prop:'description',
                        },
                        {
                            label: "创建日期",
                            prop: "createTime",
                            type: "datetime",
                            width:180,
                            format: "yyyy-MM-dd hh:mm:ss",
                            valueFormat: "yyyy-MM-dd hh:mm:ss",
                        }
                    ]
                },
                data: []
            }
        },
        computed: {
            ids() {
                let ids = [];
                this.selectionList.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            },
        },
        methods:{
            rowSave(row, loading, done) {
                add(row).then(() => {
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            },
            rowUpdate(row, index, loading, done) {
                update(row).then(() => {
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            },
            rowDel(row) {
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        const params = {
                            id:row.id
                        };
                        return remove(params);
                    })
                    .then(() => {
                        this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    });
            },
            beforeOpen(done, type) {
                done();
            },
            searchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params,done) {
                params = {
                    ...this.page,
                    ...this.query
                };
                this.onLoad(params);
                done();
            },
            selectionChange(list) {
                this.selectionList = list;
            },
            currentChange(currentPage) {
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
            },
            selectionClear() {
                this.selectionList = [];
            },
            handleSettingSQL(){

            },
            onLoad(page,params ={}) {
                this.loading = true;
                params = {
                    currentPage:page.currentPage,
                    pageSize:page.pageSize,
                    ...Object.assign(this.query)
                };
                getByCondition(params).then(res => {
                    if (res.success === true){
                        const data = res.result;
                        this.page.total = data.totalElements;
                        this.data = data.content;
                        this.loading = false;
                        this.selectionClear();
                    }
                });
                this.loading = false;
            }
        }
    }
</script>


<style>
</style>
