import { observer } from "mobx-react";
import type { ReactNode } from "react"
import myProfileStore from "../stores/MyProfileStore";

interface Props {
    children: ReactNode;
}

function RenderIfLoggedIn({ children }: Props) {
    const isLoggedIn = myProfileStore.isLoggedIn
    if (!isLoggedIn) return <></>
    return children
}

export default observer(RenderIfLoggedIn)