<template>
    <div>
        <!--        个人信息相关-->
        <el-card class="el-card" style="width: 80%; margin:auto;">
            <div>
                <div>
                    <h2>个人信息：</h2>
                </div>
                <br><br><br>

                <el-form ref="form" :model="form" label-width="80px">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="头像">
                                <img
                                    width="100"
                                    height="100"
                                    :src="form.icon"
                                    class="image"
                                    style="border-radius: 50%"
                                />
                                <el-upload
                                    class="upload"
                                    action
                                    :drag="true"
                                    :multiple="true"
                                    :file-list="images"
                                    :http-request="uploadHttp"
                                    :before-upload="beforeAvatarUpload"
                                    :on-remove="handleRemove">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传个人头像</em></div>
<!--                                    <i class="el-icon-plus avatar-uploader-icon"></i>-->
<!--                                    <p id="img-context">上传个人头像</p>-->
                                    <div class="el-upload__tip" slot="tip">
                                        只能上传jpg/jpeg/png文件，且不超过5MB
                                    </div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="updateUserInfo()">更 新</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="账号名称">
                                <el-input v-model="form.name" style="width: 30%" :readonly="true"></el-input>
                            </el-form-item>
                            <el-form-item label="联系方式">
                                <el-input v-model="form.phone" style="width: 30%" :readonly="true"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱">
                                <el-input v-model="form.email" style="width: 50%"></el-input>
                            </el-form-item>
                            <el-form-item label="年龄">
                                <el-input v-model="form.age" style="width: 50%"></el-input>
                            </el-form-item>
                            <el-form-item label="身份证号">
                                <el-input v-model="form.identityNumber" style="width: 50%"></el-input>
                            </el-form-item>
                            <el-form-item label="真实姓名">
                                <el-input v-model="form.realName" style="width: 50%"></el-input>
                            </el-form-item>
                            <el-form-item label="姓别">
                                <el-select v-model="form.gender" placeholder="请选择" style="width: 40%">
                                    <el-option label="男" value="man"></el-option>
                                    <el-option label="女" value="woman"></el-option>
                                </el-select>
                            </el-form-item>

                        </el-col>
                    </el-row>


                </el-form>
            </div>
        </el-card>
    </div>
</template>


<script>
import ossClient from "@/assets/config/aliyun.oss.client";

