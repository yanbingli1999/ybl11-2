import React from 'react';
import { EchoHourglassState, EchoStep } from '../types/game';

interface EchoHourglassPanelProps {
  echoHourglass: EchoHourglassState;
  currentCurse: number;
  maxCurse: number;
  onRewind: (stepIndex: number) => void;
  disabled: boolean;
}

const actionIcons: Record<string, string> = {
  move: '🚶',
  pickup: '💎',
  hurt: '💥',
  door: '🚪',
  rest: '😴',
  interact: '✋',
};

const actionColors: Record<string, string> = {
  move: '#60a5fa',
  pickup: '#fbbf24',
  hurt: '#f87171',
  door: '#34d399',
  rest: '#4ade80',
  interact: '#a855f7',
};

export const EchoHourglassPanel: React.FC<EchoHourglassPanelProps> = ({
  echoHourglass,
  currentCurse,
  maxCurse,
  onRewind,
  disabled,
}) => {
  const { history, usageCount, rewindCost, echoCreatures, maxHistory } = echoHourglass;
  const canRewind = currentCurse + rewindCost <= maxCurse && history.length > 0 && !disabled;
  const creatureCount = echoCreatures.length;

  return (
    <div
      style={{
        backgroundColor: '#252540',
        padding: '16px',
        borderRadius: '8px',
        color: '#e0e0e0',
        minWidth: '280px',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#c0c0ff' }}>
        ⏳ 回声沙漏
      </h3>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '12px',
          fontSize: '13px',
          color: '#aaa',
        }}
      >
        <span>消耗: ☠️ {rewindCost}诅咒</span>
        <span>已使用: {usageCount}次</span>
      </div>

      {creatureCount > 0 && (
        <div
          style={{
            padding: '8px',
            backgroundColor: '#a855f733',
            borderRadius: '4px',
            marginBottom: '12px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#c084fc',
          }}
        >
          ⚠️ {creatureCount} 只回声怪正在追踪你！
        </div>
      )}

      <div
        style={{
          marginBottom: '12px',
          fontSize: '12px',
          color: '#aaa',
        }}
      >
        最近 {maxHistory} 步（{history.length}/{maxHistory}）
      </div>

      {history.length === 0 ? (
        <p style={{ color: '#888', fontStyle: 'italic', fontSize: '13px' }}>
          尚无记录，开始探索吧...
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginBottom: '12px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {history.map((step: EchoStep, index: number) => (
            <button
              key={step.id}
              onClick={() => onRewind(index)}
              disabled={!canRewind}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                backgroundColor: canRewind ? '#1a1a2e' : '#2d2d44',
                border: `1px solid ${actionColors[step.actionType] || '#4a4a6a'}`,
                borderRadius: '6px',
                color: canRewind ? '#e0e0e0' : '#666',
                cursor: canRewind ? 'pointer' : 'not-allowed',
                fontSize: '12px',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              title={canRewind ? `回溯到这一步（消耗${rewindCost}诅咒）` : '诅咒值不足'}
            >
              <span style={{ fontSize: '16px' }}>
                {actionIcons[step.actionType] || '❓'}
              </span>
              <span style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  第 {step.turn} 回合
                </div>
                <div style={{ color: canRewind ? '#e0e0e0' : '#666' }}>
                  {step.description}
                </div>
              </span>
              {index === 0 && (
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    backgroundColor: '#a855f733',
                    borderRadius: '4px',
                    color: '#c084fc',
                  }}
                >
                  上一步
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {!canRewind && history.length > 0 && (
        <div
          style={{
            padding: '6px',
            backgroundColor: '#f8717133',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#fca5a5',
            textAlign: 'center',
          }}
        >
          诅咒不足，需要 {rewindCost} 点（当前 {currentCurse}/{maxCurse}）
        </div>
      )}

      <div
        style={{
          marginTop: '12px',
          padding: '8px',
          backgroundColor: '#1a1a2e',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#888',
          lineHeight: '1.5',
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#aaa', marginBottom: '4px' }}>
          ⚙️ 机制说明
        </div>
        <div>• 记录最近{maxHistory}步动作</div>
        <div>• 点击任意步骤消耗{rewindCost}诅咒回溯</div>
        <div>• 鉴定结果不会被回退</div>
        <div>• 重复使用会召唤回声怪👻</div>
      </div>
    </div>
  );
};
