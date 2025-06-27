export const buildErrorMessage = (err, url) => {
  if (err.isAxiosError) {
    if (err.response) {
      return `Не удалось загрузить ${url} (код ${err.response.status})`
    }
    if (err.code === 'ENOTFOUND') {
      return `Хост не найден: ${url}`
    }
    return `Сетевая ошибка при обращении к ${url}: ${err.message}`
  }

  if (err.code === 'EACCES') {
    return `Недостаточно прав для записи в директорию`
  }

  if (err.code === 'ENOENT') {
    return `Выбранная директория не существует`
  }

  return `Произошла ошибка: ${err.message}`
}
