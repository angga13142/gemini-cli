/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Data Processor Service for Backend
 *
 * This service handles data transformation and processing logic.
 * It returns structured data that frontend can use for UI state management.
 *
 * Location: packages/core/src/core/processing/dataProcessor.ts
 */

import type { Part } from '@google/genai';
import type { ConversationRecord } from '../../services/chatRecordingService.js';
import { partToString } from '../../utils/partUtils.js';

/**
 * UI history item (without ID)
 */
export interface UIHistoryItem {
  type: 'user' | 'info' | 'error' | 'warning' | 'gemini' | 'tool_group';
  text?: string;
  tools?: Array<{
    callId: string;
    name: string;
    description: string;
    renderOutputAsMarkdown: boolean;
    status: 'success' | 'error';
    resultDisplay: string;
    confirmationDetails?: unknown;
  }>;
}

/**
 * Client history item for Gemini API
 */
export interface ClientHistoryItem {
  role: 'user' | 'model';
  parts: Part[];
}

/**
 * Result of converting session data to history formats
 */
export interface ConvertedHistoryFormats {
  /** UI history format */
  uiHistory: UIHistoryItem[];
  /** Gemini client history format */
  clientHistory: ClientHistoryItem[];
}

/**
 * Convert session/conversation data into UI history and Gemini client history formats.
 *
 * Extracted from packages/cli/src/ui/hooks/useSessionBrowser.ts
 *
 * @param messages The conversation messages to convert
 * @returns Converted history in both UI and client formats
 */
export function convertSessionToHistoryFormats(
  messages: ConversationRecord['messages'],
): ConvertedHistoryFormats {
  const uiHistory: UIHistoryItem[] = [];

  for (const msg of messages) {
    // Add the message only if it has content
    const contentString = partToString(msg.content);
    if (msg.content && contentString.trim()) {
      let messageType: UIHistoryItem['type'];
      switch (msg.type) {
        case 'user':
          messageType = 'user';
          break;
        case 'info':
          messageType = 'info';
          break;
        case 'error':
          messageType = 'error';
          break;
        case 'warning':
          messageType = 'warning';
          break;
        default:
          messageType = 'gemini';
          break;
      }

      uiHistory.push({
        type: messageType,
        text: contentString,
      });
    }

    // Add tool calls if present
    if (
      msg.type !== 'user' &&
      'toolCalls' in msg &&
      msg.toolCalls &&
      msg.toolCalls.length > 0
    ) {
      uiHistory.push({
        type: 'tool_group',
        tools: msg.toolCalls.map((tool) => ({
          callId: tool.id,
          name: tool.displayName || tool.name,
          description: tool.description || '',
          renderOutputAsMarkdown: tool.renderOutputAsMarkdown ?? true,
          status: tool.status === 'success' ? 'success' : 'error',
          resultDisplay: tool.resultDisplay || '',
          confirmationDetails: undefined,
        })),
      });
    }
  }

  // Convert to Gemini client history format
  const clientHistory: ClientHistoryItem[] = [];

  for (const msg of messages) {
    // Skip system/error messages and user slash commands
    if (msg.type === 'info' || msg.type === 'error' || msg.type === 'warning') {
      continue;
    }

    if (msg.type === 'user') {
      // Skip user slash commands
      const contentString = partToString(msg.content);
      if (
        contentString.trim().startsWith('/') ||
        contentString.trim().startsWith('?')
      ) {
        continue;
      }

      // Add regular user message
      clientHistory.push({
        role: 'user',
        parts: [{ text: contentString }],
      });
    } else if (msg.type === 'gemini') {
      // Handle Gemini messages with potential tool calls
      const hasToolCalls = msg.toolCalls && msg.toolCalls.length > 0;

      if (hasToolCalls) {
        // Create model message with function calls
        const modelParts: Part[] = [];

        // Add text content if present
        const contentString = partToString(msg.content);
        if (msg.content && contentString.trim()) {
          modelParts.push({ text: contentString });
        }

        // Add function calls
        for (const toolCall of msg.toolCalls!) {
          modelParts.push({
            functionCall: {
              name: toolCall.name,
              args: toolCall.args,
              ...(toolCall.id && { id: toolCall.id }),
            },
          });
        }

        clientHistory.push({
          role: 'model',
          parts: modelParts,
        });

        // Create single function response message with all tool call responses
        const functionResponseParts: Part[] = [];
        for (const toolCall of msg.toolCalls!) {
          let responseData: Part;

          if (typeof toolCall.result === 'string') {
            responseData = {
              functionResponse: {
                id: toolCall.id,
                name: toolCall.name,
                response: {
                  output: toolCall.result,
                },
              },
            };
          } else if (Array.isArray(toolCall.result)) {
            // toolCall.result is an array containing properly formatted
            // function responses
            functionResponseParts.push(...(toolCall.result as Part[]));
            continue;
          } else {
            // Fallback for non-array results
            responseData = toolCall.result as Part;
          }

          functionResponseParts.push(responseData);
        }

        // Only add user message if we have function responses
        if (functionResponseParts.length > 0) {
          clientHistory.push({
            role: 'user',
            parts: functionResponseParts,
          });
        }
      } else {
        // Regular Gemini message without tool calls
        const contentString = partToString(msg.content);
        if (msg.content && contentString.trim()) {
          clientHistory.push({
            role: 'model',
            parts: [{ text: contentString }],
          });
        }
      }
    }
  }

  return {
    uiHistory,
    clientHistory,
  };
}
