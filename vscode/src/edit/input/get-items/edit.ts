import { type Rule, ruleTitle } from '@sourcegraph/cody-shared'
import * as vscode from 'vscode'
import type { GetItemsResult } from '../quick-pick'
import { getItemLabel } from '../utils'
import type { EditModelItem } from './types'

export const RANGE_ITEM: vscode.QuickPickItem = {
    label: 'Range',
    alwaysShow: true,
}

export const MODEL_ITEM: vscode.QuickPickItem = {
    label: 'Model',
    alwaysShow: true,
}

const RULES_ITEM: vscode.QuickPickItem = {
    label: 'Rules',
    alwaysShow: true,
}

export const DOCUMENT_ITEM: vscode.QuickPickItem = {
    label: 'Document Code',
    alwaysShow: true,
}

export const TEST_ITEM: vscode.QuickPickItem = {
    label: 'Generate Tests',
    alwaysShow: true,
}

const SUBMIT_SEPARATOR: vscode.QuickPickItem = {
    label: 'submit',
    kind: vscode.QuickPickItemKind.Separator,
}
const SUBMIT_ITEM: vscode.QuickPickItem = {
    label: 'Submit',
    detail: 'Submit edit instruction (or type @ to include code)',
    alwaysShow: true,
}

export const getEditInputItems = (
    activeValue: string,
    activeRangeItem: vscode.QuickPickItem,
    activeModelItem: vscode.QuickPickItem | undefined,
    showModelSelector: boolean,
    rulesToApply: Rule[] | null
): GetItemsResult => {
    const hasActiveValue = activeValue.trim().length > 0
    const submitItems = hasActiveValue ? [SUBMIT_SEPARATOR, SUBMIT_ITEM] : []
    const commandItems: vscode.QuickPickItem[] = hasActiveValue
        ? []
        : [
              {
                  label: 'edit commands',
                  kind: vscode.QuickPickItemKind.Separator,
              },
              DOCUMENT_ITEM,
              TEST_ITEM,
          ]

    // Create a more prominent model item that shows the current model name
    const modelItem = showModelSelector && activeModelItem
        ? {
            ...MODEL_ITEM,
            label: 'Model',
            detail: `${(activeModelItem as EditModelItem).modelTitle || activeModelItem.label}`,
        }
        : showModelSelector
            ? { ...MODEL_ITEM, detail: 'Select a model' }
            : null

    const editItems: vscode.QuickPickItem[] = [
        {
            label: 'edit options',
            kind: vscode.QuickPickItemKind.Separator,
        },
        { ...RANGE_ITEM, detail: getItemLabel(activeRangeItem) },
        modelItem,
        rulesToApply !== null && rulesToApply.length > 0
            ? { ...RULES_ITEM, detail: rulesToApply.map(ruleTitle).join(', ') }
            : null,
    ].filter(v => v !== null)

    return { items: [...submitItems, ...editItems, ...commandItems] }
}
