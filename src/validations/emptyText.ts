export const validateEmptyText = (text: string) => {
  return text === '' || !text.trim() ? 'Você precisa preencher esse campo!' : ''
}