export default {
    name: "SelfInformation",
    data() {
        return {
            loading: true,
            //上传图片相关
            images: [],
            uploadConf: {
                region: null,
                accessKeyId: null,
                accessKeySecret: null,
                bucket: null,
            },
            form: {
                age: '',
                email: '',
                gender: '',
                icon: '',
                identityNumber: '',
                name: '',
                realName: '',
                phone: '',
            },


            totalCount: 0,
            pageNumber: 1,
            pageSize: 5,

            totalCount2: 0,
            pageNumber2: 1,
            pageSize2: 10,

            addressList: [],
            defaultAddressList: [],
            frequentList: [],
            defaultFrequentList: [],

            addDialogVisible: false,
            editDialogVisible: false,
            showDialogVisible: false,
            addFormRules: {
                receiver: [
                    {required: true, message: '请输入收货人', trigger: 'blur'},
                ],
                phone: [
                    {required: true, message: '请输入联系方式', trigger: 'blur'},
                ],
                province: [
                    {required: true, message: '请输入省份', trigger: 'blur'},
                ],
                city: [
                    {required: true, message: '请输入城市', trigger: 'blur'},
                ],
                region: [
                    {required: true, message: '请输入区', trigger: 'blur'},
                ],
                street: [
                    {required: true, message: '请输入街道', trigger: 'blur'},
                ],
            },
            editFormRules: {
                receiver: [
                    {required: true, message: '请输入收货人', trigger: 'blur'},
                ],
                phone: [
                    {required: true, message: '请输入联系方式', trigger: 'blur'},
                ],
                province: [
                    {required: true, message: '请输入省份', trigger: 'blur'},
                ],
                city: [
                    {required: true, message: '请输入城市', trigger: 'blur'},
                ],
                region: [
                    {required: true, message: '请输入区', trigger: 'blur'},
                ],
                street: [
                    {required: true, message: '请输入街道', trigger: 'blur'},
                ],
            },
            addForm: {
                receiver: '',
                phone: '',
                province: '',
                city: '',
                region: '',
                street: '',
                details: '',
            },
            showForm: {
                receiver: '',
                phone: '',
                province: '',
                city: '',
                region: '',
                street: '',
                details: '',
            },
            editForm: {
                receiver: '',
                phone: '',
                province: '',
                city: '',
                region: '',
                street: '',
                details: '',
                addressId: '',
            },

            addDialogVisible2: false,
            editDialogVisible2: false,
            showDialogVisible2: false,
            addFormRules2: {
                identityNumber: [
                    {required: true, message: '请输入身份证号', trigger: 'blur'},
                    {min: 17, max: 17, message: '身份证号必须17位', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'},
                ],
                phone: [
                    {required: true, message: '请输入电话号码', trigger: 'blur'},
                    {min: 11, max: 11, message: '电话号码必须11位', trigger: 'blur'}
                ],
            },
            editFormRules2: {
                identityNumber: [
                    {required: true, message: '请输入身份证号', trigger: 'blur'},
                    {min: 17, max: 17, message: '身份证号必须17位', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'},
                ],
                phone: [
                    {required: true, message: '请输入电话号码', trigger: 'blur'},
                    {min: 11, max: 11, message: '电话号码必须11位', trigger: 'blur'}
                ],
            },
            addForm2: {
                identityNumber: '',
                name: '',
                phone: '',
                frequentId: '',
            },
            showForm2: {
                identityNumber: '',
                name: '',
                phone: '',
                frequentId: '',
            },
            editForm2: {
                identityNumber: '',
                name: '',
                phone: '',
                frequentId: '',
            },
        };
    },
    created() {
        this.getUserInfo();
        //
        // this.getFrequentList();
        // this.getDefaultFrequentList();
        //
        // this.getAddressList();
        // this.getDefaultAddressList();
    },
    methods: {

        tableRowClassName({row, rowIndex}) {
            if (this.addressList[rowIndex].addressId === this.defaultAddressList.addressId) {
                return 'warning-row';
            }
            return '';
        },

        tableRowClassName2({row, rowIndex}) {
            if (this.frequentList[rowIndex].frequentId === this.defaultFrequentList.frequentId) {
                return 'warning-row';
            }
            return '';
        },

        onSubmit() {
            // console.log('submit!');
        },

        // 初始化
        async init() {
            //获取阿里云token  这里是后台返回来的数据
            this.uploadConf.region = "oss-cn-shanghai";
            this.uploadConf.accessKeyId = "LTAI4FzMDhgBN9LMBr71T3Ny";
            this.uploadConf.accessKeySecret = "hTPgQQSyBgEDnfMNe06RPf8ecDafpz";
            this.uploadConf.bucket = "tongji-boying";
        },
        // 阿里云OSS上传
        uploadHttp({ file }) {
            this.init();
            const { imgName } = "ALIOSS_IMG_";
            const fileName = `${imgName}/${Date.parse(new Date())}`; //定义唯一的文件名
            ossClient(this.uploadConf)
                .put(fileName, file, {
                    ContentType: "image/jpeg",
                })
                .then(({ res, url, name }) => {
                    if (res && res.status === 200) {
                        console.log(`阿里云OSS上传图片成功回调`, res, url, name);
                        console.log(url);
                        this.form.icon = url;
                    }
                })
                .catch((err) => {
                    console.log(`阿里云OSS上传图片失败回调`, err);
                });
        },
        // 图片限制
        beforeAvatarUpload(file) {
            const isJPEG = file.name.split(".")[1] === "jpeg";
            const isJPG = file.name.split(".")[1] === "jpg";
            const isPNG = file.name.split(".")[1] === "png";
            const isLt500K = file.size / 1024 / 1024 / 5 < 2;
            if (!isJPG && !isJPEG && !isPNG) {
                this.$message.error("上传图片只能是 JPEG/JPG/PNG 格式!");
            }
            if (!isLt500K) {
                this.$message.error("单张图片大小不能超过 5MB!");
            }
            return (isJPEG || isJPG || isPNG) && isLt500K;
        },
        // 移除图片
        handleRemove(file, fileList) {
            console.log(`移除图片回调`, fileList);
        },

        // 获取用户信息
        async getUserInfo(){
            var result = await this.$http.post(this.$api.getUserInfoUrl);
            this.form.name=result.data.data.username;
            this.form.realName=result.data.data.realName;
            this.form.icon=result.data.data.icon;
            this.form.gender=result.data.data.gender===1?'男':'女';
            this.form.age=result.data.data.age;
            this.form.identityNumber=result.data.data.identityNumber;
            this.form.email=result.data.data.email;
            this.form.phone=result.data.data.phone;

            // console.log("修改前"+this.form.icon);
        },
        async updateUserInfo(){
            // console.log("修改后"+this.form.icon);
            // console.log(this.form.gender);
            let gender;
            if(this.form.gender==='man')
                gender=true;
            else if(this.form.gender==='woman')
                gender=false;
            let result = await this.$http.post(this.$api.updateUserInformationUrl,{
                realName: this.form.realName,
                icon: this.form.icon,
                gender: gender,
                age: this.form.age,
                identityNumber: this.form.identityNumber,
                email: this.form.email,
            });
            console.log(result);
            if (result.data.code === 200) {
                this.$message.success("更新成功");
                await this.getUserInfo();
            } else {
                this.$message.warning("更新失败");
                await this.getUserInfo();
            }
        },
        //
        // // 联系人相关
        // //监听pageSize改变的事件
        // async handleSizeChange2(newSize)
        // {
        //     this.pageSize2 = newSize;
        //     this.pageNumber2 = 1;
        //     // console.log("pageSize:"+this.pageSize);
        //     await this.getFrequentList();
        //     await this.getDefaultFrequentList();
        // },
        // //监听pageNum改变的事件
        // async handleCurrentChange2(newPage)
        // {
        //     this.pageNumber2 = newPage;
        //     // console.log("pageNumber:"+this.pageNumber);
        //     await this.getFrequentList();
        //     await this.getDefaultFrequentList();
        // },
        // async getFrequentList(){
        //     let result = await this.$http.post(this.$api.getFrequentListUrl,{
        //         pageNum: this.pageNumber2,
        //         pageSize: this.pageSize2,
        //     });
        //     // console.log(result.data.data.list);
        //     if(result.data.code===200){
        //         this.frequentList=result.data.data.list;
        //     }
        //     else{
        //         this.frequentList=[];
        //     }
        //     this.totalCount2=result.data.data.total;
        // },
        // async getDefaultFrequentList(){
        //     let result = await this.$http.post(this.$api.getDefaultFrequentUrl);
        //     // console.log(result);
        //     if(result.data.code===200){
        //         this.defaultFrequentList=result.data.data;
        //     }
        //     else{
        //         this.defaultFrequentList=[];
        //     }
        // },
        // async setDefaultFrequentList(id){
        //     await this.$http.post(this.$api.setDefaultFrequentUrl + "/" + id);
        //     await this.getFrequentList();
        //     await this.getDefaultFrequentList();
        // },
        // async showAddFrequent(){
        //     this.addDialogVisible2=true;
        // },
        // async addFrequent(){
        //     this.$refs.addFormRef2.validate(
        //         async valid =>
        //         {
        //             if (!valid) return;
        //             await this.$http.post(this.$api.addFrequentUrl,{
        //                 identityNumber: this.addForm2.identityNumber,
        //                 name: this.addForm2.name,
        //                 phone: this.addForm2.phone,
        //             });
        //             await this.getFrequentList();
        //             await this.getDefaultFrequentList();
        //             this.addDialogVisible2=false;
        //             this.addForm2.identityNumber='';
        //             this.addForm2.name='';
        //             this.addForm2.phone='';
        //             this.$message.info("添加联系人成功!");
        //         }
        //     );
        // },
        // async cancelAdd2(){
        //     this.addDialogVisible2=false;
        //     this.addForm2.identityNumber='';
        //     this.addForm2.name='';
        //     this.addForm2.phone='';
        //     // console.log(this.addForm);
        //     this.$message.info("取消添加联系人!");
        // },
        // async deleteFrequent(id)
        // {
        //     // console.log(id);
        //     let result = await this.$http.post(this.$api.deleteFrequentUrl + "/" + id);
        //     // console.log(result);
        //     await this.getFrequentList();
        //     await this.getDefaultFrequentList();
        //     this.$message.info("删除联系人成功!");
        // },
        // async showEditFrequent(id){
        //     let result = await this.$http.post(this.$api.getFrequentUrl + "/" + id);
        //     // console.log(result);
        //     this.editForm2=result.data.data;
        //     this.editDialogVisible2=true;
        // },
        // async cancelEdit2(){
        //     this.editDialogVisible2=false;
        //     this.$message.info("取消编辑联系人!");
        // },
        // async editFrequent(){
        //     this.$refs.editFormRef2.validate(
        //         async valid =>
        //         {
        //             if (!valid) return;
        //             // console.log(this.editForm.addressId);
        //             await this.$http.post(this.$api.updateFrequentUrl + "/" + this.editForm2.frequentId, this.editForm2);
        //             await this.getFrequentList();
        //             await this.getDefaultFrequentList();
        //             this.editDialogVisible2=false;
        //             this.$message.info("编辑联系人成功!");
        //         }
        //     );
        // },
        //
        // // 收货地址相关
        // // 获取收货地址
        // async getAddressList(){
        //
        //     var result = await this.$http.post(this.$api.getAddressListUrl,
        //         {
        //             pageNum: this.pageNumber,
        //             pageSize: this.pageSize,
        //         });
        //
        //     if(result.data.code===200){
        //         this.addressList=result.data.data.list;
        //     }
        //     else{
        //         this.addressList=[];
        //     }
        //     this.totalCount=result.data.data.total;
        //     // console.log(this.addressList);
        // },
        // // 获取默认收货地址
        // async getDefaultAddressList(){
        //     var result = await this.$http.post(this.$api.getDefaultAddressUrl);
        //     // console.log(result.data.data);
        //     if(result.data.code===200){
        //         this.defaultAddressList=result.data.data;
        //     }
        //     else{
        //         this.defaultAddressList=[];
        //     }
        //     // console.log(this.defaultAddressList);
        // },
        // //监听pageSize改变的事件
        // async handleSizeChange(newSize)
        // {
        //     this.pageSize = newSize;
        //     this.pageNumber = 1;
        //     // console.log("pageSize:"+this.pageSize);
        //     await this.getAddressList();
        //     this.getDefaultAddressList();
        // },
        // //监听pageNum改变的事件
        // async handleCurrentChange(newPage)
        // {
        //     this.pageNumber = newPage;
        //     // console.log("pageNumber:"+this.pageNumber);
        //     await this.getAddressList();
        //     this.getDefaultAddressList();
        // },
        // async deleteAddress(id)
        // {
        //     // console.log(id);
        //     await this.$http.post(this.$api.deleteAddressUrl + "/" + id);
        //     this.getAddressList();
        //     this.getDefaultAddressList();
        //     this.$message.info("删除收货地点成功!");
        // },
        // async showAddAddress(){
        //     this.addDialogVisible=true;
        // },
        // async addAddress(){
        //     this.$refs.addFormRef.validate(
        //         async valid =>
        //         {
        //             if (!valid) return;
        //             await this.$http.post(this.$api.addAddressUrl,{
        //                 receiver: this.addForm.receiver,
        //                 phone: this.addForm.phone,
        //                 province: this.addForm.province,
        //                 city: this.addForm.city,
        //                 region: this.addForm.region,
        //                 street: this.addForm.street,
        //                 details: this.addForm.details,
        //             });
        //             this.getAddressList();
        //             this.getDefaultAddressList();
        //             this.addDialogVisible=false;
        //
        //             this.addForm.receiver='';
        //             this.addForm.phone='';
        //             this.addForm.province='';
        //             this.addForm.city='';
        //             this.addForm.region='';
        //             this.addForm.street='';
        //             this.addForm.details='';
        //
        //             // console.log(this.addForm);
        //             this.$message.info("添加收货地点成功!");
        //         }
        //     );
        // },
        // async cancelAdd(){
        //     this.addDialogVisible=false;
        //
        //     this.addForm.receiver='';
        //     this.addForm.phone='';
        //     this.addForm.province='';
        //     this.addForm.city='';
        //     this.addForm.region='';
        //     this.addForm.street='';
        //     this.addForm.details='';
        //
        //     // console.log(this.addForm);
        //     this.$message.info("取消添加收货地点!");
        // },
        // async setDefaultAddress(id){
        //     await this.$http.post(this.$api.setDefaultAddressUrl + "/" + id);
        //     await this.getAddressList();
        //     await this.getDefaultAddressList();
        // },
        // async showAddress(id){
        //     let result = await this.$http.post(this.$api.getAddressUrl + "/" + id);
        //     this.showForm=result.data.data;
        //     // console.log(this.showForm);
        //     this.showDialogVisible=true;
        // },
        // async showEditAddress(id){
        //     let result = await this.$http.post(this.$api.getAddressUrl + "/" + id);
        //     this.editForm=result.data.data;
        //     this.editForm.addressId=id;
        //     this.editDialogVisible=true;
        // },
        // async editAddress(){
        //     this.$refs.editFormRef.validate(
        //         async valid =>
        //         {
        //             if (!valid) return;
        //             // console.log(this.editForm.addressId);
        //             await this.$http.post(this.$api.updateAddressUrl + "/" + this.editForm.addressId, this.editForm);
        //             this.getAddressList();
        //             this.getDefaultAddressList();
        //             this.editDialogVisible=false;
        //             this.$message.info("编辑收货地点成功!");
        //         }
        //     );
        //
        // },
        // async cancelEdit(){
        //     this.editDialogVisible=false;
        //     this.$message.info("取消编辑收货地点!");
        // },
    },

};
</script>



<style scoped>

.el-row {
    margin-bottom: 20px;
    display:flex;
    flex-wrap: wrap;
}

.el-row .el-card {
    min-width: 100%;
    height: 100%;
    margin-right: 20px;
    transition: all .5s;
}

body {
    color: rgba(255, 255, 255, 0.65);
    background-color: #24292e;
    /*background-image: url(../../assets/img/star-bg.svg),*/
    /*linear-gradient(#191c20, #24292e 15%);*/
    background-repeat: repeat-x;
    background-position: center 0, 0 0, 0 0;
    margin-left: 0;
    margin-top: 1;
}

#img-context {
    text-align: center;
    font-size: 17px;
    color: #b0b0b0;
    margin-top: 50px;
}

/*.el-upload__tip {*/
/*    text-align: center;*/
/*    font-size: 8px;*/
/*    color: rgba(52, 52, 52, 0.7);*/
/*}*/

.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}
</style>


<style>
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}
</style>
