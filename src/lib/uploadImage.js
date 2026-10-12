import { uploadFile } from './uploadFile'

export async function uploadImage(dataUrl) {
  const file = await uploadFile(dataUrl)
  if (!file.mime.startsWith('image/')) throw new Error('Choose an image file.')
  return file.url
}
