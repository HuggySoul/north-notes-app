import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { MainLayout } from "@/widgets/mainLayout";
import { NotesList } from "@/pages/notesList";
import { routes } from "@/shared/router/routes";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={routes.noteList.path} element={<NotesList />} />
        </Route>

        <Route path="/" element={<Navigate to={routes.noteList.path} replace />} />
      </Routes>
    </Router>
  );
};
