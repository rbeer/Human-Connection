import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Upload from '.'

const localVue = global.localVue

describe('Upload', () => {
  let wrapper

  const mocks = {
    $apollo: {
      mutate: jest
        .fn()
        .mockResolvedValueOnce({
          data: { UpdateUser: { id: 'upload1', avatar: { url: '/upload/avatar.jpg' } } },
        })
        .mockRejectedValue({
          message: 'File upload unsuccessful! Whatcha gonna do?',
        }),
    },
    $toast: {
      success: jest.fn(),
      error: jest.fn(),
    },
    $t: jest.fn(),
  }

  const propsData = {
    user: {
      avatar: { url: '/api/generic.jpg' },
    },
  }

  beforeEach(() => {
    jest.useFakeTimers()
    wrapper = shallowMount(Upload, { localVue, propsData, mocks })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('sends a the UpdateUser mutation when vddrop is called', () => {
    wrapper.vm.vddrop([{ filename: 'avatar.jpg' }])
    expect(mocks.$apollo.mutate).toHaveBeenCalledTimes(1)
  })

  describe('error handling', () => {
    const message = 'File upload failed'
    const fileError = { status: 'error' }

    it('defaults to error false', () => {
      expect(wrapper.vm.error).toEqual(false)
    })

    it('shows an error toaster when verror is called', () => {
      wrapper.vm.verror(fileError, message)
      expect(mocks.$toast.error).toHaveBeenCalledWith(fileError.status, message)
    })

    it('changes error status from false to true to false', async () => {
      wrapper.vm.verror(fileError, message)
      await Vue.nextTick()
      expect(wrapper.vm.error).toEqual(true)
      jest.runAllTimers()
      expect(wrapper.vm.error).toEqual(false)
    })

    it('shows an error toaster when the apollo mutation rejects', async () => {
      // calls vddrop twice because of how mockResolvedValueOnce works in jest
      // the first time the mock function is called it will resolve, calling it a
      // second time will cause it to fail(with this implementation)
      // https://jestjs.io/docs/en/mock-function-api.html#mockfnmockresolvedvalueoncevalue
      await wrapper.vm.vddrop([{ filename: 'avatar.jpg' }])
      await wrapper.vm.vddrop([{ filename: 'avatar.jpg' }])
      expect(mocks.$toast.error).toHaveBeenCalledTimes(1)
    })
  })
})
