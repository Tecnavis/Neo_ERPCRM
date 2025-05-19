import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function Manager() {
  const translate = useLanguage();
  const entity = 'admin';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputFilter: { role: 'branch_manager' } // Only show employees
  };
  
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('manager'),
    DATATABLE_TITLE: translate('manager'),
    ADD_NEW_ENTITY: translate('add_new_manager'),
    ENTITY_NAME: translate('manager'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
     api: {
    // when fetching the table, call GET /admin?role=branch_manager
    list: {
      url: '/admin',
      method: 'get',
      params: { role: 'branch_manager' }
    },
  }
  };
  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
    />
  );
}