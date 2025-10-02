import { Edit, SimpleForm, TextInput, NumberInput, DeleteButton } from '../admin';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangleIcon } from 'lucide-react';

export const PodEdit = () => {
  return (
    <Edit
      actions={
        <div className="flex gap-2">
          <DeleteButton />
        </div>
      }
      mutationMode="pessimistic"
    >
      <div className="space-y-6">
        <Alert>
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            Editing pods is limited to metadata only. Changes to spec may require pod recreation.
            Most pod specifications are immutable after creation.
          </AlertDescription>
        </Alert>

        <SimpleForm>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <TextInput 
                  source="name" 
                  label="Name"
                  disabled
                  helperText="Pod name cannot be changed"
                />
                <TextInput 
                  source="namespace" 
                  label="Namespace"
                  disabled
                  helperText="Namespace cannot be changed"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Labels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Labels are key-value pairs that organize and select objects. 
                  Add or modify labels below (one per line, format: key=value).
                </p>
                <TextInput
                  source="labels"
                  multiline
                  rows={6}
                  helperText="Format: key=value (one per line)"
                  format={(value) => {
                    if (!value) return '';
                    return Object.entries(value)
                      .map(([k, v]) => `${k}=${v}`)
                      .join('\n');
                  }}
                  parse={(value) => {
                    if (!value) return {};
                    const labels: Record<string, string> = {};
                    value.split('\n').forEach(line => {
                      const trimmed = line.trim();
                      if (trimmed) {
                        const [key, ...valueParts] = trimmed.split('=');
                        if (key && valueParts.length > 0) {
                          labels[key.trim()] = valueParts.join('=').trim();
                        }
                      }
                    });
                    return labels;
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Annotations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Annotations are key-value pairs that store arbitrary metadata.
                  Add or modify annotations below (one per line, format: key=value).
                </p>
                <TextInput
                  source="annotations"
                  multiline
                  rows={6}
                  helperText="Format: key=value (one per line)"
                  format={(value) => {
                    if (!value) return '';
                    return Object.entries(value)
                      .map(([k, v]) => `${k}=${v}`)
                      .join('\n');
                  }}
                  parse={(value) => {
                    if (!value) return {};
                    const annotations: Record<string, string> = {};
                    value.split('\n').forEach(line => {
                      const trimmed = line.trim();
                      if (trimmed) {
                        const [key, ...valueParts] = trimmed.split('=');
                        if (key && valueParts.length > 0) {
                          annotations[key.trim()] = valueParts.join('=').trim();
                        }
                      }
                    });
                    return annotations;
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pod Specification (Read-Only)</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Pod specifications are immutable after creation. To modify containers, 
                  images, or other spec fields, you'll need to recreate the pod.
                </AlertDescription>
              </Alert>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Containers</label>
                  <div className="mt-2 p-3 bg-gray-50 rounded border text-sm font-mono">
                    <div>View container details in the Show page</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Node Name</label>
                  <TextInput 
                    source="node" 
                    disabled
                    helperText="Node assignment cannot be changed"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </SimpleForm>
      </div>
    </Edit>
  );
};