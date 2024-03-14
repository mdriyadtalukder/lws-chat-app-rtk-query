import { useDispatch, useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { conversationApi, useGetCoversationQuery } from "../../features/conversation/conversationApi";
import moment from "moment";
import getPartnerInfo from "../../hook/getPartnerInfo";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ChatItems() {
    const { user } = useSelector((state) => state.auth) || {};
    const { email } = user
    const { data, isError, isLoading, error } = useGetCoversationQuery(user?.email) || {};
    const { data: datas, totalCounter } = data || {} //get total of array of object theke ashse..data ta object er vitor pataise..tai emn krte hyse
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();

    const fetchMore = () => {
        setPage((prePage) => prePage + 1)
    }
    useEffect(() => {
        if (page > 1) {
            dispatch(conversationApi.endpoints.getMoreCoversation.initiate({ email, page }))
        }
    }, [ page, dispatch, email])
    useEffect(() => {
        if (totalCounter > 0) {
            const more = Math.ceil(totalCounter / Number(import.meta.env.VITE_CONVERSATION_LIMIT)) > page;
            setHasMore(more);
        }
    }, [page, totalCounter])
    let content;
    if (isLoading) content = <li>Loading...</li>
    if (!isLoading && isError) content = <li>{error?.datas}</li>
    if (!isLoading && !isError && datas?.length === 0) content = <li>No conversation found!!</li>
    if (!isLoading && !isError && datas?.length > 0) {
        content = <InfiniteScroll
            dataLength={datas?.length} //This is important field to render the next data
            next={fetchMore}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            height={window.innerHeight - 129}
        > {
                datas.map((d) => {
                    const { email, name } = getPartnerInfo(d?.users, user?.email)
                    return <li>
                        <Link to={`/inbox/${d?.id}`}>
                            <ChatItem key={d.id}
                                avatar={gravatarUrl(email, { size: 80 })}
                                name={name}
                                lastMessage={d?.message}
                                lastTime={moment(d?.timestamp).fromNow()}
                                id={d?.id}
                            />
                        </Link>
                    </li>

                }
                )
            }</InfiniteScroll>
    }
    return (
        <ul>

            {content}

        </ul>
    );
}
