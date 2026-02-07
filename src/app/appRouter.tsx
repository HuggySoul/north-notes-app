import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  NavLink,
} from "react-router-dom";
import { MainLayout } from "@/widgets/mainLayout";
import { NotesList } from "@/pages/notesList";
import { routes } from "@/shared/router/routes";
import { Result } from "antd";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={routes.noteList.path} element={<NotesList />} />
        </Route>

        <Route path="/" element={<Navigate to={routes.noteList.path} replace />} />

        <Route
          path={routes.allNotExistingRoutes.path}
          element={<Navigate to={routes.notFound.path} replace />}
        />
        <Route
          path={routes.notFound.path}
          element={
            <Result
              extra={<NavLink to={routes.noteList.path}>К списку заметок</NavLink>}
              status={404}
              title="404"
              subTitle="Такой страницы не существует"
            />
          }
        />
      </Routes>
    </Router>
  );
};
