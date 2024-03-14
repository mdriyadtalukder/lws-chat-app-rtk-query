// import Blank from "./Blank";
import { useParams } from "react-router-dom";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";
import { useGetMessagesQuery } from "../../../features/message/messageApi";

export default function ChatBody() {
    const { id } = useParams();
    const { data, isError, isLoading, error } = useGetMessagesQuery(id);
    let content;
    if (isLoading) content = <li>Loading...</li>
    if (!isLoading && isError) content = <li>{error?.data}</li>
    if (!isLoading && !isError && data.length === 0) content = <li>No conversation found!!</li>
    if (!isLoading && !isError && data.length > 0) {
        content = <>
            <ChatHead
                messages={data[0]}
            />
            <Messages messages={data} />
            <Options  info={data[0]} />
        </>
    }
    return (
        <div className="w-full lg:col-span-2 lg:block">
            <div className="w-full grid conversation-row-grid">
                {content}
                {/* <Blank /> */}
            </div>
        </div>
    );
}
