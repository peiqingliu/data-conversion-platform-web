<template>
    <basic-container>
        <avue-crud
                :data="data"
                :table-loading="loading"
                :option="option"
                :page.sync="page"
                v-model="form"
                @row-del="rowDel"
                @row-update="rowUpdate"
                @row-save="rowSave"
                :before-open="beforeOpen"
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
                <el-button type="info"
                           icon="el-icon-switch-button"
                           size="small"
                           plain
                           @click.stop="startTask">开启任务</el-button>
            </template>
            <template slot="whetherOpen" slot-scope="scope" >
                <el-tag v-if="scope.row.whetherOpen === 1 ">{{"已开启"}}</el-tag>
                <el-tag type="info" v-else>{{"关闭"}}</el-tag>
            </template>
            <template slot="tip">
            </template>
        </avue-crud>
        <el-dialog
                title="请配置sql"
                :visible.sync="dialogVisible"
                width="50%">
            <el-input
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 10}"
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
    import {getByCondition,add,update,remove,startTask} from "../../../api/interfaceInformation"
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
                    dialogDrag:true,
                    title:'',
                    height:300,
                    align:'center',
                    menuAlign:'center',
                    menuWidth:150,
                    searchMenuSpan:4,
                    dialogWidth:'70%',
                    column:[
                        {
                            label:"接口名称",
                            prop:'interfaceName',
                            search:true,
                            searchSpan:8,
                            labelWidth:'125',
                            width:200,
                            searchLabelWidth:100,
                            searchPlaceholder:'请输入接口名称',
                            rules: [{
                                required: true,
                                message: "请输入接口名称",
                                trigger: "blur"
                            }]
                        },
                        {
                            label:'接口编码',
                            prop:'interfaceCode',
                            labelWidth:'125',
                            searchSpan:8,
                            search:true,
                            searchPlaceholder:'请输入接口编码',
                            rules: [{
                                required: true,
                                message: "请输入接口编码",
                                trigger: "blur"
                            }]
                        },
                        {
                            label:'接口类型',
                            prop:'interfaceType',
                            type: "select",
                            labelWidth:'125',
                            width:80,
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
                            rules: [{
                                required: true,
                                message: "请选择接口类型",
                                trigger: "blur"
                            }]

                        },
                        {
                            label:"定时任务表达式",
                            labelWidth:'125',
                            prop:'cron',
                            type:"input",
                            rules: [{
                                required: true,
                                message: "请输入定时任务表达式",
                                trigger: "blur"
                            }]
                        },
                        {
                            label:"状态",
                            prop:'whetherOpen',
                            labelWidth:'125',
                            type:'select',
                            slot:true,
                            dicData:[
                                {
                                    label:"开启",
                                    value:1
                                },
                                {
                                    label:"不开启",
                                    value:0
                                }
                            ],
                            rules: [{
                                required: true,
                                message: "请选择状态",
                                trigger: "blur"
                            }]
                        },
                        {
                            label:'位置索引',
                            prop:'siteIndex',
                            width:80,
                            labelWidth:'125',
                            hide:true,
                            sortable:true,
                        },
                        {
                            label: "查询天数",
                            prop: "searchTime",
                            type: "number",
                            hide:true,
                            width:180,
                            labelWidth:'125',
                        },
                        {
                            label:"多数据",
                            prop:"multiple",
                            labelWidth:'125',
                            type:'select',
                            hide:true,
                            dicData:[
                                {
                                    label:"是",
                                    value:1
                                },
                                {
                                    label:"否",
                                    value:0
                                }
                            ],
                        },
                        {
                            label: "创建日期",
                            prop: "createTime",
                            type: "datetime",
                            hide:true,
                            width:180,
                            labelWidth:'125',
                            format: "yyyy-MM-dd hh:mm:ss",
                            valueFormat: "yyyy-MM-dd hh:mm:ss",
                        },
                        {
                            label:"请求sql",
                            prop:"prepareExecuteSql",
                            type:"textarea",
                            hide:true,
                            labelWidth:'125',
                            span:24
                        },
                        {
                            label:"数据模型",
                            prop:"dataModel",
                            hide:true,
                            type:"textarea",
                            labelWidth:'125',
                            span:24
                        },
                        {
                            label:"请求头",
                            prop:"requestHeader",
                            type:"textarea",
                            hide:true,
                            labelWidth:'125',
                            span:24
                        },
                        {
                            label:"soapAction",
                            prop:"soapAction",
                            type:"input",
                            hide:true,
                            labelWidth:'125',
                            span:24
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
                this.query = params;
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
                if (this.selectionList.length !== 1) {
                    this.$message.warning("请选择一条数据");
                    return;
                }
                this.dialogVisible = true;
            },
            startTask(){
                if (this.selectionList.length !== 1) {
                    this.$message.warning("请选择一条数据");
                    return;
                }
                const data = this.selectionList[0];
                startTask(data).then(res => {
                    if (res.success === true){
                        debugger;
                        const data= res.result;
                        this.$message.success(data || "开启任务成功。" )
                    }
                })
            },
            submitSql(){
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


