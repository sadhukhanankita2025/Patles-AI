import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { WorkflowNodeData } from '../../types/workflow';

type ExtendedWorkflowNodeData = WorkflowNodeData & {
  layoutDirection?: 'LR' | 'TB';
  isDimmed?: boolean;
  connectionRole?: 'inbound' | 'outbound';
};

/* ✅ Type Guard (fixes TS error properly) */
function isWorkflowNodeData(data: unknown): data is ExtendedWorkflowNodeData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'label' in data &&
    'category' in data
  );
}

export const WorkflowNodeComponent: React.FC<NodeProps> = memo(({ data }) => {

  /* ✅ SAFE assignment */
  const nodeData: ExtendedWorkflowNodeData = isWorkflowNodeData(data)
    ? data
    : {
      id: 'fallback',
      label: 'Unknown Node',
      category: 'frontend',
      description: '',
    };

  const isDimmed = nodeData.isDimmed;
  const isTB = nodeData.layoutDirection === 'TB';
  const role = nodeData.connectionRole;

  return (
    <div className="w-68.75 bg-linear-to-b rounded-xl border p-3">
      <Handle
        type="target"
        position={isTB ? Position.Top : Position.Left}
      />

      <Handle
        type="source"
        position={isTB ? Position.Bottom : Position.Right}
      />

      <h4 className="text-white text-sm">{nodeData.label}</h4>
    </div>
  );
});

WorkflowNodeComponent.displayName = 'WorkflowNodeComponent';