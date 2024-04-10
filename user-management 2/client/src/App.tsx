import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { AuthPage } from './pages/AuthPage';
import { Header } from './components/Header';
import { User, UserProvider } from './components/UserContext';
import { saveToken } from './lib/data';

export function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  function handleSignIn(user: User, token: string) {
    setUser(user);
    setToken(token);
    saveToken(token);
  }

  function handleSignOut() {
    setUser(undefined);
    setToken(undefined);
    saveToken(undefined);
  }

  const contextValue = { user, token, handleSignIn, handleSignOut };

  return (
    <UserProvider value={contextValue}>
      <Routes>
        <Route path="/" element={<Header text="Todo App" />}>
          <Route index element={<Home />} />
          <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
          <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
