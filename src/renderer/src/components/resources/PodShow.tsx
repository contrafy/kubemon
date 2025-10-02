import { Show, SimpleShowLayout, RecordField, EditButton, DeleteButton } from '../admin';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { CheckIcon, XIcon, RotateCcwIcon, ServerIcon, TagIcon } from 'lucide-react';

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

const ContainerCard = ({ container, status }: { container: any, status?: any }) => {
  const containerStatus = status?.containerStatuses?.find((cs: any) => cs.name === container.name);
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ServerIcon className="h-5 w-5" />
          {container.name}
          {containerStatus && (
            <div className="flex items-center gap-1">
              {containerStatus.ready ? (
                <CheckIcon className="h-4 w-4 text-green-600" />
              ) : (
                <XIcon className="h-4 w-4 text-red-600" />
              )}
              {containerStatus.restartCount > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <RotateCcwIcon className="h-3 w-3" />
                  {containerStatus.restartCount}
                </Badge>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-600">Image</label>
          <p className="text-sm font-mono bg-gray-50 p-2 rounded">{container.image}</p>
        </div>
        
        {container.ports && container.ports.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-600">Ports</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {container.ports.map((port: any, idx: number) => (
                <Badge key={idx} variant="outline">
                  {port.containerPort}
                  {port.protocol && port.protocol !== 'TCP' && `/${port.protocol}`}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {containerStatus?.state && (
          <div>
            <label className="text-sm font-medium text-gray-600">State</label>
            <div className="mt-1">
              {Object.entries(containerStatus.state).map(([state, details]: [string, any]) => (
                <div key={state} className="text-sm">
                  <span className="font-medium capitalize">{state}</span>
                  {details.startedAt && (
                    <span className="text-gray-600 ml-2">
                      Started: {new Date(details.startedAt).toLocaleString()}
                    </span>
                  )}
                  {details.reason && (
                    <span className="text-gray-600 ml-2">
                      Reason: {details.reason}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const LabelsSection = ({ labels }: { labels: Record<string, string> }) => {
  if (!labels || Object.keys(labels).length === 0) {
    return <p className="text-gray-500 text-sm">No labels</p>;
  }

  return (
    <div className="space-y-2">
      {Object.entries(labels).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2 text-sm">
          <TagIcon className="h-3 w-3 text-gray-500" />
          <span className="font-medium">{key}:</span>
          <Badge variant="outline">{value}</Badge>
        </div>
      ))}
    </div>
  );
};

export const PodShow = () => {
  return (
    <Show
      actions={
        <div className="flex gap-2">
          <EditButton />
          <DeleteButton />
        </div>
      }
    >
      <SimpleShowLayout>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pod Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <RecordField source="name" className="font-mono" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Namespace</label>
                  <RecordField source="namespace" render={(record) => (
                    <Badge variant="outline">{record.namespace}</Badge>
                  )} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <RecordField source="status" render={(record) => (
                    <PodStatusBadge status={record.status} />
                  )} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Node</label>
                  <RecordField source="node" className="font-mono" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <RecordField source="creationTimestamp" render={(record) => (
                    <span>{record.creationTimestamp ? new Date(record.creationTimestamp).toLocaleString() : '-'}</span>
                  )} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">UID</label>
                  <RecordField source="uid" className="font-mono text-xs" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Containers</CardTitle>
            </CardHeader>
            <CardContent>
              <RecordField source="containers" render={(record) => (
                <div>
                  {record.containers?.map((container: any, idx: number) => (
                    <ContainerCard 
                      key={idx} 
                      container={container} 
                      status={record.status_details}
                    />
                  ))}
                </div>
              )} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Labels</CardTitle>
              </CardHeader>
              <CardContent>
                <RecordField source="labels" render={(record) => (
                  <LabelsSection labels={record.labels} />
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Annotations</CardTitle>
              </CardHeader>
              <CardContent>
                <RecordField source="annotations" render={(record) => (
                  <LabelsSection labels={record.annotations} />
                )} />
              </CardContent>
            </Card>
          </div>
        </div>
      </SimpleShowLayout>
    </Show>
  );
};