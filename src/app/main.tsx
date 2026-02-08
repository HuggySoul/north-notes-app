import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "./appRouter";
import { ChangeAppThemeProvider } from "@/features/changeAppTheme";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { hydrateNotes } from "@/features/notesCRUD";
import { seedMockNotesToDb } from "@/features/notesCRUD/";

/** Инициализация Redux store и IndexDB */
async function bootstrap() {
  // синхронизируем БД и Redux store
  await store.dispatch(hydrateNotes()).unwrap();

  // добавляем моки в БД
  await store.dispatch(seedMockNotesToDb()).unwrap();
}

bootstrap();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ChangeAppThemeProvider>
      <AppRouter />
    </ChangeAppThemeProvider>
  </Provider>,
);
