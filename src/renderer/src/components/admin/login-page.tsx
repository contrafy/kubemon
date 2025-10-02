import { useState } from "react";
import { Form, required, useLogin, useNotify } from "ra-core";
import type { SubmitHandler, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Notification } from "@/components/admin/notification";
import { ServerIcon, InfoIcon } from "lucide-react";

export const LoginPage = (props: { redirectTo?: string }) => {
  const { redirectTo } = props;
  const [loading, setLoading] = useState(false);
  const [kubeconfig, setKubeconfig] = useState("");
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit: SubmitHandler<FieldValues> = (values) => {
    if (!kubeconfig.trim()) {
      notify("Please paste your kubeconfig", { type: "error" });
      return;
    }

    setLoading(true);
    login({ kubeconfig }, redirectTo)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        notify(
          typeof error === "string"
            ? error
            : typeof error === "undefined" || !error.message
            ? "Failed to connect to Kubernetes cluster"
            : error.message,
          {
            type: "error",
            messageArgs: {
              _:
                typeof error === "string"
                  ? error
                  : error && error.message
                  ? error.message
                  : undefined,
            },
          }
        );
      });
  };

  return (
    <div className="min-h-screen flex">
      <div className="container relative grid flex-col items-center justify-center sm:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-blue-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <ServerIcon className="mr-2 h-6 w-6" />
            KubeMon
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;A lightweight Kubernetes dashboard that allows you to 
                manage your cluster resources with ease using your existing kubeconfig.&rdquo;
              </p>
              <footer className="text-sm">Kubernetes Dashboard</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Connect to Kubernetes</h1>
              <p className="text-sm leading-none text-muted-foreground">
                Paste your kubeconfig file contents below to connect to your cluster
              </p>
            </div>

            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Your kubeconfig is stored locally and used to authenticate with your Kubernetes cluster.
                It is not sent to any external servers.
              </AlertDescription>
            </Alert>

            <Form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="kubeconfig">Kubeconfig</Label>
                <Textarea
                  id="kubeconfig"
                  placeholder="Paste your kubeconfig file contents here..."
                  value={kubeconfig}
                  onChange={(e) => setKubeconfig(e.target.value)}
                  rows={12}
                  className="font-mono text-sm resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Typically found at ~/.kube/config or obtained from your cloud provider
                </p>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading || !kubeconfig.trim()}
              >
                {loading ? "Connecting..." : "Connect to Cluster"}
              </Button>
            </Form>

            <div className="text-xs text-center text-muted-foreground">
              <p>Need help? Your kubeconfig should contain cluster, user, and context information.</p>
              <p className="mt-1">Make sure you have proper access to the Kubernetes cluster.</p>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
};
