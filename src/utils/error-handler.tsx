import { toast } from 'react-toastify'

export function handleError(e: Error) {
  toast.error(e.message)
}
