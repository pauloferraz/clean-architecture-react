import { AxiosHttpClient } from './axios-http-client'
import axios from 'axios'
import faker from 'faker'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe.only('AxiosHttpClient', () => {
  test('shouldcall axios with correct url', async () => {
    const url = faker.internet.url()
    const sut = new AxiosHttpClient()
    await sut.post({ url: url })
    expect(mockedAxios).toHaveBeenCalledWith(url)
  })
})
