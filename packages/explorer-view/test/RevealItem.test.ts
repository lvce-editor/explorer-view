import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { revealItem } from '../src/parts/RevealItem/RevealItem.ts'
import { RendererWorker as RendererWorkerId } from '../src/parts/RpcId/RpcId.ts'

test('revealItem - item not found', async () => {
	RendererWorker.registerMockRpc({
		'FileSystem.readDirWithFileTypes'() {
			return []
		},
	})

	const state = createDefaultState()
	const newState = await revealItem(state, 'test')
	expect(newState.items).toEqual([])
})

test('revealItem - item found', async () => {
	RendererWorker.registerMockRpc({
		'FileSystem.readDirWithFileTypes'() {
			return []
		},
	})

	const state: ExplorerState = {
		...createDefaultState(),
		items: [
			{
				name: 'test',
				type: 1,
				path: 'test',
				depth: 0,
				selected: false,
			},
		],
	}
	const newState = await revealItem(state, 'test')
	expect(newState.items[0].path).toBe('test')
})
