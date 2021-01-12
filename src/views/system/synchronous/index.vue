<template>
    <basic-container>
        <avue-crud
                :data="data"
                :table-loading="loading"
                :option="option"
                v-model="form"
                :before-open="beforeOpen"
                @search-change="searchChange"
                @search-reset="searchReset"
                @selection-change="selectionChange"
                @current-change="currentChange"
                @size-change="sizeChange"
                @on-load="onLoad">
            <template slot="menuLeft">
                <el-button type="primary"
                           icon="el-icon-switch-button"
                           size="small"
                           plain
                           @click.stop="startSync">开启任务</el-button>
            </template>
        </avue-crud>
    </basic-container>
</template>

<script>
    import {findAllData, startSync} from "../../../api/sync";

    export default {
        name: "index",
        data() {
            return {
                form:{},
                selectionList: [],
                loading: true,
                query:{
                    dataType:"1"
                },
                option:{
                    addBtn:false,
                    delBtn:false,
                    editBtn:false,
                    viewBtn:false,
                    menu:false,
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
                            label:"类型",
                            prop:"dataType",
                            labelWidth:'125',
                            type:'select',
                            search:true,
                            searchValue:'1',
                            hide:true,
                            dicData:[
                                {
                                    value: '1',
                                    label: '门诊'
                                }, {
                                    value: '2',
                                    label: '住院'
                                }
                            ],
                        },
                        {
                            label:"结账ID",
                            prop:'vak01',
                            width:80,
                            searchLabelWidth:100,
                            searchPlaceholder:'请输入字典KEY',
                        },
                        {
                            label:'门诊号',
                            prop:'vaa03',
                            width:150,
                            search:true,
                        },
                        {
                            label:'姓名',
                            prop:'vaa05',
                            search:true,
                        },
                        {
                            label:"病人ID",
                            prop:'vaa01',
                        },
                        {
                            label:'结账金额',
                            prop:'vak08',
                        },
                        {
                            label: "结账时间",
                            prop: "vak13",
                            type: "datetime",
                            width:180,
                            format: "yyyy-MM-dd hh:mm:ss",
                            valueFormat: "yyyy-MM-dd hh:mm:ss",
                        },
                        {
                            label:'单据号',
                            prop:'vai04',
                            search:true,
                        },
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

            },
            startSync() {
                if (this.selectionList.length === 0 ) {
                    this.$message.warning("请选择数据");
                    return;
                }
                startSync(this.selectionList).then(res => {
                    if (res.success === true) {
                        this.$message.info("开始同步")
                    }
                })
            },
            onLoad(page,params ={}) {
                this.loading = true;
                params = {
                    ...Object.assign(this.query)
                };
                findAllData(params).then(res => {
                    if (res.success === true){
                        const data = res.result;
                        this.data = data;
                        this.loading = false;
                        this.selectionClear();
                    }
                });
                this.loading = false;
            }
        },
    }
</script>

<style scoped>

</style>
