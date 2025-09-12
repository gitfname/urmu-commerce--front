import { useEffect, useState } from "react"
import LoadingSpinner from "../ProductCompare/components/UI/LoadingSpinner"

function Dashboard() {
    const [show, setShow] = useState(false)

    useEffect(
        () => {
            setTimeout(() => {
                setShow(true)
            }, 2250);
        }, []
    )

    return (
        <div className="max-md:mt-20 mt-40 relative">
            {
                !show
                    ?
                    <div className="absolute z-50 w-full h-full top-0 left-0 backdrop-blur-sm">
                        <LoadingSpinner message="در حال بارگذاری پنل مدیریتی" />
                    </div>
                    :
                    null
            }

            <iframe
                src="https://ur-commerce.runflare.run"
                className="w-full h-[60rem]"
            ></iframe>
        </div>
    )
}

export default Dashboard