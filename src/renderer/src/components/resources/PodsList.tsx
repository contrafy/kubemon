import { List, DataTable, BulkDeleteButton, BulkActionsToolbar, ExportButton, TextInput, SelectInput } from '../admin';
import { CreateButton, EditButton, ShowButton, DeleteButton } from '../admin';
import { Badge } from '../ui/badge';
import { CheckIcon, XIcon, RotateCcwIcon } from 'lucide-react';

const PodStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'succeeded': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'unknown': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {status}
    </Badge>
  );
};

const ReadyIcon = ({ ready }: { ready: boolean }) => {
  return ready ? (
    <CheckIcon className="h-4 w-4 text-green-600" />
  ) : (
    <XIcon className="h-4 w-4 text-red-600" />
  );
};

const bulk = (
  <BulkActionsToolbar>
    <BulkDeleteButton />
    <ExportButton />
  </BulkActionsToolbar>
);

const podFilters = [
  <TextInput key="search" source="q" label="Search" alwaysOn />,
  <SelectInput 
    key="namespace" 
    source="namespace" 
    label="Namespace"
    choices={[
      { id: 'all', name: 'All Namespaces' },
      { id: 'default', name: 'default' },
      { id: 'kube-system', name: 'kube-system' },
      { id: 'kube-public', name: 'kube-public' },
    ]}
    alwaysOn
  />,
  <SelectInput 
    key="status" 
    source="status" 
    label="Status"
    choices={[
      { id: 'Running', name: 'Running' },
      { id: 'Pending', name: 'Pending' },
      { id: 'Succeeded', name: 'Succeeded' },
      { id: 'Failed', name: 'Failed' },
      { id: 'Unknown', name: 'Unknown' },
    ]}
  />,
];

export const PodsList = () => {
  return (
    <List
      sort={{ field: 'name', order: 'ASC' }}
      perPage={25}
      filters={podFilters}
      actions={
        <div className="flex gap-2">
          <CreateButton />
          <ExportButton />
        </div>
      }
    >
      <DataTable bulkActionButtons={bulk}>
        <DataTable.Col 
          source="name" 
          sortable
          render={(record: any) => (
            <div className="font-medium">{record.name}</div>
          )}
        />
        <DataTable.Col 
          source="namespace" 
          sortable
          render={(record: any) => (
            <Badge variant="outline">{record.namespace}</Badge>
          )}
        />
        <DataTable.Col 
          source="ready" 
          label="Ready"
          render={(record: any) => (
            <div className="flex items-center gap-2">
              <ReadyIcon ready={record.ready} />
              <span className="text-sm text-gray-600">
                {record.containers?.length || 0}
              </span>
            </div>
          )}
        />
        <DataTable.Col 
          source="status" 
          sortable
          render={(record: any) => (
            <PodStatusBadge status={record.status} />
          )}
        />
        <DataTable.Col 
          source="restarts" 
          sortable
          render={(record: any) => (
            <div className="flex items-center gap-1">
              <RotateCcwIcon className="h-3 w-3 text-gray-500" />
              <span>{record.restarts}</span>
            </div>
          )}
        />
        <DataTable.Col 
          source="age" 
          sortable
          render={(record: any) => {
            if (!record.creationTimestamp) return '-';
            const age = new Date().getTime() - new Date(record.creationTimestamp).getTime();
            const days = Math.floor(age / (1000 * 60 * 60 * 24));
            const hours = Math.floor((age % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((age % (1000 * 60 * 60)) / (1000 * 60));
            
            if (days > 0) return `${days}d`;
            if (hours > 0) return `${hours}h`;
            return `${minutes}m`;
          }}
        />
        <DataTable.Col 
          source="node" 
          render={(record: any) => (
            <span className="text-sm text-gray-600">{record.node || '-'}</span>
          )}
        />
        <DataTable.Col 
          source="actions"
          label=""
          render={(record: any) => (
            <div className="flex items-center gap-1">
              <ShowButton />
              <EditButton />
              <DeleteButton />
            </div>
          )}
        />
      </DataTable>
    </List>
  );
};