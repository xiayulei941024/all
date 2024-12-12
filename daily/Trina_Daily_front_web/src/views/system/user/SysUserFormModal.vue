<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :body-style="{ paddingBottom: '8px' }"
    :confirm-loading="submitLoading"
    :width="650"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form :model="formModel" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row>
        <a-col :xs="24" :sm="24" :md="24">
          <a-form-item v-if="isUpdateForm" style="display: none">
            <a-input v-model:value="formModel.userId" />
          </a-form-item>
          <a-form-item v-if="isUpdateForm" style="display: none">
            <a-input v-model:value="formModel.departmentId" />
          </a-form-item>

          <a-form-item label="工号" v-bind="validateInfos.username">
            <a-input v-model:value="formModel.username" placeholder="请输入" />
          </a-form-item>

          <a-form-item label="姓名" v-bind="validateInfos.nickname">
            <a-input v-model:value="formModel.nickname" placeholder="请输入" :disabled="true" />
          </a-form-item>

          <a-form-item label="部门">
            <!-- <sys-organization-tree-select v-model:value="formModel.organizationId" placeholder="请选择" /> -->
            <a-input v-model:value="formModel.departmentName" placeholder="请输入" :disabled="true" />
          </a-form-item>

          <!-- <a-form-item label="状态">
            <dict-radio-group v-model:value="formModel.status" dict-code="user_status" />
          </a-form-item> -->

          <a-form-item v-if="isCreateForm" label="角色">
            <sys-role-select v-model:value="formModel.roleCodes" mode="multiple" allow-clear placeholder="请选择" />
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="24" :md="12">
          <!-- <a-form-item label="电话">
            <a-input v-model:value="formModel.phoneNumber" placeholder="请输入" />
          </a-form-item> -->

          <!-- <a-form-item label="邮箱">
            <a-input v-model:value="formModel.email" placeholder="请输入" />
          </a-form-item> -->

          <!-- <a-form-item v-if="isCreateForm" label="角色">
            <sys-role-select v-model:value="formModel.roleCodes" mode="multiple" allow-clear placeholder="请选择" />
          </a-form-item> -->
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import SysRoleSelect from '../role/SysRoleSelect.vue'
// import SysOrganizationTreeSelect from '../organization/SysOrganizationTreeSelect.vue'
import type { SysUserDTO, SysUserPageVO } from '@/api/system/user/types'
import { overrideProperties } from '@/utils/bean-utils'
import { createUser, updateUser, queryUserByWorkId } from '@/api/system/user'
import { useAdminForm, useFormAction, FormAction, labelCol, wrapperCol } from '@/hooks/form'
import type { FormRequestMapping } from '@/hooks/form'
import { useModal } from '@/hooks/modal'
import debounce from 'lodash.debounce'
import { passEncrypt } from '@/utils/password-utils'

const emits = defineEmits<{
  (e: 'submit-success'): void
}>()

const { title, visible, openModal, closeModal } = useModal()

const { formAction, isCreateForm, isUpdateForm } = useFormAction()

// 表单模型
const formModel = reactive<SysUserDTO>({
  userId: undefined,
  username: '',
  nickname: '',
  departmentName: '',
  departmentId: '',
  // organizationName: '',
  // status: 1,
  // phoneNumber: '',
  // email: '',
  pass: passEncrypt('12345678'),
  roleCodes: [],
})

// 表单校验规则
const formRule = reactive({
  username: [{ required: true, message: '请输入工号!' }],
  nickname: [{ required: true, message: '未找到该员工，请检查工号' }],
})

watch(
  () => formModel.username.trim(),
  debounce(empno => {
    if (empno?.length > 5) {
      queryUserByWorkId(empno).then(res => {
        if (res.code === 200 && res.data) {
          const { depName: departmentName, empno: username, groupid: departmentId, name: nickname, userid } = res.data
          formModel.departmentName = departmentName
          formModel.username = username
          formModel.departmentId = departmentId
          formModel.nickname = nickname
          formModel.userid = userid
        } else {
          formModel.departmentName = ''
          formModel.departmentId = ''
          formModel.nickname = ''
          formModel.userid = ''
        }
      })
    } else {
      formModel.departmentName = ''
      formModel.departmentId = ''
      formModel.nickname = ''
      formModel.userid = ''
    }
  }, 300)
)

// 表单的提交请求
const formRequestMapping: FormRequestMapping<SysUserDTO> = {
  [FormAction.CREATE]: createUser,
  [FormAction.UPDATE]: updateUser,
}

const { submitLoading, validateAndSubmit, resetFields, validateInfos } = useAdminForm(
  formAction,
  formRequestMapping,
  formModel,
  formRule
)

/* 表单提交处理 */
const handleSubmit = () => {
  validateAndSubmit(
    {
      ...formModel,
      jobNum: formModel.username,
    },
    {
      onSuccess: () => {
        closeModal()
        emits('submit-success')
      },
    }
  )
}

/* 弹窗关闭方法 */
const handleClose = () => {
  closeModal()
  submitLoading.value = false
}

defineExpose({
  open(newFormAction: FormAction, record?: SysUserPageVO) {
    openModal()
    resetFields()
    if (newFormAction === FormAction.CREATE) {
      title.value = '新建用户'
    } else {
      title.value = '编辑用户'
      overrideProperties(formModel, record)
    }
    formAction.value = newFormAction
  },
})
</script>
