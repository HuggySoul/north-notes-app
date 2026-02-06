import cls from "./mainLayout.module.css";
import { Outlet } from "react-router-dom";
import { ThemeSwitcher } from "@/features/changeAppTheme";

/** обёртка приложения */
export function MainLayout() {
  return (
    <div className={cls.mainLayout}>
      <header className={cls.header}>
        <h1 className={cls.title}> Заметки </h1>
        <ThemeSwitcher />
      </header>
      <main className={cls.main}>
        <Outlet />
      </main>
    </div>
  );
}
