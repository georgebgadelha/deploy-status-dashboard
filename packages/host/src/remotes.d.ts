declare module 'remoteMetrics/MetricsWidget' {
  import type { ComponentType } from 'react';

  interface MetricsWidgetProps {
    projectId?: string;
  }

  const MetricsWidget: ComponentType<MetricsWidgetProps>;
  export default MetricsWidget;
}
