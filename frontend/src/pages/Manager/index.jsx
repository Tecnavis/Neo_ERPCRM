import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function Manager() {
  const translate = useLanguage();
  const entity = 'manager';
  
  const searchConfig = {
    displayLabels: ['name', 'branch.name'],
    searchFields: 'name,branch.name',
  };

  const config = {
    entity,
    fields,
    searchConfig,
    // Add these to show related data in table
    tableColumns: [
      { title: translate('Name'), dataIndex: 'name' },
      { 
        title: translate('Branch'), 
        dataIndex: ['branch', 'name'],
        render: (branch) => branch?.name || 'N/A'
      },
      {
        title: translate('Services'),
        dataIndex: 'services',
        render: (services) => services?.map(s => s.name).join(', ') || 'N/A'
      }
    ]
  };

  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
    />
  );
}