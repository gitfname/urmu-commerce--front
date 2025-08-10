import { getFindCompanyDescriptionQueryQueryKey, useFindCompanyDescriptionQuery } from "../services/api/ecommerce--api"
import CollapsibleText from "./CollapsibleText"

function CompanyDescription() {
    const companyDescription = useFindCompanyDescriptionQuery({
        query: {
            queryKey: getFindCompanyDescriptionQueryQueryKey(),
            retry: 2,
            refetchOnWindowFocus: false
        }
    })

    return (
        <CollapsibleText className="pb-2" isRTL maxHeight={132} showMoreText='مشاهده بیشتر' showLessText='مشاهده کمتر'>
            <div
                className="lg:ml-10 ml-0 prose max-w-[100%]"
                dangerouslySetInnerHTML={{ __html: companyDescription?.data?.data?.content || "" }}
            >
            </div>
        </CollapsibleText>
    )
}

export default CompanyDescription