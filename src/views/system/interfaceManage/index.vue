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
            <template slot="menuLeft">
                <el-button type="primary"
                           size="small"
                           plain
                           icon="el-icon-edit"
                           @click="handleSettingSQL">配置SQL
                </el-button>
            </template>
        </avue-crud>

        <el-dialog
                title="请配置sql"
                :visible.sync="dialogVisible"
                width="50%">
            <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 10}"
                    placeholder="请输入需要配置的sql"
                    v-model="sql">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitSql">确 定</el-button>
            </span>
        </el-dialog>

    </basic-container>
</template>

<script>
    import {getByCondition,add,update,remove} from "../../../api/interfaceInformation"
    export default {
        name:'index',
        data(){
            return {
                form:{},
                selectionList: [],
                loading: true,
                query:{},
                sql:'',
                dialogVisible:false,
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
                    title:'接口信息列表',
                    align:'center',
                    menuAlign:'center',
                    menuWidth:150,
                    defaultSort:{
                        prop: 'siteIndex',
                        order: 'ascending'
                    },
                    column:[
                        {
                            label:"接口名称",
                            prop:'interfaceName',
                            //search:true,
                            width:180,
                            searchLabelWidth:100,
                            searchPlaceholder:'请输入接口名称',
                        },
                        {
                            label:'接口编码',
                            prop:'interfaceCode',
                            width:180,
                            //search:true,
                            searchRules: [{
                                required: true,
                                message: "请输入接口编码",
                                trigger: "blur"
                            }],
                        },
                        {
                            label:'接口类型',
                            prop:'interfaceType',
                            type: "select",
                            width:70,
                            dicData: [
                                {
                                    label: "xml",
                                    value: "xml"
                                },
                                {
                                    label: "json",
                                    value: "json"
                                }
                            ],
                        },
                        {
                            label:"定时任务表达式",
                            prop:'cron',
                            //search:true,
                        },
                        {
                            label:"开启定时任务",
                            prop:'whetherOpen',
                            width:60,
                        },
                        {
                            label:'位置索引',
                            prop:'siteIndex',
                            width:80,
                            sortable:true,
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
                        return remove(row.id);
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
                this.dialogVisible = true;
            },
            submitSql(){
                debugger;
                if (this.selectionList.length !== 1) {
                    this.$message.warning("请选择一条数据");
                    return;
                }

                let row = this.selectionList[0];
                row.interfaceParameters = this.sql;
                update(row).then(res => {
                    if (res.success === true){
                        this.dialogVisible = false;
                        this.$message.info("配置成功");
                    } else {
                        this.$message.error("配置失败");
                    }
                })
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
