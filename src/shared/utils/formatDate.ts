type AppTimeZone = "LOCAL" | "MSK";

/**
 *  Возвращает параметры ISO строки или Date для выбранного часового пояса
 * @param isoString - строка в формате ISO 8601
 * @param timeZone - часовой пояс(мск или локальный)
 * @param options - объект с параметрами для Intl.DateTimeFormat
 * @returns Распаршеную ISO строку в виде объекта
 *
 * @Важно dayPeriod появляется только при options.hour12 = true
 */
export function getDateParams(
  isoString: string | Date,
  timeZone: "LOCAL" | "MSK" = "LOCAL",
  locale: string = "ru-RU",
  options?: Omit<Intl.DateTimeFormatOptions, "timeZone">,
) {
  const date = isoString instanceof Date ? isoString : new Date(isoString);

  const params = {
    hour: "00",
    minute: "00",
    second: "00",
    day: "00",
    weekday: "",
    month: "00",
    year: "00",
    dayPeriod: "",
  };

  if (Number.isNaN(date.getTime())) {
    console.error("Error of parsing ISO string: ", isoString);
    return params;
  }

  const d = getDtf(timeZone, locale, options).formatToParts(date);

  for (const part of d) {
    if (part.type === "hour") params.hour = part.value;
    if (part.type === "minute") params.minute = part.value;
    if (part.type === "second") params.second = part.value;
    if (part.type === "day") params.day = part.value;
    if (part.type === "dayPeriod") params.dayPeriod = part.value;
    if (part.type === "weekday") params.weekday = part.value;
    if (part.type === "month") params.month = part.value;
    if (part.type === "year") params.year = part.value;
  }

  return params;
}

/** Кэш Intl объекта */
const intlCache = new Map<string, Intl.DateTimeFormat>();

/** Формируем IntlDtf или возвращаем кэш */
function getDtf(
  timeZone: AppTimeZone,
  locale: string,
  options?: Omit<Intl.DateTimeFormatOptions, "timeZone">,
) {
  const tz = timeZone === "MSK" ? "Europe/Moscow" : "LOCAL";

  const key = `${locale}|${tz}|${JSON.stringify(options ?? {})}`;

  const cached = intlCache.get(key);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    weekday: "long",
    dayPeriod: "long",
    hour12: false,
    ...(timeZone === "MSK" ? { timeZone: "Europe/Moscow" } : {}),
    ...(options ?? {}),
  });

  intlCache.set(key, formatter);
  return formatter;
}
