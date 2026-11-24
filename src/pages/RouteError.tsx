import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Panel } from "../ui/Panel";


export function RouteError() {

    const error = useRouteError()

    if(isRouteErrorResponse(error)){
        return (
            <Panel title={`Error ${error.status}`}>
                <p>{String(error.data)}</p>
                <Link to="/flights">⬅︎ back to flights</Link>
            </Panel>
        )
    }

    return (
        <Panel title="Something went wrong">
            <p>{error instanceof Error ? error.message : String(error)}</p>
            <Link to="/flights">⬅︎ back to flights</Link>
        </Panel>
    )
}
