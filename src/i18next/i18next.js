import i18next from 'i18next';

export async function translate(key, language) {
  await i18next.init({
    lng: language,
    debug: false,
    resources: {
      ru: {
        translation: {
          Add: 'Добавить',
          Delete: 'Удалить',
          Request: 'Запросить',
          'Show difference': 'Показать изменения',
          Push: 'Отправить',
          'Cancel changes': 'Отменить изменения',
          'No data found': 'Данные не найдены',
        },
      },
    },
  });

  return i18next.t(key);
}
