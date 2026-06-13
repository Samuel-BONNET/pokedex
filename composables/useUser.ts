export function useUser() {
  const token = process.client ? localStorage.getItem('token') : null

  const { data } = useFetch<{ userId: number }>('/api/user/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })

  const userId = computed(() => data.value?.userId)

  return { userId }
}
