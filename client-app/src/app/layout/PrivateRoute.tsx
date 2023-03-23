import { PathRouteProps, Route } from "react-router-dom";
import { useStore } from "../stores/store";

interface Props extends PathRouteProps {
    component: React.ComponentType<any>;
}

export default function PrivateRoute({ component: Component, ...rest }: Props) {
    const { userStore: { isLoggedIn } } = useStore();
    return (
        <Route {...rest} element={(isLoggedIn ? <Component {...rest} /> : null)} />
    );
};