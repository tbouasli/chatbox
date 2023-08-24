import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import ChatPage from './app/pages/chat';
import ErrorPage from './app/pages/error';
import FriendsPage from './app/pages/friends';
import FriendRequestsPage from './app/pages/friends/requests';
import SearchUserPage from './app/pages/friends/search';
import HomePage from './app/pages/home';
import OnBoardingPage from './app/pages/on-boarding';
import SettingsPage from './app/pages/settings';
import WorkInProgressPage from './app/pages/wip';
import { AppDataProvider } from './app/provider/AppData';
import SignInPage from './auth/pages/sign-in';
import SignUpPage from './auth/pages/sign-up';
import AuthRoute from './shared/components/HOC/AuthRoute';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" errorElement={<ErrorPage />}>
            <Route path="" element={<Navigate to="/app" />} />
            <Route path="auth" element={<AuthRoute redirectIf="authenticated" redirectTo="/app" />}>
                <Route path="sign-in" element={<SignInPage />} />
                <Route path="sign-up" element={<SignUpPage />} />
            </Route>
            <Route
                path="app"
                element={
                    <AppDataProvider>
                        <AuthRoute redirectIf="unauthenticated" redirectTo="/auth/sign-in" />
                    </AppDataProvider>
                }
            >
                <Route path="" element={<HomePage />} />
                <Route path="friends">
                    <Route path="" element={<FriendsPage />} />
                    <Route path="search" element={<SearchUserPage />} />
                    <Route path="requests" element={<FriendRequestsPage />} />
                </Route>
                <Route path="settings">
                    <Route path="" element={<SettingsPage />} />
                    <Route path="profile" element={<WorkInProgressPage />} />
                    <Route path="notifications" element={<WorkInProgressPage />} />
                </Route>
                <Route path="chat">
                    <Route path=":chatId" element={<ChatPage />} />
                </Route>
            </Route>
            <Route path="on-boarding" element={<OnBoardingPage />} />
        </Route>,
    ),
);

function Router() {
    return <RouterProvider router={router} />;
}

export default Router;
