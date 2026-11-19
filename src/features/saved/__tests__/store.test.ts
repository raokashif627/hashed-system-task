import { beforeEach, describe, expect, it } from 'vitest'
import { useSavedStore } from '../store'

describe('useSavedStore', () => {
  beforeEach(() => {
    useSavedStore.setState({ ids: [] })
    localStorage.clear()
  })

  it('toggle adds then removes an id', () => {
    useSavedStore.getState().toggle('v1')
    expect(useSavedStore.getState().ids).toEqual(['v1'])
    useSavedStore.getState().toggle('v1')
    expect(useSavedStore.getState().ids).toEqual([])
  })

  it('add is idempotent and remove deletes', () => {
    useSavedStore.getState().add('v1')
    useSavedStore.getState().add('v1')
    expect(useSavedStore.getState().ids).toEqual(['v1'])
    useSavedStore.getState().remove('v1')
    expect(useSavedStore.getState().ids).toEqual([])
  })

  it('persists to localStorage under venuze-saved', () => {
    useSavedStore.getState().toggle('v2')
    expect(JSON.parse(localStorage.getItem('venuze-saved') ?? '{}').state.ids).toEqual(['v2'])
  })
})
