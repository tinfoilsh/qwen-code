/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Colors } from '../colors.js';

interface OpenAIKeyPromptProps {
  onSubmit: (apiKey: string, baseUrl: string, model: string) => void;
  onCancel: () => void;
}

export function OpenAIKeyPrompt({
  onSubmit,
  onCancel,
}: OpenAIKeyPromptProps): React.JSX.Element {
  const [apiKey, setApiKey] = useState('');
  const [currentField, setCurrentField] = useState<'apiKey'>('apiKey');

  useInput((input, key) => {
    // 过滤粘贴相关的控制序列
    let cleanInput = (input || '')
      // 过滤 ESC 开头的控制序列（如 \u001b[200~、\u001b[201~ 等）
      .replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '') // eslint-disable-line no-control-regex
      // 过滤粘贴开始标记 [200~
      .replace(/\[200~/g, '')
      // 过滤粘贴结束标记 [201~
      .replace(/\[201~/g, '')
      // 过滤单独的 [ 和 ~ 字符（可能是粘贴标记的残留）
      .replace(/^\[|~$/g, '');

    // 再过滤所有不可见字符（ASCII < 32，除了回车换行）
    cleanInput = cleanInput
      .split('')
      .filter((ch) => ch.charCodeAt(0) >= 32)
      .join('');

    if (cleanInput.length > 0) {
      if (currentField === 'apiKey') {
        setApiKey((prev) => prev + cleanInput);
      }
      return;
    }

    // 检查是否是 Enter 键（通过检查输入是否包含换行符）
    if (input.includes('\n') || input.includes('\r')) {
      if (currentField === 'apiKey' && apiKey.trim()) {
        // Submit with empty base URL and model
        onSubmit(apiKey.trim(), '', '');
      }
      return;
    }

    if (key.escape) {
      onCancel();
      return;
    }

    // Tab and arrow keys not needed since only one field

    // Handle backspace - check both key.backspace and delete key
    if (key.backspace || key.delete) {
      setApiKey((prev) => prev.slice(0, -1));
      return;
    }
  });

  return (
    <Box
      borderStyle="round"
      borderColor={Colors.AccentBlue}
      flexDirection="column"
      padding={1}
      width="100%"
    >
      <Text bold color={Colors.AccentBlue}>
        OpenAI Configuration Required
      </Text>
      <Box marginTop={1}>
        <Text>
          Please enter your OpenAI configuration. You can get an API key from{' '}
          <Text color={Colors.AccentBlue}>
            https://platform.openai.com/api-keys
          </Text>
        </Text>
      </Box>
      <Box marginTop={1} flexDirection="row">
        <Box width={12}>
          <Text color={Colors.AccentBlue}>
            API Key:
          </Text>
        </Box>
        <Box flexGrow={1}>
          <Text>
            {'> '}
            {apiKey || ' '}
          </Text>
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text color={Colors.Gray}>
          Press Enter to continue, Esc to cancel
        </Text>
      </Box>
    </Box>
  );
}
